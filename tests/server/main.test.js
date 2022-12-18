import { mainController } from '../../src/server/controllers/main'

describe('Main', () => {
  it('should get the current game outcome', async () => {
    const req = {}

    const res = {
      text: '',
      send: function (input) {
        this.text = input
      },
      setHeader: e => e
    }
    mainController(req, res)
    console.log(res)
    expect(res.text).toBeDefined()
  })
})
