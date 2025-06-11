import ApiError from '@/utils/ApiError'
import { errorJsonForm } from '@/utils/customErrorMessage'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

const createBlogValidation = async (req, res, next) => {
  const correctForm = Joi.object({
    title: Joi.string().strict().required(),
    content: Joi.string().strict().required()
  })
  try {
    await correctForm.validateAsync(req.body)
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid field!', errorJsonForm(error.details))
  }
}

const updateBlogValidation = async (req, res, next) => {
  const correctForm = Joi.object({
    title: Joi.string().strict().required(),
    content: Joi.string().strict().required(),
    keep_images: Joi.string().strict()
  })
  try {
    await correctForm.validateAsync(req.body)
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid field!', errorJsonForm(error.details))
  }
}

export const blogValidation = {
  createBlogValidation,
  updateBlogValidation
}