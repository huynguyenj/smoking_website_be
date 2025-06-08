import { GET_DB } from '@/config/mongodb'
import { OBJECT_ID_MESSAGE, OBJECT_ID_RULE } from '@/utils/validators'
import Joi from 'joi'
import { ObjectId } from 'mongodb'

const MEMBERSHIP_COLLECTION_NAME = 'membership'
const MEMBERSHIP_SCHEMA = Joi.object({
  create_by: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE).default(null),
  membership_title: Joi.string().valid('Free', 'Standard', 'Premium').trim(),
  price: Joi.number().strict().required().default(0),
  create_date: Joi.date().timestamp('javascript').default(Date.now),
  update_date: Joi.date().timestamp('javascript').default(null),
  feature: Joi.array().items(Joi.string().strict().trim().required()).required()
})

const createMembership = async (data) => {
  try {
    const validateData = await MEMBERSHIP_SCHEMA.validateAsync(data)
    const result = await GET_DB().collection(MEMBERSHIP_COLLECTION_NAME).insertOne(validateData)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateMembership = async (membershipId, data) => {
  try {
    const result = await GET_DB().collection(MEMBERSHIP_COLLECTION_NAME).updateOne({
      _id: new ObjectId(membershipId)
    },
    {
      $set: data
    }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findMembershipById = async (membershipId) => {
  try {
    const result = await GET_DB().collection(MEMBERSHIP_COLLECTION_NAME).findOne({ _id: new ObjectId(membershipId) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findMembershipByTitle = async (membershipTitle) => {
  try {
    const result = await GET_DB().collection(MEMBERSHIP_COLLECTION_NAME).findOne({ membership_title: membershipTitle })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getMemberships = async () => {
  try {
    const result = await GET_DB().collection(MEMBERSHIP_COLLECTION_NAME).find().toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}


export const membershipModel = {
  createMembership,
  updateMembership,
  findMembershipById,
  findMembershipByTitle,
  getMemberships
}
