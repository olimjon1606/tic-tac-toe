import { useState } from "react"
import GameBoard from "./components/GameBoard"
import Player from "./components/Player"
import Log from "./components/Log"
import { WINNING_COMBINATIONS } from "./winning-combinations"
import GameOver from "./components/GameOver"

function deriveActivePlayer(arg) {
  let currentPlayer = 'X';
  if (arg.length > 0 && arg[0].player === 'X') {
    currentPlayer = 'O'
  }
  return currentPlayer
}

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
]


function App() {
  const [gameTurns, setGameTurns] = useState([])
  const [players, setPlayers] = useState({
    X: "Player 1",
    O: "Player 2"
  })

  const activePlayer = deriveActivePlayer(gameTurns)

  let gameBoard = [...initialGameBoard.map(innerArray => [...innerArray])]
  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square
    gameBoard[row][col] = player
  }

  let winner;
  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column]
    const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column]
    const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column]

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol) {
      winner = players[firstSquareSymbol]
    }
  }

  const hasDraw = gameTurns.length === 9 && !winner

  function handleSelectSquare(rowIndex, colIndex) {
    // setActivePlayer((curActivePlayer) => curActivePlayer === 'X' ? 'O' : 'X')
    setGameTurns((preTurns) => {
      const currentPlayer = deriveActivePlayer(preTurns)

      const updateTurns = [{ square: { row: rowIndex, col: colIndex }, player: currentPlayer }, ...preTurns]
      return updateTurns
    })
  }

  function handleRematch() {
    setGameTurns([])
  }

  function handleNameChange(symbol, newName) {
    setPlayers(event => {
      return {
        ...event,
        [symbol]: newName
      }
    })
  }
  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player initialName="Player 1" symbol="X" isActive={activePlayer === 'X'} saveNewName={handleNameChange} />
          <Player initialName="Player 2" symbol="O" isActive={activePlayer === 'O'} saveNewName={handleNameChange}/>
        </ol>
        {(winner || hasDraw) && (<GameOver winner={winner} onRestart={handleRematch} />)}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
      </div>
      <Log turns={gameTurns} />
    </main>
  )
}

export default App
