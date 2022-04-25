import express from 'express'
import {postRouter} from './posts/post.routes'
import {errorHandler} from './middleware/errorHandler.middleware'
const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/api/v1', postRouter)
app.use(errorHandler)

export {app}
