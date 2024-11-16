from typing import List, TypeVar, Optional, Tuple
from django.db import models
from django.db.models import Q, Case, When, F, Max, Min, QuerySet
from booking.models.tags import Tag

Object_type = TypeVar('Object_type', bound='Object')


class Object(models.Model):
    name = models.CharField(
        verbose_name='Название объекта', max_length=64
    )
    owner = models.ForeignKey(
        'users.User', verbose_name='Собственник',
        related_name='user_objects', on_delete=models.CASCADE,
    )
    address = models.OneToOneField(
        'address', related_name='object_by_address',
        verbose_name='Адрес', on_delete=models.CASCADE,
    )
    is_active = models.BooleanField(
        default=False, verbose_name='Объявление активно',
    )
    view = models.PositiveIntegerField(
        default=0, verbose_name='Количество просмотров'
    )
    description = models.TextField(
        verbose_name='Описание',
    )
    number_of_flat = models.PositiveSmallIntegerField(
        verbose_name='Количество этажей',
    )
    created_at = models.DateTimeField(
        verbose_name='Дата создания', auto_now_add=True
    )
    updated_at = models.DateTimeField(
        verbose_name='Дата последнего обновления', auto_now=True
    )
    is_hidden = models.BooleanField(
        verbose_name='Объявление скрыто', default=False,
    )
    type = models.ForeignKey(
        'TypeOfObject', verbose_name='Тип', on_delete=models.SET_DEFAULT,
        related_name='objects_of_type', default=0,
    )
    user_favorites = models.ManyToManyField(
        'users.User', related_name='favorites_objects'
    )

    class Meta:
        verbose_name = 'Объект'
        verbose_name_plural = 'Объекты'

    def __str__(self):
        return f'{self.name}'

    def reviews(self):
        return self.reviews.all().select_related('user')

    def tags(self) -> List[Tag]:
        if not self.type.is_independent:
            tags = []
            for room in self.rooms.all():
                tags.extend(room.tags.all())
            return tags
        return list(self.independent.tags.all())

    @staticmethod
    def annotate_people(queryset: QuerySet[Object_type]) -> QuerySet[Object_type]:
        queryset = queryset.annotate(
            max_adults=Case(
                When(independent__isnull=False, then=F('independent__adult')),
                When(independent__isnull=True, then=Max('rooms__adult')),
            ),
            max_kids=Case(
                When(independent__isnull=False, then=F('independent__kid')),
                When(independent__isnull=True, then=Max('rooms__kid')),
            )
        )
        return queryset

    @staticmethod
    def get_price_filter(first_day: Optional[str], last_day: Optional[str]) -> Tuple[Q, Q]:
        def create_filters(currently_day: Optional[str], prefix: Optional[str]):
            return Q(**{f'{prefix}price_list__first_day__lte': currently_day}) & \
                   Q(**{f'{prefix}price_list__last_day__gte': currently_day})

        independent_filters = Q()
        rooms_filters = Q()

        for day in [first_day, last_day]:
            if day:
                independent_filters |= create_filters(day, 'independent__')
                rooms_filters |= create_filters(day, 'rooms__')

        return independent_filters, rooms_filters

    @staticmethod
    def annotate_price(
            queryset: QuerySet[Object_type], first_day: Optional[str], last_day: Optional[str]
    ) -> QuerySet[Object_type]:
        independent_filters = rooms_filters = None
        if first_day and last_day:
            independent_filters, rooms_filters = Object.get_price_filter(first_day, last_day)
        return queryset.annotate(
            min_price=Case(
                When(independent__isnull=False, then=Min('independent__price_list__price', filter=independent_filters)),
                When(independent__isnull=True, then=Min('rooms__price_list__price', filter=rooms_filters)),
                output_field=models.DecimalField(),
            )
        )


class BaseRoom(models.Model):
    rooms = models.PositiveSmallIntegerField(
        verbose_name='Количество комнат'
    )
    square = models.PositiveSmallIntegerField(
        verbose_name='Площадь'
    )
    adult = models.PositiveSmallIntegerField(
        verbose_name='Количество взрослых'
    )
    kid = models.PositiveSmallIntegerField(
        verbose_name='Количество детей'
    )
    sleeping_places = models.PositiveSmallIntegerField(
        verbose_name='Количество спальных мест'
    )
    created_at = models.DateTimeField(
        verbose_name='Дата создания', auto_now_add=True
    )
    updated_at = models.DateTimeField(
        verbose_name='Дата последнего обновления', auto_now=True
    )

    class Meta:
        abstract = True


class IndependentObject(BaseRoom):
    base_object = models.OneToOneField(
        'Object', verbose_name='Базовый объект',
        on_delete=models.CASCADE, related_name='independent'
    )
    exact_address = models.OneToOneField(
        'ExactAddress', verbose_name='Точный адрес',
        on_delete=models.SET_NULL, related_name='independent',
        null=True, blank=True
    )
    tags = models.ManyToManyField(
        'Tag', verbose_name='Теги', related_name='independent_objects',
    )

    class Meta:
        verbose_name = 'Самостоятельный объект'
        verbose_name_plural = 'Самостоятельные объекты'

    def __str__(self):
        return f'Самостоятельный объект {self.base_object}'


class Room(BaseRoom):
    base_object = models.ForeignKey(
        'Object', verbose_name='Базовый объект',
        on_delete=models.CASCADE, related_name='rooms'
    )
    is_hidden = models.BooleanField(
        verbose_name='Номер скрыт', default=False,
    )
    tags = models.ManyToManyField(
        'Tag', verbose_name='Теги', related_name='rooms',
    )

    class Meta:
        verbose_name = 'Номер'
        verbose_name_plural = 'Номера'

    def __str__(self):
        return f'Номер {self.id} объекта {self.base_object}'


class TypeOfObject(models.Model):
    name = models.CharField(
        verbose_name='Название', max_length=25,
    )
    is_independent = models.BooleanField(
        verbose_name='Объект независимый'
    )

    class Meta:
        verbose_name = 'Тип объекта'
        verbose_name_plural = 'Типы объекта'

    def __str__(self):
        return f'{self.name} {self.is_independent}'
