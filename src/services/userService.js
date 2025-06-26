import { env } from '@/config/environment'
import { paymentModel } from '@/models/paymentModel'
import { userModel } from '@/models/userModel'
import { supabaseMethod } from '@/providers/supabase'
import { VN_PAY } from '@/providers/vnpay'
import ApiError from '@/utils/ApiError'
import { NAME_FOLDER_SUPABASE, TOKEN_TIME } from '@/utils/constants'
import { passwordHelper } from '@/utils/hashPassword'
import { jwtHelper } from '@/utils/jwtHelper'
import { StatusCodes } from 'http-status-codes'

const registerService = async (reqBody) => {
  try {
    const { email } = reqBody
    if (await userModel.findUserByEmail(email)) {
      throw new Error('Email already exists. Please use a different email.')
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
    throw new ApiError(StatusCodes.UNAUTHORIZED, error.message)
  }
}

const loginService = async (reqBody) => {
  try {
    const { email, password } = reqBody
    const user = await userModel.findUserByEmail(email)
    if (!user) {
      throw new Error('Email not found. Please register first.')
    }
    if (!await passwordHelper.comparePassword(password, user.password)) {
      throw new Error('Your password is not correct! Please try again.')
    }
    if (user.isDeleted || !user.isActive) {
      throw new Error('Your account has been deleted or not active. Please contact support.')
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
    throw new ApiError(StatusCodes.UNAUTHORIZED, error.message)
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

const updateUserInfoService = async (id, data) => {
  try {
    delete data['role'] // avoid user update their role by their own
    const isEmailExisted = await userModel.findUserByEmail(data['email'])
    if (isEmailExisted) throw new Error('This is email already exist please try another one!')
    await userModel.updateUserById(id, data)
    return
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const updateProfileService = async (userId, data, file) => {
  try {
    const imageURLList = await supabaseMethod.uploadAFile(file, NAME_FOLDER_SUPABASE.user, userId)
    const finalData = {
      ...data,
      image_url: imageURLList
    }
    await userModel.updateProfile(userId, finalData)
    return
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
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
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Error with data validation in model', error.message)
  }
}

const searchUserService = async (query) => {
  try {
    const result = await userModel.searchUser(query)
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const feedbackService = async (userId, data) => {
  try {
    const finalData = {
      feedback: {
        ...data,
        create_feedback_date: Date.now()
      }
    }
    await userModel.updateUserById(userId, finalData)
    return
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const paymentService = async (data) => {
  // const returnURL = env.BUILD_MODE === 'production' ? env.CLIENT_URL_PROD2 : env.CLIENT_URL
  const returnURL = env.CLIENT_URL
  const validPayment = VN_PAY.checkPaymentURL(data)
  if (!validPayment) return `${returnURL+'/payment-status?status=invalid'}`
  const { vnp_OrderInfo, vnp_BankCode, vnp_Amount, vnp_ResponseCode } = validPayment
  const orderInfoDetail = vnp_OrderInfo.split(' ')
  const userId = orderInfoDetail[orderInfoDetail.length - 1]
  const membershipName = orderInfoDetail[2]
  if (vnp_ResponseCode === '00') {
    const paymentInfo = {
      user_id: userId,
      amount: parseInt(vnp_Amount) / 100,
      description: vnp_OrderInfo,
      type: membershipName,
      bank_code: vnp_BankCode
    }
    await paymentModel.createPayment(paymentInfo)
    const updateRole = {
      role: 'member'
    }
    await userModel.updateUserById(userId, updateRole)
    return `${returnURL+'/payment-status?status=success'}`
  } else {
    return `${returnURL+'/payment-status?status=fail'}`
  }

}

export const userService = {
  registerService,
  loginService,
  getUserInfoService,
  updateUserInfoService,
  getNewAccessTokenService,
  logoutService,
  searchUserService,
  feedbackService,
  paymentService,
  updateProfileService
}
