import { adminController } from '@/controllers/adminController'
import { checkRoleMiddleware } from '@/middlewares/checkRoleMiddlewares'
import { verifyToken } from '@/middlewares/verifyTokenMiddlewares'
import { paginationValidate } from '@/validations/paginationValidation'
import { userValidation } from '@/validations/userValidation'
import express from 'express'

const Router = express.Router()

Router.use(verifyToken)
Router.use(checkRoleMiddleware(['admin']))
Router.route('/user')
  .get(adminController.getAllUserController)
  .post(userValidation.totalUserInMonthValidation, adminController.getTotalUserInMonthController)
Router.route('/user/role/:user_id')
  .put(userValidation.updateRoleValidation, adminController.changeUserRoleController)
Router.route('/user/pagination')
  .post(paginationValidate.paginationValidation, adminController.getUserPaginationController)
export const adminRoute = Router