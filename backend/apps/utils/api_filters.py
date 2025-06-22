from django.core.paginator import Paginator
from django.db.models import Q
import environ

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
