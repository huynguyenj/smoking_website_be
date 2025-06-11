import express from 'express'
import { StatusCodes } from 'http-status-codes'
import {} from '@/validations/userValidation'
import { userValidation } from '@/validations/userValidation'
import { userController } from '@/controllers/userController'
import { verifyRefreshTokenMiddlewares, verifyToken } from '@/middlewares/verifyTokenMiddlewares'
import { planController } from '@/controllers/planController'
import { planValidation } from '@/validations/planValidation'
import { cigaretteValidation } from '@/validations/cigarettesValidation'
import { cigaretteController } from '@/controllers/cigarettesController'
import { paginationValidate } from '@/validations/paginationValidation'
import multer from 'multer'
import { blogController } from '@/controllers/blogController'
import { blogValidation } from '@/validations/blogValidation'
import { commentValidation } from '@/validations/commentValidation'
import { commentController } from '@/controllers/commentController'
import { messageController } from '@/controllers/messageController'
import { achievementController } from '@/controllers/achievementController'
const Router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })
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
Router.route('/blog/public')
  .post(paginationValidate.paginationValidation, blogController.getBlogsPaginationController)
Router.route('/blog/public/:blogId')
  .get(blogController.getBlogDetailController)
  .post(paginationValidate.paginationValidation, commentController.getCommentPaginationController)

Router.route('/return-payment')
  .get(userController.returnPaymentCheckController)
//Auth middlewares
Router.use(verifyToken)
//Protected routes
Router.route('/info')
  .get(userController.getUserInfoController)
  .put(userValidation.updateValidation, userController.updateUserInfoController)
  .post(userValidation.searchUserValidation, userController.searchUserController)
Router.route('/logout')
  .post(userController.logoutController)
Router.route('/profile')
  .put(upload.single('profile_image'), userController.updateProfileController)

//Plan route
Router.route('/plan')
  .post(planValidation.createPlanValidation, planController.createPlanController)
  .get(planController.getAllPlanController)
Router.route('/plan/edit/:id')
  .put(planValidation.updatePlanValidation, planController.updatePlanController)
  .delete(planController.deletePlanController)
  .get(planController.getPlanDetailController)
Router.route('/plan/pagination')
  .post(paginationValidate.paginationValidation, planController.getPlanPaginationController)
Router.route('/plan/recommend/:cigaretteId')
  .get(planController.getRecommendPlanController)

//Cigarette route
Router.route('/cigarette')
  .post(cigaretteValidation.createCigaretteValidation, cigaretteController.createCigaretteController)
  .get(cigaretteController.getAllCigaretteInfoController)
Router.route('/cigarettes/pagination')
  .post(paginationValidate.paginationValidation, cigaretteController.getCigaretteInfoPaginationController)
Router.route('/cigarette/:cigaretteId')
  .put(cigaretteValidation.updateCigaretteValidation, cigaretteController.updateCigaretteController)
  .delete(cigaretteController.deleteCigaretteController)
  .get(cigaretteController.getCigaretteDetailController)

//Blog route private
Router.route('/blog')
  .post(upload.array('image'), blogValidation.createBlogValidation, blogController.createBlogController)
Router.route('/blog/private')
  .post(paginationValidate.paginationValidation, blogController.getBlogsPrivatePaginationController)
Router.route('/blog/private/edit/:blogId')
  .put(blogValidation.updateBlogValidation, upload.array('image'), blogController.updateBlogController)
  .delete(blogController.deleteBlogController)

//Comment route private
Router.route('/comment/:blogId')
  .post(commentValidation.createCommentValidate, commentController.createCommentController)
Router.route('/comment/:blogId/:commentId')
  .delete(commentController.deleteCommentController)

//Message route
Router.route('/message-history')
  .post(messageController.getMessageHistoryController)
Router.route('/save-message')
  .post(messageController.saveMessage)
Router.route('/friend')
  .post(messageController.addFriendController)
  .get(messageController.getFriendListController)

//Feedback route
Router.route('/feedback')
  .post(userController.feedbackController)

//Membership
Router.route('/membership')
  .get(userController.getMembershipsController)

//Payment
Router.route('/payment')
  .get(userController.paymentController)

//Achievement route
Router.route('/achievement')
  .get(achievementController.smokingAndMoneyAchievementController)

//Rank
Router.route('/rank')
  .get(achievementController.getRankController)
export const userRoute = Router