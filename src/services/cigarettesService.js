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
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}


const updateCigaretteService = async (id, cigaretteId, data) => {
  try {
    await cigaretteModel.updateCigarette(id, cigaretteId, data)
    return
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}


const deleteCigaretteService = async (id, cigaretteId) => {
  try {
    await cigaretteModel.deleteCigarette(id, cigaretteId)
    return
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}
export const cigaretteService = {
  createCigaretteService,
  getAllCigaretteInfoService,
  getCigaretteInfoPaginationService,
  updateCigaretteService,
  deleteCigaretteService
}