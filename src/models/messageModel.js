import { GET_DB } from '@/config/mongodb'
import { OBJECT_ID_MESSAGE, OBJECT_ID_RULE } from '@/utils/validators'
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { userModel } from './userModel'

const MESSAGE_COLLECTION_NAME = 'message'
const MESSAGE_SCHEMA = Joi.object({
  sender_id: Joi.string().strict().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE),
  receiver_id: Joi.string().strict().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE),
  content: Joi.string().strict().trim(),
  message_date: Joi.date().timestamp('javascript').default(Date.now),
  isDeleted: Joi.boolean().strict().default(false)
})

const validateData = async (data) => {
  return await MESSAGE_SCHEMA.validateAsync(data)
}

const saveMessage = async (messageInfo) => {
  try {
    const data = await validateData(messageInfo)
    const finalData = {
      ...data,
      sender_id: new ObjectId(messageInfo.sender_id),
      receiver_id: new ObjectId(messageInfo.receiver_id)
    }
    const result = await GET_DB().collection(MESSAGE_COLLECTION_NAME).insertOne(finalData)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getMessageHistory = async (userId, receiverId) => {
  try {
    const result = await GET_DB().collection(MESSAGE_COLLECTION_NAME).find({
      $or: [
        { sender_id:new ObjectId(userId), receiver_id: new ObjectId(receiverId) },
        { sender_id: new ObjectId(receiverId), receiver_id: new ObjectId(userId) }
      ]
    }).sort({ message_date: 1 }).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findMessageById = async (id) => {
  try {
    const result = await GET_DB().collection(MESSAGE_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const addFriend = async (userId, friendId) => {
  try {
    const result = await GET_DB().collection(userModel.USER_COLLECTION_NAME).findOneAndUpdate(
      {
        _id: new ObjectId(userId),
        isDeleted: false
      },
      {
        $addToSet: { friends: new ObjectId(friendId) }
      },
      {
        projection: {
          id: 1,
          full_name: 1,
          user_name: 1,
          profile: 1
        }
      }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getFriendList = async (listFriendId) => {
  try {
    const result = await GET_DB().collection(userModel.USER_COLLECTION_NAME).find({
      _id: { $in: listFriendId }
    },
    {
      projection: {
        id: 1,
        full_name: 1,
        user_name: 1,
        profile: 1,
        image_url: 1
      }
    }
    ).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const messageModel = {
  saveMessage,
  getMessageHistory,
  findMessageById,
  addFriend,
  getFriendList
}