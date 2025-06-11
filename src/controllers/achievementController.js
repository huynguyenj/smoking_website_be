
import { achievementService } from '@/services/achievementService'
// import { cigaretteService } from '@/services/cigarettesService'
import { jsonForm } from '@/utils/formatReturnJson'
import { StatusCodes } from 'http-status-codes'

const smokingAndMoneyAchievementController = async (req, res, next) => {
  try {
    const userId = req.user.id
    const result = await achievementService.smokingAndMoneyAchievementService(userId)
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(true, 'Create successfully!', result))
  } catch (error) {
    next(error)
  }
}

const getRankController = async (req, res, next) => {
  try {
    const userId = req.user.id
    const result = await achievementService.getRankService(userId)
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(true, 'Create successfully!', result))
  } catch (error) {
    next(error)
  }
}
export const achievementController = {
  smokingAndMoneyAchievementController,
  getRankController
}