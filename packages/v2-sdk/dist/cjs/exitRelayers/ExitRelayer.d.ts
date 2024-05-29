import { providers } from 'ethers';
export interface ExitRelayer {
    getExitPopulatedTx(l2TxHash: string): Promise<providers.TransactionRequest | providers.TransactionResponse>;
    exitTx(l2TxHash: string): Promise<providers.TransactionResponse>;
    getIsL2TxHashExited(l2TxHash: string): Promise<boolean>;
}
//# sourceMappingURL=ExitRelayer.d.ts.map