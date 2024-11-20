from rest_framework import serializers
from rest_framework.exceptions import ParseError, ValidationError

from booking.models.price_list import IndependentPriceList
from booking.models.object import Object, Room


class CurrentPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndependentPriceList
        fields = (
            'first_day',
            'last_day',
            'price',
        )


class PriceListValidationMixin:
    def date_validate(self, attrs):
        if attrs.get('first_day') > attrs.get('last_day'):
            raise ValidationError({'first_day': 'Невалидная дата'})

    def room_validate(self, attrs):
        if not attrs.get('object').type.is_independent and not attrs.get('room'):
            raise ValidationError({'room': 'Поле обязательное, если объект является независимым'})

    def validate_price(self, value):
        if value <= 0:
            raise ValidationError('Цена должна быть положительной')
        return value


class PriceListSerializer(PriceListValidationMixin, serializers.Serializer):
    first_day = serializers.DateField()
    last_day = serializers.DateField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    object = serializers.PrimaryKeyRelatedField(queryset=Object.objects.all())
    room = serializers.PrimaryKeyRelatedField(queryset=Room.objects.all(), required=False)

    def validate(self, attrs):
        self.date_validate(attrs)
        self.room_validate(attrs)
        return attrs


class DateSerializer(PriceListValidationMixin, serializers.Serializer):
    first_day = serializers.DateField()
    last_day = serializers.DateField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)

    def validate(self, attrs):
        self.date_validate(attrs)
        return attrs
