from django.core.exceptions import ValidationError
from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework import status
from rest_framework.response import Response
from django.db.models import ObjectDoesNotExist
from booking.models.object import Object
from booking.serializers.price_list import PriceListSerializer, DateSerializer
from booking.models.price_list import BasePriceList, PriceListOfRoom
from rest_framework.permissions import IsAuthenticated
from common.base_position import get_admin_position
from common.permisions import IsOwnerOfObjectByPriceList, IsAdmin
from rest_framework.views import APIView


class PriceListMixin:
    permission_classes = (IsAuthenticated, IsOwnerOfObjectByPriceList | IsAdmin)
    serializer = PriceListSerializer


@extend_schema_view(
    post=extend_schema(
        request=PriceListSerializer,
        responses={201: PriceListSerializer},
        summary='Добавить прайс',
        tags=['Прайс листы'],
    )
)
class PriceListCreateAPIView(PriceListMixin, APIView):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        obj = serializer.validated_data.get('object')
        first_day, last_day = serializer.validated_data.get('first_day'), serializer.validated_data.get('last_day')

        if obj.owner != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        try:
            obj.check_price_list_date(first_day, last_day)
        except ValidationError as e:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=[e.message])

        BasePriceList.create_price_list(**serializer.validated_data)
        return Response(status=status.HTTP_201_CREATED, data=serializer.data)


@extend_schema_view(
    patch=extend_schema(
        request=DateSerializer,
        responses={201: DateSerializer},
        summary='Обновить прайс лист',
        tags=['Прайс листы']
    )
)
class PriceListUpdateAPIView(PriceListMixin, APIView):
    serializer = DateSerializer

    def patch(self, request, object_pk, price_list_pk, *args, **kwargs):
        try:
            object = Object.objects.get(pk=object_pk)
        except ObjectDoesNotExist as e:
            return Response(status=status.HTTP_404_NOT_FOUND, data=['Объект не найден'])

        if object.owner != request.user or request.user.position.code != get_admin_position():
            return Response(status=status.HTTP_403_FORBIDDEN)

        if object:
            try:
                if object.is_independent:
                    price = object.price_list.get(pk=price_list_pk)
                else:
                    price = PriceListOfRoom.objects.get(
                        pk=price_list_pk, object__id=object_pk
                    )

                serializer = self.serializer(data=request.data)
                serializer.is_valid(raise_exception=True)

                first_day, last_day = serializer.validated_data.get('first_day'), serializer.validated_data.get('last_day')

                try:
                    object.check_price_list_date(
                        first_day, last_day,
                        (price.first_day, price.last_day)
                    )
                except ValidationError as e:
                    return Response(status=status.HTTP_400_BAD_REQUEST, data=e.message)

                price.first_day = first_day
                price.last_day = last_day
                price.price = serializer.validated_data.get('price')
                price.save()

            except ObjectDoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND, data=['Прайс-лист не найден'])
            return Response(status=status.HTTP_200_OK)
