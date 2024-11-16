from django.contrib import admin
from users.models.email_activate import EmailActivate
from users.models.position import Position
from users.models.user import User, FellowTraveler, Citizenship
from django.contrib.auth.admin import UserAdmin


class FellowTravelerAdminInline(admin.TabularInline):
    extra = 0
    model = FellowTraveler


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('id', 'surname', 'name', 'patronymic', 'email', 'phone', 'position', 'date_joined')
    list_filter = ('position',)
    search_fields = ('email', 'surname', 'name')
    ordering = ('date_joined',)
    inlines = (FellowTravelerAdminInline,)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Личные данные', {'fields': ('surname', 'name', 'patronymic', 'phone', 'image', 'position', 'mail_confirmed', 'citizenship')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email', 'password1', 'password2', 'surname', 'name', 'patronymic', 'phone', 'position',
                'image', 'mail_confirmed'
            )}
         ),
    )


@admin.register(FellowTraveler)
class FellowTravelerAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'surname', 'user')


@admin.register(Position)
class PositionAdmin(admin.ModelAdmin):
    list_display = ('code', 'name',)


@admin.register(EmailActivate)
class EmailActivate(admin.ModelAdmin):
    list_display = ('id', 'user', 'code')


@admin.register(Citizenship)
class Citizenship(admin.ModelAdmin):
    list_display = ('id', 'name')
