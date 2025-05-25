import { GET_DB } from '@/config/mongodb'
import { OBJECT_ID_MESSAGE, OBJECT_ID_RULE } from '@/utils/validators'
import Joi from 'joi'

const COMMENT_COLLECTION_NAME = 'comments'
const COMMENT_SCHEMA = Joi.object({
  user_id: Joi.string().pattern()(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE).required(),
  blog_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE).required(),
  content: Joi.string().allow(null),
  created_date: Joi.date().timestamp('javascript').default(Date.now),
  isDelete: Joi.boolean().strict().default(false)
})