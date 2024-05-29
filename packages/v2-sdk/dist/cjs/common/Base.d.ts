import { BigNumber, BigNumberish, Signer, providers } from 'ethers';
import { Addresses } from '#addresses/types.js';
type Provider = providers.Provider;
export type TxOverrides = {
    gasLimit?: BigNumber;
    gasPrice?: BigNumber;
    nonce?: BigNumber;
    chainId?: BigNumber;
};
export type ChainProviders = {
    [key: string]: providers.Provider;
};
export type BaseConfig = {
    network: string;
    signer?: Signer;
    gasPriceMultiplier?: number;
    chainProviders?: ChainProviders;
    contractAddresses?: Addresses;
};
export declare class Base {
    network: string;
    signer: Signer;
    gasPriceMultiplier: number;
    contractAddresses: Addresses;
    l1ChainId: number;
    chainProviders: ChainProviders;
    constructor(config: BaseConfig);
    getContractAddresses(): Addresses;
    setContractAddresses(contractAddresses: Addresses): void;
    getDefaultChainRpcProvider(chainId: BigNumberish): providers.Provider;
    getDefaultChainRpcProviders(): ChainProviders;
    connect(signer: Signer): Base;
    setChainRpcProvider(chainId: BigNumberish, provider: Provider): void;
    setChainRpcProviders(chainProviders: ChainProviders): void;
    setChainRpcProviderUrl(chainId: BigNumberish, url: string): void;
    setChainRpcProviderUrls(chainProviders: Record<string, string>): void;
    getConfigAddress(chainId: BigNumberish, key: string): string;
    getConfigStartBlock(chainId: BigNumberish): number;
    getRpcProviderForChainId(chainId: BigNumberish): Provider;
    getContractExists(address: string, provider: Provider): Promise<boolean>;
    getSigner(): Signer | null;
    getSignerAddress(): Promise<string | null>;
    getSignerOrProvider(chainId: BigNumberish, signer?: Signer): Promise<Signer | Provider>;
    getTxOverrides(fromChainId: BigNumberish, toChainId: BigNumberish): Promise<TxOverrides>;
    sendTransaction(transactionRequest: providers.TransactionRequest, chainId?: BigNumberish | undefined): Promise<providers.TransactionResponse>;
    get utils(): {
        isValidObject: (obj: any) => boolean;
        isValidChainId: (chainId: BigNumberish) => boolean;
        isValidBytes32: (hash: string) => boolean;
        isValidTxHash: (txHash: string) => boolean;
        isValidBytes: (bytes: string) => boolean;
        isValidAddress: (address: string) => boolean;
        isValidFilterBlock: (blockTag: string | number) => boolean;
        isValidNumericValue: (value: BigNumberish | BigNumber | bigint | number | string | object | null) => boolean;
        getChainSlug: (chainId: BigNumberish) => string;
        getBumpedGasPrice: (provider: Provider, percent: number) => Promise<BigNumber>;
        estimateGas: (provider: providers.Provider, tx: providers.TransactionRequest) => Promise<BigNumber>;
        getGasPrice: (signerOrProvider: providers.Provider | Signer) => Promise<BigNumber>;
        getConnectedChainId: (provider: Provider) => Promise<BigNumber>;
        switchChain: (chainId: BigNumberish, provider: providers.Provider) => Promise<void>;
        getTransactionHashExplorerUrl: (txHash: string, chainId: BigNumberish) => string;
        getAddressExplorerUrl: (address: string, chainId: BigNumberish) => string;
        getTokenExplorerUrl: (address: string, chainId: BigNumberish) => string;
    };
}
export {};
//# sourceMappingURL=Base.d.ts.map