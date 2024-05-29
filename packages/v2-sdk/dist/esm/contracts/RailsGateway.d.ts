import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common.js";
export interface RailsGatewayInterface extends utils.Interface {
    functions: {
        "_settleChallenge(bytes32,bool)": FunctionFragment;
        "acceptSlash(address,bytes32,uint256,bytes)": FunctionFragment;
        "addToAppeal(address,address,bytes32,uint256,bytes)": FunctionFragment;
        "addToChallenge(address,address,bytes32,uint256,bytes)": FunctionFragment;
        "appealPeriod()": FunctionFragment;
        "bond(bytes32,bytes32,address,uint256,uint256,uint256,bytes32)": FunctionFragment;
        "challengePeriod()": FunctionFragment;
        "challenges(bytes32)": FunctionFragment;
        "confirmCheckpoint(bytes32,bytes32)": FunctionFragment;
        "createChallenge(address,bytes32,uint256,bytes)": FunctionFragment;
        "forceSettleChallenge(bytes32,bool)": FunctionFragment;
        "fullAppeal()": FunctionFragment;
        "getChallengeId(bytes32,address,uint256,address,bytes)": FunctionFragment;
        "getFee(bytes32)": FunctionFragment;
        "getLatestClaim(bytes32)": FunctionFragment;
        "getPathId(uint256,address,uint256,address)": FunctionFragment;
        "getPathInfo(bytes32)": FunctionFragment;
        "getStakedBalance(bytes32,address)": FunctionFragment;
        "getWithdrawableBalance(bytes32,address,uint256)": FunctionFragment;
        "getWithdrawableBalance(bytes32,address)": FunctionFragment;
        "initPath(address,uint256,address,address,address,uint256,uint256,uint256)": FunctionFragment;
        "initRole(bytes32,uint256)": FunctionFragment;
        "isCheckpointValid(bytes32,bytes32)": FunctionFragment;
        "isStaked(bytes32,address)": FunctionFragment;
        "minChallengeIncrease()": FunctionFragment;
        "minHopStakeForRole(bytes32)": FunctionFragment;
        "optimisticallySettleChallenge(address,address,bytes32,uint256,bytes)": FunctionFragment;
        "owner()": FunctionFragment;
        "postClaim(bytes32,bytes32,bytes32,uint256)": FunctionFragment;
        "removeClaim(bytes32,bytes32,uint256)": FunctionFragment;
        "renounceOwnership()": FunctionFragment;
        "send(bytes32,address,uint256,uint256,bytes32)": FunctionFragment;
        "stakeHop(bytes32,address,uint256)": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
        "unstakeHop(bytes32,uint256)": FunctionFragment;
        "withdraw(bytes32,address)": FunctionFragment;
        "withdraw(bytes32,uint256,uint256)": FunctionFragment;
        "withdrawAll(bytes32,uint256)": FunctionFragment;
        "withdrawableEth(address)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "_settleChallenge" | "acceptSlash" | "addToAppeal" | "addToChallenge" | "appealPeriod" | "bond" | "challengePeriod" | "challenges" | "confirmCheckpoint" | "createChallenge" | "forceSettleChallenge" | "fullAppeal" | "getChallengeId" | "getFee" | "getLatestClaim" | "getPathId" | "getPathInfo" | "getStakedBalance" | "getWithdrawableBalance(bytes32,address,uint256)" | "getWithdrawableBalance(bytes32,address)" | "initPath" | "initRole" | "isCheckpointValid" | "isStaked" | "minChallengeIncrease" | "minHopStakeForRole" | "optimisticallySettleChallenge" | "owner" | "postClaim" | "removeClaim" | "renounceOwnership" | "send" | "stakeHop" | "transferOwnership" | "unstakeHop" | "withdraw(bytes32,address)" | "withdraw(bytes32,uint256,uint256)" | "withdrawAll" | "withdrawableEth"): FunctionFragment;
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
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "challengePeriod", values?: undefined): string;
    encodeFunctionData(functionFragment: "challenges", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "confirmCheckpoint", values: [PromiseOrValue<BytesLike>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "createChallenge", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "forceSettleChallenge", values: [PromiseOrValue<BytesLike>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: "fullAppeal", values?: undefined): string;
    encodeFunctionData(functionFragment: "getChallengeId", values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "getFee", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "getLatestClaim", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "getPathId", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "getPathInfo", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "getStakedBalance", values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getWithdrawableBalance(bytes32,address,uint256)", values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "getWithdrawableBalance(bytes32,address)", values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "initPath", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "initRole", values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "isCheckpointValid", values: [PromiseOrValue<BytesLike>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "isStaked", values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]): string;
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
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "removeClaim", values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "send", values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "stakeHop", values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "unstakeHop", values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "withdraw(bytes32,address)", values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "withdraw(bytes32,uint256,uint256)", values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "withdrawAll", values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "withdrawableEth", values: [PromiseOrValue<string>]): string;
    decodeFunctionResult(functionFragment: "_settleChallenge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "acceptSlash", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "addToAppeal", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "addToChallenge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "appealPeriod", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "bond", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "challengePeriod", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "challenges", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "confirmCheckpoint", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "createChallenge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "forceSettleChallenge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "fullAppeal", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getChallengeId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getLatestClaim", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPathId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPathInfo", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getStakedBalance", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getWithdrawableBalance(bytes32,address,uint256)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getWithdrawableBalance(bytes32,address)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initPath", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initRole", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isCheckpointValid", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isStaked", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "minChallengeIncrease", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "minHopStakeForRole", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "optimisticallySettleChallenge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "postClaim", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "removeClaim", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "send", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "stakeHop", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "unstakeHop", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdraw(bytes32,address)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdraw(bytes32,uint256,uint256)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdrawAll", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdrawableEth", data: BytesLike): Result;
    events: {
        "OwnershipTransferred(address,address)": EventFragment;
        "TransferBonded(bytes32,bytes32,bytes32,address,uint256,uint256)": EventFragment;
        "TransferSent(bytes32,bytes32,bytes32,address,uint256,uint256,uint256,uint256,bytes32)": EventFragment;
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
    pathId: string;
    transferId: string;
    checkpoint: string;
    to: string;
    amountOut: BigNumber;
    totalSent: BigNumber;
}
export type TransferBondedEvent = TypedEvent<[
    string,
    string,
    string,
    string,
    BigNumber,
    BigNumber
], TransferBondedEventObject>;
export type TransferBondedEventFilter = TypedEventFilter<TransferBondedEvent>;
export interface TransferSentEventObject {
    pathId: string;
    transferId: string;
    checkpoint: string;
    to: string;
    amount: BigNumber;
    attestationFee: BigNumber;
    totalSent: BigNumber;
    nonce: BigNumber;
    attestedCheckpoint: string;
}
export type TransferSentEvent = TypedEvent<[
    string,
    string,
    string,
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    string
], TransferSentEventObject>;
export type TransferSentEventFilter = TypedEventFilter<TransferSentEvent>;
export interface RailsGateway extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: RailsGatewayInterface;
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
        bond(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, totalSent: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, overrides?: Overrides & {
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
        confirmCheckpoint(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        createChallenge(staker: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        forceSettleChallenge(challengeId: PromiseOrValue<BytesLike>, challengeWon: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        fullAppeal(overrides?: CallOverrides): Promise<[BigNumber]>;
        getChallengeId(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, penalty: PromiseOrValue<BigNumberish>, challenger: PromiseOrValue<string>, slashingData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string]>;
        getFee(pathId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[BigNumber]>;
        getLatestClaim(pathId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string] & {
            headCheckpoint: string;
        }>;
        getPathId(chainId0: PromiseOrValue<BigNumberish>, token0: PromiseOrValue<string>, chainId1: PromiseOrValue<BigNumberish>, token1: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[string]>;
        getPathInfo(pathId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[BigNumber, string, BigNumber, string]>;
        getStakedBalance(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        "getWithdrawableBalance(bytes32,address,uint256)"(pathId: PromiseOrValue<BytesLike>, recipient: PromiseOrValue<string>, time: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        "getWithdrawableBalance(bytes32,address)"(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        initPath(token: PromiseOrValue<string>, counterpartChainId: PromiseOrValue<BigNumberish>, counterpartToken: PromiseOrValue<string>, dispatcher: PromiseOrValue<string>, executor: PromiseOrValue<string>, initialSourceReserve: PromiseOrValue<BigNumberish>, initialDestinationReserve: PromiseOrValue<BigNumberish>, attestationFeeRate: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        initRole(role: PromiseOrValue<BytesLike>, minStake: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        isCheckpointValid(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean] & {
            isValid: boolean;
        }>;
        isStaked(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        minChallengeIncrease(overrides?: CallOverrides): Promise<[BigNumber]>;
        minHopStakeForRole(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[BigNumber]>;
        optimisticallySettleChallenge(staker: PromiseOrValue<string>, challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        owner(overrides?: CallOverrides): Promise<[string]>;
        postClaim(pathId: PromiseOrValue<BytesLike>, transferId: PromiseOrValue<BytesLike>, head: PromiseOrValue<BytesLike>, totalSent: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        removeClaim(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, nonce: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        send(pathId: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
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
        "withdraw(bytes32,address)"(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        "withdraw(bytes32,uint256,uint256)"(pathId: PromiseOrValue<BytesLike>, amount: PromiseOrValue<BigNumberish>, time: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        withdrawAll(pathId: PromiseOrValue<BytesLike>, time: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
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
    bond(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, totalSent: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, overrides?: Overrides & {
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
    confirmCheckpoint(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    createChallenge(staker: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    forceSettleChallenge(challengeId: PromiseOrValue<BytesLike>, challengeWon: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    fullAppeal(overrides?: CallOverrides): Promise<BigNumber>;
    getChallengeId(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, penalty: PromiseOrValue<BigNumberish>, challenger: PromiseOrValue<string>, slashingData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
    getFee(pathId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
    getLatestClaim(pathId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
    getPathId(chainId0: PromiseOrValue<BigNumberish>, token0: PromiseOrValue<string>, chainId1: PromiseOrValue<BigNumberish>, token1: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
    getPathInfo(pathId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[BigNumber, string, BigNumber, string]>;
    getStakedBalance(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    "getWithdrawableBalance(bytes32,address,uint256)"(pathId: PromiseOrValue<BytesLike>, recipient: PromiseOrValue<string>, time: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    "getWithdrawableBalance(bytes32,address)"(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    initPath(token: PromiseOrValue<string>, counterpartChainId: PromiseOrValue<BigNumberish>, counterpartToken: PromiseOrValue<string>, dispatcher: PromiseOrValue<string>, executor: PromiseOrValue<string>, initialSourceReserve: PromiseOrValue<BigNumberish>, initialDestinationReserve: PromiseOrValue<BigNumberish>, attestationFeeRate: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    initRole(role: PromiseOrValue<BytesLike>, minStake: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    isCheckpointValid(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    isStaked(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    minChallengeIncrease(overrides?: CallOverrides): Promise<BigNumber>;
    minHopStakeForRole(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
    optimisticallySettleChallenge(staker: PromiseOrValue<string>, challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    owner(overrides?: CallOverrides): Promise<string>;
    postClaim(pathId: PromiseOrValue<BytesLike>, transferId: PromiseOrValue<BytesLike>, head: PromiseOrValue<BytesLike>, totalSent: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    removeClaim(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, nonce: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    renounceOwnership(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    send(pathId: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
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
    "withdraw(bytes32,address)"(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    "withdraw(bytes32,uint256,uint256)"(pathId: PromiseOrValue<BytesLike>, amount: PromiseOrValue<BigNumberish>, time: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    withdrawAll(pathId: PromiseOrValue<BytesLike>, time: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    withdrawableEth(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    callStatic: {
        _settleChallenge(challengeId: PromiseOrValue<BytesLike>, challengeWon: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        acceptSlash(challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        addToAppeal(staker: PromiseOrValue<string>, challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        addToChallenge(staker: PromiseOrValue<string>, challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        appealPeriod(overrides?: CallOverrides): Promise<BigNumber>;
        bond(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, totalSent: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
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
        confirmCheckpoint(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        createChallenge(staker: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        forceSettleChallenge(challengeId: PromiseOrValue<BytesLike>, challengeWon: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        fullAppeal(overrides?: CallOverrides): Promise<BigNumber>;
        getChallengeId(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, penalty: PromiseOrValue<BigNumberish>, challenger: PromiseOrValue<string>, slashingData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        getFee(pathId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        getLatestClaim(pathId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        getPathId(chainId0: PromiseOrValue<BigNumberish>, token0: PromiseOrValue<string>, chainId1: PromiseOrValue<BigNumberish>, token1: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
        getPathInfo(pathId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[BigNumber, string, BigNumber, string]>;
        getStakedBalance(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        "getWithdrawableBalance(bytes32,address,uint256)"(pathId: PromiseOrValue<BytesLike>, recipient: PromiseOrValue<string>, time: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        "getWithdrawableBalance(bytes32,address)"(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        initPath(token: PromiseOrValue<string>, counterpartChainId: PromiseOrValue<BigNumberish>, counterpartToken: PromiseOrValue<string>, dispatcher: PromiseOrValue<string>, executor: PromiseOrValue<string>, initialSourceReserve: PromiseOrValue<BigNumberish>, initialDestinationReserve: PromiseOrValue<BigNumberish>, attestationFeeRate: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        initRole(role: PromiseOrValue<BytesLike>, minStake: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        isCheckpointValid(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
        isStaked(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        minChallengeIncrease(overrides?: CallOverrides): Promise<BigNumber>;
        minHopStakeForRole(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        optimisticallySettleChallenge(staker: PromiseOrValue<string>, challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        owner(overrides?: CallOverrides): Promise<string>;
        postClaim(pathId: PromiseOrValue<BytesLike>, transferId: PromiseOrValue<BytesLike>, head: PromiseOrValue<BytesLike>, totalSent: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        removeClaim(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, nonce: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        renounceOwnership(overrides?: CallOverrides): Promise<void>;
        send(pathId: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        stakeHop(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        unstakeHop(role: PromiseOrValue<BytesLike>, amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        "withdraw(bytes32,address)"(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        "withdraw(bytes32,uint256,uint256)"(pathId: PromiseOrValue<BytesLike>, amount: PromiseOrValue<BigNumberish>, time: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        withdrawAll(pathId: PromiseOrValue<BytesLike>, time: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        withdrawableEth(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    filters: {
        "OwnershipTransferred(address,address)"(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        OwnershipTransferred(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        "TransferBonded(bytes32,bytes32,bytes32,address,uint256,uint256)"(pathId?: PromiseOrValue<BytesLike> | null, transferId?: null, checkpoint?: PromiseOrValue<BytesLike> | null, to?: PromiseOrValue<string> | null, amountOut?: null, totalSent?: null): TransferBondedEventFilter;
        TransferBonded(pathId?: PromiseOrValue<BytesLike> | null, transferId?: null, checkpoint?: PromiseOrValue<BytesLike> | null, to?: PromiseOrValue<string> | null, amountOut?: null, totalSent?: null): TransferBondedEventFilter;
        "TransferSent(bytes32,bytes32,bytes32,address,uint256,uint256,uint256,uint256,bytes32)"(pathId?: PromiseOrValue<BytesLike> | null, transferId?: null, checkpoint?: PromiseOrValue<BytesLike> | null, to?: PromiseOrValue<string> | null, amount?: null, attestationFee?: null, totalSent?: null, nonce?: null, attestedCheckpoint?: null): TransferSentEventFilter;
        TransferSent(pathId?: PromiseOrValue<BytesLike> | null, transferId?: null, checkpoint?: PromiseOrValue<BytesLike> | null, to?: PromiseOrValue<string> | null, amount?: null, attestationFee?: null, totalSent?: null, nonce?: null, attestedCheckpoint?: null): TransferSentEventFilter;
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
        bond(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, totalSent: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        challengePeriod(overrides?: CallOverrides): Promise<BigNumber>;
        challenges(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        confirmCheckpoint(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        createChallenge(staker: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        forceSettleChallenge(challengeId: PromiseOrValue<BytesLike>, challengeWon: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        fullAppeal(overrides?: CallOverrides): Promise<BigNumber>;
        getChallengeId(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, penalty: PromiseOrValue<BigNumberish>, challenger: PromiseOrValue<string>, slashingData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        getFee(pathId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        getLatestClaim(pathId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        getPathId(chainId0: PromiseOrValue<BigNumberish>, token0: PromiseOrValue<string>, chainId1: PromiseOrValue<BigNumberish>, token1: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getPathInfo(pathId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        getStakedBalance(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        "getWithdrawableBalance(bytes32,address,uint256)"(pathId: PromiseOrValue<BytesLike>, recipient: PromiseOrValue<string>, time: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        "getWithdrawableBalance(bytes32,address)"(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        initPath(token: PromiseOrValue<string>, counterpartChainId: PromiseOrValue<BigNumberish>, counterpartToken: PromiseOrValue<string>, dispatcher: PromiseOrValue<string>, executor: PromiseOrValue<string>, initialSourceReserve: PromiseOrValue<BigNumberish>, initialDestinationReserve: PromiseOrValue<BigNumberish>, attestationFeeRate: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        initRole(role: PromiseOrValue<BytesLike>, minStake: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        isCheckpointValid(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        isStaked(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        minChallengeIncrease(overrides?: CallOverrides): Promise<BigNumber>;
        minHopStakeForRole(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        optimisticallySettleChallenge(staker: PromiseOrValue<string>, challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<BigNumber>;
        postClaim(pathId: PromiseOrValue<BytesLike>, transferId: PromiseOrValue<BytesLike>, head: PromiseOrValue<BytesLike>, totalSent: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        removeClaim(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, nonce: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        send(pathId: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
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
        "withdraw(bytes32,address)"(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        "withdraw(bytes32,uint256,uint256)"(pathId: PromiseOrValue<BytesLike>, amount: PromiseOrValue<BigNumberish>, time: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        withdrawAll(pathId: PromiseOrValue<BytesLike>, time: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
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
        bond(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, totalSent: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        challengePeriod(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        challenges(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        confirmCheckpoint(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        createChallenge(staker: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        forceSettleChallenge(challengeId: PromiseOrValue<BytesLike>, challengeWon: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        fullAppeal(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getChallengeId(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, penalty: PromiseOrValue<BigNumberish>, challenger: PromiseOrValue<string>, slashingData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getFee(pathId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getLatestClaim(pathId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getPathId(chainId0: PromiseOrValue<BigNumberish>, token0: PromiseOrValue<string>, chainId1: PromiseOrValue<BigNumberish>, token1: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getPathInfo(pathId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getStakedBalance(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        "getWithdrawableBalance(bytes32,address,uint256)"(pathId: PromiseOrValue<BytesLike>, recipient: PromiseOrValue<string>, time: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        "getWithdrawableBalance(bytes32,address)"(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        initPath(token: PromiseOrValue<string>, counterpartChainId: PromiseOrValue<BigNumberish>, counterpartToken: PromiseOrValue<string>, dispatcher: PromiseOrValue<string>, executor: PromiseOrValue<string>, initialSourceReserve: PromiseOrValue<BigNumberish>, initialDestinationReserve: PromiseOrValue<BigNumberish>, attestationFeeRate: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        initRole(role: PromiseOrValue<BytesLike>, minStake: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        isCheckpointValid(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isStaked(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        minChallengeIncrease(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        minHopStakeForRole(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        optimisticallySettleChallenge(staker: PromiseOrValue<string>, challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        postClaim(pathId: PromiseOrValue<BytesLike>, transferId: PromiseOrValue<BytesLike>, head: PromiseOrValue<BytesLike>, totalSent: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        removeClaim(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, nonce: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        send(pathId: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
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
        "withdraw(bytes32,address)"(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        "withdraw(bytes32,uint256,uint256)"(pathId: PromiseOrValue<BytesLike>, amount: PromiseOrValue<BigNumberish>, time: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        withdrawAll(pathId: PromiseOrValue<BytesLike>, time: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        withdrawableEth(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=RailsGateway.d.ts.map