import { CrossChainMessenger } from '@eth-optimism/sdk';
import { Signer, providers } from 'ethers';
export declare class OptimismRelayer {
    network: string;
    l1Provider: providers.Provider | Signer;
    l2Provider: providers.Provider | Signer;
    csm: CrossChainMessenger;
    constructor(network: string | undefined, l1Provider: providers.Provider | Signer, l2Provider: providers.Provider);
    getExitPopulatedTx(l2TxHash: string): Promise<providers.TransactionRequest>;
    getIsL2TxHashExited(l2TxHash: string): Promise<boolean>;
    exitTx(l2TxHash: string): Promise<providers.TransactionResponse>;
    formatError(err: Error): void;
}
//# sourceMappingURL=OptimismRelayer.d.ts.map