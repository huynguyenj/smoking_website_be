import { achievementController } from '@/controllers/achievementController'
import { adminController } from '@/controllers/adminController'
import { notificationController } from '@/controllers/notificationController'
import { salaryController } from '@/controllers/salaryController'
import { checkRoleMiddleware } from '@/middlewares/checkRoleMiddlewares'
import { verifyToken } from '@/middlewares/verifyTokenMiddlewares'
import { adminValidation } from '@/validations/adminValidation'
import { announcementValidate } from '@/validations/announcementValidation'
import { membershipValidation } from '@/validations/membershipValidation'
import { paginationValidate } from '@/validations/paginationValidation'
import { rankValidation } from '@/validations/rankValidation'
import { userValidation } from '@/validations/userValidation'
import express from 'express'
import multer from 'multer'

const Router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

Router.use(verifyToken)
Router.use(checkRoleMiddleware(['admin']))
//User
Router.route('/user/account')
  .post(adminValidation.createAccountValidation, adminController.createUserAccountController)
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
Router.route('/coach/pagination')
  .post(paginationValidate.paginationValidation, adminController.getCoachPaginationController)
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

//Salary for coach
Router.route('/salary/:userId')
  .post(upload.single('qr_code_image'), salaryController.createSalaryController)
  .get(salaryController.getDetailSalaryController)
Router.route('/salary/:salaryId')
  .put(upload.single('qr_code_image'), salaryController.updateSalaryController)
  .delete(salaryController.deleteSalaryController)
export const adminRoute = Router
