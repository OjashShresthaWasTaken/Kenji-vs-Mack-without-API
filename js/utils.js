// Initialize scores from local storage or default to 0
let gameScores = JSON.parse(localStorage.getItem('gameScores')) || {
  playerWins: 0,
  enemyWins: 0,
  ties: 0,
};

let winnerDetermined = false;

function updateScores() {
  // Update local storage
  localStorage.setItem('gameScores', JSON.stringify(gameScores));

  // Update the score display in the UI if present
  const scoreBox = document.querySelector('#scoreBox');
  if (scoreBox) {
    scoreBox.innerHTML = `
      <p>Player Wins: ${gameScores.playerWins}</p>
      <p>Enemy Wins: ${gameScores.enemyWins}</p>
      <p>Ties: ${gameScores.ties}</p>
    `;
  }
}

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function determineWinner({ player, enemy, timerId }) {
  if (winnerDetermined) return;

  clearTimeout(timerId);
  document.querySelector('#displayText').style.display = 'flex';

  console.log("Player Health:", player.health, "Enemy Health:", enemy.health);
  console.log("Current Scores:", gameScores);

  if (player.health === enemy.health) {
    gameScores.ties++;
    document.querySelector('#displayText').innerHTML = 'Tie. Press Esc to return to home page.';
  } else if (player.health > enemy.health) {
    gameScores.playerWins++;
    document.querySelector('#displayText').innerHTML = 'Player 1 Wins. Press Esc to return to home page.';
  } else if (player.health < enemy.health) {
    gameScores.enemyWins++;
    document.querySelector('#displayText').innerHTML = 'Player 2 Wins. Press Esc to return to home page.';
  }

  winnerDetermined = true;

  updateScores();
}

let timer = 60;
let timerId;

function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector('#timer').innerHTML = timer;
  }

  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  }
}

updateScores();
