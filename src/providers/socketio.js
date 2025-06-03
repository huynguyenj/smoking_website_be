import { Server } from 'socket.io'

export const connectSocket = async (httpServer) => {
  const io = new Server(httpServer, { cors:{ origin: '*' } })
  return io
}