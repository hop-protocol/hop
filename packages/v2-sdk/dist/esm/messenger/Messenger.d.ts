import { Base, BaseConfig } from '#common/index.js';
import { BigNumber, BigNumberish, Signer, providers, Event as EthersEvent } from 'ethers';
import { BundleCommitted } from '#messenger/events/BundleCommitted.js';
import { BundleForwarded } from '#messenger/events/BundleForwarded.js';
import { BundleReceived } from '#messenger/events/BundleReceived.js';
import { BundleSet } from '#messenger/events/BundleSet.js';
import { MessageBundled } from '#messenger/events/MessageBundled.js';
import { MessageExecuted } from '#messenger/events/MessageExecuted.js';
import { MessageSent } from '#messenger/events/MessageSent.js';
import { FeesSentToHub } from '#messenger/events/FeesSentToHub.js';
import { GasPriceOracle } from '#gasPriceOracle/index.js';
type GetEventsInput = {
    chainId: number;
    fromBlock: number;
    toBlock?: number;
};
export type BundleProof = {
    bundleId: string;
    treeIndex: number;
    siblings: string[];
    totalLeaves: number;
};
export type HasAuctionStartedInput = {
    fromChainId: BigNumberish;
    bundleCommittedEvent: BundleCommitted;
};
export type GetSpokeExitTimeInput = {
    fromChainId: BigNumberish;
    toChainId: BigNumberish;
};
export type GetRelayRewardInput = {
    fromChainId: BigNumberish;
    bundleCommittedEvent: BundleCommitted;
};
export type GetEstimatedTxCostForForwardMessageInput = {
    chainId: BigNumberish;
};
export type ShouldAttemptForwardMessageInput = {
    fromChainId: BigNumberish;
    bundleCommittedEvent: BundleCommitted;
};
export type GetBundleExitPopulatedTxInput = {
    fromChainId: BigNumberish;
    bundleCommittedEvent?: BundleCommitted;
    bundleCommittedTransactionHash?: string;
};
export type ExitBundleInput = {
    fromChainId: BigNumberish;
    bundleCommittedEvent?: BundleCommitted;
    bundleCommittedTransactionHash?: string;
    signer: Signer;
};
export type RouteData = {
    messageFee: BigNumber;
    maxBundleMessages: number;
};
export type GetIsL2TxHashExitedInput = {
    fromChainId: BigNumberish;
    transactionHash: string;
};
export type GetSendMessagePopulatedTxInput = {
    fromChainId: BigNumberish;
    toChainId: BigNumberish;
    toAddress: string;
    toCalldata: string;
};
export type GetEventContextInput = {
    chainId: BigNumberish;
    event: EthersEvent;
};
export type GetRouteDataInput = {
    fromChainId: BigNumberish;
    toChainId: BigNumberish;
};
export type GetMessageFeeInput = {
    fromChainId: BigNumberish;
    toChainId: BigNumberish;
};
export type GetMaxBundleMessageCountInput = {
    fromChainId: BigNumberish;
    toChainId: BigNumber;
};
export type GetIsBundleSetInput = {
    fromChainId: BigNumberish;
    toChainId: BigNumberish;
    bundleId: string;
};
export type GetMessageSentEventFromTransactionReceiptInput = {
    fromChainId: BigNumberish;
    receipt: providers.TransactionReceipt;
};
export type GetMessageSentEventFromTransactionHashInput = {
    fromChainId: BigNumberish;
    transactionHash: string;
};
export type GetMessageBundledEventFromMessageIdInput = {
    fromChainId: BigNumberish;
    messageId: string;
};
export type GetMessageSentEventFromMessageIdInput = {
    fromChainId: BigNumberish;
    messageId: string;
};
export type GetMessageExecutedEventFromMessageIdInput = {
    messageId: string;
    fromChainId: BigNumberish;
    toChainId: BigNumberish;
};
export type GetMessageBundledEventFromTransactionHashInput = {
    fromChainId: BigNumberish;
    transactionHash: string;
};
export type GetMessageIdFromTransactionHashInput = {
    fromChainId: BigNumberish;
    transactionHash: string;
};
export type GetMessageBundleIdFromMessageIdInput = {
    fromChainId: BigNumberish;
    messageId: string;
};
export type GetMessageBundleIdFromTransactionHashInput = {
    fromChainId: BigNumberish;
    transactionHash: string;
};
export type GetMessageTreeIndexFromMessageIdInput = {
    fromChainId: BigNumberish;
    messageId: string;
};
export type GetMessageTreeIndexFromTransactionHashInput = {
    fromChainId: BigNumberish;
    transactionHash: string;
};
export type GetMessageBundledEventsForBundleIdInput = {
    fromChainId: BigNumberish;
    bundleId: string;
};
export type GetMessageIdsForBundleIdInput = {
    fromChainId: BigNumberish;
    bundleId: string;
};
export type GetMerkleProofForMessageIdInput = {
    messageIds: string[];
    targetMessageId: string;
};
export type GetBundleProofFromMessageIdInput = {
    fromChainId: BigNumberish;
    messageId: string;
};
export type GetBundleProofFromTransactionHashInput = {
    fromChainId: BigNumberish;
    transactionHash: string;
};
export type GetRelayMessageDataFromTransactionHashInput = {
    fromChainId: BigNumberish;
    transactionHash: string;
};
export type GetRelayMessagePopulatedTxInput = {
    fromChainId: BigNumberish;
    toChainId: BigNumberish;
    fromAddress: string;
    toAddress: string;
    toCalldata: string;
    bundleProof: BundleProof;
};
export type GetMessageCalldataInput = {
    fromChainId: BigNumberish;
    messageId: string;
};
export type GetIsMessageIdRelayedInput = {
    messageId: string;
    fromChainId: BigNumberish;
    toChainId: BigNumberish;
};
export type GetRelayFeeInput = {
    fromChainId: BigNumberish;
    toChainId: BigNumberish;
    toAddress: string;
    toCalldata: string;
};
export type RelayMessageData = {
    fromChainId: BigNumberish;
    toAddress: string;
    fromAddress: string;
    toCalldata: string;
    toChainId: BigNumberish;
    bundleProof: BundleProof;
};
export type ExecuteInput = {
    messageId: string;
    fromChainId: BigNumberish;
    toChainId: BigNumberish;
    fromAddress: string;
    toAddress: string;
    toCalldata: string;
};
export type MessengerConfig = BaseConfig;
export declare class Messenger extends Base {
    batchBlocks: number;
    gasPriceOracle: GasPriceOracle;
    constructor(config: MessengerConfig);
    connect(signer: Signer): Messenger;
    getSpokeMessageBridgeContractAddress(chainId: BigNumberish): string;
    getHubMessageBridgeContractAddress(chainId: BigNumberish): string;
    getExecutorContractAddress(chainId: BigNumberish): string;
    getBundleCommittedEvents(input: GetEventsInput): Promise<BundleCommitted[]>;
    getBundleForwardedEvents(input: GetEventsInput): Promise<BundleForwarded[]>;
    getBundleReceivedEvents(input: GetEventsInput): Promise<BundleReceived[]>;
    getBundleSetEvents(input: GetEventsInput): Promise<BundleSet[]>;
    getFeesSentToHubEvents(input: GetEventsInput): Promise<FeesSentToHub[]>;
    getMessageBundledEvents(input: GetEventsInput): Promise<MessageBundled[]>;
    getMessageExecutedEvents(input: GetEventsInput): Promise<MessageExecuted[]>;
    getMessageSentEvents(input: GetEventsInput): Promise<MessageSent[]>;
    getHasAuctionStarted(input: HasAuctionStartedInput): Promise<boolean>;
    getSpokeExitTime(input: GetSpokeExitTimeInput): Promise<number>;
    getRelayReward(input: GetRelayRewardInput): Promise<number>;
    getEstimatedTxCostForForwardMessage(input: GetEstimatedTxCostForForwardMessageInput): Promise<number>;
    getShouldAttemptForwardMessage(input: ShouldAttemptForwardMessageInput): Promise<boolean>;
    exitBundle(input: ExitBundleInput): Promise<providers.TransactionResponse>;
    getIsL2TxHashExited(input: GetIsL2TxHashExitedInput): Promise<boolean>;
    get populateTransaction(): {
        sendMessage: (input: GetSendMessagePopulatedTxInput) => Promise<providers.TransactionRequest>;
        relayMessage: (input: GetRelayMessagePopulatedTxInput) => Promise<providers.TransactionRequest>;
        bundleExit: (input: GetBundleExitPopulatedTxInput) => Promise<providers.TransactionRequest>;
        execute: (input: ExecuteInput) => Promise<providers.TransactionRequest>;
    };
    sendMessage(input: GetSendMessagePopulatedTxInput): Promise<providers.TransactionResponse>;
    relayMessage(input: GetRelayMessagePopulatedTxInput): Promise<providers.TransactionResponse>;
    bundleExit(input: GetBundleExitPopulatedTxInput): Promise<providers.TransactionResponse>;
    getRelayWindowHours(): Promise<number>;
    getRouteData(input: GetRouteDataInput): Promise<RouteData>;
    getMessageFee(input: GetMessageFeeInput): Promise<BigNumber>;
    getMaxBundleMessageCount(input: GetMaxBundleMessageCountInput): Promise<number>;
    getIsBundleSet(input: GetIsBundleSetInput): Promise<boolean>;
    getMessageSentEventFromTransactionReceipt(input: GetMessageSentEventFromTransactionReceiptInput): Promise<MessageSent | null>;
    getMessageSentEventFromTransactionHash(input: GetMessageSentEventFromTransactionHashInput): Promise<MessageSent | null>;
    getMessageBundledEventFromMessageId(input: GetMessageBundledEventFromMessageIdInput): Promise<MessageBundled>;
    getMessageSentEventFromMessageId(input: GetMessageSentEventFromMessageIdInput): Promise<MessageSent>;
    getMessageExecutedEventFromMessageId(input: GetMessageExecutedEventFromMessageIdInput): Promise<MessageExecuted | null>;
    getMessageBundledEventFromTransactionHash(input: GetMessageBundledEventFromTransactionHashInput): Promise<MessageBundled | null>;
    getMessageIdFromTransactionHash(input: GetMessageIdFromTransactionHashInput): Promise<string>;
    getMessageBundleIdFromMessageId(input: GetMessageBundleIdFromMessageIdInput): Promise<string>;
    getMessageBundleIdFromTransactionHash(input: GetMessageBundleIdFromTransactionHashInput): Promise<string>;
    getMessageTreeIndexFromMessageId(input: GetMessageTreeIndexFromMessageIdInput): Promise<number>;
    getMessageTreeIndexFromTransactionHash(input: GetMessageTreeIndexFromTransactionHashInput): Promise<number>;
    getMessageBundledEventsForBundleId(input: GetMessageBundledEventsForBundleIdInput): Promise<MessageBundled[]>;
    getMessageIdsForBundleId(input: GetMessageIdsForBundleIdInput): Promise<string[]>;
    getMerkleProofForMessageId(input: GetMerkleProofForMessageIdInput): Promise<string[]>;
    getBundleProofFromMessageId(input: GetBundleProofFromMessageIdInput): Promise<BundleProof>;
    getBundleProofFromTransactionHash(input: GetBundleProofFromTransactionHashInput): Promise<BundleProof>;
    getRelayMessageDataFromTransactionHash(input: GetRelayMessageDataFromTransactionHashInput): Promise<RelayMessageData>;
    getMessageCalldataFromMessageId(input: GetMessageCalldataInput): Promise<string>;
    getIsMessageIdRelayed(input: GetIsMessageIdRelayedInput): Promise<boolean>;
    getRelayFee(input: GetRelayFeeInput): Promise<BigNumber>;
    getEventNames(): string[];
    isValidBundleProof(bundleProof: BundleProof): boolean;
    execute(input: ExecuteInput): Promise<providers.TransactionResponse>;
}
export {};
//# sourceMappingURL=Messenger.d.ts.map