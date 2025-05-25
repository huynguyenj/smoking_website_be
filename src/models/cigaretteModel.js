import { GET_DB } from '@/config/mongodb'
import { OBJECT_ID_MESSAGE, OBJECT_ID_RULE } from '@/utils/validators'
import Joi from 'joi'

const CIGARETTE_COLLECTION_NAME = 'cigarettes'
const CIGARETTE_SCHEMA = Joi.object({
  user_id: Joi.string().pattern()(OBJECT_ID_RULE).messages(OBJECT_ID_MESSAGE),
  amount: Joi.number().strict().default(0),
  frequency: Joi.string().strict().allow(null),
  money_spent: Joi.number().strict().default(0),
  create_date: Joi.date().timestamp('javascript').default(Date.now)
})