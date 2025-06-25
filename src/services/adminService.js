import { membershipModel } from '@/models/membershipModel'
import { paymentModel } from '@/models/paymentModel'
import { userModel } from '@/models/userModel'
import ApiError from '@/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const getAllUserService = async () => {
  try {
    const totalUser = await userModel.getTotalUser()
    return totalUser
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

const getUserPaginationService = async (page, limit, sort) => {
  try {
    const result = await userModel.getUserPagination(page, limit, sort)
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

const getFeedbackPaginationService = async (limit, page, sort) => {
  try {
    if (!sort) sort = -1
    const result = await userModel.getFeedback(limit, page, sort)
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const deleteFeedbackService = async (userId) => {
  try {
    const user = userModel.findOneUserById(userId)
    if (!user) throw new Error('This user has been deleted with feedback!')
    await userModel.deleteFeedback(userId)
    return
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const createMembershipService = async (adminId, data) => {
  try {
    const finalData = {
      ...data,
      create_by: adminId
    }
    const result = membershipModel.createMembership(finalData)
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const updateMembershipService = async (membershipId, data) => {
  try {
    const membership = await membershipModel.findMembershipById(membershipId)
    if (!membership) throw new Error('This membership is not existed!')

    const finalData = {
      ...data,
      update_date: Date.now()
    }
    const result = await membershipModel.updateMembership(membershipId, finalData)
    if (!result) throw new Error('Update fail!')
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const deleteMembershipService = async (membershipId) => {
  try {
    await membershipModel.deleteMembership(membershipId)
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const getMembershipsService = async () => {
  try {
    const result = await membershipModel.getMemberships()
    if (!result || result.length === 0) throw new Error('There are no membership has been created!')
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const getMembershipsByIdService = async (membershipId) => {
  try {
    const result = await membershipModel.findMembershipById(membershipId)
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}
const getTotalPaymentService = async () => {
  try {
    const totalPayment = await paymentModel.totalPayment()
    return totalPayment
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const getRevenueService = async () => {
  try {
    const revenue = await paymentModel.getRevenue()
    return revenue
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const getUserDetailService = async (userId) => {
  try {
    const result = await userModel.findOneUserById(userId)
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const deleteUserService = async (userId) => {
  try {
    await userModel.deleteUser(userId)
    return
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const setActiveUserService = async (userId, active) => {
  try {
    await userModel.setActiveUser(userId, active)
    return
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}
export const adminService = {
  getAllUserService,
  changeUserRoleService,
  getUserPaginationService,
  getTotalUserInMonthService,
  getFeedbackPaginationService,
  deleteFeedbackService,
  createMembershipService,
  updateMembershipService,
  getMembershipsService,
  getMembershipsByIdService,
  getTotalPaymentService,
  getRevenueService,
  deleteMembershipService,
  getUserDetailService,
  deleteUserService,
  setActiveUserService
}