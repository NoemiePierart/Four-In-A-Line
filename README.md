# FOUR IN A LINE

## Objective

Four in a Line (also known as Connect Four, Four Up, Plot Four, Find Four, Four in a Row, Drop Four) is a two-player connection board game, in which the players choose a color and then take turns dropping colored discs into a seven-column, six-row vertically suspended grid. 
The pieces fall straight down, occupying the lowest available space within the column. 
The objective of the game is to be the first to form a horizontal, vertical, or diagonal line of four of one's own discs. 

*Source: Wikipedia*

## User story : 

Two users can play "Four in line" together from two different devices, with a fully-responsive web app.  

#### 1. Starting a new game 

* The user is invited to register / login.

* Then the user invites another registered user to start a new game.

* The board displays the name of the two players and their respective colors : Player 1 is red and Player 2 is yellow.

#### 2. Playing the game

* For each round, the two players are alternatively invited to select a dot. 

* When a user clicks on a dot, this dot becomes the color of the player. This new color appears in real time for the two players on both screens. 

* If a dot has already been selected, an error message informs the player that this dot can not be selected a second time. 

* A clock provides a 45-second timer for each round. 

#### 3. Ending the game

* When one of the two players manages to align four dots in a row, with either a horizontal, vertical, or diagonal line, the board congratulates this player.

* The game stops and both players are invited to play again. 

## Back-end : Django framework 

This web application has been created with a Django framework in Python, following a "Model View Template" approach : 

* Models include: User, Game and Play. 

* Views include : homepage, create_game, show_game, login_view, logout_view and register. 
A class view is used for PlayList(APIView).

* Templates include : login.html, register.html, homepage.html and game.html.
    

## Front-end : Javascript 

The front-end is animated with Javascript : 
    
* API requests : Data about the selected dots is shared between the two users via GET and POST requests that are sent to an API with fetch requests. The requests are automatically refreshed every second to ensure real-time updates between the two players.

* CSS animation: The dots blink when they are clicked and when four of them are aligned. 

* The information board asks the next player to play and congratulates the winner when there is one.  

* Timer : A clockdown displays a 45-second timer for each round. A modal pops up to stop the game when the time is up.

* Modals allow users to send invitations to other users and receive invitations from other users. 

## Inspiration 

![Example_board_game](https://upload.wikimedia.org/wikipedia/en/7/79/Connect_4_Board_and_Box.jpg "Inspiration")
*Image Source: Wikipedia*
