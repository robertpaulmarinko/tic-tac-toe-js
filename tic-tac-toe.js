let board = [['','',''],['','',''],['','',''],];
let currentPlayer = '';
let playComputer = false;
const player1 = 'Duck';
const player2 = 'Shark';
let gameOn = true;

function startGame() {
    createBoardDisplay();
    nextPlayer();
}

/**
 * Display the current X and Os
 */
function updateBoardDisplay() {
    for(let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const cellId = getCellId(row, col);
            document.getElementById(cellId).innerHTML = '';
            if (board[row][col] === player1) {
                const imageElement = document.createElement('img');
                imageElement.setAttribute('src', 'img/icons8-duck-96.png');
                document.getElementById(cellId).appendChild(imageElement);
        
            } else if (board[row][col] === player2) {
                const imageElement = document.createElement('img');
                imageElement.setAttribute('src', 'img/icons8-shark-96.png');
                document.getElementById(cellId).appendChild(imageElement);

            } else {
                
            }

        }
    }
}

/**
 * 1st time initiliazation of the board
 */
function createBoardDisplay() {
    for(let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const cellId = getCellId(row, col);
            document.getElementById(cellId).addEventListener('click', () => {
                handleCellClick(row, col);
            })
        }
    }

    hidePlayAgainButton();
    document.getElementById('playAgain').addEventListener('click', () => {
        restartGame();
    });
}

function getCellId(row, col) {
    return `cell-${row}-${col}`;
}

function handleCellClick(row, col) {
    if (!gameOn) return;

    if (board[row][col] === '') {
        board[row][col] = currentPlayer;
        updateBoardDisplay();
        if (!checkForEndOfGame()) {
            nextPlayer()
        } 
    }
}

function showMessage(message) {
    document.getElementById('message').innerHTML = message;
}

function nextPlayer() {
    if (currentPlayer === player1) {
        currentPlayer = player2
        if (playComputer) {
            setTimeout(() => {
                computerMove();
                updateBoardDisplay();
                if (!checkForEndOfGame()) {
                    nextPlayer()
                } 
            }, 1000);
        }
    } else {
        currentPlayer = player1;
    }

    showMessage(`The ${currentPlayer}'s turn`);
}

function checkForEndOfGame() {
    for(let row = 0; row < 3; row++) {
        if (board[row][0] !== '' && board[row][0] === board[row][1] && board[row][0] === board[row][2]) {
            playerWon(board[row][0]);
            return true;
        }
    }
    for(let col = 0; col < 3; col++) {
        if (board[0][col] !== '' && board[0][col] === board[1][col] && board[0][col] === board[2][col]) {
            playerWon(board[0][col]);
            return true;
        }
    }

    if (board[0][0] !== '' && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
        playerWon(board[0][0]);
        return true;
    }
    if (board[0][2] !== '' && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
        playerWon(board[0][2]);
        return true;
    }
    for(let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row][col] === '') {
                // still empty spaces
                return false;
            }
        }
    }

    showMessage('Tie!');
    gameOn = false;
    showPlayAgainButton();
    return true;
}

function playerWon(player) {
    showMessage(`The ${player} won!`);
    gameOn = false;
    showPlayAgainButton();
}

function showPlayAgainButton() {
    document.getElementById('playAgain').style.display = 'block';
}

function hidePlayAgainButton() {
    document.getElementById('playAgain').style.display = 'none';
}

/**
 * Resets game board for a new game
 */
function restartGame() {
    board = [['','',''],['','',''],['','',''],];
    currentPlayer = '';
    gameOn = true;
    nextPlayer();
    updateBoardDisplay();    
    hidePlayAgainButton();
}

function computerMove() {
    // Check if can win
    if (computerCheckForRow(player2)) {
        return;
    }

    // Check if need to block
    if (computerCheckForRow(player1)) {
        return;
    }

    if (cornerDefense()) {
        return;
    }

    computerChooseBestSquare();
}

/**
 * Check if a row can be completed.
 * If player is set to player2, that means plaer 2 can win
 * If player is set to player1, then means need block player 1 from winning
 * @returns true if block was done
 */
function computerCheckForRow(player) {
    for(let row = 0; row < 3; row++) {
        let playercount = 0;
        let emptyCol = -1;
        for (let col = 0; col < 3; col++) {
            if (board[row][col] === player) {
                playercount++;
            } else if (board[row][col] === '') {
                emptyCol = col;
            }
        }
        if (playercount == 2 && emptyCol >= 0) {
            board[row][emptyCol] = player2;
            return true;
        }
    }

    for(let col = 0; col < 3; col++) {
        let player1count = 0;
        let emptyRow = -1;
        for (let row = 0; row < 3; row++) {
            if (board[row][col] === player) {
                player1count++;
            } else if (board[row][col] === '') {
                emptyRow = row;
            }
        }
        if (player1count == 2 && emptyRow >= 0) {
            board[emptyRow][col] = player2;
            return true;
        }
    }

    return false;
}

function boardMatches(compare) {
    for(let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row][col] !== compare[row][col]) {
                return false;
            }
        }
    }

    return true;
}

/**
 * Special situation when taking the corner is not the best move because
 * player1 can setup two ways to win.
 * @returns 
 */
function cornerDefense() {
    if (boardMatches([[player1,'',''],['',player2,''],['','',player1],])) {
        board[0][1] = player2;
        return true;
    }
    if (boardMatches([['','',player1],['',player2,''],[player1,'',''],])) {
        board[0][1] = player2;
        return true;
    }

    // These 4 are when player starts in a non-corner, non-middle square
    // block on same row/col to prevent multiple ways for player1 to win
    if (boardMatches([['',player1,''],['','',''],['','',''],])) {
        board[0][0] = player2;
        return true;
    }

    if (boardMatches([['','',''],[player1,'',''],['','',''],])) {
        board[0][0] = player2;
        return true;
    }

    if (boardMatches([['','',''],['','',player1],['','',''],])) {
        board[0][2] = player2;
        return true;
    }

    if (boardMatches([['','',''],['','',''],['',player1,''],])) {
        board[2][2] = player2;
        return true;
    }

    return false;
}

function computerChooseBestSquare() {
    if (board[1][1] === '') {
        // take center square
        board[1][1] = player2;
        return;
    }

    // Corners
    if (board[0][0] === '') {
        board[0][0] = player2;
        return;
    }
    if (board[0][2] === '') {
        board[0][2] = player2;
        return;
    }
    if (board[2][0] === '') {
        board[2][0] = player2;
        return;
    }
    if (board[2][2] === '') {
        board[2][2] = player2;
        return;
    }

    // Other spots
    if (board[0][1] === '') {
        board[0][1] = player2;
        return;
    }
    if (board[1][0] === '') {
        board[1][0] = player2;
        return;
    }
    if (board[1][2] === '') {
        board[1][2] = player2;
        return;
    }
    if (board[2][1] === '') {
        board[2][1] = player2;
        return;
    }

}
window.addEventListener("load", (event) => {
    startGame();
    currentPlayer = '';
    updateBoardDisplay();
    nextPlayer();    
});
