import { providers } from 'ethers';
import { PriceFeedFromS3 } from '#priceFeed/index.js';
export type Config = {
    network: string;
    accountAddress?: string;
};
export type MulticallBalance = {
    tokenSymbol: string;
    address: string;
    chainSlug: string;
    balance?: string;
    balanceFormatted?: string;
    balanceUsd?: string;
    tokenPrice?: string;
    error?: string;
};
export type TokenAddress = {
    tokenSymbol: string;
    address: string;
};
export type GetMulticallBalanceOptions = {
    abi?: any;
    method?: string;
    address?: string;
    tokenSymbol?: string;
    tokenDecimals?: number;
};
export type MulticallOptions = {
    address: string;
    abi: Array<any>;
    method: string;
    args: Array<any>;
};
export declare class Multicall {
    network: string;
    accountAddress?: string;
    priceFeed: PriceFeedFromS3;
    constructor(config: Config);
    getMulticallAddressForChain(chainSlug: string): string | null;
    getProvider(chainSlug: string): providers.Provider;
    getChains(): string[];
    getTokenAddressesForChain(chainSlug: string): TokenAddress[];
    getBalances(): Promise<MulticallBalance[]>;
    multicall(chainSlug: string, options: MulticallOptions[]): Promise<Array<any>>;
    getBalancesForChain(chainSlug: string, opts?: GetMulticallBalanceOptions[]): Promise<MulticallBalance[]>;
}
//# sourceMappingURL=Multicall.d.ts.map