from rest_framework.routers import DefaultRouter
from users.view.user import UserView, TravelerView, CitizenshipView

router = DefaultRouter()
router.register('users', UserView, basename='users')
router.register('travelers', TravelerView, basename='travelers')
router.register('citizenship', CitizenshipView, basename='citizenship')

urlpatterns = [

]

urlpatterns += router.urls