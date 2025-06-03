import ApiError from '@/utils/ApiError'
import { errorJsonForm } from '@/utils/customErrorMessage'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

const createCommentValidate = async (req, res, next) => {
  try {
    const correctForm = Joi.object({
      content: Joi.string().strict().required()
    })
    await correctForm.validateAsync(req.body)
    next()
  } catch (error) {
    next(ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid field', errorJsonForm(error.details)))
  }
}

export const commentValidation = {
  createCommentValidate
}