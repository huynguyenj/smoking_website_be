import ApiError from '@/utils/ApiError'
import { errorJsonForm } from '@/utils/customErrorMessage'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

const createInitialCigaretteValidation = async (req, res, next) => {
  const correctForm = Joi.object({
    amount_cigarettes: Joi.number().strict().default(0).required(),
    smoking_frequency_per_day: Joi.number().strict().required().default(0),
    money_each_cigarette: Joi.number().strict().required().default(0),
    nicotine_evaluation: Joi.number().required().strict().default(0)
  })
  try {
    await correctForm.validateAsync(req.body)
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Field is not validated', errorJsonForm(error.details)))
  }
}

const updateInitialCigaretteValidation = async (req, res, next) => {
  const correctForm = Joi.object({
    amount_cigarettes: Joi.number().strict().default(0).required(),
    smoking_frequency_per_day: Joi.number().strict().required().default(0),
    money_each_cigarette: Joi.number().strict().required().default(0),
    nicotine_evaluation: Joi.number().required().strict().default(0)
  })
  try {
    await correctForm.validateAsync(req.body)
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Field is not validated', errorJsonForm(error.details)))
  }
}

export const initialCigaretteValidation = {
  createInitialCigaretteValidation,
  updateInitialCigaretteValidation
}