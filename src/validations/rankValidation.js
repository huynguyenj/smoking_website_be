import ApiError from '@/utils/ApiError'
import { errorJsonForm } from '@/utils/customErrorMessage'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

const updatePositionValidate = async (req, res, next) => {
  try {
    const correctCondition = Joi.object({
      position: Joi.number().strict().required()
    })
    await correctCondition.validateAsync(req.body)
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid field!', errorJsonForm(error.details))
  }
}

const arrangePositionValidate = async (req, res, next) => {
  try {
    const correctCondition = Joi.object({
      option_sort: Joi.string().valid('star_count', 'total_achievements').trim().strict().required()
    })
    await correctCondition.validateAsync(req.body)
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid field!', errorJsonForm(error.details))
  }
}
export const rankValidation = {
  updatePositionValidate,
  arrangePositionValidate
}