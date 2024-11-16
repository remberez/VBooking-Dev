from rest_framework.routers import DefaultRouter
from users.view.user import UserView, TravelerView

router = DefaultRouter()
router.register('users', UserView, basename='users')
router.register('travelers', TravelerView, basename='travelers')

urlpatterns = [

]

urlpatterns += router.urls