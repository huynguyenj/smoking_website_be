import { GET_DB } from '@/config/mongodb'
import { OBJECT_ID_MESSAGE, OBJECT_ID_RULE } from '@/utils/validators'
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { userModel } from './userModel'

const PAYMENT_COLLECTION_NAME = 'payment'
const PAYMENT_SCHEMA = Joi.object({
  user_id: Joi.string().trim().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE).required(),
  amount: Joi.number().strict().required(),
  pay_date: Joi.date().timestamp('javascript').default(Date.now),
  description: Joi.string().trim().strict(),
  type: Joi.string().strict().trim().required(),
  bank_code: Joi.string().strict().trim().required()
})

const createPayment = async (data) => {
  try {
    const validateData = await PAYMENT_SCHEMA.validateAsync(data)
    const result = await GET_DB().collection(PAYMENT_COLLECTION_NAME).insertOne(validateData)
    await userModel.updateMembership(data.user_id, data.type)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const totalPayment = async () => {
  try {
    const totalPaymentCount = await GET_DB().collection(PAYMENT_COLLECTION_NAME).countDocuments()
    return totalPaymentCount
  } catch (error) {
    throw new Error(error)
  }
}

const getRevenue = async () => {
  try {
    const revenue = await GET_DB().collection(PAYMENT_COLLECTION_NAME).aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]).toArray()
    return revenue[0].total || 0
  } catch (error) {
    throw new Error(error)
  }
}

export const paymentModel = {
  createPayment,
  totalPayment,
  getRevenue
}
