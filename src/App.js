import {useState} from 'react';

function Square({ value, onSquareClick}) {
  return (<button className="square"
  onClick={onSquareClick}>
    {value}
  </button>);
}

function Board({xIsNext, squares, onPlay}) {
  function handleClick(i) {
    if (squares[i] !== ' ' || calculateWinner(squares)) {
      return;
    }
    
    let nxtSq = squares.slice();
    let moveTarget = "O";
    if (xIsNext) {
      moveTarget = "X";
    }
    nxtSq[i] = moveTarget;
    onPlay(nxtSq)

  }
  // if current player is found to be O, make best move
  if (!xIsNext) {
    console.log("O is playing")
    let automove = findBestMove(squares, 'O');
    if (automove !== null) {
      handleClick(automove);
    }
    console.log("O makes move at ", automove);
  }
  

  const victor = calculateWinner(squares);
  let status;
  if (victor) {
    status = "Victor: " + victor;
  } else {
    status = "Next Player: " + (xIsNext ? "X" : "O");
  }

  const table = [];
  for (let i = 0; i < 3; i++) {
    let row = [];
    for (let j = 0; j < 3; j++) {
      let idx = 3 * i + j;
      row.push(<Square key={idx} value={squares[idx]} onSquareClick={() => handleClick(idx)} />)
    }
    table.push(
      <div className="board-row">
        {row}
      </div>
    )
  }
  return (
    <>
      <div className="status">{status}</div>
      {table}
    </>
  );
}

export default function Game() {
  // const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(' ')]);
  const [currentMove, setcurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setcurrentMove(nextHistory.length - 1);
    
  }

  function jumpTo(nextMove) {
    setcurrentMove(nextMove);
  }

  function resetGame() {
    setHistory([Array(9).fill(' ')])
    setcurrentMove(0);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  })
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
        <button onClick={() => resetGame()}>Reset</button>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}


function calculateWinner(squares) {
  const re = /^(?:(?:...){0,2}([OX])\1\1|.{0,2}([OX])..\2..\2|([OX])...\3...\3|..([OX]).\4.\4)/g;
  const currentGame = squares.join("");
  const matching = re.exec(currentGame)
  if (matching) {
    return matching.slice(1).find(group => group !== undefined);
  }
  return null;
}

function findBestMove(squares, playermove) {
  const WINNINGLINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  function findWinningSquare(playermove) {
    for (const combo of WINNINGLINES) {
      const [a, b, c] = combo;
      const line = [squares[a], squares[b], squares[c]];
      const playerinline = line.filter((move) => move === playermove).length;
      const emptyinline = line.filter((move) => move === ' ').length;

      if (playerinline === 2 && emptyinline == 1) {
        if (squares[a] === ' ') return a;
        if (squares[b] === ' ') return b;
        if (squares[c] === ' ') return c;
      }
    }
    return null;
  }
  let enemymove = 'X';
  if (playermove === "X") {
    enemymove = 'O';
  }
  // block enemy win
  let bestMove = findWinningSquare(enemymove);
  if (bestMove !== null) return bestMove;
  // get winning move
  bestMove = findWinningSquare(playermove);
  if (bestMove !== null) return bestMove;
  // look for next best free space
  for (const i of [4, 0, 2, 6, 8, 1, 3, 5, 7]) {
    if (squares[i] === ' ') {
      return i;
    }
  }
  return null;
}