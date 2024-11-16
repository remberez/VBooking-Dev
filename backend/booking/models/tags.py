from django.db import models


class Tag(models.Model):
    type = models.ForeignKey(
        'TagType', verbose_name='Тип тега',
        on_delete=models.CASCADE, related_name='tags',
        null=True, default=None,
    )
    title = models.CharField(
        verbose_name='Заголовок', max_length=32
    )
    svg = models.ImageField(
        verbose_name='svg', upload_to='tags/',
    )

    class Meta:
        verbose_name = 'Тег'
        verbose_name_plural = 'Теги'

    def __str__(self):
        return self.title


class TagType(models.Model):
    name = models.CharField(
        verbose_name='Тип', max_length=25
    )

    class Meta:
        verbose_name = 'Тип тега'
        verbose_name_plural = 'Тиы тегов'

    def __str__(self):
        return self.name
