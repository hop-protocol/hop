import request from 'supertest'
import { app } from '#server/index.js'

function validateContext(context: any) {
  expect(context.chainId).toBeTruthy()
  expect(typeof context.chainId).toBe('string')
  expect(context.transactionHash).toBeTruthy()
  expect(typeof context.transactionIndex).toBe('number')
  expect(typeof context.logIndex).toBe('number')
  expect(context.blockNumber).toBeTruthy()
  expect(typeof context.blockNumber).toBe('number')
  expect(context.blockTimestamp).toBeTruthy()
  expect(typeof context.blockTimestamp).toBe('number')
  expect(context.from).toBeTruthy()
  expect(context.to).toBeTruthy()
  expect(context.value).toBeTruthy()
  expect(typeof context.value).toBe('string')
  expect(context.nonce).toBeTruthy()
  expect(typeof context.nonce).toBe('number')
  expect(context.gasLimit).toBeTruthy()
  expect(typeof context.gasLimit).toBe('number')
  expect(context.gasUsed).toBeTruthy()
  expect(typeof context.gasUsed).toBe('number')
  expect(context.gasPrice).toBeTruthy()
  expect(typeof context.gasPrice).toBe('string')
  expect(context.status).toBeTruthy()
  expect(typeof context.status).toBe('number')
  expect(context.data).toBeTruthy()
  expect(context.blockTimestampRelative).toBeTruthy()
  expect(context.transactionHashTruncated).toBeTruthy()
  expect(context.transactionHashExplorerUrl).toBeTruthy()
  expect(context.chainLabel).toBeTruthy()
  expect(context.chainImageUrl).toBeTruthy()
  expect(context.chainColor).toBeTruthy()
  expect(context.fromExplorerUrl).toBeTruthy()
  expect(context.toExplorerUrl).toBeTruthy()
  expect(context.valueFormatted).toBeTruthy()
  expect(context.valueDisplay).toBeTruthy()
}

async function queryEvents(eventName: string) {
  const res = await request(app).get('/v1/events').query({ eventName }).send()
  const { events } = res.body
  console.log(JSON.stringify(events, null, 2))
  expect(events).toBeTruthy()
  return events
}

describe('Server', () => {
  it('/health', async () => {
    const res = await request(app).get('/health').send()
    const body = res.body
    console.log(JSON.stringify(body, null, 2))
    expect(body).toBeTruthy()
    expect(body.status).toBe('ok')
  })
  it('/v1/events - BundleCommitted', async () => {
    const events = await queryEvents('BundleCommitted')

    const event = events[0]
    expect(event.bundleId).toBeTruthy()
    expect(event.bundleRoot).toBeTruthy()
    expect(event.bundleFees).toBeTruthy()
    expect(typeof event.bundleFees).toBe('string')
    expect(event.toChainId).toBeTruthy()
    expect(event.commitTime).toBeTruthy()
    expect(typeof event.commitTime).toBe('number')
    expect(event.bundleIdTruncated).toBeTruthy()
    expect(event.bundleRootTruncated).toBeTruthy()
    expect(event.toChainLabel).toBeTruthy()
    expect(event.toChainImageUrl).toBeTruthy()
    expect(event.toChainColor).toBeTruthy()
    expect(event.bundleFeesDisplay).toBeTruthy()

    validateContext(event.context)
  })
  it('/v1/events - BundleForwarded ', async () => {
    const events = await queryEvents('BundleForwarded')

    const event = events[0]
    expect(event.bundleId).toBeTruthy()
    expect(event.bundleRoot).toBeTruthy()
    expect(event.fromChainId).toBeTruthy()
    expect(typeof event.fromChainId).toBe('string')
    expect(event.toChainId).toBeTruthy()
    expect(typeof event.toChainId).toBe('string')
    expect(event.bundleIdTruncated).toBeTruthy()
    expect(event.bundleRootTruncated).toBeTruthy()
    expect(event.fromChainLabel).toBeTruthy()
    expect(event.fromChainImageUrl).toBeTruthy()
    expect(event.toChainName).toBeTruthy()
    expect(event.toChainLabel).toBeTruthy()
    expect(event.toChainImageUrl).toBeTruthy()
    expect(event.toChainColor).toBeTruthy()

    validateContext(event.context)
  })
  it('/v1/events - BundleReceived', async () => {
    const events = await queryEvents('BundleReceived')

    const event = events[0]
    expect(event.bundleId).toBeTruthy()
    expect(event.bundleRoot).toBeTruthy()
    expect(event.bundleFees).toBeTruthy()
    expect(typeof event.bundleFees).toBe('string')
    expect(event.fromChainId).toBeTruthy()
    expect(typeof event.fromChainId).toBe('string')
    expect(event.toChainId).toBeTruthy()
    expect(typeof event.toChainId).toBe('string')
    expect(event.relayWindowStart).toBeTruthy()
    expect(typeof event.relayWindowStart).toBe('number')
    expect(event.relayer).toBeTruthy()
    expect(event.bundleIdTruncated).toBeTruthy()
    expect(event.bundleRootTruncated).toBeTruthy()
    expect(event.relayerTruncated).toBeTruthy()
    expect(event.fromChainLabel).toBeTruthy()
    expect(event.fromChainImageUrl).toBeTruthy()
    //expect(event.toChainName).toBeTruthy()
    expect(event.toChainLabel).toBeTruthy()
    expect(event.toChainImageUrl).toBeTruthy()
    expect(event.toChainColor).toBeTruthy()
    expect(event.bundleFeesDisplay).toBeTruthy()

    validateContext(event.context)
  })
  it('/v1/events - BundleSet', async () => {
    const events = await queryEvents('BundleSet')

    const event = events[0]
    expect(event.bundleId).toBeTruthy()
    expect(event.bundleRoot).toBeTruthy()
    expect(event.fromChainId).toBeTruthy()
    expect(typeof event.fromChainId).toBe('string')
    expect(event.bundleIdTruncated).toBeTruthy()
    expect(event.bundleRootTruncated).toBeTruthy()
    expect(event.fromChainLabel).toBeTruthy()
    expect(event.fromChainImageUrl).toBeTruthy()

    validateContext(event.context)
  })
  it('/v1/events - FeesSentToHub', async () => {
    const events = await queryEvents('FeesSentToHub')

    const event = events[0]
    expect(event.amount).toBeTruthy()
    expect(typeof event.amount).toBe('string')

    validateContext(event.context)
  })
  it('/v1/events - MessageBundled', async () => {
    const events = await queryEvents('MessageBundled')

    const event = events[0]
    expect(event.messageId).toBeTruthy()
    expect(event.bundleId).toBeTruthy()
    expect(event.treeIndex).toBeTruthy()
    expect(typeof event.treeIndex).toBe('number')
    expect(event.messageIdTruncated).toBeTruthy()
    expect(event.bundleIdTruncated).toBeTruthy()

    validateContext(event.context)
  })
  it('/v1/events - MessageExecuted', async () => {
    const events = await queryEvents('MessageExecuted')

    const event = events[0]
    expect(event.messageId).toBeTruthy()
    expect(event.fromChainId).toBeTruthy()
    expect(typeof event.fromChainId).toBe('string')
    expect(event.messageIdTruncated).toBeTruthy()
    expect(event.fromChainLabel).toBeTruthy()
    expect(event.fromChainImageUrl).toBeTruthy()

    validateContext(event.context)
  })
  it('/v1/events - MessageSent ', async () => {
    const events = await queryEvents('MessageSent')

    const event = events[0]
    expect(event.messageId).toBeTruthy()
    expect(event.from).toBeTruthy()
    expect(event.toChainId).toBeTruthy()
    expect(event.to).toBeTruthy()
    expect(event.data).toBeTruthy()
    expect(event.messageIdTruncated).toBeTruthy()
    expect(event.fromTruncated).toBeTruthy()
    expect(event.toTruncated).toBeTruthy()
    expect(event.toExplorerUrl).toBeTruthy()
    expect(event.toChainLabel).toBeTruthy()
    expect(event.toChainImageUrl).toBeTruthy()
    expect(event.toChainColor).toBeTruthy()

    validateContext(event.context)
  })
  it('/v1/events - BonderPreference', async () => {
    const events = await queryEvents('BonderPreference')

    const event = events[0]
    expect(event.pathId).toBeTruthy()
    expect(event.bonder).toBeTruthy()
    expect(event.feeTier).toBeTruthy()
    expect(typeof event.feeTier).toBe('string')
    expect(event.liquidity).toBeTruthy()
    expect(typeof event.liquidity).toBe('string')
    expect(event.pathIdTruncated).toBeTruthy()
    expect(event.bonderTruncated).toBeTruthy

    validateContext(event.context)
  })
  it('/v1/events - ClaimChainUpdated', async () => {
    const events = await queryEvents('ClaimChainUpdated')

    const event = events[0]
    expect(event.pathId).toBeTruthy()
    expect(event.headClaimId).toBeTruthy()
    expect(event.length).toBeTruthy()
    expect(typeof event.length).toBe('string')
    expect(event.headClaimIdTruncated).toBeTruthy()
    expect(event.headClaimIdExplorerUrl).toBeTruthy()
    expect(event.pathIdTruncated).toBeTruthy()

    validateContext(event.context)
  })
  it('/v1/events - ClaimPosted', async () => {
    const events = await queryEvents('ClaimPosted')

    const event = events[0]
    expect(event.pathId).toBeTruthy()
    expect(event.claimId).toBeTruthy()
    expect(event.claimIdTruncated).toBeTruthy()
    expect(event.claimIdExplorerUrl).toBeTruthy()
    expect(event.pathIdTruncated).toBeTruthy()

    validateContext(event.context)
  })
  it('/v1/events - TransferBonded', async () => {
    const events = await queryEvents('TransferBonded')

    const event = events[0]
    expect(event.pathId).toBeTruthy()
    expect(event.claimId).toBeTruthy()
    expect(event.to).toBeTruthy()
    expect(event.amount).toBeTruthy()
    expect(typeof event.amount).toBe('string')
    expect(event.bonderFee).toBeTruthy()
    expect(typeof event.bonderFee).toBe('string')
    expect(event.claimIdTruncated).toBeTruthy()
    expect(event.claimIdExplorerUrl).toBeTruthy()
    expect(event.pathIdTruncated).toBeTruthy()
    expect(event.toTruncated).toBeTruthy()

    validateContext(event.context)
  })
  it('/v1/events - TransferSent', async () => {
    const events = await queryEvents('TransferSent')

    const event = events[0]
    expect(event.pathId).toBeTruthy()
    expect(event.transferId).toBeTruthy()
    expect(event.to).toBeTruthy()
    expect(event.amountOut).toBeTruthy()
    expect(typeof event.amountOut).toBe('string')
    expect(event.totalSent).toBeTruthy()
    expect(typeof event.totalSent).toBe('string')
    expect(event.totalClaims).toBeTruthy()
    expect(typeof event.totalClaims).toBe('string')
    expect(event.hops).toBeTruthy()
    expect(event.transferIdTruncated).toBeTruthy()
    expect(event.transferIdExplorerUrl).toBeTruthy()
    expect(event.pathIdTruncated).toBeTruthy()
    expect(event.toTruncated).toBeTruthy()

    const hop = event.hops[0]
    expect(typeof hop.index).toBe('number')
    expect(hop.pathId).toBeTruthy()
    expect(hop.maxBonderFee).toBeTruthy()
    expect(typeof hop.maxBonderFee).toBe('string')
    expect(hop.maxTotalSent).toBeTruthy()
    expect(typeof hop.maxTotalSent).toBe('string')
    expect(hop.attestedClaimId).toBeTruthy()
    expect(hop.pathIdTruncated).toBeTruthy()
    expect(hop.attestedClaimIdTruncated).toBeTruthy()

    validateContext(event.context)
  })
  it('/v1/explorer', async () => {
    const res = await request(app).get('/v1/explorer').send()
    const { events } = res.body
    console.log(JSON.stringify(events, null, 2))
    expect(events).toBeTruthy()

    const item = events[0]
    expect(item.pathId).toBeTruthy()
    expect(item.transferId).toBeTruthy()
    expect(item.to).toBeTruthy()
    expect(item.amountOut).toBeTruthy()
    expect(typeof item.amountOut).toBe('string')
    expect(item.totalSent).toBeTruthy()
    expect(typeof item.totalSent).toBe('string')
    expect(item.totalClaims).toBeTruthy()
    expect(typeof item.totalClaims).toBe('string')
    expect(item.hops).toBeTruthy()
    expect(item.transferIdTruncated).toBeTruthy()
    expect(item.transferIdExplorerUrl).toBeTruthy()
    expect(item.pathIdTruncated).toBeTruthy()
    expect(item.toTruncated).toBeTruthy()

    const hop = item.hops[0]
    expect(typeof hop.index).toBe('number')
    expect(hop.pathId).toBeTruthy()
    expect(hop.maxBonderFee).toBeTruthy()
    expect(typeof hop.maxBonderFee).toBe('string')
    expect(hop.maxTotalSent).toBeTruthy()
    expect(typeof hop.maxTotalSent).toBe('string')
    expect(hop.attestedClaimId).toBeTruthy()
    expect(hop.pathIdTruncated).toBeTruthy()
    expect(hop.attestedClaimIdTruncated).toBeTruthy()

    validateContext(item.context)
  }, 10 * 60 * 1000)
  it('/v1/paths', async () => {
    const res = await request(app).get('/v1/paths').send()
    const { paths } = res.body
    console.log(JSON.stringify(paths, null, 2))
    expect(paths).toBeTruthy()
    const path = paths[0]

    expect(path.pathId).toBeTruthy()
    expect(path.chainId).toBeTruthy()
    expect(typeof path.chainId).toBe('string')
    expect(path.token).toBeTruthy()
    expect(typeof path.tokenName).toBe('string')
    expect(typeof path.tokenSymbol).toBe('string')
    expect(typeof path.tokenDecimals).toBe('number')
    expect(path.counterpartToken).toBeTruthy()
    expect(typeof path.counterpartTokenName).toBe('string')
    expect(typeof path.counterpartTokenSymbol).toBe('string')
    expect(typeof path.counterpartTokenDecimals).toBe('number')
    expect(path.counterpartChainId).toBeTruthy()
    expect(path.pathIdTruncated).toBeTruthy()
    expect(path.tokenExplorerUrl).toBeTruthy()
    expect(path.tokenTruncated).toBeTruthy()
    expect(path.counterpartTokenExplorerUrl).toBeTruthy()
    expect(path.counterpartTokenTruncated).toBeTruthy()
    expect(typeof path.chainName).toBe('string')
    expect(path.chainLabel).toBeTruthy()
    expect(typeof path.counterpartChainName).toBe('string')
    expect(path.counterpartChainLabel).toBeTruthy()
  }, 10 * 60 * 1000)
  it('/v1/tokens', async () => {
    const res = await request(app).get('/v1/tokens').send()
    const { tokens } = res.body
    console.log(JSON.stringify(tokens, null, 2))
    expect(tokens).toBeTruthy()

    const token = tokens[0]
    expect(token.chainId).toBeTruthy()
    expect(typeof token.chainId).toBe('string')
    expect(token.address).toBeTruthy()
    expect(token.name).toBeTruthy()
    expect(token.symbol).toBeTruthy()
    expect(token.decimals).toBeTruthy()
    expect(typeof token.decimals).toBe('number')
    expect(token.tokenExplorerUrl).toBeTruthy()
    expect(token.addressTruncated).toBeTruthy()
    expect(token.chainName).toBeTruthy()
    expect(token.chainLabel).toBeTruthy()
  }, 10 * 60 * 1000)
  it('/v1/prices', async () => {
    const res = await request(app).get('/v1/prices').send()
    const { prices } = res.body
    console.log(JSON.stringify(prices, null, 2))
    expect(prices).toBeTruthy()

    const price = prices[0]
    expect(price.token).toBeTruthy()
    expect(price.priceUsd).toBeTruthy()
    expect(typeof price.priceUsd).toBe('number')
    expect(price.timestamp).toBeTruthy()
    expect(typeof price.timestamp).toBe('number')
    expect(price.priceUsdDisplay).toBeTruthy()
    expect(price.timestampRelative).toBeTruthy()
  }, 10 * 60 * 1000)
  it.only('/v1/stats/volume', async () => {
    const res = await request(app).get('/v1/stats/volume').send()
    const { stats } = res.body
    console.log(JSON.stringify(stats, null, 2))
    expect(stats).toBeTruthy()
    expect(stats.totalVolume).toBeTruthy()
    expect(stats.totalVolume.totalUsd).toBeTruthy()
    expect(stats.totalVolume.totalUsdDisplay).toBeTruthy()
    expect(stats.tokenVolumes).toBeTruthy()
  }, 10 * 60 * 1000)
})
