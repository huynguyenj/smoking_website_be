import { commentService } from '@/services/commentService'
import { jsonForm } from '@/utils/formatReturnJson'
import { StatusCodes } from 'http-status-codes'

const createCommentController = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { blogId } = req.params
    const data = req.body
    await commentService.createCommentService(userId, blogId, data)
    res.status(StatusCodes.CREATED).json(jsonForm.successJsonMessage(true, 'Comment sucessfully!'))
  } catch (error) {
    next(error)
  }
}

const getCommentPaginationController = async (req, res, next) => {
  try {
    const { limit, page } = req.body
    const { blogId } = req.params
    const dataReturn = await commentService.getCommentPaginationService(blogId, limit, page)
    const result = jsonForm.paginationReturn(dataReturn.data.commentList, limit, page, dataReturn.totalPage)
    res.status(StatusCodes.OK).json(jsonForm.successJsonMessage(true, 'Get comments successfully', result))
  } catch (error) {
    next(error)
  }
}

const deleteCommentController = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { blogId, commentId } = req.params
    await commentService.deleteCommentService(userId, blogId, commentId)
    res.status(StatusCodes.ACCEPTED).json(jsonForm.successJsonMessage(true, 'Delete comment successfully'))
  } catch (error) {
    next(error)
  }
}

export const commentController = {
  createCommentController,
  getCommentPaginationController,
  deleteCommentController
}