import { cache } from './cache'
import { isGoerli } from './config'

const cacheDurationMs = isGoerli ? 5 * 1000 : 20 * 1000

export function responseCache (req: any, res: any, next: any) {
  const urlKey = req.originalUrl || req.url
  const cacheKey = `__express__${urlKey}`
  const cachedBody = cache.get(cacheKey)
  const refreshFlag = req.query?.refresh
  if (cachedBody && !refreshFlag) {
    res.send(cachedBody)
    return
  }

  res.sendResponse = res.send
  res.send = (body: any) => {
    cache.put(cacheKey, body, cacheDurationMs)
    res.sendResponse(body)
  }

  next()
}
