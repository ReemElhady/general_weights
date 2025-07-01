from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import TicketSerializer, TicketReadSerializer, PrintSerializer
from .models import Ticket, Ticket_Types, PrintTemplate
from django.shortcuts import get_object_or_404
from apps.vehicles.models import Vehicle, BlockedVehicle, Driver
from apps.company.models import SystemSettings, EmailSettings
from apps.company.serializers import SystemSettingsSerializer
from django.core.mail import EmailMessage
from decimal import Decimal
from django.core.exceptions import ObjectDoesNotExist
import config.settings as setting
from rest_framework.permissions import IsAdminUser
from apps.utils.api_filters import (
    apply_search_order_pagination,
    apply_date_range_filter,
)
from django.utils.timezone import now, timedelta
from django.db.models.functions import TruncMonth, TruncWeek, TruncDay
from django.db.models import Count
from datetime import datetime, timedelta, date
import calendar
from django.contrib.contenttypes.models import ContentType
from django.http import HttpResponse
from weasyprint import HTML
from apps.utils.render_template import render_template
from rest_framework.permissions import AllowAny
from apps.utils.parse_datetime import parse_datetime_str
from datetime import datetime
# import pandas as pd
# from reportlab.pdfgen import canvas
# import io


class TicketFirstWeightAPIView(APIView):
    def post(self, request):
        forbidden_fields = [
            "second_weight",
            "second_weight_date",
            "trailer_second_weight",
        ]
        for field in forbidden_fields:
            if field in request.data:
                return Response(
                    {"error": f"{field} is not allowed during first weight entry."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        serializer = TicketSerializer(data=request.data)
        if serializer.is_valid():
            vehicle_id = request.data.get("vehicle")
            ticket_first_weight = Decimal(request.data.get("first_weight", 0))

            try:
                vehicle = Vehicle.objects.get(id=vehicle_id)
            except Vehicle.DoesNotExist:
                return Response(
                    {"error": "Vehicle not found."}, status=status.HTTP_404_NOT_FOUND
                )
            driver_id = request.data.get("driver")

            driver = None
            if driver_id:
                try:
                    driver = Driver.objects.get(id=driver_id)
                except Driver.DoesNotExist:
                    driver = None

            try:
                system_settings = SystemSettings.objects.first()
                threshold = (
                    system_settings.manipulation_threshold
                    if system_settings
                    else Decimal("0.000")
                )
            except ObjectDoesNotExist:
                threshold = Decimal("0.000")

            # If vehicle has no first_weight, set it
            if vehicle.first_weight in [None, 0, Decimal("0.000")]:
                vehicle.first_weight = ticket_first_weight
                vehicle.save()
            else:
                difference = abs(vehicle.first_weight - ticket_first_weight)
                if difference > threshold:
                    BlockedVehicle.objects.create(
                        vehicle=vehicle,
                        driver=driver,
                        manipulative_value=difference,
                        manipulative_user=request.user
                        if request.user.is_authenticated
                        else None,
                        is_blocked=True,
                        status="blocked",
                    )

                    try:
                        email_settings = EmailSettings.objects.first()
                        if email_settings:
                            subject = "🚨 Weight Manipulation Detected"
                            message = f"""
                            🚨 Vehicle Blocked for Weight Manipulation

                            Vehicle: {vehicle.plate}
                            Driver: {driver}
                            Previous Vehicle First Weight: {vehicle.first_weight}
                            New Ticket First Weight: {ticket_first_weight}
                            Difference: {difference}
                            Allowed Threshold: {threshold}

                            The vehicle has been blocked and logged for investigation.
                            """.strip()
                            email = EmailMessage(
                                subject=subject,
                                body=message,
                                from_email=setting.DEFAULT_FROM_EMAIL,
                                to=[email_settings.recipient_email],
                            )
                            email.send(fail_silently=False)
                    except Exception as e:
                        return Response(
                            {"error": f"Failed to send email notification: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        )

                    return Response(
                        {
                            "error": "Weight manipulation detected. Vehicle blocked and admin notified."
                        },
                        status=status.HTTP_403_FORBIDDEN,
                    )

            last_ticket = Ticket.objects.order_by("-ticket_number").first()
            new_ticket_number = 1 if not last_ticket else last_ticket.ticket_number + 1

            serializer.save(ticket_number=new_ticket_number)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TicketSecondWeightAPIView(APIView):
    def patch(self, request, pk):
        ticket = get_object_or_404(Ticket, pk=pk)

        if ticket.is_completed:
            return Response(
                {"error": "This ticket is already completed."},
                status=status.HTTP_400_BAD_REQUEST,
            )
            
        second_weight_date = datetime.now()
        if ticket.second_weight is not None:
            return Response(
                {"error": "Second weight already exists for this ticket."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        ticket.second_weight_date = second_weight_date

        serializer = TicketSerializer(ticket, data=request.data, partial=True)
        if serializer.is_valid():
            updated_ticket = serializer.save(is_completed=True)
            return Response(
                TicketSerializer(updated_ticket).data, status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TicketListAPIView(APIView):
    def get(self, request):
        tickets = Ticket.objects.all()

        # Filter by completion status
        is_completed = request.query_params.get("is_completed")
        if is_completed is not None:
            if is_completed.lower() == "true":
                tickets = tickets.filter(is_completed=True)
            elif is_completed.lower() == "false":
                tickets = tickets.filter(is_completed=False)

        # Inline Date Range Filter (from / to)
        from_param = request.query_params.get("from")
        to_param = request.query_params.get("to")

        if from_param:
            try:
                from_date = datetime.strptime(from_param, "%Y-%m-%d").date()
                tickets = tickets.filter(created_at__date__gte=from_date)
            except ValueError:
                pass  # Invalid date format, skip filtering

        if to_param:
            try:
                to_date = datetime.strptime(to_param, "%Y-%m-%d").date()
                tickets = tickets.filter(created_at__date__lte=to_date)
            except ValueError:
                pass  # Invalid date format, skip filtering

        # Search / Ordering / Pagination
        result = apply_search_order_pagination(
            queryset=tickets,
            request=request,
            search_fields=[
                "vehicle__plate",
                "customer__name",
                "driver__name",
                "item__name",
            ],
            ordering_fields=["id", "vehicle__plate", "created_at"],
        )

        serializer = TicketReadSerializer(result["results"], many=True)
        return Response(
            {
                "count": result["count"],
                "total_pages": result["total_pages"],
                "current_page": result["current_page"],
                "results": serializer.data,
            }
        )


class IncompleteTicketsListAPIView(APIView):
    def get(self, request):
        tickets = Ticket.objects.filter(is_completed=False)

        result = apply_search_order_pagination(
            queryset=tickets,
            request=request,
            search_fields=[
                "vehicle__plate",
                "customer__name",
                "driver__name",
                "item__name",
            ],
            ordering_fields=["id", "vehicle__plate", "created_at"],
        )

        serializer = TicketReadSerializer(result["results"], many=True)

        return Response(
            {
                "count": result["count"],
                "total_pages": result["total_pages"],
                "current_page": result["current_page"],
                "results": serializer.data,
            }
        )


class TicketRetrieveAPIView(APIView):
    def get(self, request, pk):
        ticket = get_object_or_404(Ticket, pk=pk)
        serializer = TicketReadSerializer(ticket)
        return Response(serializer.data)


class TicketDeleteAPIView(APIView):
    def get_permissions(self):
        return [IsAdminUser()]

    def delete(self, request, pk):
        ticket = get_object_or_404(Ticket, pk=pk)
        ticket.delete()
        return Response(status=status.HTTP_200_OK)


class TicketYearlyAnalyticsAPIView(APIView):
    def get(self, request):
        # Get year from query param or use current year
        year = request.query_params.get("year")
        try:
            year = int(year) if year else now().year
        except ValueError:
            return Response({"error": "Invalid year format."}, status=400)

        # Filter tickets by year
        tickets = Ticket.objects.filter(created_at__year=year)

        # Count tickets by ticket_type
        ticket_counts = tickets.values("ticket_type").annotate(
            total=Count("ticket_type")
        )
        counts = {entry["ticket_type"]: entry["total"] for entry in ticket_counts}

        # Count by completion status
        completed_count = tickets.filter(is_completed=True).count()
        not_completed_count = tickets.filter(is_completed=False).count()

        return Response(
            {
                "year": year,
                "total_tickets": tickets.count(),
                "tickets_by_type": counts,
                "completion_status": {
                    "completed": completed_count,
                    "not_completed": not_completed_count,
                },
            }
        )


class TicketSummaryAnalyticsAPIView(APIView):
    def get(self, request):
        mode = request.query_params.get("mode")  # 'weekly', 'monthly', or None
        year = request.query_params.get("year")
        month = request.query_params.get("month")

        try:
            year = int(year) if year else now().year
        except ValueError:
            return Response({"error": "Invalid year format."}, status=400)

        queryset = Ticket.objects.filter(created_at__year=year)

        if mode == "monthly":
            data = (
                queryset.annotate(month=TruncMonth("created_at"))
                .values("month")
                .annotate(count=Count("id"))
            )

            data_dict = {
                entry["month"].strftime("%Y-%m"): entry["count"] for entry in data
            }

            # Fill missing months
            result = []
            for m in range(1, 13):
                month_label = f"{year}-{m:02}"
                result.append(
                    {"month": month_label, "count": data_dict.get(month_label, 0)}
                )

        elif mode == "weekly":
            try:
                month = int(month) if month else now().month
                if not (1 <= month <= 12):
                    raise ValueError()
            except ValueError:
                return Response(
                    {"error": "Invalid month. Must be between 1 and 12."}, status=400
                )

            queryset = queryset.filter(created_at__month=month)

            data = (
                queryset.annotate(week=TruncWeek("created_at"))
                .values("week")
                .annotate(count=Count("id"))
            )

            data_dict = {
                entry["week"].strftime("%Y-%m-%d"): entry["count"] for entry in data
            }

            # Get all week start dates in the month
            first_day = date(year, month, 1)
            last_day = date(year, month, calendar.monthrange(year, month)[1])
            current = first_day - timedelta(days=first_day.weekday())
            result = []

            while current <= last_day:
                week_label = current.strftime("%Y-%m-%d")
                result.append(
                    {"week": week_label, "count": data_dict.get(week_label, 0)}
                )
                current += timedelta(weeks=1)

        else:
            today = now().date()
            last_7_days = today - timedelta(days=6)

            data = (
                queryset.filter(created_at__date__range=(last_7_days, today))
                .annotate(day=TruncDay("created_at"))
                .values("day")
                .annotate(count=Count("id"))
            )

            data_dict = {
                entry["day"].strftime("%Y-%m-%d"): entry["count"] for entry in data
            }

            result = []
            for i in range(7):
                day = last_7_days + timedelta(days=i)
                day_label = day.strftime("%Y-%m-%d")
                result.append({"day": day_label, "count": data_dict.get(day_label, 0)})

        return Response(
            {
                "year": year,
                "mode": mode or "last_7_days",
                "month": month if mode == "weekly" else None,
                "data": result,
            }
        )


class PrintTemplateView(APIView):
    def get(self, request):
        print_templates = PrintTemplate.objects.all()
        serializer = PrintSerializer(print_templates, many=True)
        return Response(serializer.data)


class PrintTemplateUpdate(APIView):
    def put(self, request, pk):
        # Get the current template to be made default
        print_template = get_object_or_404(PrintTemplate, pk=pk)

        # Disable all other templates of the same model (same content_type)
        PrintTemplate.objects.filter(content_type=print_template.content_type).exclude(
            pk=pk
        ).update(is_default=False)

        # Set current one as default if not already
        if not print_template.is_default:
            print_template.is_default = True
            print_template.save()

        serializer = PrintSerializer(print_template)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TicketPrintPDFView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, ticket_id):
        template_id = request.GET.get("template_id")

        # Get the ticket
        ticket = get_object_or_404(Ticket, pk=ticket_id)

        # Get the template: specific one or fallback to default
        if template_id:
            template = get_object_or_404(PrintTemplate, pk=template_id)
        else:
            ct = ContentType.objects.get_for_model(Ticket)
            template = get_object_or_404(
                PrintTemplate, content_type=ct, is_default=True
            )

        systemsettings = SystemSettings.objects.all()
        serializer = SystemSettingsSerializer(systemsettings, many=True)

        logo = serializer.data[0]["company_logo"]
        absolute_logo_url = request.build_absolute_uri(logo)

        first_date, first_time = parse_datetime_str(ticket.first_weight_date)
        second_date, second_time = parse_datetime_str(ticket.second_weight_date)

        TYPE_LABELS = {
            "IN": "مبيعات",
            "OUT": "تفريغ",
        }

        ticket_type_ar = TYPE_LABELS.get(ticket.ticket_type, ticket.ticket_type)

        # Render HTML from template
        html = render_template(
            template.template_code,
            {
                "object": ticket,
                "company_name": serializer.data[0]["company_name"],
                "logo": absolute_logo_url,
                "ticket_type_ar": ticket_type_ar,
                "first_date": first_date,
                "first_time": first_time,
                "second_date": second_date,
                "second_time": second_time,
            },
        )
        # Generate PDF from HTML
        pdf_file = HTML(string=html).write_pdf()

        # Return as PDF response
        response = HttpResponse(pdf_file, content_type="application/pdf")
        response["Content-Disposition"] = f'filename="ticket_{ticket_id}.pdf"'
        return response


# class TicketExportExcelAPIView(APIView):
#     def get(self, request, id):
#         try:
#             ticket = Ticket.objects.get(pk=id)
#         except Ticket.DoesNotExist:
#             return Response({"error": "Ticket not found"}, status=404)

#         data = [
#             {
#                 "Ticket ID": ticket.id,
#                 "Ticket Number": ticket.ticket_number,
#                 "Ticket Type": dict(Ticket_Types).get(ticket.ticket_type, ""),
#                 "Vehicle": ticket.vehicle.plate if ticket.vehicle else "",
#                 "Trailer Plate": ticket.trailer_plate_number or "",
#                 "Driver": ticket.driver.name if ticket.driver else "",
#                 "Customer": ticket.customer.name if ticket.customer else "",
#                 "Item": ticket.item.name if ticket.item else "",
#                 "Farm": ticket.farm or "",
#                 "Boxes Number": ticket.boxes_number or "",
#                 "Birds Number": ticket.birds_number or "",
#                 "Gas Ratio": ticket.gas_ratio or "",
#                 "First Weight": ticket.first_weight,
#                 "First Weight Date": ticket.first_weight_date,
#                 "Trailer First Weight": ticket.trailer_first_weight,
#                 "Second Weight": ticket.second_weight,
#                 "Second Weight Date": ticket.second_weight_date,
#                 "Trailer Second Weight": ticket.trailer_second_weight,
#                 "Net Weight": ticket.net_weight,
#                 "Is Completed": "Yes" if ticket.is_completed else "No",
#                 "Notes": ticket.notes or "",
#                 "Created At": ticket.created_at.strftime("%Y-%m-%d %H:%M:%S"),
#             }
#         ]

#         df = pd.DataFrame(data)

#         buffer = io.BytesIO()
#         with pd.ExcelWriter(buffer, engine="xlsxwriter") as writer:
#             df.to_excel(writer, index=False, sheet_name="Ticket Details")

#         buffer.seek(0)
#         response = HttpResponse(
#             buffer,
#             content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
#         )
#         response["Content-Disposition"] = (
#             f"attachment; filename=ticket_{ticket.id}.xlsx"
#         )
#         return response


# class ExportTicketPDFView(APIView):
#     def get(self, request, pk):
#         try:
#             ticket = Ticket.objects.get(pk=pk)
#         except Ticket.DoesNotExist:
#             return Response({"error": "Ticket not found"}, status=404)

#         buffer = io.BytesIO()
#         p = canvas.Canvas(buffer)

#         y = 800
#         line_height = 20

#         p.drawString(100, y, f"Ticket ID: {ticket.id}")
#         y -= line_height
#         p.drawString(100, y, f"Ticket Number: {ticket.ticket_number}")
#         y -= line_height
#         p.drawString(
#             100, y, f"Ticket Type: {dict(Ticket_Types).get(ticket.ticket_type, '')}"
#         )
#         y -= line_height
#         p.drawString(
#             100, y, f"Vehicle: {ticket.vehicle.plate if ticket.vehicle else ''}"
#         )
#         y -= line_height
#         p.drawString(100, y, f"Trailer Plate: {ticket.trailer_plate_number or ''}")
#         y -= line_height
#         p.drawString(100, y, f"Driver: {ticket.driver.name if ticket.driver else ''}")
#         y -= line_height
#         p.drawString(
#             100, y, f"Customer: {ticket.customer.name if ticket.customer else ''}"
#         )
#         y -= line_height
#         p.drawString(100, y, f"Item: {ticket.item.name if ticket.item else ''}")
#         y -= line_height
#         p.drawString(100, y, f"Farm: {ticket.farm or ''}")
#         y -= line_height
#         p.drawString(100, y, f"Boxes Number: {ticket.boxes_number or ''}")
#         y -= line_height
#         p.drawString(100, y, f"Birds Number: {ticket.birds_number or ''}")
#         y -= line_height
#         p.drawString(100, y, f"Gas Ratio: {ticket.gas_ratio or ''}")
#         y -= line_height
#         p.drawString(100, y, f"First Weight: {ticket.first_weight or ''}")
#         y -= line_height
#         p.drawString(100, y, f"First Weight Date: {ticket.first_weight_date or ''}")
#         y -= line_height
#         p.drawString(
#             100, y, f"Trailer First Weight: {ticket.trailer_first_weight or ''}"
#         )
#         y -= line_height
#         p.drawString(100, y, f"Second Weight: {ticket.second_weight or ''}")
#         y -= line_height
#         p.drawString(100, y, f"Second Weight Date: {ticket.second_weight_date or ''}")
#         y -= line_height
#         p.drawString(
#             100, y, f"Trailer Second Weight: {ticket.trailer_second_weight or ''}"
#         )
#         y -= line_height
#         p.drawString(100, y, f"Net Weight: {ticket.net_weight or ''}")
#         y -= line_height
#         p.drawString(
#             100, y, f"Status: {'Completed' if ticket.is_completed else 'Incomplete'}"
#         )
#         y -= line_height
#         p.drawString(100, y, f"Notes: {ticket.notes or ''}")
#         y -= line_height
#         p.drawString(
#             100, y, f"Created At: {ticket.created_at.strftime('%Y-%m-%d %H:%M:%S')}"
#         )
#         y -= line_height

#         p.showPage()
#         p.save()
#         buffer.seek(0)

#         response = HttpResponse(buffer, content_type="application/pdf")
#         response["Content-Disposition"] = f"attachment; filename=ticket_{ticket.id}.pdf"
#         return response


# class ExportFilteredTicketsExcelAPIView(APIView):
#     def get(self, request):
#         tickets = Ticket.objects.all()

#         # Ignore pagination fields (page, page_size)
#         query_params = request.query_params.copy()
#         query_params.pop("page", None)
#         query_params.pop("page_size", None)

#         # Apply filters
#         is_completed = query_params.get("is_completed")
#         if is_completed is not None and is_completed != "":
#             tickets = tickets.filter(is_completed=(is_completed.lower() == "true"))

#         search = query_params.get("search")
#         if search:
#             tickets = tickets.filter(vehicle__plate__icontains=search)

#         from_date = query_params.get("from")
#         to_date = query_params.get("to")
#         if from_date:
#             tickets = tickets.filter(created_at__date__gte=from_date)
#         if to_date:
#             tickets = tickets.filter(created_at__date__lte=to_date)

#         ordering = query_params.get("ordering", "-id")
#         tickets = tickets.order_by(ordering)

#         # Prepare Excel data
#         data = []
#         for ticket in tickets:
#             data.append(
#                 {
#                     "Ticket ID": ticket.id,
#                     "Ticket Number": ticket.ticket_number,
#                     "Ticket Type": dict(Ticket_Types).get(ticket.ticket_type, ""),
#                     "Vehicle": ticket.vehicle.plate if ticket.vehicle else "",
#                     "Driver": ticket.driver.name if ticket.driver else "",
#                     "Customer": ticket.customer.name if ticket.customer else "",
#                     "Item": ticket.item.name if ticket.item else "",
#                     "First Weight": ticket.first_weight,
#                     "Second Weight": ticket.second_weight,
#                     "Net Weight": ticket.net_weight,
#                     "Status": "Completed" if ticket.is_completed else "Incomplete",
#                     "Created At": ticket.created_at.strftime("%Y-%m-%d %H:%M:%S"),
#                 }
#             )

#         df = pd.DataFrame(data)
#         buffer = io.BytesIO()
#         with pd.ExcelWriter(buffer, engine="xlsxwriter") as writer:
#             df.to_excel(writer, index=False, sheet_name="Tickets")

#         buffer.seek(0)
#         response = HttpResponse(
#             buffer,
#             content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
#         )
#         response["Content-Disposition"] = 'attachment; filename="filtered_tickets.xlsx"'
#         return response


# class ExportFilteredTicketsPDFAPIView(APIView):
#     def get(self, request):
#         tickets = Ticket.objects.all()

#         # Ignore pagination fields (page, page_size)
#         query_params = request.query_params.copy()
#         query_params.pop("page", None)
#         query_params.pop("page_size", None)

#         # Apply filters
#         is_completed = query_params.get("is_completed")
#         if is_completed is not None and is_completed != "":
#             tickets = tickets.filter(is_completed=(is_completed.lower() == "true"))

#         search = query_params.get("search")
#         if search:
#             tickets = tickets.filter(vehicle__plate__icontains=search)

#         from_date = query_params.get("from")
#         to_date = query_params.get("to")
#         if from_date:
#             tickets = tickets.filter(created_at__date__gte=from_date)
#         if to_date:
#             tickets = tickets.filter(created_at__date__lte=to_date)

#         ordering = query_params.get("ordering", "-id")
#         tickets = tickets.order_by(ordering)

#         # Prepare PDF
#         buffer = io.BytesIO()
#         p = canvas.Canvas(buffer)

#         y = 800
#         line_height = 15

#         for ticket in tickets:
#             p.drawString(
#                 50,
#                 y,
#                 f"Ticket ID: {ticket.id} | Ticket Number: {ticket.ticket_number} | Vehicle: {ticket.vehicle.plate if ticket.vehicle else ''} | Customer: {ticket.customer.name if ticket.customer else ''} | Net Weight: {ticket.net_weight or 0}",
#             )
#             y -= line_height

#             if y < 100:
#                 p.showPage()
#                 y = 800

#         p.save()
#         buffer.seek(0)

#         response = HttpResponse(buffer, content_type="application/pdf")
#         response["Content-Disposition"] = 'attachment; filename="filtered_tickets.pdf"'
#         return response
