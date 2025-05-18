import 'dotenv/config'

export const env = {
  MONGODB_URI: process.env.MONGO_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  APP_PORT: process.env.PORT

}