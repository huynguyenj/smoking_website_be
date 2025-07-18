import ApiError from '@/utils/ApiError'
import { errorJsonForm } from '@/utils/customErrorMessage'
import { OBJECT_ID_MESSAGE, OBJECT_ID_RULE } from '@/utils/validators'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

const createCigaretteValidation = async (req, res, next) => {
  const correctForm = Joi.object({
    smoking_frequency_per_day: Joi.number().strict().required().default(0),
    money_consumption_per_day: Joi.number().strict().required().default(0),
    saving_money: Joi.number().strict().default(0),
    plan_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE)
  })
  try {
    await correctForm.validateAsync(req.body)
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Field is not validated', errorJsonForm(error.details)))
  }
}

const updateCigaretteValidation = async (req, res, next) => {
  const correctForm = Joi.object({
    smoking_frequency_per_day: Joi.number().strict().required().default(0),
    money_consumption_per_day: Joi.number().strict().required().default(0),
    saving_money: Joi.number().strict().default(0)
  })
  try {
    await correctForm.validateAsync(req.body)
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Field is not validated', errorJsonForm(error.details)))
  }
}

export const cigaretteValidation = {
  createCigaretteValidation,
  updateCigaretteValidation
}