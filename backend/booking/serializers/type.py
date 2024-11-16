from rest_framework import serializers
from booking.models.object import TypeOfObject


class ListRetrieveTypeOfObjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeOfObject
        fields = (
            'id',
            'name',
            'is_independent',
        )


class TypeOfObjectSerializerMixin:
    def validate_name(self, value):
        return value.capitalize()


class CreateTypeOfObjectSerializer(TypeOfObjectSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = TypeOfObject
        fields = (
            'name',
            'is_independent',
        )


class UpdateTypeOfObjectSerializer(TypeOfObjectSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = TypeOfObject
        fields = (
            'name',
            'is_independent',
        )
