import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { DateTime } from 'luxon'
import Db from './Db'

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
  ETH: 18
}

function sumAmounts (items: any) {
  let sum = BigNumber.from(0)
  for (let item of items) {
    const amount = BigNumber.from(item.amount)
    sum = sum.add(amount)
  }
  return sum
}

class TvlStats {
  db = new Db()

  constructor () {
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
    console.log('closing db')
    this.db.close()
  }

  getUrl (chain: string) {
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
    if (!jsonRes.data) {
      console.error(jsonRes)
    }
    return jsonRes.data
  }

  async fetchLiquidity (chain: string, startDate: number, endDate: number) {
    const query = `
      query PoolLiquidity($startDate: Int, $endDate: Int) {
        add: addLiquidities(
          where: {
            timestamp_gte: $startDate,
            timestamp_lte: $endDate,
          },
          orderBy: timestamp,
          orderDirection: desc,
          first: 1000
        ) {
          id
          tokenAmounts
          timestamp
          token
        },
        minus: removeLiquidities(
          where: {
            timestamp_gte: $startDate,
            timestamp_lte: $endDate,
          },
          orderBy: timestamp,
          orderDirection: desc,
          first: 1000
        ) {
          id
          tokenAmounts
          timestamp
          token
        }
      }
    `
    const url = this.getUrl(chain)
    const data = await this.queryFetch(url, query, {
      startDate,
      endDate
    })

    if (data.add.length > 1000 || data.minus.length > 1000) {
      throw new Error('here')
    }

    const totalAmounts: any = {}
    for (let item of data.add) {
      if (!totalAmounts[item.token]) {
        totalAmounts[item.token] = BigNumber.from(0)
      }
      totalAmounts[item.token] = totalAmounts[item.token].add(
        BigNumber.from(item.tokenAmounts[0])
      )
      totalAmounts[item.token] = totalAmounts[item.token].add(
        BigNumber.from(item.tokenAmounts[1])
      )
    }
    for (let item of data.minus) {
      if (!totalAmounts[item.token]) {
        totalAmounts[item.token] = BigNumber.from(0)
      }
      totalAmounts[item.token] = totalAmounts[item.token].sub(
        BigNumber.from(item.tokenAmounts[0])
      )
      totalAmounts[item.token] = totalAmounts[item.token].sub(
        BigNumber.from(item.tokenAmounts[1])
      )
    }

    return totalAmounts
  }

  async getPriceHistory (coinId: string, days: number) {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`
    return fetch(url)
      .then(res => res.json())
      .then(json =>
        json.prices.map((data: any[]) => {
          data[0] = Math.floor(data[0] / 1000)
          return data
        })
      )
  }

  async trackTvl () {
    const daysN = 365
    console.log('fetching prices')
    const pricesArr = await Promise.all([
      this.getPriceHistory('usd-coin', daysN),
      this.getPriceHistory('tether', daysN),
      this.getPriceHistory('dai', daysN),
      this.getPriceHistory('ethereum', daysN),
      this.getPriceHistory('matic-network', daysN),
      this.getPriceHistory('wrapped-bitcoin', daysN)
    ])
    console.log('done fetching prices')

    const prices: any = {
      USDC: pricesArr[0],
      USDT: pricesArr[1],
      DAI: pricesArr[2],
      ETH: pricesArr[3],
      MATIC: pricesArr[4],
      WBTC: pricesArr[5]
    }

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

    const chains = ['polygon', 'gnosis', 'arbitrum', 'optimism']
    const now = DateTime.utc()

    await Promise.all(
      chains.map(async (chain: string) => {
        for (let day = 0; day < daysN; day++) {
          const endDate = now.minus({ days: day }).endOf('day')
          const startDate = endDate.startOf('day')
          const endTimestamp = Math.floor(endDate.toSeconds())
          const startTimestamp = Math.floor(startDate.toSeconds())

          console.log(
            `fetching daily volume stats, chain: ${chain}, day: ${day}`
          )
          const totalAmounts = await this.fetchLiquidity(
            chain,
            startTimestamp,
            endTimestamp
          )
          for (let token in totalAmounts) {
            const totalAmount = totalAmounts[token]
            const decimals = tokenDecimals[token]
            const formattedAmount = Number(formatUnits(totalAmount, decimals))

            const dates = prices[token].reverse().map((x: any) => x[0])
            const nearest = nearestDate(dates, startDate)
            const price = prices[token][nearest][1]

            const usdAmount = price * formattedAmount
            try {
              this.db.upsertTvlPoolStat(
                chain,
                token,
                formattedAmount,
                usdAmount,
                startTimestamp
              )
            } catch (err) {
              if (!err.message.includes('UNIQUE constraint failed')) {
                throw err
              }
            }
          }
        }
        console.log(`done fetching daily volume stats, chain: ${chain}`)
      })
    )
  }
}

export default TvlStats
