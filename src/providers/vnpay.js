import qs from 'qs'
import crypto from 'crypto'
import { env } from '@/config/environment'
import { v4 as uuid4 } from 'uuid'

const sortObject = (obj) => {
  const sorted = {}
  const keys = Object.keys(obj).sort()
  for (let key of keys) {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, '+')
  }
  return sorted
}

const createPaymentUrl = (data, ipAddress, userId) => {
  const { price, membershipTitle } = data
  const date = new Date()
  const tmnCode = env.VNP_TMNCODE
  const secretKey = env.VNP_SECRET_KEY
  const orderId = uuid4()
  const vnpUrl = env.VNPAY_URL
  const returnUrl = env.BUILD_MODE === 'production' ? env.VNP_RETURN_URL_PROD : env.VNP_RETURN_URL_LOCAL
  const createDate = date.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14) // yyyymmddHHMMSS

  let vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Order payment ${membershipTitle} with id: ${userId}`,
    vnp_OrderType: 'other',
    vnp_Amount: price * 100,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddress,
    vnp_CreateDate: createDate
  }

  // Sort and encode values
  const sortedParams = sortObject(vnp_Params)

  // Tạo chuỗi ký
  const signData = Object.entries(sortedParams)
    .map(([key, val]) => `${key}=${val}`)
    .join('&')

  // Tạo chữ ký HMAC SHA512
  const hmac = crypto.createHmac('sha512', secretKey)
  const signed = hmac.update(signData).digest('hex')

  // Thêm chữ ký vào params (đã encode)
  sortedParams.vnp_SecureHashType = 'SHA512'
  sortedParams.vnp_SecureHash = signed

  // Build URL payment (lần này không encode thêm nữa vì đã encode trước đó)
  const paymentUrl = `${vnpUrl}?${qs.stringify(sortedParams, { encode: false })}`

  return paymentUrl
}

const checkPaymentURL = (data) => {
  let vnpParams = data
  const receivedSecureHash = vnpParams.vnp_SecureHash
  delete vnpParams.vnp_SecureHash
  delete vnpParams.vnp_SecureHashType

  const sortedParams = sortObject({ ...vnpParams })
  const signData = Object.entries(sortedParams)
    .map(([key, val]) => `${key}=${val}`)
    .join('&')
  const secretKey = env.VNP_SECRET_KEY
  const hmac = crypto.createHmac('sha512', secretKey)
  const signed = hmac.update(signData).digest('hex')

  if (signed === receivedSecureHash) {
    return { ...vnpParams }
  } else {
    return
  }
}
export const VN_PAY = {
  createPaymentUrl,
  sortObject,
  checkPaymentURL
}
