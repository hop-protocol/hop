import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common.js";
export interface StakingRegistryInterface extends utils.Interface {
    functions: {
        "_settleChallenge(bytes32,bool)": FunctionFragment;
        "acceptSlash(address,bytes32,uint256,bytes)": FunctionFragment;
        "addToAppeal(address,address,bytes32,uint256,bytes)": FunctionFragment;
        "addToChallenge(address,address,bytes32,uint256,bytes)": FunctionFragment;
        "appealPeriod()": FunctionFragment;
        "challengePeriod()": FunctionFragment;
        "challenges(bytes32)": FunctionFragment;
        "createChallenge(address,bytes32,uint256,bytes)": FunctionFragment;
        "forceSettleChallenge(bytes32,bool)": FunctionFragment;
        "fullAppeal()": FunctionFragment;
        "getChallengeId(bytes32,address,uint256,address,bytes)": FunctionFragment;
        "getStakedBalance(bytes32,address)": FunctionFragment;
        "getWithdrawableBalance(bytes32,address)": FunctionFragment;
        "initRole(bytes32,uint256)": FunctionFragment;
        "isStaked(bytes32,address)": FunctionFragment;
        "minChallengeIncrease()": FunctionFragment;
        "minHopStakeForRole(bytes32)": FunctionFragment;
        "optimisticallySettleChallenge(address,address,bytes32,uint256,bytes)": FunctionFragment;
        "owner()": FunctionFragment;
        "renounceOwnership()": FunctionFragment;
        "stakeHop(bytes32,address,uint256)": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
        "unstakeHop(bytes32,uint256)": FunctionFragment;
        "withdraw(bytes32,address)": FunctionFragment;
        "withdrawableEth(address)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "_settleChallenge" | "acceptSlash" | "addToAppeal" | "addToChallenge" | "appealPeriod" | "challengePeriod" | "challenges" | "createChallenge" | "forceSettleChallenge" | "fullAppeal" | "getChallengeId" | "getStakedBalance" | "getWithdrawableBalance" | "initRole" | "isStaked" | "minChallengeIncrease" | "minHopStakeForRole" | "optimisticallySettleChallenge" | "owner" | "renounceOwnership" | "stakeHop" | "transferOwnership" | "unstakeHop" | "withdraw" | "withdrawableEth"): FunctionFragment;
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
    encodeFunctionData(functionFragment: "challengePeriod", values?: undefined): string;
    encodeFunctionData(functionFragment: "challenges", values: [PromiseOrValue<BytesLike>]): string;
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
    encodeFunctionData(functionFragment: "getStakedBalance", values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getWithdrawableBalance", values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "initRole", values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]): string;
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
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "stakeHop", values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "unstakeHop", values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "withdraw", values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "withdrawableEth", values: [PromiseOrValue<string>]): string;
    decodeFunctionResult(functionFragment: "_settleChallenge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "acceptSlash", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "addToAppeal", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "addToChallenge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "appealPeriod", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "challengePeriod", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "challenges", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "createChallenge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "forceSettleChallenge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "fullAppeal", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getChallengeId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getStakedBalance", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getWithdrawableBalance", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initRole", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isStaked", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "minChallengeIncrease", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "minHopStakeForRole", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "optimisticallySettleChallenge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "stakeHop", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "unstakeHop", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdrawableEth", data: BytesLike): Result;
    events: {
        "OwnershipTransferred(address,address)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
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
export interface StakingRegistry extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: StakingRegistryInterface;
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
        createChallenge(staker: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        forceSettleChallenge(challengeId: PromiseOrValue<BytesLike>, challengeWon: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        fullAppeal(overrides?: CallOverrides): Promise<[BigNumber]>;
        getChallengeId(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, penalty: PromiseOrValue<BigNumberish>, challenger: PromiseOrValue<string>, slashingData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string]>;
        getStakedBalance(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        getWithdrawableBalance(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        initRole(role: PromiseOrValue<BytesLike>, minStake: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        isStaked(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        minChallengeIncrease(overrides?: CallOverrides): Promise<[BigNumber]>;
        minHopStakeForRole(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[BigNumber]>;
        optimisticallySettleChallenge(staker: PromiseOrValue<string>, challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        owner(overrides?: CallOverrides): Promise<[string]>;
        renounceOwnership(overrides?: Overrides & {
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
    createChallenge(staker: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    forceSettleChallenge(challengeId: PromiseOrValue<BytesLike>, challengeWon: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    fullAppeal(overrides?: CallOverrides): Promise<BigNumber>;
    getChallengeId(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, penalty: PromiseOrValue<BigNumberish>, challenger: PromiseOrValue<string>, slashingData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
    getStakedBalance(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    getWithdrawableBalance(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    initRole(role: PromiseOrValue<BytesLike>, minStake: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    isStaked(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    minChallengeIncrease(overrides?: CallOverrides): Promise<BigNumber>;
    minHopStakeForRole(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
    optimisticallySettleChallenge(staker: PromiseOrValue<string>, challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    owner(overrides?: CallOverrides): Promise<string>;
    renounceOwnership(overrides?: Overrides & {
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
    withdrawableEth(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    callStatic: {
        _settleChallenge(challengeId: PromiseOrValue<BytesLike>, challengeWon: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        acceptSlash(challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        addToAppeal(staker: PromiseOrValue<string>, challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        addToChallenge(staker: PromiseOrValue<string>, challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        appealPeriod(overrides?: CallOverrides): Promise<BigNumber>;
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
        createChallenge(staker: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        forceSettleChallenge(challengeId: PromiseOrValue<BytesLike>, challengeWon: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        fullAppeal(overrides?: CallOverrides): Promise<BigNumber>;
        getChallengeId(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, penalty: PromiseOrValue<BigNumberish>, challenger: PromiseOrValue<string>, slashingData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        getStakedBalance(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getWithdrawableBalance(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        initRole(role: PromiseOrValue<BytesLike>, minStake: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        isStaked(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        minChallengeIncrease(overrides?: CallOverrides): Promise<BigNumber>;
        minHopStakeForRole(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        optimisticallySettleChallenge(staker: PromiseOrValue<string>, challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        owner(overrides?: CallOverrides): Promise<string>;
        renounceOwnership(overrides?: CallOverrides): Promise<void>;
        stakeHop(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        unstakeHop(role: PromiseOrValue<BytesLike>, amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        withdraw(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        withdrawableEth(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    filters: {
        "OwnershipTransferred(address,address)"(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        OwnershipTransferred(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
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
        challengePeriod(overrides?: CallOverrides): Promise<BigNumber>;
        challenges(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        createChallenge(staker: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        forceSettleChallenge(challengeId: PromiseOrValue<BytesLike>, challengeWon: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        fullAppeal(overrides?: CallOverrides): Promise<BigNumber>;
        getChallengeId(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, penalty: PromiseOrValue<BigNumberish>, challenger: PromiseOrValue<string>, slashingData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        getStakedBalance(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getWithdrawableBalance(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        initRole(role: PromiseOrValue<BytesLike>, minStake: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        isStaked(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        minChallengeIncrease(overrides?: CallOverrides): Promise<BigNumber>;
        minHopStakeForRole(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        optimisticallySettleChallenge(staker: PromiseOrValue<string>, challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<BigNumber>;
        renounceOwnership(overrides?: Overrides & {
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
        challengePeriod(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        challenges(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        createChallenge(staker: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        forceSettleChallenge(challengeId: PromiseOrValue<BytesLike>, challengeWon: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        fullAppeal(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getChallengeId(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, penalty: PromiseOrValue<BigNumberish>, challenger: PromiseOrValue<string>, slashingData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getStakedBalance(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getWithdrawableBalance(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        initRole(role: PromiseOrValue<BytesLike>, minStake: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        isStaked(role: PromiseOrValue<BytesLike>, staker: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        minChallengeIncrease(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        minHopStakeForRole(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        optimisticallySettleChallenge(staker: PromiseOrValue<string>, challenger: PromiseOrValue<string>, role: PromiseOrValue<BytesLike>, penalty: PromiseOrValue<BigNumberish>, slashingData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        renounceOwnership(overrides?: Overrides & {
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
        withdrawableEth(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=StakingRegistry.d.ts.map