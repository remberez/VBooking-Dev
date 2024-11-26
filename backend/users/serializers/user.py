from typing import List, Dict
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework import exceptions
import re
from django.core import exceptions as django_exceptions
from rest_framework.exceptions import ParseError, ValidationError
from common.base_position import *
from users.models.email_activate import EmailActivate
from .citizenship import CitizenshipSerializer
from users.serializers.traveler import TravelerSerializer
from users.serializers.common import FullNameCapitalizeMixin

User = get_user_model()


class ValidatePasswordMixin:
    def validate_password(self, value: str) -> str:
        try:
            validate_password(value)
        except django_exceptions.ValidationError as e:
            error_list = []
            for error in e.error_list:
                error_message = error.message

                if hasattr(error, 'params') and error.params:
                    error_message = error_message % error.params
                error_list.append(error_message)

            raise ValidationError(error_list)
        return value


class UserSerializer(ValidatePasswordMixin, FullNameCapitalizeMixin, serializers.ModelSerializer):
    citizenship_read = CitizenshipSerializer(source='citizenship', read_only=True)
    fellow_travelers = TravelerSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'phone',
            'position',
            'surname',
            'name',
            'patronymic',
            'image',
            'date_joined',
            'citizenship',
            'citizenship_read',
            'sex',
            'date_of_birth',
            'mail_confirmed',
            'password',
            'fellow_travelers',
        )
        read_only_fields = ('id', 'date_joined', 'mail_confirmed', 'fellow_travelers')
        extra_kwargs = {
            'password': {'write_only': True},
            'citizenship': {'write_only': True}
        }
        optional_fields = ('email', 'phone', 'sex', 'date_of_birth', 'citizenship', 'patronymic', 'image')

    def to_capitalize(self, attrs: Dict, fields: List[str]) -> Dict:
        for key, value in attrs.items():
            if key in fields:
                attrs[key] = value.capitalize()
        return attrs

    def validate_email(self, value: str) -> str:
        if len(value.split('@')) != 2:
            raise exceptions.ParseError('Неверный формат почты.')
        if value in User.objects.values_list('email', flat=True):
            raise exceptions.ValidationError('Почта уже зарегистрирована.')
        return value

    def validate_phone(self, value: str) -> str:
        if not re.match(r'^\+?1?\d{9,15}$', value):
            raise exceptions.ParseError(
                {'phone': 'Неправильный номер телефона. Он должен содержать от 9 до 15 цифр, начиная с кода страны.'}
            )
        if value in User.objects.values_list('phone', flat=True):
            raise exceptions.ValidationError('Телефон уже зарегистрирован.')
        return value

    def validate_position(self, value: str) -> str:
        user = self.context.get('request').user
        if value not in (get_owner_position(), get_user_position()) and user.position.code != get_admin_position():
            raise ValidationError('Неверная роль.')

        if self.instance == user and value == get_admin_position():
            raise ValidationError('Нельзя снять себя с роли администратора.')

        return value

    def validate(self, attrs: Dict):
        return self.to_capitalize(attrs, ['surname', 'name', 'patronymic'])

    def create(self, validated_data: Dict) -> User:
        return User.objects.create_user(**validated_data)

    def update(self, instance: User, validated_data: Dict) -> User:
        validated_data.pop('password', None)

        if validated_data.get('email'):
            instance.mail_confirmed = False
            instance.save()
        return super().update(instance, validated_data)


class ActivateEmailSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=6)

    def validate(self, attrs: Dict) -> Dict:
        user_code = attrs['code']
        user = self.context.get('request').user
        backend_code = EmailActivate.objects.filter(user=user).first()
        if backend_code and user_code == backend_code.code:
            return attrs
        raise ParseError('Неверный код')


class ChangePasswordSerializer(ValidatePasswordMixin, serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    old_password2 = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    def password_validate(self, old_password: str, old_password2: str) -> None:
        if old_password != old_password2:
            raise exceptions.ValidationError('Пароли не совпадают')

        if not self.context.get('user').check_password(old_password):
            raise ValidationError('Текущий пароль неверен')

    def validate(self, attrs: Dict) -> Dict:
        self.password_validate(attrs.get('old_password'), attrs.get('old_password2'))
        return attrs
