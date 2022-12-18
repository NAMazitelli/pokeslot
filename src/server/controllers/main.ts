import { Board } from '../classes/Board.class'
import { Request, Response } from 'express'

export const mainController = (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json')
  const board = new Board()
  board.shuffleBoard()
  const result = board.response
  res.send(JSON.stringify(result))
}
