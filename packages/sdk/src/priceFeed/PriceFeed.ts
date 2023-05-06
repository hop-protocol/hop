import { CoinCodex } from './CoinCodex'
import { CoinGecko } from './CoinGecko'
import { Coinbase } from './Coinbase'
import { Coinpaprika } from './Coinpaprika'

const cache: {
  [tokenSymbol: string]: Promise<any>
} = {}

const cacheTimestamps: {
  [tokenSymbol: string]: number
} = {}

export type ApiKeys = {
  coingecko?: string
}

interface Service {
  getPriceByTokenSymbol(symbol: string): Promise<number>
}

export class PriceFeed {
  cacheTimeMs = 5 * 60 * 1000
  apiKeys: ApiKeys = {}
  services: Service[] = []

  aliases: { [tokenSymbol: string]: string } = {
    WETH: 'ETH',
    WMATIC: 'MATIC',
    WXDAI: 'DAI',
    XDAI: 'DAI'
  }

  constructor (apiKeysMap: ApiKeys = {}) {
    if (apiKeysMap) {
      this.apiKeys = apiKeysMap
    }
    this.setServices()
  }

  setApiKeys (apiKeysMap: ApiKeys = {}) {
    this.apiKeys = apiKeysMap
    this.setServices()
  }

  private setServices () {
    this.services = [new CoinGecko(this.apiKeys?.coingecko), new Coinbase(), new Coinpaprika(), new CoinCodex()]
  }

  prependService (service: Service) {
    this.services.unshift(service)
  }

  async getPriceByTokenSymbol (tokenSymbol: string) {
    if (this.aliases[tokenSymbol]) {
      tokenSymbol = this.aliases[tokenSymbol]
    }
    if (cache[tokenSymbol] && cacheTimestamps[tokenSymbol]) {
      const isRecent = cacheTimestamps[tokenSymbol] > Date.now() - this.cacheTimeMs
      if (isRecent) {
        return cache[tokenSymbol]
      }
    }
    const promise = this._getPriceByTokenSymbol(tokenSymbol)
    cache[tokenSymbol] = promise
    cacheTimestamps[tokenSymbol] = Date.now()
    return promise
  }

  async _getPriceByTokenSymbol (tokenSymbol: string) {
    const errors: Error[] = []
    for (const service of this.services) {
      try {
        const price = await service.getPriceByTokenSymbol(tokenSymbol)
        if (price == null) {
          throw new Error(`null price for token "${tokenSymbol}"`)
        }
        const formattedPrice = this.formatPrice(tokenSymbol, price)
        if (formattedPrice <= 0) {
          throw new Error(`received invalid price of "${formattedPrice}" for token "${tokenSymbol}"`)
        }
        return formattedPrice
      } catch (err) {
        const isLastService = this.services.indexOf(service) === this.services.length - 1
        errors.push(err.message)
        if (isLastService) {
          cache[tokenSymbol] = null
          cacheTimestamps[tokenSymbol] = null
          throw new Error(`PriceFeed error(s): ${errors.join(' ')}`)
        }
      }
    }
  }

  formatPrice (tokenSymbol: string, price: number) {
    if (tokenSymbol === 'USDC' || tokenSymbol === 'USDT') {
      return Number(price.toFixed(6))
    }

    return price
  }
}

export default PriceFeed
