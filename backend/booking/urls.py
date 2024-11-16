from rest_framework.routers import DefaultRouter
from booking.view.objects import ObjectView
from booking.view.city import CityView
from booking.view.types import TypeOfObjectView
from booking.view.tags import TagView

router = DefaultRouter()

router.register('objects', ObjectView, basename='objects')
router.register('city', CityView, basename='city')
router.register('types-of-objects', TypeOfObjectView, basename='types-of-objects')
router.register('tags', TagView, basename='tags')

urlpatterns = [

]

urlpatterns += router.urls
