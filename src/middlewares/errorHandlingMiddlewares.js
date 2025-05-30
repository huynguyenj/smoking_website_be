/*eslint-disable no-unused-vars */
import { env } from '@/config/environment'
import { StatusCodes } from 'http-status-codes'
export const errorHandlingMiddlewares = (err, req, res, next) => {
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  const responseError = {
    status: err.statusCode,
    message: err.message || StatusCodes[err.statusCode],
    errorList: err.errorList || null,
    stack: err.stack // where error happened
  }
  if (env.BUILD_MODE !== 'dev') delete responseError.stack
  if (err.errorList === null) delete responseError.errorList

  res.status(responseError.status).json(responseError)
}