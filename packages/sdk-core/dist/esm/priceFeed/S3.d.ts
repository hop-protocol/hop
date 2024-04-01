export declare class S3PriceFeed {
    private readonly url;
    stalenessLimitMs: number;
    getPriceByTokenSymbol: (symbol: string) => Promise<number>;
}
//# sourceMappingURL=S3.d.ts.map