import fetch from 'isomorphic-fetch'
import { formatUnits } from 'ethers/lib/utils'
import { DateTime } from 'luxon'
import Db from './Db'

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

const tokenDecimals: any = {
  USDC: 6,
  USDT: 6,
  DAI: 18,
  MATIC: 18,
  ETH: 18
}

type Options = {}

class TransferStats {
  db = new Db()
  regenesis = false

  constructor (options: Options = {}) {
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
    if (chain === 'gnosis') {
      chain = 'xdai'
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

  async fetchTransfers (chain: string, startDate: number) {
    const query = `
      query Transfers($startDate: String, $endDate: String) {
        events: transferSents(
          where: {
            timestamp_gte: $startDate,
          },
          orderBy: timestamp,
          orderDirection: desc,
          first: 1000
        ) {
          id
          amount
          token
          timestamp
        }
      }
    `
    const url = this.getUrl(chain)
    const data = await this.queryFetch(url, query, {
      startDate: startDate?.toString()
    })

    if (!data) {
      return []
    }

    const items = data.events

    try {
      if (items.length === 1000) {
        startDate = items[0].timestamp
        items.push(...(await this.fetchTransfers(chain, startDate)))
      }
    } catch (err) {
      console.error(err)
    }

    return items
  }

  async getPriceHistory (coinId: string, days: number) {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`
    return fetch(url)
      .then((res: any) => res.json())
      .then((json: any) =>
        json.prices.map((data: any[]) => {
          data[0] = Math.floor(data[0] / 1000)
          return data
        })
      )
  }

  async trackTransfers () {
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
    for (const token in prices) {
      for (const data of prices[token]) {
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

        console.log(`fetching transfers, chain: ${chain}`)
        const items = await this.fetchTransfers(chain, startDate)
        for (const item of items) {
          const amount = item.amount
          const timestamp = Number(item.timestamp)
          const token = item.token
          const decimals = tokenDecimals[token]
          const formattedAmount = Number(formatUnits(amount, decimals))

          const dates = prices[token].reverse().map((x: any) => x[0])
          const nearest = nearestDate(dates, timestamp)
          const price = prices[token][nearest][1]

          const usdAmount = price * formattedAmount
          console.log(timestamp, token, chain, amount)
          try {
            this.db.upsertTransfer(
              chain,
              token,
              formattedAmount,
              usdAmount,
              timestamp
            )
          } catch (err) {
            if (!err.message.includes('UNIQUE constraint failed')) {
              throw err
            }
          }
        }
        console.log(`done fetching daily volume stats, chain: ${chain}`)
      })
    )
  }
}

export default TransferStats
