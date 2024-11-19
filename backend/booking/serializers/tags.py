from rest_framework import serializers
from booking.models.tags import Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = (
            'id',
            'title',
            'type',
            'svg',
        )
        read_only_fields = ('id',)

    def validate_title(self, value):
        return value.capitalize()

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['type'] = instance.type.name
        return representation
