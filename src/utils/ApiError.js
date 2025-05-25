
export default class ApiError extends Error {

  constructor(statusCode, message, errorList = null) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.errorList = errorList
    Error.captureStackTrace(this, this.constructor)
  }
}