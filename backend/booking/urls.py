from django.urls import path
from rest_framework.routers import DefaultRouter
from booking.view.objects import ObjectView, FavoriteViewSet
from booking.view.city import CityView
from booking.view.types import TypeOfObjectView
from booking.view.tags import TagView
from booking.view.price_lists import PriceListCreateAPIView, PriceListUpdateAPIView

router = DefaultRouter()

router.register('objects', ObjectView, basename='objects')
router.register('city', CityView, basename='city')
router.register('types-of-objects', TypeOfObjectView, basename='types-of-objects')
router.register('tags', TagView, basename='tags')
router.register("favorite", FavoriteViewSet, basename='favorite')

urlpatterns = [
    path('price-list/<int:object_pk>/<int:price_list_pk>/', PriceListUpdateAPIView.as_view(), name='price-list-update'),
    path('price-list/', PriceListCreateAPIView.as_view(), name='price-list-create'),
]

urlpatterns += router.urls
