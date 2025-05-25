import { GET_DB } from '@/config/mongodb'
import { generateDefaultFeature } from '@/utils/generateDefaultFeature'
import { OBJECT_ID_MESSAGE, OBJECT_ID_RULE } from '@/utils/validators'
import Joi from 'joi'

const RANK_COLLECTION_NAME = 'ranks'
const RANK_SCHEMA = Joi.object({
  user_id: Joi.string().pattern(OBJECT_ID_RULE).messages(OBJECT_ID_MESSAGE).required(),
  membership_title: Joi.string().valid('normal', 'vip', 'premium').default('normal'),
  feature: Joi.array().items(Joi.object({
    feature_name: Joi.string().trim().required(),
    isActive: Joi.boolean().strict().default(false)
  })).default(generateDefaultFeature)

})