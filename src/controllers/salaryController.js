import { salaryService } from '@/services/salaryService'
import { jsonForm } from '@/utils/formatReturnJson'
import { StatusCodes } from 'http-status-codes'

const createSalaryController = async (req, res, next) => {
  try {
    const file = req.file
    const data = req.body
    const userId = req.params.userId
    const result = await salaryService.createSalaryService(userId, data, file)
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(true, 'Create salary successfully', result))
  } catch (error) {
    next(error)
  }
}

const getDetailSalaryController = async (req, res, next) => {
  try {
    const userId = req.params.userId
    const result = await salaryService.getDetailSalaryService(userId)
    res.status(StatusCodes.OK).json(jsonForm.successJsonMessage(true, 'Get salary detail successfully', result))
  } catch (error) {
    next(error)
  }
}

const updateSalaryController = async (req, res, next) => {
  try {
    const file = req.file
    const data = req.body
    const userId = data.user_id
    const salaryId = req.params.salaryId
    await salaryService.updateSalaryService(userId, salaryId, data, file)
    res.status(StatusCodes.OK).json(jsonForm.successJsonMessage(true, 'Update salary successfully'))
  } catch (error) {
    next(error)
  }
}

const deleteSalaryController = async (req, res, next) => {
  try {
    const salaryId = req.params.salaryId
    await salaryService.deleteSalaryService(salaryId)
    res.status(StatusCodes.OK).json(jsonForm.successJsonMessage(true, 'Delete salary successfully'))
  } catch (error) {
    next(error)
  }
}

export const salaryController = {
  createSalaryController,
  getDetailSalaryController,
  updateSalaryController,
  deleteSalaryController
}
