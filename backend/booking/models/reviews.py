from django.contrib.auth import get_user_model
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()


class Review(models.Model):
    object = models.ForeignKey(
        'Object', related_name='reviews',
        verbose_name='Объект', on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        User, related_name='reviews',
        verbose_name='Пользователь', on_delete=models.SET_NULL,
        null=True, blank=True
    )
    review = models.TextField(verbose_name='Отзыв', null=True, blank=True)
    rating = models.PositiveSmallIntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5),
        ]
    )
    rest_period = models.DateField(verbose_name='Период отдыха')
    reply = models.TextField(verbose_name='Ответ владельца', null=True, blank=True)

    class Meta:
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'

    def __str__(self):
        return f'Отзыв от {self.user} на объект {self.object}'
