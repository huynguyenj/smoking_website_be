import { GET_DB } from '@/config/mongodb'
import { OBJECT_ID_MESSAGE, OBJECT_ID_RULE } from '@/utils/validators'
import Joi from 'joi'

const BLOG_COLLECTION_NAME = 'blogs'
const BLOG_SCHEMA = Joi.object({
  user_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE),
  title: Joi.string().strict().required(),
  content: Joi.string().strict().required(),
  image_url: Joi.string().strict().allow(null),
  create_date: Joi.date().timestamp('javascript').default(Date.now),
  update_date: Joi.date().timestamp('javascript').default(null),
  isDelete: Joi.boolean().default(false)
})