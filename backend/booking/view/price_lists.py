from typing import Union, Tuple, Optional
from django.core.exceptions import ValidationError
from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework import status
from rest_framework.response import Response
from django.db.models import ObjectDoesNotExist
from booking.models.object import Object
from booking.serializers.price_list import PriceListSerializer, DateSerializer
from booking.models.price_list import BasePriceList, PriceListOfRoom, IndependentPriceList
from rest_framework.permissions import IsAuthenticated
from common.base_position import get_admin_position
from common.permisions import IsOwnerOfObjectByPriceList, IsAdmin
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied


class PriceListMixin:
    permission_classes = (IsAuthenticated, IsOwnerOfObjectByPriceList | IsAdmin)

    def check_object_permissions(self, obj):
        if obj.owner != self.request.user and self.request.user.position.code != get_admin_position():
            raise PermissionDenied(detail='Вы не являетесь владельцем объекта или администратором')

    def __get_price_list(
            self, object_pk: int, price_list_pk: int
    ) -> Tuple[Union[PriceListOfRoom, IndependentPriceList], Object]:

        object = Object.objects.get(pk=object_pk)

        if object.is_independent:
            price = object.price_list.get(pk=price_list_pk)
        else:
            price = PriceListOfRoom.objects.get(
                pk=price_list_pk, object__id=object_pk
            )
        return price, object

    def get_price_list(
            self, object_pk: int, price_list_pk: int
    ) -> Tuple[Optional[Response], Optional[Union[PriceListOfRoom, IndependentPriceList]], Optional[Object]]:

        try:
            price, obj = self.__get_price_list(object_pk, price_list_pk)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND, data=['Объект или прайс-лист не найден']), None, None

        return None, price, obj


@extend_schema_view(
    post=extend_schema(
        request=PriceListSerializer,
        responses={201: PriceListSerializer},
        summary='Добавить прайс',
        tags=['Прайс листы'],
    )
)
class PriceListCreateAPIView(PriceListMixin, APIView):
    serializer = PriceListSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        obj = serializer.validated_data.get('object')
        first_day, last_day = serializer.validated_data.get('first_day'), serializer.validated_data.get('last_day')

        if obj.owner != request.user and request.user.position.code != get_admin_position():
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
        response, price, object = self.get_price_list(object_pk, price_list_pk)

        if response:
            return response

        self.check_object_permissions(object)

        serializer = self.serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        first_day, last_day = serializer.validated_data.get('first_day'), serializer.validated_data.get('last_day')

        try:
            object.check_price_list_date(
                first_day, last_day,
                (price.first_day, price.last_day)
            )
        except ValidationError as e:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=[e.message])

        price.first_day = first_day
        price.last_day = last_day
        price.price = serializer.validated_data.get('price')
        price.save()

        return Response(status=status.HTTP_200_OK)
