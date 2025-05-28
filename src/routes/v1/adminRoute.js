import { adminController } from '@/controllers/adminController'
import { checkRoleMiddleware } from '@/middlewares/checkRoleMiddlewares'
import { verifyToken } from '@/middlewares/verifyTokenMiddlewares'
import { userValidation } from '@/validations/userValidation'
import express from 'express'

const Router = express.Router()

Router.use(verifyToken)
Router.use(checkRoleMiddleware(['admin']))
Router.route('/user')
  .get(adminController.getAllUserController)
  .post(userValidation.totalUserInMonthValidation, adminController.getTotalUserInMonthController)
Router.route('/user/role/:user_id')
  .put(userValidation.updateRoleVailidation, adminController.changeUserRoleController)
Router.route('/user/pagination')
  .post(userValidation.paginationValidation, adminController.getUserPaginationController)
export const adminRoute = Router