import mcache from 'memory-cache'
import { responseCacheDurationMs } from '#config/index.js'

const responseCacheEnabled = responseCacheDurationMs > 0

const cache = new mcache.Cache()

export function responseCacheHandler (durationMs: number) {
  return (req: any, res: any, next: any) => responseCache(req, res, next, durationMs)
}

export function responseCache (req: any, res: any, next: any, durationMs: number = responseCacheDurationMs) {
  const urlKey = req.originalUrl || req.url
  const key = `__express__${urlKey}`
  const cachedBody = cache.get(key)
  if (cachedBody && responseCacheEnabled) {
    console.log('cache hit:', key)
    res.send(cachedBody)
    return
  }

  res.sendResponse = res.send
  res.send = (body: any) => {
    try {
      const parsed = JSON.parse(body)
      if (parsed.data && responseCacheEnabled) {
        // console.log('cached:', key)
        cache.put(key, body, durationMs)
      }
    } catch (err) { }
    res.sendResponse(body)
  }

  next()
}
