import { GET_DB } from '@/config/mongodb'
import { OBJECT_ID_MESSAGE, OBJECT_ID_RULE } from '@/utils/validators'
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { userModel } from './userModel'

const BLOG_COLLECTION_NAME = 'blogs'
const BLOG_SCHEMA = Joi.object({
  user_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE),
  title: Joi.string().strict().required(),
  content: Joi.string().strict().required(),
  image_url: Joi.array().items(Joi.string()).allow(null).default([]),
  create_date: Joi.date().timestamp('javascript').default(Date.now),
  update_date: Joi.date().timestamp('javascript').default(null),
  isDeleted: Joi.boolean().default(false)
})

const validateModel = async (data) => {
  return await BLOG_SCHEMA.validateAsync(data)
}

const createBlog = async (user_id, data) => {
  try {
    const validateDate = await validateModel(data)
    const finalValidate = {
      ...validateDate,
      user_id: new ObjectId(user_id)
    }
    const result = await GET_DB().collection(BLOG_COLLECTION_NAME).insertOne(finalValidate)
    return result
  } catch (error) {
    throw new Error(error.message)
  }
}

const findBlogById = async (blogId) => {
  try {
    const result = await GET_DB().collection(BLOG_COLLECTION_NAME).findOne({ _id: new ObjectId(blogId) })
    return result
  } catch (error) {
    throw new Error(error.message)
  }
}

const getBlogsPagination = async (limit, page, sort) => {
  try {
    const skip = (page - 1)*limit
    if (!sort) sort = -1
    const result = await GET_DB().collection(BLOG_COLLECTION_NAME).find({ isDeleted: false }).sort({ create_date: sort }).skip(skip).limit(limit).toArray()
    return result
  } catch (error) {
    throw new Error(error.message)
  }
}

const getPrivateBlogsPagination = async (userId, limit, page, sort) => {
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
          from: BLOG_COLLECTION_NAME,
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
            { $sort: { create_date: sort } },
            { $skip: skip },
            { $limit: limit }
          ],
          as: 'blogList'
        }
      }
    ]).toArray()
    return result[0] || {}
  } catch (error) {
    throw new Error(error)
  }
}

const totalBlogs = async () => {
  try {
    const total = await GET_DB().collection(BLOG_COLLECTION_NAME).countDocuments({ isDeleted: false })
    return total
  } catch (error) {
    throw new Error(error.message)
  }
}

const totalBlogsOfUser = async (userId) => {
  try {
    const total = await GET_DB().collection(BLOG_COLLECTION_NAME).countDocuments({
      user_id: new ObjectId(userId),
      isDeleted: false
    })
    return total
  } catch (error) {
    throw new Error(error.message)
  }
}

const updateBlog = async (userId, blogId, data) => {
  try {
    const result = await GET_DB().collection(BLOG_COLLECTION_NAME).findOneAndUpdate({
      _id: new ObjectId(blogId),
      isDeleted: false,
      user_id: new ObjectId(userId)
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

const deleteBlog = async (userId, blogId) => {
  try {
    const result = await GET_DB().collection(BLOG_COLLECTION_NAME).findOneAndUpdate({
      _id: new ObjectId(blogId),
      isDeleted: false,
      user_id: new ObjectId(userId)
    },
    {
      $set: { isDeleted: true }
    }
    )
    return result
  } catch (error) {
    throw new Error(error.message)
  }
}

const getBlogDetail = async (blogId) => {
  try {
    const result = await GET_DB().collection(BLOG_COLLECTION_NAME).findOne({
      _id: new ObjectId(blogId),
      isDeleted: false
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
export const blogModel = {
  BLOG_COLLECTION_NAME,
  createBlog,
  findBlogById,
  getBlogsPagination,
  totalBlogs,
  getPrivateBlogsPagination,
  totalBlogsOfUser,
  updateBlog,
  deleteBlog,
  getBlogDetail
}

