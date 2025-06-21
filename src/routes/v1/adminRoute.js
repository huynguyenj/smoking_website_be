import { adminController } from '@/controllers/adminController'
import { checkRoleMiddleware } from '@/middlewares/checkRoleMiddlewares'
import { verifyToken } from '@/middlewares/verifyTokenMiddlewares'
import { membershipValidation } from '@/validations/membershipValidation'
import { paginationValidate } from '@/validations/paginationValidation'
import { rankValidation } from '@/validations/rankValidation'
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
Router.route('/user/detail/:userId')
  .delete(adminController.deleteUserController)
  .get(adminController.getUserDetailController)
  .put(userValidation.setActiveValidate, adminController.setActiveController)
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
  .delete(adminController.deleteMembershipController)
  .get(adminController.getMembershipsByIdController)
Router.route('/payment')
  .get(adminController.getTotalPaymentController)
Router.route('/revenue')
  .get(adminController.getRevenueController)
Router.route('/rank')
  .post(paginationValidate.paginationValidation, adminController.getRankPaginationController)
Router.route('/rank/:rankId')
  .get(adminController.getUserInfoByRankIdController)
  .put(rankValidation.updatePositionValidate, adminController.updateRankPositionController)
export const adminRoute = Router
