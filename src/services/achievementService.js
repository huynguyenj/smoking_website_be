import { rankModel } from '@/models/rankModel'
import ApiError from '@/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
const smokingAndMoneyAchievementService = async (userId, plan) => {
  try {
    let star = 0
    let achievement = []
    plan.process_stage.map((item) => {
      if (item.isCompleted) {
        star+=1
        achievement.push(`You have complete ${star} stage `)
      }
    })
    const data = {
      star_count: star,
      achievements: achievement,
      totalAchievements: achievement.length
    }
    await rankModel.createRank(userId, data)
    return
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const getUserRankInformationService = async (userId) => {
  try {
    const result = await rankModel.getRankByUserId(userId)
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}


const getRankAdminPaginationService = async (page, limit, sort, sortName) => {
  try {
    const result = await rankModel.getRankForAdminPagination(page, limit, sort, sortName)
    const totalData = await rankModel.getTotalRank()
    const totalPage = Math.ceil(totalData / limit)
    return {
      result,
      totalPage
    }
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const getRankForUserPaginationService = async (page, limit, sort) => {
  try {
    const result = await rankModel.getRankUserPagination(page, limit, sort)
    const totalData = await rankModel.getTotalRank()
    const totalPage = Math.ceil(totalData / limit)
    return {
      result,
      totalPage
    }
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const getUserInfoByRankIdService = async (rankId) => {
  try {
    const result = await rankModel.findUserByRankId(rankId)
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const getTopRankForUserService = async () => {
  try {
    const result = await rankModel.getTopRank()
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const updateRankPositionService = async (sortName) => {
  try {
    const result = await rankModel.getTopRank(sortName)
    await result.forEach(async ({ _id }, index) => {
      const newPosition = index + 1
      await rankModel.updatePosition(_id, { position: newPosition })
    })
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const updateRankPositionSpecificService = async (rankId, data) => {
  try {
    await rankModel.updatePosition(rankId, data)
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

export const achievementService = {
  smokingAndMoneyAchievementService,
  getUserRankInformationService,
  getRankAdminPaginationService,
  getUserInfoByRankIdService,
  updateRankPositionService,
  getTopRankForUserService,
  getRankForUserPaginationService,
  updateRankPositionSpecificService
}