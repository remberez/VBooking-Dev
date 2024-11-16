from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.db.models import QuerySet
from rest_framework.request import Request

from users.models.managers import CustomUserManager


class Citizenship(models.Model):
    name = models.CharField(
        verbose_name='Страна', max_length=25
    )


class BaseUser(models.Model):
    MAN = 'MAN'
    WOMAN = 'WOMAN'
    SEX_CHOICES = {
        MAN: 'Мужчина',
        WOMAN: 'Женщина',
    }
    surname = models.CharField(
        verbose_name='Фамилия', max_length=25,
    )
    name = models.CharField(
        verbose_name='Имя', max_length=25,
    )
    patronymic = models.CharField(
        verbose_name='Отчество', max_length=25, null=True, blank=True
    )
    citizenship = models.ForeignKey(
        'Citizenship', on_delete=models.SET_NULL,
        related_name='%(class)s_users', verbose_name='Гражданство',
        null=True, blank=True
    )
    sex = models.CharField(
        verbose_name='Пол', null=True, blank=True, choices=SEX_CHOICES
    )
    date_of_birth = models.DateField(
        verbose_name='Дата рождения', null=True, blank=True,
    )

    class Meta:
        abstract = True


class User(BaseUser, AbstractUser):
    username = None
    email = models.EmailField(
        verbose_name='Почта', unique=True
    )
    phone = models.CharField(
        verbose_name='Номер телефона', unique=True, blank=True, null=True,
    )
    position = models.ForeignKey(
        'Position', verbose_name='Должность',
        related_name='users', on_delete=models.RESTRICT,
        null=True,
    )
    image = models.ImageField(
        upload_to='users/%Y/%m/%d/', null=True, blank=True,
    )
    date_joined = models.DateField(
        auto_now=True, editable=True
    )
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['surname', 'name']
    mail_confirmed = models.BooleanField(
        verbose_name='Почта подтверждена',
        default=False
    )

    objects = CustomUserManager()

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    groups = models.ManyToManyField(
        Group,
        verbose_name='Группы',
        related_name='custom_user_set',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name='Разрешения',
        related_name='custom_user_set',
        blank=True
    )

    def __str__(self):
        return f'{self.surname} {self.name} {self.patronymic}'

    def get_favorites(self) -> QuerySet:
        return self.favorites_objects.all().select_related(
                'owner', 'address', 'type', 'independent', 'independent__exact_address', 'address__city'
            ).prefetch_related(
                'images',
                'videos',
                'independent__tags',
                'rooms__tags',
            )


class FellowTraveler(BaseUser):
    user = models.ForeignKey(
        'User', verbose_name='Чей попутчик',
        related_name='fellow_travelers',
        on_delete=models.CASCADE,
    )

    class Meta:
        verbose_name = 'Попутчик'
        verbose_name_plural = 'Попутчики'

    def __str__(self):
        return f'{self.name} {self.surname}'

    @staticmethod
    def filter_by_user(queryset: QuerySet, request: Request) -> QuerySet:
        return queryset.filter(user=request.user)

    def reviews(self):
        return self.reviews.all().select_related('user')
