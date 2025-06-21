import { cigaretteModel } from '@/models/cigaretteModel'
import { rankModel } from '@/models/rankModel'
import ApiError from '@/utils/ApiError'
import { REQUIRED_FOR_STAR } from '@/utils/constants'
import { StatusCodes } from 'http-status-codes'
const smokingAndMoneyAchievementService = async (userId) => {
  try {
    //Get cigarette that have no-smoking-field and saving-money not null
    const result = await cigaretteModel.countMoneyAndNoSmoking(userId)
    let totalSaving = 0
    let totalDayOutSmoke = 0
    //Calculate saving and total date that not smoke.
    result.listResult.forEach((item) => {
      totalSaving += item.saving_money - item.money_consumption_per_day
      totalDayOutSmoke++
    })
    //Condition to have achievement
    if (result.listResult.length === 0) throw new Error('You do not have any date off smoke or money saving to evaluate!')
    if (totalSaving >= REQUIRED_FOR_STAR.minMoney || totalDayOutSmoke >= REQUIRED_FOR_STAR.minDayNoSmoke ) {
      const achievement = [`Save ${totalSaving}`, `No smoking in ${totalDayOutSmoke} days`]
      const data = {
        star_count: result.listResult.length,
        achievements: achievement
      }
      await rankModel.createRank(userId, data)
      return {
        totalSaving,
        totalDayOutSmoke
      }
    } else {
      throw new Error('You are not qualify yet. Make sure your money saving is above 100.000VND or date without smoke at least 2!')
    }
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const getRankService = async (userId) => {
  try {
    const result = await rankModel.getRankByUserId(userId)
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

export const achievementService = {
  smokingAndMoneyAchievementService,
  getRankService
}