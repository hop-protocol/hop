import { BaseConfig } from '#common/index.js';
import { BigNumber, BigNumberish, Contract, Signer, providers } from 'ethers';
import { StakingRegistry } from './StakingRegistry.js';
import { TransferSent } from '#railsGateway/events/TransferSent.js';
import { TransferBonded } from '#railsGateway/events/TransferBonded.js';
export type TransferSentEventInput = {
    chainId: BigNumberish;
    fromBlock: number;
    toBlock: number;
};
export type TransferBondEventInput = {
    chainId: BigNumberish;
    fromBlock: number;
    toBlock: number;
};
export type Path = {
    pathId: string;
    chainId: BigNumber;
    token: string;
    counterpartToken: string;
    counterpartChainId: BigNumber;
};
export type GetPathIdInput = {
    chainId0: BigNumberish;
    token0: string;
    chainId1: BigNumberish;
    token1: string;
};
export type GetPathInfoInput = {
    chainId: BigNumberish;
    pathId: string;
};
export type SendInput = {
    chainId: BigNumberish;
    pathId: string;
    to: string;
    amount: BigNumberish;
    minAmountOut: BigNumberish;
    attestedCheckpoint: string;
};
export type ApproveSendInput = {
    chainId: BigNumberish;
    pathId: string;
    amount: BigNumberish;
};
export type BondInput = {
    chainId: BigNumberish;
    checkpoint: string;
    pathId: string;
    to: string;
    amount: BigNumberish;
    totalSent: BigNumberish;
    nonce: BigNumberish;
    attestedCheckpoint: string;
};
export type ApproveBondInput = {
    chainId: BigNumberish;
    pathId: string;
    amount: BigNumberish;
};
export type PostClaimInput = {
    chainId: BigNumberish;
    pathId: string;
    transferId: string;
    head: string;
    totalSent: BigNumberish;
};
export type RemoveClaimInput = {
    chainId: BigNumberish;
    pathId: string;
    checkpoint: string;
    nonce: BigNumberish;
};
export type ConfirmCheckpointInput = {
    chainId: BigNumberish;
    pathId: string;
    checkpoint: string;
};
export type GetTransferIdInput = {
    chainId: BigNumberish;
    pathId: string;
    to: string;
    adjustedAmount: BigNumberish;
    minAmountOut: BigNumberish;
    totalSent: BigNumberish;
    nonce: BigNumberish;
    attestedCheckpoint: string;
};
export type WithdrawInput = {
    chainId: BigNumberish;
    pathId: string;
    amount: BigNumberish;
    timeWindow: number;
};
export type WithdrawAllInput = {
    chainId: BigNumberish;
    pathId: string;
    timeWindow: number;
};
export type WithdrawBalanceInput = {
    chainId: BigNumberish;
    pathId?: string;
    path?: Path;
    recipient: string;
    timeWindow: number;
};
export type GetNeedsApprovalForSendInput = {
    chainId: BigNumberish;
    pathId: string;
    amount: BigNumberish;
};
export type GetNeedsApprovalForBondInput = {
    chainId: BigNumberish;
    pathId: string;
    amount: BigNumberish;
};
export type GetLatestClaimInput = {
    chainId: BigNumberish;
    pathId: string;
};
export type GetIsCheckpointValidInput = {
    chainId: BigNumberish;
    pathId: string;
    checkpoint: string;
};
export type GetFeeInput = {
    chainId: BigNumberish;
    pathId: string;
};
export type StakeHopInput = {
    chainId: BigNumberish;
    role: string;
    staker?: string;
    amount: BigNumberish;
};
export type UnstakeHopInput = {
    chainId: BigNumberish;
    role: string;
    amount: BigNumberish;
};
export type WithdrawHopInput = {
    chainId: BigNumberish;
    role: string;
};
export type GetCheckpointInput = {
    chainId: BigNumberish;
    previousCheckpoint: string;
    transferId: string;
    totalSent: BigNumber;
};
export type CalcAmountOutMinInput = {
    amountOut: BigNumberish;
    slippageTolerance: number;
};
export type GetTransferSentEventFromTransactionReceiptInput = {
    fromChainId: BigNumberish;
    receipt: providers.TransactionReceipt;
};
export type GetTransferSentEventFromTransactionHashInput = {
    fromChainId: BigNumberish;
    transactionHash: string;
};
export type GetTransferSentEventFromTransferIdInput = {
    fromChainId: BigNumberish;
    transferId: string;
};
export type GetTransferSentEventFromCheckpointInput = {
    fromChainId: BigNumberish;
    checkpoint: string;
};
export type GetTransferBondedEventFromTransactionReceiptInput = {
    fromChainId: BigNumberish;
    receipt: providers.TransactionReceipt;
};
export type GetTransferBondedEventFromTransactionHashInput = {
    fromChainId: BigNumberish;
    transactionHash: string;
};
export type GetTransferBondedEventFromTransferIdInput = {
    fromChainId: BigNumberish;
    transferId: string;
};
export type GetTransferBondedEventFromCheckpointInput = {
    fromChainId: BigNumberish;
    checkpoint: string;
};
export type GetTokenInfoInput = {
    chainId: BigNumberish;
    address: string;
};
export type GetTokenContractInput = {
    chainId: BigNumberish;
    address: string;
};
export type Token = {
    chainId: BigNumber;
    address: string;
    name: string;
    symbol: string;
    decimals: number;
};
export type RailsGatewayConstructorInput = BaseConfig;
export declare class RailsGateway extends StakingRegistry {
    #private;
    batchBlocks: number;
    constructor(input: RailsGatewayConstructorInput);
    connect(signer: Signer): RailsGateway;
    getTransferSentEvents(input: TransferSentEventInput): Promise<TransferSent[]>;
    getTransferBondedEvents(input: TransferBondEventInput): Promise<TransferBonded[]>;
    getRailsGatewayContractAddress(chainId: BigNumberish): string;
    getRailsGatewayContract(chainId: BigNumberish): Promise<Contract>;
    getPathId(input: GetPathIdInput): Promise<string>;
    getPathInfo(input: GetPathInfoInput): Promise<Path>;
    getFee(input: GetFeeInput): Promise<BigNumber>;
    get populateTransaction(): {
        send: (input: SendInput) => Promise<providers.TransactionRequest>;
        approveSend: (input: ApproveSendInput) => Promise<providers.TransactionRequest>;
        bond: (input: BondInput) => Promise<providers.TransactionRequest>;
        approveBond: (input: ApproveBondInput) => Promise<providers.TransactionRequest>;
        postClaim: (input: PostClaimInput) => Promise<providers.TransactionRequest>;
        removeClaim: (input: RemoveClaimInput) => Promise<providers.TransactionRequest>;
        withdrawClaim: (input: WithdrawInput) => Promise<providers.TransactionRequest>;
        withdrawAllClaims: (input: WithdrawAllInput) => Promise<providers.TransactionRequest>;
        confirmCheckpoint: (input: ConfirmCheckpointInput) => Promise<providers.TransactionRequest>;
        approveStakeHop: (input: StakeHopInput) => Promise<providers.TransactionRequest>;
        stakeHop: (input: StakeHopInput) => Promise<providers.TransactionRequest>;
        unstakeHop: (input: UnstakeHopInput) => Promise<providers.TransactionRequest>;
        withdrawHop: (input: WithdrawHopInput) => Promise<providers.TransactionRequest>;
    };
    send(input: SendInput): Promise<providers.TransactionResponse>;
    approveSend(input: ApproveSendInput): Promise<providers.TransactionResponse>;
    bond(input: BondInput): Promise<providers.TransactionResponse>;
    approveBond(input: ApproveBondInput): Promise<providers.TransactionResponse>;
    postClaim(input: PostClaimInput): Promise<providers.TransactionResponse>;
    removeClaim(input: RemoveClaimInput): Promise<providers.TransactionResponse>;
    confirmCheckpoint(input: ConfirmCheckpointInput): Promise<providers.TransactionResponse>;
    withdrawClaim(input: WithdrawInput): Promise<providers.TransactionResponse>;
    withdrawAllClaims(input: WithdrawAllInput): Promise<providers.TransactionResponse>;
    getNeedsApprovalForSend(input: GetNeedsApprovalForSendInput): Promise<boolean>;
    getNeedsApprovalForBond(input: GetNeedsApprovalForBondInput): Promise<boolean>;
    getLatestClaim(input: GetLatestClaimInput): Promise<string>;
    getIsCheckpointValid(input: GetIsCheckpointValidInput): Promise<boolean>;
    stakeHop(input: StakeHopInput): Promise<providers.TransactionResponse>;
    unstakeHop(input: UnstakeHopInput): Promise<providers.TransactionResponse>;
    withdrawHop(input: WithdrawHopInput): Promise<providers.TransactionResponse>;
    getWithdrawableBalance(input: WithdrawBalanceInput): Promise<BigNumber>;
    getTransferId(input: GetTransferIdInput): Promise<string>;
    getHopTokenAddress(chainId: BigNumberish): Promise<string>;
    getMinBonderStake(chainId: BigNumberish): Promise<BigNumber>;
    getHopBalance(chainId: BigNumberish, address?: string | null): Promise<BigNumber>;
    getHopTokenContract(chainId: BigNumberish): Promise<Contract>;
    calcAmountOutMin(input: CalcAmountOutMinInput): BigNumber;
    getTransferSentEventFromTransactionReceipt(input: GetTransferSentEventFromTransactionReceiptInput): Promise<TransferSent | null>;
    getTransferSentEventFromTransactionHash(input: GetTransferSentEventFromTransactionHashInput): Promise<TransferSent | null>;
    getTransferSentEventFromTransferId(input: GetTransferSentEventFromTransferIdInput): Promise<TransferSent>;
    getTransferSentEventFromCheckpoint(input: GetTransferSentEventFromCheckpointInput): Promise<TransferSent>;
    getTransferBondedEventFromTransactionReceipt(input: GetTransferBondedEventFromTransactionReceiptInput): Promise<TransferBonded | null>;
    getTransferBondedEventFromTransactionHash(input: GetTransferBondedEventFromTransactionHashInput): Promise<TransferBonded | null>;
    getTransferBondedEventFromTransferId(input: GetTransferBondedEventFromTransferIdInput): Promise<TransferBonded>;
    getTransferBondedEventFromCheckpoint(input: GetTransferBondedEventFromCheckpointInput): Promise<TransferBonded>;
    getTokenInfo(input: GetTokenInfoInput): Promise<Token>;
    getTokenContract(input: GetTokenContractInput): Contract;
}
//# sourceMappingURL=RailsGateway.d.ts.map