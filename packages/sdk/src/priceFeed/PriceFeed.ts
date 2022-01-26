import CoinGecko from './CoinGecko'
import Coinbase from './Coinbase'

class PriceFeed {
  private readonly services = [new CoinGecko(), new Coinbase()]
  cacheTimeMs = 5 * 60 * 1000

  cache: {
    [tokenSymbol: string]: {
      timestamp: number
      price: number
    }
  } = {}

  aliases: { [tokenSymbol: string]: string } = {
    WETH: 'ETH',
    WMATIC: 'MATIC',
    XDAI: 'DAI',
    WXDAI: 'DAI'
  }

  async getPriceByTokenSymbol (tokenSymbol: string) {
    if (this.aliases[tokenSymbol]) {
      tokenSymbol = this.aliases[tokenSymbol]
    }

    const cached = this.cache[tokenSymbol]
    if (cached) {
      const isRecent = cached.timestamp > Date.now() - this.cacheTimeMs
      if (isRecent) {
        return cached.price
      }
    }

    const errors: Error[] = []
    for (const service of this.services) {
      try {
        const price = await service.getPriceByTokenSymbol(tokenSymbol)
        if (price === null) {
          throw new Error(`null price for ${tokenSymbol}`)
        }
        this.cache[tokenSymbol] = {
          timestamp: Date.now(),
          price
        }
        return price
      } catch (err) {
        const isLastService = this.services.indexOf(service) === this.services.length - 1
        errors.push(err.message)
        if (isLastService) {
          throw new Error(`PriceFeed error(s): ${errors.join(' ')}`)
        }
      }
    }
  }
}

export default PriceFeed
