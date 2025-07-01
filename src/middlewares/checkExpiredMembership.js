import { userModel } from '@/models/userModel'

export const checkExpiredMembership = async (req, res, next) => {
  try {
    const userId = req.user.id
    const user = await userModel.findOneUserById(userId)
    const create_date_membership = user.membership.create_date
    const expired_date_membership = user.membership.expired_date
    const rest_valid_date = new Date(expired_date_membership - create_date_membership).getDay()
    if (rest_valid_date <= 0 ) {
      await userModel.updateMembership(user._id, 'free')
      throw new Error('Your membership is expired please pay for a new one!')
    }
    next()
  } catch (error) {
    next(error)
  }
}