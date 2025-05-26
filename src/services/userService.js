import { userModel } from '@/models/userModel'
import ApiError from '@/utils/ApiError'
import { TOKEN_TIME } from '@/utils/constants'
import { passwordHelper } from '@/utils/hashPassword'
import { jwtHelper } from '@/utils/jwtHelper'
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
    const payload = { email: user.email, role: user.role, id: user._id }
    const accessToken = jwtHelper.generateToken(payload, TOKEN_TIME.access_token_time)
    const refreshToken = jwtHelper.generateToken(payload, TOKEN_TIME.refresh_token_time)
    await userModel.updateUserById(user._id, { refreshToken: refreshToken })
    return {
      ...user,
      accessToken: accessToken,
      refreshToken: refreshToken
    }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const logoutService = async (id) => {
  try {
    await userModel.updateUserById(id, { refreshToken: null })
    return
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const getUserInfoService = async (id) => {
  try {
    const userInfo = await userModel.findOneUserById(id)
    return {
      ...userInfo,
      password: undefined,
      refreshToken: undefined
    }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const updateUserInfoService = async (id, reqBody) => {
  try {
    const updateData = reqBody
    await userModel.updateUserById(id, updateData)
    return
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error with data validation in model', error.message)
  }
}

const getNewAccessTokenService = async (refreshToken) => {
  try {
    const userInfoFromToken = jwtHelper.verifyToken(refreshToken)
    const user = await userModel.findOneUserById(userInfoFromToken.id)
    if (user.refreshToken !== refreshToken) throw new Error('Your refresh token is not match!')

    const payload = { email: user.email, role: user.role, id: user._id }
    const newAccessToken = jwtHelper.generateToken(payload, TOKEN_TIME.access_token_time)
    const newRefreshToken = jwtHelper.generateToken(payload, TOKEN_TIME.refresh_token_time)

    await userModel.updateUserById(user._id, { refreshToken: newRefreshToken })
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error with data validation in model', error.message)
  }
}
export const userService = {
  registerService,
  loginService,
  getUserInfoService,
  updateUserInfoService,
  getNewAccessTokenService,
  logoutService
}