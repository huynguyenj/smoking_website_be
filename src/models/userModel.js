import { GET_DB } from '@/config/mongodb'
import { OBJECT_ID_MESSAGE, OBJECT_ID_RULE } from '@/utils/validators'
import Joi from 'joi'
import { ObjectId } from 'mongodb'

const USER_COLLECTION_NAME = 'users'
const USER_SCHEMA = Joi.object({
  full_name: Joi.string().min(3).max(50).strict().trim().default(''),
  user_name: Joi.string().min(3).max(30).strict().trim().default(''),
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
  }),
  friends: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE)).default([])
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
    const user = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ _id: new ObjectId(id), isDeleted: false })
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

const searchUser = async (query) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).find({
      $or: [
        { user_name: { $regex: query, $options: 'i' } }, // find person with name match with regex and option will avoid case-insensitive like uppercase, lowercase ==> make sure it just match no worry about these case
        { full_name: { $regex: query, $options: 'i' } }
      ]
    }).project({
      user_name: 1,
      full_name: 1,
      _id: 1,
      profile: 1
    }).limit(5).toArray()
    return result
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
  searchUser
}