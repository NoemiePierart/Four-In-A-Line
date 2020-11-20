from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, Http404
from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
from .models import User, Game, Play
from django.contrib.auth.decorators import login_required
from json import dumps
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from power4.serializers import PlaySerializer, UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, generics
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

def homepage(request):
    if request.user.is_authenticated:
        # Access the session user :
        user_id = int(request.user.id)
        session_user = User.objects.get(id = user_id)
        # Receive invitations : collect all games where this user is player2 :
        pending_invitations = Game.objects.filter(player2=session_user)
        # Send invitations : access all users except the session_user :
        all_players = User.objects.exclude(id = int(request.user.id))
        # Render the view : 
        return render(request, "power4/homepage.html", {
            "pending_invitations": pending_invitations,
            "session_user": session_user, 
            "all_players": all_players 
        })
    else : 
        return render(request, "power4/homepage.html")

def create_game(request):
    if request.method == "POST":
        # Define the player 1 (session user) :
        user_id = int(request.user.id)
        player1 = User.objects.get(id = user_id)
        # Define the player 2 (selected user) :
        player2 = request.POST["selected_player"]
        player2 = User.objects.get(username=player2)
        # Create the new game : 
        new_game = Game(player1=player1, player2=player2)
        new_game.save()
        return redirect('game', game_id=new_game.id) 

@csrf_exempt
def show_game(request, game_id):
    # Access the selected game : 
    game = Game.objects.get(id=game_id)
    # Access the selected players : 
    player1 = game.player1
    player2 = game.player2
    session_user = User.objects.get(id=int(request.user.id))
    # Access info for the "play again" modal (same as homepage modal ) :
    user_id = int(request.user.id)
    session_user = User.objects.get(id = user_id)
    pending_invitations = Game.objects.filter(player2=session_user)
    all_players = User.objects.exclude(id = int(request.user.id))

    # Render the view
    return render(request, "power4/game.html", {
        'player1': player1,
        'player2': player2,
        'session_user': session_user, 
        'game_id': game_id,
        'game': game, 
        'all_players': all_players, 
        'pending_invitations': pending_invitations
    })

@method_decorator(login_required, name='dispatch')
class PlayList(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, game_id, format=None):
        plays = Play.objects.filter(game=game_id)
        serializer = PlaySerializer(plays, many=True)
        return Response(serializer.data)

    def post(self, request, game_id, format=None):

        serializer = PlaySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
        def perform_create(self, serializer):
            serializer.save(player=self.request.user)

class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("homepage"))
        else:
            return render(request, "power4/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "power4/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("homepage"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "power4/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "power4/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("homepage"))
    else:
        return render(request, "power4/register.html")