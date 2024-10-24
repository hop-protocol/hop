import { BigNumber, utils } from 'ethers'
import { DateTime } from 'luxon'
import { db } from '#db/index.js'
import { Hop } from '@hop-protocol/v2-sdk'
import { pgDb } from '#pgDb/index.js'
import { truncateString } from '#utils/truncateString.js'
import { chainNames, network, rpcUrls } from '#config/index.js'
import { formatToUSD } from '#utils/formatToUSD.js'

const { formatUnits, getAddress: ethersChecksumAddress } = utils

function getChainLabel(chainId: string) {
  const chainName = chainNames[chainId] ?? ''
  if (!chainName) {
    return `${chainId}`
  }
  return `${chainId} - ${chainName}`
}

function checksumAddress (address: string) {
  try {
    return ethersChecksumAddress(address)
  } catch (err) {
    return address
  }
}

type EventsResult = {
  items: any[]
  hasNextPage?: boolean
}

type EventsApiInput = {
  eventName: string
  limit?: number
  page?: number | null
  filter: any
}

type PathsApiInput = {
  limit?: number
  page?: number | null
  filter: any
}

type TokensApiInput = {
  limit?: number
  page?: number | null
  filter: any
}

export class Controller {
  db: any = db
  pgDb = pgDb
  events: any
  sdk: Hop

  constructor () {
    this.sdk = new Hop({
      signersOrProviders: Hop.getDefaultProviders(network)
    })
    this.sdk.setProviderUrls(rpcUrls)
    // console.log(this.sdk.chainProviders)
  }

  async getEventsForApi (input: EventsApiInput): Promise<EventsResult> {
    const { eventName, limit = 10, page = 1 } = input
    const filter = this.normalizeFilters(input.filter)

    const { items, hasNextPage } = await this.getEvents({ eventName, limit, page, filter })

    return {
      items: items.map((item: any) => this.normalizeEventForApi(item)),
      hasNextPage
    }
  }

  async getEvents (input: any): Promise<any> {
    const { eventName, limit = 10, page = 1 } = input
    const filter = this.normalizeFilters(input.filter)

    if (!this.pgDb.events[eventName]) {
      throw new Error(`Event ${eventName} not found`)
    }

    const items = await this.pgDb.events[eventName].getItems({ limit, filter, page })
    const itemsNext = await this.pgDb.events[eventName].getItems({ limit, filter, page: Number(page) + 1 })
    const hasNextPage = itemsNext.length > 0

    return {
      items: items.map((item: any) => this.normalizeEventForApi(item)),
      hasNextPage
    }
  }

  async getMessengerExplorerEventsForApi (input: any): Promise<any> {
    const { limit = 10, page } = input
    const filter = this.normalizeFilters(input.filter)

    const { items, hasNextPage } = await this.getEvents({ limit, filter, eventName: 'MessageSent', page })

    const promises = items.map(async (item: any) => {
      const { messageId } = item
      const messageExecutedEvent = await this.getEvents({
        eventName: 'MessageExecuted',
        filter: {
          messageId
        }
      })

      item.messageExecutedEvent = null
      if (messageExecutedEvent.items.length > 0) {
        item.messageExecutedEvent = messageExecutedEvent.items[0]
      }
      return item
    })

    const explorerItems = await Promise.all(promises)

    return {
      items: explorerItems.map((item: any) => this.normalizeEventForApi(item)),
      hasNextPage
    }
  }

  // Rails Gateway
  async getExplorerEventsForApi (input: any): Promise<any> {
    const { limit = 10, page } = input
    const filter = this.normalizeFilters(input.filter)

    const { items, hasNextPage } = await this.getEvents({ limit, filter, eventName: 'TransferSent', page })

    const promises = items.map(async (item: any) => {
      const { transferId } = item
      const bondedEvents  = await this.getEvents({
        eventName: 'TransferBonded',
        filter: {
          claimId: transferId
        }
      })

      await this.upsertPathInfoIfNotExists(item)
      await this.upsertTokenInfoIfNotExists(item)

      const [pathInfo] = await this.pgDb.nonEventTables.Path.getItems({ filter: { pathId: item.pathId, chainId: item.context.chainId }})
      if (pathInfo) {
        const [tokenInfo] = await this.pgDb.nonEventTables.Token.getItems({ filter: { chainId: item.context.chainId, address: pathInfo.token }})
        const tokenPrice = await this.pgDb.priceTable.getClosestPrice(tokenInfo.symbol, item.context.blockTimestamp)
        item.tokenPriceUsd = tokenPrice?.priceUsd
        const ethPrice = await this.pgDb.priceTable.getClosestPrice('ETH', item.context.blockTimestamp)
        item.ethPriceUsd = ethPrice?.priceUsd
      }

      item.transferBondedEvent = null
      if (bondedEvents.items.length > 0) {
        const eventItem = bondedEvents.items[0]
        eventItem.token = item.counterpartToken
        eventItem.tokenPriceUsd = item.tokenPriceUsd
        eventItem.ethPriceUsd = item.ethPriceUsd
        item.transferBondedEvent = this.normalizeEventForApi(eventItem)
      }
      return item
    })

    const explorerItems = await Promise.all(promises)

    return {
      items: explorerItems.map((item: any) => this.normalizeEventForApi(item)),
      hasNextPage
    }
  }

  async upsertPathInfoIfNotExists (item: any) {
    if (!item.toChainId && item.pathId) {
      let pathInfos = await this.pgDb.nonEventTables.Path.getItems({ filter: { pathId: item.pathId, chainId: item.context.chainId }})
      let pathInfo = pathInfos?.[0]
      if (!pathInfo) {
        pathInfo = await this.sdk.getRailsGateway(item.context.chainId).getPathInfo({ pathId: item.pathId })
        await this.pgDb.nonEventTables.Path.upsertItem({
          pathId: pathInfo.pathId,
          chainId: pathInfo.chainId,
          token: pathInfo.token,
          counterpartToken: pathInfo.counterpartToken,
          counterpartChainId: pathInfo.counterpartChainId
        })
      }

      pathInfos = await this.pgDb.nonEventTables.Path.getItems({ filter: { pathId: item.pathId, chainId: item.context.chainId }})
      pathInfo = pathInfos?.[0]
      if (!pathInfo) {
        throw new Error(`Path not found for pathId ${item.pathId}, chainId ${item.context.chainId}`)
      }

      item.toChainId = pathInfo.counterpartChainId
    }

    if (item.toChainId && item.pathId) {
      let pathInfos = await this.pgDb.nonEventTables.Path.getItems({ filter: { pathId: item.pathId, chainId: item.toChainId }})
      let pathInfo = pathInfos?.[0]
      if (!pathInfo) {
        pathInfo = await this.sdk.getRailsGateway(item.toChainId).getPathInfo({ pathId: item.pathId })
        await this.pgDb.nonEventTables.Path.upsertItem({
          pathId: pathInfo.pathId,
          chainId: pathInfo.chainId,
          token: pathInfo.token,
          counterpartToken: pathInfo.counterpartToken,
          counterpartChainId: pathInfo.counterpartChainId
        })
      }

      pathInfos = await this.pgDb.nonEventTables.Path.getItems({ filter: { pathId: item.pathId, chainId: item.toChainId }})
      pathInfo = pathInfos?.[0]
      if (!pathInfo) {
        throw new Error(`Path not found for pathId ${item.pathId}, chainId ${item.context.chainId}`)
      }
    }

    return item
  }

  async upsertTokenInfoIfNotExists (item: any) {
    if (!item.token && item.pathId) {
      const pathInfos = await this.pgDb.nonEventTables.Path.getItems({ filter: { pathId: item.pathId, chainId: item.context.chainId }})
      const pathInfo = pathInfos?.[0]
      if (!pathInfo) {
        throw new Error(`Path not found for pathId ${item.pathId}, chainId ${item.context.chainId}`)
      }

      const { token: tokenAddress, chainId } = pathInfo

      let tokenInfos = await this.pgDb.nonEventTables.Token.getItems({ filter: { chainId, address: tokenAddress }})
      let tokenInfo = tokenInfos?.[0]
      if (!tokenInfo) {
        tokenInfo = await this.sdk.getRailsGateway(chainId).getTokenInfo({ address: tokenAddress })
        await this.pgDb.nonEventTables.Token.upsertItem({
          chainId: tokenInfo.chainId,
          address: tokenInfo.address,
          name: tokenInfo.name,
          symbol: tokenInfo.symbol,
          decimals: tokenInfo.decimals
        })
      }

      tokenInfos = await this.pgDb.nonEventTables.Token.getItems({ filter: { chainId, address: tokenAddress }})
      tokenInfo = tokenInfos?.[0]
      if (!tokenInfo) {
        throw new Error(`Token not found for token ${item.token}, chainId ${chainId}`)
      }

      item.token = tokenInfo
    }

    if (!item.counterpartToken && item.pathId) {
      const pathInfos = await this.pgDb.nonEventTables.Path.getItems({ filter: { pathId: item.pathId, chainId: item.toChainId }})
      const pathInfo = pathInfos?.[0]
      if (!pathInfo) {
        throw new Error(`Path not found for pathId ${item.pathId}, chainId ${item.toChainId}`)
      }

      const { counterpartChainId, counterpartToken: counterpartTokenAddress } = pathInfo

      let tokenInfos = await this.pgDb.nonEventTables.Token.getItems({ filter: { chainId: counterpartChainId, address: counterpartTokenAddress }})
      let tokenInfo = tokenInfos?.[0]
      if (!tokenInfo) {
        tokenInfo = await this.sdk.getRailsGateway(counterpartChainId).getTokenInfo({ address: counterpartTokenAddress })
        await this.pgDb.nonEventTables.Token.upsertItem({
          chainId: tokenInfo.chainId,
          address: tokenInfo.address,
          name: tokenInfo.name,
          symbol: tokenInfo.symbol,
          decimals: tokenInfo.decimals
        })
      }

      tokenInfos = await this.pgDb.nonEventTables.Token.getItems({ filter: { chainId: counterpartChainId, address: counterpartTokenAddress }})
      tokenInfo = tokenInfos?.[0]
      if (!tokenInfo) {
        throw new Error(`Token not found for token ${item.token}, chainId ${counterpartChainId}`)
      }

      item.counterpartToken = tokenInfo
    }

    return item
  }

  addEventFields (item: any) {
    if (item.messageId) {
      item.messageIdTruncated = truncateString(item.messageId, 4)
    }
    if (item.checkpoint) {
      item.checkpointTruncated = truncateString(item.checkpoint, 4)
    }
    if (item.transferId) {
      item.transferIdTruncated = truncateString(item.transferId, 4)
      item.transferIdExplorerUrl = `https://v2-explorer.hop.exchange/t/${item.transferId}` // TODO: subdomain env var
    }
    if (item.claimId ) {
      item.claimIdTruncated = truncateString(item.claimId, 4)
      item.claimIdExplorerUrl = `https://v2-explorer.hop.exchange/t/${item.claimId}` // TODO: subdomain env var
    }
    if (item.pathId) {
      item.pathIdTruncated = truncateString(item.pathId, 4)
    }
    if (item.bundleId) {
      item.bundleIdTruncated = truncateString(item.bundleId, 4)
    }
    if (item.bundleRoot) {
      item.bundleRootTruncated = truncateString(item.bundleRoot, 4)
    }
    if (item.attestedClaimId) {
      item.attestedClaimIdTruncated = truncateString(item.attestedClaimId, 4)
    }
    if (item.relayer) {
      item.relayerTruncated = truncateString(item.relayer, 4)
    }
    if (item.from) {
      item.fromTruncated = truncateString(item.from, 4)
    }
    if (item.to) {
      item.toTruncated = truncateString(item.to, 4)
      if (item.toChainId) {
        item.toExplorerUrl = this.sdk.utils.getAddressExplorerUrl(item.to, item.toChainId)
      }
    }
    if (item.chainId) {
      item.chainName = chainNames[item.chainId]
      item.chainLabel = getChainLabel(item.chainId)
    }
    if (item.fromChainId) {
      item.fromChainName = chainNames[item.fromChainId]
      item.fromChainLabel = getChainLabel(item.fromChainId)
      item.fromChainImageUrl = this.sdk.utils.getLogoForChainId(item.fromChainId)
    }
    if (item.toChainId) {
      item.toChainName = chainNames[item.toChainId]
      item.toChainLabel = getChainLabel(item.toChainId)
      item.toChainImageUrl = this.sdk.utils.getLogoForChainId(item.toChainId)
      item.toChainColor = this.sdk.getColorForChainId(item.toChainId)
    }
    if (item.bundleFees) {
      item.bundleFeesDisplay = formatUnits(item.bundleFees, 18)
    }
    if (item.token?.address) {
      item.token.tokenExplorerUrl = this.sdk.utils.getTokenExplorerUrl(item.token.address, item.token.chainId)
    }
    if (item.token?.symbol) {
      item.token.imageUrl = this.sdk.utils.getLogoForTokenSymbol(item.token.symbol)
    }
    if (item.counterpartToken?.address) {
      item.counterpartToken.tokenExplorerUrl = this.sdk.utils.getTokenExplorerUrl(item.counterpartToken.address, item.counterpartToken.chainId)
    }
    if (item.amount != null && item.token) {
      item.amountFormatted = formatUnits(item.amount, item.token.decimals)
      item.amountDisplay = `${item.amountFormatted} ${item.token.symbol}`
    }
    if (item.amount != null && item.amountFormatted && item.tokenPriceUsd) {
      item.amountUsd = Number(item.amountFormatted) * Number(item.tokenPriceUsd)
      item.amountUsdDisplay = `${formatToUSD(item.amountUsd.toFixed(2))} USD`
    }
    if (item.amountOut != null && item.token) {
      item.amountOutFormatted = formatUnits(item.amountOut, item.token.decimals)
      item.amountOutDisplay = `${item.amountOutFormatted} ${item.token.symbol}`
    }
    if (item.amountOut != null && item.amountOutFormatted != null && item.tokenPriceUsd != null) {
      item.amountOutUsd = Number(item.amountOutFormatted) * Number(item.tokenPriceUsd)
      item.amountOutUsdDisplay = `${formatToUSD(item.amountOutUsd.toFixed(2))} USD`
    }
    if (item.attestationFee != null) {
      item.attestationFeeFormatted = formatUnits(item.attestationFee, 18)
      item.attestationFeeDisplay = `${item.attestationFeeFormatted} ETH`
    }
    if (item.attestationFee != null && item.attestationFeeFormatted != null && item.ethPriceUsd != null) {
      item.attestationFeeUsd = Number(item.attestationFeeFormatted) * Number(item.ethPriceUsd)
      item.attestationFeeUsdDisplay = `${formatToUSD(item.attestationFeeUsd.toFixed(2))} USD`
    }
    if (item.nextHops) {
      item.nextHops = item.nextHops.map((item: any) => this.addEventFields(item))
    }
    if (item.hops) {
      item.hops = item.hops.map((item: any) => this.addEventFields(item))
    }
    // nextHops
    if (item.maxBonderFee) {
      item.maxBonderFee = item.maxBonderFee.toString()
    }
    if (item.maxTotalSent) {
      item.maxTotalSent = item.maxTotalSent.toString()
    }
    if (item.context?.blockTimestamp) {
      item.context.blockTimestampRelative = DateTime.fromSeconds(item.context.blockTimestamp).toRelative()
    }
    if (item.context?.transactionHash) {
      item.context.transactionHashTruncated = truncateString(item.context.transactionHash, 4)
      item.context.transactionHashExplorerUrl = this.sdk.utils.getTransactionHashExplorerUrl(item.context.transactionHash, item.context.chainId)
    }
    if (item.context?.chainId) {
      item.context.chainName = chainNames[item.context.chainId]
      item.context.chainLabel = getChainLabel(item.context.chainId)
      item.context.chainImageUrl = this.sdk.utils.getLogoForChainId(item.context.chainId)
      item.context.chainColor = this.sdk.getColorForChainId(item.context.chainId)
    }
    if (item.context?.from) {
      if (item.context?.chainId) {
        item.context.fromExplorerUrl = this.sdk.utils.getAddressExplorerUrl(item?.context.from, item.context.chainId)
      }
    }
    if (item.context?.to) {
      if (item.context?.chainId) {
        item.context.toExplorerUrl = this.sdk.utils.getAddressExplorerUrl(item?.context.to, item.context.chainId)
      }
    }
    if (item.context?.value != null) {
      item.context.valueFormatted = formatUnits(item.context.value, 18)
      item.context.valueDisplay = `${item.context.valueFormatted} ETH`
    }
    if (item.context?.value != null && item.context?.valueFormatted != null && item.ethPriceUsd != null) {
      item.context.valueUsd = Number(item.context.valueFormatted) * Number(item.ethPriceUsd)
      item.context.valueUsdDisplay = `${formatToUSD(item.context.valueUsd.toFixed(2))} USD`
    }

    return item
  }

  normalizeEventForApi (event: any) {
    if (!event) {
      return event
    }
    event = this.addEventFields(event)
    for (const key in event) {
      if (BigNumber.isBigNumber(event[key])) {
        event[key] = event[key].toString()
      }
    }
    return event
  }

  async getPathsForApi (input: PathsApiInput): Promise<EventsResult> {
    const { limit = 10, page = 1 } = input
    const filter = this.normalizeFilters(input.filter)

    const items = await this.pgDb.nonEventTables.Path.getItems({ limit, filter, page })
    const itemsNext = await this.pgDb.nonEventTables.Path.getItems({ limit, filter, page: Number(page) + 1 })
    const hasNextPage = itemsNext.length > 0

    return {
      items: items.map((item: any) => this.addPathFields(item)),
      hasNextPage
    }
  }

  async getTokensForApi (input: TokensApiInput): Promise<EventsResult> {
    const { limit = 10, page = 1 } = input
    const filter = this.normalizeFilters(input.filter)

    const items = await this.pgDb.nonEventTables.Token.getItems({ limit, filter, page })
    const itemsNext = await this.pgDb.nonEventTables.Token.getItems({ limit, filter, page: Number(page) + 1 })
    const hasNextPage = itemsNext.length > 0

    return {
      items: items.map((item: any) => this.addTokenFields(item)),
      hasNextPage
    }
  }

  async getTokenPricesForApi (input: TokensApiInput): Promise<EventsResult> {
    const { limit = 10, page = 1 } = input
    const filter = this.normalizeFilters(input.filter)

    const items = await this.pgDb.priceTable.getItems({ limit, filter, page })
    const itemsNext = await this.pgDb.priceTable.getItems({ limit, filter, page: Number(page) + 1 })
    const hasNextPage = itemsNext.length > 0

    return {
      items: items.map((item: any) => this.addTokenPriceFields(item)),
      hasNextPage
    }
  }

  addTokenFields (item: any) {
    if (item.chainId && item.address) {
      try {
        item.tokenExplorerUrl = this.sdk.utils.getTokenExplorerUrl(item.address, item.chainId)
      } catch (err) {
        console.error(err)
        item.tokenExplorerUrl = ''
      }
      item.addressTruncated = truncateString(item.address, 4)
    }
    if (item.chainId) {
      item.chainName = chainNames[item.chainId] ?? ''
      item.chainLabel = getChainLabel(item.chainId)
    }
    return item
  }

  addPathFields (item: any) {
    if (item.pathId) {
      item.pathIdTruncated = truncateString(item.pathId, 4)
    }
    if (item.token) {
      try {
        item.tokenExplorerUrl = this.sdk.utils.getTokenExplorerUrl(item.token, item.chainId)
      } catch (err) {
        console.error(err)
        item.tokenExplorerUrl = ''
      }
      item.tokenTruncated = truncateString(item.token, 4)
    }
    if (item.counterpartToken) {
      try {
        item.counterpartTokenExplorerUrl = this.sdk.utils.getTokenExplorerUrl(item.counterpartToken, item.counterpartChainId)
      } catch (err: any) {
        console.error(err)
        item.counterpartTokenExplorerUrl = ''
      }
      item.counterpartTokenTruncated = truncateString(item.counterpartToken, 4)
    }
    if (item.chainId) {
      item.chainName = chainNames[item.chainId] ?? ''
      item.chainLabel = getChainLabel(item.chainId)
    }
    if (item.counterpartChainId) {
      item.counterpartChainName = chainNames[item.counterpartChainId] ?? ''
      item.counterpartChainLabel = getChainLabel(item.counterpartChainId)
    }

    return item
  }

  addTokenPriceFields (item: any) {
    if (item.priceUsd != null) {
      item.priceUsdDisplay = `${formatToUSD(item.priceUsd.toFixed(2))} USD`
    }
    if (item.timestamp) {
      item.timestampRelative = DateTime.fromSeconds(item.timestamp).toRelative()
    }
    return item
  }

  normalizeFilters(filters: any) {
    if (!filters) {
      return {}
    }

    if (filters.eventChainId) {
      filters.eventChainId = filters.eventChainId.toString().trim()
    }
    if (filters.chainId) {
      filters.chainId = filters.chainId.toString().trim()
    }
    if (filters.fromChainId) {
      filters.fromChainId = filters.fromChainId.toString().trim()
    }
    if (filters.toChainId) {
      filters.toChainId = filters.toChainId.toString().trim()
    }
    if (filters.token) {
      filters.token = filters.token.trim()
      if (filters.token.startsWith('0x')) {
        filters.token = checksumAddress(filters.token)
      }
    }
    if (filters.counterpartToken) {
      filters.counterpartToken = checksumAddress(filters.counterpartToken.trim())
    }
    if (filters.pathId) {
      filters.pathId = filters.pathId.trim()
    }
    if (filters.transferId) {
      filters.transferId = filters.transferId.trim()
    }
    if (filters.claimId ) {
      filters.claimId = filters.claimId.trim()
    }
    if (filters.messageId) {
      filters.messageId = filters.messageId.trim()
    }
    if (filters.bundleId) {
      filters.bundleId = filters.bundleId.trim()
    }
    if (filters.bundleRoot) {
      filters.bundleRoot = filters.bundleRoot.trim()
    }
    if (filters.transactionHash) {
      filters.transactionHash = filters.transactionHash.trim()
    }
    if (filters.attestedClaimId) {
      filters.attestedClaimId = filters.attestedClaimId.trim()
    }
    if (filters.relayer) {
      filters.relayer = checksumAddress(filters.relayer.trim())
    }
    if (filters.from) {
      filters.from = checksumAddress(filters.from.trim())
    }
    if (filters.to) {
      filters.to = checksumAddress(filters.to.trim())
    }
    if (filters.address) {
      filters.address = checksumAddress(filters.address.trim())
    }
    if (filters.account) {
      filters.account = checksumAddress(filters.account.trim())
    }
    if (filters.recipient) {
      filters.recipient = checksumAddress(filters.recipient.trim())
    }
    if (filters.symbol) {
      filters.symbol = filters.symbol.trim()
    }

    return filters
  }
}
