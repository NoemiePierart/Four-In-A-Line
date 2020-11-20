// PART 0 : SET THE STAGE

// Scroll to the checkerboard on page loads :
document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("checkerboard").scrollIntoView({ 
	  behavior: 'smooth' 
	});
})

// Define the colors : 
const color1 = "red";
const color2 = "yellow";

// Access the players and game :
const player1_username = document.getElementById('player1').dataset.player_username;
const player2_username = document.getElementById('player2').dataset.player_username;
const session_user_username = document.getElementById('session_user').dataset.player_username;
const game = document.getElementById('game').dataset.game;
const game_id = Number.parseInt(game, 10);

// Set the initial last_play to identify new plays : 
let last_play_id = 0; 
let next_player = player1_username;

// Set the initial lowest_dots :
let lowest_dots = [0, 0, 0, 0, 0, 0, 0]

// Set the initial message : 
message.innerText = `${player1_username}, it's your turn !`;

// Access the CSRF_token :
const getCookie= (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

// PART 1 : SEND POST REQUEST :

document.querySelectorAll(".dot").forEach((clicked_dot) => {
	// Access the clicked_dot_id :
	clicked_dot.addEventListener("click", (event) => {
			
		if (session_user_username === next_player) {

			const positionX = Number.parseInt(clicked_dot.dataset.positionx, 10);
			const positionY = lowest_dots[positionX - 1] + 1
			console.log(positionX);
			console.log(positionY);
			const clicked_dot_id = `${positionX}-${positionY}`
			console.log(clicked_dot_id)

			// Ensure that the dot is empty : 
			if (!clicked_dot.classList.contains("empty")){
				message.innerText = "Error - This dot has already been selected ! "
			} else {

				// Send the clicked_dot_id to the API with a POST message : 
				event.preventDefault();
				const message = {
					clicked_dot_id: clicked_dot_id,
	   				clicked_dot_positionX: positionX,
	   				clicked_dot_positionY: positionY, 
	   				player: session_user_username,
	   				game: game
	    		};
					
				fetch(`/games/${game_id}/plays/`, {
					method: 'POST',
					mode: 'same-origin',
					headers: {'X-CSRFToken': csrftoken, 'Content-Type': 'application/json'},
					body: JSON.stringify(message) 
					})
				.then(response => response.json())
				.then((data) => {
				});				
			}
		}
	});
});

// PART 2 : RECEIVE THE GET REQUEST 

// Collect ALL the clicked_dots from the API with a GET message : 
const getAllPlays = (game_id) => {
	fetch(`/games/${game_id}/plays/`)
	.then(response => response.json())
	.then((data) => {
		data.forEach((play) => {
			// Update the checkerboard : 
			update_checkerboard(play);
	  	})
	});
}

// Collect THE LAST clicked_dot from the API with a GET message : 
const getLastPlay = (game_id) => {
	fetch(`/games/${game_id}/plays/`)
	.then(response => response.json())
	.then((data) => {
	    const play = data.sort().reverse()[0];
	    // If there is a new play, update the checkerboard and the next_player :
	    if (data.length > 0) {
	    	if (last_play_id !== play.id) {
	    		// Update the last_play_id :
	    		last_play_id = play.id
	    		// Update the checkerboard :
		    	update_checkerboard(play);
		    	// Update the last play : 
		    	last_play = play.id;
		    	// Update the lowest_dots :
		    	lowest_dots[play.clicked_dot_positionX - 1] += 1
		    	// Update the next player : 
		    	if (play.player === player1_username) {
		    		next_player = player2_username;
		    	} else if (play.player === player2_username) {
		    		next_player = player1_username;
		    	}
		    	// Refresh the clockdown : 
		    	timePassed = 0;
		    	const timerCountdown = setInterval(addOneSecond, 1000);
	    	}
	    }
	});
}

// PART 3 : UPDATE THE CHECKERBOARD 

const is_horizontal_match = (play, color) => {

	const positionX = play.clicked_dot_positionX;
	const positionY = play.clicked_dot_positionY;

	// Definition of horizontal dots : 
	// left_3 || left_2 || left_1 || dot || right_1 || right_2 || right_3  
	const clicked_dot_id = `${positionX}-${positionY}`;
	const right1_id = `${positionX + 1}-${positionY}`;
	const right2_id = `${positionX + 2}-${positionY}`;
	const right3_id = `${positionX + 3}-${positionY}`;
	const left1_id = `${positionX - 1}-${positionY}`;
	const left2_id = `${positionX - 2}-${positionY}`;
	const left3_id = `${positionX - 3}-${positionY}`;

	// Reset horiz_conseq class :
	const all_dots = document.querySelectorAll(".dot");
	all_dots.forEach((dot) => {
		dot.classList.remove("horiz_conseq");
	});	

	// Mark the clicked dot ("dot zero") as horiz consecutive :
	const dot = document.getElementById(clicked_dot_id);
	dot.classList.add("horiz_conseq");

	// Count consecutive horizontal dots : 
	let horizontal_count = 1 ;

	if (is_color(right1_id, color) === true) {
		horizontal_count += 1;
		document.getElementById(right1_id).classList.add("horiz_conseq")
		if (is_color(right2_id, color) === true) {
			horizontal_count += 1;
			document.getElementById(right2_id).classList.add("horiz_conseq");
			// o o o x x x x :
			if (is_color(right3_id, color) === true) {
				horizontal_count += 1;
				document.getElementById(right3_id).classList.add("horiz_conseq");
			// o o x x x x o :
			} else if (is_color(left1_id, color) === true) {
				horizontal_count += 1; 
				document.getElementById(left1_id).classList.add("horiz_conseq");
			}
		} else if (is_color(left1_id, color) === true){
			horizontal_count +=1;
			document.getElementById(left1_id).classList.add("horiz_conseq");
			// o x x x x o o : 
			if (is_color(left2_id, color) === true){
				horizontal_count +=1;
				document.getElementById(left2_id).classList.add("horiz_conseq");
			}
		}

	} else if (is_color(left1_id, color) === true) {
		horizontal_count +=1 ; 
		document.getElementById(left1_id).classList.add("horiz_conseq");
		if (is_color(left2_id, color) === true) {
			horizontal_count +=1 ;
			document.getElementById(left2_id).classList.add("horiz_conseq");
			// x x x x o o o : 
			if (is_color(left3_id, color) === true) {
				horizontal_count += 1 ;
				document.getElementById(left3_id).classList.add("horiz_conseq");
			}
		}
	}

	// Check whether 4 dots are horizontally aligned : 
	if (horizontal_count === 4) {

		document.querySelectorAll(".horiz_conseq").forEach((conseq) => {
			if (conseq.classList.contains(color)) {
				conseq.classList.add("winning-dot")
			}
		});
		// Return true :
		return true;
	}
}

const is_vertical_match = (play, color) => {

	const positionX = play.clicked_dot_positionX;
	const positionY = play.clicked_dot_positionY;

	// Definition of vertical dots : 
	// top_3 || top_2 || top_1 || dot || bottom_1 || bottom_2 || bottom_3  
	const clicked_dot_id = `${positionX}-${positionY}`;
	const bottom1_id = `${positionX}-${positionY - 1}`;
	const bottom2_id = `${positionX}-${positionY - 2}`;
	const bottom3_id = `${positionX}-${positionY - 3}`;
	const top1_id = `${positionX}-${positionY + 1}`;
	const top2_id = `${positionX}-${positionY + 2}`;
	const top3_id = `${positionX}-${positionY + 3}`;

	// Reset vertic_conseq class :
	const all_dots = document.querySelectorAll(".dot");
	all_dots.forEach((dot) => {
		dot.classList.remove("vertic_conseq");
	});	
	
	// Mark the clicked dot ("dot zero") as vertic_conseq :
	const dot = document.getElementById(clicked_dot_id);
	dot.classList.add("vertic_conseq")

	// Count consecutive vertical dots : 
	let vertical_count = 1 ;

	// Find other vertic_conseq dots : 
	if (is_color(bottom1_id, color) === true) {
		vertical_count += 1;
		document.getElementById(bottom1_id).classList.add("vertic_conseq");
		if (is_color(bottom2_id, color) === true) {
			vertical_count += 1;
			document.getElementById(bottom2_id).classList.add("vertic_conseq");
			// o o o x x x x :
			if (is_color(bottom3_id, color) === true) {
				vertical_count += 1;
				document.getElementById(bottom3_id).classList.add("vertic_conseq");
			// o o x x x x o :
			} else if (is_color(top1_id, color) === true) {
				vertical_count += 1; 
				document.getElementById(top1_id).classList.add("vertic_conseq");
			}
		} else if (is_color(top1_id, color) === true){
			vertical_count +=1;
			document.getElementById(top1_id).classList.add("vertic_conseq");
			// o x x x x o o : 
			if (is_color(top2_id, color) === true){
				vertical_count +=1;
				document.getElementById(top2_id).classList.add("vertic_conseq");
			}
		}

	} else if (is_color(top1_id, color) === true) {
		vertical_count +=1 ; 
		document.getElementById(top1_id).classList.add("vertic_conseq");
		if (is_color(top2_id, color) === true) {
			vertical_count +=1 ;
			document.getElementById(top2_id).classList.add("vertic_conseq");
			// x x x x o o o : 
			if (is_color(top3_id, color) === true) {
				vertical_count += 1 ;
				document.getElementById(top3_id);
			}
		}
	}

	// Check whether 4 dots are vertically aligned :  
	if (vertical_count === 4) {	
		// Make the winning dots blink : 
		document.querySelectorAll(".vertic_conseq").forEach((conseq) => {
			if (conseq.classList.contains(color)) {
				conseq.classList.add("winning-dot")
			}
		});
		// Return true :
		return true
	}
}

const is_up_diag_match = (play, color) => {

	const positionX = play.clicked_dot_positionX;
	const positionY = play.clicked_dot_positionY;

	// Definition of the upwards_diagonal dots : ↗↗↗  
	const clicked_dot_id = `${positionX}-${positionY}`;
	const up_diag_bottom1_id = `${positionX - 1}-${positionY - 1}`;
	const up_diag_bottom2_id = `${positionX - 2}-${positionY - 2}`;
	const up_diag_bottom3_id = `${positionX -3 }-${positionY - 3}`;
	const up_diag_top1_id = `${positionX + 1}-${positionY + 1}`;
	const up_diag_top2_id = `${positionX + 2}-${positionY + 2}`;
	const up_diag_top3_id = `${positionX + 3}-${positionY + 3}`;

	// Reset up_diag_conseq class :
	const all_dots = document.querySelectorAll(".dot");
	all_dots.forEach((dot) => {
		dot.classList.remove("up_diag_conseq");
	});		

	// Mark the clicked dot ("dot zero") as up_diag consecutive :
	const dot = document.getElementById(clicked_dot_id);
	dot.classList.add("up_diag_conseq")

	// Count consecutive up_diag dots : 
	let up_diag_count = 1 ;

	// Find other up_diag consecutive dots : 
	if (is_color(up_diag_bottom1_id, color) === true) {
		up_diag_count += 1;
		document.getElementById(up_diag_bottom1_id).classList.add("up_diag_conseq");
		if (is_color(up_diag_bottom2_id, color) === true) {
			up_diag_count += 1;
			document.getElementById(up_diag_bottom2_id).classList.add("up_diag_conseq");
			// o o o x x x x :
			if (is_color(up_diag_bottom3_id, color) === true) {
				up_diag_count += 1;
				document.getElementById(up_diag_bottom3_id).classList.add("up_diag_conseq");
			// o o x x x x o :
			} else if (is_color(up_diag_top1_id, color) === true) {
				up_diag_count += 1; 
				document.getElementById(up_diag_top1_id).classList.add("up_diag_conseq");
			}
		} else if (is_color(up_diag_top1_id, color) === true){
			up_diag_count +=1;
			document.getElementById(up_diag_top1_id).classList.add("up_diag_conseq");
			// o x x x x o o : 
			if (is_color(up_diag_top2_id, color) === true){
				up_diag_count +=1;
				document.getElementById(up_diag_top2_id).classList.add("up_diag_conseq");
			}
		}

	} else if (is_color(up_diag_top1_id, color) === true) {
		up_diag_count +=1 ; 
		document.getElementById(up_diag_top1_id).classList.add("up_diag_conseq");
		if (is_color(up_diag_top2_id, color) === true) {
			up_diag_count +=1 ;
			document.getElementById(up_diag_top2_id).classList.add("up_diag_conseq");
			// x x x x o o o : 
			if (is_color(up_diag_top3_id, color) === true) {
				up_diag_count += 1 ;
				document.getElementById(up_diag_top3_id).classList.add("up_diag_conseq");
			}
		}
	}

	// Check whether 4 dots are up_diag aligned :  
	if (up_diag_count === 4) {
		// Make the winning dots blink : 
		document.querySelectorAll(".up_diag_conseq").forEach((conseq) => {
			if (conseq.classList.contains(color)) {
				conseq.classList.add("winning-dot")
			}
		});
		// Return true : 
		return true
	}
}

const is_down_diag_match = (play, color) => {

	const positionX = play.clicked_dot_positionX;
	const positionY = play.clicked_dot_positionY;

	// Definition of down_diag dots : ↘↘↘
	const clicked_dot_id = `${positionX}-${positionY}`;
	const down_diag_bottom1_id = `${positionX - 1}-${positionY - 1}`;
	const down_diag_bottom2_id = `${positionX - 2}-${positionY - 2}`;
	const down_diag_bottom3_id = `${positionX - 3}-${positionY - 3}`;
	const down_diag_top1_id = `${positionX + 1}-${positionY + 1}`;
	const down_diag_top2_id = `${positionX + 2}-${positionY + 2}`;
	const down_diag_top3_id = `${positionX + 3}-${positionY + 3}`;

	// Reset down_diag_conseq class :
	const all_dots = document.querySelectorAll(".dot");
	all_dots.forEach((dot) => {
		dot.classList.remove("down_diag_conseq");
	});	

	// Count consecutive down_diag dots : 
	let down_diag_count = 1 ;

	// Mark the clicked dot ("dot zero") as consecutive :
	const dot = document.getElementById(clicked_dot_id);
	dot.classList.add("down_diag_conseq");

	// Find other down_diag consecutive dots : 
	if (is_color(down_diag_bottom1_id, color) === true) {
		down_diag_count += 1;
		document.getElementById(down_diag_bottom1_id).classList.add("down_diag_conseq");
		if (is_color(down_diag_bottom2_id, color) === true) {
			down_diag_count += 1;
			document.getElementById(down_diag_bottom2_id).classList.add("down_diag_conseq");
			// o o o x x x x :
			if (is_color(down_diag_bottom3_id, color) === true) {
				down_diag_count += 1;
				document.getElementById(down_diag_bottom3_id).classList.add("down_diag_conseq");
			// o o x x x x o :
			} else if (is_color(down_diag_top1_id, color) === true) {
				down_diag_count += 1; 
				document.getElementById(down_diag_top1_id).classList.add("down_diag_conseq");
			}
		} else if (is_color(down_diag_top1_id, color) === true){
			down_diag_count +=1;
			document.getElementById(down_diag_top1_id).classList.add("down_diag_conseq");
			// o x x x x o o : 
			if (is_color(down_diag_top2_id, color) === true){
				down_diag_count +=1;
				document.getElementById(down_diag_top2_id).classList.add("down_diag_conseq");
			}
		}

	} else if (is_color(down_diag_top1_id, color) === true) {
		down_diag_count +=1 ; 
		document.getElementById(down_diag_top1_id).classList.add("down_diag_conseq");
		if (is_color(down_diag_top2_id, color) === true) {
			down_diag_count +=1 ;
			document.getElementById(down_diag_top2_id).classList.add("down_diag_conseq");
			// x x x x o o o : 
			if (is_color(down_diag_top3_id, color) === true) {
				down_diag_count += 1 ;
				document.getElementById(down_diag_top3_id).classList.add("down_diag_conseq");
			}
		}
	}

	// Check whether 4 dots are down_diag aligned :  
	if (down_diag_count === 4) {
		// Make the winning dots blink : 
		document.querySelectorAll(".down_diag_conseq").forEach((conseq) => {
			if (conseq.classList.contains(color)) {
				conseq.classList.add("winning-dot")
			}
		});
		// Return true : 
		return true
	}
}

const make_player1_play = (play) => {
	
	const clicked_dot = document.getElementById(play.clicked_dot_id);

	// Update the color of the dot :
	clicked_dot.classList.add(`${color1}`);
	clicked_dot.classList.add("slideInDown"); 
	clicked_dot.classList.remove("empty");

	// If there is a winner :  
	if ((is_horizontal_match(play, color1) === true)|| (is_vertical_match(play, color1) === true) || (is_up_diag_match(play, color1) === true) || (is_down_diag_match(play, color1) === true)) {
		// Congratulate the winner :
		message.innerText = `${player1_username} is the winner !!`;
		// Update the border color : 
		document.querySelector("#bottom-box").classList.add(`${color1}_border`)
		// Stop refreshing the get requests : 
		clearInterval(keepPlaying);
		// Stop the timer countdown :
		clearInterval(timerCountdown);

	// Else :
	} else {
		// Invite the second player to play : 
		message.innerText = `${player2_username}, it's your turn !`;
	}
}

const make_player2_play = (play) => {

	const clicked_dot = document.getElementById(play.clicked_dot_id);

	// Update the color of the dot :
	clicked_dot.classList.add(`${color2}`);
	clicked_dot.classList.add("slideInDown");
	clicked_dot.classList.remove("empty"); 

	// If there is a winner :  
	if ((is_horizontal_match(play, color2) === true) || (is_vertical_match(play, color2) === true) || (is_up_diag_match(play, color2) === true) || (is_down_diag_match(play, color2) === true)) {
		// Congratulate the winner :
		message.innerText = `${player2_username} is the winner !!`;
		// Update the border color :  
		document.querySelector("#bottom-box").classList.add(`${color2}_border`)
		// Stop refreshing the get requests : 
		clearInterval(keepPlaying);
		// Stop the timer countdown :
		clearInterval(timerCountdown);
		
	// Else :
	} else {
		// Invite the second player to play : 
		message.innerText = `${player1_username}, it's your turn !`;
	}
}

const is_color = (dot_id, color) => {
	const dot = document.getElementById(dot_id)
	if ((dot !== null) && (dot.classList.contains(`${color}`))) {
		return true;
	} else {
		return false;
	}
}

// Update the checkerboard :
const update_checkerboard = (play) => {
	// const clicked_dot = document.getElementById(play.clicked_dot_id);
    if (play.player == player1_username) {
		make_player1_play(play);
    }
    else if (play.player == player2_username) {
    	make_player2_play(play);
  	}
}


// COUNTDOWN : 

// Set the initial variables : 

const full_dash_array = 283;
const warning_threshold = 10;
const alert_threshold = 5;

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: warning_threshold
  },
  alert: {
    color: "red",
    threshold: alert_threshold
  }
};

const TIME_LIMIT = 120;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

//  Make the counter refresh every second :
const addOneSecond = () => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    if (timeLeft > 0) {
	    document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
	    setCircleDasharray();
	    setRemainingPathColor(timeLeft);
	} else {
	// 	console.log("TIME IS UP")
	// clearInterval(timerCountdown);
		$('#timeIsUp').modal('show');
	}
}

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

const setRemainingPathColor = (timeLeft) => {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

const calculateTimeFraction = () => {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

const setCircleDasharray = () =>{
  const circleDasharray = `${(
    calculateTimeFraction() * full_dash_array
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

document.getElementById("countdown").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
</div>
`;


// PART 4 : SET AUTOMATIC REFRESHES :

// Refresh all the plays when page loadds :
document.addEventListener("DOMContentLoaded", () => {
	getAllPlays(game_id);
})

// Refresh the last play every second : 
const keepPlaying = setInterval(getLastPlay, 1000, game_id);

// PART 5 : OTHER 

// Animate the player-choice for the modal : 
document.querySelectorAll(".player-choice").forEach((player) => {
	player.addEventListener("click", (event) => {
		document.querySelectorAll(".player-choice").forEach((item) => {
			item.classList.remove("player-choice-active");
		});
		event.currentTarget.classList.add("player-choice-active");
		});
});
