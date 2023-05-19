import mcache from 'memory-cache'

const cache = new mcache.Cache()
const cacheDurationMs = 20 * 1000

export function responseCache (req: any, res: any, next: any) {
  const urlKey = req.originalUrl || req.url
  const key = `__express__${urlKey}`
  const cachedBody = cache.get(key)
  const refreshFlag = req.query?.refresh
  if (cachedBody && !refreshFlag) {
    res.send(cachedBody)
    return
  }

  res.sendResponse = res.send
  res.send = (body: any) => {
    cache.put(key, body, cacheDurationMs)
    res.sendResponse(body)
  }

  next()
}
