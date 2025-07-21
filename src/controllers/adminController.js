import { adminService } from '@/services/adminService'
import { jsonForm } from '@/utils/formatReturnJson'
import { StatusCodes } from 'http-status-codes'


const createUserAccountController = async (req, res, next) => {
  try {
    const data = req.body
    const result = await adminService.createUserAccountService(data)
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(true, 'Create successfully', result))
  } catch (error) {
    next(error)
  }
}
const getAllUserController = async (req, res, next) => {
  try {
    const totalUser = await adminService.getAllUserService()
    res.status(StatusCodes.OK).json(jsonForm.successJsonMessage(true, 'Get total successfully', totalUser))
  } catch (error) {
    next(error)
  }
}

const changeUserRoleController = async (req, res, next) => {
  try {
    const updateData = req.body
    const { user_id } = req.params
    await adminService.changeUserRoleService(user_id, updateData)
    res.status(StatusCodes.ACCEPTED).json(jsonForm.successJsonMessage(true, 'Update successfully!'))
  } catch (error) {
    next(error)
  }
}

const getUserPaginationController = async (req, res, next) => {
  try {
    const { page, limit, sort } = req.body
    const totalUser = await adminService.getUserPaginationService(page, limit, sort)
    const result = jsonForm.paginationReturn(totalUser.users, limit, page, totalUser.totalPages)
    res.status(StatusCodes.OK).json(jsonForm.successJsonMessage(true, 'Get total users per page successfully!', result))
  } catch (error) {
    next(error)
  }
}

const getCoachPaginationController = async (req, res, next) => {
  try {
    const { page, limit, sort } = req.body
    const totalUser = await adminService.getCoachPaginationService(page, limit, sort)
    const result = jsonForm.paginationReturn(totalUser.users, limit, page, totalUser.totalPages)
    res.status(StatusCodes.OK).json(jsonForm.successJsonMessage(true, 'Get total users per page successfully!', result))
  } catch (error) {
    next(error)
  }
}

const getTotalUserInMonthController = async (req, res, next) => {
  try {
    const { month, year } = req.body
    const totalUser = await adminService.getTotalUserInMonthService(month, year)
    res.status(StatusCodes.OK).json(jsonForm.successJsonMessage(true, `Get total users in month ${month} successfully!`, totalUser))
  } catch (error) {
    next(error)
  }
}

const getFeedbackPaginationController = async (req, res, next) => {
  try {
    const { limit, page, sort } = req.body
    const result = await adminService.getFeedbackPaginationService(limit, page, sort)
    const finalData = jsonForm.paginationReturn(result.result, limit, page, result.totalFeedback)
    res.status(StatusCodes.OK).json(jsonForm.successJsonMessage(true, 'Get feedback successfully!', finalData))
  } catch (error) {
    next(error)
  }
}

const deleteFeedbackController = async (req, res, next) => {
  try {
    const { userId } = req.params
    await adminService.deleteFeedbackService(userId)
    res.status(StatusCodes.ACCEPTED).json(jsonForm.successJsonMessage(true, 'Delete feedback successfully!'))
  } catch (error) {
    next(error)
  }
}

const createMembershipController = async (req, res, next) => {
  try {
    const adminId = req.user.id
    const data = req.body
    const result = await adminService.createMembershipService(adminId, data)
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(true, 'Create membership successfully!', result))
  } catch (error) {
    next(error)
  }
}

const updateMembershipAdminController = async (req, res, next) => {
  try {
    const { membershipId } = req.params
    const data = req.body
    await adminService.updateMembershipAdminService(membershipId, data)
    res.status(StatusCodes.ACCEPTED).json(jsonForm.successJsonMessage(true, 'Update membership successfully!'))
  } catch (error) {
    next(error)
  }
}

const deleteMembershipController = async (req, res, next) => {
  try {
    const { membershipId } = req.params
    await adminService.deleteMembershipService(membershipId)
    res.status(StatusCodes.ACCEPTED).json(jsonForm.successJsonMessage(true, 'Delete membership successfully!'))
  } catch (error) {
    next(error)
  }
}

const getMembershipsController = async (req, res, next) => {
  try {
    const result = await adminService.getMembershipsService()
    res.status(StatusCodes.OK).json(jsonForm.successJsonMessage(true, 'Get memberships successfully!', result))
  } catch (error) {
    next(error)
  }
}

const getMembershipsByIdController = async (req, res, next) => {
  try {
    const { membershipId } = req.params
    const result = await adminService.getMembershipsByIdService(membershipId)
    res.status(StatusCodes.OK).json(jsonForm.successJsonMessage(true, 'Get membership successfully!', result))
  } catch (error) {
    next(error)
  }
}

const getTotalPaymentController = async (req, res, next) => {
  try {
    const result = await adminService.getTotalPaymentService()
    res.status(StatusCodes.OK).json(jsonForm.successJsonMessage(true, 'Get total payment successfully!', result))
  } catch (error) {
    next(error)
  }
}

const getRevenueController = async (req, res, next) => {
  try {
    const result = await adminService.getRevenueService()
    res.status(StatusCodes.OK).json(jsonForm.successJsonMessage(true, 'Get revenue successfully!', result))
  } catch (error) {
    next(error)
  }
}

const getRevenueByYearController = async (req, res, next) => {
  try {
    const { year } = req.body
    const result = await adminService.getRevenueByYearService(year)
    res.status(StatusCodes.OK).json(jsonForm.successJsonMessage(true, 'Get revenue successfully!', result))
  } catch (error) {
    next(error)
  }
}

const getUserDetailController = async (req, res, next) => {
  try {
    const { userId } = req.params
    const result = await adminService.getUserDetailService(userId)
    res.status(StatusCodes.ACCEPTED).json(jsonForm.successJsonMessage(true, 'Get detail successfully!', result))
  } catch (error) {
    next(error)
  }
}

const deleteUserController = async (req, res, next) => {
  try {
    const { userId } = req.params
    await adminService.deleteUserService(userId)
    res.status(StatusCodes.ACCEPTED).json(jsonForm.successJsonMessage(true, 'Delete user successfully!'))
  } catch (error) {
    next(error)
  }
}

const setActiveController = async (req, res, next) => {
  try {
    const { userId } = req.params
    const data = req.body
    await adminService.setActiveUserService(userId, data)
    res.status(StatusCodes.ACCEPTED).json(jsonForm.successJsonMessage(true, 'Set active user successfully!'))
  } catch (error) {
    next(error)
  }
}
export const adminController = {
  createUserAccountController,
  getAllUserController,
  changeUserRoleController,
  getUserPaginationController,
  getCoachPaginationController,
  getTotalUserInMonthController,
  getRevenueByYearController,
  getFeedbackPaginationController,
  deleteFeedbackController,
  createMembershipController,
  updateMembershipAdminController,
  getMembershipsController,
  getMembershipsByIdController,
  getTotalPaymentController,
  getRevenueController,
  deleteMembershipController,
  getUserDetailController,
  deleteUserController,
  setActiveController
}
