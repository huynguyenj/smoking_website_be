import { announcementModel } from '@/models/announcementModel'
import ApiError from '@/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createMessageNotificationService = async (data) => {
  try {
    const result = await announcementModel.createAnnouncement(data)
    if (!result) throw new Error('Create fail!')
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const getAnnouncementService = async (page, limit) => {
  try {
    const dataReturn = await announcementModel.getAnnouncement(page, limit)
    const totalData = await announcementModel.totalAnnouncement()
    const totalPage = Math.ceil(totalData / limit)
    return {
      dataReturn,
      totalPage
    }
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const updateAnnouncementService = async (id, data) => {
  try {
    const announcement = await announcementModel.findAnnouncementById(id)
    if (!announcement) throw new Error('Your current id is not found!')
    await announcementModel.updateAnnouncement(id, data)
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const deleteAnnouncementService = async (id) => {
  try {
    const announcement = await announcementModel.findAnnouncementById(id)
    if (!announcement) throw new Error('Your current id is not found!')
    await announcementModel.deleteAnnouncement(id)
    return
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}
export const notificationService = {
  createMessageNotificationService,
  getAnnouncementService,
  updateAnnouncementService,
  deleteAnnouncementService
}