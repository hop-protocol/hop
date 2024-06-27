import { BigNumber, utils } from 'ethers'
import { DateTime } from 'luxon'
import { db } from '#db/index.js'
import { Hop } from '@hop-protocol/v2-sdk'
import { pgDb } from '#pgDb/index.js'
import { truncateString } from '#utils/truncateString.js'
import { chainNames, network, rpcUrls } from '#config/index.js'

type EventsResult = {
  items: any[]
  hasNextPage?: boolean
}

type EventsApiInput = {
  eventName: string
  limit?: number
  lastKey?: string | null
  firstKey?: string | null
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
      network
    })
    this.sdk.setChainRpcProviderUrls(rpcUrls)
    // console.log(this.sdk.chainProviders)
  }

  async getEventsForApi (input: EventsApiInput): Promise<EventsResult> {
    const { eventName, limit = 10, filter, page = 1 } = input

    const { items, hasNextPage } = await this.getEvents({ eventName, limit, page, filter })

    return {
      items: items.map((item: any) => this.normalizeEventForApi(item)),
      hasNextPage
    }
  }

  async getEvents (input: any): Promise<any> {
    const { eventName, limit = 10, filter, page = 1 } = input

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
    const { limit = 10, filter, page } = input

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
    const { limit = 10, filter, page } = input

    const { items, hasNextPage } = await this.getEvents({ limit, filter, eventName: 'TransferSent', page })

    const promises = items.map(async (item: any) => {
      const { transferId } = item
      const bondedEvents  = await this.getEvents({
        eventName: 'TransferBonded',
        filter: {
          transferId
        }
      })

      await this.upsertPathInfoIfNotExists(item)
      await this.upsertTokenInfoIfNotExists(item)

      item.transferBondedEvent = null
      if (bondedEvents.items.length > 0) {
        item.transferBondedEvent = bondedEvents.items[0]
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
      let pathInfos = await this.pgDb.nonEventTables.Path.getItems({ filter: { pathId: item.pathId }})
      let pathInfo = pathInfos?.[0]
      if (!pathInfo) {
        pathInfo = await this.sdk.railsGateway.getPathInfo({ chainId: item.context.chainId, pathId: item.pathId })
        await this.pgDb.nonEventTables.Path.upsertItem({
          pathId: pathInfo.pathId,
          chainId: pathInfo.chainId,
          token: pathInfo.token,
          counterpartToken: pathInfo.counterpartToken,
          counterpartChainId: pathInfo.counterpartChainId
        })
      }

      pathInfos = await this.pgDb.nonEventTables.Path.getItems({ filter: { pathId: item.pathId }})
      pathInfo = pathInfos?.[0]
      if (!pathInfo) {
        throw new Error(`Path not found for pathId ${item.pathId}`)
      }

      if (item.chainId === pathInfo.chainId) {
        item.toChainId = pathInfo.counterpartChainId
      } else {
        item.toChainId = pathInfo.chainId
      }
    }

    return item
  }

  async upsertTokenInfoIfNotExists (item: any) {
    if (!item.token && item.pathId) {
      const pathInfos = await this.pgDb.nonEventTables.Path.getItems({ filter: { pathId: item.pathId }})
      const pathInfo = pathInfos?.[0]
      if (!pathInfo) {
        throw new Error(`Path not found for pathId ${item.pathId}`)
      }

      const { token: tokenAddress, chainId } = pathInfo

      let tokenInfos = await this.pgDb.nonEventTables.Token.getItems({ filter: { chainId, address: tokenAddress }})
      let tokenInfo = tokenInfos?.[0]
      if (!tokenInfo) {
        tokenInfo = await this.sdk.railsGateway.getTokenInfo({ chainId, address: tokenAddress })
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
        throw new Error(`Token not found for token ${item.token}`)
      }

      item.token = tokenInfo
    }

    if (!item.counterpartToken && item.pathId) {
      const pathInfos = await this.pgDb.nonEventTables.Path.getItems({ filter: { pathId: item.pathId }})
      const pathInfo = pathInfos?.[0]
      if (!pathInfo) {
        throw new Error(`Path not found for pathId ${item.pathId}`)
      }

      const { counterpartChainId, counterpartToken: counterpartTokenAddress } = pathInfo

      let tokenInfos = await this.pgDb.nonEventTables.Token.getItems({ filter: { chainId: counterpartChainId, address: counterpartTokenAddress }})
      let tokenInfo = tokenInfos?.[0]
      if (!tokenInfo) {
        tokenInfo = await this.sdk.railsGateway.getTokenInfo({ chainId: counterpartChainId, address: counterpartTokenAddress })
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
        throw new Error(`Token not found for token ${item.token}`)
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
    }
    if (item.bundleId) {
      item.bundleIdTruncated = truncateString(item.bundleId, 4)
    }
    if (item.bundleRoot) {
      item.bundleRootTruncated = truncateString(item.bundleRoot, 4)
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
      item.chainLabel = `${item.chainId} - ${chainNames[item.chainId]}`
    }
    if (item.fromChainId) {
      item.fromChainName = chainNames[item.fromChainId]
      item.fromChainLabel = `${item.fromChainId} - ${chainNames[item.fromChainId]}`
      item.fromChainImageUrl = this.sdk.utils.getLogoForChainId(item.fromChainId)
    }
    if (item.toChainId) {
      item.toChainName = chainNames[item.toChainId]
      item.toChainLabel = `${item.toChainId} - ${chainNames[item.toChainId]}`
      item.toChainImageUrl = this.sdk.utils.getLogoForChainId(item.toChainId)
    }
    if (item.bundleFees) {
      item.bundleFeesDisplay = utils.formatUnits(item.bundleFees, 18)
    }
    if (item.context?.blockTimestamp) {
      item.context.blockTimestampRelative = DateTime.fromSeconds(item.context.blockTimestamp).toRelative()
    }
    if (item.context?.transactionHash) {
      item.context.transactionHashTruncated = truncateString(item.context.transactionHash, 4)
      item.context.transactionHashExplorerUrl = this.sdk.utils.getTransactionHashExplorerUrl(item.context.transactionHash, item.context.chainId)
    }
    if (item.token?.address) {
      item.token.tokenExplorerUrl = this.sdk.utils.getTokenExplorerUrl(item.token.address, item.token.chainId)
    }
    if (item.counterpartToken?.address) {
      item.counterpartToken.tokenExplorerUrl = this.sdk.utils.getTokenExplorerUrl(item.counterpartToken.address, item.counterpartToken.chainId)
    }
    if (item.context?.chainId) {
      item.context.chainName = chainNames[item.context.chainId]
      item.context.chainLabel = `${item.context.chainId} - ${chainNames[item.context.chainId]}`
      item.context.chainImageUrl = this.sdk.utils.getLogoForChainId(item.context.chainId)
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
}
