export interface TokenAddresses {
    MOCK: string;
    USDC: string;
}
export interface ChainConfig {
    chainId: string;
    startBlock?: number;
    hubCoreMessenger?: string;
    spokeCoreMessenger?: string;
    ethFeeDistributor?: string;
    railsGateway?: string;
    dispatcher?: string;
    executor?: string;
    connector?: string;
    tokens?: TokenAddresses;
}
export interface Addresses {
    [chainId: string]: ChainConfig;
}
//# sourceMappingURL=types.d.ts.map