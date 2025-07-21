import { GET_DB } from '@/config/mongodb'
import { OBJECT_ID_MESSAGE, OBJECT_ID_RULE } from '@/utils/validators'
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { userModel } from './userModel'

const CIGARETTE_COLLECTION_NAME = 'cigarettes'
const CIGARETTE_SCHEMA = Joi.object({
  user_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE),
  smoking_frequency_per_day: Joi.number().strict().required().default(0),
  money_consumption_per_day: Joi.number().strict().required().default(0),
  saving_money: Joi.number().strict().default(0),
  create_date: Joi.date().timestamp('javascript').default(Date.now),
  update_date: Joi.date().timestamp('javascript').default(null),
  isDeleted: Joi.boolean().strict().default(false),
  plan_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE)
})

const validateData = async (data) => {
  return await CIGARETTE_SCHEMA.validateAsync(data)
}

const createCigarette = async (userId, data) => {
  try {
    const dataValidation = await validateData(data)
    const dataList = await getAllCigaretteInfoById(userId)
    const finalData = {
      ...dataValidation,
      user_id: new ObjectId(userId),
      plan_id: new ObjectId(dataValidation.plan_id)
    }
    const recentCreatedList = dataList['listCigarette']
    if (recentCreatedList.length === 0) {
      const result = await GET_DB().collection(CIGARETTE_COLLECTION_NAME).insertOne(finalData)
      return result
    }

    const recentlyCreatedOne = recentCreatedList[recentCreatedList.length - 1]
    const isPlanMatchWithNewCreate = recentlyCreatedOne.plan_id
    const isADay = dataValidation.create_date - recentlyCreatedOne.create_date
    const aDay = 60 * 60 * 24 * 1000

    if (isADay > aDay && !isPlanMatchWithNewCreate) {
      const result = await GET_DB().collection(CIGARETTE_COLLECTION_NAME).insertOne(finalData)
      return result
    } else {
      throw new Error('You can not create more than a cigarette in a day')
    }
  } catch (error) {
    throw new Error(error.message)
  }
}

const findCigaretteById = async (id) => {
  try {
    const result = await GET_DB().collection(CIGARETTE_COLLECTION_NAME).findOne({ _id: new ObjectId(id), isDeleted: false })
    return result
  } catch (error) {
    throw new Error(error.message)
  }
}

const getAllCigaretteInfoById = async (id) => {
  try {
    const result = await GET_DB().collection(userModel.USER_COLLECTION_NAME).aggregate([
      {
        $match: {
          _id: new ObjectId(id),
          isDeleted: false
        }
      },
      {
        $lookup: {
          from: CIGARETTE_COLLECTION_NAME,
          let: { userIdInUserCollection: '$_id' },
          pipeline:[{
            $match:{
              $expr:{
                $and:[
                  { $eq: ['$user_id', '$$userIdInUserCollection'] },
                  { $eq: ['$isDeleted', false] }
                ]
              }
            }
          }
          ],
          as: 'listCigarette'
        }
      },
      {
        $project: {
          listCigarette: 1
        }
      }
    ]).toArray()
    return result[0] || {}
  } catch (error) {
    throw new Error(error.message)
  }
}

const getAllCigarettePagination = async (userId, limit, page, sort) => {
  try {
    const skipPreviousData = (page - 1) * limit
    if (!sort) sort = -1
    const result =await GET_DB().collection(userModel.USER_COLLECTION_NAME).aggregate([
      {
        $match: {
          _id: new ObjectId(userId),
          isDeleted: false
        }
      },
      {
        $lookup: {
          from: CIGARETTE_COLLECTION_NAME,
          let: { userIdInUserCollection: '$_id' },
          pipeline:[{
            $match:{
              $expr:{
                $and:[
                  { $eq: ['$user_id', '$$userIdInUserCollection'] },
                  { $eq: ['$isDeleted', false] }
                ]
              }
            }
          },
          { $sort: { create_date: sort } },
          { $skip: skipPreviousData },
          { $limit: limit }
          ],
          as: 'paginationList'
        }
      },
      {
        $project: {
          paginationList: 1
        }
      }
    ]).toArray()
    return result[0] || {}
  } catch (error) {
    throw new Error(error.message)
  }
}

const getCigaretteSpecificStage = async (planId, userId, startTime, endTime) => {
  try {
    const result = await GET_DB().collection(CIGARETTE_COLLECTION_NAME).find({
      user_id: new ObjectId(userId),
      plan_id: new ObjectId(planId),
      isDeleted: false,
      create_date: { $gte: startTime, $lte: endTime }
    }).toArray()
    // const result = await GET_DB().collection(planningModel.PLAN_COLLECTION_NAME).aggregate([
    //   {
    //     $match: {
    //       _id: new ObjectId(planId),
    //       isDeleted: false,
    //       user_id: new ObjectId(userId)
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: CIGARETTE_COLLECTION_NAME,
    //       let: { planId: '$_id' },
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $and: [
    //                 { $gte: ['$create_date', startTime] },
    //                 { $lte: ['$create_date', endTime] }
    //               ]
    //             }
    //           }
    //         }
    //       ],
    //       as: 'cigaretteStage'
    //     }
    //   }
    // ]).toArray()
    return result
  } catch (error) {
    throw new Error(error.message)
  }
}

const countTotalCigarettes = async (user_id) => {
  try {
    const result = await GET_DB().collection(CIGARETTE_COLLECTION_NAME).countDocuments({ user_id: new ObjectId(user_id), isDeleted: false })
    return result
  } catch (error) {
    throw new Error(error.message)
  }
}
const countMoneyAndNoSmoking = async (userId) => {
  try {
    const result = await GET_DB().collection(userModel.USER_COLLECTION_NAME).aggregate([
      {
        $match: {
          _id: new ObjectId(userId),
          isDeleted: false
        }
      },
      {
        $lookup: {
          from: CIGARETTE_COLLECTION_NAME,
          let: { userId: '$_id' },
          pipeline: [{
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$user_id', '$$userId'] },
                  { $eq: ['$isDeleted', false] },
                  { $ne: ['$saving_money', null] }
                ]
              }
            }
          }],
          as: 'listResult'
        }
      }
    ]).toArray()
    return result[0] || {}
  } catch (error) {
    throw new Error(error.message)
  }
}
const updateCigarette = async (user_id, cigaretteId, data) => {
  try {
    const result = await GET_DB().collection(CIGARETTE_COLLECTION_NAME).findOneAndUpdate({
      _id: new ObjectId(cigaretteId),
      isDeleted: false,
      user_id: new ObjectId(user_id)
    },
    {
      $set: data
    }
    )
    return result
  } catch (error) {
    throw new Error(error.message)
  }
}

const deleteCigarette = async (user_id, cigaretteId) => {
  try {
    const result = await GET_DB().collection(CIGARETTE_COLLECTION_NAME).findOneAndUpdate({
      _id: new ObjectId(cigaretteId),
      isDeleted: false,
      user_id: new ObjectId(user_id)
    },
    {
      $set: { isDeleted: true }
    }
    )
    return result
  } catch (error) {
    throw new Error(error.message)
  }
}
export const cigaretteModel = {
  CIGARETTE_COLLECTION_NAME,
  CIGARETTE_SCHEMA,
  createCigarette,
  findCigaretteById,
  getAllCigaretteInfoById,
  countTotalCigarettes,
  getAllCigarettePagination,
  updateCigarette,
  deleteCigarette,
  countMoneyAndNoSmoking,
  getCigaretteSpecificStage
}