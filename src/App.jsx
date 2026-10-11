import { useState } from "react";

function Square({ value, onSquareClick, isWinningSquare }) {
  let squareClassName = "square";
  //this checks if square is part of winning line, if yes, then css will apply to it
  if (isWinningSquare) {
    squareClassName = "square highlight";
  }
  return (
    <button className={squareClassName} onClick={onSquareClick}>
      {value}
    </button>
  );
}


function Board({ xIsNext, squares, onPlay }) {
  const winnerLine = calculateWinner(squares);
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    xIsNext ? (nextSquares[i] = "X") : (nextSquares[i] = "O");
    onPlay(nextSquares, i);
  }

  
  let winner = null;
  if (winnerLine) {
    winner = squares[winnerLine[0]];
  }
  //this is used to check if the squares are all filled up
  let isBoardFull = true;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      isBoardFull = false;
    }
  }
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (isBoardFull) {
    status = "Its a draw";
  } else {
    status = "Next play: " + (xIsNext ? "X" : "O");
  }
  //two loops to build board
  let boardRows = [];
  for (let r = 0; r < 3; r++) {
    let currentRow = [];
    for (let c = 0; c < 3; c++) {
      let squareIndex = r * 3 + c;
      let isWinningSquare = false;
      //this is what flags square as winning line to see which gets css applied to it(highlighted)
      if (winnerLine) {
        for (let win = 0; win < winnerLine.length; win++) {
          if (winnerLine[win] === squareIndex) {
            isWinningSquare = true;
          }
        }
      }
      //this is what pushes our rows and columns into 3x3 square
      currentRow[c] = (
        <Square
          key={squareIndex}
          value={squares[squareIndex]}
          onSquareClick={() => handleClick(squareIndex)}
          isWinningSquare={isWinningSquare}
        ></Square>
      );
    }
    boardRows[r] = (
      <div key={r} className="board-row">
        {currentRow}
      </div>
    );
  }
  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

function Game() {
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), location: null },
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  //starts with ascending order
  const [isAscending, setIsAscending] = useState(true);
  const currentTurn = history[currentMove];
  const currentSquares = currentTurn.squares;
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSquares, squareIndex) {
    //this will be how we get row and column instead of an index
    let rowNum, colNum;
    if (squareIndex === 0 || squareIndex === 1 || squareIndex === 2) {
      rowNum = 1;
      colNum = squareIndex + 1;
    } else if (squareIndex === 3 || squareIndex === 4 || squareIndex === 5) {
      rowNum = 2;
      colNum = squareIndex - 2;
    } else {
      rowNum = 3;
      colNum = squareIndex - 5;
    }

    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, location: { row: rowNum, col: colNum } },
    ];
    setHistory(nextHistory);

    setCurrentMove(nextHistory.length - 1);
  }
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  //this is what allows up to have everything but current as a button
  let moves = history.map((turn, move) => {
    let coordinateLocation = "";
    if (turn.location) {
      coordinateLocation =
        "(" + turn.location.row + ", " + turn.location.col + ")";
    }
    let description;
    if (move === currentMove) {
      if (move === 0) {
        description = "Game start";
      } else {
        description = "You are at move #" + move + " " + coordinateLocation;
      }
      return (
        <li key={move}>
          <div>{description}</div>
        </li>
      );
    }
    if (move > 0) {
      description = "Go to move #" + move + " " + coordinateLocation;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
  if (!isAscending) {
    moves = moves.slice().reverse();
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => setIsAscending(!isAscending)}> {/*toggle button*/}
          {" "}
          {isAscending ? "Descending" : "Ascending"}
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}

export default function App() {
  return <Game />;
}
