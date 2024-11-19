from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework.permissions import AllowAny
from booking.serializers.tags import TagSerializer
from common.mixins.view_mixins import CRUDViewSet
from common.pagination import BasePagination
from rest_framework.filters import OrderingFilter
from booking.models.tags import Tag
from common import permisions as custom_permissions


@extend_schema_view(
    list=extend_schema(
        summary='Список тегов',
        tags=['Теги'],
    ),
    retrieve=extend_schema(
        summary='Тег детально',
        tags=['Теги'],
    ),
    destroy=extend_schema(
        summary='Удалить тег',
        tags=['Теги'],
    ),
    partial_update=extend_schema(
        summary='Обновить тег',
        tags=['Теги'],
    ),
    create=extend_schema(
        summary='Создать тег',
        tags=['Теги'],
    )
)
class TagView(CRUDViewSet):
    serializer_class = TagSerializer
    multi_permission_classes = {
        'list': (AllowAny,),
        'retrieve': (AllowAny,),
        'create': (custom_permissions.IsAdmin,),
        'partial_update': (custom_permissions.IsAdmin,),
        'destroy': (custom_permissions.IsAdmin,),
    }

    queryset = Tag.objects.all()
    filter_backends = (
        OrderingFilter,
    )
    ordering = ('pk',)
    pagination_class = BasePagination
