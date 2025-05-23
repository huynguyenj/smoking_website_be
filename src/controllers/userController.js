import { userService } from '@/services/userService'
import ApiError from '@/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const registerController = async (req, res, next) => {
  try {
    const createdUser = await userService.registerService(req.body)
    res.status(StatusCodes.CREATED).json(createdUser)
  } catch (error) {
    next(error)
  }
}

export const userController = {
  registerController
}