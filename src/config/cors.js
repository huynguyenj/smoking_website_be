import { WHITELIST_DOMAIN } from '@/utils/constants'
import { env } from './environment'
import ApiError from '@/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

export const corsOptions = {
  origin: (origin, callback) => {
    if (env.BUILD_MODE === 'dev') {
      return callback(null, true) // Allow requests without origin in development mode for testing purposes like Postman or cURL
    }
    // Allow if no origin (e.g., VNPAY redirect)
    if (!origin) return callback(null, true)

    if (WHITELIST_DOMAIN.includes(origin)) {
      return callback(null, true) // Allow requests from whitelisted domains
    }
    return callback(new ApiError(StatusCodes.FORBIDDEN, `Cors ${origin} policy: Not allowed by CORS`))
  },
  optionsSuccessStatus: 200, // For legacy browser support
  credentials: true // Khi bên client gọi API để đến server trong API phải có withCredentials: true thì server sẽ chấp nhận gửi token và nhận toke từ client
}