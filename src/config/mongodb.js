import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '@/config/environment'

//Biến này dùng để chứa database instance cái database chúng ta đã tạo trong MongoD
let smokingDatabaseInstance = null
//Stable API chắc chắn rằng tất cả function, câu lệnh phù hợp với phiên bản mongoDB hiện tại
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict:true,
    deprecationErrors:true
  }
})

export const CONNECT_DB = async() => {
  await mongoClientInstance.connect()
  smokingDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}
export const CLOSE_DB = async () => {
  await mongoClientInstance.close()
}
//Function GET_DB này có nhiệm vụ export cái database instance sau khi ta connect với database thành công
//Function này chỉ nên gọi khi connect tới MongoDB thành công
//Function này trả về database instance giúp ta dùng ở mọi nơi mà ko cần config lại
export const GET_DB = () => {
  if (!smokingDatabaseInstance) throw new Error('Please connect to your database first!')
  return smokingDatabaseInstance
}