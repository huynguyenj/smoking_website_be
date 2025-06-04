import { cigaretteModel } from '@/models/cigaretteModel'
import ApiError from '@/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createCigaretteService = async (id, data) => {
  try {
    const result =await cigaretteModel.createCigarette(id, data)
    const createdData = await cigaretteModel.findCigaretteById(result.insertedId)
    return createdData
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}


const getAllCigaretteInfoService = async (id) => {
  try {
    const result =await cigaretteModel.getAllCigaretteInfoById(id)
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.NOT_FOUND, error.message)
  }
}


const getCigaretteInfoPaginationService = async (id, limit, page) => {
  try {
    const paginationData = await cigaretteModel.getAllCigarettePagination(id, limit, page)
    const totalData = await cigaretteModel.countTotalCigarettes(id)
    const totalPage = Math.ceil(totalData / limit)
    return {
      paginationData,
      totalPage
    }
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, error.message)
  }
}


const updateCigaretteService = async (id, cigaretteId, data) => {
  try {
    const result = await cigaretteModel.updateCigarette(id, cigaretteId, data)
    if (!result) throw new Error('Update fail!')
    return
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}


const deleteCigaretteService = async (id, cigaretteId) => {
  try {
    const result = await cigaretteModel.deleteCigarette(id, cigaretteId)
    if (!result) throw new Error('Delete fail!')
    return
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const getCigaretteDetailController = async (cigaretteId) => {
  try {
    const result = await cigaretteModel.findCigaretteById(cigaretteId)
    if (!result) throw new Error('This cigarette is not exited!')
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}
export const cigaretteService = {
  createCigaretteService,
  getAllCigaretteInfoService,
  getCigaretteInfoPaginationService,
  updateCigaretteService,
  deleteCigaretteService,
  getCigaretteDetailController
}