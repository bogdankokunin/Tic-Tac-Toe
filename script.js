const playerFabric = (sign) => {
    let turn = false;
    return {sign, turn}
}

const Gameboard = (function() {
    let _gameboard = ['', '', '', '', '', '', '', '', ''];

    const addToBoard = (sign, index) => {
        _gameboard.splice(index, 1, sign);
    }

    const clearBoard = () => {
        for (let i = 0; i< _gameboard.length; i++) {
            _gameboard[i] = '';
        }
    }

    const captureIndex = (sign) => {
        return _gameboard.reduce((sum, current, index) => {
            if (current === `${sign}`) sum.push(index);
            return sum;
        }, []);
    }

    return {clearBoard, addToBoard, captureIndex}
})();

const gameFlow = (() => {
        let _player1 = playerFabric('X');
    let _player2 = playerFabric('O');

    const changeTurn = () => {
        if (_player1.turn === true) {
            _player1.turn = false;
            _player2.turn = true;
            return _player1.sign;
        }
        else if (_player2.turn === true) {
            _player2.turn = false;
            _player1.turn = true;
            return _player2.sign;
        }
        else {
            _player1.turn = false;
            _player2.turn = true;
            return _player1.sign;
        }
    }
    
    const whosTurn = () => {
        if (_player1.turn === true) return _player1.sign;
        else if (_player2.turn === true) return _player2.sign;
        else return _player1.sign;
    }

    const chooseWinner = () => {
        const _winCondition = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ]

        _winCondition.forEach(el => {
            const countX = [];
            const countO = [];
            el.forEach(num => {
                if (Gameboard.captureIndex('O').includes(num)) {
                    countX.push(num);
                    if (countX.length === 3) {
                        displayController.changeMessage('Winner is X!');
                        displayController.removeListener();
                        displayController.createRestartBtn();
                    }
                }
                else if (Gameboard.captureIndex('X').includes(num)) {
                    countO.push(num);
                    if (countO.length === 3) {
                        displayController.changeMessage('Winner is O!');
                        displayController.removeListener();
                        displayController.createRestartBtn();
                    }
                }
            })
        })

        if (Gameboard.captureIndex('X').length + Gameboard.captureIndex('O').length == 9) {
            displayController.changeMessage("It's a tie!");
            displayController.removeListener();
        }
    }

    return {changeTurn, whosTurn, chooseWinner}

})();

const displayController = (function() {

    const _fields = document.querySelector('div.board');
    _fields.addEventListener('click', handleMouseClick);

    const changeMessage = (text) => {
        const message = document.querySelector('#message');
        message.textContent = `${text}`;
    }

    const _clearDisplayBoard = () => {
        const signField = document.querySelectorAll('button.signField');
        for (let i = 0; i < signField.length; i++) {
            signField[i].innerText = '';
        }
    }

    const createRestartBtn = () => {
        const main = document.querySelector('main');
        const restartBtn = document.createElement("button");
        restartBtn.setAttribute('id', 'restart');
        restartBtn.innerText = 'Restart';
        main.appendChild(restartBtn);
        restartBtn.addEventListener('click', () => {
            Gameboard.clearBoard();
            _clearDisplayBoard();
            _fields.addEventListener('click', handleMouseClick);
            restartBtn.remove();
        })
    }

    const removeListener = () => {
        _fields.removeEventListener('click', handleMouseClick);
    }

    function handleMouseClick(event) { 
        if (event.target.className === 'signField') {
            if (event.target.innerText !== '') return;
            event.target.innerText = `${gameFlow.changeTurn()}`;
            gameFlow.remainingSpots -= 1;
            Gameboard.addToBoard(gameFlow.whosTurn(), event.target.id);
            changeMessage(`It's ${gameFlow.whosTurn()}'s turn`);
            gameFlow.chooseWinner();
        }
    }

    return {createRestartBtn, changeMessage, removeListener}
})();