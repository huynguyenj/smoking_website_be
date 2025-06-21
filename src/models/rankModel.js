import { GET_DB } from '@/config/mongodb'
import Joi from 'joi'
import { userModel } from './userModel'
import { ObjectId } from 'mongodb'

const RANK_COLLECTION_NAME = 'ranks'
const RANK_SCHEMA = Joi.object({
  star_count: Joi.number().strict().default(0),
  position: Joi.number().strict().default(0),
  achievements: Joi.array().items(Joi.string().trim()).default([]),
  record_date: Joi.date().timestamp('javascript').default(Date.now)
})

const createRank = async (userId, data) => {
  try {
    const validateData = await RANK_SCHEMA.validateAsync(data)
    const user = await userModel.findOneUserById(userId)
    if (!user.rank) {
      const result = await GET_DB().collection(RANK_COLLECTION_NAME).insertOne(validateData)
      await userModel.updateUserById(user._id, { rank: result.insertedId })
      return
    } else {
      const rankExisted = await findRankById(user.rank)
      await updateRankByRankId(rankExisted._id, validateData)
    }
  } catch (error) {
    throw new Error(error)
  }
}

const findRankById = async (rankId) => {
  try {
    const result = await GET_DB().collection(RANK_COLLECTION_NAME).findOne({ _id: new ObjectId(rankId) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateRankByRankId = async (rankId, data) => {
  try {
    const { star_count, achievements } = data
    await GET_DB().collection(RANK_COLLECTION_NAME).findOneAndUpdate({
      _id: new ObjectId(rankId)
    },
    {
      $set: { star_count: star_count },
      $addToSet: { achievements: { $each: achievements } }
    })
    return
  } catch (error) {
    throw new Error(error)
  }
}

const getRankByUserId = async (userId) => {
  try {
    const user = await GET_DB().collection(userModel.USER_COLLECTION_NAME).findOne({ _id: new ObjectId(userId) })
    const rankInfo = await GET_DB().collection(RANK_COLLECTION_NAME).findOne({ _id: new ObjectId(user.rank) })
    return rankInfo
  } catch (error) {
    throw new Error(error)
  }
}

const getRankPagination = async (page, limit, sort) => {
  try {
    if (!sort) sort = -1
    const skip = ( page-1 ) * limit
    const result = await GET_DB().collection(RANK_COLLECTION_NAME).find().sort({ star_count: sort }).skip(skip).limit(limit).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getTotalRank = async () => {
  try {
    const result = await GET_DB().collection(RANK_COLLECTION_NAME).countDocuments()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findUserByRankId = async (rankId) => {
  try {
    const result = await GET_DB().collection(userModel.USER_COLLECTION_NAME).findOne({
      rank: { $eq: new ObjectId(rankId), $ne: null }
    },
    {
      projection: { password: 0, refreshToken: 0 }
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updatePosition = async (rankId, position) => {
  try {
    await GET_DB().collection(RANK_COLLECTION_NAME).findOneAndUpdate({
      _id: new ObjectId(rankId)
    },
    {
      $set: position
    }
    )
    return
  } catch (error) {
    throw new Error(error)
  }
}

export const rankModel = {
  createRank,
  getRankByUserId,
  getRankPagination,
  getTotalRank,
  findUserByRankId,
  updatePosition
}