import * as GUI from '../resources/GUI.json'
import { Request, Response } from 'express'

export const guiController = (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify(GUI))
}
