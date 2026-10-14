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
  
  function makeAutoMove() {
    let automove = null;
    if (xIsNext) {
      console.log("X is playing")
      automove = findBestMove(squares, 'X');
    } else {
      console.log("O is playing")
      automove = findBestMove(squares, 'O');
    }
    if (automove !== null) {
      console.log("Automove at ", automove);
      handleClick(automove);
    }
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
      <button onClick={makeAutoMove}>Switch to Player {(xIsNext ? "O" : "X")}</button>
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
        <div>
          <button onClick={() => resetGame()}>Reset</button>
        </div>
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

const WINNINGLINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

function checkWinner(board, player) {
  return WINNINGLINES.some((combo) => 
    combo.every((index) => board[index] === player)
  );
}

function findBestMove(squares, playermove) {

  let bestScore = -Infinity;
  let move = -1;
  let enemymove = playermove === 'X' ? 'O' : 'X';
  const squaresCopy = squares.slice();
  for (let i = 0; i < squaresCopy.length; i++) {
    if (squaresCopy[i] === ' ') {
      squaresCopy[i] = playermove;
      let score = minimax(squaresCopy, 0, false, playermove, enemymove);
      squaresCopy[i] = ' ';

      if (score > bestScore) {
        bestScore = score;
        move = i
      }
      //console.log("choice ", i, " has score", score);
    }
  }
  return move;
}

function minimax(board, depth, isMaximizing, player, enemy) {
  if (checkWinner(board, player)) return 10 - depth;
  if (checkWinner(board, enemy)) return depth - 10;
  if (board.every((cell) => cell !== ' ')) return 0;

  if (isMaximizing) {
    let maxScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === ' ') {
        board[i] = player;
        let score = minimax(board, depth + 1, false, player, enemy);
        board[i] = ' ';
        maxScore = Math.max(score, maxScore);
        // console.log(score);
      }
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === ' ') {
        board[i] = enemy;
        let score = minimax(board, depth + 1, true, player, enemy);
        board[i] = ' ';
        minScore = Math.min(score, minScore);
        // console.log(score);
      }
    }
    return minScore;
  }
}
