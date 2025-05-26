import { env } from '@/config/environment'
import jwt from 'jsonwebtoken'
const generateToken = (payload, timeLimit) => {
  const token = jwt.sign(payload, env.ACCESS_TOKEN_SECRET, { expiresIn: timeLimit })
  return token
}
const verifyToken = (token) => {
  const validToken = jwt.verify(token, env.ACCESS_TOKEN_SECRET)
  if (!validToken) throw new Error()
  return validToken
}


export const jwtHelper = {
  generateToken,
  verifyToken
}