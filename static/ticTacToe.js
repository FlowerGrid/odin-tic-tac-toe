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
    const gameBoard = {
        spaces: []
    };
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

        const setScore = () => {return score++}

        return {getName, getMark, getScore, setScore, isTurn}
    }


    function toggleTurn() {
        for (let player of players) {
            player.isTurn = !player.isTurn;
            if (player.isTurn === true){
                currentPlayer = player;
            } 
        }
        
    }

    // TODO: alert to the player when they pick an occupied space and let them go again
    function takeTurn(space) {
        for (let player of players) {
            if (player.isTurn === true) {
                if(gameBoard.spaces[space] || space > 8) {
                    alert("Please choose an empty space")
                    revealBoard()
                    displayPlayer()
                    return                    
                } else {
                    gameBoard.spaces[space] = player.getMark();
                }
            }
        }
        // checkWinState()
        toggleTurn()
        revealBoard()
        displayPlayer()
    }


    function revealBoard() {
        console.log(gameBoard.spaces)
        console.log(gameBoard.spaces.length)
    }


    function checkWinState() {
        // vertical wins    [0, 1, 2], [3, 4, 5], [6, 7, 8]
        // horizontal wins  [0, 3, 6], [1, 4, 7], [2, 5, 8]
        // diagonal wins    [0, 4, 8], [2, 4, 6]
        if ((gameBoard.spaces.length >= 3)
            && ((gameBoard.spaces[0] === gameBoard.spaces[1] && gameBoard.spaces[1] === gameBoard.spaces[2])
            || (gameBoard.spaces[3] === gameBoard.spaces[4] && gameBoard.spaces[4] === gameBoard.spaces[5])
            || (gameBoard.spaces[6] === gameBoard.spaces[7] && gameBoard.spaces[7] === gameBoard.spaces[8]))
        ) {
            alert(`${currentPlayer.getName()} wins!`)
            currentPlayer.setScore()
        }
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