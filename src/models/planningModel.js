
import { GET_DB } from '@/config/mongodb'
import { OBJECT_ID_MESSAGE, OBJECT_ID_RULE } from '@/utils/validators'
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { userModel } from './userModel'

const PLAN_COLLECTION_NAME = 'planing'
const PLAN_SCHEMA = Joi.object({
  user_id: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE),
  process_stage: Joi.string().valid('start', 'process', 'finish', 'cancel').strict().default('start'),
  health_status: Joi.string().strict().allow(null),
  content: Joi.string().strict().allow(null),
  start_date: Joi.number().strict(),
  expected_result_date: Joi.number().strict(),
  create_by: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE),
  isDeleted: Joi.boolean().strict().default(false)
})

const validateBeforeInsert = async (data) => {
  return await PLAN_SCHEMA.validateAsync(data, { abortEarly:false })
}
const createPlan = async (id, data) => {
  try {
    const validateData = await validateBeforeInsert(data)
    // console.log(validateData)
    const finalValidate = {
      ...validateData,
      create_by: new ObjectId(id),
      user_id: new ObjectId(validateData.user_id)
    }
    const result = await GET_DB().collection(PLAN_COLLECTION_NAME).insertOne(finalValidate)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findPlanById = async (id) => {
  try {
    const data = await GET_DB().collection(PLAN_COLLECTION_NAME).findOne({ _id: new ObjectId(id), isDeleted: false })
    return data
  } catch (error) {
    throw new Error(error)
  }
}

const updatePlanById = async (planId, userId, data) => {
  try {
    const updateData = await GET_DB().collection(PLAN_COLLECTION_NAME).findOneAndUpdate(
      {
        _id: new ObjectId(planId),
        isDeleted: false,
        $or: [
          { user_id: new ObjectId(userId) },
          { create_by: new ObjectId(userId) }
        ]
      },
      {
        $set: data
      }

    )
    return updateData
  } catch (error) {
    throw new Error(error)
  }
}

const deletePlanById = async (planId, userId) => {
  try {
    const result = await GET_DB().collection(PLAN_COLLECTION_NAME).findOneAndUpdate(
      {
        _id: new ObjectId(planId),
        isDeleted: false,
        $or: [
          { user_id: new ObjectId(userId) },
          { create_by: new ObjectId(userId) }
        ]
      },
      {
        $set: { isDeleted: true }
      }

    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getAllPlan = async (id) => {
  try {
    const result = await GET_DB().collection(userModel.USER_COLLECTION_NAME).aggregate([
      {
        $match: {
          _id: new ObjectId(id),
          isDeleted: false
        }
      },
      {
        $lookup:{
          from: PLAN_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'user_id',
          as: 'planList'
        }
      }
    ]).toArray()
    return result[0] || {}
  } catch (error) {
    throw new Error(error)
  }
}
const countTotalPlan = async (userId) => {
  try {
    const totalPlan = await GET_DB().collection(PLAN_COLLECTION_NAME).countDocuments({
      user_id: new ObjectId(userId),
      isDeleted: false
    })
    return totalPlan
  } catch (error) {
    throw new Error(error)
  }
}
const getPlanPagination = async (userId, limit, page, sort) => {
  try {
    const skip = (page - 1) * limit
    if (!sort) sort = -1
    const result = await GET_DB().collection(userModel.USER_COLLECTION_NAME).aggregate([
      {
        $match: {
          _id:  new ObjectId(userId),
          isDeleted: false
        }
      },
      {
        $lookup: {
          from: PLAN_COLLECTION_NAME,
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr:{
                  $and:[
                    { $eq: ['$user_id', '$$userId'] },
                    { $eq: ['$isDeleted', false] }
                  ]
                }
              }
            },
            { $sort: { start_date: sort } },
            { $skip: skip },
            { $limit: limit }
          ],
          as: 'planList'
        }
      }
    ]).toArray()
    return result[0] || {}
  } catch (error) {
    throw new Error(error)
  }
}


export const planningModel = {
  PLAN_COLLECTION_NAME,
  PLAN_SCHEMA,
  createPlan,
  findPlanById,
  updatePlanById,
  deletePlanById,
  getAllPlan,
  countTotalPlan,
  getPlanPagination
}