import { GET_DB } from '@/config/mongodb'
import { OBJECT_ID_MESSAGE, OBJECT_ID_RULE } from '@/utils/validators'
import Joi from 'joi'

const RANK_COLLECTION_NAME = 'ranks'
const RANK_SCHEMA = Joi.object({
  user_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE).required(),
  star_count: Joi.number().strict().default(0),
  position: Joi.string().trim().default(''),
  description: Joi.string().trim().allow(null).default(null),
  achievements: Joi.array().items(Joi.string().trim()).default([]),
  record_date: Joi.date().timestamp('javascript').default(Date.now)
})