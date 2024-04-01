interface IResult {
    id: string;
    symbol: string;
    name: string;
    image: string;
    priceUsd: number;
}
export declare class CoinGeckoPriceFeed {
    apiKey: string;
    private _baseUrl;
    private _maxPerPage;
    private _maxPages;
    private _tokenSymbolAddressMap;
    constructor(apiKey?: string);
    getPriceByTokenSymbol: (tokenSymbol: string, base?: string) => Promise<number>;
    _getPriceByTokenSymbol(tokenSymbol: string, base?: string): Promise<number | null>;
    getPricesByTokenSymbol: (symbols: string[], base?: string) => Promise<Array<number | null>>;
    getPricesByTokenAddresses: (allAddresses: string[], base?: string) => Promise<Array<number | null>>;
    getAllTokenPrices: (base?: string) => Promise<IResult[]>;
    private _normalizePrice;
}
export {};
//# sourceMappingURL=CoinGecko.d.ts.map