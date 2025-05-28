import express from 'express'
import { StatusCodes } from 'http-status-codes'
import {} from '@/validations/userValidation'
import { userValidation } from '@/validations/userValidation'
import { userController } from '@/controllers/userController'
import { verifyRefreshTokenMiddlewares, verifyToken } from '@/middlewares/verifyTokenMiddlewares'
import { planController } from '@/controllers/planController'
import { planValidation } from '@/validations/planValidation'
const Router = express.Router()

//Public route
Router.route('/register')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: 'API get list user' })
  })
  .post(userValidation.registerValidation, userController.registerController)
Router.route('/login')
  .post(userValidation.loginValidation, userController.loginController)

Router.route('/token')
  .get(verifyRefreshTokenMiddlewares, userController.getNewAccessTokenController)

//Auth middlewares
Router.use(verifyToken)
//Protected routes
Router.route('/info')
  .get(userController.getUserInfoController)
  .put(userValidation.updateValidation, userController.updateUserInfoController)
Router.route('/logout')
  .post(userController.logoutController)
Router.route('/plan')
  .post(planValidation.createPlanValidation, planController.createPlanController)
  .get(planController.getAllPlanController)
export const userRoute = Router