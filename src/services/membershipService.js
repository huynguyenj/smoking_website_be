import { membershipModel } from '@/models/membershipModel'
import ApiError from '@/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const getMembershipsService = async () => {
  try {
    const result = await membershipModel.getMemberships()
    if (!result || result.length === 0) throw new Error('There are no membership has been created!')
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const getMembershipById = async (membershipId) => {
  try {
    const result = await membershipModel.findMembershipById(membershipId)
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)

  }
}
export const memberShipService = {
  getMembershipsService,
  getMembershipById
}