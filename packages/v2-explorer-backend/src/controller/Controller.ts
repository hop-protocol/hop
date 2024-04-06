import { BigNumber } from 'ethers'
import { DateTime } from 'luxon'
import { db } from '../db'
import { formatUnits } from 'ethers/lib/utils'
import { getTransactionHashExplorerUrl } from 'src/utils/getTransactionHashExplorerUrl'
import { pgDb } from '../pgDb'
import { truncateString } from '../utils/truncateString'

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

  async getEventsForApi (input: EventsApiInput): Promise<EventsResult> {
    const { eventName, limit = 10, filter, page = 1 } = input

    const { items, hasNextPage } = await this.getEvents({ eventName, limit, page, filter })

    const chainNames: any = {
      1: 'Ethereum (Mainnet)',
      10: 'Optimism (Mainnet)',
      420: 'Optimism (Goerli)',
      5: 'Ethereum (Goerli)'
    }

    for (const item of items) {
      if (item.messageId) {
        item.messageIdTruncated = truncateString(item.messageId, 4)
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
      }
      if (item.chainId) {
        item.chainName = chainNames[item.chainId]
        item.chainLabel = `${item.chainId} - ${chainNames[item.chainId]}`
      }
      if (item.fromChainId) {
        item.fromChainName = chainNames[item.fromChainId]
        item.fromChainLabel = `${item.fromChainId} - ${chainNames[item.fromChainId]}`
      }
      if (item.toChainId) {
        item.toChainName = chainNames[item.toChainId]
        item.toChainLabel = `${item.toChainId} - ${chainNames[item.toChainId]}`
      }
      if (item.bundleFees) {
        item.bundleFeesDisplay = formatUnits(item.bundleFees, 18)
      }
      if (item.context?.blockTimestamp) {
        item.context.blockTimestampRelative = DateTime.fromSeconds(item.context.blockTimestamp).toRelative()
      }
      if (item.context?.transactionHash) {
        item.context.transactionHashTruncated = truncateString(item.context.transactionHash, 4)
        item.context.transactionHashExplorerUrl = getTransactionHashExplorerUrl(item.context.transactionHash, item.context.chainId)
      }
      if (item.context?.chainId) {
        item.context.chainName = chainNames[item.context.chainId]
        item.context.chainLabel = `${item.context.chainId} - ${chainNames[item.context.chainId]}`
      }
    }

    return {
      items: items.map(this.normalizeEventForApi),
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

    const chainNames: any = {
      1: 'Ethereum (Mainnet)',
      10: 'Optimism (Mainnet)',
      420: 'Optimism (Goerli)',
      5: 'Ethereum (Goerli)'
    }

    for (const item of items) {
      if (item.messageId) {
        item.messageIdTruncated = truncateString(item.messageId, 4)
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
      }
      if (item.chainId) {
        item.chainName = chainNames[item.chainId]
        item.chainLabel = `${item.chainId} - ${chainNames[item.chainId]}`
      }
      if (item.fromChainId) {
        item.fromChainName = chainNames[item.fromChainId]
        item.fromChainLabel = `${item.fromChainId} - ${chainNames[item.fromChainId]}`
      }
      if (item.toChainId) {
        item.toChainName = chainNames[item.toChainId]
        item.toChainLabel = `${item.toChainId} - ${chainNames[item.toChainId]}`
      }
      if (item.bundleFees) {
        item.bundleFeesDisplay = formatUnits(item.bundleFees, 18)
      }
      if (item.context?.blockTimestamp) {
        item.context.blockTimestampRelative = DateTime.fromSeconds(item.context.blockTimestamp).toRelative()
      }
      if (item.context?.transactionHash) {
        item.context.transactionHashTruncated = truncateString(item.context.transactionHash, 4)
        item.context.transactionHashExplorerUrl = getTransactionHashExplorerUrl(item.context.transactionHash, item.context.chainId)
      }
      if (item.context?.chainId) {
        item.context.chainName = chainNames[item.context.chainId]
        item.context.chainLabel = `${item.context.chainId} - ${chainNames[item.context.chainId]}`
      }
    }

    return {
      items: items.map(this.normalizeEventForApi),
      hasNextPage
    }
  }

  async getExplorerEventsForApi (input: any): Promise<any> {
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
      items: explorerItems,
      hasNextPage
    }
  }

  normalizeEventForApi (event: any) {
    for (const key in event) {
      if (BigNumber.isBigNumber(event[key])) {
        event[key] = event[key].toString()
      }
    }
    return event
  }
}
