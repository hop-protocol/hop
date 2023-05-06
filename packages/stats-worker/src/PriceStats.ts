import { PriceFeed } from './PriceFeed'

export class PriceStats {
  tokens: string[] = [
    'USDC',
    'USDT',
    'DAI',
    'ETH',
    'MATIC',
    'WBTC',
    'HOP',
    'SNX',
    'sUSD',
    'rETH'
  ]

  priceFeed: PriceFeed

  constructor () {
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
