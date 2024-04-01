"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinbasePriceFeed = void 0;
const index_js_1 = require("#utils/index.js");
class CoinbasePriceFeed {
    constructor() {
        this._baseUrl = 'https://api.pro.coinbase.com';
        this.getPriceByTokenSymbol = async (symbol, base = 'USD') => {
            const url = `${this._baseUrl}/products/${symbol}-${base}/ticker`;
            const json = await (0, index_js_1.fetchJsonOrThrow)(url);
            const value = json.price;
            if (!value) {
                if (json.message) {
                    throw new Error(`coinbase: "${symbol}": ${json.message}`);
                }
                throw new Error(`coinbase: "${symbol}": invalid price response`);
            }
            const price = Number(value);
            if (Number.isNaN(price)) {
                throw new Error('coinbase: invalid price (not a number)');
            }
            return price;
        };
    }
}
exports.CoinbasePriceFeed = CoinbasePriceFeed;
//# sourceMappingURL=Coinbase.js.map