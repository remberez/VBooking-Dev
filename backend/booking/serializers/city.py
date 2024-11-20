from booking.models.address import City
from rest_framework import serializers


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = (
            'id',
            'name',
            'image',
        )
        read_only_fields = ('id',)

    def validate(self, attrs):
        attrs['name'] = attrs['name'].capitalize()
        return attrs
