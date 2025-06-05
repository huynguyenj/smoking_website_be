import { messageService } from '@/services/messageService'
import { jsonForm } from '@/utils/formatReturnJson'
import { StatusCodes } from 'http-status-codes'

const getMessageHistoryController = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { receiverId } = req.body
    const result = await messageService.getMessageService(userId, receiverId)
    res.status(StatusCodes.OK).json(jsonForm.successJsonMessage(true, 'Get message history successfully', result))
  } catch (error) {
    next(error)
  }
}

const saveMessage = async (req, res, next) => {
  try {
    const { sender_id, receiver_id, text } = req.body
    const result = await messageService.saveMessageService(sender_id, receiver_id, text)
    res.status(StatusCodes.OK).json(jsonForm.successJsonMessage(true, 'Get message history successfully', result))
  } catch (error) {
    next(error)
  }
}

const addFriendController = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { friend_id } = req.body
    const result = await messageService.addFriendService(userId, friend_id)
    res.status(StatusCodes.OK).json(jsonForm.successJsonMessage(true, 'Add friend successfully', result))
  } catch (error) {
    next(error)
  }
}

const getFriendListController = async (req, res, next) => {
  try {
    const userId = req.user.id
    const result = await messageService.getFriendListService(userId)
    res.status(StatusCodes.OK).json(jsonForm.successJsonMessage(true, 'Get friends successfully', result))
  } catch (error) {
    next(error)
  }
}
export const messageController = {
  getMessageHistoryController,
  saveMessage,
  addFriendController,
  getFriendListController
}