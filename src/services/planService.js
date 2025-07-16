import { cigaretteModel } from '@/models/cigaretteModel'
import { initialCigarette } from '@/models/initialCigarettesModel'
import { planningModel } from '@/models/planningModel'
import ApiError from '@/utils/ApiError'
import { calculate } from '@/utils/calculate'
import { formatDate } from '@/utils/formDate'
import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { achievementService } from './achievementService'

const createPlanService = async (id, data) => {
  try {
    const initialCigaretteInfo = await initialCigarette.getInitialStateById(data.initial_cigarette_id)
    if (!initialCigaretteInfo) throw new Error('You must provide your cigarette at initial state!')
    const stage_data = calculate.calculateCigarettesReductionForPlan(data.start_date, initialCigaretteInfo.smoking_frequency_per_day, initialCigaretteInfo.nicotine_evaluation)
    const finalData = {
      ...data,
      create_by: id,
      process_stage: stage_data,
      expected_result_date: stage_data[stage_data.length-1].end_time
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
    let finalData = {
      ...data,
      user_id: new ObjectId(userId)
    }
    if (existPlan.start_date !== data.start_date) {
      const initialCigaretteInfo = await initialCigarette.getInitialStateById(existPlan.initial_cigarette_id)
      const newStage = calculate.calculateCigarettesReductionForPlan(data.start_date, initialCigaretteInfo.smoking_frequency_per_day, initialCigaretteInfo.nicotine_evaluation)
      finalData = {
        ...data,
        process_stage: newStage,
        expected_result_date: newStage[newStage.length-1].end_time,
        user_id: new ObjectId(userId)
      }
      const result = await planningModel.updatePlanById(planId, userId, finalData)
      if (!result) throw new Error('Update fail!')
    } else {
      const result = await planningModel.updatePlanById(planId, userId, finalData)
      if (!result) throw new Error('Update fail!')
    }
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

const getPlanPaginationService = async (user_id, limit, page, sort) => {
  try {
    const data = await planningModel.getPlanPagination(user_id, limit, page, sort)
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

// const getRecommendPlanService = async (cigaretteId, user_Id) => {
//   try {
//     const cigarette = await cigaretteModel.findCigaretteById(cigaretteId)
//     if (!cigarette) throw new ApiError(StatusCodes.NOT_FOUND, 'Your cigarette process is not existed!')
//     const contentForPlan = calculate.calculateCigarettesReductionPerWeek(cigarette.smoking_frequency_per_day, cigarette.nicotine_evaluation)
//     const dataForPlan = {
//       process_stage: 'start',
//       health_status: 'bad',
//       content: contentForPlan.join(', '),
//       user_id: user_Id,
//       create_by: user_Id
//     }
//     const newPlan = await planningModel.createPlan(user_Id, dataForPlan)
//     if (!newPlan) throw new Error('Create recommend fail!')
//     const planCreated = await planningModel.findPlanById(newPlan.insertedId)
//     return planCreated
//   } catch (error) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
//   }
// }

const getPlanDetailService = async (blogId) => {
  try {
    const plan = await planningModel.findPlanById(blogId)
    if (!plan) throw new Error('This plan is not existed')
    return plan
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const checkCompleteStageService = async (planId, userId, data) => {
  try {
    const { start_time, end_time, expected_result } = data
    const result = await cigaretteModel.getCigaretteSpecificStage(planId, userId, start_time, end_time)
    //Check if user cigarette processes are equal to start time in end time
    if (result.length < 7) throw new Error(`Your cigarettes process is not qualified, your stage start at ${formatDate(start_time)} and end at ${formatDate(end_time)} !`)
    //Check if amount of cigarettes are match with ideal result in stage plan
    const totalCigarettes = result.reduce((total, { smoking_frequency_per_day }) => { return total + smoking_frequency_per_day }, 0)
    const averageCigarettesInAWeek = totalCigarettes / result.length
    if (averageCigarettesInAWeek < expected_result) throw new Error(`You are not ready to go next stage yet. Your average amount of use cigarettes in a week is ${averageCigarettesInAWeek} and not qualify the ideal result from plan ${expected_result}`)
    //Update stage in plan when user qualified
    const plan = await planningModel.findPlanById(planId)
    plan.process_stage.map((item) => {
      if (item.start_time === start_time) {
        item.isCompleted = true
      }
    })
    await planService.updatePlanService(planId, userId, plan)
    await achievementService.smokingAndMoneyAchievementService(userId, plan)
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
  getPlanDetailService,
  checkCompleteStageService
}