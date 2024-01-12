import { PriceFeed as PriceFeedSdk } from '@hop-protocol/sdk'
import { coingeckoApiKey } from './config'
import { tokens } from '@hop-protocol/core/metadata'

function getCoinId (tokenSymbol: string) {
  return (tokens as any)[tokenSymbol]?.coingeckoId
}

const cache: {
  [tokenSymbol: string]: Promise<any>
} = {}

const cacheTimestamps: {
  [tokenSymbol: string]: number
} = {}

export class PriceFeed {
  cacheTimeMs = 5 * 60 * 1000

  instance: PriceFeedSdk

  constructor () {
    this.instance = new PriceFeedSdk({
      coingecko: coingeckoApiKey
    })
  }

  async getPriceByTokenSymbol (tokenSymbol: string): Promise<number> {
    const price = await this.instance.getPriceByTokenSymbol(tokenSymbol)
    return price
  }

  async getPriceHistory (tokenSymbol: string, days: number) {
    const cacheKey = `${tokenSymbol}:${days}`
    if (cache[cacheKey] != null && cacheTimestamps[cacheKey] != null) {
      const isRecent = cacheTimestamps[cacheKey] > Date.now() - this.cacheTimeMs
      if (isRecent) {
        return cache[cacheKey]
      }
    }
    const promise = this._getPriceHistory(tokenSymbol, days)
    cache[cacheKey] = promise
    cacheTimestamps[cacheKey] = Date.now()
    return promise
  }

  async _getPriceHistory (tokenSymbol: string, days: number) {
    const coinId = getCoinId(tokenSymbol)
    if (!coinId) {
      throw new Error(`coinId not found for token symbol "${tokenSymbol}"`)
    }

    let baseUrl
    if (coingeckoApiKey) {
      baseUrl = 'https://pro-api.coingecko.com'
    } else {
      baseUrl = 'https://api.coingecko.com'
    }
    const url = `${baseUrl}/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily&x_cg_pro_api_key=${coingeckoApiKey}`

    return fetch(url)
      .then((res: any) => res.json())
      .then((json: any) => {
        if (!json.prices) {
          console.log(json)
          throw new Error(`got api error: ${JSON.stringify(json)}`)
        }
        return json.prices.map((data: any[]) => {
          data[0] = Math.floor(data[0] / 1000)
          return data
        })
      })
  }
}
