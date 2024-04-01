import { fetchJsonOrThrow } from '#utils/index.js';
export class S3PriceFeed {
    constructor() {
        this.url = 'https://assets.hop.exchange/token-prices.json';
        this.stalenessLimitMs = 10 * 60 * 1000;
        this.getPriceByTokenSymbol = async (symbol) => {
            const data = await fetchJsonOrThrow(this.url);
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
//# sourceMappingURL=S3.js.map