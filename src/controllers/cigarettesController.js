import { cigaretteService } from '@/services/cigarettesService'
import { jsonForm } from '@/utils/formatReturnJson'
import { StatusCodes } from 'http-status-codes'

const createCigaretteController = async (req, res, next) => {
  try {
    const data = req.body
    const { id } = req.user
    const result = await cigaretteService.createCigaretteService(id, data)
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(true, 'Create successfully!', result))
  } catch (error) {
    next(error)
  }
}


const getAllCigaretteInfoController = async (req, res, next) => {
  try {
    const { id } = req.user
    const result = await cigaretteService.getAllCigaretteInfoService(id)
    const finalResult = [...result.listCigarette]
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(true, 'Get all cigarettes successfully!', finalResult))
  } catch (error) {
    next(error)
  }
}

const getCigaretteInfoPaginationController = async (req, res, next) => {
  try {
    const { limit, page } = req.body
    const { id } = req.user
    const dataReturn = await cigaretteService.getCigaretteInfoPaginationService(id, limit, page)
    const result = jsonForm.paginationReturn(dataReturn.paginationData.paginationList, limit, page, dataReturn.totalPage)
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(true, 'Get cigarettes pagination successfully!', result))
  } catch (error) {
    next(error)
  }
}


const updateCigaretteController = async (req, res, next) => {
  try {
    const data = req.body
    const { cigaretteId } = req.params
    const { id } = req.user
    await cigaretteService.updateCigaretteService(id, cigaretteId, data)
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(true, 'Update successfully!'))
  } catch (error) {
    next(error)
  }
}


const deleteCigaretteController = async (req, res, next) => {
  try {
    const { id } = req.user
    const { cigaretteId } = req.params
    await cigaretteService.deleteCigaretteService(id, cigaretteId)
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(true, 'Delete successfully!'))
  } catch (error) {
    next(error)
  }
}


export const cigaretteController = {
  createCigaretteController,
  getAllCigaretteInfoController,
  getCigaretteInfoPaginationController,
  deleteCigaretteController,
  updateCigaretteController
}