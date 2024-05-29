import { providers } from 'ethers';
export declare class PolygonRelayer {
    network: string;
    l1Provider: providers.Provider;
    l2Provider: providers.Provider;
    apiUrl: string;
    maticClient: any;
    ready: boolean;
    constructor(network: string | undefined, l1Provider: providers.Provider, l2Provider: providers.Provider);
    init(): Promise<void>;
    protected tilReady(): Promise<boolean>;
    getExitPopulatedTx(l2TxHash: string): Promise<providers.TransactionRequest>;
    isCheckpointed(l2BlockNumber: number): Promise<boolean>;
}
//# sourceMappingURL=PolygonRelayer.d.ts.map