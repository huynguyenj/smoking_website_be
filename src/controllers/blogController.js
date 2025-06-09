import { blogService } from '@/services/blogService'
import { jsonForm } from '@/utils/formatReturnJson'
import { StatusCodes } from 'http-status-codes'

const createBlogController = async (req, res, next) => {
  try {
    const files = req.files
    const data = req.body
    const user_id = req.user.id
    const dataReturn = await blogService.createBlogService(user_id, data, files)
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(true, 'Create blog successfully', dataReturn))
  } catch (error) {
    next(error)
  }
}

const getBlogsPaginationController = async (req, res, next) => {
  try {
    const { limit, page, sort } = req.body
    const dataReturn = await blogService.getBlogsPaginationService(limit, page, sort)
    const result = jsonForm.paginationReturn(dataReturn.result, limit, page, dataReturn.totalPages)
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(true, 'Get blogs successfully', result))
  } catch (error) {
    next(error)
  }
}

const getBlogsPrivatePaginationController = async (req, res, next) => {
  try {
    const { limit, page, sort } = req.body
    const userId = req.user.id
    const dataReturn = await blogService.getBlogsPrivatePaginationService(userId, limit, page, sort)
    const result = jsonForm.paginationReturn(dataReturn.result.blogList, limit, page, dataReturn.totalPages)
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(true, 'Get blogs successfully', result))
  } catch (error) {
    next(error)
  }
}

const updateBlogController = async (req, res, next) => {
  try {
    const userId = req.user.id
    const data = req.body
    const files = req.files
    const { blogId } = req.params
    await blogService.updateBlogService(userId, blogId, data, files)
    res.status(StatusCodes.ACCEPTED).json(jsonForm.successJsonMessage(true, 'Update successfully!'))
  } catch (error) {
    next(error)
  }
}

const deleteBlogController = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { blogId } = req.params
    await blogService.deleteBlogService(userId, blogId)
    res.status(StatusCodes.ACCEPTED).json(jsonForm.successJsonMessage(true, 'Delete successfully!'))
  } catch (error) {
    next(error)
  }
}

const getBlogDetailController = async (req, res, next) => {
  try {
    const { blogId } = req.params
    const result = await blogService.getBlogDetailService(blogId)
    res.status(StatusCodes.ACCEPTED).json(jsonForm.successJsonMessage(true, 'Get blog successfully!', result))
  } catch (error) {
    next(error)
  }
}
export const blogController = {
  createBlogController,
  getBlogsPaginationController,
  getBlogsPrivatePaginationController,
  updateBlogController,
  deleteBlogController,
  getBlogDetailController
}