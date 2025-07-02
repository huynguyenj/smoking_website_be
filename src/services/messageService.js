import { messageModel } from '@/models/messageModel'
import { userModel } from '@/models/userModel'
import ApiError from '@/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { ObjectId, UUID } from 'mongodb'


const saveMessageService = async (senderId, receiverId, text) => {
  try {
    const senderIdUser = await userModel.findOneUserById(senderId)
    if (!senderIdUser) throw new Error('Sender is not existed!')
    const receiverIdUser = await userModel.findOneUserById(receiverId)
    if (!receiverIdUser) throw new Error('Receiver is not existed!')
    const data = {
      sender_id: senderId,
      receiver_id: receiverId,
      content: text
    }
    const result = await messageModel.saveMessage(data)
    const message = await messageModel.findMessageById(result.insertedId)
    return message
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const getMessageService = async (userId, receiverId) => {
  try {
    const user = await userModel.findOneUserById(userId)
    if (!user) throw new Error('User is not existed!')
    const userFriend = await userModel.findOneUserById(receiverId)
    if (!userFriend) throw new Error('User friend is not existed!')
    const result = await messageModel.getMessageHistory(userId, receiverId)
    const data = {
      result,
      user_info: {
        _id: user._id,
        user_name: user.user_name,
        image_url: user.image_url
      },
      friend_info: {
        _id: userFriend._id,
        user_name: userFriend.user_name,
        image_url: userFriend.image_url
      }
    }
    return data
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const addFriendService = async (userId, friendId) => {
  try {
    const user = await userModel.findOneUserById(userId)
    if (userId == friendId) throw new Error('Can not add yourself as a friend')
    const friends = user.friends
    if (friends.map(id => id.toString()).includes(friendId)) throw new Error('This user already add!') // convert to string because in Mongo even though objectId the same value but they not equal
    const result = await messageModel.addFriend(userId, friendId)
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const getFriendListService = async (userId) => {
  try {
    const user = await userModel.findOneUserById(userId)
    const listFriends = user.friends
    const result = await messageModel.getFriendList(listFriends)
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}
export const messageService = {
  saveMessageService,
  getMessageService,
  addFriendService,
  getFriendListService
}