import { planService } from '@/services/planService'
import { jsonForm } from '@/utils/formatReturnJson'
import { StatusCodes } from 'http-status-codes'

const createPlanController = async (req, res, next) => {
  try {
    const { id } = req.user
    const data = req.body
    const result = await planService.createPlanService(id, data)
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(StatusCodes.CREATED, 'Created successfully!', result))
  } catch (error) {
    next(error)
  }
}

const getAllPlanController = async (req, res, next) => {
  try {
    const { id } = req.user
    const result = await planService.getAllPlanService(id)
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(StatusCodes.CREATED, 'Get plans successfully!', result.planList))
  } catch (error) {
    next(error)
  }
}

const updatePlanController = async (req, res, next) => {
  try {
    const planId = req.params.id
    const userId = req.user.id
    const data = req.body
    await planService.updatePlanService(planId, userId, data)
    res.status(StatusCodes.ACCEPTED).json(jsonForm.successJsonMessage(StatusCodes.CREATED, 'Update successfully!'))
  } catch (error) {
    next(error)
  }
}

const deletePlanController = async (req, res, next) => {
  try {
    const planId = req.params.id
    const userId = req.user.id
    await planService.deletePlanService(planId, userId)
    res.status(StatusCodes.ACCEPTED).json(jsonForm.successJsonMessage(StatusCodes.CREATED, 'Delete successfully!'))
  } catch (error) {
    next(error)
  }
}

const getPlanPaginationController = async (req, res, next) => {
  try {
    const { limit, page } = req.body
    const user_id = req.user.id
    const dataReturn = await planService.getPlanPaginationService(user_id, limit, page)
    const result = jsonForm.paginationReturn(dataReturn.data.planList, limit, page, dataReturn.totalPage)
    res.status(StatusCodes.ACCEPTED).json(jsonForm.successJsonMessage(StatusCodes.ACCEPTED, 'Get data success!', result))
  } catch (error) {
    next(error)
  }
}

const getRecommendPlanController = async (req, res, next) => {
  try {
    const { cigaretteId } = req.params
    const userId = req.user.id
    const dataReturn = await planService.getRecommendPlanService(cigaretteId, userId)
    res.status(StatusCodes.ACCEPTED).json(jsonForm.successJsonMessage(StatusCodes.ACCEPTED, 'Get data success!', dataReturn))
  } catch (error) {
    next(error)
  }
}

const getPlanDetailController = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await planService.getPlanDetailService(id)
    res.status(StatusCodes.ACCEPTED).json(jsonForm.successJsonMessage(true, 'Get plan successfully!', result))
  } catch (error) {
    next(error)
  }
}
export const planController = {
  createPlanController,
  getAllPlanController,
  updatePlanController,
  deletePlanController,
  getPlanPaginationController,
  getRecommendPlanController,
  getPlanDetailController
}