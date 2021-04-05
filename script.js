const gameSquares = document.querySelector('.game-squares');
const gameColumns = document.querySelectorAll('.game-column');
const gameBoard = document.querySelector('.game-board');
const player1 = document.querySelector('.player-1');
const player2 = document.querySelector('.player-2');
const scoreBoard = document.querySelector('.score-board');
const gameMsg = document.querySelector('.game-title');
const gameInfoText = document.querySelector('.game-info-text')


// Array to keep track of the game pieces
const gameArray = 
[0, 0, 0, 0, 0, 0, 0, 'x',
 0, 0, 0, 0, 0, 0, 0, 'x',
 0, 0, 0, 0, 0, 0, 0, 'x',
 0, 0, 0, 0, 0, 0, 0, 'x',
 0, 0, 0, 0, 0, 0, 0, 'x',
 0, 0, 0, 0, 0, 0, 0, 'x',
'x','x','x','x','x','x','x']

let activePlayer = 1;
let gamePlaying = true;
const score = [0, 0];

const switchToP1 = () => {
  activePlayer = 1;
  player1.classList.add('active-player');
  player2.classList.remove('active-player');
}

const switchPlayer = () => {
  if (activePlayer === 1) {
    activePlayer = 2;
    player1.classList.remove('active-player');
    player2.classList.add('active-player');
  } else if (activePlayer === 2) {
   switchToP1();
  }
};

// Render the game with pieces in correct colors
const renderGame = (lastIndex) => {
  gameSquares.innerHTML = "";
  let gameHtml = "";
  let winCircle = "";

  // Check if board is full (draw)
  let zeroCount = 0;
  gameArray.forEach(square => {
    if (square === 0) {
      zeroCount++;
    }
  });
  
  // Check which CSS-class to add to each game piece
  gameArray.forEach((square, index) => {
    if (square !== "x") {
      let colorClass = "";
      if (square === 1) {
        colorClass = 'player1-color';
      } else if (square === 2) {
        colorClass = 'player2-color';
      } else if (square === 'w') {
        winCircle = `<div class="slot-border-win"></div>`
        if (activePlayer === 1) {
          colorClass = 'p1-winner-color';
        } else {
          colorClass = 'p2-winner-color';
        }
        gameMsg.innerHTML = 'PLAYER' + ' ' + activePlayer + ' WINS!';
      }

      // If the piece is the last piece placed, add animation
      if (index === lastIndex) {
        colorClass += ' drop-animation';
      }

      gameHtml += 
      `<div class="slot">
        <div class="slot-border"></div>
        <div class="slot-border-highlight"></div>
        ${winCircle}
        <div class="gameboard-hole"></div>
        <div class="game-piece ${colorClass}"></div>
      </div>`;
    
    };
    winCircle = ""; 
  });

  gameSquares.innerHTML = gameHtml;
  if (zeroCount === 0) {
    gamePlaying = false;
    gameMsg.innerHTML = `DRAW!`;
  } 
};

renderGame();

// Count to see how many you have in a row
// Function is reused for each direction on the board
const countScore = (startIndex, count) => {
  let tracker = 1;
  let currentArray = [startIndex];
  let minusCount = startIndex;
  let plusCount = startIndex;

  while (tracker === 1) {
    if (gameArray[plusCount + count] === activePlayer) {
      currentArray.push(plusCount + count);
      plusCount += count;
    } else {
      tracker = 0;
    }
  }

  tracker = 1;

  while (tracker === 1) {
    if (gameArray[minusCount - count] === activePlayer) {
      currentArray.push(minusCount - count);
      minusCount -= count;
    } else {
      tracker = 0;
    }
  }

  // Returns an array with indexes of the pieces that are in a row, in the direction currently checked
  return currentArray;
};

resetGame = () => {
  gameArray.forEach((current, index) => {
    if (current !== 'x') {
      gameArray[index] = 0;
    }
  });
  gameMsg.innerHTML = `4 IN A ROW`
  switchToP1();
}

gameBoard.addEventListener('click', e => {
  if (gamePlaying) {
    // Set startIndex, which column is the piece dropped into?
    let startIndex = Number(e.target.getAttribute('data-start-index'));

    if (gameArray[startIndex] === 0) {
      let fallIndex = 8;
      for (i = 0; i < 6; i++) {
        if (gameArray[startIndex + fallIndex]) {
          gameArray[startIndex] = activePlayer;
          break;
        } else {
          startIndex += fallIndex;
        }
      }
    } else {
      return 'column is full';
    }

    // Check each direction using the countScore-function
    // Will be an array of arrays containing the indexes of all pieces that are currently in a row for the active player
    let scoreArray = [
      countScore(startIndex, 1),
      countScore(startIndex, 8),
      countScore(startIndex, 7),
      countScore(startIndex, 9)
    ];

    // Check if the length of any array in the scoreArray is 4 or longer
    scoreArray.forEach((current, index) => {
      if (current.length >= 4) {
        gamePlaying = false;
        gameInfoText.classList.remove('display-none');
        score[activePlayer - 1] += 1;
        scoreBoard.innerHTML = `${score[0]} - ${score[1]}`
        scoreArray[index].forEach(current => {
          gameArray[current] = 'w';
        });
      }
    });

    renderGame(startIndex);

    if (gamePlaying) {
      switchPlayer();
    }

  } else {
    resetGame();
    renderGame();
    gameInfoText.classList.add('display-none');
    gamePlaying = true;
  }

});





