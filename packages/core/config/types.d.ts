declare type Bps = {
    ethereum?: number;
    polygon?: number;
    xdai?: number;
    optimism?: number;
    arbitrum?: number;
};
export declare type Fees = {
    USDC?: Bps;
    USDT?: Bps;
    DAI?: Bps;
    MATIC?: Bps;
    ETH?: Bps;
    WBTC?: Bps;
};
export declare type Config = {
    bonderFeeBps: Fees;
    destinationFeeGasPriceMultiplier: number;
};
export {};
//# sourceMappingURL=types.d.ts.map