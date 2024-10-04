// Selecting DOM elements
const gameBoard = document.getElementById('game-board');
const moveCounter = document.getElementById('move-counter');
const timerDisplay = document.getElementById('timer');
const restartButton = document.getElementById('restart-button');

let symbols = [
    '🍎', '🍌', '🍇', '🍓',
    '🍉', '🍒', '🍍', '🥝'
];

let cardSymbols = [...symbols, ...symbols]; // Duplicate symbols for pairs
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let timer = 0;
let timerInterval = null;

// Function to shuffle the cards using Fisher-Yates algorithm
function shuffle(array) {
    for (let i = array.length -1; i >0; i--) {
        const j = Math.floor(Math.random() * (i +1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to initialize the game
function initGame() {
    // Reset variables
    gameBoard.innerHTML = '';
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    moves = 0;
    matchedPairs = 0;
    timer = 0;
    moveCounter.textContent = moves;
    timerDisplay.textContent = timer;

    // Shuffle cards
    shuffle(cardSymbols);

    // Create tile elements
    cardSymbols.forEach(symbol => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.dataset.symbol = symbol;

        const front = document.createElement('div');
        front.classList.add('tile-inner', 'front');
        front.textContent = symbol;

        const back = document.createElement('div');
        back.classList.add('tile-inner', 'back');

        tile.appendChild(front);
        tile.appendChild(back);

        tile.addEventListener('click', flipTile);

        gameBoard.appendChild(tile);
    });

    // Start the timer
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timer++;
        timerDisplay.textContent = timer;
    }, 1000);
}

// Function to flip a tile
function flipTile() {
    if (lockBoard) return;
    if (this === firstCard) return;
    if (this.classList.contains('matched')) return;

    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;
    moves++;
    moveCounter.textContent = moves;

    checkForMatch();
}

// Function to check if two flipped tiles match
function checkForMatch() {
    const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;

    if (isMatch) {
        disableTiles();
    } else {
        unflipTiles();
    }
}

// Function to disable matched tiles
function disableTiles() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    resetBoard();

    matchedPairs++;

    if (matchedPairs === symbols.length) {
        endGame();
    }
}

// Function to unflip tiles if they don't match
function unflipTiles() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');

        resetBoard();
    }, 1000);
}

// Function to reset board state
function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

// Function to end the game
function endGame() {
    clearInterval(timerInterval);
    setTimeout(() => {
        alert(`Congratulations! You completed the game in ${moves} moves and ${timer} seconds.`);
    }, 500);
}

// Event listener for restart button
restartButton.addEventListener('click', initGame);

// Initialize the game on page load
window.onload = initGame;
