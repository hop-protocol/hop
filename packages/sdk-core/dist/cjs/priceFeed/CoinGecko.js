"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinGeckoPriceFeed = void 0;
const index_js_1 = require("#utils/index.js");
const metadata_1 = require("@hop-protocol/core/metadata");
function getCoinId(tokenSymbol) {
    return metadata_1.tokens[tokenSymbol]?.coingeckoId;
}
class CoinGeckoPriceFeed {
    constructor(apiKey) {
        this._baseUrl = 'https://api.coingecko.com/api/v3';
        this._maxPerPage = 100;
        this._maxPages = 40;
        // note: all symbols should be uppercased since it does key lookup
        this._tokenSymbolAddressMap = {
            DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
            ETH: '0x0000000000000000000000000000000000000000',
            GNO: '0x6810e776880C02933D47DB1b9fc05908e5386b96',
            HOP: '0xc5102fE9359FD9a28f877a67E36B0F050d81a3CC',
            MATIC: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
            MAGIC: '0xb0c7a3ba49c7a6eaba6cd4a96c55a1391070ac9a',
            RETH: '0xae78736cd615f374d3085123a210448e74fc6393',
            RPL: '0xd33526068d116ce69f19a9ee46f0bd304f21a51f',
            SNX: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
            SUSD: '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51',
            TUSD: '0x0000000000085d4780B73119b644AE5ecd22b376',
            USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
            WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            UNI: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
            ARB: '0xb50721bcf8d664c30412cfbc6cf7a15145234ad1',
            FRAX: '0x853d955acef822db058eb8505911ed77f175b99e',
            SETH: '0x5e74c9036fb86bd7ecdcb084a0673efc32ea31cb',
            SBTC: '0xfe18be6b3bd88a2d2a7f928d00292e7a9963cfc6'
        };
        this.getPriceByTokenSymbol = async (tokenSymbol, base = 'usd') => {
            let symbol = tokenSymbol;
            if (symbol === 'ETH') {
                symbol = 'WETH';
            }
            if (['WXDAI', 'XDAI'].includes(symbol)) {
                symbol = 'DAI';
            }
            if (symbol === 'WMATIC') {
                symbol = 'MATIC';
            }
            if (symbol === 'BTC') {
                symbol = 'WBTC';
            }
            const coinId = getCoinId(tokenSymbol);
            if (coinId) {
                const price = await this._getPriceByTokenSymbol(tokenSymbol);
                if (price == null) {
                    throw new Error('price not found');
                }
                return price;
            }
            else {
                const prices = await this.getPricesByTokenSymbol([symbol], base);
                const price = prices[0];
                if (price == null) {
                    throw new Error('price not found');
                }
                return price;
            }
        };
        this.getPricesByTokenSymbol = async (symbols, base = 'usd') => {
            const addresses = [];
            for (let i = 0; i < symbols.length; i++) {
                const address = this._tokenSymbolAddressMap[symbols[i].toUpperCase()];
                if (!address) {
                    throw new Error('not found');
                }
                addresses.push(address);
            }
            const prices = await this.getPricesByTokenAddresses(addresses, base);
            return prices;
        };
        this.getPricesByTokenAddresses = async (allAddresses, base = 'usd') => {
            let page = 0;
            const limit = 100; // max addresses allowed per request
            const allResults = [];
            if (!allAddresses.length) {
                return allResults;
            }
            const getTokens = async (addresses) => {
                const params = (0, index_js_1.serializeQueryParams)({
                    contract_addresses: addresses.join(','),
                    vs_currencies: base,
                    include_market_cap: false,
                    include_24hr_vol: false,
                    include_24hr_change: false,
                    include_last_updated_at: false,
                    x_cg_pro_api_key: this.apiKey
                });
                const url = `${this._baseUrl}/simple/token_price/ethereum?${params}`;
                const json = await (0, index_js_1.fetchJsonOrThrow)(url);
                const prices = [];
                for (let i = 0; i < addresses.length; i++) {
                    try {
                        const address = addresses[i];
                        const item = json[address.toLowerCase()];
                        if (!item) {
                            throw new Error('not found');
                        }
                        const price = this._normalizePrice(item[base]);
                        prices.push(price);
                    }
                    catch (err) {
                        prices.push(null);
                    }
                }
                return prices;
            };
            while (page * limit < allAddresses.length) {
                const startIdx = page * limit;
                const addresses = allAddresses.slice(startIdx, startIdx + limit);
                allResults.push(...(await getTokens(addresses)));
                await (0, index_js_1.wait)(250);
                page++;
            }
            return allResults;
        };
        this.getAllTokenPrices = async (base = 'usd') => {
            let currentPage = 1;
            const allResults = [];
            const getTokens = async (page) => {
                const params = (0, index_js_1.serializeQueryParams)({
                    vs_currency: base,
                    order: 'market_cap_desc',
                    per_page: this._maxPerPage,
                    page: page,
                    sparkline: false,
                    x_cg_pro_api_key: this.apiKey
                });
                const url = `${this._baseUrl}/coins/markets?${params}`;
                const res = await fetch(url);
                const json = await res.json();
                if (!Array.isArray(json)) {
                    throw new Error('expected array');
                }
                const results = [];
                for (let i = 0; i < json.length; i++) {
                    const token = json[i];
                    try {
                        const symbol = token.symbol.toUpperCase();
                        results.push({
                            id: token.id,
                            symbol,
                            name: token.name,
                            image: token.image,
                            priceUsd: this._normalizePrice(token.current_price)
                        });
                    }
                    catch (err) {
                        console.error(err);
                    }
                }
                return results;
            };
            while (currentPage < this._maxPages) {
                allResults.push(...(await getTokens(currentPage)));
                await (0, index_js_1.wait)(250);
                currentPage++;
            }
            return allResults;
        };
        this._normalizePrice = (price) => {
            price = Number(price);
            // If the API call did not return a number, throw an error
            if (Number.isNaN(price)) {
                throw new Error('invalid price');
            }
            return price;
        };
        if (apiKey) {
            this.apiKey = apiKey;
            this._baseUrl = 'https://pro-api.coingecko.com/api/v3';
        }
    }
    async _getPriceByTokenSymbol(tokenSymbol, base = 'usd') {
        try {
            const coinId = getCoinId(tokenSymbol);
            const params = {
                ids: coinId,
                vs_currencies: base,
                include_market_cap: false,
                include_24hr_vol: false,
                include_24hr_change: false,
                include_last_updated_at: false,
                x_cg_pro_api_key: this.apiKey
            };
            let qs = '';
            for (const key in params) {
                qs += `${key}=${params[key]}&`;
            }
            const url = `${this._baseUrl}/simple/price?${qs}`;
            const res = await fetch(url);
            const json = await res.json();
            const price = this._normalizePrice(json[coinId][base]);
            return price;
        }
        catch (err) {
            return null;
        }
    }
}
exports.CoinGeckoPriceFeed = CoinGeckoPriceFeed;
//# sourceMappingURL=CoinGecko.js.map