import { salaryModel } from '@/models/salaryModel'
import { userModel } from '@/models/userModel'
import { supabaseMethod } from '@/providers/supabase'
import { NAME_FOLDER_SUPABASE } from '@/utils/constants'
import ApiError from '@/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createSalaryService = async (userId, data, file) => {
  try {
    const isUserExisted = await userModel.findOneUserById(userId)
    if (isUserExisted) throw new Error('This user already create salary!')
    const imageUrl = await supabaseMethod.uploadAFile(file, NAME_FOLDER_SUPABASE.qr_code, userId)
    const finalData = {
      ...data,
      qr_code_image: imageUrl,
      salary: Number(data.salary)
    }
    const result = await salaryModel.createSalary(userId, finalData)
    const dataCreated = await salaryModel.getDetailSalaryById(result.insertedId)
    return dataCreated
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const getDetailSalaryService = async (userId) => {
  try {
    const result = await salaryModel.getDetailSalary(userId)
    if (!result) throw new Error('This salary data is not existed')
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const updateSalaryService = async (userId, salaryId, data, file) => {
  try {
    let finalData
    if (file) {
      const imageUrl = await supabaseMethod.uploadAFile(file, NAME_FOLDER_SUPABASE.qr_code, userId)
      finalData = {
        ...data,
        qr_code_image: imageUrl,
        salary: Number(data.salary)
      }
    } else {
      throw new Error('You must have QR code image!')
    }
    await salaryModel.updateSalary(salaryId, finalData)
    return
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const deleteSalaryService = async (salaryId) => {
  try {
    await salaryModel.deleteSalary(salaryId)
    return
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

export const salaryService = {
  createSalaryService,
  getDetailSalaryService,
  updateSalaryService,
  deleteSalaryService
}
