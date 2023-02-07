import { BigNumber } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { DateTime } from 'luxon'
import Db from './Db'
import { PriceFeed } from './PriceFeed'
import { queryFetch } from './utils/queryFetch'
import { nearestDate } from './utils/nearestDate'
import { getTokenDecimals } from './utils/getTokenDecimals'

type Options = {
  regenesis?: boolean
  days?: number
}

export class AmmStats {
  db = new Db()
  regenesis: boolean = false
  days: number = 365
  priceFeed: PriceFeed

  constructor (options: Options = {}) {
    if (options.regenesis) {
      this.regenesis = options.regenesis
    }
    if (options.days) {
      this.days = options.days
    }

    this.priceFeed = new PriceFeed()

    process.once('uncaughtException', async err => {
      console.error('uncaughtException:', err)
      this.cleanUp()
      process.exit(0)
    })

    process.once('SIGINT', () => {
      this.cleanUp()
    })
  }

  cleanUp () {
    // console.log('closing db')
    // this.db.close()
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
    const url = this.getUrl(chain)
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

  getUrl (chain: string) {
    if (chain == 'gnosis') {
      chain = 'xdai'
    }

    if (this.regenesis) {
      return `http://localhost:8000/subgraphs/name/hop-protocol/hop-${chain}`
    }

    if (chain === 'nova') {
      return `https://nova.subgraph.hop.exchange/subgraphs/name/hop-protocol/hop-${chain}`
    } else {
      return `https://api.thegraph.com/subgraphs/name/hop-protocol/hop-${chain}`
    }
  }

  async trackAmm () {
    const daysN = 365
    console.log('fetching prices')

    const prices: any = {
      USDC: await this.priceFeed.getPriceHistory('USDC', daysN),
      USDT: await this.priceFeed.getPriceHistory('USDT', daysN),
      DAI: await this.priceFeed.getPriceHistory('DAI', daysN),
      ETH: await this.priceFeed.getPriceHistory('ETH', daysN),
      MATIC: await this.priceFeed.getPriceHistory('MATIC', daysN),
      WBTC: await this.priceFeed.getPriceHistory('WBTC', daysN),
      HOP: await this.priceFeed.getPriceHistory('HOP', daysN),
      SNX: await this.priceFeed.getPriceHistory('SNX', daysN)
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

    for (let i = 0; i < this.days; i++) {
      const promises: any[] = []
      const now = DateTime.utc()
      const startDate = now.minus({ day: i }).startOf('day')
      const endDate = now.endOf('day')
      const startDateUnix = Math.floor(startDate.toSeconds())
      const endDateUnix = Math.floor(endDate.toSeconds())

      const tokens = ['ETH', 'USDC', 'USDT', 'DAI', 'MATIC', 'SNX']
      const chains = ['polygon', 'gnosis', 'arbitrum', 'optimism', 'nova']
      for (const token of tokens) {
        for (const chain of chains) {
          if (
            token === 'MATIC' &&
            !['polygon', 'gnosis'].includes(chain)
          ) {
            continue
          }
          if (
            token === 'SNX' &&
            !['optimism'].includes(chain)
          ) {
            continue
          }
          promises.push(
            (async () => {
              const tokenDecimals = getTokenDecimals(token)
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
              const volumeFormatted = Number(formatUnits(volume, tokenDecimals))

              const oneToken = parseUnits('1')
              const lpFee = BigNumber.from(4)
              const lpFeeBN = parseUnits(lpFee.toString(), tokenDecimals)
              const fees = volume
                .mul(lpFeeBN)
                .div(oneToken)
                .div(10000)

              const feesFormatted = Number(formatUnits(fees, tokenDecimals))
              console.log(
                startDate.toISO(),
                startDateUnix,
                chain,
                token,
                'volume',
                volumeFormatted,
                'fees',
                feesFormatted,
                'events',
                events.length
              )

              if (!prices[token]) {
                console.log('price not found', token)
                return
              }

              const dates = prices[token].reverse().map((x: any) => x[0])
              const nearest = nearestDate(dates, startDateUnix)
              const price = prices[token][nearest][1]

              const volumeFormattedUsd = price * volumeFormatted
              const feesFormattedUsd = price * feesFormatted

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
              }
              console.log(
                `done fetching amm daily volume stats, chain: ${chain}, token: ${token}`
              )
            })()
          )
        }
      }
      await Promise.all(promises)
    }
  }
}
