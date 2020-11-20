from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth import get_user_model

from django.conf import settings

class User(AbstractUser):
    pass

class Game(models.Model):
	player1 = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name="player1")
	player2 = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name="player2")

class Play(models.Model):
	game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="game")
	player = models.CharField(max_length=10, null=True, blank=True)
	clicked_dot_id = models.CharField(max_length=10, null=True, blank=True)
	clicked_dot_positionX = models.IntegerField(null=True, blank=True)
	clicked_dot_positionY = models.IntegerField(null=True, blank=True)

	def save(self, *args, **kwargs):
		super(Play, self).save(*args, **kwargs)