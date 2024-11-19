from rest_framework.routers import DefaultRouter
from booking.view.objects import ObjectView
from booking.view.city import CityView
from booking.view.types import TypeOfObjectView
from booking.view.tags import TagView
from booking.view.price_lists import PriceListView

router = DefaultRouter()

router.register('objects', ObjectView, basename='objects')
router.register('city', CityView, basename='city')
router.register('types-of-objects', TypeOfObjectView, basename='types-of-objects')
router.register('tags', TagView, basename='tags')
router.register('price-list', PriceListView, 'price-list')

urlpatterns = [

]

urlpatterns += router.urls
