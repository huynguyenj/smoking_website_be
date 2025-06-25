import { GET_DB } from '@/config/mongodb'
import { OBJECT_ID_MESSAGE, OBJECT_ID_RULE } from '@/utils/validators'
import Joi from 'joi'
import { ObjectId } from 'mongodb'

const ANNOUNCEMENT_COLLECTION_NAME = 'announcements'
const ANNOUNCEMENT_SCHEMA = Joi.object({
  title: Joi.string().strict(),
  content: Joi.string().strict()
})

const createAnnouncement = async (data) => {
  try {
    const validData = await ANNOUNCEMENT_SCHEMA.validateAsync(data)
    const result = await GET_DB().collection(ANNOUNCEMENT_COLLECTION_NAME).insertOne(validData)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getAnnouncement = async (page, limit) => {
  try {
    const skip = (page - 1) * limit
    const data = await GET_DB().collection(ANNOUNCEMENT_COLLECTION_NAME).find().skip(skip).limit(limit).toArray()
    return data
  } catch (error) {
    throw new Error(error)
  }
}

const findAnnouncementById = async (id) => {
  try {
    const result = await GET_DB().collection(ANNOUNCEMENT_COLLECTION_NAME).find({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateAnnouncement = async (id, data) => {
  try {
    await GET_DB().collection(ANNOUNCEMENT_COLLECTION_NAME).findOneAndUpdate({
      _id: new ObjectId(id)
    },
    {
      $set: data
    })
  } catch (error) {
    throw new Error(error)
  }
}

const deleteAnnouncement = async (id) => {
  try {
    await GET_DB().collection(ANNOUNCEMENT_COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })
    return
  } catch (error) {
    throw new Error(error)
  }
}

const totalAnnouncement = async () => {
  try {
    const total = await GET_DB().collection(ANNOUNCEMENT_COLLECTION_NAME).countDocuments()
    return total
  } catch (error) {
    throw new Error(error)
  }
}
export const announcementModel = {
  createAnnouncement,
  getAnnouncement,
  updateAnnouncement,
  findAnnouncementById,
  deleteAnnouncement,
  totalAnnouncement
}