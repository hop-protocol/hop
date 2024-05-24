import { PriceFeed, type PriceFeedApiKeys } from './PriceFeed.js'
import { S3PriceFeed } from './priceFeeds/S3.js'

export class PriceFeedFromS3 {
  priceFeed: PriceFeed

  constructor (apiKeysMap: PriceFeedApiKeys = {}) {
    this.priceFeed = new PriceFeed(apiKeysMap)
    this.priceFeed.prependService(new S3PriceFeed())
  }

  setApiKeys (apiKeysMap: PriceFeedApiKeys = {}): void {
    this.priceFeed.setApiKeys(apiKeysMap)
  }

  async getPriceByTokenSymbol (tokenSymbol: string): Promise<number> {
    return this.priceFeed.getPriceByTokenSymbol(tokenSymbol)
  }
}
