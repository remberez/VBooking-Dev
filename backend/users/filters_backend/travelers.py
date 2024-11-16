from django.db.models import QuerySet
from rest_framework import filters
from users.models.user import FellowTraveler
from common.base_position import get_admin_position


class TravelersFilter(filters.BaseFilterBackend):
    def filter_by_position(self, queryset, request) -> QuerySet:
        if request.user.position.code == get_admin_position():
            return queryset
        return FellowTraveler.filter_by_user(queryset, request.user.pk)

    def related_travelers(self, queryset: QuerySet, *args, **kwargs) -> QuerySet:
        return queryset.select_related(
            'citizenship'
        )

    def list_filter(self, queryset: QuerySet, *args, **kwargs):
        return self.filter_by_position(
            self.related_travelers(queryset, *args, **kwargs), *args, **kwargs,
        )

    def filter_queryset(self, request, queryset, view):
        backend_filters = {
            'list': self.list_filter,
            'destroy': FellowTraveler.filter_by_user,
            'partial_update': FellowTraveler.filter_by_user,
            'retrieve': self.filter_by_position,
        }
        return backend_filters[view.action](queryset, request)
