import ApiError from '@/utils/ApiError'
import { errorJsonForm } from '@/utils/customErrorMessage'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

const createAccountValidation = async (req, res, next) => {
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
    role: Joi.string().valid('admin', 'member', 'coach', 'user').default('user'),
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

export const adminValidation = {
  createAccountValidation
}