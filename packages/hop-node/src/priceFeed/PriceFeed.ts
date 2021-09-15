import CoinGecko from './CoinGecko'

class PriceFeed {
  private service = new CoinGecko()
  cacheTimeMs = 5 * 60 * 1000

  cache : {[tokenSymbol: string]: {
    timestamp: number
    price: number
  }} = {}

  async getPriceByTokenSymbol (tokenSymbol: string) {
    const cached = this.cache[tokenSymbol]
    if (cached) {
      const isRecent = cached.timestamp > Date.now() - this.cacheTimeMs
      if (isRecent) {
        return cached.price
      }
    }
    const price = await this.service.getPriceByTokenSymbol(tokenSymbol)
    this.cache[tokenSymbol] = {
      timestamp: Date.now(),
      price
    }
    return price
  }
}

export default PriceFeed
