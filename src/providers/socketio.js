import { env } from '@/config/environment'
import { Server } from 'socket.io'

export const connectSocket = async (httpServer) => {
  const io = new Server(httpServer, { cors:{ origin: env.BUILD_MODE === 'production' ? env.CLIENT_URL_PROD2 : '*' } })
  return io
}