import { GET_DB } from '@/config/mongodb'
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { planningModel } from './planningModel'

const USER_COLLECTION_NAME = 'users'
const USER_SCHEMA = Joi.object({
  full_name: Joi.string().min(3).max(50).required().strict().trim(),
  user_name: Joi.string().min(3).max(30).required().strict().trim(),
  email: Joi.string().email().required().strict().trim(),
  password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d])[A-Za-z\\d\\S]{8,}$')).required().strict().trim(),
  refreshToken: Joi.string().optional().allow(null).default(null),
  created_date: Joi.date().timestamp('javascript').default(Date.now),
  updated_date: Joi.date().timestamp('javascript').default(null),
  isActive: Joi.boolean().strict().default(true),
  isDeleted: Joi.boolean().strict().default(false),
  role: Joi.string().valid('admin', 'member', 'coach', 'user').default('user'),
  gender: Joi.boolean().strict().default(null),
  profile: Joi.object({
    address: Joi.string().strict().default(null),
    experience: Joi.string().strict().default(null),
    birthdate: Joi.date().timestamp('javascript').default(null),
    age: Joi.number().strict().default(null)
  })
})

const validateBeforeInsert = async (data) => {
  return await USER_SCHEMA.validateAsync(data, { abortEarly:false })
}

const insertUserData = async (data) => {
  try {
    const validatedData = await validateBeforeInsert(data)
    //console.log('Data: ', validatedData)
    const createdUser = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validatedData)
    return createdUser
  } catch (error) {
  //console.log(errorJsonForm(error.details))
    throw new Error(error)
  }
}
const findOneUserById = async (id) => {
  try {
    const user = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
    return user
  } catch (error) {
    throw new Error(error)
  }
}

const findUserByEmail = async (email) => {
  const user = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email: email })
  return user
}

const updateUserById = async (id, updateData) => {
  try {
    await GET_DB().collection(USER_COLLECTION_NAME).updateOne( { _id: new ObjectId(id) }, { $set:  updateData })
  } catch (error) {
    throw new Error(error)
  }
}

const getTotalUser = async () => {
  try {
    const totalUser = await GET_DB().collection(USER_COLLECTION_NAME).countDocuments()
    return totalUser
  } catch (error) {
    throw new Error(error)
  }
}
const getUserPagination = async (page, limit) => {
  try {
    const skip = (page - 1) * limit
    const users = await GET_DB().collection(USER_COLLECTION_NAME).find().skip(skip).limit(limit).toArray()
    const totalUsers = await GET_DB().collection(USER_COLLECTION_NAME).countDocuments()
    const totalPages = Math.ceil(totalUsers/limit)
    return {
      users,
      totalPages
    }
  } catch (error) {
    throw new Error(error)
  }
}

const getTotalUserInMonth = async (startDate, endDate) => {
  try {
    const totalUser = await GET_DB().collection(USER_COLLECTION_NAME).countDocuments({
      created_date:{
        $gte: startDate,
        $lt: endDate
      }
    })
    return totalUser
  } catch (error) {
    throw new Error(error)
  }
}

const getAllPlan = async (id) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).aggregate([
      {
        $match: {
          _id: new ObjectId(id),
          isDeleted: false
        }
      },
      {
        $lookup:{
          from: planningModel.PLAN_COLLECTION_NAME,
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
export const userModel = {
  USER_COLLECTION_NAME,
  USER_SCHEMA,
  insertUserData,
  findOneUserById,
  findUserByEmail,
  updateUserById,
  getTotalUser,
  getUserPagination,
  getTotalUserInMonth,
  getAllPlan
}