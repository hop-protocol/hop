export const trustProxy = !!process.env.TRUST_PROXY
export const port = Number(process.env.PORT ?? 8000)
export const ipRateLimitReqPerSec = Number(process.env.IP_RATE_LIMIT_REQ_PER_SEC ?? 100)
export const ipRateLimitWindowMs = Number(process.env.IP_RATE_LIMIT_WINDOW_MS ?? 1 * 1000)
export const responseCacheDurationMs = Number(process.env.RESPONSE_CACHE_DURATION_MS ?? 10 * 1000)
export const gitRev = process.env.GIT_REV ?? 'dev'
