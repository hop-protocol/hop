import { providers } from 'ethers';
export declare class GnosisChainRelayer {
    network: string;
    l1Provider: providers.Provider;
    l2Provider: providers.Provider;
    l1AmbAddress: string;
    l2AmbAddress: string;
    constructor(network: string | undefined, l1Provider: providers.Provider, l2Provider: providers.Provider);
    getL1Amb(): import("../contracts").L1_xDaiAMB;
    getL2Amb(): import("../contracts").L2_xDaiAMB;
    getExitPopulatedTx(l2TxHash: string): Promise<providers.TransactionResponse>;
    getValidSigEvent(l2TxHash: string): Promise<import("../contracts/L2_xDaiAMB").UserRequestForSignatureEvent | undefined>;
}
//# sourceMappingURL=GnosisChainRelayer.d.ts.map