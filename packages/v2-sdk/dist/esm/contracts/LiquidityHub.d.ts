import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common.js";
export interface LiquidityHubInterface extends utils.Interface {
    functions: {
        "_settleChallenge(bytes32,bool)": FunctionFragment;
        "acceptSlash(address,bytes32,uint256,bytes)": FunctionFragment;
        "addToAppeal(address,address,bytes32,uint256,bytes)": FunctionFragment;
        "addToChallenge(address,address,bytes32,uint256,bytes)": FunctionFragment;
        "appealPeriod()": FunctionFragment;
        "bond(bytes32,address,uint256,uint256,uint256,uint256,bytes32,uint256,uint256)": FunctionFragment;
        "challengePeriod()": FunctionFragment;
        "challenges(bytes32)": FunctionFragment;
        "confirmClaim(bytes32)": FunctionFragment;
        "createChallenge(address,bytes32,uint256,bytes)": FunctionFragment;
        "dispatcher()": FunctionFragment;
        "executor()": FunctionFragment;
        "forceSettleChallenge(bytes32,bool)": FunctionFragment;
        "fullAppeal()": FunctionFragment;
        "getChallengeId(bytes32,address,uint256,address,bytes)": FunctionFragment;
        "getClaimId(bytes32,address,uint256,uint256,uint256,uint256,bytes32,uint256,uint256)": FunctionFragment;
        "getFee(uint256[])": FunctionFragment;
        "getStakedBalance(bytes32,address)": FunctionFragment;
        "getTokenBusId(uint256,address,uint256,address)": FunctionFragment;
        "getTokenBusInfo(bytes32)": FunctionFragment;
        "getWithdrawableBalance(bytes32,address,uint256)": FunctionFragment;
        "getWithdrawableBalance(bytes32,address)": FunctionFragment;
        "hopToken()": FunctionFragment;
        "initRole(bytes32,uint256)": FunctionFragment;
        "initTokenBus(address,uint256,address,uint256)": FunctionFragment;
        "isStaked(bytes32,address)": FunctionFragment;
        "minBonderStake()": FunctionFragment;
        "minChallengeIncrease()": FunctionFragment;
        "minHopStakeForRole(bytes32)": FunctionFragment;
        "optimisticallySettleChallenge(address,address,bytes32,uint256,bytes)": FunctionFragment;
        "owner()": FunctionFragment;
        "postClaim(bytes32,address,uint256,uint256,uint256,uint256,bytes32,uint256,uint256)": FunctionFragment;
        "renounceOwnership()": FunctionFragment;
        "replaceClaim()": FunctionFragment;
        "send(bytes32,address,uint256,uint256,bytes32,uint256,uint256)": FunctionFragment;
        "stakeHop(bytes32,address,uint256)": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
        "unstakeHop(bytes32,uint256)": FunctionFragment;
        "withdraw(bytes32,address)": FunctionFragment;
        "withdrawClaims(bytes32,address,uint256)": FunctionFragment;
        "withdrawableEth(address)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "_settleChallenge" | "acceptSlash" | "addToAppeal" | "addToChallenge" | "appealPeriod" | "bond" | "challengePeriod" | "challenges" | "confirmClaim" | "createChallenge" | "dispatcher" | "executor" | "forceSettleChallenge" | "fullAppeal" | "getChallengeId" | "getClaimId" | "getFee" | "getStakedBalance" | "getTokenBusId" | "getTokenBusInfo" | "getWithdrawableBalance(bytes32,address,uint256)" | "getWithdrawableBalance(bytes32,address)" | "hopToken" | "initRole" | "initTokenBus" | "isStaked" | "minBonderStake" | "minChallengeIncrease" | "minHopStakeForRole" | "optimisticallySettleChallenge" | "owner" | "postClaim" | "renounceOwnership" | "replaceClaim" | "send" | "stakeHop" | "transferOwnership" | "unstakeHop" | "withdraw" | "withdrawClaims" | "withdrawableEth"): FunctionFragment;
    encodeFunctionData(functionFragment: "_settleChallenge", values: [PromiseOrValue<BytesLike>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: "acceptSlash", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "addToAppeal", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "addToChallenge", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "appealPeriod", values?: undefined): string;
    encodeFunctionData(functionFragment: "bond", values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "challengePeriod", values?: undefined): string;
    encodeFunctionData(functionFragment: "challenges", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "confirmClaim", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "createChallenge", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "dispatcher", values?: undefined): string;
    encodeFunctionData(functionFragment: "executor", values?: undefined): string;
    encodeFunctionData(functionFragment: "forceSettleChallenge", values: [PromiseOrValue<BytesLike>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: "fullAppeal", values?: undefined): string;
    encodeFunctionData(functionFragment: "getChallengeId", values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "getClaimId", values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "getFee", values: [PromiseOrValue<BigNumberish>[]]): string;
    encodeFunctionData(functionFragment: "getStakedBalance", values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getTokenBusId", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "getTokenBusInfo", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "getWithdrawableBalance(bytes32,address,uint256)", values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "getWithdrawableBalance(bytes32,address)", values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "hopToken", values?: undefined): string;
    encodeFunctionData(functionFragment: "initRole", values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "initTokenBus", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "isStaked", values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "minBonderStake", values?: undefined): string;
    encodeFunctionData(functionFragment: "minChallengeIncrease", values?: undefined): string;
    encodeFunctionData(functionFragment: "minHopStakeForRole", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "optimisticallySettleChallenge", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "postClaim", values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "replaceClaim", values?: undefined): string;
    encodeFunctionData(functionFragment: "send", values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "stakeHop", values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "unstakeHop", values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "withdraw", values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "withdrawClaims", values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "withdrawableEth", values: [PromiseOrValue<string>]): string;
    decodeFunctionResult(functionFragment: "_settleChallenge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "acceptSlash", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "addToAppeal", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "addToChallenge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "appealPeriod", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "bond", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "challengePeriod", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "challenges", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "confirmClaim", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "createChallenge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "dispatcher", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "executor", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "forceSettleChallenge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "fullAppeal", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getChallengeId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getClaimId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getStakedBalance", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getTokenBusId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getTokenBusInfo", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getWithdrawableBalance(bytes32,address,uint256)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getWithdrawableBalance(bytes32,address)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hopToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initRole", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initTokenBus", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isStaked", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "minBonderStake", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "minChallengeIncrease", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "minHopStakeForRole", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "optimisticallySettleChallenge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "postClaim", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "replaceClaim", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "send", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "stakeHop", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "unstakeHop", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdrawClaims", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdrawableEth", data: BytesLike): Result;
    events: {
        "OwnershipTransferred(address,address)": EventFragment;
        "TransferBonded(bytes32,bytes32,address,uint256,uint256,uint256)": EventFragment;
        "TransferSent(bytes32,bytes32,address,uint256,uint256,uint256)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "TransferBonded"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "TransferSent"): EventFragment;
}
export interface OwnershipTransferredEventObject {
    previousOwner: string;
    newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<[
    string,
    string
], OwnershipTransferredEventObject>;
export type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;
export interface TransferBondedEventObject {
    claimId: string;
    tokenBusId: string;
    to: string;
    amount: BigNumber;
    minAmountOut: BigNumber;
    totalSent: BigNumber;
}
export type TransferBondedEvent = TypedEvent<[
    string,
    string,
    string,
    BigNumber,
    BigNumber,
    BigNumber
], TransferBondedEventObject>;
export type TransferBondedEventFilter = TypedEventFilter<TransferBondedEvent>;
export interface TransferSentEventObject {
    claimId: string;
    tokenBusId: string;
    to: string;
    amount: BigNumber;
    minAmountOut: BigNumber;
    totalSent: BigNumber;
}
export type TransferSentEvent = TypedEvent<[
    string,
    string,
    string,
    BigNumber,
    BigNumber,
    BigNumber
], TransferSentEventObject>;
export type TransferSentEventFilter = TypedEventFilter<TransferSentEvent>;
export interface LiquidityHub extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: LiquidityHubInterface;
    queryFilter<TEvent extends TypedEvent>(event: TypedEventFilter<TEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TEvent>>;
    listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
    listeners(eventName?: string): Array<Listener>;
    removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
    removeAllListeners(eventName?: string): this;
    off: OnEvent<this>;
    on: OnEvent<this>;
    once: OnEvent<this>;
    removeListener: OnEvent<this>;
    functions: {
        _settleChallenge(challengeId: PromiseOrValue<BytesLike>, challengeWon: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        acceptSlash(challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        addToAppeal(staker: PromiseOrValue<string>, challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        addToChallenge(staker: PromiseOrValue<string>, challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        appealPeriod(overrides?: CallOverrides): Promise<[BigNumber]>;
        bond(tokenBusId: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, totalSent: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, attestedNonce: PromiseOrValue<BigNumberish>, attestedTotalSent: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        challengePeriod(overrides?: CallOverrides): Promise<[BigNumber]>;
        challenges(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[
            string,
            string,
            string,
            BigNumber,
            BigNumber,
            boolean,
            boolean,
            BigNumber,
            BigNumber,
            string
        ] & {
            staker: string;
            challenger: string;
            role: string;
            lastUpdated: BigNumber;
            penalty: BigNumber;
            isSettled: boolean;
            isAppealed: boolean;
            challengeEth: BigNumber;
            appealEth: BigNumber;
            winner: string;
        }>;
        confirmClaim(claim: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        createChallenge(staker: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        dispatcher(overrides?: CallOverrides): Promise<[string]>;
        executor(overrides?: CallOverrides): Promise<[string]>;
        forceSettleChallenge(challengeId: PromiseOrValue<BytesLike>, challengeWon: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        fullAppeal(overrides?: CallOverrides): Promise<[BigNumber]>;
        getChallengeId(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, penalty: PromiseOrValue<BigNumberish>, challenger: PromiseOrValue<string>, slashingData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string]>;
        getClaimId(tokenBusId: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, totalSent: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, attestedNonce: PromiseOrValue<BigNumberish>, attestedTotalSent: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        getFee(chainIds: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<[BigNumber]>;
        getStakedBalance(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        getTokenBusId(chainId0: PromiseOrValue<BigNumberish>, token0: PromiseOrValue<string>, chainId1: PromiseOrValue<BigNumberish>, token1: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[string]>;
        getTokenBusInfo(tokenBusId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[BigNumber, string, BigNumber, string]>;
        "getWithdrawableBalance(bytes32,address,uint256)"(tokenBusId: PromiseOrValue<BytesLike>, recipient: PromiseOrValue<string>, window: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        "getWithdrawableBalance(bytes32,address)"(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        hopToken(overrides?: CallOverrides): Promise<[string]>;
        initRole(role: PromiseOrValue<BytesLike>, minStake: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        initTokenBus(token: PromiseOrValue<string>, counterpartChainId: PromiseOrValue<BigNumberish>, counterpartToken: PromiseOrValue<string>, rateDelta: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        isStaked(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        minBonderStake(overrides?: CallOverrides): Promise<[BigNumber]>;
        minChallengeIncrease(overrides?: CallOverrides): Promise<[BigNumber]>;
        minHopStakeForRole(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[BigNumber]>;
        optimisticallySettleChallenge(staker: PromiseOrValue<string>, challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        owner(overrides?: CallOverrides): Promise<[string]>;
        postClaim(tokenBusId: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, totalSent: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, attestedNonce: PromiseOrValue<BigNumberish>, attestedTotalSent: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        replaceClaim(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        send(tokenBusId: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, attestedNonce: PromiseOrValue<BigNumberish>, attestedTotalSent: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        stakeHop(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        unstakeHop(role: PromiseOrValue<BytesLike>, amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        withdraw(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        withdrawClaims(tokenBusId: PromiseOrValue<BytesLike>, recipient: PromiseOrValue<string>, window: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        withdrawableEth(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
    };
    _settleChallenge(challengeId: PromiseOrValue<BytesLike>, challengeWon: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    acceptSlash(challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    addToAppeal(staker: PromiseOrValue<string>, challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    addToChallenge(staker: PromiseOrValue<string>, challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    appealPeriod(overrides?: CallOverrides): Promise<BigNumber>;
    bond(tokenBusId: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, totalSent: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, attestedNonce: PromiseOrValue<BigNumberish>, attestedTotalSent: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    challengePeriod(overrides?: CallOverrides): Promise<BigNumber>;
    challenges(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[
        string,
        string,
        string,
        BigNumber,
        BigNumber,
        boolean,
        boolean,
        BigNumber,
        BigNumber,
        string
    ] & {
        staker: string;
        challenger: string;
        role: string;
        lastUpdated: BigNumber;
        penalty: BigNumber;
        isSettled: boolean;
        isAppealed: boolean;
        challengeEth: BigNumber;
        appealEth: BigNumber;
        winner: string;
    }>;
    confirmClaim(claim: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    createChallenge(staker: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    dispatcher(overrides?: CallOverrides): Promise<string>;
    executor(overrides?: CallOverrides): Promise<string>;
    forceSettleChallenge(challengeId: PromiseOrValue<BytesLike>, challengeWon: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    fullAppeal(overrides?: CallOverrides): Promise<BigNumber>;
    getChallengeId(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, penalty: PromiseOrValue<BigNumberish>, challenger: PromiseOrValue<string>, slashingData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
    getClaimId(tokenBusId: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, totalSent: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, attestedNonce: PromiseOrValue<BigNumberish>, attestedTotalSent: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    getFee(chainIds: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<BigNumber>;
    getStakedBalance(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    getTokenBusId(chainId0: PromiseOrValue<BigNumberish>, token0: PromiseOrValue<string>, chainId1: PromiseOrValue<BigNumberish>, token1: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
    getTokenBusInfo(tokenBusId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[BigNumber, string, BigNumber, string]>;
    "getWithdrawableBalance(bytes32,address,uint256)"(tokenBusId: PromiseOrValue<BytesLike>, recipient: PromiseOrValue<string>, window: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    "getWithdrawableBalance(bytes32,address)"(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    hopToken(overrides?: CallOverrides): Promise<string>;
    initRole(role: PromiseOrValue<BytesLike>, minStake: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    initTokenBus(token: PromiseOrValue<string>, counterpartChainId: PromiseOrValue<BigNumberish>, counterpartToken: PromiseOrValue<string>, rateDelta: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    isStaked(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    minBonderStake(overrides?: CallOverrides): Promise<BigNumber>;
    minChallengeIncrease(overrides?: CallOverrides): Promise<BigNumber>;
    minHopStakeForRole(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
    optimisticallySettleChallenge(staker: PromiseOrValue<string>, challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    owner(overrides?: CallOverrides): Promise<string>;
    postClaim(tokenBusId: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, totalSent: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, attestedNonce: PromiseOrValue<BigNumberish>, attestedTotalSent: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    renounceOwnership(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    replaceClaim(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    send(tokenBusId: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, attestedNonce: PromiseOrValue<BigNumberish>, attestedTotalSent: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    stakeHop(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    unstakeHop(role: PromiseOrValue<BytesLike>, amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    withdraw(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    withdrawClaims(tokenBusId: PromiseOrValue<BytesLike>, recipient: PromiseOrValue<string>, window: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    withdrawableEth(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    callStatic: {
        _settleChallenge(challengeId: PromiseOrValue<BytesLike>, challengeWon: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        acceptSlash(challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        addToAppeal(staker: PromiseOrValue<string>, challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        addToChallenge(staker: PromiseOrValue<string>, challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        appealPeriod(overrides?: CallOverrides): Promise<BigNumber>;
        bond(tokenBusId: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, totalSent: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, attestedNonce: PromiseOrValue<BigNumberish>, attestedTotalSent: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        challengePeriod(overrides?: CallOverrides): Promise<BigNumber>;
        challenges(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[
            string,
            string,
            string,
            BigNumber,
            BigNumber,
            boolean,
            boolean,
            BigNumber,
            BigNumber,
            string
        ] & {
            staker: string;
            challenger: string;
            role: string;
            lastUpdated: BigNumber;
            penalty: BigNumber;
            isSettled: boolean;
            isAppealed: boolean;
            challengeEth: BigNumber;
            appealEth: BigNumber;
            winner: string;
        }>;
        confirmClaim(claim: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        createChallenge(staker: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        dispatcher(overrides?: CallOverrides): Promise<string>;
        executor(overrides?: CallOverrides): Promise<string>;
        forceSettleChallenge(challengeId: PromiseOrValue<BytesLike>, challengeWon: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        fullAppeal(overrides?: CallOverrides): Promise<BigNumber>;
        getChallengeId(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, penalty: PromiseOrValue<BigNumberish>, challenger: PromiseOrValue<string>, slashingData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        getClaimId(tokenBusId: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, totalSent: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, attestedNonce: PromiseOrValue<BigNumberish>, attestedTotalSent: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        getFee(chainIds: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<BigNumber>;
        getStakedBalance(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getTokenBusId(chainId0: PromiseOrValue<BigNumberish>, token0: PromiseOrValue<string>, chainId1: PromiseOrValue<BigNumberish>, token1: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
        getTokenBusInfo(tokenBusId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[BigNumber, string, BigNumber, string]>;
        "getWithdrawableBalance(bytes32,address,uint256)"(tokenBusId: PromiseOrValue<BytesLike>, recipient: PromiseOrValue<string>, window: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        "getWithdrawableBalance(bytes32,address)"(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        hopToken(overrides?: CallOverrides): Promise<string>;
        initRole(role: PromiseOrValue<BytesLike>, minStake: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        initTokenBus(token: PromiseOrValue<string>, counterpartChainId: PromiseOrValue<BigNumberish>, counterpartToken: PromiseOrValue<string>, rateDelta: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        isStaked(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        minBonderStake(overrides?: CallOverrides): Promise<BigNumber>;
        minChallengeIncrease(overrides?: CallOverrides): Promise<BigNumber>;
        minHopStakeForRole(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        optimisticallySettleChallenge(staker: PromiseOrValue<string>, challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        owner(overrides?: CallOverrides): Promise<string>;
        postClaim(tokenBusId: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, totalSent: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, attestedNonce: PromiseOrValue<BigNumberish>, attestedTotalSent: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        renounceOwnership(overrides?: CallOverrides): Promise<void>;
        replaceClaim(overrides?: CallOverrides): Promise<void>;
        send(tokenBusId: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, attestedNonce: PromiseOrValue<BigNumberish>, attestedTotalSent: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        stakeHop(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        unstakeHop(role: PromiseOrValue<BytesLike>, amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        withdraw(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        withdrawClaims(tokenBusId: PromiseOrValue<BytesLike>, recipient: PromiseOrValue<string>, window: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        withdrawableEth(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    filters: {
        "OwnershipTransferred(address,address)"(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        OwnershipTransferred(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        "TransferBonded(bytes32,bytes32,address,uint256,uint256,uint256)"(claimId?: PromiseOrValue<BytesLike> | null, tokenBusId?: PromiseOrValue<BytesLike> | null, to?: PromiseOrValue<string> | null, amount?: null, minAmountOut?: null, totalSent?: null): TransferBondedEventFilter;
        TransferBonded(claimId?: PromiseOrValue<BytesLike> | null, tokenBusId?: PromiseOrValue<BytesLike> | null, to?: PromiseOrValue<string> | null, amount?: null, minAmountOut?: null, totalSent?: null): TransferBondedEventFilter;
        "TransferSent(bytes32,bytes32,address,uint256,uint256,uint256)"(claimId?: PromiseOrValue<BytesLike> | null, tokenBusId?: PromiseOrValue<BytesLike> | null, to?: PromiseOrValue<string> | null, amount?: null, minAmountOut?: null, totalSent?: null): TransferSentEventFilter;
        TransferSent(claimId?: PromiseOrValue<BytesLike> | null, tokenBusId?: PromiseOrValue<BytesLike> | null, to?: PromiseOrValue<string> | null, amount?: null, minAmountOut?: null, totalSent?: null): TransferSentEventFilter;
    };
    estimateGas: {
        _settleChallenge(challengeId: PromiseOrValue<BytesLike>, challengeWon: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        acceptSlash(challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        addToAppeal(staker: PromiseOrValue<string>, challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        addToChallenge(staker: PromiseOrValue<string>, challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        appealPeriod(overrides?: CallOverrides): Promise<BigNumber>;
        bond(tokenBusId: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, totalSent: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, attestedNonce: PromiseOrValue<BigNumberish>, attestedTotalSent: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        challengePeriod(overrides?: CallOverrides): Promise<BigNumber>;
        challenges(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        confirmClaim(claim: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        createChallenge(staker: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        dispatcher(overrides?: CallOverrides): Promise<BigNumber>;
        executor(overrides?: CallOverrides): Promise<BigNumber>;
        forceSettleChallenge(challengeId: PromiseOrValue<BytesLike>, challengeWon: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        fullAppeal(overrides?: CallOverrides): Promise<BigNumber>;
        getChallengeId(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, penalty: PromiseOrValue<BigNumberish>, challenger: PromiseOrValue<string>, slashingData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        getClaimId(tokenBusId: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, totalSent: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, attestedNonce: PromiseOrValue<BigNumberish>, attestedTotalSent: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getFee(chainIds: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<BigNumber>;
        getStakedBalance(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getTokenBusId(chainId0: PromiseOrValue<BigNumberish>, token0: PromiseOrValue<string>, chainId1: PromiseOrValue<BigNumberish>, token1: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getTokenBusInfo(tokenBusId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        "getWithdrawableBalance(bytes32,address,uint256)"(tokenBusId: PromiseOrValue<BytesLike>, recipient: PromiseOrValue<string>, window: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        "getWithdrawableBalance(bytes32,address)"(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        hopToken(overrides?: CallOverrides): Promise<BigNumber>;
        initRole(role: PromiseOrValue<BytesLike>, minStake: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        initTokenBus(token: PromiseOrValue<string>, counterpartChainId: PromiseOrValue<BigNumberish>, counterpartToken: PromiseOrValue<string>, rateDelta: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        isStaked(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        minBonderStake(overrides?: CallOverrides): Promise<BigNumber>;
        minChallengeIncrease(overrides?: CallOverrides): Promise<BigNumber>;
        minHopStakeForRole(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        optimisticallySettleChallenge(staker: PromiseOrValue<string>, challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<BigNumber>;
        postClaim(tokenBusId: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, totalSent: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, attestedNonce: PromiseOrValue<BigNumberish>, attestedTotalSent: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        replaceClaim(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        send(tokenBusId: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, attestedNonce: PromiseOrValue<BigNumberish>, attestedTotalSent: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        stakeHop(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        unstakeHop(role: PromiseOrValue<BytesLike>, amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        withdraw(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        withdrawClaims(tokenBusId: PromiseOrValue<BytesLike>, recipient: PromiseOrValue<string>, window: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        withdrawableEth(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        _settleChallenge(challengeId: PromiseOrValue<BytesLike>, challengeWon: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        acceptSlash(challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        addToAppeal(staker: PromiseOrValue<string>, challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        addToChallenge(staker: PromiseOrValue<string>, challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        appealPeriod(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        bond(tokenBusId: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, totalSent: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, attestedNonce: PromiseOrValue<BigNumberish>, attestedTotalSent: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        challengePeriod(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        challenges(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        confirmClaim(claim: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        createChallenge(staker: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        dispatcher(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        executor(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        forceSettleChallenge(challengeId: PromiseOrValue<BytesLike>, challengeWon: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        fullAppeal(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getChallengeId(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, penalty: PromiseOrValue<BigNumberish>, challenger: PromiseOrValue<string>, slashingData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getClaimId(tokenBusId: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, totalSent: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, attestedNonce: PromiseOrValue<BigNumberish>, attestedTotalSent: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getFee(chainIds: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getStakedBalance(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getTokenBusId(chainId0: PromiseOrValue<BigNumberish>, token0: PromiseOrValue<string>, chainId1: PromiseOrValue<BigNumberish>, token1: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getTokenBusInfo(tokenBusId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        "getWithdrawableBalance(bytes32,address,uint256)"(tokenBusId: PromiseOrValue<BytesLike>, recipient: PromiseOrValue<string>, window: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        "getWithdrawableBalance(bytes32,address)"(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        hopToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        initRole(role: PromiseOrValue<BytesLike>, minStake: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        initTokenBus(token: PromiseOrValue<string>, counterpartChainId: PromiseOrValue<BigNumberish>, counterpartToken: PromiseOrValue<string>, rateDelta: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        isStaked(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        minBonderStake(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        minChallengeIncrease(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        minHopStakeForRole(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        optimisticallySettleChallenge(staker: PromiseOrValue<string>, challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        postClaim(tokenBusId: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, totalSent: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, attestedNonce: PromiseOrValue<BigNumberish>, attestedTotalSent: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        replaceClaim(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        send(tokenBusId: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, attestedNonce: PromiseOrValue<BigNumberish>, attestedTotalSent: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        stakeHop(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        unstakeHop(role: PromiseOrValue<BytesLike>, amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        withdraw(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        withdrawClaims(tokenBusId: PromiseOrValue<BytesLike>, recipient: PromiseOrValue<string>, window: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        withdrawableEth(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=LiquidityHub.d.ts.map