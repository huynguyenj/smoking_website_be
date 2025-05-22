import ApiError from '@/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const register = async (req, res, next) => {
  try {
    console.log('req.body', req.body)
    throw new ApiError( StatusCodes.BAD_REQUEST, 'This is a custom error message')
  } catch (error) {
    next(error)
  }
}

export const userController = {
  register
}