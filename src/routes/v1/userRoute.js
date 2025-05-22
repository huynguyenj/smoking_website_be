import express from 'express'
import { StatusCodes } from 'http-status-codes'
import {} from '@/validations/userValidation'
import { userValidation } from '@/validations/userValidation'
import { userController } from '@/controllers/userController'
const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: 'API get list user' })
  })
  .post(userValidation.registerValidation, userController.register)
export const userRoute = Router