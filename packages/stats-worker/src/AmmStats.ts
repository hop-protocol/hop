import { BigNumber } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { DateTime } from 'luxon'
import { db } from './Db'
import { PriceFeed } from './PriceFeed'
import { queryFetch } from './utils/queryFetch'
import { nearestDate } from './utils/nearestDate'
import { getTokenDecimals } from './utils/getTokenDecimals'
import { enabledChains, enabledTokens } from './config'
import { getSubgraphUrl } from './utils/getSubgraphUrl'
import { mainnet as mainnetAddresses } from '@hop-protocol/core/addresses'

type Options = {
  regenesis?: boolean
  days?: number
  offsetDays?: number
  tokens?: string[]
  chains?: string[]
}

export class AmmStats {
  db = db
  regenesis: boolean = false
  days: number = 1
  offsetDays: number = 0
  priceFeed: PriceFeed
  tokens: string[] = enabledTokens
  chains: string[] = enabledChains

  constructor (options: Options = {}) {
    if (options.regenesis) {
      this.regenesis = options.regenesis
    }
    if (options.days) {
      this.days = options.days
    }
    if (options.offsetDays) {
      this.offsetDays = options.offsetDays
    }
    if (options.tokens) {
      this.tokens = options.tokens
    }
    if (options.chains) {
      this.chains = options.chains
    }

    this.priceFeed = new PriceFeed()
  }

  async fetchTokenSwaps (
    chain: string,
    token: string,
    startDate: number,
    endDate: number,
    lastId = '0'
  ) {
    const query = `
      query TokenSwaps($token: String, $startDate: Int, $endDate: Int, $lastId: ID) {
        tokenSwaps(
          where: {
            token: $token,
            id_gt: $lastId,
            timestamp_gte: $startDate,
            timestamp_lt: $endDate
          },
          orderBy: id,
          orderDirection: asc,
          first: 1000
        ) {
          id
          timestamp
          token
          tokensSold
        }
      }
    `
    const url = getSubgraphUrl(chain)
    const data = await queryFetch(url, query, {
      token,
      startDate,
      endDate,
      lastId
    })

    if (!data) {
      return []
    }

    let items = data.tokenSwaps

    try {
      if (items.length === 1000) {
        lastId = items[items.length - 1].id
        items.push(
          ...(await this.fetchTokenSwaps(
            chain,
            token,
            startDate,
            endDate,
            lastId
          ))
        )
      }
    } catch (err) {
      console.error(err)
    }

    return items
  }

  async trackAmm () {
    const daysN = 365
    console.log('fetching prices')

    const prices: Record<string, any> = {}

    for (const token of this.tokens) {
      prices[token] = await this.priceFeed.getPriceHistory(token, daysN)
    }

    console.log('done fetching prices')

    console.log('upserting prices')
    for (let token in prices) {
      for (let data of prices[token]) {
        const price = data[1]
        const timestamp = data[0]
        try {
          this.db.upsertPrice(token, price, timestamp)
        } catch (err) {
          if (!err.message.includes('UNIQUE constraint failed')) {
            throw err
          }
        }
      }
    }
    console.log('done upserting prices')

    let totalFeesUsd = 0

    for (let i = 0; i < this.days; i++) {
      const promises: any[] = []
      const now = DateTime.utc()
      const startDate = now.minus({ day: i + this.offsetDays }).startOf('day')
      const endDate = startDate.endOf('day')
      const startDateUnix = Math.floor(startDate.toSeconds())
      const endDateUnix = Math.floor(endDate.toSeconds())

      for (const token of this.tokens) {
        for (const chain of this.chains) {
          const config = (mainnetAddresses as any).bridges?.[token]?.[chain]
          if (!config) {
            continue
          }
          promises.push(
            (async () => {
              try {
                const tokenDecimals = getTokenDecimals(token)
                console.log('fetching token swaps', chain, token, i)
                const events = await this.fetchTokenSwaps(
                  chain,
                  token,
                  startDateUnix,
                  endDateUnix
                )
                let volume = BigNumber.from(0)
                for (const event of events) {
                  const amount = BigNumber.from(event.tokensSold)
                  volume = volume.add(amount)
                }
                const volumeFormatted = Number(
                  formatUnits(volume, tokenDecimals)
                )

                const oneToken = parseUnits('1', tokenDecimals)
                const lpFee = BigNumber.from(4)
                const lpFeeBN = parseUnits(lpFee.toString(), tokenDecimals)
                const fees = volume
                  .mul(lpFeeBN)
                  .div(oneToken)
                  .div(10000)

                const feesFormatted = Number(formatUnits(fees, tokenDecimals))

                if (!prices[token]) {
                  console.log('price not found', token)
                  return
                }

                const dates = prices[token].reverse().map((x: any) => x[0])
                const nearest = nearestDate(dates, startDateUnix)
                const price = prices[token][nearest][1]

                const volumeFormattedUsd = price * volumeFormatted
                const feesFormattedUsd = price * feesFormatted
                console.log(
                  startDate.toISO(),
                  startDateUnix,
                  chain,
                  token,
                  'events',
                  events.length,
                  'volume',
                  volumeFormatted,
                  'volume usd',
                  volumeFormattedUsd,
                  'fees',
                  feesFormatted,
                  'fees usd',
                  feesFormattedUsd
                )

                totalFeesUsd += feesFormattedUsd

                try {
                  console.log('upserting amm stat', chain, token, i)
                  this.db.upsertAmmStat(
                    chain,
                    token,
                    volumeFormatted,
                    volumeFormattedUsd,
                    feesFormatted,
                    feesFormattedUsd,
                    startDateUnix
                  )
                } catch (err) {
                  if (!err.message.includes('UNIQUE constraint failed')) {
                    console.log('error', chain, token)
                    throw err
                  }
                  console.error(err)
                }
                console.log(
                  `done fetching amm daily volume stats, chain: ${chain}, token: ${token}`
                )
              } catch (err) {
                console.error('amm stats error:', err)
              }
            })()
          )
        }
      }

      await Promise.all(promises)
    }

    console.log('totalFeesUsd', totalFeesUsd)
  }
}
