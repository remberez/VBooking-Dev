from rest_framework import serializers

from users.models.user import Citizenship


class CitizenshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Citizenship
        fields = (
            'id',
            'name',
        )