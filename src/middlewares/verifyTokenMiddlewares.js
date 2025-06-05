/*eslint-disable no-console */
/*eslint-disable no-unused-vars */
import ApiError from '@/utils/ApiError'
import { jwtHelper } from '@/utils/jwtHelper'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const refreshToken = req.cookies.refreshToken
  if (!authHeader) throw new ApiError(StatusCodes.UNAUTHORIZED, 'TOKEN_EXPIRED')
  const token = authHeader.split(' ')[1] // authHeader = 'Bearer token' => we will split in array ['Bearer', 'token'] and take token by [1] because it index position is 1
  try {
    const decoded = jwtHelper.verifyToken(token)
    req.user = decoded
    // add user information from token when it has been decoded to request that next layer can have information from this request can use or not.
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'TOKEN_EXPIRED')
  }
}

export const verifyRefreshTokenMiddlewares = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) throw new ApiError(StatusCodes.UNAUTHORIZED, 'TOKEN_EXPIRED')
  try {
    const decoded = jwtHelper.verifyToken(refreshToken)
    req.user = decoded
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'TOKEN_EXPIRED')
  }
}