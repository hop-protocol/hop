import { ipRateLimitReqPerSec, ipRateLimitWindowMs } from './config'

const rateLimit = require('express-rate-limit')

export const ipRateLimitMiddleware = rateLimit({
  windowMs: ipRateLimitWindowMs,
  max: ipRateLimitReqPerSec,
  message: 'Too many attempts from your IP address. Please wait a few seconds.',
  keyGenerator: (req: any) => {
    // console.log('ip:', req.ip, req.url)
    return req.ip
  }
})
