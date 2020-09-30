from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.index, name="index"),
    path('signup', views.signup, name="signup"),
    path('login', views.login, name="login"),
    path('login', views.login, name="login"),
    path('logout', views.logout, name="logout"),
    path('get_gdv', views.get_gdv, name="get_gdv"),
    path('get_buildcost', views.get_buildcost, name="get_buildcost")
]

urlpatterns = urlpatterns + static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
