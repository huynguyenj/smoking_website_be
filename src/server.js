/*eslint-disable no-console*/
import express from 'express'
import { CLOSE_DB, CONNECT_DB } from '@/config/mongodb'
import exitHook from 'async-exit-hook'
import { env } from '@/config/environment'
import { APIs_V1 } from '@/routes/v1'
import { errorHandlingMiddlewares } from '@/middlewares/errorHandlingMiddlewares'
import { initServer } from './config/initServer'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { corsOptions } from './config/cors'
import { createServer } from 'http'
import { connectSocket } from './providers/socketio'
const START_SERVER =async () => {
  const hostname = 'localhost'
  const PORT = env.APP_PORT || process.env.PORT
  const app = express()
  const httpServer = createServer(app)
  const io = await connectSocket(httpServer)
  io.on('connection', (socket) => {
    console.log(socket.id)
    socket.on('message', (info) => {
      console.log(info)
      io.emit('response', info)
    })
  })
  app.use(express.json())
  app.use(cookieParser())
  app.use(cors(corsOptions))
  app.use('/v1', APIs_V1)
  app.use(errorHandlingMiddlewares)
  httpServer.listen(PORT, async () => {
    console.log(`Back-end server is running at host: ${hostname} at PORT: ${PORT}`)
  })
  exitHook(() => {
    CLOSE_DB()
  })
}

//anonymous function
(async () => {
  try {
    await CONNECT_DB()
    console.log('Connected to MongoDB cloud atlas successfully!')
    await initServer.createAdminAccount()
    START_SERVER()
  } catch (error) {
    console.log(error)
    process.exit(0)
  }
})()
