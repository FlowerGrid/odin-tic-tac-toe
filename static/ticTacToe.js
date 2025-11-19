// TODO:
// - New game button resets the game board, doesn't effect scores
// - Reset terminates the current game and creat4es a new game with new players
//   and zeroes out scores
// - Need to add event listeners to menu buttons and marker spaces
// - Cllicking on a marker space indexes into that space on the board array and 
//   fills it with that player's marker
// - Need to display whose turn it is
//   - I might highlight the player's name in the menu or simply write it above
//     the game board
// - Somehow need to let the players enter their own names
// - I need end game logic to end the game when a winstate is achieved or the 
//   board has no more free spaces

// PUBSUB
const pubsub = {
  events: {},
  subscribe: function (eventName, fn) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  },
  ounsubscribe: function(eventName, fn) {
    if (this.events[eventName]) {
      for (var i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i] === fn) {
          this.events[eventName].splice(i, 1);
          break;
        }
      };
    }
  },
  publish: function (eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function(fn) {
        fn(data);
      });
    }
  }
};


function game() {

    const player1 = createPlayer('Player 1', 1, 'x', true);
    const player2 = createPlayer('Player 2', 2, 'o', false);
    const players = [player1, player2]

    // TODO: write a coin toss mechanic to determine who goes first
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
        let spaces = Array(9).fill(null);

        const show = () => {return [...spaces]}
        
        const addMark = (index) => {
            let playerMark = currentPlayer.getMark();
            spaces[index] = playerMark;
            pubsub.publish('boardChanged', (spaces))
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


    function createPlayer(name, playerNum, mark, isTurn) {
        let score = 0

        const getName = () => {return name}
        const getMark = () => {return mark}
        const getScore = () => {return score}
        const getTurn = () => {return isTurn}
        const getPlayerNum = () => {return playerNum}

        const setScore = () => {
            score++;
            pubsub.publish('scoreUpdate', currentPlayer)
            return score
        }
        const setTurn = () => {return isTurn = !isTurn}


        return {getName, getMark, getScore, getPlayerNum, setScore, getTurn, setTurn}
    }


    function toggleTurn() {
        for (let player of players) {
            player.setTurn();
            if (player.getTurn()){
                currentPlayer = player;
            } 
        } 
    }


    function takeTurn(space) {

        if(gameBoard.checkIndex(space) || space > 8) {
            alert("Please choose an empty space")
            revealBoard()
            displayPlayer()
            return                    
        } else {
            gameBoard.addMark(space);
            pubsub.publish('turnTaken', true)
        }

        // if (checkWinState(boardState)) {
        //     win()
        // } else {
        //     toggleTurn()
        //     revealBoard()
        //     displayPlayer()
        // }
    }


    function revealBoard() {
        console.log(gameBoard.show());
    }


    function checkWinState(boardState) {
        if(!boardState){
            boardState = gameBoard.show()
        }
        
        for (state of winStates) {
            const [i, j, k] = state;
            let slot1 = boardState[i];
            let slot2 = boardState[j];
            let slot3 = boardState[k];
            if (slot1 && slot1 === slot2 && slot2 === slot3) {
                win();
                pubsub.publish('win', currentPlayer);
            }

        }
        return false
    }


    function win() {
        // alert(`${currentPlayer.getName()} wins!`)
        console.log(`${currentPlayer.getName()} wins!`);
        currentPlayer.setScore();
        // TODO:
        // Disable click event on board
    }

    // function showScore(player) {
    //     let 
    // }


    function displayPlayer() {
        console.log(`It's ${currentPlayer.getName()}'s turn`)
    }


    function showStats() {
        for (let player of players) {
            console.log(player.getName(), player.getScore())
        }
    }

    pubsub.subscribe('spaceClicked', (space) => {
        takeTurn(space);
    });

    pubsub.subscribe('turnTaken', (data) => {
        checkWinState();
        toggleTurn()
    })

    return {takeTurn, revealBoard, showStats}
}


// newGameBtn.addEventListener('click', () => {
//     gm = game()

// })


const uiManager = (function () {
    // Locate important html elements
    const newGameBtn = document.querySelector('#new-game-btn');
    const resetBtn = document.querySelector('#reset-btn');
    const gameBoardElement = document.querySelector('#game-board');
    const p1Element = document.querySelector('#player1');
    const p2Element = document.querySelector('#player2');

    // Listenters
    gameBoardElement.addEventListener('click', (event) => {
    let target = event.target;
    let spaceIdx = target.dataset.spaceIdx;
    pubsub.publish("spaceClicked", spaceIdx)
    return spaceIdx
    })

    const markSpace = (board) => {
        for (let i = 0; i < board.length; i++){
            if (board[i]) {
                let boardSpaceElement = document.querySelector(`#marker-space${i}`);
                boardSpaceElement.classList.remove('x-marker', 'o-marker');
                boardSpaceElement.classList.toggle(`${board[i]}-marker`);
            }
        }};

    const updateScore = (player) => {
        let playerNum = player.getPlayerNum();
        let playerScore = document.querySelector(`#p${playerNum}-score`);
        playerScore.textContent = player.getScore()
    }

    pubsub.subscribe('boardChanged', (board) => {
        markSpace(board)
    });

    pubsub.subscribe('win', (player) => {
        updateScore(player);
    });

    return {markSpace}

})();



let gm = game()