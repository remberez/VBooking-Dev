from django.core.exceptions import ValidationError
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.response import Response
from booking.models.object import IndependentObject, Object
from booking.serializers.price_list import PriceListSerializer
from common.mixins.view_mixins import CUDViewSet
from rest_framework.filters import OrderingFilter
from booking.filter_backends.priice_list_filter import PriceListFilter
from common.pagination import BasePagination
from booking.models.price_list import BasePriceList, PriceListOfRoom, IndependentPriceList


class PriceListView(CUDViewSet):
    filter_backends = (
        PriceListFilter,
        OrderingFilter,
        DjangoFilterBackend,
    )
    ordering = ('id',)
    pagination_class = BasePagination
    serializer_class = PriceListSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        obj = serializer.validated_data.get('object')
        first_day, last_day = serializer.validated_data.get('first_day'), serializer.validated_data.get('last_day')

        try:
            obj.check_price_list_date(first_day, last_day)
        except ValidationError as e:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=[e.message])

        BasePriceList.create_price_list(**serializer.validated_data)
        return Response(status=status.HTTP_201_CREATED, data=serializer.data)

    def get_queryset(self):
        object_id = self.request.query_params.get('object')
        if object_id:
            try:
                obj = IndependentObject.objects.get(id=object_id)
                if obj.type.is_independent:
                    return IndependentPriceList.objects.all()
            except IndependentObject.DoesNotExist:
                pass

        return PriceListOfRoom.objects.all()
