require('dotenv').config()

export const port = Number(process.env.PORT || 3000)
export const dbPath = process.env.SQLITE3_DB || './sqlite3.db'
export const ipRateLimitReqPerSec = Number(process.env.IP_RATE_LIMIT_REQ_PER_SEC || 100)
export const ipRateLimitWindowMs = Number(process.env.IP_RATE_LIMIT_WINDOW_MS || 1 * 1000)
