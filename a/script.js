document.addEventListener('DOMContentLoaded', function () {
  const board = document.getElementById('board');
  const cells = [];

  let currentPlayer = 'black';
  let gameOver = false;
  let passCount = 0;

  // Create the game board
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener('click', handleClick);
      board.appendChild(cell);
      cells.push(cell);
    }
  }

  // Initial game setup
  cells[27].classList.add('black');
  cells[28].classList.add('white');
  cells[35].classList.add('white');
  cells[36].classList.add('black');

  // Handle click event on cells
  function handleClick(event) {
    if (gameOver) return;

    const clickedCell = event.target;
    const row = parseInt(clickedCell.dataset.row);
    const col = parseInt(clickedCell.dataset.col);

    if (!isValidMove(row, col)) return;

    flipCells(row, col);
    clickedCell.classList.add(currentPlayer);

    if (isGameOver()) {
      gameOver = true;
      setTimeout(function () {
        alert('Game over!');
        resetGame();
      }, 500);
      return;
    }

    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';

    if (currentPlayer === 'white') {
      setTimeout(computerMove, 500);
    }
  }

  // Check if a move is valid
  function isValidMove(row, col) {
    const clickedCell = cells[row * 8 + col];

    if (clickedCell.classList.contains('black') || clickedCell.classList.contains('white'))
      return false;

    const directions = [
      { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
      { row: 0, col: -1 }, /* clicked cell */ { row: 0, col: 1 },
      { row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 }
    ];

    for (const dir of directions) {
      let currentRow = row + dir.row;
      let currentCol = col + dir.col;
      let foundOpponent = false;

      while (currentRow >= 0 && currentRow < 8 && currentCol >= 0 && currentCol < 8) {
        const currentCell = cells[currentRow * 8 + currentCol];

        if (currentCell.classList.contains(currentPlayer)) {
          if (foundOpponent) return true;
          break;
        }

        if (!currentCell.classList.contains('black') && !currentCell.classList.contains('white'))
          break;

        foundOpponent = true;
        currentRow += dir.row;
        currentCol += dir.col;
      }
    }

    return false;
  }

  // Flip the opponent's cells
  function flipCells(row, col) {
    const directions = [
      { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
      { row: 0, col: -1 }, /* clicked cell */ { row: 0, col: 1 },
      { row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 }
    ];

    for (const dir of directions) {
      let currentRow = row + dir.row;
      let currentCol = col + dir.col;
      let foundOpponent = false;
      const cellsToFlip = [];

      while (currentRow >= 0 && currentRow < 8 && currentCol >= 0 && currentCol < 8) {
        const currentCell = cells[currentRow * 8 + currentCol];

        if (currentCell.classList.contains(currentPlayer)) {
          if (foundOpponent) {
            for (const cell of cellsToFlip) {
              cell.classList.remove('white', 'black');
              cell.classList.add(currentPlayer);
            }
          }
          break;
        }

        if (!currentCell.classList.contains('black') && !currentCell.classList.contains('white'))
          break;

        foundOpponent = true;
        cellsToFlip.push(currentCell);
        currentRow += dir.row;
        currentCol += dir.col;
      }
    }
  }

  // Check if the game is over
  function isGameOver() {
    for (const cell of cells) {
      if (!cell.classList.contains('black') && !cell.classList.contains('white')) {
        if (isValidMove(parseInt(cell.dataset.row), parseInt(cell.dataset.col)))
          return false;
      }
    }
    return true;
  }

  // Make a random computer move
  function computerMove() {
    const validMoves = [];

    for (const cell of cells) {
      if (!cell.classList.contains('black') && !cell.classList.contains('white')) {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        if (isValidMove(row, col))
          validMoves.push(cell);
      }
    }

    if (validMoves.length === 0) {
      passCount++;
      if (passCount === 2) {
        gameOver = true;
        setTimeout(function () {
          alert('Game over!');
          resetGame();
        }, 500);
      } else {
        currentPlayer = 'black';
      }
      return;
    }

    passCount = 0;

    const randomCell = validMoves[Math.floor(Math.random() * validMoves.length)];
    const row = parseInt(randomCell.dataset.row);
    const col = parseInt(randomCell.dataset.col);

    flipCells(row, col);
    randomCell.classList.add(currentPlayer);

    if (isGameOver()) {
      gameOver = true;
      setTimeout(function () {
        alert('Game over!');
        resetGame();
      }, 500);
      return;
    }

    currentPlayer = 'black';
  }

  // Reset the game
  function resetGame() {
    for (const cell of cells) {
      cell.classList.remove('black', 'white', 'valid-move', 'game-over');
    }

    currentPlayer = 'black';
    gameOver = false;
    passCount = 0;
  }
});
