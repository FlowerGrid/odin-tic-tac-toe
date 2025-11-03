// build game board as an array inside a gameBoard object
// each space on the board is an index 0-8, and they contain either 'X', 'O', or null
// each space should have an isFilled quality that determines whether or not you can play there.
// Maybe that's just if it's null you can fill otherwise no
// function makeBoard() {
//     return {
//         spaces: [null, null, null, null, null, null, null, null]
//     }
// }

// players will be stored in objects
// player have a name, and a marker. I suppose they can have a score as well
// function createPlayer(name, mark) {
//     return {
//         name: name,
//         mark: mark,
//         score: 0
//     }
// }


// Object to control the flow of the game
// start game, make board, create players, determine whose turn, let player make a move

const gm = (function game() {

    const player1 = createPlayer('Player 1', 'X', true);
    const player2 = createPlayer('Player 2', 'O', false);
    const players = [player1, player2]
    const board = {
        spaces: [null, null, null, null, null, null, null, null]
    };


    function createPlayer(name, mark, isTurn) {
        name = name;
        mark = mark;
        isTurn = isTurn;

        let score = 0

        return {name, mark, score, isTurn}
    }


    function toggleTurn() {
        for (let player of players) {
            player.isTurn = !player.isTurn;
        }
        
    }


    function takeTurn(space) {
        for (let player of players) {
            if (player.isTurn === true) {
                if(board.spaces[space] === null) {
                board.spaces[space] = player.mark;
                }
            }
        }
        toggleTurn()
    }


    function sayName() {
        alert(player1.name)
    }


    function revealBoard() {
        console.log(board.spaces)
    }


    return {takeTurn, sayName, revealBoard}
})();