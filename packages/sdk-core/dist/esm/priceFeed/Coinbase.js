import { fetchJsonOrThrow } from '#utils/index.js';
export class CoinbasePriceFeed {
    constructor() {
        this._baseUrl = 'https://api.pro.coinbase.com';
        this.getPriceByTokenSymbol = async (symbol, base = 'USD') => {
            const url = `${this._baseUrl}/products/${symbol}-${base}/ticker`;
            const json = await fetchJsonOrThrow(url);
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
//# sourceMappingURL=Coinbase.js.map