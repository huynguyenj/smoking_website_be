import { userModel } from '@/models/userModel'
import ApiError from '@/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const registerService = async (reqBody) => {
  try {
    const newUser = {
      ...reqBody,
      user_name: ''
    }
    const createdUser = await userModel.insertUserData(newUser)
    console.log('Created user:', createdUser) 
    // {ackowledged: true, insertedId: new ObjectId('64f2c8b0d4e1a3f4c8b8b8b8')}

    const userData = await userModel.findOneUserById(createdUser.insertedId)
    return userData
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error with data validation in model', error.message)
  }
}

export const userService = {
  registerService
}