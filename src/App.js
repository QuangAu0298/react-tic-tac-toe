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
    
    const nxtSq = squares.slice();
    if (xIsNext) {
      nxtSq[i] = "X";
    } else {
      nxtSq[i] = "O";
    }
    onPlay(nxtSq)
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
      {/* <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div> */}
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
    // setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setcurrentMove(nextMove);
    // setXIsNext(nextMove % 2 === 0);
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
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  // const lines = [
  //   [0, 1, 2],
  //   [3, 4, 5],
  //   [6, 7, 8],
  //   [0, 3, 6],
  //   [1, 4, 7],
  //   [2, 5, 8],
  //   [0, 4, 8],
  //   [2, 4, 6]
  // ];
  const re = /^(?:(?:...){0,2}([OX])\1\1|.{0,2}([OX])..\2..\2|([OX])...\3...\3|..([OX]).\4.\4)/g;
  const currentGame = squares.join("");
  const matching = re.exec(currentGame)
  // for (let i = 0; i < lines.length; i++) {
  //   const [a, b, c] = lines[i];
  //   if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
  //     return squares[a];
  //   }
  // }
  if (matching) {
    return matching.slice(1).find(group => group !== undefined);
  }
  return null;
}