from django.core.exceptions import ValidationError
from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework import status
from rest_framework.response import Response
from booking.serializers.price_list import PriceListSerializer
from booking.models.price_list import BasePriceList
from rest_framework.permissions import IsAuthenticated
from common.permisions import IsOwnerOfObjectByPriceList, IsAdmin
from rest_framework.views import APIView


# @extend_schema_view(
#     create=extend_schema(
#         summary='Добавить прайс',
#         tags=['Прайс листы'],
#     )
# )
# class PriceListView(CUDViewSet):
#     filter_backends = (
#         # PriceListFilter,
#         OrderingFilter,
#         DjangoFilterBackend,
#     )
#     permission_classes = (IsAuthenticated, IsOwnerOfObjectByPriceList | IsAdmin)
#     ordering = ('id',)
#     serializer_class = PriceListSerializer
#
#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#
#         obj = serializer.validated_data.get('object')
#         first_day, last_day = serializer.validated_data.get('first_day'), serializer.validated_data.get('last_day')
#
#         if obj.owner != request.user:
#             return Response(status=status.HTTP_403_FORBIDDEN)
#
#         try:
#             obj.check_price_list_date(first_day, last_day)
#         except ValidationError as e:
#             return Response(status=status.HTTP_400_BAD_REQUEST, data=[e.message])
#
#         BasePriceList.create_price_list(**serializer.validated_data)
#         return Response(status=status.HTTP_201_CREATED, data=serializer.data)


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
        request=PriceListSerializer,
        responses={201: PriceListSerializer},
        summary='Обновить прайс лист',
        tags=['Прайс листы']
    )
)
class PriceListUpdateAPIView(PriceListMixin, APIView):

    def patch(self, request, object_pk, price_list_pk, *args, **kwargs):
        return Response(status=status.HTTP_200_OK)
