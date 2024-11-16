from django.db.models import QuerySet, Prefetch
from rest_framework.filters import BaseFilterBackend

from users.models.user import FellowTraveler


class UserFilter(BaseFilterBackend):
    def base_user_related(self, queryset: QuerySet) -> QuerySet:
        return queryset.select_related(
            'citizenship',
            'position',
        )

    def travelers_filter(self, queryset: QuerySet) -> QuerySet:
        return queryset.prefetch_related(
            Prefetch('fellow_travelers', queryset=FellowTraveler.objects.all().select_related('citizenship'))
        )

    def filter_queryset(self, request, queryset, view):
        filters_backend = {
            'retrieve': self.base_user_related,
            'users_travelers': self.travelers_filter
        }
        qs_filter = filters_backend.get(view.action)
        if qs_filter:
            return qs_filter(queryset)
        return queryset
