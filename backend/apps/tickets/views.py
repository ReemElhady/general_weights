from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Ticket
from .serializers import TicketSerializer
from django.shortcuts import get_object_or_404
from apps.vehicles.models import Vehicle, BlockedVehicle
from apps.company.models import SystemSettings, EmailSettings
from django.core.mail import EmailMessage
from decimal import Decimal
from django.core.exceptions import ObjectDoesNotExist
import config.settings as setting


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
                        driver=vehicle.driver,
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
                            Driver: {vehicle.driver}
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
        if ticket.second_weight is not None:
            return Response(
                {"error": "Second weight already exists for this ticket."},
                status=status.HTTP_400_BAD_REQUEST,
            )

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
        serializer = TicketSerializer(tickets, many=True)
        return Response(serializer.data)


class IncompleteTicketsListAPIView(APIView):
    def get(self, request):
        tickets = Ticket.objects.filter(is_completed=False)
        serializer = TicketSerializer(tickets, many=True)
        return Response(serializer.data)


class TicketRetrieveAPIView(APIView):
    def get(self, request, pk):
        ticket = get_object_or_404(Ticket, pk=pk)
        serializer = TicketSerializer(ticket)
        return Response(serializer.data)


class TicketDeleteAPIView(APIView):
    def delete(self, request, pk):
        ticket = get_object_or_404(Ticket, pk=pk)
        ticket.delete()
        return Response(status=status.HTTP_200_OK)
