import { notificationService } from '@/services/notificationService'
import { jsonForm } from '@/utils/formatReturnJson'
import { StatusCodes } from 'http-status-codes'

const createMessageNotificationController = async (req, res, next) => {
  try {
    const data = req.body
    await notificationService.createMessageNotificationService(data)
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(true, 'Create successfully'))
  } catch (error) {
    next(error)
  }
}

const getAnnouncementController = async (req, res, next) => {
  try {
    const { page, limit } = req.body
    const result = await notificationService.getAnnouncementService(page, limit)
    const paginationData = jsonForm.paginationReturn(result.dataReturn, limit, page, result.totalPage)
    res.status(StatusCodes.OK).json(jsonForm.successJsonMessage(true, 'Get data successfully', paginationData))
  } catch (error) {
    next(error)
  }
}

const updateAnnouncementController = async (req, res, next) => {
  try {
    const { id } = req.params
    const data = req.body
    await notificationService.updateAnnouncementService(id, data)
    res.status(StatusCodes.OK).json(jsonForm.successJsonMessage(true, 'Update data successfully'))
  } catch (error) {
    next(error)
  }
}

const deleteAnnouncementController = async (req, res, next) => {
  try {
    const { id } = req.params
    await notificationService.deleteAnnouncementService(id)
    res.status(StatusCodes.OK).json(jsonForm.successJsonMessage(true, 'Delete data successfully'))
  } catch (error) {
    next(error)
  }
}
export const notificationController = {
  createMessageNotificationController,
  getAnnouncementController,
  updateAnnouncementController,
  deleteAnnouncementController
}