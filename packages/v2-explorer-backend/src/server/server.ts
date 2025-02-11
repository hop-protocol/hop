import cors from 'cors'
import express, { Express } from 'express'
import { Controller } from '#controller/index.js'
import { ipRateLimitMiddleware } from './rateLimit.js'
import { port } from '#config/index.js'
import { responseCache } from './responseCache.js'

export const app : Express = express()
const controller = new Controller()

const maxPageSize = 100

app.enable('trust proxy')
app.use(cors())
app.use(express.json({ limit: '500kb' }))
app.use(express.urlencoded({ extended: false, limit: '500kb', parameterLimit: 50 }))
app.use(ipRateLimitMiddleware)

app.get('/', (req: any, res: any) => {
  res.status(404).json({ error: 'not found' })
})

app.get('/health', (req: any, res: any) => {
  res.status(200).json({ status: 'ok' })
})

app.get('/v1/explorer', responseCache, async (req: any, res: any) => {
  try {
    let { limit = 10, filter, page = 1 } = req.query
    limit = Number(limit)
    if (limit < 1) {
      throw new Error('limit must be greater than 0')
    }
    if (limit > maxPageSize) {
      throw new Error(`limit must be less than ${maxPageSize}`)
    }
    const { items, hasNextPage } = await controller.getExplorerEventsForApi({
      limit,
      filter,
      page: Number(page)
    })
    res.status(200).json({
      events: items,
      hasNextPage
    })
  } catch (err: any) {
    console.error(err)
    res.json({ error: err.message })
  }
})

app.get('/v1/events', responseCache, async (req: any, res: any) => {
  try {
    let { eventName, page = 1, limit = 10, filter } = req.query
    if (!eventName) {
      throw new Error('missing eventName')
    }
    limit = Number(limit)
    if (limit < 1) {
      throw new Error('limit must be greater than 0')
    }
    if (limit > maxPageSize) {
      throw new Error(`limit must be less than ${maxPageSize}`)
    }
    const { items, hasNextPage } = await controller.getEventsForApi({
      eventName,
      limit,
      filter,
      page: Number(page)
    })
    res.status(200).json({
      events: items,
      hasNextPage
    })
  } catch (err: any) {
    console.error(err)
    res.json({ error: err.message })
  }
})

app.get('/v1/paths', responseCache, async (req: any, res: any) => {
  try {
    let { page = 1, limit = 10, filter } = req.query
    limit = Number(limit)
    if (limit < 1) {
      throw new Error('limit must be greater than 0')
    }
    if (limit > maxPageSize) {
      throw new Error(`limit must be less than ${maxPageSize}`)
    }
    const { items, hasNextPage } = await controller.getPathsForApi({
      limit,
      filter,
      page: Number(page)
    })
    res.status(200).json({
      paths: items,
      hasNextPage
    })
  } catch (err: any) {
    console.error(err)
    res.json({ error: err.message })
  }
})

app.get('/v1/tokens', responseCache, async (req: any, res: any) => {
  try {
    let { page = 1, limit = 10, filter } = req.query
    limit = Number(limit)
    if (limit < 1) {
      throw new Error('limit must be greater than 0')
    }
    if (limit > maxPageSize) {
      throw new Error(`limit must be less than ${maxPageSize}`)
    }
    const { items, hasNextPage } = await controller.getTokensForApi({
      limit,
      filter,
      page: Number(page)
    })
    res.status(200).json({
      tokens: items,
      hasNextPage
    })
  } catch (err: any) {
    console.error(err)
    res.json({ error: err.message })
  }
})

app.get('/v1/prices', responseCache, async (req: any, res: any) => {
  try {
    let { page = 1, limit = 10, filter } = req.query
    limit = Number(limit)
    if (limit < 1) {
      throw new Error('limit must be greater than 0')
    }
    if (limit > maxPageSize) {
      throw new Error(`limit must be less than ${maxPageSize}`)
    }
    const { items, hasNextPage } = await controller.getTokenPricesForApi({
      limit,
      filter,
      page: Number(page)
    })
    res.status(200).json({
      prices: items,
      hasNextPage
    })
  } catch (err: any) {
    console.error(err)
    res.json({ error: err.message })
  }
})

app.get('/v1/stats/volume', responseCache, async (req: any, res: any) => {
  try {
    const { filter } = req.query
    const stats = await controller.getTransferVolumeStatsForApi({
      filter
    })
    res.status(200).json({ stats })
  } catch (err: any) {
    console.error(err)
    res.json({ error: err.message })
  }
})

app.get('/v1/contract-state', responseCache, async (req: any, res: any) => {
  try {
    const { filter, chainIds } = req.query
    const data = await controller.getContractState({
      filter,
      chainIds
    })
    res.status(200).json({
      data
    })
  } catch (err: any) {
    console.error(err)
    res.json({ error: err.message })
  }
})

const host = '0.0.0.0'

export function server () {
  app.listen(port, host, () => {
    console.log(`Listening on port ${port}`)
  })
}
