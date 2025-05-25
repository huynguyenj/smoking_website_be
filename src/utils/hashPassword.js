import { env } from '@/config/environment'
import bcrypt from 'bcrypt'
const hashPassword = async (password) => {
  return await bcrypt.hash(password, parseInt(env.SALT_ROUNDS))
}

const comparePassword = async (inputPassword, realPassword) => {
  return await bcrypt.compare(inputPassword, realPassword)
}

export const passwordHelper = {
  hashPassword,
  comparePassword
}