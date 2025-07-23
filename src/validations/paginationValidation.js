import ApiError from '@/utils/ApiError'
import { errorJsonForm } from '@/utils/customErrorMessage'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

const paginationValidation = async (req, res, next) => {
  try {
    const paginationSchema = Joi.object({
      page: Joi.number().integer().min(1).default(1).required(),
      limit: Joi.number().integer().default(5).required(),
      sort: Joi.number().default(-1),
      sortName: Joi.string().default(''),
      filter: Joi.object().strict()
    })
    await paginationSchema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid pagination data - Please check again!', errorJsonForm(error.details)))
  }
}

const rankPaginationValidation = async (req, res, next) => {
  try {
    const paginationSchema = Joi.object({
      page: Joi.number().integer().min(1).default(1).required(),
      limit: Joi.number().integer().default(5).required(),
      sort: Joi.number().default(-1),
      sortName: Joi.string().strict().trim().valid('star_count', 'position', 'total_achievements')
    })
    await paginationSchema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid pagination data - Please check again!', errorJsonForm(error.details)))
  }
}

export const paginationValidate = {
  paginationValidation,
  rankPaginationValidation
}