"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceFeed = void 0;
const CoinCodex_js_1 = require("./CoinCodex.js");
const CoinGecko_js_1 = require("./CoinGecko.js");
const Coinbase_js_1 = require("./Coinbase.js");
const Coinpaprika_js_1 = require("./Coinpaprika.js");
const index_js_1 = require("#utils/index.js");
const cache = {};
const cacheTimestamps = {};
class PriceFeed {
    constructor(apiKeysMap = {}) {
        this.cacheTimeMs = 5 * 60 * 1000;
        this.apiKeys = {};
        this.services = [];
        this.timeoutMs = 5 * 1000;
        this.aliases = {
            'USDC.e': 'USDC',
            WETH: 'ETH',
            WMATIC: 'MATIC',
            WXDAI: 'DAI',
            XDAI: 'DAI'
        };
        if (apiKeysMap) {
            this.apiKeys = apiKeysMap;
        }
        this.setServices();
    }
    setApiKeys(apiKeysMap = {}) {
        this.apiKeys = apiKeysMap;
        this.setServices();
    }
    setServices() {
        this.services = [new CoinGecko_js_1.CoinGeckoPriceFeed(this.apiKeys?.coingecko), new Coinbase_js_1.CoinbasePriceFeed(), new Coinpaprika_js_1.CoinpaprikaPriceFeed(), new CoinCodex_js_1.CoinCodexPriceFeed()];
    }
    prependService(service) {
        this.services.unshift(service);
    }
    async getPriceByTokenSymbol(tokenSymbol) {
        if (this.aliases[tokenSymbol]) {
            tokenSymbol = this.aliases[tokenSymbol];
        }
        if (cache[tokenSymbol] != null && cacheTimestamps[tokenSymbol] != null) {
            const isRecent = cacheTimestamps[tokenSymbol] > Date.now() - this.cacheTimeMs;
            if (isRecent) {
                return cache[tokenSymbol];
            }
        }
        const promise = (0, index_js_1.promiseTimeout)(this._getPriceByTokenSymbol(tokenSymbol), this.timeoutMs);
        cache[tokenSymbol] = promise;
        cacheTimestamps[tokenSymbol] = Date.now();
        const price = await promise;
        if (price == null) {
            throw new Error(`null price for token "${tokenSymbol}"`);
        }
        return price;
    }
    async _getPriceByTokenSymbol(tokenSymbol) {
        const errors = [];
        for (const service of this.services) {
            try {
                const price = await service.getPriceByTokenSymbol(tokenSymbol);
                if (price == null) {
                    throw new Error(`null price for token "${tokenSymbol}"`);
                }
                const formattedPrice = this.formatPrice(tokenSymbol, price);
                if (formattedPrice <= 0) {
                    throw new Error(`received invalid price of "${formattedPrice}" for token "${tokenSymbol}"`);
                }
                return formattedPrice;
            }
            catch (err) {
                const isLastService = this.services.indexOf(service) === this.services.length - 1;
                errors.push(err.message);
                if (isLastService) {
                    cache[tokenSymbol] = null;
                    cacheTimestamps[tokenSymbol] = null;
                    throw new Error(`PriceFeed error(s): ${errors.join(' ')}`);
                }
            }
        }
        throw new Error('unreachable');
    }
    formatPrice(tokenSymbol, price) {
        if (tokenSymbol === 'USDC' || tokenSymbol === 'USDT') {
            return Number(price.toFixed(6));
        }
        return price;
    }
}
exports.PriceFeed = PriceFeed;
//# sourceMappingURL=PriceFeed.js.map