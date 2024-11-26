from django.contrib.auth import get_user_model
from rest_framework import serializers
from users.models.user import FellowTraveler
from users.serializers.citizenship import CitizenshipSerializer
from users.serializers.common import FullNameCapitalizeMixin

User = get_user_model()


class TravelerSerializer(FullNameCapitalizeMixin, serializers.ModelSerializer):
    citizenship_read = CitizenshipSerializer(read_only=True)

    class Meta:
        model = FellowTraveler
        fields = (
            'id',
            'name',
            'surname',
            'patronymic',
            'date_of_birth',
            'citizenship',
            'citizenship_read',
            'sex',
        )
        read_only_fields = ('id',)
        optional_fields = ('patronymic', 'citizenship', 'sex')

    def create(self, validated_data):
        request = self.context.get('request')
        return super().create({**validated_data, 'user': request.user})
