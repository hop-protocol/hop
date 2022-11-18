const rateLimit = require('express-rate-limit')
const { ipRateLimitReqPerSec, ipRateLimitWindowMs } = require('./config')

const ipRateLimitMiddleware = rateLimit({
  windowMs: ipRateLimitWindowMs,
  max: ipRateLimitReqPerSec,
  message: 'Too many attempts from your IP address. Please wait a few seconds.',
  keyGenerator: (req) => {
    // console.log('ip:', req.ip, req.url)
    return req.ip
  }
})

module.exports = { ipRateLimitMiddleware }
