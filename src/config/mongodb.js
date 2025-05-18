import dotenv from 'dotenv'
import { MongoClient, ServerApiVersion } from 'mongodb'
dotenv.config()
const URI =process.env.MONGO_URI
const DATABASE_NAME = process.env.DATABASE_NAME

//Biến này dùng để chứa database instance cái database chúng ta đã tạo trong MongoDB
let smokingDatabaseInstance = null;
console.log(URI)
//Stable API chắc chắn rằng tất cả function, câu lệnh phù hợp với phiên bản mongoDB hiện tại
const mongoClientInstance = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict:true,
    deprecationErrors:true
  }
})

export const CONNECT_DB = async() => {
  await mongoClientInstance.connect()
  smokingDatabaseInstance = mongoClientInstance.db(DATABASE_NAME)
}

//Function GET_DB này có nhiệm vụ export cái database instance sau khi ta connect với database thành công
//Function này chỉ nên gọi khi connect tới MongoDB thành công
export const GET_DB = () => {
  if (!smokingDatabaseInstance) throw new Error('Please connect to your database first!')
  return smokingDatabaseInstance
}