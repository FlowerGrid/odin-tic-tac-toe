// build game board as an array inside a gameBoard object
// each space on the board is an index 0-8, and they contain either 'X', 'O', or null
// each space should have an isFilled quality that determines whether or not you can play there.
// Maybe that's just if it's null you can fill otherwise no


// players will be stored in objects
// player have a name, and a marker. I suppose they can have a score as well


// Object to control the flow of the game
// start game, make board, create players, determine whose turn, let player make a move

function game() {

    const player1 = createPlayer('Player 1', 'X', true);
    const player2 = createPlayer('Player 2', 'O', false);
    const players = [player1, player2]
    let currentPlayer = player1


// Ordered to favor center indices as having a higher chance of being included
// in a winning pattern
const winStates = [
    [1, 4, 7],
    [3, 4, 5],
    [0, 4, 8],
    [2, 4, 6],
    [0, 1, 2],
    [6, 7, 8],
    [0, 3, 6],
    [2, 5, 8]
];
    
    const gameBoard = (function () {
        spaces = []

        const show = () => {return [...spaces]}
        
        const addMark = (index) => {
            spaces[index] = currentPlayer.getMark()
        }
        const checkIndex = (index) => {
            return spaces[index]
        }
        const size = () => {return spaces.length}

        return {show, addMark, checkIndex, size}
    })();
    // vertical wins    [0, 1, 2], [3, 4, 5], [6, 7, 8]
    // horizontal wins  [0, 3, 6], [1, 4, 7], [2, 5, 8]
    // diagonal wins    [0, 4, 8], [2, 4, 6]


    function createPlayer(name, mark, isTurn) {
        name = name;
        mark = mark;
        isTurn = isTurn;

        let score = 0

        const getName = () => {return name}
        const getMark = () => {return mark}
        const getScore = () => {return score}
        const getTurn = () => {return isTurn}

        const setScore = () => {return score++}
        const setTurn = () => {return isTurn = !isTurn}
        

        return {getName, getMark, getScore, setScore, getTurn, setTurn}
    }


    function toggleTurn() {
        for (let player of players) {
            player.setTurn();
            if (player.getTurn()){
                currentPlayer = player;
            } 
        } 
    }

    // TODO: alert to the player when they pick an occupied space and let them go again
    function takeTurn(space) {

        if(gameBoard.checkIndex(space) || space > 8) {
            alert("Please choose an empty space")
            revealBoard()
            displayPlayer()
            return                    
        } else {
            gameBoard.addMark(space);
        }

        if (checkWinState()) {
            win()
        }
        toggleTurn()
        revealBoard()
        displayPlayer()
    }


    function revealBoard() {
        // console.log(gameBoard.spaces)
        console.log(gameBoard.show())

    }


    function checkWinState() {
        let boardState = gameBoard.show()
        for (state of winStates) {
            const [i, j, k] = state;
            let slot1 = boardState[i];
            let slot2 = boardState[j];
            let slot3 = boardState[k];
            if (slot1 && slot1 === slot2 && slot2 === slot3) {
                return true
            }

        }
        return false
    }


    function win() {
        alert(`${currentPlayer.getName()} wins!`)
        currentPlayer.setScore()
    }


    function displayPlayer() {
        console.log(`It's ${currentPlayer.getName()}'s turn`)
    }


    function showStats() {
        for (let player of players) {
            console.log(player.getName(), player.getScore())
        }
    }

    return {takeTurn, revealBoard, showStats}
}

let gm = game()