import express from 'express'
import cors from 'cors'
import { routers } from './routers/index.js'

export const app = express()

app.use(cors())
app.use(express.json())
app.use(routers)






