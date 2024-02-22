import { fetchJsonOrThrow } from '../utils/fetchJsonOrThrow'

export class S3PriceFeed {
  private readonly url: string = 'https://assets.hop.exchange/token-prices.json'
  stalenessLimitMs: number = 10 * 60 * 1000

  public getPriceByTokenSymbol = async (symbol: string): Promise<number> => {
    const data = await fetchJsonOrThrow(this.url)
    for (const key in data.prices) {
      if (key.toUpperCase() === symbol.toUpperCase()) {
        const isOk = data.timestamp > Date.now() - this.stalenessLimitMs
        if (isOk) {
          return data.prices[key]
        }
      }
    }

    throw new Error(`Price not found for ${symbol}`)
  }
}
