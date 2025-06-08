import { GET_DB } from '@/config/mongodb'
import { OBJECT_ID_MESSAGE, OBJECT_ID_RULE } from '@/utils/validators'
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { userModel } from './userModel'

const CIGARETTE_COLLECTION_NAME = 'cigarettes'
const CIGARETTE_SCHEMA = Joi.object({
  user_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE),
  amount: Joi.number().strict().default(0),
  smoking_frequency_per_day: Joi.number().strict().required().default(0),
  money_consumption_per_day: Joi.number().strict().required().default(0),
  saving_money: Joi.number().strict().default(0),
  nicotine_evaluation: Joi.number().required().strict().default(0),
  create_date: Joi.date().timestamp('javascript').default(Date.now),
  update_date: Joi.date().timestamp('javascript').default(null),
  no_smoking_date: Joi.date().timestamp('javascript').default(null),
  isDeleted: Joi.boolean().strict().default(false)
})

const validateData = async (data) => {
  return await CIGARETTE_SCHEMA.validateAsync(data)
}

const createCigarette = async (id, data) => {
  try {
    const dataValidation = await validateData(data)
    const finalData = {
      ...dataValidation,
      user_id: new ObjectId(id)
    }
    const result = await GET_DB().collection(CIGARETTE_COLLECTION_NAME).insertOne(finalData)
    return result
  } catch (error) {
    throw new Error(error.message)
  }
}

const findCigaretteById = async (id) => {
  try {
    const result = await GET_DB().collection(CIGARETTE_COLLECTION_NAME).findOne({ _id: new ObjectId(id), isDeleted: false })
    return result
  } catch (error) {
    throw new Error(error.message)
  }
}

const getAllCigaretteInfoById = async (id) => {
  try {
    const result = await GET_DB().collection(userModel.USER_COLLECTION_NAME).aggregate([
      {
        $match: {
          _id: new ObjectId(id),
          isDeleted: false
        }
      },
      {
        $lookup: {
          from: CIGARETTE_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'user_id',
          as: 'listCigarette'
        }
      }
    ]).toArray()
    return result[0] || {}
  } catch (error) {
    throw new Error(error.message)
  }
}

const getAllCigarettePagination = async (userId, limit, page, sort) => {
  try {
    const skipPreviousData = (page - 1) * limit
    if (!sort) sort = -1
    const result =await GET_DB().collection(userModel.USER_COLLECTION_NAME).aggregate([
      {
        $match: {
          _id: new ObjectId(userId),
          isDeleted: false
        }
      },
      {
        $lookup: {
          from: CIGARETTE_COLLECTION_NAME,
          let: { userIdInUserCollection: '$_id' },
          pipeline:[{
            $match:{
              $expr:{
                $and:[
                  { $eq: ['$user_id', '$$userIdInUserCollection'] },
                  { $eq: ['$isDeleted', false] }
                ]
              }
            }
          },
          { $sort: { create_date: sort } },
          { $skip: skipPreviousData },
          { $limit: limit }
          ],
          as: 'paginationList'
        }
      }
    ]).toArray()
    return result[0] || {}
  } catch (error) {
    throw new Error(error.message)
  }
}

const countTotalCigarettes = async (user_id) => {
  try {
    const result = await GET_DB().collection(CIGARETTE_COLLECTION_NAME).countDocuments({ user_id: new ObjectId(user_id), isDeleted: false })
    return result
  } catch (error) {
    throw new Error(error.message)
  }
}

const updateCigarette = async (user_id, cigaretteId, data) => {
  try {
    const result = await GET_DB().collection(CIGARETTE_COLLECTION_NAME).findOneAndUpdate({
      _id: new ObjectId(cigaretteId),
      isDeleted: false,
      user_id: new ObjectId(user_id)
    },
    {
      $set: data
    }
    )
    return result
  } catch (error) {
    throw new Error(error.message)
  }
}

const deleteCigarette = async (user_id, cigaretteId) => {
  try {
    await GET_DB().collection(CIGARETTE_COLLECTION_NAME).findOneAndUpdate({
      _id: new ObjectId(cigaretteId),
      isDeleted: false,
      user_id: new ObjectId(user_id)
    },
    {
      $set: { isDeleted: true }
    }
    )
  } catch (error) {
    throw new Error(error.message)
  }
}
export const cigaretteModel = {
  CIGARETTE_COLLECTION_NAME,
  CIGARETTE_SCHEMA,
  createCigarette,
  findCigaretteById,
  getAllCigaretteInfoById,
  countTotalCigarettes,
  getAllCigarettePagination,
  updateCigarette,
  deleteCigarette
}