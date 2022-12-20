import { Scene } from '@babylonjs/core'
import { GameOutcome } from '../../shared/GameOutcome'
import { Tile } from './Tile.class'
import { Service } from './Service.class'

export class Board {
  board: number[][]
  tileBoard: Tile[][]
  scene: Scene
  service: Service
  constructor(scene: Scene) {
    this.board = []
    this.tileBoard = []
    this.scene = scene
    this.service = new Service()
  }

  // Call service and draw the result.
  async shuffleBoard(callback: (outcome: GameOutcome) => void) {
    const outcome = await this.service.boardService()
    this.board = outcome.board
    this.drawBoard(false)
    callback(outcome)
  }

  // Call service to draw something and perform the stand by animation.
  async standBy() {
    const outcome = await this.service.boardService()
    this.board = outcome.board
    this.drawBoard(true)
  }

  // Set a given tile for given coordinates inside board.
  setBoardTile(rowIndex: number, tileIndex: number, tile: Tile) {
    if (!this.tileBoard[rowIndex]) {
      this.tileBoard[rowIndex] = []
    }

    this.tileBoard[rowIndex][tileIndex] = tile
  }

  // Get the tile for given coordinates.
  getBoardTile(rowIndex: number, tileIndex: number): Tile {
    return this.tileBoard[rowIndex][tileIndex]
  }

  // Clear the board and destroy meshes.
  clearBoard() {
    if (this.tileBoard.length > 0) {
      this.tileBoard.forEach(row => row.forEach(mesh => mesh.destroy()))
    }
  }

  // Draw the board. If param is true, it will perform the stand by animation, else it will do the usual roll.
  drawBoard(standBy: boolean) {
    this.clearBoard()
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
