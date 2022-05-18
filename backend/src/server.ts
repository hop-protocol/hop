import path from 'path'
import express from 'express'
import { port } from './config'
import { Controller } from './controller'
import cors from 'cors'
import { ipRateLimitMiddleware } from './rateLimit'
import Worker from './worker'

const app = express()
const controller = new Controller()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(ipRateLimitMiddleware)

app.use('/static', express.static('static'))

app.get('/', (req: any, res: any) => {
  res.status(404).json({ error: 'not found' })
})

app.get('/health', (req: any, res: any) => {
  res.status(200).json({ status: 'ok' })
})

app.get('/transfers', async (req: any, res: any) => {
  try {
    const {
      page,
      perPage,
      source: sourceChainSlug,
      destination: destinationChainSlug,
      token,
      bonded,
      bonder: bonderAddress,
      account: accountAddress,
      amount: amountFormatted,
      amountCmp: amountFormattedCmp,
      amountUsd,
      amountUsdCmp,
      transferId,
      date
    } = req.query
    const data = await controller.getTransfers({
      page,
      perPage,
      sourceChainSlug,
      destinationChainSlug,
      token,
      bonded,
      bonderAddress,
      accountAddress,
      amountFormatted,
      amountFormattedCmp,
      amountUsd,
      amountUsdCmp,
      transferId,
      date
    })
    res.status(200).json({ status: 'ok', data })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.get('/index', (req: any, res: any) => {
  res.sendFile(path.resolve(__dirname, '..', 'public/index.html'))
})

const argv = require('minimist')(process.argv.slice(2))
console.debug('flags:', argv)

if (argv.worker) {
  const worker = new Worker({
    transfers: argv.worker,
    days: argv.days
  })

  worker.start()
}

const host = '0.0.0.0'
app.listen(port, host, () => {
  console.log(`Listening on port ${port}`)
})
