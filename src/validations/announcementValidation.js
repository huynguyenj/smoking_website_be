import ApiError from '@/utils/ApiError'
import { errorJsonForm } from '@/utils/customErrorMessage'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

const createAnnouncementValidation = async (req, res, next) => {
  try {
    const validateForm = Joi.object({
      title: Joi.string().strict().trim().required(),
      content: Joi.string().strict().trim().required()
    })
    await validateForm.validateAsync(req.body)
    next()
  } catch (error) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid field!', errorJsonForm(error.details))
  }
}

export const announcementValidate = {
  createAnnouncementValidation
}