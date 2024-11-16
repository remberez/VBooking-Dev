from typing import Optional

from django.db import models
from django.db.models import Q


class BasePriceList(models.Model):
    first_day = models.DateField(
        verbose_name='Начало срока',
    )
    last_day = models.DateField(
        verbose_name='Конец срока',
    )
    price = models.DecimalField(
        verbose_name='Цена',
        max_digits=10, decimal_places=2,
    )

    class Meta:
        abstract = True

    @staticmethod
    def get_price_list_filter(first_day: Optional[str], last_day: Optional[str]) -> Q:
        if not (first_day and last_day):
            return Q()

        return Q(
            Q(first_day__lte=first_day, last_day__gte=first_day) |
            Q(first_day__lte=last_day, last_day__gte=last_day)
        )


class IndependentPriceList(BasePriceList):
    object = models.ForeignKey(
        'IndependentObject', verbose_name='Объект', on_delete=models.CASCADE,
        related_name='price_list',
    )

    class Meta:
        verbose_name = 'Прайс лист самостоятельного объекта'
        verbose_name_plural = 'Прайс листы самостоятельного объекта'

    def __str__(self):
        return f'{self.object} {self.first_day} - {self.last_day}'


class PriceListOfRoom(BasePriceList):
    object = models.ForeignKey(
        'Room', verbose_name='Объект', on_delete=models.CASCADE,
        related_name='price_list',
    )

    class Meta:
        verbose_name = 'Прайс лист номера'
        verbose_name_plural = 'Прайс листы номеров'

    def __str__(self):
        return f'{self.object} {self.first_day} - {self.last_day}'
