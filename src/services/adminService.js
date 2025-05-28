import { userModel } from '@/models/userModel'
import ApiError from '@/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const getAllUserService = async () => {
  try {
    const totalUsesr = await userModel.getTotalUser()
    return totalUsesr
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}


const changeUserRoleService = async (user_id, data) => {
  try {
    await userModel.updateUserById(user_id, data)
    return
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const getUserPaginationService = async (page, limit) => {
  try {
    const result = await userModel.getUserPagination(page, limit)
    if (!result || result.users.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'No users found')
    }
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const getTotalUserInMonthService = async (month, year) => {
  try {
    const startDate = new Date(year, month - 1, 1).getTime() // make date from this: // 2023-10-01 ==> 1696118400000
    const endDate = new Date(year, month + 1, 1).getTime() // make date from this: // 2023-11-01 ==> 1698796800000
    const totalUser = await userModel.getTotalUserInMonth(startDate, endDate)
    return totalUser
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}
export const adminService = {
  getAllUserService,
  changeUserRoleService,
  getUserPaginationService,
  getTotalUserInMonthService
}