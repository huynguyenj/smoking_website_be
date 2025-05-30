import { env } from '@/config/environment'

export const WHITELIST_DOMAIN = [
  env.CLIENT_URL,
  env.CLIENT_URL_PROD
]

export const TOKEN_TIME = {
  access_token_time: '1h',
  refresh_token_time: '6d'
}

export const COOKIES_OPTIONS = {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  secure: env.BUILD_MODE === 'production', // ở đây ý là nếu BUILD_MODE = production thì secure sẽ set là true là nó chỉ cho phép các trang web mang https đc gửi cookies đến server khi ở production, còn nếu BUILD_MODE là dev thì secure = false và nó cho phép tên miền nào cũng có thể gửi cookies đến ==> phù hợp để test
  sameSite: 'none' // có 3 lựa chọn là strict, lax, none. Strict là sẽ chắc chắn rằng domain của frontend và backend chung 1 tên miền thì cho phép gửi cookies. lax là kiểu cho Cookie được gửi trên cùng một trang web và các yêu cầu GET cấp cao nhất. none là Cookie được gửi trên tất cả các yêu cầu liên trang web
}