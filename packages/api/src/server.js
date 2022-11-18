const express = require('express')
const { Hop } = require('@hop-protocol/sdk')
const cors = require('cors')
const { ipRateLimitMiddleware } = require('./rateLimit')
const { port, trustProxy } = require('./config')

const app = express()
const hop = new Hop('mainnet')

if (trustProxy) {
  app.enable('trust proxy') // if using ELB
}
app.use(cors())

app.get('/v1/quote', ipRateLimitMiddleware, async (req, res) => {
  const { amount, token, fromChain, toChain, slippage } = req.query

  try {
    const bridge = hop.bridge(token)
    const data = await bridge.getSendData(amount, fromChain, toChain)
    const { totalFee, amountOut, estimatedReceived } = data
    const amountOutMin = bridge.calcAmountOutMin(amountOut, slippage)

    res.json({
      amountIn: amount.toString(),
      amountOutMin: amountOutMin.toString(),
      bonderFee: totalFee.toString(),
      estimatedRecieved: estimatedReceived.toString()
    })
  } catch (err) {
    res.json({ error: err.message })
  }
})

app.get('/v1/transfer-status', ipRateLimitMiddleware, async (req, res) => {
  const { transferId, transactionHash } = req.query

  try {
    const status = await hop.getTransferStatus(transferId || transactionHash)
    res.json(status)
  } catch (err) {
    res.json({ error: err.message })
  }
})

app.get('/health', async (req, res) => {
  res.json({status: 'OK'})
})

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
