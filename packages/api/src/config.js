const trustProxy = !!process.env.TRUST_PROXY
const port = process.env.PORT || 8000
const ipRateLimitReqPerSec = Number(process.env.IP_RATE_LIMIT_REQ_PER_SEC || 100)
const ipRateLimitWindowMs = Number(process.env.IP_RATE_LIMIT_WINDOW_MS || 1 * 1000)
const responseCacheDurationMs = Number(process.env.RESPONSE_CACHE_DURATION_MS || 10 * 1000)
const gitRev = process.env.GIT_REV ?? 'dev'

module.exports = {
  trustProxy,
  port,
  ipRateLimitReqPerSec,
  ipRateLimitWindowMs,
  responseCacheDurationMs,
  gitRev
}
