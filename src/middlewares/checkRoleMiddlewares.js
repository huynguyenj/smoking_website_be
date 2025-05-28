import ApiError from '@/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

export const checkRoleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const { role } = req.user
      if (!allowedRoles.includes(role)) throw new ApiError(StatusCodes.UNAUTHORIZED, 'You not have permission to access this feature!')
      next()
    } catch (error) {
      next(error)
    }
  }
}