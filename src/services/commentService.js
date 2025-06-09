import { blogModel } from '@/models/blogModel'
import { commentModel } from '@/models/commentModel'
import ApiError from '@/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createCommentService = async (userId, blogId, data) => {
  try {
    const blog = await blogModel.findBlogById(blogId)
    if (!blog) throw new Error('Blog is not existed!')
    const finalData = {
      ...data,
      user_id: userId,
      blog_id: blogId
    }
    const result = await commentModel.createComment(finalData)
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const getCommentPaginationService = async (blogId, limit, page, sort) => {
  try {
    const data = await commentModel.getCommentPagination(blogId, limit, page, sort)
    const totalComment = await commentModel.totalCommentInBlog(blogId)
    const totalPage = Math.ceil(totalComment / limit)
    const result = {
      data,
      totalPage
    }
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const deleteCommentService = async (userId, blogId, commentId) => {
  try {
    const result = await commentModel.deleteComment(userId, blogId, commentId)
    if (!result) throw new Error('Delete fail!')
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}
export const commentService = {
  createCommentService,
  getCommentPaginationService,
  deleteCommentService
}