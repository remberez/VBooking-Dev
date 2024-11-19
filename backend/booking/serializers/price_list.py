from rest_framework import serializers
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


class PriceListSerializer(serializers.Serializer):
    first_day = serializers.DateField()
    last_day = serializers.DateField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    object = serializers.PrimaryKeyRelatedField(queryset=Object.objects.all())
    room = serializers.PrimaryKeyRelatedField(queryset=Room.objects.all(), required=False)
