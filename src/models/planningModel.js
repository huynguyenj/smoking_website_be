
import { GET_DB } from '@/config/mongodb'
import { OBJECT_ID_MESSAGE, OBJECT_ID_RULE } from '@/utils/validators'
import Joi from 'joi'

const PLAN_COLLECTION_NAME = 'planing'
const PLAN_SCHEMA = Joi.object({
  user_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE).required(),
  process_stage: Joi.string().valid('start', 'process', 'finish', 'cancel').strict().default('start'),
  health_status: Joi.string().strict().allow(null),
  content: Joi.string().strict().allow(null),
  start_date: Joi.date().timestamp('javascript').default(Date.now),
  expected_result_date: Joi.date().timestamp('javascript').default(null),
  create_by: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE).required(),
  isDelete: Joi.boolean().strict().default(true)
})

const createPlan = async (data) => {
  try {
    const validateData = await PLAN_SCHEMA.validateAsync(data)
    const result = await GET_DB().collection(PLAN_COLLECTION_NAME).insertOne(validateData)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findPlanById = async (id) => {
  try {
    const data = await GET_DB().collection(PLAN_COLLECTION_NAME).findOne({ _id: id })
    return data
  } catch (error) {
    throw new Error(error)
  }
}


export const planningModel = {
  PLAN_COLLECTION_NAME,
  PLAN_SCHEMA,
  createPlan,
  findPlanById
}