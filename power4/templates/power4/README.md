# FOUR IN A ROW

## Objective

Connect Four (also known as Four Up, Plot Four, Find Four, Four in a Row, Four in a Line, Drop Four) is a two-player connection board game, in which the players choose a color and then take turns dropping colored discs into a seven-column, six-row vertically suspended grid. 
The pieces fall straight down, occupying the lowest available space within the column. 
The objective of the game is to be the first to form a horizontal, vertical, or diagonal line of four of one's own discs. 

*Source: Wikipedia*

## User story : 

### 1. Starting a new game 

* The user is invited to register / login.

* Then the user invites another registered user to start a new game.

* The board displays the name of the two players and their respective colors (e.g. Player 1 is red and Player 2 is yellow).

### 2. Playing the game

* For each round, the two players are alternatively invited to select a dot. 

* When a user clicks on a dot, this dot becomes the color of the player. This new color appears in real time for the two players on both screens. 

* If a dot has already been selected, an error message informs the player that this dot can not be selected a second time. 

* A clock provides a 45-second timer for each round. 

### 3. Ending the game

* When one of the two players manages to align four dots in a row, with either a horizontal, vertical, or diagonal line, the board congratulates this player.

* The game stops and both players are invited to play again. 

## Back-end : Django framework 

This web application has been created with a Django framework in Python, following a "Model View Template" approach : 

* Models include: User, Dot, VerticalAxis, Game and Play. 

* Views include : homepage, create_game, game, login, logout and register.

* Class views include : PlayList(APIView), UserList(generics.ListAPIView) and UserDetail(generics.RetrieveAPIView).

* Templates include : login.html, register.html, homepage.html, game.html
    

## Front-end : Javascript 

The front-end is animated with Javascript : 
    
* API requests : Data about the selected dots is shared in real time with GET and POST requests that are sent to an API via fetch requests. 

* Dot animation: The dots start blinking when they are clicked or when four of them are aligned. 

* A clock displays a 45-second timer. 
