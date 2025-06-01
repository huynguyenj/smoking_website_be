import ApiError from '@/utils/ApiError'
import { errorJsonForm } from '@/utils/customErrorMessage'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

const createCigaretteValidation = async (req, res, next) => {
  const correctForm = Joi.object({
    amount: Joi.number().strict().required(),
    smoking_frequency_per_day: Joi.number().strict().required().default(0),
    money_consumption_per_day: Joi.number().strict().required().default(0),
    nicotine_evaluation: Joi.number().required().strict().default(0),
    saving_money: Joi.number().strict().default(0)
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
    amount: Joi.number().strict(),
    smoking_frequency_per_day: Joi.number().strict(),
    money_consumption_per_day: Joi.number().strict(),
    nicotine_evaluation: Joi.number().strict(),
    saving_money: Joi.number().strict().default(0),
    no_smoking_date: Joi.date().timestamp('javascript')
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