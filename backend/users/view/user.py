import secrets
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from common.mixins.view_mixins import CRUDViewSet
from users.filters_backend.travelers import TravelersFilter
from users.filters_backend.users import UserFilter
from users.models.email_activate import EmailActivate
from users.serializers import user as user_serializers
from rest_framework import permissions, status
from common import permisions as custom_permissions
from common.pagination import BasePagination
from users.tasks import send_code
from booking.serializers.objects import FavoritesObjectListSerializer
from rest_framework.filters import OrderingFilter, SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from users.models.user import FellowTraveler
from users.serializers import traveler as traveler_serializers

User = get_user_model()


@extend_schema_view(
    create=extend_schema(
        summary='Регистрация',
        tags=['Пользователи'],
        description='Регистрация только для не авторизированных пользователей. '
                    '(то-есть без заголовка authentication в запросе'
    ),
    list=extend_schema(
        summary='Список пользователей',
        tags=['Пользователи'],
        description='Список пользователей, информация о пользователях короткая,'
                    'для полной информации есть другая точка. Доступна только админу.'
    ),
    retrieve=extend_schema(
        summary='Детальная информация о пользователе.',
        tags=['Пользователи'],
        description='Детальная информация о пользователе по id. Доступна только админу.'
    ),
    destroy=extend_schema(
        summary='Удаление пользователя',
        tags=['Пользователи'],
        description='Доступна только админу.'
    ),
    partial_update=extend_schema(
        summary='Обновить пользователя',
        tags=['Пользователи'],
        description='Обновлять можно почту, телефон, ФИО. Доступно владельцу аккаунта или админу'
    ),
    send_code=extend_schema(
        summary='Отправить код с подтверждением',
        tags=['Пользователи: подтверждение почты'],
    ),
    activate_email=extend_schema(
        summary='Подтвердить код',
        tags=['Пользователи: подтверждение почты']
    ),
    profile=extend_schema(
        summary='Информация о текущем пользователе (БЕЗ ID)',
        tags=['Пользователи'],
    ),
    set_image=extend_schema(
        summary='Поставить изображение в профиле',
        tags=['Пользователи']
    ),
    change_position=extend_schema(
        summary='Изменить роль пользователя',
        tags=['Администрирование'],
    ),
    get_user_favorites=extend_schema(
        summary='Получить все избранные пользователя',
        tags=['Пользователи']
    ),
    users_travelers=extend_schema(
        summary='Получить список всех пользователей с их попутчиками',
        tags=['Пользователи: попутчики']
    )
)
class UserView(CRUDViewSet):
    queryset = User.objects.all()
    multi_serializer_class = {
        'create': user_serializers.UserRegistrationSerializer,
        'list': user_serializers.UserListSerializer,
        'retrieve': user_serializers.UserDetailSerializer,
        'partial_update': user_serializers.UserUpdateSerializer,
        'activate_email': user_serializers.ActivateEmailSerializer,
        'profile': user_serializers.UserDetailSerializer,
        'set_image': user_serializers.SetImageUserSerializer,
        'change_position': user_serializers.ChangePositionSerializer,
        'users_travelers': traveler_serializers.UserTravelersSerializer,
    }
    multi_permission_classes = {
        'create': (AllowAny,),
        'list': (custom_permissions.IsAdmin,),
        'retrieve': (custom_permissions.IsAdmin,),
        'partial_update': (custom_permissions.IsOwnerOfAccount | custom_permissions.IsAdmin,),
        'destroy': (custom_permissions.IsAdmin,),
        'send_code': (permissions.IsAuthenticated,),
        'activate_email': (permissions.IsAuthenticated,),
        'set_image': (custom_permissions.IsOwnerOfAccount | custom_permissions.IsAdmin,),
        'change_position': (custom_permissions.IsAdmin,),
    }

    filter_backends = (
        OrderingFilter,
        DjangoFilterBackend,
        SearchFilter,
        UserFilter,
    )

    search_fields = ['name', 'surname', 'patronymic', 'email', 'phone']
    ordering_fields = ['name', 'surname', 'patronymic', 'date_joined']
    filterset_fields = ['position', 'mail_confirmed']
    ordering = ('id',)

    pagination_class = BasePagination

    @action(
        detail=False, methods=['get']
    )
    def send_code(self, request, *args, **kwargs):
        def generate_code():
            EmailActivate.objects.create(
                user=user,
                code=code
            )
            send_code.delay(user.email, code)

        user = request.user

        if user.mail_confirmed:
            return Response(status=status.HTTP_208_ALREADY_REPORTED)

        code = secrets.token_hex(3)
        try:
            generate_code()
        except IntegrityError as e:
            EmailActivate.objects.filter(user=user).first().delete()
            generate_code()
        return Response(status=status.HTTP_200_OK)

    @action(
        detail=False, methods=['post']
    )
    def activate_email(self, request, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_200_OK)

    @action(
        detail=False, methods=['get']
    )
    def profile(self, request, *args, **kwargs):
        user = request.user
        if user.is_authenticated:
            serializer = self.get_serializer(user)
            return Response(status=status.HTTP_200_OK, data=serializer.data)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    @action(
        detail=True, methods=['post']
    )
    def set_image(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(instance=user, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_200_OK)

    @action(
        detail=True, methods=['post']
    )
    def change_position(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance=instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_200_OK)

    @action(
        detail=True, methods=['get']
    )
    def get_user_favorites(self, request, *args, **kwargs):
        user = self.get_object()
        user_objects = FavoritesObjectListSerializer(
            user.get_favorites(), many=True
        )
        return Response(status=status.HTTP_200_OK, data=user_objects.data)

    @action(
        detail=False, methods=['get']
    )
    def users_travelers(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


@extend_schema_view(
    create=extend_schema(
        summary='Создать попутчика',
        tags=['Пользователи: попутчики'],
    ),
    destroy=extend_schema(
        summary='Удаление попутчика',
        tags=['Пользователи: попутчики'],
    ),
    list=extend_schema(
        summary='Список попутчиков пользователя',
        tags=['Пользователи: попутчики'],
    ),
    retrieve=extend_schema(
        summary='Попутчик детально',
        tags=['Пользователи: попутчики'],
    ),
    partial_update=extend_schema(
        summary='Обновить попутчика',
        tags=['Пользователи: попутчики'],
    )
)
class TravelerView(CRUDViewSet):
    queryset = FellowTraveler.objects.all()
    pagination_class = BasePagination

    multi_serializer_class = {
        'create': traveler_serializers.TravelerCreateSerializer,
        'list': traveler_serializers.TravelerListSerializer,
        'retrieve': traveler_serializers.TravelerDetailSerializer,
        'partial_update': traveler_serializers.TravelerUpdateSerializer
    }

    multi_permission_classes = {
        'create': (permissions.IsAuthenticated,),
        'destroy': (permissions.IsAuthenticated,),
        'list': (custom_permissions.IsAdmin,),
        'retrieve': (permissions.IsAuthenticated,),
        'partial_update': (permissions.IsAuthenticated,),
    }

    filter_backends = (
        OrderingFilter,
        DjangoFilterBackend,
        TravelersFilter,
    )

    ordering = ('id',)

    def perform_destroy(self, instance):
        if instance.user == self.request.user:
            return super().perform_destroy(instance)
        return Response(status=status.HTTP_403_FORBIDDEN)
