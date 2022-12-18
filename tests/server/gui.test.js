import { guiController } from '../../src/server/controllers/gui'
import GUI from '../../src/server/resources/GUI.json'

describe('GUI', () => {
  it('should get the current GUI json', async () => {
    const req = {}

    const res = {
      text: '',
      send: function (input) {
        this.text = input
      },
      setHeader: e => e
    }
    guiController(req, res)
    expect(JSON.parse(res.text)).toEqual(GUI)
  })
})
