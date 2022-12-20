import { GameOutcome } from '../../shared/GameOutcome'

export class Service {
  // Call server.
  async boardService(): Promise<GameOutcome> {
    const url =
      process.env.NODE_ENV === 'production'
        ? `https://pokeslot.netlify.app/.netlify/functions/server`
        : `http://localhost:3000/spin`

    const result = await fetch(url, {
      method: 'GET'
    })
    return await result.json()
  }
}
