import pdb

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework import exceptions
import re
from django.core import exceptions as django_exceptions
from rest_framework.exceptions import ParseError
from common.mixins.serializer_mixins import CommonMixin
from common.base_position import *
from users.models.email_activate import EmailActivate
from .citizenship import CitizenshipSerializer

User = get_user_model()


class UserValidation(CommonMixin):
    @staticmethod
    def position_validate(position):
        if position.code in (get_user_position(), get_owner_position()):
            return position
        raise ParseError('Неверная должность')

    @staticmethod
    def email_validate(email):
        if len(email.split('@')) != 2:
            raise exceptions.ParseError('Неверный формат почты.')
        if email in User.objects.values_list('email', flat=True):
            raise exceptions.ParseError('Почта уже зарегистрирована.')

    @staticmethod
    def phone_validate(phone):
        if not re.match(r'^\+?1?\d{9,15}$', phone):
            raise exceptions.ParseError(
                "Неправильный номер телефона. Он должен содержать от 9 до 15 цифр, начиная с кода страны."
            )
        if phone in User.objects.values_list('phone', flat=True):
            raise exceptions.ParseError('Телефон уже зарегистрирован.')

    def validate(self, attrs):
        errors = {}
        attrs = self.to_capitalize(attrs, ['surname', 'name', 'patronymic'])
        try:
            value = attrs.get('email')
            if value:
                self.email_validate(value)
        except exceptions.ParseError as e:
            errors['email'] = str(e)
        try:
            value = attrs.get('phone')
            if value:
                self.phone_validate(attrs.get('phone'))
        except exceptions.ParseError as e:
            errors['phone'] = str(e)
        try:
            value = attrs.get('password')
            if value:
                validate_password(attrs['password'])
        except django_exceptions.ValidationError as e:
            errors['password'] = ' '.join(e)
        try:
            value = attrs.get('position')
            if value:
                self.position_validate(attrs['position'])
        except ParseError as e:
            errors['position'] = str(e)
        if errors:
            raise exceptions.ParseError(errors)
        return attrs


class UserRegistrationSerializer(UserValidation, serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.CharField(required=False)
    phone = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = (
            'email',
            'phone',
            'surname',
            'name',
            'patronymic',
            'password',
            'position',
        )

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'email',
            'surname',
        )


class UserDetailSerializer(serializers.ModelSerializer):
    citizenship = CitizenshipSerializer()

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
            'sex',
            'date_of_birth',
        )


class UserUpdateSerializer(UserValidation, serializers.ModelSerializer):
    email = serializers.CharField()

    class Meta:
        model = User
        fields = (
            'email',
            'phone',
            'surname',
            'name',
            'patronymic',
            'image',
        )

    def update(self, instance, validated_data):
        if validated_data.get('email'):
            instance.mail_confirmed = False
            instance.save()
        return super().update(instance, validated_data)


class ActivateEmailSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=6)

    def validate(self, attrs):
        user_code = attrs['code']
        user = self.context.get('request').user
        backend_code = EmailActivate.objects.filter(user=user)
        if backend_code.exists() and user_code == backend_code.first().code:
            return attrs
        raise ParseError('Неверный код')

    def create(self, validated_data):
        user = self.context.get('request').user
        backend_code = EmailActivate.objects.filter(user=user)
        if backend_code.exists():
            backend_code.delete()
            user.mail_confirmed = True
            user.save()
        return validated_data


class SetImageUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'image',
        )


class ChangePositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'position',
            'password',
        )

    def validate(self, attrs):
        password = attrs.pop('password')
        user = self.context['request'].user

        if not user.check_password(password):
            raise serializers.ValidationError('Неверный пароль')

        return attrs

    def update(self, instance, validated_data):
        if self.context['request'].user == instance:
            raise serializers.ValidationError('Вы не можете изменять роль себе')

        instance.position = validated_data.get('position', instance.position)
        instance.save()
        return instance
