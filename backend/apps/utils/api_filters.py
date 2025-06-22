from django.core.paginator import Paginator
from django.db.models import Q
import environ
from datetime import datetime
from django.utils import timezone


env = environ.Env()
environ.Env.read_env()

def apply_search_order_pagination(queryset, request, search_fields=None, ordering_fields=None):
    search_fields = search_fields or []
    ordering_fields = ordering_fields or []

    # --- Search ---
    search_query = request.GET.get('search')
    if search_query and search_fields:
        search_filter = Q()
        for field in search_fields:
            search_filter |= Q(**{f"{field}__icontains": search_query})
        queryset = queryset.filter(search_filter)

    # --- Ordering ---
    ordering = request.GET.get('ordering')  # e.g., -name, license_expiry
    if ordering:
        order_field = ordering.lstrip('-')
        if order_field in ordering_fields:
            queryset = queryset.order_by(ordering)

    # --- Pagination ---
    page = request.GET.get('page', 1)
    page_size = int(request.GET.get('page_size', env("PAGE_SIZE")))
    paginator = Paginator(queryset, page_size)
    current_page = paginator.get_page(page)

    return {
        'count': paginator.count,
        'total_pages': paginator.num_pages,
        'current_page': current_page.number,
        'results': current_page.object_list
    }


def apply_date_range_filter(queryset, request, field_name: str):
    """Applies a from/to filter on the given field from query parameters."""
    from_param = request.GET.get(f"from")
    to_param = request.GET.get(f"to")

    filter_kwargs = {}

    if from_param:
        try:
            from_date = datetime.strptime(from_param, "%Y-%m-%d").date()
            filter_kwargs[f"{field_name}__gte"] = from_date
        except ValueError:
            pass  # Invalid date format, skip filtering

    if to_param:
        try:
            to_date = datetime.strptime(to_param, "%Y-%m-%d").date()
            filter_kwargs[f"{field_name}__lte"] = to_date
        except ValueError:
            pass

    if filter_kwargs:
        return queryset.filter(**filter_kwargs)

    return queryset


def apply_field_filter(queryset, field_name: str, value):
    """
    Applies an exact-match filter on a given field with a provided value.
    Example:
        apply_field_filter(queryset, "status", "blocked")
        apply_field_filter(queryset, "vehicle__plate", "XYZ123")
    """
    if field_name and value is not None:
        filter_kwargs = {field_name: value}
        return queryset.filter(**filter_kwargs)
    return queryset


def apply_field_filter_from_request(queryset, request, param_name: str, field_name: str = None):
    """
    Filters the queryset using the value of a query param.
    - param_name: The name of the query param to look for (e.g., "status")
    - field_name: The model field to filter on (e.g., "ticket_status" or "vehicle__plate")
    """
    value = request.GET.get(param_name)
    if value and field_name:
        return apply_field_filter(queryset, field_name, value)
    return queryset

