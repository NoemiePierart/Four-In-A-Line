from django.urls import path, include
from . import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path("", views.homepage, name="homepage"),
    
    # Authentification : 
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("api-auth/", include('rest_framework.urls')),

    # Games :  
    path("games/create_game", views.create_game, name="create_game"),
    path("games/<int:game_id>", views.show_game, name="game"),
    
    # Plays : 
    path("games/<int:game_id>/plays/", views.PlayList.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)
