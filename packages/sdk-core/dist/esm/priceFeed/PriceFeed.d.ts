export type PriceFeedApiKeys = {
    coingecko?: string;
};
interface Service {
    getPriceByTokenSymbol(symbol: string): Promise<number>;
}
export declare class PriceFeed {
    cacheTimeMs: number;
    apiKeys: PriceFeedApiKeys;
    services: Service[];
    timeoutMs: number;
    aliases: {
        [tokenSymbol: string]: string;
    };
    constructor(apiKeysMap?: PriceFeedApiKeys);
    setApiKeys(apiKeysMap?: PriceFeedApiKeys): void;
    private setServices;
    prependService(service: Service): void;
    getPriceByTokenSymbol(tokenSymbol: string): Promise<number>;
    _getPriceByTokenSymbol(tokenSymbol: string): Promise<number>;
    formatPrice(tokenSymbol: string, price: number): number;
}
export {};
//# sourceMappingURL=PriceFeed.d.ts.map