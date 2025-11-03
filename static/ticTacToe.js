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

const theGame = (function game() {


    function createPlayer(name, mark) {

        name = name;
        mark = mark;
        score = 0;
        isTurn = false;

        function takeTurn(space) {
            if(board.spaces[space] !== null) {
                board.spaces[space] = mark;
            }
        }
        return {name, mark, score, isTurn, takeTurn}
    }

    function createGame() {
        const player1 = createPlayer('Player 1', 'X');
        const player2 = createPlayer('Player 2', 'O')
        const players = [player1, player2]
        const board = () => {
            return {
                spaces: [null, null, null, null, null, null, null, null]
            }
        };
        return {player1, player2, board}
    }

    return {createGame}
})();



