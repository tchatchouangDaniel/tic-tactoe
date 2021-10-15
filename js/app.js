// Dom elements object
const domElements = {
  cells: document.querySelectorAll(".gameboard__cell"),
  p1Turn: document.querySelector(".player__turn--p1"),
  p2Turn: document.querySelector(".player__turn--p2"),
  p1Score: document.querySelector(".player__result--p1"),
  p2Score: document.querySelector(".player__result--p2"),
  p1Name: document.querySelector(".player__name--p1"),
  p2Name: document.querySelector(".player__name--p2"),
  turnPop: document.querySelector(".turn-pop"),
  turnPopWrapper: document.querySelector(".popup__wrapper--turn"),
  gamePop: document.querySelector(".game-pop"),
  gamePopWrapper: document.querySelector(".popup__wrapper--game"),
  countdown: document.querySelector(".timer__countdown"),
};
// State of our application
const state = {
  currentPlayer: Math.floor(Math.random() * 2) === 1 ? "⚔️" : "🛡️",
  p1Name: "P1",
  p2Name: "P2",
  p1Score: 0,
  p2Score: 0,
  winner: "",
  emptyTiles: 9,
  gameEnd: false,
  gameboard: ["", "", "", "", "", "", "", "", ""],
  winningCombinaison: [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ],
  time: 3 * 60,
};

/**
 * Update the timer
 */
function updateCountdawn() {
  const minutes = Math.floor(state.time / 60);
  let seconds = state.time % 60;

  if (state.time > 0) {
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    domElements.countdown.textContent = `${minutes}:${seconds}`;
    state.time -= 1;
  } else {
    domElements.countdown.textContent = "0:00";
    winner();
  }
}

/**
 * Reset the ongoing game
 */
function resetCurrentGame() {
  state.turnEnd = false;
  state.emptyTiles = 9;
  state.winner = "";
  state.currentPlayer = Math.floor(Math.random() * 2) === 1 ? "⚔️" : "🛡️";
  domElements.p2Turn.classList.remove("show");
  domElements.p1Turn.classList.remove("show");
  domElements.cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("🛡️");
    cell.classList.remove("⚔️");
  });
  state.gameboard = ["", "", "", "", "", "", "", "", ""];
  if (state.currentPlayer === "🛡️") {
    domElements.p2Turn.classList.toggle("show");
  } else {
    domElements.p1Turn.classList.toggle("show");
  }
}

/**
 * initialise the Game
 */
function initGame() {
  const p1Name = prompt("Enter the name of player 1 :", "P1");
  const p2Name = prompt("Enter the name of player 2 :", "P2");
  state.p1Name = p1Name === "" ? state.p1Name : p1Name;
  state.p2Name = p2Name === "" ? state.p2Name : p2Name;

  resetCurrentGame();
}

/**
 * check if there is a winner or not for the turn
 * @returns true or false
 */
function checkWinner() {
  for (let i = 0; i < state.winningCombinaison.length; i++) {
    let winningTrack = state.winningCombinaison[i];
    let p1 = winningTrack[0];
    let p2 = winningTrack[1];
    let p3 = winningTrack[2];

    if (
      state.gameboard[p1] === state.gameboard[p2] &&
      state.gameboard[p2] === state.gameboard[p3] &&
      state.gameboard[p3] === state.currentPlayer
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Check if we have a draw for the turn
 * @returns true or false
 */
function checkDraw() {
  if (checkWinner()) {
    return false;
  } else {
    return state.emptyTiles === 0;
  }
}

/**
 * check if a tile is empty
 * @param {*} tile a tile on the board
 * @returns true or false
 */
function checkEmptyTile(tile) {
  return (
    !Array.from(tile.classList).includes("⚔️") &&
    !Array.from(tile.classList).includes("🛡️")
  );
}

/**
 * switch turn between players
 */
function switchTurn() {
  if (state.currentPlayer === "🛡️") {
    state.currentPlayer = "⚔️";
    domElements.p1Turn.classList.toggle("show");
    domElements.p2Turn.classList.toggle("show");
  } else {
    state.currentPlayer = "🛡️";
    domElements.p1Turn.classList.toggle("show");
    domElements.p2Turn.classList.toggle("show");
  }
}

/**
 * show a pop up after the timer run out
 * @param {string} msg message to display
 */
function showPopUpGameWinner(msg) {
  domElements.gamePop.textContent = msg;
  domElements.gamePopWrapper.classList.add("show-pop");
}

/**
 * show a pop up at the end of a turn
 * @param {string} msg message to display
 */
function showPopUpTurn(msg) {
  domElements.turnPop.textContent = msg;
  domElements.turnPopWrapper.classList.add("show-pop");
  setTimeout(() => {
    domElements.turnPopWrapper.classList.remove("show-pop");
  }, 2000);
}

/**
 * find the winner and trigger the apparition of the final pop up
 */
function winner() {
  if (state.p1Score > state.p2Score) {
    showPopUpGameWinner(`⚔️${state.p1Name} win the game`);
  } else if (state.p1Score > state.p2Score) {
    showPopUpGameWinner(`🛡️${state.p2Name} win the game`);
  } else {
    showPopUpGameWinner(`No Winner : Draw`);
  }
}

/**
 * Show player who win the turn onscreen
 */
function setTurnWinner() {
  domElements.p1Score.textContent = state.p1Score;
  domElements.p2Score.textContent = state.p2Score;
  showPopUpTurn(`${state.currentPlayer} win the turn`);
}
/**
 *
 * @param {domElement} tile a tile on the board
 * @param {position} pos a position on the board
 */
function playTurn(tile, pos) {
  if (!state.turnEnd && checkEmptyTile(tile)) {
    tile.classList.add(state.currentPlayer);
    tile.textContent = state.currentPlayer;
    state.gameboard[pos] = state.currentPlayer;
    state.emptyTiles -= 1;
    if (checkDraw()) {
      showPopUpTurn("Draw");
      resetCurrentGame();
    } else if (checkWinner()) {
      state.currentPlayer === "⚔️" ? state.p1Score++ : state.p2Score++;
      setTurnWinner();
      resetCurrentGame();
    } else {
      switchTurn();
    }
  }
}

/**
 * Used to play the game
 */
function play() {
  domElements.cells.forEach((cell) => {
    cell.addEventListener("click", (e) => {
      const tile = e.target;
      const classArr = Array.from(tile.classList);
      const pos = classArr[classArr.length - 1];

      playTurn(tile, pos);
    });
  });
}

/**
 * Control the timer
 */
function gameTimeControl() {
  if (state.time > 0) {
    setInterval(updateCountdawn, 1000);
  } else if (state.time === 0) {
    winner();
  }
}

initGame();
gameTimeControl();
play();
