import { adminService } from '@/services/adminService'
import ApiError from '@/utils/ApiError'
import { jsonForm } from '@/utils/formatReturnJson'
import { StatusCodes } from 'http-status-codes'

const getAllUserController = async (req, res, next) => {
  try {
    const totalUser = await adminService.getAllUserService()
    res.status(StatusCodes.ACCEPTED).json(jsonForm.successJsonMessage(true, 'Get total successfully', totalUser))
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
    res.status(StatusCodes.ACCEPTED).json(jsonForm.successJsonMessage(true, 'Get total users per page successfully!', result))
  } catch (error) {
    next(error)
  }
}

const getTotalUserInMonthController = async (req, res, next) => {
  try {
    const { month, year } = req.body
    const totalUser = await adminService.getTotalUserInMonthService(month, year)
    res.status(StatusCodes.ACCEPTED).json(jsonForm.successJsonMessage(true, `Get total users in month ${month} successfully!`, totalUser))
  } catch (error) {
    next(error)
  }
}

const getFeedbackPaginationController = async (req, res, next) => {
  try {
    const { limit, page, sort } = req.body
    const result = await adminService.getFeedbackPaginationService(limit, page, sort)
    res.status(StatusCodes.OK).json(jsonForm.successJsonMessage(true, 'Get feedback successfully!', result))
  } catch (error) {
    next(error)
  }
}

const deleteFeedbackController = async (req, res, next) => {
  try {
    const { userId } = req.params
    await adminService.deleteFeedbackService(userId)
    res.status(StatusCodes.OK).json(jsonForm.successJsonMessage(true, 'Delete feedback successfully!'))
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

const updateMembershipController = async (req, res, next) => {
  try {
    const { membershipId } = req.params
    const data = req.body
    await adminService.updateMembershipService(membershipId, data)
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(true, 'Update membership successfully!'))
  } catch (error) {
    next(error)
  }
}

const getMembershipsController = async (req, res, next) => {
  try {
    const result = await adminService.getMembershipsService()
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(true, 'Get memberships successfully!', result))
  } catch (error) {
    next(error)
  }
}

const getTotalPaymentController = async (req, res, next) => {
  try {
    const result = await adminService.getTotalPaymentService()
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(true, 'Get total payment successfully!', result))
  } catch (error) {
    next(error)
  }
}

const getRevenueController = async (req, res, next) => {
  try {
    const result = await adminService.getRevenueService()
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(true, 'Get revenue successfully!', result))
  } catch (error) {
    next(error)
  }
}
export const adminController = {
  getAllUserController,
  changeUserRoleController,
  getUserPaginationController,
  getTotalUserInMonthController,
  getFeedbackPaginationController,
  deleteFeedbackController,
  createMembershipController,
  updateMembershipController,
  getMembershipsController,
  getTotalPaymentController,
  getRevenueController
}
