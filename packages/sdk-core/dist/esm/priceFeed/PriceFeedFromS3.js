import { PriceFeed } from './PriceFeed.js';
import { S3PriceFeed } from './S3.js';
export class PriceFeedFromS3 {
    constructor(apiKeysMap = {}) {
        this.priceFeed = new PriceFeed(apiKeysMap);
        this.priceFeed.prependService(new S3PriceFeed());
    }
    setApiKeys(apiKeysMap = {}) {
        this.priceFeed.setApiKeys(apiKeysMap);
    }
    async getPriceByTokenSymbol(tokenSymbol) {
        return this.priceFeed.getPriceByTokenSymbol(tokenSymbol);
    }
}
//# sourceMappingURL=PriceFeedFromS3.js.map