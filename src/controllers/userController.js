import { VN_PAY } from '@/providers/vnpay'
import { userService } from '@/services/userService'
import ApiError from '@/utils/ApiError'
import { COOKIES_OPTIONS } from '@/utils/constants'
import { jsonForm } from '@/utils/formatReturnJson'
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
    res.status(StatusCodes.OK).json(jsonForm.successJsonMessage(true, 'Login successfully!', dataResponse))
  } catch (error) {
    next(error)
  }
}
const logoutController = async (req, res, next) => {
  try {
    await userService.logoutService(req.user.id)
    res.clearCookie('refreshToken', COOKIES_OPTIONS)
    res.status(StatusCodes.ACCEPTED).json(jsonForm.successJsonMessage(true, 'Logout successfully!'))
  } catch (error) {
    next(error)
  }
}
const getUserInfoController = async (req, res, next) => {
  try {
    const { id } = req.user
    const userInfo = await userService.getUserInfoService(id)
    // res.cookies()
    res.status(StatusCodes.OK).json(jsonForm.successJsonMessage(true, 'Get user information successfully!', userInfo))
  } catch (error) {
    next(error)
  }
}

const updateUserInfoController = async (req, res, next) => {
  try {
    const { id } = req.user
    const data = {
      ...req.body,
      updated_date: Date.now()
    }
    await userService.updateUserInfoService(id, data)
    res.status(StatusCodes.ACCEPTED).json(jsonForm.successJsonMessage(true, 'Update successfully!'))
  } catch (error) {
    next(error)
  }
}

const updateProfileController = async (req, res, next) => {
  try {
    const file = req.file
    const data = req.body
    const userId = req.user.id
    await userService.updateProfileService(userId, data, file)
    res.status(StatusCodes.ACCEPTED).json(jsonForm.successJsonMessage(true, 'Update successfully!'))
  } catch (error) {
    next(error)
  }
}

const getNewAccessTokenController = async (req, res, next) => {
  try {

    const refreshToken = req.cookies.refreshToken
    const newToken = await userService.getNewAccessTokenService(refreshToken)
    res.cookie('refreshToken', newToken.refreshToken, COOKIES_OPTIONS)
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(true, 'Get new access token success!', { ...newToken, refreshToken: undefined }))

  } catch (error) {
    res.clearCookie('refreshToken', COOKIES_OPTIONS)
    next(error)
  }
}

const searchUserController = async (req, res, next) => {
  try {
    const query = req.body.search
    const result = await userService.searchUserService(query)
    res.status(StatusCodes.OK).json(jsonForm.successJsonMessage(true, 'Search successfully!', result))
  } catch (error) {
    next(error)
  }
}

const feedbackController = async (req, res, next) => {
  try {
    const data = req.body
    const userId = req.user.id
    await userService.feedbackService(userId, data)
    res.status(StatusCodes.OK).json(jsonForm.successJsonMessage(true, 'Feedback successfully!'))
  } catch (error) {
    next(error)
  }
}

const paymentController = async (req, res, next) => {
  try {
    const data = req.body
    const userId = req.user.id
    const ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress
    const paymentURL = VN_PAY.createPaymentUrl(data, ipAddr, userId)
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(true, 'Get payment URL successfully', { paymentURL } ))
  } catch (error) {
    next(error)
  }
}

const returnPaymentCheckController = async (req, res, next) => {
  try {
    const data = req.query
    const result = await userService.paymentService(data)
    res.redirect(result)
  } catch (error) {
    next(error)
  }
}

const getMembershipsController = async (req, res, next) => {
  try {
    const result = await userService.getMembershipsService()
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(true, 'Get memberships successfully!', result))
  } catch (error) {
    next(error)
  }
}

export const userController = {
  registerController,
  loginController,
  getUserInfoController,
  logoutController,
  updateUserInfoController,
  getNewAccessTokenController,
  searchUserController,
  feedbackController,
  paymentController,
  returnPaymentCheckController,
  getMembershipsController,
  updateProfileController
}