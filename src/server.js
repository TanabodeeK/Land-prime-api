import express from 'express'
import authUserRouter from './routes/authUserRouter.js'
import { error } from './utils/error.js'
import notFound from './utils/notFound.js'
import postRouter from './routes/postRouter.js'
import cors from 'cors'
import morgan from 'morgan'

const PORT = 8787
const app = express()


app.use(morgan("dev"))
app.use(cors())
app.use(express.json())

app.use('/auth', authUserRouter)
app.use('/user',postRouter)
app.use('/api',postRouter)

app.use(notFound)
app.use(error)

app.listen(PORT , () => {
  console.log(`Server running at http://localhost:${PORT}`)
})