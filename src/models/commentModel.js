import { GET_DB } from '@/config/mongodb'
import { OBJECT_ID_MESSAGE, OBJECT_ID_RULE } from '@/utils/validators'
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { blogModel } from './blogModel'

const COMMENT_COLLECTION_NAME = 'comments'
const COMMENT_SCHEMA = Joi.object({
  user_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE).required(),
  blog_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE).required(),
  content: Joi.string().allow(null).required(),
  created_date: Joi.date().timestamp('javascript').default(Date.now),
  isDeleted: Joi.boolean().strict().default(false)
})

const validateCommentData = async (data) => {
  return await COMMENT_SCHEMA.validateAsync(data)
}

const createComment = async (data) => {
  try {
    const validateData = await validateCommentData(data)
    const finalData = {
      ...validateData,
      user_id: new ObjectId(data.user_id),
      blog_id: new ObjectId(data.blog_id)
    }
    const result = await GET_DB().collection(COMMENT_COLLECTION_NAME).insertOne(finalData)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getCommentPagination = async (blogId, limit, page) => {
  try {
    const skip = (page - 1) * limit
    const result = await GET_DB().collection(blogModel.BLOG_COLLECTION_NAME).aggregate([
      {
        $match: {
          _id: new ObjectId(blogId),
          isDeleted: false
        }
      },
      {
        $lookup:{
          from: COMMENT_COLLECTION_NAME,
          let: { blogId: '$_id' },
          pipeline:[
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$blog_id', '$$blogId'] },
                    { $eq: ['$isDeleted', false] }
                  ]
                }
              }
            },
            { $skip: skip },
            { $limit: limit }
          ],
          as: 'commentList'
        }
      }
    ]).toArray()
    console.log(result)
    return result[0] || {}
  } catch (error) {
    throw new Error(error)
  }
}

const totalCommentInBlog = async (blogId) => {
  try {
    const total = await GET_DB().collection(COMMENT_COLLECTION_NAME).countDocuments({
      blog_id: new ObjectId(blogId),
      isDeleted: false
    })
    return total
  } catch (error) {
    throw new Error(error)
  }
}

const deleteComment = async (userId, blogId, commentId) => {
  try {
    const result = await GET_DB().collection(COMMENT_COLLECTION_NAME).findOneAndUpdate({
      _id: new ObjectId(commentId),
      user_id: new ObjectId(userId),
      blog_id: new ObjectId(blogId)
    },
    {
      $set: { isDeleted: true }
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
export const commentModel = {
  createComment,
  COMMENT_COLLECTION_NAME,
  COMMENT_SCHEMA,
  getCommentPagination,
  totalCommentInBlog,
  deleteComment
}