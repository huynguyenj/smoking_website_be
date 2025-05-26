import { WHITELIST_DOMAIN } from '@/utils/constants'
import { env } from './environment'
import ApiError from '@/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

export const corsOptions = {
  origin: (origin, callback) => {
    if (env.BUILD_MODE === 'dev') {
      return callback(null, true) // Allow requests without origin in development mode for testing purposes like Postman or cURL
    }
    if (WHITELIST_DOMAIN.includes(origin)) {
      return callback(null, true) // Allow requests from whitelisted domains
    }
    return callback(new ApiError(StatusCodes.FORBIDDEN, `Cors ${origin} policy: Not allowed by CORS`))
  },
  optionsSuccessStatus: 200, // For legacy browser support
  credential: true // Allow credentials like cookies, authorization headers, or TLS client certificates to be sent with requests
}