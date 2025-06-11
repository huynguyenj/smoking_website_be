import ApiError from '@/utils/ApiError'
import { errorJsonForm } from '@/utils/customErrorMessage'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

const registerValidation = async (req, res, next) => {
  const correctCondition = Joi.object({
    full_name: Joi.string().min(4).max(50).trim().strict().messages({
      'any.required': 'Full name is required',
      'string.empty': 'Full name must not be empty',
      'string.min': 'Full name min 4 characters',
      'string.max': 'Full name max 50 characters',
      'string.trim':'Full name must not have leading or trailing whitespace'
    }),
    user_name: Joi.string().min(3).max(30).trim().strict().messages({
      'any.required': 'User name is required',
      'string.empty': 'User name must not be empty',
      'string.min': 'User name min 3 characters',
      'string.max': 'User name max 30 characters',
      'string.trim':'User name must not have leading or trailing whitespace'
    }),
    email: Joi.string().email( { minDomainSegments: 2, tlds:{ allow :['com', 'net'] } }).message({
      'string.email':'Email must in the right type @gmail.com or @gmail.net'
    }).required(),
    password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d])[A-Za-z\\d\\S]{8,}$')).message({
      'string.pattern.base':'Password must have at least 1 Uppercase char, 1 special symbol and min 8 chars'
    })
  })
  try {
    //abortEarly: mặc định true thì khi validata nhiều trường bị lỗi nhưng nó chỉ trả về lỗi đầu tiên trong khi còn nhiều lỗi khác, để false để nó trả về hết lỗi
    await correctCondition.validateAsync(req.body, { abortEarly:false })
    // res.status(StatusCodes.CREATED).json({ code: StatusCodes.CREATED, message: 'POST from validation: API insert USER' })
    next()
  } catch (error) { //error nó bắt ở đây chính là error của Joi ném ra
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid information - Please fill form correctly', errorJsonForm(error.details)))
  }
}

const loginValidation = async (req, res, next) => {
  const loginCorrectForm = Joi.object({
    email:  Joi.string().email( { minDomainSegments: 2, tlds:{ allow :['com', 'net'] } }).message({
      'string.email':'Email must in the right type @gmail.com or @gmail.net'
    }),
    password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d])[A-Za-z\\d\\S]{8,}$')).message({
      'string.pattern.base':'Password must have at least 1 Uppercase char, 1 special symbol and min 8 chars'
    })
  })
  try {
    await loginCorrectForm.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid email or Password - Please try again', errorJsonForm(error.details)))

  }
}

const updateValidation = async (req, res, next) => {
  const updateCorrectForm = Joi.object({
    full_name: Joi.string().min(3).max(50).strict().trim(),
    user_name: Joi.string().min(3).max(30).strict().trim(),
    email: Joi.string().email().strict().trim(),
    password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d])[A-Za-z\\d\\S]{8,}$')).strict().trim(),
    gender: Joi.boolean().strict()
  }).min(1)
  try {
    await updateCorrectForm.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid field - Please check again!'), errorJsonForm(error.details))
  }
}

const updateRoleValidation = async (req, res, next) => {
  const updateCorrectForm = Joi.object({
    role: Joi.string().valid('admin', 'member', 'coach', 'user').strict().trim()
  })
  try {
    await updateCorrectForm.validateAsync(req.body)
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid field - Please check again!'), errorJsonForm(error.details))
  }
}

const totalUserInMonthValidation = async (req, res, next) => {
  try {
    const correctCondition = Joi.object({
      month: Joi.number().integer().min(1).max(12).required().messages({
        'any.required': 'Month is required',
        'number.base': 'Month must be a number',
        'number.min': 'Month must be between 1 and 12',
        'number.max': 'Month must be between 1 and 12'
      }),
      year: Joi.number().integer().min(2000).required().messages({
        'any.required': 'Year is required',
        'number.base': 'Year must be a number',
        'number.min': 'Year must be greater than or equal to 2000'
      })
    })
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid pagination data - Please check again!', errorJsonForm(error.details)))
  }
}

const searchUserValidation = async (req, res, next) => {
  try {
    const correctCondition = Joi.object({
      search: Joi.string().trim().allow('')
    })
    await correctCondition.validateAsync(req.body)
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid pagination data - Please check again!', errorJsonForm(error.details)))
  }
}

export const userValidation = {
  registerValidation,
  loginValidation,
  updateValidation,
  updateRoleValidation,
  totalUserInMonthValidation,
  searchUserValidation
}
