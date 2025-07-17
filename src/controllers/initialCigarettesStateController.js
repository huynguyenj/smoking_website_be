import { initialCigaretteService } from '@/services/initialCigarettesStateService'
import { jsonForm } from '@/utils/formatReturnJson'
import { StatusCodes } from 'http-status-codes'

const createInitialCigaretteController = async (req, res, next) => {
  try {
    const data = req.body
    const { id } = req.user
    const result = await initialCigaretteService.createInitialCigaretteService(id, data)
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(true, 'Create successfully!', result))
  } catch (error) {
    next(error)
  }
}


const getInitialCigaretteInfoController = async (req, res, next) => {
  try {
    const { initialId } = req.params
    const result = await initialCigaretteService.getInitialCigaretteInfoService(initialId)
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(true, 'Get initial cigarette successfully!', result))
  } catch (error) {
    next(error)
  }
}

const getInitialCigarettePaginationController = async (req, res, next) => {
  try {
    const { limit, page, sort } = req.body
    const { id } = req.user
    const dataReturn = await initialCigaretteService.getInitialCigaretteInfoPaginationService(id, limit, page, sort)
    const result = jsonForm.paginationReturn(dataReturn.paginationData, limit, page, dataReturn.totalPage)
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(true, 'Get cigarettes pagination successfully!', result))
  } catch (error) {
    next(error)
  }
}


const updateInitialCigaretteController = async (req, res, next) => {
  try {
    const data = req.body
    const { initialId } = req.params
    const { id } = req.user
    await initialCigaretteService.updateInitialCigaretteService(id, initialId, data)
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(true, 'Update successfully!'))
  } catch (error) {
    next(error)
  }
}


const deleteInitialCigaretteController = async (req, res, next) => {
  try {
    const { initialId } = req.params
    const { id } = req.user
    await initialCigaretteService.deleteInitialCigaretteService(id, initialId)
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(true, 'Delete successfully!'))
  } catch (error) {
    next(error)
  }
}

const getAllInitialStateController = async (req, res, next) => {
  try {
    const { id } = req.user
    const result = await initialCigaretteService.getAllInitialStateService(id)
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(true, 'Get list success!', result))
  } catch (error) {
    next(error)
  }
}

export const initialCigaretteController = {
  createInitialCigaretteController,
  getInitialCigaretteInfoController,
  getInitialCigarettePaginationController,
  deleteInitialCigaretteController,
  updateInitialCigaretteController,
  getAllInitialStateController
}