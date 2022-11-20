const express = require('express')
const { Hop } = require('@hop-protocol/sdk')
const cors = require('cors')
const { port, trustProxy } = require('./config')
const { ipRateLimitMiddleware } = require('./rateLimit')
const { responseCache } = require('./responseCache')

const app = express()
const hop = new Hop('mainnet')

if (trustProxy) {
  app.enable('trust proxy') // if using ELB
}
app.use(cors())

app.get('/v1/quote', responseCache, ipRateLimitMiddleware, async (req, res) => {
  const { amount, token, fromChain, toChain, slippage } = req.query

  try {
    if (!amount) {
      throw new Error('"amount" query param is required. Value must be in smallest unit. Example: amount=1000000')
    }
    if (!token) {
      throw new Error('"token" query param is required. Example: token=USDC')
    }
    if (!fromChain) {
      throw new Error('"fromChain" query param is required. Example: fromChain=optimism')
    }
    if (!toChain) {
      throw new Error('"toChain" query param is required. Example: toChain=arbitrum')
    }
    if (!slippage) {
      throw new Error('"slippage" query param value is required. Example: slippage=0.5')
    }

    const bridge = hop.bridge(token)
    const data = await bridge.getSendData(amount, fromChain, toChain)
    const { totalFee, amountOut, estimatedReceived } = data
    const amountOutMin = bridge.calcAmountOutMin(amountOut, slippage)

    res.json({
      amountIn: amount.toString(),
      slippage: slippage.toString(),
      amountOutMin: amountOutMin.toString(),
      bonderFee: totalFee.toString(),
      estimatedRecieved: estimatedReceived.toString()
    })
  } catch (err) {
    res.json({ error: err.message })
  }
})

app.get('/v1/transfer-status', responseCache, ipRateLimitMiddleware, async (req, res) => {
  const { transferId, transactionHash } = req.query

  try {
    const tId = transferId || transactionHash
    if (!tId) {
      throw new Error('transferId or transactionHash is required')
    }
    if (transferId && transactionHash) {
      throw new Error('cannot use both transferId and transactionHash. Only use one option.')
    }
    if (transferId && !transferId.startsWith('0x')) {
      throw new Error('transferId must be a hex string. Example: transferId=0x123...')
    }
    if (transactionHash && !transactionHash.startsWith('0x')) {
      throw new Error('transactionHash must be a hex string. Example: transactionHash=0x123...')
    }
    const status = await hop.getTransferStatus(tId)
    res.json(status)
  } catch (err) {
    res.json({ error: err.message })
  }
})

app.get('/health', async (req, res) => {
  res.json({ status: 'OK' })
})

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
