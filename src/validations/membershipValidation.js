import ApiError from '@/utils/ApiError'
import { errorJsonForm } from '@/utils/customErrorMessage'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

const membershipValidate = async (req, res, next) => {
  try {
    const validation = Joi.object({
      membership_title: Joi.string().valid('Free', 'Standard', 'Premium').trim(),
      price: Joi.number().strict().required().default(0),
      feature: Joi.array().items(Joi.string().strict().trim().required()).required()
    })
    await validation.validateAsync(req.body)
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid field', errorJsonForm(error.details)))
  }
}

const updateMembershipValidate = async (req, res, next) => {
  try {
    const validation = Joi.object({
      membership_title: Joi.string().valid('Free', 'Standard', 'Premium').trim(),
      price: Joi.number().strict(),
      feature: Joi.array().items(Joi.string().strict().trim().required()).required()
    })
    await validation.validateAsync(req.body)
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid field', errorJsonForm(error.details)))
  }
}

export const membershipValidation = {
  membershipValidate,
  updateMembershipValidate
}