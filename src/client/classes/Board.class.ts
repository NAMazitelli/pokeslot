import { Tile } from './Tile.class'
import { Scene } from '@babylonjs/core'
import { GameOutcome } from '../../shared/GameOutcome'

export class Board {
  board: number[][]
  tileBoard: Tile[][]
  scene: Scene
  constructor(scene: Scene) {
    this.board = []
    this.tileBoard = []
    this.scene = scene
  }

  boardService = async (): Promise<GameOutcome> => {
    // call server and get a fresh board
    const port = 3000
    const result = await fetch(`http://localhost:${port}/spin`, {
      method: 'POST'
    })
    const data = await result.json()
    const outcome = data
    console.log('seteo')

    this.board = outcome.board
    return outcome
  }

  shuffleBoard = async (callback: (outcome: GameOutcome) => void) => {
    const outcome = await this.boardService()
    if (this.board.length > 0) {
      this.drawBoard(false)
      callback(outcome)
    }
  }

  standBy = async () => {
    await this.boardService()
    console.log('hay board?')

    if (this.board.length > 0) {
      console.log('hay board')
      console.log(this.board)

      this.drawBoard(true)
    }
  }

  setBoardTile(rowIndex: number, tileIndex: number, tile: Tile) {
    if (!this.tileBoard[rowIndex]) {
      this.tileBoard[rowIndex] = []
    }

    this.tileBoard[rowIndex][tileIndex] = tile
  }

  getBoardTile(rowIndex: number, tileIndex: number) {
    return this.tileBoard[rowIndex][tileIndex]
  }

  clearBoard = () => {
    if (this.tileBoard.length > 0) {
      this.tileBoard.forEach(row => row.forEach(mesh => mesh.destroy()))
    }
  }

  drawBoard = (standBy: boolean) => {
    this.clearBoard()
    // draw the board
    const vHalf = this.board.length / 2
    this.board.reverse().forEach((row: number[], rowIndex: number) => {
      const hHalf = row.length / 2
      row.forEach((tileType: number, tileIndex: number) => {
        const tile = new Tile(
          tileType,
          rowIndex,
          tileIndex,
          this.scene,
          standBy
        )
        this.setBoardTile(rowIndex, tileIndex, tile)

        tile.setMeshPosition(
          Math.round(tileIndex - hHalf) / 4,
          Math.round(rowIndex - vHalf) + 0.42,
          -0.55
        )
        tile.setMeshRotation(0, 0, -1.57)
      })
    })
  }
}
