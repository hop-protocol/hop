interface Chain {
    name: string;
    chainId: number;
    rpcUrl: string;
    fallbackRpcUrls?: string[];
    explorerUrl: string;
    subgraphUrl: string;
    etherscanApiUrl?: string;
    multicall?: string;
}
export interface Chains {
    [key: string]: Partial<Chain>;
}
export declare const metadata: any;
declare const config: any;
export declare const bondableChains: string[];
export declare const rateLimitMaxRetries = 3;
export declare const rpcTimeoutSeconds = 60;
export { config };
//# sourceMappingURL=config.d.ts.map