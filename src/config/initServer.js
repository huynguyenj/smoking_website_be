import { userModel } from '@/models/userModel'
import { passwordHelper } from '@/utils/hashPassword'
import { env } from './environment'

const createAdminAccount = async () => {
  const adminEmail = 'admin@gmail.com'
  const existingAdmin = await userModel.findUserByEmail('admin@gmail.com')
  if (existingAdmin) {
    return
  }
  const hashedPassword = await passwordHelper.hashPassword(env.ADMIN_PASSWORD)
  const adminData = {
    full_name: 'Super Admin',
    user_name: 'admin',
    email: adminEmail,
    password: hashedPassword,
    role: 'admin'
  }
  await userModel.insertUserData(adminData)
}

export const initServer = {
  createAdminAccount
}