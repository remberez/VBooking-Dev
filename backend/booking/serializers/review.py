from rest_framework import serializers


class ReviewCreate(serializers.ModelSerializer):
    class Meta:
        fields = (
            'object',
            'review',
            'rating',
        )
