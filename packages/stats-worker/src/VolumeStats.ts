import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { DateTime } from 'luxon'
import Db from './Db'
import { PriceFeed } from './PriceFeed'

function nearestDate (dates: any[], target: any) {
  if (!target) {
    target = Date.now()
  } else if (target instanceof Date) {
    target = target.getTime()
  }

  var nearest = Infinity
  var winner = -1

  dates.forEach(function (date, index) {
    if (date instanceof Date) date = date.getTime()
    var distance = Math.abs(date - target)
    if (distance < nearest) {
      nearest = distance
      winner = index
    }
  })

  return winner
}

const tokenDecimals: any = {
  USDC: 6,
  USDT: 6,
  DAI: 18,
  MATIC: 18,
  ETH: 18,
  HOP: 18,
  SNX: 18
}

function sumAmounts (items: any) {
  let sum = BigNumber.from(0)
  for (let item of items) {
    const amount = BigNumber.from(item.amount)
    sum = sum.add(amount)
  }
  return sum
}

type Options = {
  regenesis?: boolean
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
    return jsonRes.data
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
    const url = this.getUrl(chain)
    const data = await this.queryFetch(url, query, {
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

    let chains = ['polygon', 'gnosis', 'arbitrum', 'optimism', 'mainnet']
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
          const decimals = tokenDecimals[token]
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
              chain,
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
