import CoinGecko from './CoinGecko'

class PriceFeed {
  private service = new CoinGecko()
  cache : {[tokenSymbol: string]: {
    timestamp: number
    price: number
  }} = {}

  async getPriceByTokenSymbol (tokenSymbol: string) {
    const cached = this.cache[tokenSymbol]
    if (cached) {
      const tenMinutes = 10 * 60 * 1000
      const isRecent = cached.timestamp > Date.now() - tenMinutes
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
