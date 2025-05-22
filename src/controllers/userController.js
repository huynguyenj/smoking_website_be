import { errorJsonForm } from '@/utils/customErrorMessage'
import { StatusCodes } from 'http-status-codes'

const register = async (req, res, next) => {
  try {
    console.log('req.body', req.body)
    res.status(StatusCodes.CREATED).json({ code: StatusCodes.CREATED, message: 'POST from validation: API insert USER' })
    next()
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors: errorJsonForm(error.details) })
  }
}

export const userController = {
  register
}