from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework.permissions import AllowAny
from common import permisions as custom_permissions
from common.mixins.view_mixins import CRUDViewSet
from booking.models.object import TypeOfObject
from booking.serializers import type
from common.pagination import BasePagination
from rest_framework.filters import OrderingFilter


@extend_schema_view(
    create=extend_schema(
        summary='Создание типа',
        tags=['Типы объектов'],
    ),
    retrieve=extend_schema(
        summary='Тип детально',
        tags=['Типы объектов'],
    ),
    list=extend_schema(
        summary='Список типов',
        tags=['Типы объектов'],
    ),
    destroy=extend_schema(
        summary='Удалить тип',
        tags=['Типы объектов'],
    ),
    partial_update=extend_schema(
        summary='Обновить тип',
        tags=['Типы объектов'],
    ),
)
class TypeOfObjectView(CRUDViewSet):
    queryset = TypeOfObject.objects.all()
    multi_permission_classes = {
        'create': (custom_permissions.IsAdmin,),
        'delete': (custom_permissions.IsAdmin,),
        'partial_update': (custom_permissions.IsAdmin,),
        'list': (AllowAny,),
        'retrieve': (AllowAny,),
    }
    multi_serializer_class = {
        'list': type.ListRetrieveTypeOfObjectSerializer,
        'retrieve': type.ListRetrieveTypeOfObjectSerializer,
        'create': type.CreateTypeOfObjectSerializer,
        'partial_update': type.UpdateTypeOfObjectSerializer,
    }
    pagination_class = BasePagination
    filter_backends = (
        OrderingFilter,
    )
    ordering = ('id',)
