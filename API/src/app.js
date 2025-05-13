import express from 'express'
import "express-async-errors"
import cors from 'cors'
import cookieParser from "cookie-parser"
import { routers } from './routers/index.js'
import { ErrorHandling } from "./middlewares/ErrorHandling.js"

export const app = express()

app.use(cookieParser())

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

app.use(express.json())
app.use(routers)

app.use(ErrorHandling)





