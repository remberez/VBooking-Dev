from django_filters.rest_framework import DjangoFilterBackend
from common.mixins.view_mixins import CRUDViewSet
from rest_framework.filters import OrderingFilter
from booking.filter_backends.priice_list_filter import PriceListFilter


class PriceListView(CRUDViewSet):
    filter_backends = (
        PriceListFilter,
        OrderingFilter,
        DjangoFilterBackend,
    )
    ordering = ('id',)