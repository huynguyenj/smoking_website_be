import { GET_DB } from '@/config/mongodb'
import { OBJECT_ID_MESSAGE, OBJECT_ID_RULE } from '@/utils/validators'
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { planningModel } from './planningModel'
// import { userModel } from './userModel'

const INITIAL_CIGARETTE_NAME = 'initial_cigarettes'
const INITIAL_CIGARETTE_SCHEMA = Joi.object({
  user_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE),
  amount_cigarettes: Joi.number().strict().default(0),
  smoking_frequency_per_day: Joi.number().strict().required().default(0),
  money_each_cigarette: Joi.number().strict().required().default(0),
  nicotine_evaluation: Joi.number().required().strict().default(0),
  isDeleted: Joi.boolean().strict().default(false),
  create_date: Joi.date().timestamp('javascript').default(Date.now)
})

const createInitialState = async (userId, data) => {
  try {
    const validateData = await INITIAL_CIGARETTE_SCHEMA.validateAsync(data)
    const finalData = {
      ...validateData,
      user_id: new ObjectId(userId)
    }
    const result = await GET_DB().collection(INITIAL_CIGARETTE_NAME).insertOne(finalData)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getInitialStateById = async (id) => {
  try {
    const result = await GET_DB().collection(INITIAL_CIGARETTE_NAME).findOne({
      _id: new ObjectId(id),
      isDeleted: false
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const checkInitialStateByPlanId = async (initialId) => {
  try {
    const result = await GET_DB().collection(planningModel.PLAN_COLLECTION_NAME).findOne({
      initial_cigarette_id: new ObjectId(initialId),
      isDeleted: false
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getInitialStatePagination = async (userId, limit, page, sort, filter) => {
  try {
    const skipPreviousData = (page - 1) * limit
    if (!sort) sort = -1
    let filterData = {}
    if (filter?.date) {
      filterData = {
        user_id: new ObjectId(userId),
        isDeleted: false,
        create_date: { $gte: filter.date.start_time }
      }
    } else {
      filterData = {
        user_id: new ObjectId(userId),
        isDeleted: false
      }
    }
    const result = await GET_DB().collection(INITIAL_CIGARETTE_NAME).find(filterData).skip(skipPreviousData).limit(limit).sort({ create_date: sort }).toArray()
    return result || []
  } catch (error) {
    throw new Error(error.message)
  }
}

const countTotalInitialCigarettes = async (user_id) => {
  try {
    const result = await GET_DB().collection(INITIAL_CIGARETTE_NAME).countDocuments({ user_id: new ObjectId(user_id), isDeleted: false })
    return result
  } catch (error) {
    throw new Error(error.message)
  }
}

const updateInitialState = async (userId, stateId, data) => {
  try {
    const result = await GET_DB().collection(INITIAL_CIGARETTE_NAME).findOneAndUpdate({
      _id: new ObjectId(stateId),
      isDeleted: false,
      user_id: new ObjectId(userId)
    },
    {
      $set: data
    }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteInitialState = async (userId, stateId) => {
  try {
    const result = await GET_DB().collection(INITIAL_CIGARETTE_NAME).findOneAndUpdate({
      _id: new ObjectId(stateId),
      isDeleted: false,
      user_id: new ObjectId(userId)
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

const getAllInitialState = async (userId) => {
  try {
    const result = await GET_DB().collection(INITIAL_CIGARETTE_NAME).find({
      user_id: new ObjectId(userId),
      isDeleted: false
    }).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getAllInitialStateOfUserForCoach = async (userId) => {
  try {
    const result = await GET_DB().collection(INITIAL_CIGARETTE_NAME).find({
      user_id: new ObjectId(userId),
      isDeleted: false
    }).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const initialCigarette = {
  INITIAL_CIGARETTE_NAME,
  INITIAL_CIGARETTE_SCHEMA,
  createInitialState,
  getInitialStateById,
  getInitialStatePagination,
  deleteInitialState,
  updateInitialState,
  countTotalInitialCigarettes,
  checkInitialStateByPlanId,
  getAllInitialState,
  getAllInitialStateOfUserForCoach
}