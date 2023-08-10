const express = require('express')
const { Hop } = require('@hop-protocol/sdk')
const cors = require('cors')
const { port, trustProxy } = require('./config')
const { ipRateLimitMiddleware } = require('./rateLimit')
const { responseCache } = require('./responseCache')

const app = express()

if (trustProxy) {
  app.enable('trust proxy') // if using ELB
}
app.use(cors())

app.get('/v1/quote', responseCache, ipRateLimitMiddleware, async (req, res) => {
  const { amount, token, fromChain, toChain, rpcUrl } = req.query
  let { network } = req.query
  const slippage = Number(req.query.slippage)

  try {
    if (!network) {
      network = 'mainnet'
    }

    const validNetworks = ['mainnet', 'goerli']
    if (!validNetworks.includes(network)) {
      throw new Error(`"${network}" is an network. Valid networks are: ${validNetworks.toString(',')}`)
    }

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

    const customRpcProviderUrls = {}
    const instance = new Hop(network)
    const validChains = instance.getSupportedChains()
    if (rpcUrl) {
      if (!(rpcUrl instanceof Object)) {
        throw new Error('"rpcUrl" query param should be in the form of rpcUrl[chain]. Example: rpcUrl[optimism]=https://mainnet.optimism.io')
      }
      for (const chain in rpcUrl) {
        if (!validChains.includes(chain)) {
          throw new Error(`"rpcUrl[${chain}]" is an invalid chain. Valid chains are: ${validChains.toString(',')}`)
        }
        const url = rpcUrl[chain]
        try {
          customRpcProviderUrls[chain] = new URL(url).toString()
        } catch (err) {
          throw new Error(`"rpcUrl[${chain}]" has an invalid url "${url}"`)
        }
      }
    }

    if (Object.keys(customRpcProviderUrls)) {
      instance.setChainProviderUrls(customRpcProviderUrls)
    }

    const bridge = instance.bridge(token)
    const data = await bridge.getSendData(amount, fromChain, toChain)
    const { totalFee, estimatedReceived } = data
    const { amountOutMin, destinationAmountOutMin, deadline, destinationDeadline } = bridge.getSendDataAmountOutMins(data, slippage)

    res.json({
      amountIn: amount.toString(),
      slippage,
      amountOutMin: amountOutMin ? amountOutMin.toString() : null,
      destinationAmountOutMin: destinationAmountOutMin ? destinationAmountOutMin.toString() : null,
      bonderFee: totalFee ? totalFee.toString() : null,
      estimatedRecieved: estimatedReceived ? estimatedReceived.toString() : null,
      deadline: deadline || null,
      destinationDeadline: destinationDeadline || null
    })
  } catch (err) {
    res.json({ error: err.message })
  }
})

app.get('/v1/transfer-status', responseCache, ipRateLimitMiddleware, async (req, res) => {
  const { transferId, transactionHash } = req.query
  let { network } = req.query

  function filterResult (json) {
    return {
      transferId: json.transferId,
      transactionHash: json.transactionHash,
      sourceChainId: json.sourceChainId,
      sourceChainSlug: json.sourceChainSlug,
      destinationChainId: json.destinationChainId,
      destinationChainSlug: json.destinationChainSlug,
      accountAddress: json.accountAddress,
      amount: json.amount,
      amountFormatted: json.amountFormatted,
      amountUsd: json.amountUsd,
      amountOutMin: json.amountOutMin,
      deadline: json.deadline,
      recipientAddress: json.recipientAddress,
      bonderFee: json.bonderFee,
      bonderFeeFormatted: json.bonderFeeFormatted,
      bonderFeeUsd: json.bonderFeeUsd,
      bonded: json.bonded,
      bondTransactionHash: json.bondTransactionHash,
      bonderAddress: json.bonderAddress,
      token: json.token,
      timestamp: json.timestamp
    }
  }

  try {
    if (!network) {
      network = 'mainnet'
    }

    const validNetworks = ['mainnet', 'goerli']
    if (!validNetworks.includes(network)) {
      throw new Error(`"${network}" is an network. Valid networks are: ${validNetworks.toString(',')}`)
    }

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

    const hop = new Hop(network)
    const json = await hop.getTransferStatus(tId)
    const result = Array.isArray(json) ? json.map(filterResult) : filterResult(json)
    res.json(result)
  } catch (err) {
    res.json({ error: err.message })
  }
})

app.get('/v1/available-routes', responseCache, ipRateLimitMiddleware, async (req, res) => {
  try {
    let { network } = req.query
    if (!network) {
      network = 'mainnet'
    }
    const hop = new Hop(network)
    const json = await hop.getAvailableRoutes()
    res.json(json)
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
