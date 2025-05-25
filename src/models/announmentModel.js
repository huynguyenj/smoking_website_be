import { GET_DB } from '@/config/mongodb'
import { OBJECT_ID_MESSAGE, OBJECT_ID_RULE } from '@/utils/validators'
import Joi from 'joi'

const ANNOUNCEMENT_COLLECTION_NAME = 'announcements'
const ANNOUNCEMENT_SCHEMA = Joi.object({
  title: Joi.string().strict(),
  content: Joi.string().strict()
})