import { IL1ToL2MessageReader, IL1ToL2MessageWriter, L1ToL2MessageStatus } from '@arbitrum/sdk';
import { providers } from 'ethers';
export declare class ArbitrumRelayer {
    network: string;
    l1Provider: providers.Provider;
    l2Provider: providers.Provider;
    constructor(network: string | undefined, l1Provider: providers.Provider, l2Provider: providers.Provider);
    getExitPopulatedTx(l2TxHash: string): Promise<providers.TransactionRequest>;
    redeemArbitrumTransaction(l1TxHash: string, messageIndex?: number): Promise<providers.TransactionResponse>;
    getMessageStatus(l1TxHash: string, messageIndex?: number): Promise<L1ToL2MessageStatus>;
    getL1ToL2Message(l1TxHash: string, messageIndex?: number): Promise<IL1ToL2MessageWriter | IL1ToL2MessageReader>;
    getL1ToL2Messages(l1TxHash: string): Promise<any[]>;
    isTransactionRedeemed(l1TxHash: string, messageIndex?: number): Promise<boolean>;
}
//# sourceMappingURL=ArbitrumRelayer.d.ts.map