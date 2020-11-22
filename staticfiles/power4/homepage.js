// Animate the player-choice in the modal 
document.querySelectorAll(".player-choice").forEach((player) => {
	player.addEventListener("click", (event) => {
		document.querySelectorAll(".player-choice").forEach((item) => {
			item.classList.remove("player-choice-active");
		});
		event.currentTarget.classList.add("player-choice-active");
		});
});

// ANIMATE THE CHECKERBOARD WITH A FAKE GAME : 

const color1 = "red";
const color2 = "yellow";

// Access the players and game :
const player1_username = document.getElementById('player1').dataset.player_username;
const player2_username = document.getElementById('player2').dataset.player_username;