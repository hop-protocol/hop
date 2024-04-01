"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinCodexPriceFeed = void 0;
const index_js_1 = require("#utils/index.js");
class CoinCodexPriceFeed {
    constructor() {
        this._baseUrl = 'https://coincodex.com/api/coincodex';
        this.getPriceByTokenSymbol = async (symbol, base = 'USD') => {
            symbol = symbol.toUpperCase();
            if (symbol === 'WBTC') {
                symbol = 'BTC';
            }
            if (symbol === 'WETH') {
                symbol = 'ETH';
            }
            if (symbol === 'WMATIC') {
                symbol = 'MATIC';
            }
            if (symbol === 'XDAI') {
                symbol = 'DAI';
            }
            if (symbol === 'WXDAI') {
                symbol = 'DAI';
            }
            const id = symbol.toLowerCase();
            if (!id) {
                throw new Error(`id mapping not found for "${symbol}"`);
            }
            const url = `${this._baseUrl}/get_coin/${id}`;
            const json = await (0, index_js_1.fetchJsonOrThrow)(url);
            const value = json?.last_price_usd;
            if (!value) {
                throw new Error(`coincodex: "${symbol}": invalid price response`);
            }
            const price = Number(value);
            if (Number.isNaN(price)) {
                throw new Error('coincodex: invalid price (not a number)');
            }
            return price;
        };
    }
}
exports.CoinCodexPriceFeed = CoinCodexPriceFeed;
//# sourceMappingURL=CoinCodex.js.map