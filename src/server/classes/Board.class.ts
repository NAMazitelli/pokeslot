import { TILES_ARRAY } from '../../shared/SharedUtils'
import { GameOutcome } from '../../shared/GameOutcome'

export class Board {
  sizeX: number
  sizeY: number
  tileIndexLimit: number
  response: GameOutcome
  bonusChance: number

  constructor() {
    this.sizeX = 3
    this.sizeY = 1
    this.tileIndexLimit = TILES_ARRAY.length
    this.response = {
      board: [],
      smallWin: false,
      bigWin: false,
      bonus: false
    }
    this.bonusChance = 0.1
    this.shuffleBoard()
  }

  shuffleBoard() {
    for (let y = 0; y < this.sizeY; y++) {
      if (!this.response.board[y]) {
        this.response.board[y] = []
      }
      for (let x = 0; x < this.sizeX; x++) {
        this.response.board[y][x] =
          TILES_ARRAY[Math.round(Math.random() * this.tileIndexLimit) - 1]
      }
    }

    this.checkForWins()
    this.checkForBonus()
  }

  checkForWins() {
    const counts: { [key: number]: number } = {}
    this.response.board.forEach((row: number[]) => {
      row.forEach((x: number) => {
        counts[x] = (counts[x] || 0) + 1
      })
    })

    // win conditions
    this.response.smallWin = Object.values(counts).find(x => x === 2)
      ? true
      : false
    this.response.bigWin = Object.values(counts).find(x => x === 3)
      ? true
      : false
  }

  checkForBonus() {
    const dice = Math.random()

    if (dice < this.bonusChance) {
      this.response.bonus = true
    }
  }
}
