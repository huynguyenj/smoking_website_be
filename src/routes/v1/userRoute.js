import express from 'express'
import { StatusCodes } from 'http-status-codes'
import {} from '@/validations/userValidation'
import { userValidation } from '@/validations/userValidation'
import { userController } from '@/controllers/userController'
import { verifyRefreshTokenMiddlewares, verifyToken } from '@/middlewares/verifyTokenMiddlewares'
const Router = express.Router()

Router.route('/register')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: 'API get list user' })
  })
  .post(userValidation.registerValidation, userController.registerController)
Router.route('/login')
  .post(userValidation.loginValidation, userController.loginController)
Router.route('/info')
  .get(verifyToken, userController.getUserInfoController)
  .put(verifyToken, userValidation.updateValidation, userController.updateUserInfoController)
Router.route('/logout')
  .post(verifyToken, userController.logoutController)
Router.route('/token')
  .get(verifyRefreshTokenMiddlewares, userController.getNewAccessTokenController)
export const userRoute = Router