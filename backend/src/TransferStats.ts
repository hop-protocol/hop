import { ethers, Contract, providers, BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { DateTime } from 'luxon'
import Db, { getInstance } from './Db'
import { chunk } from 'lodash'
import wait from 'wait'
import { mainnet as addresses } from '@hop-protocol/core/addresses'
import l2BridgeAbi from '@hop-protocol/core/abi/generated/L2_Bridge.json'
import l1BridgeAbi from '@hop-protocol/core/abi/generated/L1_Bridge.json'
import { enabledChains, enabledTokens, rpcUrls, isGoerli, integrations } from './config'
import { getTokenDecimals } from './utils/getTokenDecimals'
import { chainIdToSlug } from './utils/chainIdToSlug'
import { chainSlugToName } from './utils/chainSlugToName'
import { chainSlugToId } from './utils/chainSlugToId'
import { populateTransfer } from './utils/populateTransfer'
import { getPriceHistory } from './price'
import {
  fetchTransfers,
  fetchTransfersForTransferId,
  fetchBondTransferIdEvents,
  fetchTransferBonds,
  fetchWithdrews,
  fetchTransferFromL1Completeds,
  fetchTransferEventsByTransferIds
} from './theGraph'
import { getPreRegenesisBondEvent, bridgeAbi } from './preregenesis'
import { populateData } from './populateData'
import { cache } from './cache'

const cacheDurationMs = isGoerli ? 60 * 1000 : 6 * 60 * 60 * 1000

type Options = {
  days?: number
  offsetDays?: number
}

export class TransferStats {
  db : Db = getInstance()
  regenesis = false
  prices: any = {}
  days = 0
  offsetDays = 0
  ready = false
  shouldCheckIntegrationPartner = true
  shouldCheckReceivedHTokens = true

  constructor (options: Options = {}) {
    if (options.days) {
      this.days = options.days
    }
    if (options.offsetDays) {
      this.offsetDays = options.offsetDays
    }
    console.log('days', this.days)
    console.log('offsetDays', this.offsetDays)
    process.once('uncaughtException', async err => {
      console.error('uncaughtException:', err)
      this.cleanUp()
      process.exit(0)
    })

    process.once('SIGINT', () => {
      this.cleanUp()
    })

    this.init()
      .catch((err: any) => console.error('init error', err))
      .then(() => console.log('init done'))
  }

  protected async tilReady (): Promise<boolean> {
    if (this.ready) {
      return true
    }

    await wait(100)
    return await this.tilReady()
  }

  cleanUp () {
    // console.log('closing db')
    // this.db.close()
  }

  async init () {
    await this.initPrices()
    this.ready = true

    wait(30 * 60 * 1000).then(() => {
      this.pollPrices()
    })
  }

  async pollPrices () {
    while (true) {
      try {
        await this.initPrices()
      } catch (err) {
        console.error('prices error:', err)
      }
      await wait(30 * 60 * 1000)
    }
  }

  async initPrices (daysN = 365) {
    console.log('fetching prices')

    const prices: any = {}

    for (const tokenSymbol of enabledTokens) {
      console.log('fetching price', tokenSymbol)
      prices[tokenSymbol] = await getPriceHistory(tokenSymbol, daysN)
    }

    console.log('done fetching prices')

    this.prices = prices
  }

  async trackTransfers () {
    await this.tilReady()
    console.log('upserting prices')
    for (const token in this.prices) {
      for (const data of this.prices[token]) {
        const price = data[1]
        const timestamp = data[0]
        try {
          await this.db.upsertPrice(token, price, timestamp)
        } catch (err) {
          if (!(err.message.includes('UNIQUE constraint failed') || err.message.includes('duplicate key value violates unique constraint'))) {
            throw err
          }
        }
      }
    }

    console.log('done upserting prices')
    let promises: any[] = []

    if (isGoerli) {
      promises = [
        this.trackRecentTransfers({ lookbackMinutes: 20, pollIntervalMs: 2 * 60 * 1000 }),
        this.trackRecentTransfers({ lookbackMinutes: 60, pollIntervalMs: 10 * 60 * 1000 }),
        this.trackRecentTransferBonds({ lookbackMinutes: 10, pollIntervalMs: 3 * 60 * 1000 }),
        this.trackRecentTransferBonds({ lookbackMinutes: 60, pollIntervalMs: 10 * 60 * 1000 }),
        this.trackDailyTransfers({ days: this.days, offsetDays: this.offsetDays })
      ]
    } else {
      promises = [
        this.trackReceivedHTokenStatus(),
        this.checkForReorgs(),
        // this.trackReceivedAmountStatus(), // needs to be fixed
        this.trackRecentTransfers({ lookbackMinutes: 60, pollIntervalMs: 60 * 1000 }),
        this.trackRecentTransfers({ lookbackMinutes: 4 * 60, pollIntervalMs: 60 * 60 * 1000 }),
        this.trackRecentTransferBonds({ lookbackMinutes: 20, pollIntervalMs: 60 * 1000 }),
        this.trackRecentTransferBonds({ lookbackMinutes: 120, pollIntervalMs: 10 * 60 * 1000 }),
        this.trackDailyTransfers({ days: this.days, offsetDays: this.offsetDays })
      ]
    }

    await Promise.all(promises)
  }

  async checkForReorgs () {
    while (true) {
      try {
        const page = 0
        const perPage = 100
        const endTimestamp = DateTime.now().toUTC().minus({ hour: 1 })
        const startTimestamp = endTimestamp.toUTC().minus({ hour: 1 })
        const items = await this.db.getTransfers({
          perPage,
          page,
          startTimestamp: startTimestamp.toSeconds(),
          endTimestamp: endTimestamp.toSeconds(),
          sortBy: 'timestamp',
          sortDirection: 'desc',
          bonded: false
        })
        const transfers = items.map(populateData)

        const allIds = transfers.filter((x: any) => x.sourceChainSlug !== 'ethereum').map((x: any) => x.transferId)

        const enabledChainTransfers = await Promise.all(enabledChains.map((chain: string) => {
          return fetchTransferEventsByTransferIds(chain, allIds)
        }))

        const events = enabledChainTransfers.flat()

        const found = {}
        for (const transferId of allIds) {
          found[transferId] = false
        }

        for (const transferId of allIds) {
          for (const event of events) {
            if (event.transferId === transferId) {
              found[transferId] = true
            }
          }
        }

        for (const transferId in found) {
          const notFound = !found[transferId]
          if (notFound) {
            console.log(`Possible reorg: transferId ${transferId} not found from TransferSent event`)
            await this.updateTransferReorged(transferId, true)
            console.log('updated reorg status:', transferId)
          }
        }
      } catch (err: any) {
        console.error('checkForReorgs error:', err)
      }
      await wait(60 * 60 * 1000)
    }
  }

  async updateTransferReorged (transferId: string, reorged: boolean) {
    try {
      await this.db.updateTransferReorged(transferId, reorged)
    } catch (err: any) {
      console.error('updateTransferReorged error:', err)
    }
  }

  async getReceivedHtokens (item: any, refetch = false) {
    if (isGoerli) {
      return false
    }
    const cacheKey = `receivedHTokens:${item.transferId}`
    const cached = cache.get(cacheKey)
    try {
      if (typeof cached === 'boolean') {
        return cached
      }
      const { bondTransactionHash, token, sourceChainSlug, destinationChainSlug, receivedHTokens } = item
      if (
        !bondTransactionHash ||
        !destinationChainSlug
      ) {
        return null
      }
      if (
        destinationChainSlug === 'ethereum' ||
        token === 'HOP'
      ) {
        return false
      }
      if (typeof receivedHTokens === 'boolean' && !refetch) {
        cache.put(cacheKey, receivedHTokens, cacheDurationMs)
        return receivedHTokens
      }
      const rpcUrl = rpcUrls[destinationChainSlug]
      if (!rpcUrl) {
        throw new Error(`rpc url not found for "${destinationChainSlug}"`)
      }
      const provider = new providers.StaticJsonRpcProvider(rpcUrl)
      const receipt = await this.getTransactionReceipt(provider, bondTransactionHash)
      const transferTopic = '0xddf252ad'

      if (sourceChainSlug === 'ethereum' || destinationChainSlug !== 'ethereum') {
        for (const log of receipt.logs) {
          const topic = log.topics[0]
          if (topic.startsWith(transferTopic)) {
            const hTokenAddress = addresses?.bridges?.[token]?.[destinationChainSlug]?.l2HopBridgeToken
            if (hTokenAddress?.toLowerCase() === log.address?.toLowerCase() && item.recipientAddress) {
              if (log.topics[2].includes(item.recipientAddress?.toLowerCase().slice(2))) {
                cache.put(cacheKey, true, cacheDurationMs)
                return true
              }
            }
          }
        }
        cache.put(cacheKey, false, cacheDurationMs)
        return false
      } else {
        const receivedHTokens = receipt.logs.length === 8
        cache.put(cacheKey, receivedHTokens, cacheDurationMs)
        return receivedHTokens
      }
    } catch (err) {
      console.error('getReceivedHtokens error:', err)
      return null
    }
  }

  async trackReceivedHTokenStatus () {
    let page = 0
    while (true) {
      try {
        const now = DateTime.now().toUTC()
        const startTimestamp = Math.floor(now.minus({ hours: 6 }).toSeconds())
        const endTimestamp = Math.floor(now.toSeconds())
        const perPage = 100
        const items = await this.db.getTransfers({
          perPage,
          page,
          receivedHTokens: null,
          bonded: true,
          startTimestamp,
          endTimestamp,
          sortBy: 'timestamp',
          sortDirection: 'desc'
        })
        if (items.length === perPage) {
          page++
        } else {
          page = 0
          await wait(60 * 1000)
        }
        console.log('items to check for receivedHTokens:', items.length)
        if (!items.length) {
          page = 0
          await wait(60 * 1000)
          continue
        }

        const transfers = items.map(populateData)
        const chunkSize = 10
        const allChunks = chunk(transfers, chunkSize)
        for (const chunks of allChunks) {
          await Promise.all(chunks.map(async (item: any) => {
            if (
              !item.bondTransactionHash ||
              !item.destinationChainSlug ||
              item.destinationChainSlug === 'ethereum'
            ) {
              return
            }
            const receivedHTokens = await this.getReceivedHtokens(item)
            item.receivedHTokens = receivedHTokens
            await this.upsertItem(item)
          }))
        }
      } catch (err) {
        console.error(err)
      }
    }
  }

  async getReceivedAmount (item: any) {
    if (isGoerli) {
      return null
    }
    try {
      const { bondTransactionHash, token, destinationChainSlug } = item
      if (item.amountReceived && item.amountReceivedFormatted) {
        return {
          amountReceived: item.amountReceived,
          amountReceivedFormatted: item.amountReceivedFormatted
        }
      }
      if (
        !(bondTransactionHash && destinationChainSlug)
      ) {
        return null
      }
      const rpcUrl = rpcUrls[destinationChainSlug]
      if (!rpcUrl) {
        throw new Error(`rpc url not found for "${destinationChainSlug}"`)
      }
      const provider = new providers.StaticJsonRpcProvider(rpcUrl)
      const receipt = await this.getTransactionReceipt(provider, bondTransactionHash)
      const transferTopic = '0xddf252ad'

      let amount = BigNumber.from(0)
      for (const log of receipt.logs) {
        const topic = log.topics[0]
        if (topic.startsWith(transferTopic)) {
          if (log.topics[2].includes(item.recipientAddress?.toLowerCase().slice(2))) {
            let canonicalTokenAddress = addresses?.bridges?.[token]?.[destinationChainSlug]?.l2CanonicalToken
            if (destinationChainSlug === 'ethereum') {
              canonicalTokenAddress = addresses?.bridges?.[token]?.[destinationChainSlug]?.l1CanonicalToken
            }
            if (canonicalTokenAddress?.toLowerCase() === log.address?.toLowerCase()) {
              amount = BigNumber.from(log.data)
            }
          }
        }
      }

      if (amount.eq(0) && destinationChainSlug !== 'ethereum') {
        for (const log of receipt.logs) {
          const topic = log.topics[0]
          if (topic.startsWith(transferTopic)) {
            if (log.topics[2].includes(item.recipientAddress?.toLowerCase().slice(2))) {
              const hTokenAddress = addresses?.bridges?.[token]?.[destinationChainSlug]?.l2HopBridgeToken
              if (hTokenAddress?.toLowerCase() === log.address?.toLowerCase()) {
                amount = BigNumber.from(log.data)
              }
            }
          }
        }
      }

      if (amount.gt(0)) {
        const amountReceived = amount.toString()
        const decimals = getTokenDecimals(item.token)
        const amountReceivedFormatted = Number(formatUnits(amountReceived, decimals))
        return { amountReceived, amountReceivedFormatted }
      }

      return null
    } catch (err) {
      console.error(err)
      return null
    }
  }

  async trackReceivedAmountStatus () {
    let page = 0
    while (true) {
      try {
        const now = DateTime.now().toUTC()
        const startTimestamp = Math.floor(now.minus({ hours: 6 }).toSeconds())
        const endTimestamp = Math.floor(now.toSeconds())
        const perPage = 100
        const items = await this.db.getTransfers({
          perPage,
          page,
          amountReceived: null,
          startTimestamp,
          endTimestamp,
          sortBy: 'timestamp',
          sortDirection: 'desc'
        })
        if (items.length === perPage) {
          page++
        } else {
          page = 0
          await wait(60 * 1000)
        }
        console.log('items to check for amountReceived:', items.length)
        if (!items.length) {
          page = 0
          await wait(60 * 1000)
          continue
        }

        const transfers = items.map(populateData)
        const chunkSize = 10
        const allChunks = chunk(transfers, chunkSize)
        for (const chunks of allChunks) {
          await Promise.all(chunks.map(async (item: any) => {
            if (
              !item.bondTransactionHash ||
              !item.destinationChainSlug
            ) {
              return
            }
            const data: any = await this.getReceivedAmount(item)
            if (data) {
              const { amountReceived, amountReceivedFormatted } = data
              item.amountReceived = amountReceived
              item.amountReceivedFormatted = amountReceivedFormatted
              await this.upsertItem(item)
            }
          }))
        }
      } catch (err) {
        console.error(err)
      }
    }
  }

  async trackRecentTransfers ({ lookbackMinutes, pollIntervalMs }: { lookbackMinutes: number, pollIntervalMs: number }) {
    await this.tilReady()
    while (true) {
      try {
        console.log('tracking recent transfers, minutes: ', lookbackMinutes)
        const now = DateTime.now().toUTC()
        const startTime = Math.floor(now.minus({ minute: lookbackMinutes }).toSeconds())
        const endTime = Math.floor(now.toSeconds())

        console.log('fetching all transfers data for hour', startTime)
        const items = await this.getTransfersBetweenDates(startTime, endTime)
        console.log('recentTransfers items:', items.length, 'minutes:', lookbackMinutes)
        for (const item of items) {
          let retries = 0
          while (retries < 5) {
            try {
              await this.upsertItem(item)
              break
            } catch (err: any) {
              console.error('upsert error:', err)
              console.log(item)
              await wait(10 * 1000)
              retries++
            }
          }
        }

        console.log('done fetching transfers data for minutes:', lookbackMinutes)
      } catch (err) {
        console.error(err)
      }
      await wait(pollIntervalMs)
    }
  }

  async trackRecentTransferBonds ({ lookbackMinutes, pollIntervalMs }: { lookbackMinutes: number, pollIntervalMs: number }) {
    await this.tilReady()
    while (true) {
      try {
        console.log('tracking recent bonds, minutes: ', lookbackMinutes)
        const now = DateTime.now().toUTC()
        const startTime = Math.floor(now.minus({ minute: lookbackMinutes }).toSeconds())
        const endTime = Math.floor(now.toSeconds())

        console.log('fetching all bonds data for hour', startTime)
        const items = await this.getTransferBondsBetweenDates(startTime, endTime)
        console.log('recenTransferBonds items:', items.length, 'minutes:', lookbackMinutes)
        for (const item of items) {
          let retries = 0
          while (retries < 5) {
            try {
              await this.upsertItem(item)
              break
            } catch (err: any) {
              console.error('upsert error:', err)
              console.log(item)
              await wait(10 * 1000)
              retries++
            }
          }
        }

        console.log('done fetching bonds data for minutes:', lookbackMinutes)
      } catch (err) {
        console.error(err)
      }
      await wait(pollIntervalMs)
    }
  }

  async trackDailyTransfers (options: any) {
    await this.tilReady()
    const { days, offsetDays } = options
    if (days <= 1 && offsetDays === 0) {
      return
    }
    while (true) {
      try {
        console.log('tracking daily transfers for days', days)
        for (let i = 0; i < days; i++) {
          const now = DateTime.now().toUTC()
          const startDate = now.minus({ days: i + offsetDays }).toFormat('yyyy-MM-dd')
          await this.updateTransferDataForDay(startDate)
        }
      } catch (err) {
        console.error(err)
      }
      await wait(24 * 60 * 60 * 1000)
    }
  }

  async updateTransferDataForDay (startDate: string) {
    await this.tilReady()
    console.log('fetching all transfers data for day', startDate)
    const items = await this.getTransfersForDay(startDate)
    console.log('items:', items.length)
    const chunkSize = 1000
    const allChunks = chunk(items, chunkSize)
    for (const chunkedItems of allChunks) {
      for (const item of chunkedItems) {
        this.upsertItem(item)
          .catch((err: any) => {
            console.error('upsert error:', err)
          })
      }
      await wait(1 * 1000)
    }

    console.log('done fetching transfers data')
  }

  async getTransferIdEvents (transferId: string) {
    const enabledChainTransfers = await Promise.all(enabledChains.map((chain: string) => {
      return fetchTransfersForTransferId(chain, transferId)
    }))

    const events :any = {}
    for (const i in enabledChains) {
      events[`${enabledChains[i]}Transfers`] = enabledChainTransfers[i]
    }

    return events
  }

  async updateTransferDataForTransferId (transferId: string) {
    console.log('fetching data for transferId', transferId)
    const events = await this.getTransferIdEvents(transferId)
    const data = await this.normalizeTransferEvents(events)
    if (!data?.length) {
      console.log('no data for transferId', transferId)

      // if subgraph transfer data is not found but db item is found,
      // then fetch state from chain an update db item accordingly.
      let _items = await this.db.getTransfers({ transferId })
      _items = _items?.map(populateData)
      const _item = _items?.[0]
      if (_item?.transactionHash && !_item?.bonded) {
        const onchainData = await TransferStats.getTransferStatusForTxHash(_item?.transactionHash)
        if (onchainData?.bonded) {
          _item.bonded = onchainData?.bonded
          _item.bondTransactionHash = onchainData?.bondTransactionHash
          try {
            console.log('upserting', _item.transferId)
            await this.upsertItem(_item)
          } catch (err: any) {
            console.error('upsert error:', err)
            console.log(_item)
          }
        }
      }

      return
    }
    const items = await this.getRemainingData(data, { refetch: true })

    for (const item of items) {
      try {
        console.log('upserting', item.transferId)
        await this.upsertItem(item)
        break
      } catch (err: any) {
        console.error('upsert error:', err)
        console.log(item)
      }
    }
  }

  async upsertItem (item: any) {
    try {
      /*
      const _item = await this.db.getTransfers({ transferId: item.transferId })
      if (item.amountReceived == null && item.bonded) {
        if (_item && _item.bonded) {
          if (_item.amountReceived == null) {
            const data: any = await this.getReceivedAmount(_item)
            if (data) {
              const { amountReceived, amountReceivedFormatted } = data
              item.amountReceived = amountReceived
              item.amountReceivedFormatted = amountReceivedFormatted
            }
          } else {
            item.amountReceived = _item.amountReceived
            item.amountReceivedFormatted = _item.amountReceivedFormatted
          }
        }
      }
      */

      await this.db.upsertTransfer(
        item.transferId,
        item.transferIdTruncated,
        item.transactionHash,
        item.transactionHashTruncated,
        item.transactionHashExplorerUrl,
        item.sourceChainId,
        item.sourceChainSlug,
        item.sourceChainName,
        item.sourceChainImageUrl,
        item.destinationChainId,
        item.destinationChainSlug,
        item.destinationChainName,
        item.destinationChainImageUrl,
        item.accountAddress,
        item.accountAddressTruncated,
        item.accountAddressExplorerUrl,
        item.amount,
        item.amountFormatted,
        item.amountDisplay,
        item.amountUsd,
        item.amountUsdDisplay,
        item.amountOutMin,
        item.deadline,
        item.recipientAddress,
        item.recipientAddressTruncated,
        item.recipientAddressExplorerUrl,
        item.bonderFee,
        item.bonderFeeFormatted,
        item.bonderFeeDisplay,
        item.bonderFeeUsd,
        item.bonderFeeUsdDisplay,
        item.bonded,
        item.bondTimestamp,
        item.bondTimestampIso,
        item.bondWithinTimestamp,
        item.bondWithinTimestampRelative,
        item.bondTransactionHash,
        item.bondTransactionHashTruncated,
        item.bondTransactionHashExplorerUrl,
        item.bonderAddress,
        item.bonderAddressTruncated,
        item.bonderAddressExplorerUrl,
        item.token,
        item.tokenImageUrl,
        item.tokenPriceUsd,
        item.tokenPriceUsdDisplay,
        item.timestamp,
        item.timestampIso,
        item.preregenesis,
        item.receivedHTokens,
        item.unbondable,
        item.amountReceived,
        item.amountReceivedFormatted,
        item.originContractAddress,
        item.integrationPartner,
        item.integrationPartnerContractAddress
      )
    } catch (err) {
      if (!(err.message.includes('UNIQUE constraint failed') || err.message.includes('duplicate key value violates unique constraint'))) {
        throw err
      }
    }
  }

  async getTransfersForDay (filterDate: string) {
    const endDate = DateTime.fromFormat(filterDate, 'yyyy-MM-dd').toUTC().endOf('day')
    const startTime = Math.floor(endDate.startOf('day').toSeconds())
    const endTime = Math.floor(endDate.toSeconds())
    return this.getTransfersBetweenDates(startTime, endTime)
  }

  async getTransferEventsBetweenDates (startTime: number, endTime: number) {
    console.log('querying fetchTransfers')

    const enabledChainTransfers = await Promise.all(enabledChains.map((chain: string) => {
      return fetchTransfers(chain, startTime, endTime)
    }))

    const events :any = {}
    for (const i in enabledChains) {
      events[`${enabledChains[i]}Transfers`] = enabledChainTransfers[i]
    }

    return events
  }

  async getBondTransferIdEventsBetweenDates (startTime: number, endTime: number) {
    const enabledChainBonds = await Promise.all(enabledChains.map((chain: string) => {
      return fetchBondTransferIdEvents(chain, startTime, endTime)
    }))

    const events :any = {}
    for (const i in enabledChains) {
      events[`${enabledChains[i]}Bonds`] = enabledChainBonds[i]
    }

    return events
  }

  async normalizeTransferEvents (events: any) {
    const data :any[] = []

    for (const key in events) {
      for (const x of events[key]) {
        const chain = key.replace('Transfers', '')
        data.push({
          sourceChain: chainSlugToId(chain),
          destinationChain: x.destinationChainId,
          amount: x.amount,
          amountOutMin: x.amountOutMin,
          recipient: x.recipient,
          bonderFee: chain === 'ethereum' ? x.relayerFee : x.bonderFee,
          deadline: Number(x.deadline),
          transferId: chain === 'ethereum' ? x.id : x.transferId,
          transactionHash: x.transactionHash,
          timestamp: Number(x.timestamp),
          token: x.token,
          from: x.from,
          originContractAddress: x?.transaction?.to?.toLowerCase()
        })
      }
    }

    return data
  }

  async getRemainingData (data: any[], options?: any): Promise<any[]> {
    if (!data.length) {
      return []
    }
    const refetch = options?.refetch
    data = data.sort((a, b) => b.timestamp - a.timestamp)
    let startTime = data.length ? data[data.length - 1].timestamp : 0
    let endTime = data.length ? data[0].timestamp : 0

    if (startTime) {
      startTime = Math.floor(DateTime.fromSeconds(startTime).minus({ days: 1 }).toSeconds())
    }

    if (endTime) {
      endTime = Math.floor(DateTime.fromSeconds(endTime).plus({ days: 2 }).toSeconds())
    }

    const transferIds = data.map(x => x.transferId)
    const filterTransferIds = transferIds

    const single = data?.length === 1 ? data[0] : null

    const fetchBondedWithdrawalsMap : any = {}
    const fetchWithdrewsMap : any = {}
    const fetchFromL1CompletedsMap : any = {}

    if (!single) {
      for (const chain of enabledChains) {
        fetchBondedWithdrawalsMap[chain] = true
        fetchWithdrewsMap[chain] = true
        fetchFromL1CompletedsMap[chain] = true
      }
    }

    if (single) {
      const sourceChainSlug = chainIdToSlug(single.sourceChain)
      const destinationChainSlug = chainIdToSlug(single.destinationChain)

      for (const chain of enabledChains) {
        if (destinationChainSlug === chain) {
          fetchBondedWithdrawalsMap[destinationChainSlug] = true
          fetchWithdrewsMap[destinationChainSlug] = true
          if (destinationChainSlug !== 'ethereum') {
            fetchFromL1CompletedsMap[destinationChainSlug] = sourceChainSlug === 'ethereum'
          }
        }
      }
    }

    console.log('querying fetchTransferBonds')

    const fetchBondedWithdrawalsChains = Object.keys(fetchBondedWithdrawalsMap)
    const enabledChainBondedWithdrawals = await Promise.all(fetchBondedWithdrawalsChains.map((chain: string) => {
      return fetchTransferBonds(chain, filterTransferIds)
    }))

    const bondedWithdrawals :any = {}
    for (const i in fetchBondedWithdrawalsChains) {
      bondedWithdrawals[fetchBondedWithdrawalsChains[i]] = enabledChainBondedWithdrawals[i]
    }

    console.log('querying fetchWithdrews')

    const fetchWithdrewsChains = Object.keys(fetchWithdrewsMap)
    const enabledChainWithdrews = await Promise.all(fetchWithdrewsChains.map((chain: string) => {
      return fetchWithdrews(chain, filterTransferIds)
    }))

    const withdrews :any = {}
    for (const i in fetchWithdrewsChains) {
      withdrews[fetchWithdrewsChains[i]] = enabledChainWithdrews[i]
    }

    console.log('querying fetchTransferFromL1Completeds')

    const fetchFromL1CompletedsChains = Object.keys(fetchFromL1CompletedsMap).filter((chain: string) => chain !== 'ethereum')
    const enabledChainFromL1Completeds = await Promise.all(fetchFromL1CompletedsChains.map((chain: string) => {
      return fetchTransferFromL1Completeds(chain, startTime, endTime, undefined)
    }))

    const fromL1CompletedsMap :any = {}
    for (const i in fetchFromL1CompletedsChains) {
      fromL1CompletedsMap[fetchFromL1CompletedsChains[i]] = enabledChainFromL1Completeds[i]
    }

    const bondsMap :any = {}
    for (const key in bondedWithdrawals) {
      bondsMap[key] = [...bondedWithdrawals[key], ...withdrews[key]]
    }

    for (const x of data) {
      const bonds = bondsMap[chainIdToSlug(x.destinationChain)]
      if (bonds) {
        for (const bond of bonds) {
          if (bond.transferId === x.transferId) {
            x.bonded = true
            x.bonder = bond.from
            x.bondTransactionHash = bond.transactionHash
            x.bondedTimestamp = Number(bond.timestamp)
            continue
          }
        }
      }
    }

    for (const x of data) {
      const sourceChain = chainIdToSlug(x.sourceChain)
      if (sourceChain !== 'ethereum') {
        continue
      }
      const events = fromL1CompletedsMap[chainIdToSlug(x.destinationChain)]
      if (events) {
        for (const event of events) {
          if (
            event.recipient === x.recipient &&
            event.amount === x.amount &&
            event.amountOutMin === x.amountOutMin &&
            event.deadline.toString() === x.deadline.toString() &&
            event.relayer?.toString() === x.relayer?.toString() &&
            event.relayerFee?.toString() === x.relayerFee?.toString() &&
            Number(event.timestamp.toString()) - Number(x.timestamp.toString()) <= 1800 && Number(event.timestamp.toString()) - Number(x.timestamp.toString()) > 0
          ) {
            x.bonded = true
            x.bonder = event.from
            x.bondTransactionHash = event.transactionHash
            x.bondedTimestamp = Number(event.timestamp)
            continue
          }
        }
      }
    }

    const unbondableTransfers = [
      '0xf78b17ccced6891638989a308cc6c1f089330cd407d8c165ed1fbedb6bda0930',
      '0x5a37e070c256e37504116e351ec3955679539d6aa3bd30073942b17afb3279f4',
      '0x185b2ba8f589119ede69cf03b74ee2b323b23c75b6b9f083bdf6123977576790',
      '0x0131496b64dbd1f7821ae9f7d78f28f9a78ff23cd85e8851b8a2e4e49688f648'
    ]

    if (data.length > 0) {
      const regenesisTimestamp = 1636531200
      for (const item of data) {
        if (!item.bonded && item.timestamp < regenesisTimestamp && chainIdToSlug(item.destinationChain) === 'optimism' && chainIdToSlug(item.sourceChain) !== 'ethereum') {
          try {
            const event = await getPreRegenesisBondEvent(item.transferId, item.token)
            if (event) {
              const [receipt, block] = await Promise.all([event.getTransactionReceipt(), event.getBlock()])
              item.bonded = true
              item.bonder = receipt.from
              item.bondTransactionHash = event.transactionHash
              item.bondedTimestamp = Number(block.timestamp)
              item.preregenesis = true
            }
          } catch (err) {
            console.error(err)
          }
        }
      }
    }

    console.log('items to populate', data.length)
    console.log('checking getIntegrationPartner for items')
    if (data.length > 0 && this.shouldCheckIntegrationPartner) {
      for (const item of data) {
        const _data = await this.getIntegrationPartner(item)
        if (_data) {
          const { originContractAddress, integrationPartner, integrationPartnerContractAddress } = _data
          item.originContractAddress = originContractAddress
          item.integrationPartner = integrationPartner
          item.integrationPartnerContractAddress = integrationPartnerContractAddress
        } else {
          item.integrationPartner = ''
        }
      }
    }

    console.log('checking getReceivedHtokens for items')
    const populatedData = data
      .filter(x => enabledTokens.includes(x.token))
      .filter(x => x.destinationChain && x.transferId)
      .filter(x => {
        return !unbondableTransfers.includes(x.transferId)
      })
      .map((x: any) => populateTransfer(x, this.prices))
      .filter(x => enabledChains.includes(x.sourceChainSlug) && enabledChains.includes(x.destinationChainSlug))
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((x, i) => {
        x.index = i
        return x
      })

    for (const x of populatedData) {
      const isUnbondable = (x.destinationChainSlug === 'ethereum' && (x.deadline > 0 || BigNumber.from(x.amountOutMin || 0).gt(0)))
      x.unbondable = isUnbondable

      if (this.shouldCheckReceivedHTokens) {
        if (typeof x.receivedHTokens !== 'boolean' || refetch) {
          x.receivedHTokens = await this.getReceivedHtokens(x, refetch)
        }
      }
    }

    console.log('returning getRemainingData')
    return populatedData.map(populateData)
  }

  async getIntegrationPartner (item: any) {
    if (isGoerli) {
      return item
    }
    const cacheKey = `integrationPartner:${item.transferId}`
    const cached = cache.get(cacheKey)
    if (cached) {
      return cached
    }
    const { transactionHash, sourceChain } = item
    const sourceChainSlug = chainIdToSlug(sourceChain)

    const _addresses = Object.values(addresses?.bridges?.[item.token]?.[sourceChainSlug] ?? {}).reduce((acc: any, address: string) => {
      address = /^0x/.test(address) ? address?.toLowerCase() : ''
      if (address) {
        acc[address] = true
      }
      return acc
    }, {})
    const isOriginHop = _addresses[item?.originContractAddress]
    if (isOriginHop) {
      const result = {
        integrationPartner: '',
        originContractAddress: item?.originContractAddress
      }
      cache.put(cacheKey, result, cacheDurationMs)
      return result
    }
    const rpcUrl = rpcUrls[sourceChainSlug]
    if (rpcUrl) {
      try {
        const provider = new providers.StaticJsonRpcProvider(rpcUrl)
        const receipt = await this.getTransactionReceipt(provider, transactionHash)
        if (receipt) {
          const contractAddress = receipt.to?.toLowerCase()
          item.originContractAddress = contractAddress
          let integrationPartner = integrations[contractAddress]?.toLowerCase()
          if (integrationPartner) {
            const result = {
              integrationPartner,
              integrationPartnerContractAddress: contractAddress,
              originContractAddress: item?.originContractAddress
            }
            cache.put(cacheKey, result, cacheDurationMs)
            return result
          }
          const logs = receipt.logs
          for (const log of logs) {
            const address = log.address?.toLowerCase()
            integrationPartner = integrations[address]?.toLowerCase()
            if (integrationPartner) {
              const result = {
                integrationPartner: integrationPartner,
                integrationPartnerContractAddress: address,
                originContractAddress: item?.originContractAddress
              }
              cache.put(cacheKey, result, cacheDurationMs)
              return result
            }
          }
          const result = {
            integrationPartner: '',
            originContractAddress: item?.originContractAddress
          }
          cache.put(cacheKey, result, cacheDurationMs)
          return result
        }
      } catch (err: any) {
        console.error(err)
      }
    }
    const result = {
      integrationPartner: '',
      originContractAddress: item?.originContractAddress
    }
    cache.put(cacheKey, result, cacheDurationMs)
    return result
  }

  async getTransfersBetweenDates (startTime: number, endTime: number) {
    const events = await this.getTransferEventsBetweenDates(startTime, endTime)
    let data = await this.normalizeTransferEvents(events)
    data = await this.getRemainingData(data, { refetch: false })
    console.log('getTransfersBetweenDates done', data.length)
    return data
  }

  async getTransferBondsBetweenDates (startTime: number, endTime: number) {
    const bondsObj = await this.getBondTransferIdEventsBetweenDates(startTime, endTime)

    const allIds : string[] = []

    for (const key in bondsObj) {
      for (const k in bondsObj[key]) {
        allIds.push(bondsObj[key][k].transferId)
      }
    }

    const enabledChainTransfers = await Promise.all(enabledChains.map((chain: string) => {
      return fetchTransferEventsByTransferIds(chain, allIds)
    }))

    const events :any = {}
    for (const i in enabledChains) {
      events[`${enabledChains[i]}Transfers`] = enabledChainTransfers[i]
    }

    const data = await this.normalizeTransferEvents(events)
    return this.getRemainingData(data)
  }

  async getTransactionReceipt (provider: any, transactionHash: string) {
    return TransferStats.getTransactionReceipt(provider, transactionHash)
  }

  static async getTransactionReceipt (provider: any, transactionHash: string) {
    const key = `receipt:${transactionHash}`
    const cached = cache.get(key)
    if (cached) {
      return cached
    }

    const receipt = await provider.getTransactionReceipt(transactionHash)
    if (receipt) {
      cache.put(key, receipt, cacheDurationMs)
    }

    return receipt
  }

  // gets on-chain origin transfer data
  static async getTransferStatusForTxHash (transactionHash: string) {
    for (const chainSlug in rpcUrls) {
      const rpcUrl = rpcUrls[chainSlug]
      const provider = new providers.StaticJsonRpcProvider(rpcUrl)
      const receipt = await this.getTransactionReceipt(provider, transactionHash)
      let transferId = ''
      const sourceChainId = chainSlugToId(chainSlug)
      const sourceChainSlug = chainIdToSlug(sourceChainId)
      const sourceChainSlugName = chainSlugToName(chainSlug)
      let destinationChainSlug = ''
      let destinationChainId = 0
      let destinationChainName = ''
      let timestamp = 0
      let recipient = ''
      let deadline = 0
      let bonderFee = 0
      let bonderFeeFormatted = 0
      let amount = 0
      let amountFormatted = 0
      let token = ''
      let bonded = false
      let bondTransactionHash = ''
      if (receipt) {
        const block = await provider.getBlock(receipt.blockNumber)
        if (!block) {
          console.error('no block found for receipt', receipt)
          continue
        }
        timestamp = block.timestamp
        const logs = receipt.logs
        for (const log of logs) {
          if (log.topics[0] === '0xe35dddd4ea75d7e9b3fe93af4f4e40e778c3da4074c9d93e7c6536f1e803c1eb') { // TransferSent
            const iface = new ethers.utils.Interface(l2BridgeAbi)
            const decoded = iface.parseLog(log)
            if (decoded) {
              transferId = decoded?.args?.transferId
              destinationChainId = Number(decoded?.args.chainId.toString())
              destinationChainSlug = chainIdToSlug(destinationChainId)
              destinationChainName = chainSlugToName(destinationChainSlug)
              recipient = decoded?.args?.recipient.toString()
              amount = decoded?.args?.amount?.toString()
              bonderFee = decoded?.args?.bonderFee.toString()
              deadline = Number(decoded?.args?.deadline.toString())
            }
            for (const _token of enabledTokens) {
              const _addreses = addresses?.bridges?.[_token]?.[sourceChainSlug]
              if (
                _addreses?.l2AmmWrapper?.toLowerCase() === log.address?.toLowerCase() ||
                _addreses?.l2Bridge?.toLowerCase() === log.address?.toLowerCase()
              ) {
                token = _token
              }
            }
          } else if (log.topics[0] === '0x0a0607688c86ec1775abcdbab7b33a3a35a6c9cde677c9be880150c231cc6b0b') { // TransferSentToL2
            const iface = new ethers.utils.Interface(l1BridgeAbi)
            const decoded = iface.parseLog(log)
            if (decoded) {
              destinationChainId = Number(decoded?.args.chainId.toString())
              destinationChainSlug = chainIdToSlug(destinationChainId)
              destinationChainName = chainSlugToName(destinationChainSlug)
              recipient = decoded?.args?.recipient.toString()
              amount = decoded?.args?.amount?.toString()
              bonderFee = decoded?.args?.relayerFee.toString()
              deadline = Number(decoded?.args?.deadline.toString())
            }
            for (const _token of enabledTokens) {
              const _addreses = addresses?.bridges?.[_token]?.[sourceChainSlug]
              if (
                _addreses?.l1Bridge?.toLowerCase() === log.address?.toLowerCase()
              ) {
                token = _token
              }
            }
          }

          if (token) {
            const decimals = getTokenDecimals(token)
            if (amount) {
              amountFormatted = Number(formatUnits(amount, decimals))
            }
            if (bonderFee) {
              bonderFeeFormatted = Number(formatUnits(bonderFee, decimals))
            }
          }
        }
        if (transferId && destinationChainId && token) {
          try {
            const bridgeAddress = addresses?.bridges?.[token]?.[destinationChainSlug]?.l2Bridge || addresses?.bridges?.[token]?.[destinationChainSlug]?.l1Bridge
            if (!bridgeAddress) {
              throw new Error('bridge address not found')
            }
            const _provider = new providers.StaticJsonRpcProvider(rpcUrls[destinationChainSlug])
            const contract = new Contract(bridgeAddress, bridgeAbi, _provider)
            const logs = await contract.queryFilter(
              contract.filters.WithdrawalBonded(transferId)
            )
            if (logs.length === 1) {
              bonded = true
              bondTransactionHash = logs[0].transactionHash
            }
          } catch (err: any) {
            console.error('getTransferStatusForTxHash: queryFilter error:', err)
          }
        }
        return {
          id: transferId || transactionHash,
          transferId,
          transactionHash,
          sourceChainSlug,
          destinationChainSlug,
          accountAddress: receipt.from,
          bonded,
          bondTransactionHash,
          timestamp,
          sourceChainId,
          sourceChainSlugName,
          destinationChainId,
          destinationChainName,
          recipient,
          deadline,
          bonderFee,
          bonderFeeFormatted,
          amount,
          amountFormatted,
          token
        }
      }
    }
  }
}

export default TransferStats
