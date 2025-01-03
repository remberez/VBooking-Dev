import time

from django.db import IntegrityError
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from common.mixins.view_mixins import CRUDViewSet
from common.pagination import BasePagination
from booking.serializers import objects as object_serializers
from common import permisions as custom_permissions
from booking.models.object import Object, Favorite
from booking.serializers import media as media_serializers
from booking.filter_backends.object_filters import ObjectFilterSet, ObjectFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from django.db.models import OuterRef, Subquery

@extend_schema_view(
    create=extend_schema(
        summary='Создание объекта',
        tags=['Объекты'],
    ),
    list=extend_schema(
        summary='Список объектов',
        tags=['Объекты'],
    ),
    retrieve=extend_schema(
        summary='Детальная информация об объекте.',
        tags=['Объекты'],
    ),
    destroy=extend_schema(
        summary='Удаление объекта',
        tags=['Объекты'],
    ),
    partial_update=extend_schema(
        summary='Обновить объект',
        tags=['Объекты'],
    ),
    add_images_object=extend_schema(
        summary='Добавить изображения к объекту',
        tags=['Объекты'],
    ),
    add_videos_object=extend_schema(
        summary='Добавить ссылки на видео к объекту',
        tags=['Объекты'],
    ),
    add_to_favorites=extend_schema(
        summary='Добавить объект в избранное',
        tags=['Объекты', 'Пользователи']
    ),
    remove_from_favorites=extend_schema(
        summary='Удалить из избранного',
        tags=['Объекты', 'Пользователи']
    ),
    make_object_active=extend_schema(
        summary="Сделать объект активным",
        tags=["Администрирование"],
    ),
    make_object_inactive=extend_schema(
        summary="Сделать объект неактивным",
        tags=["Администрирование"],
    ),
    get_my_favorites=extend_schema(
        summary="Получить избранные пользователя",
        tags=["Объекты"],
    )
)
class ObjectView(CRUDViewSet):
    multi_serializer_class = {
        'create': object_serializers.ObjectCreateSerializer,
        'add_images_object': media_serializers.ObjectImageSerializer,
        'add_videos_object': media_serializers.ObjectVideoSerializer,
        'partial_update': object_serializers.ObjectSerializerUpdate,
        'list': object_serializers.ObjectListSerializer,
        'retrieve': object_serializers.ObjectDetailSerializer,
    }
    multi_permission_classes = {
        'create': (custom_permissions.IsOwnerPosition | custom_permissions.IsAdmin, custom_permissions.EmailIsActivate),
        'partial_update': (custom_permissions.IsOwnerOfObject | custom_permissions.IsAdmin, custom_permissions.EmailIsActivate),
        'add_images_object': (custom_permissions.IsOwnerOfObject, custom_permissions.EmailIsActivate),
        'add_videos_object': (custom_permissions.IsOwnerOfObject, custom_permissions.EmailIsActivate),
        'list': (AllowAny,),
        'retrieve': (AllowAny,),
        'delete': (custom_permissions.IsOwnerOfObject | custom_permissions.IsAdmin, custom_permissions.EmailIsActivate),
        'make_object_active': (custom_permissions.IsAdmin,),
        'make_object_inactive': (custom_permissions.IsAdmin,),
    }
    queryset = Object.objects.all()

    filter_backends = (
        ObjectFilter,
        OrderingFilter,
        DjangoFilterBackend,
    )

    filterset_class = ObjectFilterSet
    ordering = ('-id',)
    ordering_fields = ('min_price',)

    pagination_class = BasePagination

    def add_media(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(data=request.data, context={'object_instance': instance})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_201_CREATED)

    @action(
        detail=True, methods=['post']
    )
    def add_images_object(self, request, *args, **kwargs):
        return self.add_media(request, args, kwargs)

    @action(
        detail=True, methods=['post']
    )
    def add_videos_object(self, request, *args, **kwargs):
        return self.add_media(request, args, kwargs)

    @action(
        detail=True, methods=['get']
    )
    def make_object_active(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = True
        instance.save()
        return Response(status=status.HTTP_200_OK)

    @action(
        detail=True, methods=['get']
    )
    def make_object_inactive(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response(status=status.HTTP_200_OK)
    

class FavoriteViewSet(viewsets.ModelViewSet):
    queryset = Favorite.objects.all()
    serializer_class = object_serializers.FavoriteSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post", "delete"]

    def get_queryset(self):
        favorites_qs = Favorite.objects.filter(user=self.request.user)

        return Object.objects.filter(
            id__in=self.queryset.values_list("object__id", flat=True)
        ).annotate(
            first_day=Subquery(favorites_qs.filter(object=OuterRef('id')).values_list('date_start', flat=True)),
            last_day=Subquery(favorites_qs.filter(object=OuterRef('id')).values_list('date_end', flat=True))
        )

    def list(self, request, *args, **kwargs):
        queryset = Object.annotate_price_individually(self.get_queryset())
        serializer = object_serializers.ObjectListSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        print(request.data)

        try:
            serializer.save(user=request.user)
        except IntegrityError:
            return Response(status=status.HTTP_208_ALREADY_REPORTED)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def destroy(self, request, *args, **kwargs):
        favorite = Favorite.objects.filter(
            user=request.user,
            object=kwargs["pk"]
        ).first()
        favorite.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
