import { cigaretteModel } from '@/models/cigaretteModel'
import { planningModel } from '@/models/planningModel'
import ApiError from '@/utils/ApiError'
import { calculate } from '@/utils/calculate'
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
    if (!existPlan) throw new Error('Plan is not exited!')
    const result = await planningModel.updatePlanById(planId, userId, data)
    if (!result) throw new Error('Update fail!')
    return
  } catch (error) {
    throw new ApiError(StatusCodes.NOT_FOUND, error.message)
  }
}

const deletePlanService = async (planId, userId) => {
  try {
    const existPlan = await planningModel.findPlanById(planId)
    if (!existPlan) throw new Error('Plan is not existed!')
    const result = await planningModel.deletePlanById(planId, userId)
    if (!result) throw new Error('Delete fail!')
    return
  } catch (error) {
    throw new ApiError(StatusCodes.NOT_FOUND, error.message)
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

const getRecommendPlanService = async (cigaretteId, user_Id) => {
  try {
    const cigarette = await cigaretteModel.findCigaretteById(cigaretteId)
    if (!cigarette) throw new ApiError(StatusCodes.NOT_FOUND, 'Your cigarette process is not existed!')
    const contentForPlan = calculate.calculateCigarettesReductionPerWeek(cigarette.smoking_frequency_per_day, cigarette.nicotine_evaluation)
    const dataForPlan = {
      process_stage: 'start',
      health_status: 'bad',
      content: contentForPlan.join(', '),
      user_id: user_Id,
      create_by: user_Id
    }
    const newPlan = await planningModel.createPlan(user_Id, dataForPlan)
    if (!newPlan) throw new Error('Create recommend fail!')
    const planCreated = await planningModel.findPlanById(newPlan.insertedId)
    return planCreated
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const getPlanDetailService = async (blogId) => {
  try {
    const plan = await planningModel.findPlanById(blogId)
    if (!plan) throw new Error('This plan is not existed')
    return plan
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}
export const planService = {
  createPlanService,
  getAllPlanService,
  updatePlanService,
  deletePlanService,
  getPlanPaginationService,
  getRecommendPlanService,
  getPlanDetailService
}