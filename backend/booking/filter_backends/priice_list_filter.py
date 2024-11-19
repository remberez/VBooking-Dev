from rest_framework import filters


class PriceListFilter(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        return super().filter_queryset(request, queryset, view)
