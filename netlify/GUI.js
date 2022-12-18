import * as GUI from '../src/server/resources/GUI.json'

export const handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify(GUI)
  }
}
