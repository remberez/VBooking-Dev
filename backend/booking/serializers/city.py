from booking.models.address import City
from rest_framework import serializers


class CityListRetrieveSerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = (
            'id',
            'name',
            'image',
        )


class CityCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = (
            'name',
            'image',
        )

    def validate(self, attrs):
        attrs['name'] = attrs['name'].capitalize()
        return attrs
