import { planningModel } from '@/models/planningModel'
import ApiError from '@/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createPlanService = async (id, data) => {
  try {
    const finalData = {
      ...data,
      create_by: id
    }
    const result = await planningModel.createPlan(id, finalData)
    const planData = await planningModel.findPlanById(result.insertedId)
    return planData
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Error creating plan', error.message)
  }
}

const getAllPlanService = async (user_id) => {
  try {
    const result = await planningModel.getAllPlan(user_id)
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Get plans fail', error.message)
  }
}

const updatePlanService = async (planId, userId, data) => {
  try {
    const existPlan = await planningModel.findPlanById(planId)
    if (!existPlan) throw new ApiError(StatusCodes.BAD_REQUEST, 'Plan is not exited!')
    await planningModel.updatePlanById(planId, userId, data)
    return
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Update plan fail', error.message)
  }
}

const deletePlanService = async (planId, userId) => {
  try {
    const existPlan = await planningModel.findPlanById(planId)
    if (!existPlan) throw new ApiError(StatusCodes.BAD_REQUEST, 'Plan is not exited!')
    await planningModel.deletePlanById(planId, userId)
    return
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Delete plan fail', error.message)
  }
}

const getPlanPaginationService = async (user_id, limit, page) => {
  try {
    const data = await planningModel.getPlanPagination(user_id, limit, page)
    const totalPlan = await planningModel.countTotalPlan(user_id)
    const totalPage = Math.ceil(totalPlan / limit)
    return {
      data,
      totalPage
    }
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Get plans fail', error.message)
  }
}
export const planService = {
  createPlanService,
  getAllPlanService,
  updatePlanService,
  deletePlanService,
  getPlanPaginationService
}