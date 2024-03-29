import { PriceFeed } from './PriceFeed.js'
import { tokens } from '@hop-protocol/core/metadata'

export class PriceStats {
  tokens: string[] = []
  priceFeed: PriceFeed

  constructor () {
    this.tokens = Object.keys(tokens)

    this.priceFeed = new PriceFeed()
  }

  async getPricesJson () {
    const json: any = {
      timestamp: Date.now(),
      prices: {}
    }

    for (const token of this.tokens) {
      json.prices[token] = null
      try {
        const price = await this.priceFeed.getPriceByTokenSymbol(token)
        json.prices[token] = price
      } catch (err) {
        console.error(
          `PriceStats: getPricesJson error for token "${token}"`,
          err
        )
      }
    }

    console.log(
      'PriceStats: getPricesJson result',
      JSON.stringify(json, null, 2)
    )

    return json
  }
}
