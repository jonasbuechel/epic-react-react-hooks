// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useState} from 'react'

function Board({squares, onSquareClicked}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onSquareClicked(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const movesDefaultValue = [Array(9).fill(null)]
  const [moves, setMoves] = useState(movesDefaultValue)
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0)
  const currentSquares = moves[currentMoveIndex]
  const nextValue = calculateNextValue(currentSquares)
  const winner = calculateWinner(currentSquares)
  const status = calculateStatus(winner, currentSquares, nextValue)

  function restart() {
    setMoves(movesDefaultValue)
    setCurrentMoveIndex(0)
  }

  function selectSquare(squareIndex) {
    if (winner || currentSquares[squareIndex]) {
      return
    }
    const currentMoveCopy = [...moves[currentMoveIndex]]

    currentMoveCopy[squareIndex] = nextValue

    const existingMoves = moves.slice(0, currentMoveIndex + 1)
    const movesCopy = [...existingMoves, currentMoveCopy]

    setCurrentMoveIndex(movesCopy.length - 1)
    setMoves(movesCopy)
  }

  function selectMove(moveIndex) {
    setCurrentMoveIndex(moveIndex)
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          onClick={selectSquare}
          squares={currentSquares}
          onSquareClicked={squareIndex => selectSquare(squareIndex)}
        />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <MovesNav
          moves={moves}
          onMoveCLicked={index => selectMove(index)}
          currentMoveIndex={currentMoveIndex}
        />
      </div>
    </div>
  )
}

function MovesNav({moves, onMoveCLicked, currentMoveIndex}) {
  return moves.map((move, index) => {
    const key = move.filter(item => item !== null).length

    return (
      <div key={key}>
        <button
          disabled={index === currentMoveIndex}
          onClick={() => onMoveCLicked(index)}
        >
          {index === 0 ? 'go to game start' : `go to move #${index}`}
          {index === currentMoveIndex && ' (current)'}
        </button>
      </div>
    )
  })
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
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
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
