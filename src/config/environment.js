import 'dotenv/config'

export const env = {
  MONGODB_URI: process.env.MONGO_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  APP_PORT: process.env.PORT,
  BUILD_MODE: process.env.BUILD_MODE,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  CLIENT_URL: process.env.CLIENT_URL,
  CLIENT_URL_PROD: process.env.CLIENT_URL_PROD,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
}