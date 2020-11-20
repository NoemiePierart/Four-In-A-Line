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


// Play 1 : make yellow player play : 
const clicked_dot1 = document.getElementById("");
clicked_dot1.classList.add(`${color1}`);
clicked_dot1.classList.add("slideInDown"); 
clicked_dot1.classList.remove("empty");
message.innerText = `${player2_username}, it's your turn !`;

// Play 2 : make red player play : 
const clicked_dot2 = document.getElementById("");
clicked_dot2.classList.add(`${color2}`);
clicked_dot2.classList.add("slideInDown"); 
clicked_dot2.classList.remove("empty");
message.innerText = `${player1_username}, it's your turn !`;

// Play 2 : make red player play : 
const clicked_dot3 = document.getElementById("");
clicked_dot3.classList.add(`${color1}`);
clicked_dot3.classList.add("slideInDown"); 
clicked_dot3.classList.remove("empty");
message.innerText = `${player2_username}, it's your turn !`;

// Make winning dots blink :
const winning_dots = [winning_dot0, winning_dot1, winning_dot2, winning_dot3]
const winning_dot0 = document.getElementById("");
const winning_dot1 = document.getElementById("");
const winning_dot2 = document.getElementById("");
const winning_dot3 = document.getElementById("");

winning_dots.forEach((dot) => {
	dot.classList.add("winning-dot");
})
