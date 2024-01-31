import mcache from 'memory-cache'
import { responseCacheDurationMs } from './config'

export function responseCache (req: any, res: any, next: any) {
  const urlKey = req.originalUrl || req.url
  const key = `__express__${urlKey}`
  const cachedBody = mcache.get(key)
  const refreshFlag = req.query?.refresh
  if (cachedBody && !refreshFlag) {
    res.send(cachedBody)
    return
  }

  res.sendResponse = res.send
  res.send = (body: any) => {
    console.log('responseCache cacheKey:', key)
    mcache.put(key, body, responseCacheDurationMs)
    res.sendResponse(body)
  }

  next()
}
