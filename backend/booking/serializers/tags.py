from rest_framework import serializers
from booking.models.tags import Tag


class TagListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag
        fields = (
            'title',
            'svg',
        )


class ExtendTagListRetrieveSerializer(serializers.ModelSerializer):
    type = serializers.CharField()

    class Meta:
        model = Tag
        fields = (
            'id',
            'title',
            'type',
            'svg',
        )


class CreateTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = (
            'title',
            'type',
            'svg',
        )

    def validate_title(self, value):
        return value.capitalize()
