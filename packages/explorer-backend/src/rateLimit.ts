import rateLimit from 'express-rate-limit'
import { ipRateLimitReqPerSec, ipRateLimitWindowMs, rateLimitToken } from './config'

export const ipRateLimitMiddleware = rateLimit({
  windowMs: ipRateLimitWindowMs,
  max: ipRateLimitReqPerSec,
  message: 'Too many attempts from your IP address. Please wait a few seconds.',
  keyGenerator: (req: any) => {
    // console.log('ip:', req.ip, req.url)
    return req.ip
  },
  skip: (req) => {
    if (!rateLimitToken) {
      return false
    }

    if (!req.query.rate_limit_token) {
      return false
    }

    return req.query.rate_limit_token === rateLimitToken
  }
})
