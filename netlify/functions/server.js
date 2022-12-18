import { Board } from '../src/server/classes/Board.class'

export const handler = async () => {
  const board = new Board()
  board.shuffleBoard()
  const result = board.response
  return {
    statusCode: 200,
    body: JSON.stringify(result)
  }
}
