import { GET_DB } from '@/config/mongodb'
import { OBJECT_ID_MESSAGE, OBJECT_ID_RULE } from '@/utils/validators'
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { membershipModel } from './membershipModel'
import { rankModel } from './rankModel'

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
    age: Joi.number().strict().default(null),
    image_url: Joi.string().trim().strict().default(null)
  }),
  friends: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE)).default([]),
  feedback: Joi.object({
    content: Joi.string().trim().allow(''),
    star: Joi.number().strict().default(0),
    create_feedback_date: Joi.date().timestamp('javascript').default(Date.now)
  }),
  membership: Joi.object({
    membership_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE).default(null),
    create_date: Joi.date().timestamp('javascript').default(Date.now),
    expired_date: Joi.date().timestamp('javascript').default(null)
  }),
  rank: Joi.string().trim().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE).default(null)
})

const validateBeforeInsert = async (data) => {
  return await USER_SCHEMA.validateAsync(data, { abortEarly:false })
}

const insertUserData = async (data) => {
  try {
    const validatedData = await validateBeforeInsert(data)
    const freeMembership = await membershipModel.findMembershipByTitle('Free')
    const finalData = {
      ...validatedData,
      membership: {
        membership_id: freeMembership._id,
        create_date: Date.now()
      }
    }
    const createdUser = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(finalData)
    return createdUser
  } catch (error) {
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
  const user = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email: email, isDeleted: false })
  return user
}

const findAllEmail = async () => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).find({
      $and: [
        { email: { $ne: null } },
        { isDeleted: { $ne: true } }
      ]
    }).project({ email: 1 }).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateUserById = async (id, updateData) => {
  try {
    await GET_DB().collection(USER_COLLECTION_NAME).updateOne( { _id: new ObjectId(id) }, { $set:  updateData })
  } catch (error) {
    throw new Error(error)
  }
}

const updateProfile = async (userId, profileData) => {
  try {
    await GET_DB().collection(USER_COLLECTION_NAME).updateOne({
      _id: new ObjectId(userId),
      isDeleted: false
    },
    {
      $set: { profile: profileData }
    }
    )
  } catch (error) {
    throw new Error(error)
  }
}

const deleteUser = async (userId) => {
  try {
    const user = await findOneUserById(userId)
    await GET_DB().collection(USER_COLLECTION_NAME).updateOne({
      _id: new ObjectId(userId),
      isDeleted: false
    },
    {
      $set: { isDeleted: true }
    }
    )
    await rankModel.deleteRank(user.rank)
    return
  } catch (error) {
    throw new Error(error)
  }
}

const setActiveUser = async (userId, active) => {
  try {
    await GET_DB().collection(USER_COLLECTION_NAME).updateOne({
      _id: new ObjectId(userId),
      isDeleted: false
    },
    {
      $set: active
    }
    )
    return
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
const getUserPagination = async (page, limit, sort) => {
  try {
    const skip = (page - 1) * limit
    if (!sort) sort = -1
    const users = await GET_DB().collection(USER_COLLECTION_NAME).find().sort({ created_date: sort }).skip(skip).limit(limit).toArray()
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
    if (!query.trim()) return []
    const result = await GET_DB().collection(USER_COLLECTION_NAME).find({
      $and:[
        {
          $or: [
            { user_name: { $regex: query, $options: 'i' } }, // find person with name match with regex and option will avoid case-insensitive like uppercase, lowercase ==> make sure it just match no worry about these case
            { full_name: { $regex: query, $options: 'i' } }
          ]
        },
        {
          role: { $ne: 'admin' }
        }
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

const getFeedback = async (limit, page, sort) => {
  try {
    const skip = (page-1)*limit
    const result =await GET_DB().collection(USER_COLLECTION_NAME).find({ feedback: { $ne: null } }).project({
      user_name: 1,
      _id: 1,
      feedback: 1,
      profile: 1
    }).sort({ 'feedback.create_feedback_date': sort }).limit(limit).skip(skip).toArray()
    const totalFeedback =await GET_DB().collection(USER_COLLECTION_NAME).countDocuments({ feedback: { $ne: null } })
    const dataReturn = {
      result,
      totalFeedback
    }
    return dataReturn
  } catch (error) {
    throw new Error(error)
  }
}

const deleteFeedback = async (userId) => {
  try {
    await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate({
      _id: new ObjectId(userId),
      isDeleted: false
    },
    {
      $set:{ feedback: undefined }
    })
    return
  } catch (error) {
    throw new Error(error)
  }
}

const updateMembership = async (userId, membershipName) => {
  try {
    const membership = await membershipModel.findMembershipByTitle(membershipName)
    let now = new Date()
    if (membership.membership_title === 'Free') now = null
    now.setMonth(now.getMonth() + 1)
    const expiredDate = now.getTime()

    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate({
      _id: new ObjectId(userId),
      isDeleted: false
    },
    {
      $set:
      { 'membership.membership_id' : membership._id,
        'membership.create_date': Date.now(),
        'membership.expired_date': expiredDate }
    }
    )
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
  updateProfile,
  getTotalUser,
  getUserPagination,
  getTotalUserInMonth,
  searchUser,
  getFeedback,
  deleteFeedback,
  updateMembership,
  deleteUser,
  setActiveUser,
  findAllEmail
}