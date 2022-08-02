import mcache from 'memory-cache'

const durationMs = 20 * 1000

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
    mcache.put(key, body, durationMs)
    res.sendResponse(body)
  }

  next()
}
