from rest_framework import serializers
from booking.models.object import TypeOfObject


class TypeOfObjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeOfObject
        fields = (
            'id',
            'name',
            'is_independent',
        )
        read_only_fields = ('id',)

    def validate_name(self, value):
        return value.capitalize()
