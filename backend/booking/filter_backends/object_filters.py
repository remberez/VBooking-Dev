from django.db.models import Q, Prefetch
from rest_framework import filters, serializers
import django_filters
from booking.models.object import Object, Room
from booking.models.price_list import PriceListOfRoom, IndependentPriceList, BasePriceList
from common import base_position


class ObjectFilter(filters.BaseFilterBackend):

    def position_filter(self, request, queryset, view):
        if not request.user.is_authenticated or request.user.position == base_position.get_user_position():
            return queryset.filter(is_active=True, is_hidden=False,)
        if request.user.position == base_position.get_owner_position():
            return queryset.filter(Q(is_active=True, is_hidden=False) | Q(owner=request.user))
        return queryset

    def apply_date_filters(self, queryset, first_day, last_day):
        price_list_filters = BasePriceList.get_price_list_filter(first_day, last_day)
        queryset = queryset.select_related(
            'owner',
            'address',
            'type',
            'independent',
            'independent__exact_address',
            'address__city',
        ).prefetch_related(
            Prefetch('rooms', queryset=Room.objects.prefetch_related(
                Prefetch('price_list', queryset=PriceListOfRoom.objects.filter(price_list_filters)), 'tags'
            )),
            Prefetch('independent__price_list', queryset=IndependentPriceList.objects.filter(price_list_filters)),
            'independent__tags',
            'images',
            'videos',
        )
        return Object.annotate_price(Object.annotate_people(queryset), first_day, last_day)

    def list_filter(self, request, queryset, view):
        first_day = request.query_params.get('first_day')
        last_day = request.query_params.get('last_day')
        queryset = self.apply_date_filters(queryset, first_day, last_day)
        return self.position_filter(request, queryset, view)

    def filter_queryset(self, request, queryset, view):
        backend_filters = {
            'list': self.list_filter,
            'add_to_favorites': self.position_filter,
            'remove_from_favorites': self.position_filter,
            'add_images_object': self.position_filter,
            'add_videos_object': self.position_filter,
            'partial_update': self.position_filter,
            'retrieve': self.list_filter,
            'delete': self.position_filter,
        }
        return backend_filters[view.action](request, queryset, view)


class ObjectFilterSet(django_filters.FilterSet):
    first_day = django_filters.DateFilter(field_name='first_day', method='first_day_filter')
    last_day = django_filters.DateFilter(field_name='last_day', method='last_day_filter')
    city = django_filters.CharFilter(field_name='address__city', lookup_expr='name')
    price = django_filters.RangeFilter(field_name='min_price')
    sea_distance = django_filters.NumberFilter(field_name='address__sea_distance', lookup_expr='lte')
    adults = django_filters.NumberFilter(field_name='max_adults', lookup_expr='gte')
    kids = django_filters.NumberFilter(field_name='max_kids', lookup_expr='gte')
    tags = django_filters.CharFilter(field_name='tags', method='tags_filter')

    class Meta:
        model = Object
        fields = ['first_day', 'last_day', 'city', 'type']

    def tags_filter(self, queryset, name, value):
        try:
            tags = list(map(int, value.split(',')))
        except ValueError:
            raise serializers.ValidationError('Неверный массив тегов')
        for index in range(len(queryset)):
            if not set(tags).issubset(set(queryset[index].tags)):
                queryset = queryset.exclude(pk=queryset[index].pk)
        return queryset

    def filter_by_date(self, queryset, first_day=None, last_day=None):
        independent_filters, rooms_filters = Object.get_price_filter(first_day, last_day)
        return queryset.filter(rooms_filters | independent_filters).distinct()

    def first_day_filter(self, queryset, name, value):
        if not self.data.get('last_day'):
            return queryset
        return self.filter_by_date(queryset, first_day=value)

    def last_day_filter(self, queryset, name, value):
        if not self.data.get('first_day'):
            return queryset
        return self.filter_by_date(queryset, last_day=value)

    def filter_queryset(self, queryset):
        queryset = super().filter_queryset(queryset).distinct()
        return queryset
