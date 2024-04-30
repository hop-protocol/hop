import { CoinCodexPriceFeed } from './priceFeeds/CoinCodex.js'
import { CoinGeckoPriceFeed } from './priceFeeds/CoinGecko.js'
import { CoinbasePriceFeed } from './priceFeeds/Coinbase.js'
import { CoinpaprikaPriceFeed } from './priceFeeds/Coinpaprika.js'
import { promiseTimeout } from '#utils/index.js'

const cache: {
  [tokenSymbol: string]: Promise<any> | null
} = {}

const cacheTimestamps: {
  [tokenSymbol: string]: number | null
} = {}

export type PriceFeedApiKeys = {
  coingecko?: string
}

interface Service {
  getPriceByTokenSymbol(symbol: string): Promise<number>
}

export class PriceFeed {
  cacheTimeMs = 5 * 60 * 1000
  apiKeys: PriceFeedApiKeys = {}
  services: Service[] = []
  timeoutMs: number = 5 * 1000

  aliases: { [tokenSymbol: string]: string } = {
    'USDC.e': 'USDC',
    WETH: 'ETH',
    WMATIC: 'MATIC',
    WXDAI: 'DAI',
    XDAI: 'DAI'
  }

  constructor (apiKeysMap: PriceFeedApiKeys = {}) {
    if (apiKeysMap) {
      this.apiKeys = apiKeysMap
    }
    this.setServices()
  }

  setApiKeys (apiKeysMap: PriceFeedApiKeys = {}): void {
    this.apiKeys = apiKeysMap
    this.setServices()
  }

  private setServices (): void {
    this.services = [new CoinGeckoPriceFeed(this.apiKeys?.coingecko), new CoinbasePriceFeed(), new CoinpaprikaPriceFeed(), new CoinCodexPriceFeed()]
  }

  prependService (service: Service): void {
    this.services.unshift(service)
  }

  async getPriceByTokenSymbol (tokenSymbol: string): Promise<number> {
    if (this.aliases[tokenSymbol]) {
      tokenSymbol = this.aliases[tokenSymbol]
    }
    if (cache[tokenSymbol] != null && cacheTimestamps[tokenSymbol] != null) {
      const isRecent = cacheTimestamps[tokenSymbol]! > Date.now() - this.cacheTimeMs
      if (isRecent) {
        return cache[tokenSymbol]
      }
    }
    const promise = promiseTimeout(this._getPriceByTokenSymbol(tokenSymbol), this.timeoutMs)
    cache[tokenSymbol] = promise
    cacheTimestamps[tokenSymbol] = Date.now()
    const price = await promise
    if (price == null) {
      throw new Error(`null price for token "${tokenSymbol}"`)
    }
    return price
  }

  async _getPriceByTokenSymbol (tokenSymbol: string): Promise<number> {
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
    throw new Error('unreachable')
  }

  formatPrice (tokenSymbol: string, price: number): number {
    if (tokenSymbol === 'USDC' || tokenSymbol === 'USDT') {
      return Number(price.toFixed(6))
    }

    return price
  }
}
