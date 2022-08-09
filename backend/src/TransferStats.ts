import fetch from 'isomorphic-fetch'
import { Contract, providers } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { DateTime } from 'luxon'
import Db, { getInstance } from './Db'
import { chunk } from 'lodash'
import toHex from 'to-hex'
import wait from 'wait'
import { mainnet as addresses } from '@hop-protocol/core/addresses'

const enabledTokens = ['USDC', 'USDT', 'DAI', 'MATIC', 'ETH', 'WBTC']
const enabledChains = ['ethereum', 'gnosis', 'polygon', 'arbitrum', 'optimism']

const rpcUrls = {
  gnosis: process.env.GNOSIS_RPC,
  polygon: process.env.POLYGON_RPC,
  arbitrum: process.env.ARBITRUM_RPC,
  optimism: process.env.OPTIMISM_RPC,
  ethereum: process.env.ETHEREUM_RPC
}

function padHex (hex: string) {
  return toHex(hex, { evenLength: true, addPrefix: true })
}

function truncateAddress (address :string) {
  return truncateString(address, 4)
}

function truncateHash (hash: string) {
  return truncateString(hash, 6)
}

function truncateString (str: string, splitNum: number) {
  if (!str) return ''
  return str.substring(0, 2 + splitNum) + '…' + str.substring(str.length - splitNum, str.length)
}

function explorerLink (chain: string) {
  let base = ''
  if (chain === 'gnosis') {
    base = 'https://blockscout.com/xdai/mainnet'
  } else if (chain === 'polygon') {
    base = 'https://polygonscan.com'
  } else if (chain === 'optimism') {
    base = 'https://optimistic.etherscan.io'
  } else if (chain === 'arbitrum') {
    base = 'https://arbiscan.io'
  } else {
    base = 'https://etherscan.io'
  }

  return base
}

function formatCurrency (value: any, token: any) {
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    // style: 'currency',
    // currency: 'USD'
  })

  if (token === 'MATIC' || token === 'ETH') {
    return Number(value || 0).toFixed(5)
  }

  return `$${currencyFormatter.format(value)}`
}

function explorerLinkAddress (chain: string, address: string) {
  const base = explorerLink(chain)
  return `${base}/address/${address}`
}

function explorerLinkTx (chain: string, transactionHash: string) {
  const base = explorerLink(chain)
  return `${base}/tx/${transactionHash}`
}

const chainIdToSlugMap: any = {
  1: 'ethereum',
  42: 'ethereum',
  10: 'optimism',
  69: 'optimism',
  77: 'gnosis',
  100: 'gnosis',
  137: 'polygon',
  42161: 'arbitrum',
  421611: 'arbitrum'
}

const chainSlugToNameMap: any = {
  ethereum: 'Ethereum',
  gnosis: 'Gnosis',
  polygon: 'Polygon',
  arbitrum: 'Arbitrum',
  optimism: 'Optimism'
}

function nearestDate (dates: any[], target: any) {
  if (!target) {
    target = Date.now()
  } else if (target instanceof Date) {
    target = target.getTime()
  }

  let nearest = Infinity
  let winner = -1

  dates.forEach(function (date, index) {
    if (date instanceof Date) date = date.getTime()
    const distance = Math.abs(date - target)
    if (distance < nearest) {
      nearest = distance
      winner = index
    }
  })

  return winner
}

/*
const colorsMap: any = {
  ethereum: '#868dac',
  gnosis: '#46a4a1',
  polygon: '#8b57e1',
  optimism: '#e64b5d',
  arbitrum: '#289fef',
  fallback: '#9f9fa3'
}
*/

const chainLogosMap: any = {
  ethereum: 'https://assets.hop.exchange/logos/ethereum.svg',
  gnosis: 'https://assets.hop.exchange/logos/gnosis.svg',
  polygon: 'https://assets.hop.exchange/logos/polygon.svg',
  optimism: 'https://assets.hop.exchange/logos/optimism.svg',
  arbitrum: 'https://assets.hop.exchange/logos/arbitrum.svg'
}

const tokenLogosMap: any = {
  USDC: 'https://assets.hop.exchange/logos/usdc.svg',
  USDT: 'https://assets.hop.exchange/logos/usdt.svg',
  DAI: 'https://assets.hop.exchange/logos/dai.svg',
  MATIC: 'https://assets.hop.exchange/logos/matic.svg',
  ETH: 'https://assets.hop.exchange/logos/eth.svg',
  WBTC: 'https://assets.hop.exchange/logos/wbtc.svg',
  FRAX: 'https://assets.hop.exchange/logos/frax.svg',
  HOP: 'https://assets.hop.exchange/logos/hop.svg'
}

const tokenDecimals: any = {
  USDC: 6,
  USDT: 6,
  DAI: 18,
  MATIC: 18,
  ETH: 18,
  FRAX: 18,
  HOP: 18,
  WBTC: 8
}

type Options = {
  days?: number
  offsetDays?: number
}

class TransferStats {
  db : Db = getInstance()
  regenesis = false
  prices: any = {}
  days = 0
  offsetDays = 0
  ready = false

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

  getUrl (chain: string) {
    if (chain === 'gnosis') {
      chain = 'xdai'
    }

    if (chain === 'ethereum') {
      chain = 'mainnet'
    }

    if (this.regenesis) {
      return `http://localhost:8000/subgraphs/name/hop-protocol/hop-${chain}`
    }

    return `https://api.thegraph.com/subgraphs/name/hop-protocol/hop-${chain}`
  }

  async queryFetch (url: string, query: string, variables?: any) {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        query,
        variables: variables || {}
      })
    })
    const jsonRes = await res.json()
    if (jsonRes.errors?.length) {
      throw new Error(jsonRes.errors[0].message)
    }
    return jsonRes.data
  }

  async fetchTransfers (chain: string, startTime: number, endTime: number, lastId?: string) {
    const queryL1 = `
      query TransferSentToL2($perPage: Int, $startTime: Int, $endTime: Int, $lastId: String) {
        transferSents: transferSentToL2S(
          where: {
            timestamp_gte: $startTime,
            timestamp_lte: $endTime,
            id_gt: $lastId
          },
          first: $perPage,
          orderBy: id,
          orderDirection: asc
        ) {
          id
          destinationChainId
          amount
          amountOutMin
          relayerFee
          recipient
          deadline
          transactionHash
          timestamp
          token
          from
        }
      }
    `
    const queryL2 = `
      query TransferSents($perPage: Int, $startTime: Int, $endTime: Int, $lastId: String) {
        transferSents(
          where: {
            timestamp_gte: $startTime,
            timestamp_lte: $endTime,
            id_gt: $lastId
          },
          first: $perPage,
          orderBy: id,
          orderDirection: asc
        ) {
          id
          transferId
          destinationChainId
          amount
          amountOutMin
          bonderFee
          recipient
          deadline
          transactionHash
          timestamp
          token
          from
        }
      }
    `
    const url = this.getUrl(chain)
    let query = queryL1
    if (chain !== 'ethereum') {
      query = queryL2
    }
    if (!lastId) {
      lastId = '0'
    }
    const data = await this.queryFetch(url, query, {
      perPage: 1000,
      startTime,
      endTime,
      lastId
    })

    let transfers = data.transferSents
      .filter((x: any) => x)
      .map((x: any) => {
        x.destinationChainId = Number(x.destinationChainId)
        return x
      })

    if (transfers.length === 1000) {
      lastId = transfers[transfers.length - 1].id
      transfers = transfers.concat(...(await this.fetchTransfers(
        chain,
        startTime,
        endTime,
        lastId
      )))
    }

    return transfers
  }

  async fetchTransfersForTransferId (chain: string, transferId: string) {
    const queryL1TransferId = `
      query TransferSentToL2($transferId: String) {
        transferSents: transferSentToL2S(
          where: {
            id: $transferId
          }
        ) {
          id
          destinationChainId
          amount
          amountOutMin
          relayerFee
          recipient
          deadline
          transactionHash
          timestamp
          token
          from
        }
      }
    `
    const queryL1TxHash = `
      query TransferSentToL2($transferId: String) {
        transferSents: transferSentToL2S(
          where: {
            transactionHash: $transferId
          }
        ) {
          id
          destinationChainId
          amount
          amountOutMin
          relayerFee
          recipient
          deadline
          transactionHash
          timestamp
          token
          from
        }
      }
    `
    const queryL2 = `
      query TransferSents($transferId: String) {
        transferSents: transferSents(
          where: {
            transferId: $transferId
          }
        ) {
          id
          transferId
          destinationChainId
          amount
          amountOutMin
          bonderFee
          recipient
          deadline
          transactionHash
          timestamp
          token
          from
        },
        transferSents2: transferSents(
          where: {
            transactionHash: $transferId
          }
        ) {
          id
          transferId
          destinationChainId
          amount
          amountOutMin
          bonderFee
          recipient
          deadline
          transactionHash
          timestamp
          token
          from
        }
      }
    `
    const url = this.getUrl(chain)
    let query = transferId.length === 66 ? queryL1TxHash : queryL1TransferId
    if (chain !== 'ethereum') {
      transferId = padHex(transferId)
      query = queryL2
    }
    const data = await this.queryFetch(url, query, {
      transferId
    })

    const transfers = data.transferSents.concat(data.transferSents2 || [])
      .filter((x: any) => x)
      .map((x: any) => {
        x.destinationChainId = Number(x.destinationChainId)
        return x
      })

    return transfers
  }

  async fetchBondTransferIdEvents (chain: string, startTime: number, endTime: number, lastId?: string) {
    const query = `
      query WithdrawalBondeds($perPage: Int, $startTime: Int, $endTime: Int, $lastId: String) {
        withdrawalBondeds: withdrawalBondeds(
          where: {
            timestamp_gte: $startTime,
            timestamp_lte: $endTime,
            id_gt: $lastId
          },
          first: $perPage,
          orderBy: id,
          orderDirection: asc
        ) {
          id
          transferId
          transactionHash
          timestamp
          token
          from
        }
      }
    `

    const url = this.getUrl(chain)
    if (!lastId) {
      lastId = '0'
    }
    const data = await this.queryFetch(url, query, {
      perPage: 1000,
      startTime,
      endTime,
      lastId
    })

    let bonds = data.withdrawalBondeds.filter((x: any) => x)

    if (bonds.length === 1000) {
      lastId = bonds[bonds.length - 1].id
      bonds = bonds.concat(...(await this.fetchBondTransferIdEvents(
        chain,
        startTime,
        endTime,
        lastId
      )))
    }

    return bonds
  }

  async fetchBonds (chain: string, transferIds: string[]) {
    const query = `
      query WithdrawalBondeds($transferIds: [String]) {
        withdrawalBondeds1: withdrawalBondeds(
          where: {
            transferId_in: $transferIds
          },
          first: 1000,
          orderBy: id,
          orderDirection: asc
        ) {
          id
          transferId
          transactionHash
          timestamp
          token
          from
        },
        withdrawalBondeds2: withdrawalBondeds(
          where: {
            transactionHash_in: $transferIds
          },
          first: 1000,
          orderBy: id,
          orderDirection: asc,
        ) {
          id
          transferId
          transactionHash
          timestamp
          token
          from
        }
      }
    `

    transferIds = transferIds?.filter(x => x).map((x: string) => padHex(x)) ?? []
    const url = this.getUrl(chain)
    let bonds: any = []
    const chunkSize = 1000
    const allChunks = chunk(transferIds, chunkSize)
    for (const _transferIds of allChunks) {
      const data = await this.queryFetch(url, query, {
        transferIds: _transferIds
      })

      bonds = bonds.concat((data.withdrawalBondeds1 || []).concat(data.withdrawalBondeds2 || []))
    }

    return bonds
  }

  async fetchWithdrews (chain: string, transferIds: string[]) {
    const query = `
      query Withdrews($transferIds: [String]) {
        withdrews(
          where: {
            transferId_in: $transferIds
          },
          first: 1000,
          orderBy: id,
          orderDirection: asc
        ) {
          id
          transferId
          transactionHash
          timestamp
          token
          from
        }
      }
    `
    transferIds = transferIds?.filter(x => x).map((x: string) => padHex(x)) ?? []
    const url = this.getUrl(chain)
    let withdrawals: any = []
    const chunkSize = 1000
    const allChunks = chunk(transferIds, chunkSize)
    for (const _transferIds of allChunks) {
      const data = await this.queryFetch(url, query, {
        transferIds: _transferIds
      })

      withdrawals = withdrawals.concat(data.withdrews)
    }

    return withdrawals
  }

  async fetchTransferFromL1Completeds (chain: string, startTime: number, endTime: number, lastId = '0') {
    const query = `
      query TransferFromL1Completed($startTime: Int, $endTime: Int, $lastId: ID) {
        events: transferFromL1Completeds(
          where: {
            timestamp_gte: $startTime,
            timestamp_lte: $endTime,
            id_gt: $lastId
          },
          first: 1000,
          orderBy: id,
          orderDirection: asc
        ) {
          id
          recipient
          amount
          amountOutMin
          deadline
          transactionHash
          from
          timestamp
        }
      }
    `

    const url = this.getUrl(chain)
    const data = await this.queryFetch(url, query, {
      startTime,
      endTime,
      lastId
    })
    let events = data.events || []

    if (events.length === 1000) {
      lastId = events[events.length - 1].id
      events = events.concat(...(await this.fetchTransferFromL1Completeds(
        chain,
        startTime,
        endTime,
        lastId
      )))
    }

    return events
  }

  async getPriceHistory (coinId: string, days: number) {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`
    console.log(url)
    return Promise.race([fetch(url)
      .then(async (res: any) => {
        if (res.status > 400) {
          throw await res.text()
        }
        return res.json()
      })
      .then((json: any) => {
        console.log('fetched', coinId)
        return json.prices.map((data: any[]) => {
          data[0] = Math.floor(data[0] / 1000)
          return data
        })
      }),
    new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('request timeout: ' + url)), 2 * 60 * 1000)
    })
    ])
  }

  async init () {
    await this.initPrices()
    this.ready = true

    this.pollPrices()
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
    const pricesArr = await Promise.all([
      this.getPriceHistory('usd-coin', daysN),
      this.getPriceHistory('tether', daysN),
      this.getPriceHistory('dai', daysN),
      this.getPriceHistory('ethereum', daysN),
      this.getPriceHistory('matic-network', daysN),
      this.getPriceHistory('wrapped-bitcoin', daysN),
      this.getPriceHistory('frax', daysN),
      this.getPriceHistory('hop-protocol', daysN)
    ])
    console.log('done fetching prices')

    const prices: any = {
      USDC: pricesArr[0],
      USDT: pricesArr[1],
      DAI: pricesArr[2],
      ETH: pricesArr[3],
      MATIC: pricesArr[4],
      WBTC: pricesArr[5],
      FRAX: pricesArr[6],
      HOP: pricesArr[7]
    }

    this.prices = prices
  }

  async getReceivedHtokens (item: any) {
    try {
      const { bondTransactionHash, token, sourceChainSlug, destinationChainSlug } = item
      if (
        !bondTransactionHash ||
        !destinationChainSlug ||
        destinationChainSlug === 'ethereum'
      ) {
        return false
      }
      const rpcUrl = rpcUrls[destinationChainSlug]
      if (!rpcUrl) {
        throw new Error(`rpc url not found for "${destinationChainSlug}"`)
      }
      const provider = new providers.StaticJsonRpcProvider(rpcUrl)
      const receipt = await provider.getTransactionReceipt(bondTransactionHash)
      if (sourceChainSlug === 'ethereum') {
        for (const log of receipt.logs) {
          const topic = log.topics[0]
          const transferTopic = '0xddf252ad'
          if (topic.startsWith(transferTopic)) {
            const hTokenAddress = addresses?.bridges?.[token]?.[destinationChainSlug]?.l2HopBridgeToken
            if (hTokenAddress?.toLowerCase() === log.address?.toLowerCase() && item.recipientAddress) {
              if (log.topics[2].includes(item.recipientAddress?.toLowerCase().slice(2))) {
                return true
              }
            }
          }
        }
        return false
      } else {
        const receivedHTokens = receipt.logs.length === 8
        return receivedHTokens
      }
    } catch (err) {
      console.error(err)
      return false
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

        const chunkSize = 10
        const allChunks = chunk(items, chunkSize)
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
            console.log('receivedHTokens?', item.transferId, receivedHTokens)
            await this.upsertItem(item)
          }))
        }
      } catch (err) {
        console.error(err)
      }
    }
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
    await Promise.all([
      this.trackReceivedHTokenStatus(),
      // this.trackAllDailyTransfers(),
      this.trackHourlyTransfers(1, 60 * 1000),
      wait(1 * 60 * 1000).then(() => {
        return this.trackHourlyTransfers(6, 30 * 60 * 1000)
      }),
      wait(15 * 60 * 1000).then(() => {
        return this.trackHourlyTransfers(12, 2 * 60 * 60 * 1000)
      }),
      wait(30 * 60 * 1000).then(() => {
        return this.trackHourlyTransfers(24, 12 * 60 * 60 * 1000)
      }),
      this.trackRecentBonds(20, 60 * 1000),
      wait(0 * 60 * 1000).then(() => {
        return this.trackRecentBonds(2 * 60, 10 * 60 * 1000)
      })
      /*
      wait(120 * 1000).then(() => {
        return this.trackRecentBonds(24 * 60, 30 * 60 * 1000)
      })
      */
      /*
      wait(60 * 60 * 1000).then(() => {
        this.trackDailyTransfers()
      })
      */
    ])
  }

  async trackHourlyTransfers (hours: number, delay: number) {
    await this.tilReady()
    while (true) {
      try {
        console.log('tracking hourly transfers, hours: ', hours)
        const now = DateTime.now().toUTC()
        const startTime = Math.floor(now.minus({ hour: hours }).toSeconds())
        const endTime = Math.floor(now.toSeconds())

        console.log('fetching all transfers data for hour', startTime)
        const items = await this.getTransfersBetweenDates(startTime, endTime)
        console.log('items:', items.length)
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

        console.log('done fetching transfers data for hours:', hours)
      } catch (err) {
        console.error(err)
      }
      await wait(delay)
    }
  }

  async trackRecentBonds (minutes: number, delay: number) {
    await this.tilReady()
    while (true) {
      try {
        console.log('tracking recent bonds, minutes: ', minutes)
        const now = DateTime.now().toUTC()
        const startTime = Math.floor(now.minus({ minute: minutes }).toSeconds())
        const endTime = Math.floor(now.toSeconds())

        console.log('fetching all bonds data for hour', startTime)
        const items = await this.getBondsBetweenDates(startTime, endTime)
        console.log('items:', items.length)
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

        console.log('done fetching bonds data for minutes:', minutes)
      } catch (err) {
        console.error(err)
      }
      await wait(delay)
    }
  }

  async trackDailyTransfers () {
    await this.tilReady()
    while (true) {
      try {
        console.log('tracking daily transfers')
        const now = DateTime.now().toUTC()
        const startDate = now.toFormat('yyyy-MM-dd')
        await this.updateTransferDataForDay(startDate)
      } catch (err) {
        console.error(err)
      }
      await wait(24 * 60 * 60 * 1000)
    }
  }

  async trackAllDailyTransfers () {
    await this.tilReady()

    const days = []
    for (let day = 0; day < this.days; day++) {
      days.push(day)
    }

    const chunkSize = 5
    const allChunks = chunk(days, chunkSize)
    for (const chunks of allChunks) {
      await Promise.all(chunks.map(async (day: number) => {
        const now = DateTime.now().toUTC().minus({ days: this.offsetDays })
        const startDate = now.minus({ days: day }).toFormat('yyyy-MM-dd')
        await this.updateTransferDataForDay(startDate)
      }))
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
    const [
      gnosisTransfers,
      polygonTransfers,
      optimismTransfers,
      arbitrumTransfers,
      mainnetTransfers
    ] = await Promise.all([
      enabledChains.includes('gnosis') ? this.fetchTransfersForTransferId('gnosis', transferId) : Promise.resolve([]),
      enabledChains.includes('polygon') ? this.fetchTransfersForTransferId('polygon', transferId) : Promise.resolve([]),
      enabledChains.includes('optimism') ? this.fetchTransfersForTransferId('optimism', transferId) : Promise.resolve([]),
      enabledChains.includes('arbitrum') ? this.fetchTransfersForTransferId('arbitrum', transferId) : Promise.resolve([]),
      enabledChains.includes('ethereum') ? this.fetchTransfersForTransferId('ethereum', transferId) : Promise.resolve([])
    ])

    return {
      gnosisTransfers,
      polygonTransfers,
      optimismTransfers,
      arbitrumTransfers,
      mainnetTransfers
    }
  }

  async updateTransferDataForTransferId (transferId: string) {
    console.log('fetching data for transferId', transferId)
    const events = await this.getTransferIdEvents(transferId)
    const data = await this.normalizeTransferEvents(events)
    if (!data?.length) {
      console.log('no data for transferId', transferId)
      return
    }
    const items = await this.getRemainingData(data)

    for (const item of items) {
      try {
        if (item.bonded && item.receivedHTokens == null) {
          item.receivedHTokens = await this.getReceivedHtokens(item)
        }
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
      if (item.receivedHTokens == null) {
        const _item = await this.db.getTransfers({ transferId: item.transferId })
        if (_item) {
          item.receivedHTokens = _item.receivedHTokens
        }
      }

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
        item.receivedHTokens
      )
    } catch (err) {
      if (!(err.message.includes('UNIQUE constraint failed') || err.message.includes('duplicate key value violates unique constraint'))) {
        throw err
      }
    }
  }

  populateTransfer (x: any, prices: any) {
    if (!x.accountAddress) {
      x.accountAddress = x.from?.toLowerCase()
    }

    if (!x.accountAddressTruncated && x.accountAddress) {
      x.accountAddressTruncated = truncateAddress(x.accountAddress)
    }

    if (!x.recipientAddressExplorerUrl && x.recipientAddress) {
      x.recipientAddressExplorerUrl = explorerLinkAddress(x.destinationChainSlug, x.recipientAddress)
    }

    if (!x.transactionHashTruncated) {
      x.transactionHashTruncated = truncateHash(x.transactionHash)
    }

    const transferTime = DateTime.fromSeconds(x.timestamp)
    if (!x.transferIdTruncated) {
      x.transferIdTruncated = truncateHash(x.transferId)
    }
    if (!x.timestampIso) {
      x.timestampIso = transferTime.toISO()
    }
    if (!x.relativeTimestamp) {
      x.relativeTimestamp = transferTime.toRelative()
    }

    if (!x.sourceChainId) {
      x.sourceChainId = x.sourceChain
    }

    if (!x.destinationChainId) {
      x.destinationChainId = x.destinationChain
    }

    if (!x.sourceChainSlug) {
      x.sourceChainSlug = chainIdToSlugMap[x.sourceChain]
    }
    if (!x.destinationChainSlug) {
      x.destinationChainSlug = chainIdToSlugMap[x.destinationChain]
    }

    if (!x.sourceChainName) {
      x.sourceChainName = chainSlugToNameMap[x.sourceChainSlug]
    }
    if (!x.destinationChainName) {
      x.destinationChainName = chainSlugToNameMap[x.destinationChainSlug]
    }

    if (!x.sourceChainImageUrl) {
      x.sourceChainImageUrl = chainLogosMap[x.sourceChainSlug]
    }
    if (!x.destinationChainImageUrl) {
      x.destinationChainImageUrl = chainLogosMap[x.destinationChainSlug]
    }

    if (!x.transactionHashExplorerUrl) {
      x.transactionHashExplorerUrl = explorerLinkTx(x.sourceChainSlug, x.transactionHash)
    }
    if (!x.bondTransactionHashExplorerUrl) {
      x.bondTransactionHashExplorerUrl = x.bondTransactionHash ? explorerLinkTx(x.destinationChainSlug, x.bondTransactionHash) : ''
    }
    if (x.preregenesis) {
      x.bondTransactionHashExplorerUrl = `https://expedition.dev/tx/${x.bondTransactionHash}?rpcUrl=https%3A%2F%2Fmainnet-replica-4.optimism.io`
    }

    if (!x.accountAddressExplorerUrl) {
      x.accountAddressExplorerUrl = explorerLinkAddress(x.sourceChainSlug, x.accountAddress)
    }

    if (!x.recipientAddress) {
      x.recipientAddress = x.recipient?.toLowerCase()
    }

    if (!x.recipientAddressTruncated && x.recipientAddress) {
      x.recipientAddressTruncated = truncateAddress(x.recipientAddress)
    }

    if (!x.recipientAddressExplorerUrl && x.recipientAddress) {
      x.recipientAddressExplorerUrl = explorerLinkAddress(x.destinationChainSlug, x.recipientAddress)
    }

    if (!x.bonderAddress) {
      x.bonderAddress = x.bonder?.toLowerCase()
    }

    if (!x.bonderAddressTruncated) {
      x.bonderAddressTruncated = truncateAddress(x.bonderAddress)
    }

    if (!x.bonderAddressExplorerUrl) {
      x.bonderAddressExplorerUrl = x.bonderAddress ? explorerLinkAddress(x.destinationChainSlug, x.bonderAddress) : ''
    }
    if (!x.bondTransactionHashTruncated) {
      x.bondTransactionHashTruncated = x.bondTransactionHash ? truncateHash(x.bondTransactionHash) : ''
    }

    if (!x.receiveStatusUnknown) {
      x.receiveStatusUnknown = x.sourceChainId === 1 && !x.bondTxExplorerUrl && DateTime.now().toSeconds() > transferTime.toSeconds() + (60 * 60 * 2)
    }
    if (x.receiveStatusUnknown) {
      // x.bonded = true
    }

    if (!x.bondTimestamp) {
      x.bondTimestamp = x.bondedTimestamp
    }

    if (x.bondTimestamp) {
      const bondedTime = DateTime.fromSeconds(x.bondTimestamp)
      x.bondTimestampIso = bondedTime.toISO()
      x.relativeBondedTimestamp = bondedTime.toRelative()
      const diff = bondedTime.diff(transferTime, ['days', 'hours', 'minutes'])
      const diffObj = diff.toObject()
      x.bondWithinTimestamp = (((diff.days * 24 * 60) + (diff.hours * 60) + diff.values.minutes) * 60)
      let hours = Number(diffObj.hours.toFixed(0))
      let minutes = Number(diffObj.minutes.toFixed(0))
      if (hours < 0) {
        hours = 0
      }
      if (minutes < 1) {
        minutes = 1
      }
      if (hours || minutes) {
        x.bondWithinTimestampRelative = `${hours ? `${hours} hour${hours > 1 ? 's' : ''} ` : ''}${minutes ? `${minutes} minute${minutes > 1 ? 's' : ''}` : ''}`
      }
    }

    const decimals = tokenDecimals[x.token]
    if (!x.amountFormatted) {
      x.amountFormatted = Number(formatUnits(x.amount, decimals))
    }
    if (!x.amountDisplay) {
      x.amountDisplay = x.amountFormatted.toFixed(4)
    }
    if (!x.bonderFeeFormatted) {
      x.bonderFeeFormatted = x.bonderFee ? Number(formatUnits(x.bonderFee, decimals)) : 0
    }
    if (!x.bonderFeeDisplay) {
      x.bonderFeeDisplay = x.bonderFeeFormatted.toFixed(4)
    }
    if (!x.tokenImageUrl) {
      x.tokenImageUrl = tokenLogosMap[x.token]
    }

    x.amountUsd = ''
    x.amountUsdDisplay = ''
    x.tokenPriceUsd = ''
    x.tokenPriceUsdDisplay = ''
    x.bonderFeeUsd = ''
    x.bonderFeeUsdDisplay = ''

    if (prices && prices[x.token]) {
      const dates = prices[x.token].reverse().map((x: any) => x[0])
      const nearest = nearestDate(dates, x.timestamp)
      if (prices[x.token][nearest]) {
        const price = prices[x.token][nearest][1]
        x.amountUsd = price * x.amountFormatted
        x.amountUsdDisplay = formatCurrency(x.amountUsd, 'USD')
        x.tokenPriceUsd = price
        x.tokenPriceUsdDisplay = formatCurrency(x.tokenPriceUsd, 'USD')
        x.bonderFeeUsd = x.tokenPriceUsd * x.bonderFeeFormatted
        x.bonderFeeUsdDisplay = formatCurrency(x.bonderFeeUsd, 'USD')
      }
    }

    return x
  }

  async getTransfersForDay (filterDate: string) {
    const endDate = DateTime.fromFormat(filterDate, 'yyyy-MM-dd').toUTC().plus({ days: 1 }).endOf('day')
    const startTime = Math.floor(endDate.minus({ days: this.days }).startOf('day').toSeconds())
    const endTime = Math.floor(endDate.toSeconds())
    return this.getTransfersBetweenDates(startTime, endTime)
  }

  async getTransferEventsBetweenDates (startTime: number, endTime: number) {
    const [
      gnosisTransfers,
      polygonTransfers,
      optimismTransfers,
      arbitrumTransfers,
      mainnetTransfers
    ] = await Promise.all([
      enabledChains.includes('gnosis') ? this.fetchTransfers('gnosis', startTime, endTime) : Promise.resolve([]),
      enabledChains.includes('polygon') ? this.fetchTransfers('polygon', startTime, endTime) : Promise.resolve([]),
      enabledChains.includes('optimism') ? this.fetchTransfers('optimism', startTime, endTime) : Promise.resolve([]),
      enabledChains.includes('arbitrum') ? this.fetchTransfers('arbitrum', startTime, endTime) : Promise.resolve([]),
      enabledChains.includes('ethereum') ? this.fetchTransfers('ethereum', startTime, endTime) : Promise.resolve([])
    ])

    return {
      gnosisTransfers,
      polygonTransfers,
      optimismTransfers,
      arbitrumTransfers,
      mainnetTransfers
    }
  }

  async getBondTransferIdEventsBetweenDates (startTime: number, endTime: number) {
    const [
      gnosisBonds,
      polygonBonds,
      optimismBonds,
      arbitrumBonds,
      mainnetBonds
    ] = await Promise.all([
      enabledChains.includes('gnosis') ? this.fetchBondTransferIdEvents('gnosis', startTime, endTime) : Promise.resolve([]),
      enabledChains.includes('polygon') ? this.fetchBondTransferIdEvents('polygon', startTime, endTime) : Promise.resolve([]),
      enabledChains.includes('optimism') ? this.fetchBondTransferIdEvents('optimism', startTime, endTime) : Promise.resolve([]),
      enabledChains.includes('arbitrum') ? this.fetchBondTransferIdEvents('arbitrum', startTime, endTime) : Promise.resolve([]),
      enabledChains.includes('ethereum') ? this.fetchBondTransferIdEvents('ethereum', startTime, endTime) : Promise.resolve([])
    ])

    return {
      gnosisBonds,
      polygonBonds,
      optimismBonds,
      arbitrumBonds,
      mainnetBonds
    }
  }

  async normalizeTransferEvents (events: any) {
    const {
      gnosisTransfers,
      polygonTransfers,
      optimismTransfers,
      arbitrumTransfers,
      mainnetTransfers
    } = events
    const data :any[] = []

    for (const x of gnosisTransfers) {
      data.push({
        sourceChain: 100,
        destinationChain: x.destinationChainId,
        amount: x.amount,
        amountOutMin: x.amountOutMin,
        bonderFee: x.bonderFee,
        recipient: x.recipient,
        deadline: Number(x.deadline),
        transferId: x.transferId,
        transactionHash: x.transactionHash,
        timestamp: Number(x.timestamp),
        token: x.token,
        from: x.from
      })
    }
    for (const x of polygonTransfers) {
      data.push({
        sourceChain: 137,
        destinationChain: x.destinationChainId,
        amount: x.amount,
        amountOutMin: x.amountOutMin,
        bonderFee: x.bonderFee,
        recipient: x.recipient,
        deadline: Number(x.deadline),
        transferId: x.transferId,
        transactionHash: x.transactionHash,
        timestamp: Number(x.timestamp),
        token: x.token,
        from: x.from
      })
    }
    for (const x of optimismTransfers) {
      data.push({
        sourceChain: 10,
        destinationChain: x.destinationChainId,
        amount: x.amount,
        bonderFee: x.bonderFee,
        recipient: x.recipient,
        deadline: Number(x.deadline),
        transferId: x.transferId,
        transactionHash: x.transactionHash,
        timestamp: Number(x.timestamp),
        token: x.token,
        from: x.from
      })
    }
    for (const x of arbitrumTransfers) {
      data.push({
        sourceChain: 42161,
        destinationChain: x.destinationChainId,
        amount: x.amount,
        amountOutMin: x.amountOutMin,
        bonderFee: x.bonderFee,
        recipient: x.recipient,
        deadline: Number(x.deadline),
        transferId: x.transferId,
        transactionHash: x.transactionHash,
        timestamp: Number(x.timestamp),
        token: x.token,
        from: x.from
      })
    }
    for (const x of mainnetTransfers) {
      data.push({
        sourceChain: 1,
        destinationChain: x.destinationChainId,
        amount: x.amount,
        amountOutMin: x.amountOutMin,
        recipient: x.recipient,
        bonderFee: x.relayerFee,
        deadline: Number(x.deadline),
        transferId: x.id,
        transactionHash: x.transactionHash,
        timestamp: Number(x.timestamp),
        token: x.token,
        from: x.from
      })
    }

    return data
  }

  async getRemainingData (data: any[]) {
    if (!data.length) {
      return []
    }
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

    const [
      gnosisBondedWithdrawals,
      polygonBondedWithdrawals,
      optimismBondedWithdrawals,
      arbitrumBondedWithdrawals,
      mainnetBondedWithdrawals
    ] = await Promise.all([
      enabledChains.includes('gnosis') ? this.fetchBonds('gnosis', filterTransferIds) : Promise.resolve([]),
      enabledChains.includes('polygon') ? this.fetchBonds('polygon', filterTransferIds) : Promise.resolve([]),
      enabledChains.includes('optimism') ? this.fetchBonds('optimism', filterTransferIds) : Promise.resolve([]),
      enabledChains.includes('arbitrum') ? this.fetchBonds('arbitrum', filterTransferIds) : Promise.resolve([]),
      enabledChains.includes('ethereum') ? this.fetchBonds('ethereum', filterTransferIds) : Promise.resolve([])
    ])

    const [
      gnosisWithdrews,
      polygonWithdrews,
      optimismWithdrews,
      arbitrumWithdrews,
      mainnetWithdrews
    ] = await Promise.all([
      enabledChains.includes('gnosis') ? this.fetchWithdrews('gnosis', filterTransferIds) : Promise.resolve([]),
      enabledChains.includes('polygon') ? this.fetchWithdrews('polygon', filterTransferIds) : Promise.resolve([]),
      enabledChains.includes('optimism') ? this.fetchWithdrews('optimism', filterTransferIds) : Promise.resolve([]),
      enabledChains.includes('arbitrum') ? this.fetchWithdrews('arbitrum', filterTransferIds) : Promise.resolve([]),
      enabledChains.includes('ethereum') ? this.fetchWithdrews('ethereum', filterTransferIds) : Promise.resolve([])
    ])

    const [
      gnosisFromL1Completeds,
      polygonFromL1Completeds,
      optimismFromL1Completeds,
      arbitrumFromL1Completeds
    ] = await Promise.all([
      enabledChains.includes('gnosis') ? this.fetchTransferFromL1Completeds('gnosis', startTime, endTime, undefined) : Promise.resolve([]),
      enabledChains.includes('polygon') ? this.fetchTransferFromL1Completeds('polygon', startTime, endTime, undefined) : Promise.resolve([]),
      enabledChains.includes('optimism') ? this.fetchTransferFromL1Completeds('optimism', startTime, endTime, undefined) : Promise.resolve([]),
      enabledChains.includes('arbitrum') ? this.fetchTransferFromL1Completeds('arbitrum', startTime, endTime, undefined) : Promise.resolve([])
    ])

    const gnosisBonds = [...gnosisBondedWithdrawals, ...gnosisWithdrews]
    const polygonBonds = [...polygonBondedWithdrawals, ...polygonWithdrews]
    const optimismBonds = [...optimismBondedWithdrawals, ...optimismWithdrews]
    const arbitrumBonds = [...arbitrumBondedWithdrawals, ...arbitrumWithdrews]
    const mainnetBonds = [...mainnetBondedWithdrawals, ...mainnetWithdrews]

    const bondsMap: any = {
      gnosis: gnosisBonds,
      polygon: polygonBonds,
      optimism: optimismBonds,
      arbitrum: arbitrumBonds,
      ethereum: mainnetBonds
    }

    const l1CompletedsMap: any = {
      gnosis: gnosisFromL1Completeds,
      polygon: polygonFromL1Completeds,
      optimism: optimismFromL1Completeds,
      arbitrum: arbitrumFromL1Completeds
    }

    for (const x of data) {
      const bonds = bondsMap[chainIdToSlugMap[x.destinationChain]]
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
      const sourceChain = chainIdToSlugMap[x.sourceChain]
      if (sourceChain !== 'ethereum') {
        continue
      }
      const events = l1CompletedsMap[chainIdToSlugMap[x.destinationChain]]
      if (events) {
        for (const event of events) {
          if (
            event.recipient === x.recipient &&
            event.amount === x.amount &&
            event.amountOutMin === x.amountOutMin &&
            event.deadline.toString() === x.deadline.toString()
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
        if (!item.bonded && item.timestamp < regenesisTimestamp && chainIdToSlugMap[item.destinationChain] === 'optimism' && chainIdToSlugMap[item.sourceChain] !== 'ethereum') {
          try {
            const event = await this.getPreRegenesisBondEvent(item.transferId, item.token)
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

    const populatedData = data
      .filter(x => enabledTokens.includes(x.token))
      .filter(x => x.destinationChain && x.transferId)
      .filter(x => {
        return !unbondableTransfers.includes(x.transferId)
      })
      .map((x: any) => this.populateTransfer(x, this.prices))
      .filter(x => enabledChains.includes(x.sourceChainSlug) && enabledChains.includes(x.destinationChainSlug))
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((x, i) => {
        x.index = i
        return x
      })

    return populatedData
  }

  async getTransfersBetweenDates (startTime: number, endTime: number) {
    const events = await this.getTransferEventsBetweenDates(startTime, endTime)
    const data = await this.normalizeTransferEvents(events)
    return this.getRemainingData(data)
  }

  async fetchTransferEventsByTransferIds (chain: string, transferIds: string[]) {
    if (chain === 'mainnet' || chain === 'ethereum') {
      return []
    }
    const query = `
      query TransferSents($transferIds: [String]) {
        transferSents: transferSents(
          where: {
            transferId_in: $transferIds
          },
          first: 1000,
          orderBy: id,
          orderDirection: asc
        ) {
          id
          transferId
          destinationChainId
          amount
          amountOutMin
          bonderFee
          recipient
          deadline
          transactionHash
          timestamp
          token
          from
        }
      }
    `

    transferIds = transferIds?.filter(x => x).map((x: string) => padHex(x)) ?? []
    const url = this.getUrl(chain)
    let transferSents: any = []
    const chunkSize = 1000
    const allChunks = chunk(transferIds, chunkSize)
    for (const _transferIds of allChunks) {
      const data = await this.queryFetch(url, query, {
        transferIds: _transferIds
      })

      transferSents = transferSents.concat(data.transferSents || [])
    }

    return transferSents.filter((x: any) => x)
  }

  async getBondsBetweenDates (startTime: number, endTime: number) {
    const {
      gnosisBonds,
      polygonBonds,
      optimismBonds,
      arbitrumBonds,
      mainnetBonds
    } = await this.getBondTransferIdEventsBetweenDates(startTime, endTime)

    const allIds : string[] = []
    for (const item of gnosisBonds) {
      allIds.push(item.transferId)
    }
    for (const item of polygonBonds) {
      allIds.push(item.transferId)
    }
    for (const item of optimismBonds) {
      allIds.push(item.transferId)
    }
    for (const item of arbitrumBonds) {
      allIds.push(item.transferId)
    }
    for (const item of mainnetBonds) {
      allIds.push(item.transferId)
    }

    const [
      gnosisTransfers,
      polygonTransfers,
      optimismTransfers,
      arbitrumTransfers,
      mainnetTransfers
    ] = await Promise.all([
      enabledChains.includes('gnosis') ? this.fetchTransferEventsByTransferIds('gnosis', allIds) : Promise.resolve([]),
      enabledChains.includes('polygon') ? this.fetchTransferEventsByTransferIds('polygon', allIds) : Promise.resolve([]),
      enabledChains.includes('optimism') ? this.fetchTransferEventsByTransferIds('optimism', allIds) : Promise.resolve([]),
      enabledChains.includes('arbitrum') ? this.fetchTransferEventsByTransferIds('arbitrum', allIds) : Promise.resolve([]),
      enabledChains.includes('ethereum') ? this.fetchTransferEventsByTransferIds('ethereum', allIds) : Promise.resolve([])
    ])

    const events = {
      gnosisTransfers,
      polygonTransfers,
      optimismTransfers,
      arbitrumTransfers,
      mainnetTransfers
    }

    const data = await this.normalizeTransferEvents(events)
    return this.getRemainingData(data)
  }

  async getPreRegenesisBondEvent (transferId: string, token: string) {
    const rpcUrl = 'https://mainnet-replica-4.optimism.io'
    const provider = new providers.StaticJsonRpcProvider(rpcUrl)
    const bridgeAddresses: any = {
      USDC: '0xa81D244A1814468C734E5b4101F7b9c0c577a8fC',
      USDT: '0x46ae9BaB8CEA96610807a275EBD36f8e916b5C61',
      DAI: '0x7191061D5d4C60f598214cC6913502184BAddf18',
      ETH: '0x83f6244Bd87662118d96D9a6D44f09dffF14b30E'
    }

    const bridgeAddress = bridgeAddresses[token]
    if (!bridgeAddress) {
      return
    }

    const contract = new Contract(bridgeAddress, bridgeAbi, provider)
    const logs = await contract.queryFilter(
      contract.filters.WithdrawalBonded(transferId)
    )

    return logs[0]
  }
}

const bridgeAbi = [{ inputs: [{ internalType: 'address', name: '_l1Governance', type: 'address' }, { internalType: 'contract HopBridgeToken', name: '_hToken', type: 'address' }, { internalType: 'address', name: '_l1BridgeAddress', type: 'address' }, { internalType: 'uint256[]', name: '_activeChainIds', type: 'uint256[]' }, { internalType: 'address[]', name: 'bonders', type: 'address[]' }], stateMutability: 'nonpayable', type: 'constructor' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'newBonder', type: 'address' }], name: 'BonderAdded', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'previousBonder', type: 'address' }], name: 'BonderRemoved', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'bonder', type: 'address' }, { indexed: true, internalType: 'bytes32', name: 'rootHash', type: 'bytes32' }, { indexed: false, internalType: 'uint256', name: 'totalBondsSettled', type: 'uint256' }], name: 'MultipleWithdrawalsSettled', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'account', type: 'address' }, { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'Stake', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'recipient', type: 'address' }, { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }, { indexed: false, internalType: 'uint256', name: 'amountOutMin', type: 'uint256' }, { indexed: false, internalType: 'uint256', name: 'deadline', type: 'uint256' }, { indexed: true, internalType: 'address', name: 'relayer', type: 'address' }, { indexed: false, internalType: 'uint256', name: 'relayerFee', type: 'uint256' }], name: 'TransferFromL1Completed', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'bytes32', name: 'rootHash', type: 'bytes32' }, { indexed: false, internalType: 'uint256', name: 'totalAmount', type: 'uint256' }], name: 'TransferRootSet', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'bytes32', name: 'transferId', type: 'bytes32' }, { indexed: true, internalType: 'uint256', name: 'chainId', type: 'uint256' }, { indexed: true, internalType: 'address', name: 'recipient', type: 'address' }, { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }, { indexed: false, internalType: 'bytes32', name: 'transferNonce', type: 'bytes32' }, { indexed: false, internalType: 'uint256', name: 'bonderFee', type: 'uint256' }, { indexed: false, internalType: 'uint256', name: 'index', type: 'uint256' }, { indexed: false, internalType: 'uint256', name: 'amountOutMin', type: 'uint256' }, { indexed: false, internalType: 'uint256', name: 'deadline', type: 'uint256' }], name: 'TransferSent', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'uint256', name: 'destinationChainId', type: 'uint256' }, { indexed: true, internalType: 'bytes32', name: 'rootHash', type: 'bytes32' }, { indexed: false, internalType: 'uint256', name: 'totalAmount', type: 'uint256' }, { indexed: false, internalType: 'uint256', name: 'rootCommittedAt', type: 'uint256' }], name: 'TransfersCommitted', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'account', type: 'address' }, { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'Unstake', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'bonder', type: 'address' }, { indexed: true, internalType: 'bytes32', name: 'transferId', type: 'bytes32' }, { indexed: true, internalType: 'bytes32', name: 'rootHash', type: 'bytes32' }], name: 'WithdrawalBondSettled', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'bytes32', name: 'transferId', type: 'bytes32' }, { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'WithdrawalBonded', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'bytes32', name: 'transferId', type: 'bytes32' }, { indexed: true, internalType: 'address', name: 'recipient', type: 'address' }, { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }, { indexed: false, internalType: 'bytes32', name: 'transferNonce', type: 'bytes32' }], name: 'Withdrew', type: 'event' }, { inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], name: 'activeChainIds', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'uint256[]', name: 'chainIds', type: 'uint256[]' }], name: 'addActiveChainIds', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'bonder', type: 'address' }], name: 'addBonder', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [], name: 'ammWrapper', outputs: [{ internalType: 'contract L2_AmmWrapper', name: '', type: 'address' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'address', name: 'recipient', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }, { internalType: 'bytes32', name: 'transferNonce', type: 'bytes32' }, { internalType: 'uint256', name: 'bonderFee', type: 'uint256' }], name: 'bondWithdrawal', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'recipient', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }, { internalType: 'bytes32', name: 'transferNonce', type: 'bytes32' }, { internalType: 'uint256', name: 'bonderFee', type: 'uint256' }, { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' }, { internalType: 'uint256', name: 'deadline', type: 'uint256' }], name: 'bondWithdrawalAndDistribute', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'uint256', name: 'destinationChainId', type: 'uint256' }], name: 'commitTransfers', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'recipient', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }, { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' }, { internalType: 'uint256', name: 'deadline', type: 'uint256' }, { internalType: 'address', name: 'relayer', type: 'address' }, { internalType: 'uint256', name: 'relayerFee', type: 'uint256' }], name: 'distribute', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'bonder', type: 'address' }, { internalType: 'bytes32', name: 'transferId', type: 'bytes32' }], name: 'getBondedWithdrawalAmount', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'getChainId', outputs: [{ internalType: 'uint256', name: 'chainId', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'address', name: 'bonder', type: 'address' }], name: 'getCredit', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'address', name: 'bonder', type: 'address' }], name: 'getDebitAndAdditionalDebit', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'address', name: 'maybeBonder', type: 'address' }], name: 'getIsBonder', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'getNextTransferNonce', outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'address', name: 'bonder', type: 'address' }], name: 'getRawDebit', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'uint256', name: 'chainId', type: 'uint256' }, { internalType: 'address', name: 'recipient', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }, { internalType: 'bytes32', name: 'transferNonce', type: 'bytes32' }, { internalType: 'uint256', name: 'bonderFee', type: 'uint256' }, { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' }, { internalType: 'uint256', name: 'deadline', type: 'uint256' }], name: 'getTransferId', outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }], stateMutability: 'pure', type: 'function' }, { inputs: [{ internalType: 'bytes32', name: 'rootHash', type: 'bytes32' }, { internalType: 'uint256', name: 'totalAmount', type: 'uint256' }], name: 'getTransferRoot', outputs: [{ components: [{ internalType: 'uint256', name: 'total', type: 'uint256' }, { internalType: 'uint256', name: 'amountWithdrawn', type: 'uint256' }, { internalType: 'uint256', name: 'createdAt', type: 'uint256' }], internalType: 'struct Bridge.TransferRoot', name: '', type: 'tuple' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'bytes32', name: 'rootHash', type: 'bytes32' }, { internalType: 'uint256', name: 'totalAmount', type: 'uint256' }], name: 'getTransferRootId', outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }], stateMutability: 'pure', type: 'function' }, { inputs: [], name: 'hToken', outputs: [{ internalType: 'contract HopBridgeToken', name: '', type: 'address' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'bytes32', name: 'transferId', type: 'bytes32' }], name: 'isTransferIdSpent', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'l1BridgeAddress', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'l1BridgeCaller', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'l1Governance', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], name: 'lastCommitTimeForChainId', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'maxPendingTransfers', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'minBonderBps', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'minBonderFeeAbsolute', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'minimumForceCommitDelay', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], name: 'pendingAmountForChainId', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }, { internalType: 'uint256', name: '', type: 'uint256' }], name: 'pendingTransferIdsForChainId', outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'uint256[]', name: 'chainIds', type: 'uint256[]' }], name: 'removeActiveChainIds', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'bonder', type: 'address' }], name: 'removeBonder', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'bytes32', name: 'rootHash', type: 'bytes32' }, { internalType: 'uint256', name: 'originalAmount', type: 'uint256' }, { internalType: 'address', name: 'recipient', type: 'address' }], name: 'rescueTransferRoot', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'uint256', name: 'chainId', type: 'uint256' }, { internalType: 'address', name: 'recipient', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }, { internalType: 'uint256', name: 'bonderFee', type: 'uint256' }, { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' }, { internalType: 'uint256', name: 'deadline', type: 'uint256' }], name: 'send', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'contract L2_AmmWrapper', name: '_ammWrapper', type: 'address' }], name: 'setAmmWrapper', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }], name: 'setHopBridgeTokenOwner', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: '_l1BridgeAddress', type: 'address' }], name: 'setL1BridgeAddress', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: '_l1BridgeCaller', type: 'address' }], name: 'setL1BridgeCaller', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: '_l1Governance', type: 'address' }], name: 'setL1Governance', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'uint256', name: '_maxPendingTransfers', type: 'uint256' }], name: 'setMaxPendingTransfers', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'uint256', name: '_minBonderBps', type: 'uint256' }, { internalType: 'uint256', name: '_minBonderFeeAbsolute', type: 'uint256' }], name: 'setMinimumBonderFeeRequirements', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'uint256', name: '_minimumForceCommitDelay', type: 'uint256' }], name: 'setMinimumForceCommitDelay', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'bytes32', name: 'rootHash', type: 'bytes32' }, { internalType: 'uint256', name: 'totalAmount', type: 'uint256' }], name: 'setTransferRoot', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'bonder', type: 'address' }, { internalType: 'bytes32', name: 'transferId', type: 'bytes32' }, { internalType: 'bytes32', name: 'rootHash', type: 'bytes32' }, { internalType: 'uint256', name: 'transferRootTotalAmount', type: 'uint256' }, { internalType: 'uint256', name: 'transferIdTreeIndex', type: 'uint256' }, { internalType: 'bytes32[]', name: 'siblings', type: 'bytes32[]' }, { internalType: 'uint256', name: 'totalLeaves', type: 'uint256' }], name: 'settleBondedWithdrawal', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'bonder', type: 'address' }, { internalType: 'bytes32[]', name: 'transferIds', type: 'bytes32[]' }, { internalType: 'uint256', name: 'totalAmount', type: 'uint256' }], name: 'settleBondedWithdrawals', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'bonder', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'stake', outputs: [], stateMutability: 'payable', type: 'function' }, { inputs: [], name: 'transferNonceIncrementer', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'unstake', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'recipient', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }, { internalType: 'bytes32', name: 'transferNonce', type: 'bytes32' }, { internalType: 'uint256', name: 'bonderFee', type: 'uint256' }, { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' }, { internalType: 'uint256', name: 'deadline', type: 'uint256' }, { internalType: 'bytes32', name: 'rootHash', type: 'bytes32' }, { internalType: 'uint256', name: 'transferRootTotalAmount', type: 'uint256' }, { internalType: 'uint256', name: 'transferIdTreeIndex', type: 'uint256' }, { internalType: 'bytes32[]', name: 'siblings', type: 'bytes32[]' }, { internalType: 'uint256', name: 'totalLeaves', type: 'uint256' }], name: 'withdraw', outputs: [], stateMutability: 'nonpayable', type: 'function' }]

export default TransferStats
