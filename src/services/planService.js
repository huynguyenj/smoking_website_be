import { planningModel } from '@/models/planningModel'
import { userModel } from '@/models/userModel'
import ApiError from '@/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createPlanService = async (id, data) => {
  try {
    const finalData = {
      ...data,
      create_by: id
    }
    const result = await planningModel.createPlan(finalData)
    const planData = await planningModel.findPlanById(result.insertedId)
    return planData
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Error creating plan', error.message)
  }
}

const getAllPlanService = async (user_id) => {
  try {
    const result = await userModel.getAllPlan(user_id)
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Get plans fail', error.message)
  }
}
export const planService = {
  createPlanService,
  getAllPlanService
}