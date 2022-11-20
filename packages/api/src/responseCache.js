const mcache = require('memory-cache')
const { responseCacheDurationMs } = require('./config')

function responseCache (req, res, next) {
  const urlKey = req.originalUrl || req.url
  const key = `__express__${urlKey}`
  const cachedBody = mcache.get(key)
  const refreshFlag = req.query?.refresh
  if (cachedBody && !refreshFlag) {
    res.send(cachedBody)
    return
  }

  res.sendResponse = res.send
  res.send = (body) => {
    mcache.put(key, body, responseCacheDurationMs)
    res.sendResponse(body)
  }

  next()
}

module.exports = { responseCache }
