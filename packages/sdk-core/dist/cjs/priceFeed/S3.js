"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3PriceFeed = void 0;
const index_js_1 = require("#utils/index.js");
class S3PriceFeed {
    constructor() {
        this.url = 'https://assets.hop.exchange/token-prices.json';
        this.stalenessLimitMs = 10 * 60 * 1000;
        this.getPriceByTokenSymbol = async (symbol) => {
            const data = await (0, index_js_1.fetchJsonOrThrow)(this.url);
            for (const key in data.prices) {
                if (key.toUpperCase() === symbol.toUpperCase()) {
                    const isOk = data.timestamp > Date.now() - this.stalenessLimitMs;
                    if (isOk) {
                        return data.prices[key];
                    }
                }
            }
            throw new Error(`Price not found for ${symbol}`);
        };
    }
}
exports.S3PriceFeed = S3PriceFeed;
//# sourceMappingURL=S3.js.map