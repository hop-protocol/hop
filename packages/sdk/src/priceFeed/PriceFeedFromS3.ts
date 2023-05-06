import { ApiKeys, PriceFeed } from './PriceFeed'
import { S3 } from './S3'

export class PriceFeedFromS3 {
  priceFeed: PriceFeed

  constructor (apiKeysMap: ApiKeys = {}) {
    this.priceFeed = new PriceFeed(apiKeysMap)
    this.priceFeed.prependService(new S3())
  }

  setApiKeys (apiKeysMap: ApiKeys = {}) {
    this.priceFeed.setApiKeys(apiKeysMap)
  }

  async getPriceByTokenSymbol (tokenSymbol: string) {
    return this.priceFeed.getPriceByTokenSymbol(tokenSymbol)
  }
}
