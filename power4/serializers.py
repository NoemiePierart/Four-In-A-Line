from django.contrib.auth.models import AbstractUser, User
from django.db import models
from rest_framework import serializers
from power4.models import Play, Game, User

class UserSerializer(serializers.ModelSerializer):
	games = serializers.PrimaryKeyRelatedField(many=True, queryset=Game.objects.all())
	plays = serializers.PrimaryKeyRelatedField(many=True, queryset=Play.objects.all())

	class Meta:
		model = User 
		fields = ['id', 'username', 'games', 'plays']

class PlaySerializer(serializers.ModelSerializer):
	#player = serializers.CharField(source='player.username', read_only=True)
	class Meta: 
		model = Play
		fields = ['id', 'game', 'player', 'clicked_dot_id', 'clicked_dot_positionX', 'clicked_dot_positionY']

# class GameSerializer(serializers.ModelSerializer):
# 	class Meta: 
# 		model = Game
# 		fields = ['id', 'player1_id', 'player2_id']