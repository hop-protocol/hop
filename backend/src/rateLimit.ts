import rateLimit from 'express-rate-limit'
import { ipRateLimitReqPerSec, ipRateLimitWindowMs } from './config'

export const ipRateLimitMiddleware = rateLimit({
  windowMs: ipRateLimitWindowMs,
  max: ipRateLimitReqPerSec,
  message: 'Too many attempts from your IP address. Please wait a few seconds.'
})
