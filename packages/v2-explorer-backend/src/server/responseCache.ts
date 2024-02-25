import mcache from 'memory-cache'
import { responseCacheDurationMs } from '../config'

const responseCacheEnabled = responseCacheDurationMs > 0

export function responseCache (req: any, res: any, next: any) {
  const urlKey = req.originalUrl || req.url
  const key = `__express__${urlKey}`
  const cachedBody = mcache.get(key)
  if (cachedBody && responseCacheEnabled) {
    // console.log('cache hit:', key)
    res.send(cachedBody)
    return
  }

  res.sendResponse = res.send
  res.send = (body: any) => {
    try {
      const parsed = JSON.parse(body)
      if (parsed.data && responseCacheEnabled) {
        // console.log('cached:', key)
        mcache.put(key, body, responseCacheDurationMs)
      }
    } catch (err) { }
    res.sendResponse(body)
  }

  next()
}
