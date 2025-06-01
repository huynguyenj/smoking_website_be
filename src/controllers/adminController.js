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
    const { page, limit } = req.body
    const totalUser = await adminService.getUserPaginationService(page, limit)
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
    res.status(StatusCodes.ACCEPTED).json(jsonForm.successJsonMessage(true, 'Get total users in month successfully!', totalUser))
  } catch (error) {
    next(error)
  }
}

export const adminController = {
  getAllUserController,
  changeUserRoleController,
  getUserPaginationController,
  getTotalUserInMonthController
}
