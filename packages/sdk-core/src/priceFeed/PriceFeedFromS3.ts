import { PriceFeed, PriceFeedApiKeys } from './PriceFeed'
import { S3PriceFeed } from './S3'

export class PriceFeedFromS3 {
  priceFeed: PriceFeed

  constructor (apiKeysMap: PriceFeedApiKeys = {}) {
    this.priceFeed = new PriceFeed(apiKeysMap)
    this.priceFeed.prependService(new S3PriceFeed())
  }

  setApiKeys (apiKeysMap: PriceFeedApiKeys = {}) {
    this.priceFeed.setApiKeys(apiKeysMap)
  }

  async getPriceByTokenSymbol (tokenSymbol: string): Promise<number> {
    return this.priceFeed.getPriceByTokenSymbol(tokenSymbol)
  }
}
