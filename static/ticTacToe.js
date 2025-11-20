// TODO:
// - New game button resets the game board, doesn't effect scores ✅
// - Reset terminates the current game and creates a new game with new players
//   and zeroes out scores ✅
// - Need to add event listeners to menu buttons and marker spaces ✅
// - Clicking on a marker space indexes into that space on the board array and 
//   fills it with that player's marker ✅
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


// UI Manager
(function () {
    // Locate important html elements
    const gameControlsElement = document.querySelector('.game-controls');
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
    });

    gameControlsElement.addEventListener('mousedown', (event) => {
        let target = event.target;
        target.classList.toggle('btn-dwn');
    });

    gameControlsElement.addEventListener('mouseup', (event) => {
        let target = event.target;
        target.classList.toggle('btn-dwn');
        if(target.id === 'new-game-btn') {
            pubsub.publish('btnPressed', 'newGame');
        } else if (target.id === 'reset-btn') {
            pubsub.publish('btnPressed', 'reset');
        }
        
    });

    const markSpace = (board) => {
        for (let i = 0; i < board.length; i++){
            let boardSpaceElement = document.querySelector(`#marker-space${i}`);
            boardSpaceElement.classList.remove('x-marker', 'o-marker');
            if (board[i]) {
                boardSpaceElement.classList.toggle(`${board[i]}-marker`);
            }
        }};

    const updateScore = (player) => {
        let id = extractPlayerId(player);
        let playerScore = document.querySelector(`#p${id}-score`);
        playerScore.textContent = player.getScore()
    }

    function extractPlayerId(player) {
        return player.getplayerId()
    }

    // Pubsub Subscriptions
    pubsub.subscribe('boardChanged', (board) => {
        markSpace(board)
    });

    pubsub.subscribe('win', (players) => {
        players.forEach((player) => {
            updateScore(player);
        })
    });

    pubsub.subscribe('gameStateChange', (payload) => {
        // updateScore(payload.players);
        payload.players.forEach((player) => {
            updateScore(player);
        })
        markSpace(payload.clearedBoard);
    })

    pubsub.subscribe('turnChange', (data) => {
        for (let playerElement of [p1Element, p2Element]) {
            playerElement.classList.toggle('my-turn');
        }
    })

    pubsub.subscribe('coinToss', (id) => {
        console.log(id)
        for (let playerElement of [p1Element, p2Element]) {
            playerElement.classList.remove('my-turn');
        }
        if (id === 1) {
            p1Element.classList.toggle('my-turn');
        } else {
            p2Element.classList.toggle('my-turn');
        }
    })

})();


// Game Handler
(function game() {

    let status = false;
    const player1 = createPlayer('Player 1', 1, 'x', false);
    const player2 = createPlayer('Player 2', 2, 'o', false);
    const players = [player1, player2]

    // TODO: write a coin toss mechanic to determine who goes first
    let currentPlayer;

    function coinToss() {
        for (let player of players) {
            player.resetTurn();
        }
        if (Math.floor(Math.random() * 2) === 0) {
            currentPlayer = player1;
        } else {
            currentPlayer = player2;
        }
        currentPlayer.setTurn();

        pubsub.publish('coinToss', currentPlayer.getplayerId())
        
        return currentPlayer
    }

    currentPlayer = coinToss();
    console.log(currentPlayer.getName())
    console.log(currentPlayer.getTurn())


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
            pubsub.publish('boardChanged', (show()))
        }

        const checkIndex = (index) => {
            return spaces[index]
        }
        const size = () => {return spaces.length}

        const clearBoard = () => {
            spaces = Array(9).fill(null);
            return show()
        }

        return {show, addMark, checkIndex, size, clearBoard}
    })();
    // vertical wins    [0, 1, 2], [3, 4, 5], [6, 7, 8]
    // horizontal wins  [0, 3, 6], [1, 4, 7], [2, 5, 8]
    // diagonal wins    [0, 4, 8], [2, 4, 6]


    function createPlayer(name, playerId, mark, isTurn) {
        let score = 0

        const getName = () => {return name}
        const getMark = () => {return mark}
        const getScore = () => {return score}
        const getTurn = () => {return isTurn}
        const getplayerId = () => {return playerId}

        const setScore = () => {
            score++;
            return score
        }
        const setTurn = () => {return isTurn = !isTurn}
        const resetTurn = () => {return isTurn = false}

        const resetScore = () => {
            score = 0;
            return score
        }

        return {getName, getMark, getScore, getplayerId, setScore, getTurn, setTurn, resetTurn, resetScore}
    }


    function toggleTurn() {
        for (let player of players) {
            player.setTurn();
            if (player.getTurn()){
                currentPlayer = player;
            } 
        } 
        pubsub.publish('turnChange', currentPlayer)
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
                pubsub.publish('win', players);
            }

        }
        return false
    }


    function win() {
        console.log(`${currentPlayer.getName()} wins!`);
        currentPlayer.setScore();
        // TODO:
        // Disable click event on board
    }


    function displayPlayer() {
        console.log(`It's ${currentPlayer.getName()}'s turn`)
    }


    function showStats() {
        for (let player of players) {
            console.log(player.getName(), player.getScore())
        }
    }

    function resetGame() {
        clearedBoard = gameBoard.clearBoard();
        for (let player of players){
            player.resetScore();
        }
    }

    // Pubsub Subscriptions
    pubsub.subscribe('spaceClicked', (space) => {
        takeTurn(space);
    });

    pubsub.subscribe('turnTaken', (data) => {
        checkWinState();
        toggleTurn()
    });

    pubsub.subscribe('btnPressed', (data) => {
        if (data === 'reset'){
            resetGame();
            pubsub.publish('gameStateChange', {clearedBoard, players})
        } else if (data === 'newGame') {
            clearedBoard = gameBoard.clearBoard()
            pubsub.publish('gameStateChange', {clearedBoard, players})
        }
        coinToss()
    })

    return {takeTurn, revealBoard, showStats}
    
})();





// let gm = game()