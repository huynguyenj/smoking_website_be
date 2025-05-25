import { env } from '@/config/environment'

export const WHITELIST_DOMAIN = [
  env.CLIENT_URL,
  env.CLIENT_URL_PROD
]