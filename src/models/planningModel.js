
import { GET_DB } from '@/config/mongodb'
import { OBJECT_ID_MESSAGE, OBJECT_ID_RULE } from '@/utils/validators'
import Joi from 'joi'

const PLAN_COLLECTION_NAME = 'planing'
const PLAN_SCHEMA = Joi.object({
  user_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE).required(),
  process_stage: Joi.string().valid('start', 'process', 'finish').strict().default('start'),
  health_status: Joi.string().strict().allow(null),
  content: Joi.string().strict().allow(null),
  start_date: Joi.date().timestamp('javascript').default(Date.now),
  expected_result_date: Joi.date().timestamp('javascript').default(null),
  create_by: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE).required(),
  isDelete: Joi.boolean().strict().default(true)
})