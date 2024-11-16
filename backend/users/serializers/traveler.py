from django.contrib.auth import get_user_model
from rest_framework import serializers
from users.models.user import FellowTraveler
from users.serializers.citizenship import CitizenshipSerializer

User = get_user_model()


class TravelerDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = FellowTraveler
        fields = (
            'id',
            'name',
            'surname',
            'patronymic',
            'date_of_birth',
            'citizenship',
            'sex',
        )


class TravelerCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FellowTraveler
        fields = (
            'surname',
            'name',
            'patronymic',
            'citizenship',
            'sex',
            'date_of_birth',
        )

    def validate_name(self, value: str) -> str:
        return value.capitalize()

    def validate_surname(self, value: str) -> str:
        return value.capitalize()

    def validate_patronymic(self, value: str) -> str:
        return value.capitalize()
    
    def create(self, validated_data):
        request = self.context.get('request')
        return super().create({**validated_data, 'user': request.user})


class TravelerListSerializer(serializers.ModelSerializer):
    citizenship = CitizenshipSerializer()

    class Meta:
        model = FellowTraveler
        fields = (
            'id',
            'surname',
            'name',
            'patronymic',
            'citizenship',
            'sex',
            'date_of_birth',
        )


class UserTravelersSerializer(serializers.ModelSerializer):
    fellow_travelers = TravelerListSerializer(many=True)

    class Meta:
        model = User
        fields = (
            'id',
            'surname',
            'name',
            'fellow_travelers',
        )


class TravelerUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FellowTraveler
        fields = (
            'name',
            'surname',
            'patronymic',
            'date_of_birth',
            'citizenship',
            'sex',
        )
