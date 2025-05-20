const Gameboard = (function () {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const setCell = (index, symbol) => {
    if (board[index] === "") {
      board[index] = symbol;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return { getBoard, setCell, resetBoard };
})();

const Player = (name, symbol) => {
  return { name, symbol };
};

const Game = (function () {
  const player1 = Player("Player 1", "X");
  const player2 = Player("Player 2", "O");
  let currentPlayer = player1;
  let winner = null;

  const playRound = (index) => {
    if (Gameboard.setCell(index, currentPlayer.symbol)) {
      if (checkWinner()) {
        winner = currentPlayer.name;
        console.log(`${winner} wins!`);
      } else if (Gameboard.getBoard().every((cell) => cell !== "")) {
        console.log("It's a tie!");
      } else {
        switchTurn();
      }
    } else {
      console.log("Cell already taken!");
    }
  };

  const switchTurn = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const checkWinner = () => {
    const b = Gameboard.getBoard();
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    return winPatterns.some(
      (pattern) =>
        b[pattern[0]] &&
        b[pattern[0]] === b[pattern[1]] &&
        b[pattern[0]] === b[pattern[2]]
    );
  };

  const getCurrentPlayer = () => currentPlayer.name;
  const getWinner = () => winner;

  return { playRound, getCurrentPlayer, getWinner };
})();

const DisplayController = (function () {
    const gameboardDiv = document.getElementById("gameboard");
    const message = document.getElementById("message");
    const restartBtn = document.getElementById("restartBtn");

    const render = () => {
        gameboardDiv.innerHTML = "";
        Gameboard.getBoard().forEach((cell, index) => {
            const cellDiv = document.createElement("div");
            cellDiv.textContent = cell;
            cellDiv.dataset.index = index;

            cellDiv.addEventListener("click", () => {
                if (Game.getWinner() || cell !== "") return;
                Game.playRound(index);
                render();
                updateMessage();
            });

            gameboardDiv.appendChild(cellDiv);
        });
    };

    const updateMessage = () => {
        if (Game.getWinner()) {
            message.textContent = `${Game.getWinner()} wins!`;
        } else if (Gameboard.getBoard().every(c => c !== "")) {
            message.textContent = "It's a tie!";
        } else {
            message.textContent = `${Game.getCurrentPlayer()}'s turn`;
        }
    };

    restartBtn.addEventListener("click", () => {
        Gameboard.resetBoard();
        message.textContent = "";
        render();
    });

    render();
    updateMessage();

    return { render };
}) ();