import { GET_DB } from '@/config/mongodb'
import Joi from 'joi'

const USER_COLLECTION_NAME = 'users'
const USER_SCHEMA = Joi.object({
  full_name: Joi.string().min(3).max(50).required().strict().trim(),
  user_name: Joi.string().min(3).max(30).required().strict().trim(),
  email: Joi.string().email().required().strict().trim(),
  password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d])[A-Za-z\\d\\S]{8,}$')).required().strict().trim(),
  isVerified: Joi.boolean().default(false),
  refreshToken: Joi.string().optional().allow(null).default(null),
  created_date: Joi.date().timestamp('javascript').default(Date.now),
  updated_date: Joi.date().timestamp('javascript').default(null),
  isActive: Joi.boolean().default(false),
  isDeleted: Joi.boolean().default(false),
  role: Joi.string().valid('admin', 'member', 'coach').default('user'),
  gender: Joi.boolean().default(null),
  profile: Joi.object({
    address: Joi.string().default(null),
    experience: Joi.string().default(null),
    birthdate: Joi.date().default(null),
    age: Joi.number().default(null)
  })
})

const validateBeforeInsert = async (data) => {
  return await USER_SCHEMA.validateAsync(data, { abortEarly:false })
}

const insertUserData = async (data) => {
  try {
    const validatedData = await validateBeforeInsert(data)
//     console.log('Data: ', validatedData)
    const createdUser = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validatedData)
    return createdUser
  } catch (error) {
//     console.log(errorJsonForm(error.details))
    throw new Error(error)
  }
}
const findOneUserById = async (id) => {
  try {
    const user = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ _id: id })
    return user
  } catch (error) {
    throw new Error('Error finding user by ID: ' + error.message)
  }
}
export const userModel = {
  USER_COLLECTION_NAME,
  USER_SCHEMA,
  insertUserData,
  findOneUserById
}