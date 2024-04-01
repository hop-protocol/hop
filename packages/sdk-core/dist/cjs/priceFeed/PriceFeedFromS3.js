"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceFeedFromS3 = void 0;
const PriceFeed_js_1 = require("./PriceFeed.js");
const S3_js_1 = require("./S3.js");
class PriceFeedFromS3 {
    constructor(apiKeysMap = {}) {
        this.priceFeed = new PriceFeed_js_1.PriceFeed(apiKeysMap);
        this.priceFeed.prependService(new S3_js_1.S3PriceFeed());
    }
    setApiKeys(apiKeysMap = {}) {
        this.priceFeed.setApiKeys(apiKeysMap);
    }
    async getPriceByTokenSymbol(tokenSymbol) {
        return this.priceFeed.getPriceByTokenSymbol(tokenSymbol);
    }
}
exports.PriceFeedFromS3 = PriceFeedFromS3;
//# sourceMappingURL=PriceFeedFromS3.js.map