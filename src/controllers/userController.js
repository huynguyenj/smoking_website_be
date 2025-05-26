import { userService } from '@/services/userService'
import ApiError from '@/utils/ApiError'
import { COOKIES_OPTIONS } from '@/utils/constants'
import { StatusCodes } from 'http-status-codes'

const registerController = async (req, res, next) => {
  try {
    const createdUser = await userService.registerService(req.body)
    res.status(StatusCodes.CREATED).json(createdUser)
  } catch (error) {
    next(error)
  }
}

const loginController = async (req, res, next) => {
  try {
    const loginUser = await userService.loginService(req.body)
    res.cookie('refreshToken', loginUser.refreshToken, COOKIES_OPTIONS)
    const dataResponse = {
      ...loginUser,
      password:undefined,
      refreshToken: undefined
    }
    res.status(StatusCodes.OK).json(dataResponse)
  } catch (error) {
    next(error)
  }
}
const logoutController = async (req, res, next) => {
  try {
    await userService.logoutService(req.user.id)
    res.clearCookie('refreshToken', COOKIES_OPTIONS)
    res.status(StatusCodes.ACCEPTED).json('Logout successfully!')
  } catch (error) {
    next(error)
  }
}
const getUserInfoController = async (req, res, next) => {
  try {
    const { id } = req.user
    const userInfo = await userService.getUserInfoService(id)
    // res.cookies()
    res.status(StatusCodes.OK).json(userInfo)
  } catch (error) {
    next(error)
  }
}

const updateUserInfoController = async (req, res, next) => {
  try {
    const { id } = req.user
    await userService.updateUserInfoService(id, req.body)
    res.status(StatusCodes.NO_CONTENT).json({ message: 'Update successfully!' })
  } catch (error) {
    next(error)
  }
}

const getNewAccessTokenController = async (req, res, next) => {
  try {

    const refreshToken = req.cookies.refreshToken
    const newToken = await userService.getNewAccessTokenService(refreshToken)
    res.cookie('refreshToken', newToken.refreshToken, COOKIES_OPTIONS)
    res.status(StatusCodes.CREATED).json({ ...newToken, refreshToken: undefined })

  } catch (error) {
    res.clearCookie('refreshToken', COOKIES_OPTIONS)
    next(error)
  }
}

export const userController = {
  registerController,
  loginController,
  getUserInfoController,
  logoutController,
  updateUserInfoController,
  getNewAccessTokenController
}