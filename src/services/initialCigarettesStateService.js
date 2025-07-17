import { initialCigarette } from '@/models/initialCigarettesModel'
import ApiError from '@/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createInitialCigaretteService = async (userId, data) => {
  try {
    const result = await initialCigarette.createInitialState(userId, data)
    const createData = await initialCigarette.getInitialStateById(result.insertedId)
    return createData
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}


const getInitialCigaretteInfoService = async (id) => {
  try {
    const result =await initialCigarette.getInitialStateById(id)
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.NOT_FOUND, error.message)
  }
}


const getInitialCigaretteInfoPaginationService = async (id, limit, page, sort) => {
  try {
    const paginationData = await initialCigarette.getInitialStatePagination(id, limit, page, sort)
    const totalData = await initialCigarette.countTotalInitialCigarettes(id)
    const totalPage = Math.ceil(totalData / limit)
    return {
      paginationData,
      totalPage
    }
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, error.message)
  }
}


const updateInitialCigaretteService = async (id, initialCigaretteId, data) => {
  try {
    const result = await initialCigarette.updateInitialState(id, initialCigaretteId, data)
    if (!result) throw new Error('Update fail!')
    return
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}


const deleteInitialCigaretteService = async (id, initialCigaretteId) => {
  try {
    const isPlanExisted = await initialCigarette.checkInitialStateByPlanId(initialCigaretteId)
    if (isPlanExisted) throw new Error('Please delete your plan with this before delete this state!')
    const result = await initialCigarette.deleteInitialState(id, initialCigaretteId)
    if (!result) throw new Error('Delete fail!')
    return
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const getAllInitialStateService = async (userId) => {
  try {
    const result = await initialCigarette.getAllInitialState(userId)
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

export const initialCigaretteService = {
  createInitialCigaretteService,
  getInitialCigaretteInfoService,
  getInitialCigaretteInfoPaginationService,
  updateInitialCigaretteService,
  deleteInitialCigaretteService,
  getAllInitialStateService
}