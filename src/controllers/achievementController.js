
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

const getUserRankInformationController = async (req, res, next) => {
  try {
    const userId = req.user.id
    const result = await achievementService.getUserRankInformationService(userId)
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(true, 'Create successfully!', result))
  } catch (error) {
    next(error)
  }
}

const getRankPaginationController = async (req, res, next) => {
  try {
    const { page, limit, sort, sortName } = req.body
    const dataReturn = await achievementService.getRankPaginationService(page, limit, sort, sortName)
    const finalResult = jsonForm.paginationReturn(dataReturn.result, limit, page, dataReturn.totalPage)
    res.status(StatusCodes.ACCEPTED).json(jsonForm.successJsonMessage(true, 'Get ranks successfully!', finalResult))
  } catch (error) {
    next(error)
  }
}

const getUserInfoByRankIdController = async (req, res, next) => {
  try {
    const { rankId } = req.params
    const result = await achievementService.getUserInfoByRankIdService(rankId)
    res.status(StatusCodes.ACCEPTED).json(jsonForm.successJsonMessage(true, 'Get userInfo successfully!', result))
  } catch (error) {
    next(error)
  }
}

const updateRankPositionSpecificController = async (req, res, next) => {
  try {
    const { rankId } = req.params
    const data = req.body
    await achievementService.updateRankPositionSpecificService(rankId, data)
    res.status(StatusCodes.ACCEPTED).json(jsonForm.successJsonMessage(true, 'Update successfully!'))
  } catch (error) {
    next(error)
  }
}

const getTopRankForUserController = async (req, res, next) => {
  try {
    const { page, limit, sort } = req.body
    const dataReturn = await achievementService.getRankForUserPaginationService(page, limit, sort)
    const finalResult = jsonForm.paginationReturn(dataReturn.result, limit, page, dataReturn.totalPage)
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(true, 'Get rank successfully!', finalResult))
  } catch (error) {
    next(error)
  }
}

const updateRankPositionController = async (req, res, next) => {
  try {
    const { option_sort } = req.body
    await achievementService.updateRankPositionService(option_sort)
    res.status(StatusCodes.ACCEPTED).json(jsonForm.successJsonMessage(true, 'Update successfully!'))
  } catch (error) {
    next(error)
  }
}
export const achievementController = {
  smokingAndMoneyAchievementController,
  getUserRankInformationController,
  getRankPaginationController,
  getUserInfoByRankIdController,
  getTopRankForUserController,
  updateRankPositionController,
  updateRankPositionSpecificController
}