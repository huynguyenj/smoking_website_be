import { adminController } from '@/controllers/adminController'
import { checkRoleMiddleware } from '@/middlewares/checkRoleMiddlewares'
import { verifyToken } from '@/middlewares/verifyTokenMiddlewares'
import { membershipValidation } from '@/validations/membershipValidation'
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

Router.route('/feedback')
  .post(paginationValidate.paginationValidation, adminController.getFeedbackPaginationController)
Router.route('/feedback/edit/:userId')
  .delete(adminController.deleteFeedbackController)

Router.route('/membership')
  .post(membershipValidation.membershipValidate, adminController.createMembershipController)
  .get(adminController.getMembershipsController)
Router.route('/membership/edit/:membershipId')
  .put(membershipValidation.updateMembershipValidate, adminController.updateMembershipController)

Router.route('/payment')
  .get(adminController.getTotalPaymentController)
Router.route('/revenue')
  .get(adminController.getRevenueController)
export const adminRoute = Router