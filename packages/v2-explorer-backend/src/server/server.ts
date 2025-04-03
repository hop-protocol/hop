import cors from 'cors'
import express, { Express } from 'express'
import { Controller } from '#controller/index.js'
import { ipRateLimitMiddleware } from './rateLimit.js'
import { port } from '#config/index.js'
import { responseCache, responseCacheHandler } from './responseCache.js'

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
    let { limit = 10, filter, page = 1, startTimestamp, endTimestamp } = req.query
    limit = Number(limit)
    if (limit < 1) {
      throw new Error('limit must be greater than 0')
    }
    if (limit > maxPageSize) {
      throw new Error(`limit must be less than ${maxPageSize}`)
    }

    // Parse timestamps if provided
    if (startTimestamp) {
      startTimestamp = parseInt(startTimestamp)
    }
    
    if (endTimestamp) {
      endTimestamp = parseInt(endTimestamp)
    }

    const { items, hasNextPage } = await controller.getExplorerEventsForApi({
      limit,
      filter,
      page: Number(page),
      startTimestamp,
      endTimestamp
    })
    res.status(200).json({
      events: items,
      hasNextPage,
      lastUpdated: new Date().toISOString()
    })
  } catch (err: any) {
    console.error(err)
    res.json({ error: err.message })
  }
})

app.get('/v1/events', responseCache, async (req: any, res: any) => {
  try {
    let { eventName, page = 1, limit = 10, filter, startTimestamp, endTimestamp } = req.query
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
    
    // Parse timestamps if provided
    if (startTimestamp) {
      startTimestamp = parseInt(startTimestamp)
    }
    
    if (endTimestamp) {
      endTimestamp = parseInt(endTimestamp)
    }
    
    const { items, hasNextPage } = await controller.getEventsForApi({
      eventName,
      limit,
      filter,
      page: Number(page),
      startTimestamp,
      endTimestamp
    })
    res.status(200).json({
      events: items,
      hasNextPage,
      lastUpdated: new Date().toISOString()
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
      hasNextPage,
      lastUpdated: new Date().toISOString()
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
      hasNextPage,
      lastUpdated: new Date().toISOString()
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
      hasNextPage,
      lastUpdated: new Date().toISOString()
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
    res.status(200).json({
      stats,
      lastUpdated: new Date().toISOString()
    })
  } catch (err: any) {
    console.error(err)
    res.json({ error: err.message })
  }
})

app.get('/v1/stats/daily-volume', responseCache, async (req: any, res: any) => {
  try {
    const { days, pathId, startTimestamp, endTimestamp } = req.query
    const stats = await controller.getDailyVolumeStatsForApi({
      days: days ? parseInt(days) : undefined,
      pathId,
      startTimestamp: startTimestamp ? parseInt(startTimestamp) : undefined,
      endTimestamp: endTimestamp ? parseInt(endTimestamp) : undefined
    })
    res.status(200).json({
      data: stats,
      lastUpdated: new Date().toISOString()
    })
  } catch (err: any) {
    console.error(err)
    res.json({ error: err.message })
  }
})

app.get('/v1/stats/cumulative-volume', responseCache, async (req: any, res: any) => {
  try {
    const { days, pathId, startTimestamp, endTimestamp } = req.query
    const stats = await controller.getCumulativeVolumeStatsForApi({
      days: days ? parseInt(days) : undefined,
      pathId,
      startTimestamp: startTimestamp ? parseInt(startTimestamp) : undefined,
      endTimestamp: endTimestamp ? parseInt(endTimestamp) : undefined
    })
    res.status(200).json({
      data: stats,
      lastUpdated: new Date().toISOString()
    })
  } catch (err: any) {
    console.error(err)
    res.json({ error: err.message })
  }
})

app.get('/v1/contract-state', responseCacheHandler(5 * 60 * 1000), async (req: any, res: any) => {
  try {
    const { filter, chainIds } = req.query
    const data = await controller.getContractState({
      filter,
      chainIds
    })
    res.status(200).json({
      data,
      lastUpdated: new Date().toISOString()
    })
  } catch (err: any) {
    console.error(err)
    res.json({ error: err.message })
  }
})

app.get('/v1/path-details', responseCacheHandler(5 * 60 * 1000), async (req: any, res: any) => {
  try {
    const { pathId } = req.query
    if (!pathId) {
      throw new Error('pathId is required')
    }
    const data = await controller.getPathDetailsState({
      pathId
    })
    res.status(200).json({
      data,
      lastUpdated: new Date().toISOString()
    })
  } catch (err: any) {
    console.error(err)
    res.json({ error: err.message })
  }
})

app.get('/v1/message-details', responseCacheHandler(5 * 60 * 1000), async (req: any, res: any) => {
  try {
    const { messageId } = req.query
    if (!messageId) {
      throw new Error('messageId is required')
    }
    const data = await controller.getMessageDetailsState({
      messageId
    })
    res.status(200).json({
      data,
      lastUpdated: new Date().toISOString()
    })
  } catch (err: any) {
    console.error(err)
    res.json({ error: err.message })
  }
})

app.get('/v1/bonders', responseCacheHandler(5 * 60 * 1000), async (req: any, res: any) => {
  try {
    const { filter } = req.query
    const data = await controller.getBondersState({
      filter
    })
    res.status(200).json({
      data,
      lastUpdated: new Date().toISOString()
    })
  } catch (err: any) {
    console.error(err)
    res.json({ error: err.message })
  }
})

// Add this new endpoint for debugging transfer data
app.get('/v1/debug/transfers', async (req: any, res: any) => {
  try {
    const { date } = req.query
    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required' })
    }
    
    // Use a direct SQL query to get raw transfer data for the given date
    const query = `
      SELECT 
        e.id, 
        e.transfer_id as "transferId", 
        e.amount as "amount", 
        e."to" as "recipient", 
        ec.transaction_hash as "transactionHash", 
        ec.chain_id as "chainId", 
        ec.block_timestamp as "blockTimestamp",
        to_char(to_timestamp(ec.block_timestamp), 'YYYY-MM-DD') AS "date",
        t.symbol as "tokenSymbol",
        t.decimals as "tokenDecimals"
      FROM 
        transfer_sent_events e
      JOIN 
        event_context ec ON e.event_context_id = ec.id
      JOIN 
        paths p ON e.path_id = p.path_id
      JOIN 
        tokens t ON p.token = t.address
      WHERE 
        to_char(to_timestamp(ec.block_timestamp), 'YYYY-MM-DD') = $1
      ORDER BY 
        ec.block_timestamp, e.transfer_id
    `
    
    console.log(`Executing debug query for date: ${date}`)
    const result = await controller.pgDb.db.any(query, [date])
    
    return res.json({
      transfers: result,
      count: result.length
    })
  } catch (err: any) {
    console.error('Error getting debug transfers:', err)
    return res.status(500).json({ error: err.message })
  }
})

// Add new endpoint for transfer flow stats (Sankey chart)
app.get('/v1/stats/flow', responseCache, async (req: any, res: any) => {
  try {
    const { days, sourceChainId, destinationChainId, tokenSymbol } = req.query
    const result = await controller.getTransferFlowStatsForApi({ 
      days: Number(days) || undefined,
      sourceChainId,
      destinationChainId,
      tokenSymbol
    })
    res.status(200).json(result)
  } catch (err: any) {
    console.error(`Error fetching flow stats: ${err.message}`)
    res.json({ error: err.message })
  }
})

const host = '0.0.0.0'

export function server () {
  app.listen(port, host, () => {
    console.log(`Listening on port ${port}`)
  })
}
