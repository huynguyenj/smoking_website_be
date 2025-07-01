import { achievementController } from '@/controllers/achievementController'
import { adminController } from '@/controllers/adminController'
import { notificationController } from '@/controllers/notificationController'
import { checkRoleMiddleware } from '@/middlewares/checkRoleMiddlewares'
import { verifyToken } from '@/middlewares/verifyTokenMiddlewares'
import { announcementValidate } from '@/validations/announcementValidation'
import { membershipValidation } from '@/validations/membershipValidation'
import { paginationValidate } from '@/validations/paginationValidation'
import { rankValidation } from '@/validations/rankValidation'
import { userValidation } from '@/validations/userValidation'
import express from 'express'

const Router = express.Router()

Router.use(verifyToken)
Router.use(checkRoleMiddleware(['admin']))
//User
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
//Feedback
Router.route('/feedback')
  .post(paginationValidate.paginationValidation, adminController.getFeedbackPaginationController)
Router.route('/feedback/edit/:userId')
  .delete(adminController.deleteFeedbackController)
//Membership
Router.route('/membership')
  .post(membershipValidation.membershipValidate, adminController.createMembershipController)
  .get(adminController.getMembershipsController)
Router.route('/membership/edit/:membershipId')
  .put(membershipValidation.updateMembershipValidate, adminController.updateMembershipAdminController)
  .delete(adminController.deleteMembershipController)
  .get(adminController.getMembershipsByIdController)
//Payment
Router.route('/payment')
  .get(adminController.getTotalPaymentController)
Router.route('/revenue')
  .get(adminController.getRevenueController)
  .post(adminController.getRevenueByYearController)

//Rank
Router.route('/rank')
  .post(paginationValidate.rankPaginationValidation, achievementController.getRankAdminPaginationController)
Router.route('/rank/:rankId')
  .get(achievementController.getUserInfoByRankIdController)
  .put(rankValidation.updatePositionValidate, achievementController.updateRankPositionController)
Router.route('/rank/arrange-position')
  .post(rankValidation.arrangePositionValidate, achievementController.updateRankPositionController)

//Announcement
Router.route('/announcement')
  .post(announcementValidate.createAnnouncementValidation, notificationController.createMessageNotificationController)
Router.route('/announcement/list')
  .post(paginationValidate.paginationValidation, notificationController.getAnnouncementController)
Router.route('/announcement/edit/:id')
  .put(announcementValidate.createAnnouncementValidation, notificationController.updateAnnouncementController)
  .delete(notificationController.deleteAnnouncementController)

export const adminRoute = Router
