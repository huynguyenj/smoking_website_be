import { GET_DB } from '@/config/mongodb'
import Joi from 'joi'
import { userModel } from './userModel'
import { ObjectId } from 'mongodb'
import { TOP_RANK } from '@/utils/constants'

const RANK_COLLECTION_NAME = 'ranks'
const RANK_SCHEMA = Joi.object({
  star_count: Joi.number().strict().default(0),
  position: Joi.number().strict().default(0),
  achievements: Joi.array().items(Joi.string().trim()).default([]),
  record_date: Joi.date().timestamp('javascript').default(Date.now),
  totalAchievements:  Joi.number().strict().default(0),
  isDeleted: Joi.boolean().strict().default(false)
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
    const result = await GET_DB().collection(RANK_COLLECTION_NAME).findOne({ _id: new ObjectId(rankId), isDeleted: false })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateRankByRankId = async (rankId, data) => {
  try {
    const { star_count, achievements } = data
    await GET_DB().collection(RANK_COLLECTION_NAME).findOneAndUpdate({
      _id: new ObjectId(rankId),
      isDeleted: false
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
    const user = await GET_DB().collection(userModel.USER_COLLECTION_NAME).findOne({ _id: new ObjectId(userId), isDeleted: false })
    const rankInfo = await GET_DB().collection(RANK_COLLECTION_NAME).findOne({ _id: new ObjectId(user.rank) })
    return rankInfo
  } catch (error) {
    throw new Error(error)
  }
}

const getRankPagination = async (page, limit, sort, sortName) => {
  try {
    if (!sort) sort = -1
    if (!sortName) sortName = 'star_count'
    const skip = ( page-1 ) * limit
    const result = await GET_DB().collection(RANK_COLLECTION_NAME).aggregate([
      {
        $lookup: {
          from: 'users',
          let: { rankId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$rank', '$$rankId'] },
                    { $ne: ['$isDeleted', true] }
                  ]
                }
              }
            }
          ],
          as: 'user'
        }
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true
        }
      },
      { $sort: { [sortName]: sort } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          star_count: 1,
          achievements: 1,
          position: 1,
          record_date: 1,
          totalAchievements: 1,
          isDeleted: 1,
          users: {
            _id: '$user._id',
            user_name: '$user.user_name',
            email: '$user.email'
          }
        }
      }
    ]).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getRankUserPagination = async (page, limit, sort) => {
  try {
    if (!sort) sort = -1
    const skip = ( page-1 ) * limit
    const result = await GET_DB().collection(RANK_COLLECTION_NAME).aggregate([
      {
        $lookup: {
          from: 'users',
          let: { rankId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$rank', '$$rankId'] },
                    { $ne: ['$isDeleted', true] }
                  ]
                }
              }
            }
          ],
          as: 'user'
        }
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true
        }
      },
      { $sort: { position: sort } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          star_count: 1,
          achievements: 1,
          position: 1,
          record_date: 1,
          totalAchievements: 1,
          users: {
            _id: '$user._id',
            user_name: '$user.user_name',
            email: '$user.email'
          }
        }
      }
    ]).toArray()
    return result|| {}
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
      rank: { $eq: new ObjectId(rankId), $ne: null },
      isDeleted: false
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
      _id: new ObjectId(rankId),
      isDeleted: false
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

const getTopRank = async (sortName) => {
  try {
    const result = await GET_DB().collection(RANK_COLLECTION_NAME).find({ isDeleted: false }).sort({ [sortName]: -1 }).limit(TOP_RANK).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteRank = async (rankId) => {
  try {
    await GET_DB().collection(RANK_COLLECTION_NAME).findOneAndUpdate({ _id: new ObjectId(rankId) }, { $set: { isDeleted: true } })
    return
  } catch (error) {
    throw new Error(error)
  }
}

export const rankModel = {
  RANK_COLLECTION_NAME,
  createRank,
  getRankByUserId,
  getRankPagination,
  getTotalRank,
  findUserByRankId,
  updatePosition,
  getTopRank,
  getRankUserPagination,
  deleteRank
}