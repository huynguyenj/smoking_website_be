import { GET_DB } from '@/config/mongodb'
import { OBJECT_ID_MESSAGE, OBJECT_ID_RULE } from '@/utils/validators'
import Joi from 'joi'
import { ObjectId } from 'mongodb'
const SALARY_COLLECTION_NAME = 'salaries'
const SALARY_SCHEMA = Joi.object({
  user_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE),
  salary: Joi.number().strict().required(),
  pay_period: Joi.string().strict().required(),
  isDeleted: Joi.boolean().strict().default(false),
  qr_code_image: Joi.string().strict().required()
})

const createSalary = async (userId, data) => {
  try {
    const validData = await SALARY_SCHEMA.validateAsync(data)
    const finalData = {
      ...validData,
      user_id: new ObjectId(userId)
    }
    const result = await GET_DB().collection(SALARY_COLLECTION_NAME).insertOne(finalData)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getDetailSalaryById = async (salaryId) => {
  try {
    const result = await GET_DB().collection(SALARY_COLLECTION_NAME).findOne({
      _id: new ObjectId(salaryId),
      isDeleted: false
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getDetailSalary = async (userId) => {
  try {
    const result = await GET_DB().collection(SALARY_COLLECTION_NAME).findOne({
      user_id: new ObjectId(userId),
      isDeleted: false
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateSalary = async (salaryId, data) => {
  try {
    await GET_DB().collection(SALARY_COLLECTION_NAME).findOneAndUpdate({
      _id: new ObjectId(salaryId),
      isDeleted: false
    },
    {
      $set: data
    }
    )
    return
  } catch (error) {
    throw new Error(error)
  }
}

const deleteSalary = async (salaryId) => {
  try {
    await GET_DB().collection(SALARY_COLLECTION_NAME).findOneAndUpdate({
      _id: new ObjectId(salaryId),
      isDeleted: false
    },
    {
      $set:{ isDeleted: true }
    }
    )
    return
  } catch (error) {
    throw new Error(error)
  }
}
export const salaryModel = {
  createSalary,
  getDetailSalary,
  updateSalary,
  deleteSalary,
  getDetailSalaryById
}