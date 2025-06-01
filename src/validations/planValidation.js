import ApiError from '@/utils/ApiError'
import { errorJsonForm } from '@/utils/customErrorMessage'
import { OBJECT_ID_MESSAGE, OBJECT_ID_RULE } from '@/utils/validators'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

const createPlanValidation = async (req, res, next) => {
  const formatData = Joi.object({
    user_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE),
    process_stage: Joi.string().valid('start', 'process', 'finish', 'cancel').required(),
    health_status: Joi.string().trim().allow(null),
    content: Joi.string().trim().required(),
    start_date: Joi.date().timestamp('javascript').required(),
    expected_result_date: Joi.date().timestamp('javascript').required(),
    isDeleted: Joi.boolean().strict().default(false)
  })
  try {
    await formatData.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Validation error', errorJsonForm(error.details)))
  }
}

const updatePlanValidation = async (req, res, next) => {
  try {
    const correctForm = Joi.object({
      process_stage: Joi.string().valid('start', 'process', 'finish', 'cancel'),
      health_status: Joi.string().trim().allow(null),
      content: Joi.string().trim(),
      start_date: Joi.date().timestamp('javascript'),
      expected_result_date: Joi.date().timestamp('javascript')
    })
    await correctForm.validateAsync(req.body, { abortEarly:false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Validation error', errorJsonForm(error.details)))
  }
}

export const planValidation = {
  createPlanValidation,
  updatePlanValidation
}