import { userModel } from '@/models/userModel'
import ApiError from '@/utils/ApiError'
import { passwordHelper } from '@/utils/hashPassword'
import { StatusCodes } from 'http-status-codes'

const registerService = async (reqBody) => {
  try {
    const { email } = reqBody
    if (await userModel.findUserByEmail(email)) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exists. Please use a different email.')
    }
    const newUser = {
      ...reqBody,
      password: await passwordHelper.hashPassword(reqBody.password)
    }
    const createdUser = await userModel.insertUserData(newUser)

    const userData = await userModel.findOneUserById(createdUser.insertedId)
    return {
      ...userData,
      password: undefined
    }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error with data validation in model', error.message)
  }
}

const loginService = async (reqBody) => {
  try {
    const { email, password } = reqBody
    const user = await userModel.findUserByEmail(email)
    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Email not found. Please register first.')
    }
    if (!await passwordHelper.comparePassword(password, user.password)) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Your password is not correct! Please try again.')
    }
    if (user.isDeleted || !user.isActive) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Your account has been deleted or not active. Please contact support.')
    }
    return {
      ...user,
      password: undefined
    }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error with data validation in model', error.message)
  }
}

export const userService = {
  registerService,
  loginService
}