import { planService } from '@/services/planService'
import { jsonForm } from '@/utils/formetReturnJson'
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

export const planController = {
  createPlanController,
  getAllPlanController
}