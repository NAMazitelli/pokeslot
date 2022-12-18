import express from 'express'
import cors from 'cors'

import { guiController } from './controllers/gui'
import { mainController } from './controllers/main'

const port = 3000
const app = express()

app.use(cors())
app.get('/GUI', guiController)
app.post('/spin', mainController)
app.listen(port)
