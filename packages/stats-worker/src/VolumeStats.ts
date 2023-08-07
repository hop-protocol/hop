import { formatUnits } from 'ethers/lib/utils'
import { DateTime } from 'luxon'
import Db from './Db'
import { PriceFeed } from './PriceFeed'
import { queryFetch } from './utils/queryFetch'
import { nearestDate } from './utils/nearestDate'
import { getTokenDecimals } from './utils/getTokenDecimals'
import { getSubgraphUrl } from './utils/getSubgraphUrl'
import { enabledTokens, enabledChains } from './config'

type Options = {
  regenesis?: boolean
  days?: number
}

class VolumeStats {
  db = new Db()
  regenesis: boolean = false
  priceFeed: PriceFeed

  constructor (options: Options = {}) {
    if (options.regenesis) {
      this.regenesis = options.regenesis
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

  async fetchDailyVolume (chain: string, startDate: number) {
    const query = `
      query DailyVolume($startDate: Int, $endDate: Int) {
        dailyVolumes(
          where: {
            date_gte: $startDate,
          },
          orderBy: date,
          orderDirection: desc,
          first: 1000
        ) {
          id
          amount
          date
          token
        }
      }
    `
    const url = getSubgraphUrl(chain)
    const data = await queryFetch(url, query, {
      startDate
    })

    if (!data) {
      return []
    }

    let items = data.dailyVolumes

    try {
      if (items.length === 1000) {
        startDate = items[0].date
        items.push(...(await this.fetchDailyVolume(chain, startDate)))
      }
    } catch (err) {
      console.error(err)
    }

    return items
  }

  async trackDailyVolume () {
    const daysN = 365
    console.log('fetching prices')

    const prices: Record<string, any> = {}

    for (const token of enabledTokens) {
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

    let chains = enabledChains
    if (this.regenesis) {
      chains = ['optimism']
    }

    const now = Math.floor(DateTime.utc().toSeconds())

    await Promise.all(
      chains.map(async (chain: string) => {
        const startDate = now - (daysN - 1) * 24 * 60 * 60

        console.log(`fetching daily volume stats, chain: ${chain}`)
        const items = await this.fetchDailyVolume(chain, startDate)
        for (let item of items) {
          const amount = item.amount
          const timestamp = item.date
          const token = item.token
          const decimals = getTokenDecimals(token)
          const formattedAmount = Number(formatUnits(amount, decimals))
          if (!prices[token]) {
            console.log('not found', token)
            return
          }

          const dates = prices[token].reverse().map((x: any) => x[0])
          const nearest = nearestDate(dates, timestamp)
          const price = prices[token][nearest][1]

          const usdAmount = price * formattedAmount
          try {
            this.db.upsertVolumeStat(
              chain === 'ethereum' ? 'mainnet' : chain, // backwards compatibility name
              token,
              formattedAmount,
              usdAmount,
              timestamp
            )
          } catch (err) {
            if (!err.message.includes('UNIQUE constraint failed')) {
              console.log('error', chain, item.token)
              throw err
            }
          }
        }
        console.log(`done fetching daily volume stats, chain: ${chain}`)
      })
    )
  }
}

export default VolumeStats
