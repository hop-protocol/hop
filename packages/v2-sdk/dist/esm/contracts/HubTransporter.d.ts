import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common.js";
export interface HubTransporterInterface extends utils.Interface {
    functions: {
        "absoluteMaxFee()": FunctionFragment;
        "dispatchCommitment(uint256,bytes32)": FunctionFragment;
        "dispatcher()": FunctionFragment;
        "getChainId()": FunctionFragment;
        "getRelayReward(uint256,uint256)": FunctionFragment;
        "getSpokeChainId(address)": FunctionFragment;
        "getSpokeConnector(uint256)": FunctionFragment;
        "getSpokeExitTime(uint256)": FunctionFragment;
        "isCommitmentProven(uint256,bytes32)": FunctionFragment;
        "maxFeeBPS()": FunctionFragment;
        "owner()": FunctionFragment;
        "provenCommitments(uint256,bytes32)": FunctionFragment;
        "receiveOrForwardCommitment(bytes32,uint256,uint256,uint256)": FunctionFragment;
        "relayWindow()": FunctionFragment;
        "renounceOwnership()": FunctionFragment;
        "setAbsoluteMaxFee(uint256)": FunctionFragment;
        "setDispatcher(address)": FunctionFragment;
        "setMaxFeeBPS(uint256)": FunctionFragment;
        "setRelayWindow(uint256)": FunctionFragment;
        "setSpokeConnector(uint256,address,uint256)": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "absoluteMaxFee" | "dispatchCommitment" | "dispatcher" | "getChainId" | "getRelayReward" | "getSpokeChainId" | "getSpokeConnector" | "getSpokeExitTime" | "isCommitmentProven" | "maxFeeBPS" | "owner" | "provenCommitments" | "receiveOrForwardCommitment" | "relayWindow" | "renounceOwnership" | "setAbsoluteMaxFee" | "setDispatcher" | "setMaxFeeBPS" | "setRelayWindow" | "setSpokeConnector" | "transferOwnership"): FunctionFragment;
    encodeFunctionData(functionFragment: "absoluteMaxFee", values?: undefined): string;
    encodeFunctionData(functionFragment: "dispatchCommitment", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "dispatcher", values?: undefined): string;
    encodeFunctionData(functionFragment: "getChainId", values?: undefined): string;
    encodeFunctionData(functionFragment: "getRelayReward", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getSpokeChainId", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getSpokeConnector", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getSpokeExitTime", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "isCommitmentProven", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "maxFeeBPS", values?: undefined): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "provenCommitments", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "receiveOrForwardCommitment", values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "relayWindow", values?: undefined): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "setAbsoluteMaxFee", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setDispatcher", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "setMaxFeeBPS", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setRelayWindow", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setSpokeConnector", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    decodeFunctionResult(functionFragment: "absoluteMaxFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "dispatchCommitment", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "dispatcher", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRelayReward", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getSpokeChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getSpokeConnector", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getSpokeExitTime", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isCommitmentProven", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "maxFeeBPS", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "provenCommitments", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "receiveOrForwardCommitment", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "relayWindow", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setAbsoluteMaxFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setDispatcher", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setMaxFeeBPS", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setRelayWindow", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setSpokeConnector", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    events: {
        "CommitmentDispatched(uint256,bytes32,uint256)": EventFragment;
        "CommitmentForwarded(uint256,uint256,bytes32)": EventFragment;
        "CommitmentProven(uint256,bytes32)": EventFragment;
        "CommitmentRelayed(uint256,uint256,bytes32,uint256,uint256,address)": EventFragment;
        "ConfigUpdated()": EventFragment;
        "OwnershipTransferred(address,address)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "CommitmentDispatched"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "CommitmentForwarded"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "CommitmentProven"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "CommitmentRelayed"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "ConfigUpdated"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}
export interface CommitmentDispatchedEventObject {
    toChainId: BigNumber;
    commitment: string;
    timestamp: BigNumber;
}
export type CommitmentDispatchedEvent = TypedEvent<[
    BigNumber,
    string,
    BigNumber
], CommitmentDispatchedEventObject>;
export type CommitmentDispatchedEventFilter = TypedEventFilter<CommitmentDispatchedEvent>;
export interface CommitmentForwardedEventObject {
    fromChainId: BigNumber;
    toChainId: BigNumber;
    commitment: string;
}
export type CommitmentForwardedEvent = TypedEvent<[
    BigNumber,
    BigNumber,
    string
], CommitmentForwardedEventObject>;
export type CommitmentForwardedEventFilter = TypedEventFilter<CommitmentForwardedEvent>;
export interface CommitmentProvenEventObject {
    fromChainId: BigNumber;
    commitment: string;
}
export type CommitmentProvenEvent = TypedEvent<[
    BigNumber,
    string
], CommitmentProvenEventObject>;
export type CommitmentProvenEventFilter = TypedEventFilter<CommitmentProvenEvent>;
export interface CommitmentRelayedEventObject {
    fromChainId: BigNumber;
    toChainId: BigNumber;
    commitment: string;
    transportFee: BigNumber;
    relayWindowStart: BigNumber;
    relayer: string;
}
export type CommitmentRelayedEvent = TypedEvent<[
    BigNumber,
    BigNumber,
    string,
    BigNumber,
    BigNumber,
    string
], CommitmentRelayedEventObject>;
export type CommitmentRelayedEventFilter = TypedEventFilter<CommitmentRelayedEvent>;
export interface ConfigUpdatedEventObject {
}
export type ConfigUpdatedEvent = TypedEvent<[], ConfigUpdatedEventObject>;
export type ConfigUpdatedEventFilter = TypedEventFilter<ConfigUpdatedEvent>;
export interface OwnershipTransferredEventObject {
    previousOwner: string;
    newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<[
    string,
    string
], OwnershipTransferredEventObject>;
export type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;
export interface HubTransporter extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: HubTransporterInterface;
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
        absoluteMaxFee(overrides?: CallOverrides): Promise<[BigNumber]>;
        dispatchCommitment(toChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        dispatcher(overrides?: CallOverrides): Promise<[string]>;
        getChainId(overrides?: CallOverrides): Promise<[BigNumber] & {
            chainId: BigNumber;
        }>;
        getRelayReward(relayWindowStart: PromiseOrValue<BigNumberish>, feesCollected: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        getSpokeChainId(connector: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        getSpokeConnector(chainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        getSpokeExitTime(chainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        isCommitmentProven(fromChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
        maxFeeBPS(overrides?: CallOverrides): Promise<[BigNumber]>;
        owner(overrides?: CallOverrides): Promise<[string]>;
        provenCommitments(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
        receiveOrForwardCommitment(commitment: PromiseOrValue<BytesLike>, transportFee: PromiseOrValue<BigNumberish>, toChainId: PromiseOrValue<BigNumberish>, commitTime: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        relayWindow(overrides?: CallOverrides): Promise<[BigNumber]>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setAbsoluteMaxFee(_absoluteMaxFee: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setDispatcher(_dispatcher: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setMaxFeeBPS(_maxFeeBPS: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setRelayWindow(_relayWindow: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setSpokeConnector(chainId: PromiseOrValue<BigNumberish>, connector: PromiseOrValue<string>, exitTime: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    absoluteMaxFee(overrides?: CallOverrides): Promise<BigNumber>;
    dispatchCommitment(toChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    dispatcher(overrides?: CallOverrides): Promise<string>;
    getChainId(overrides?: CallOverrides): Promise<BigNumber>;
    getRelayReward(relayWindowStart: PromiseOrValue<BigNumberish>, feesCollected: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    getSpokeChainId(connector: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    getSpokeConnector(chainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    getSpokeExitTime(chainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    isCommitmentProven(fromChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    maxFeeBPS(overrides?: CallOverrides): Promise<BigNumber>;
    owner(overrides?: CallOverrides): Promise<string>;
    provenCommitments(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    receiveOrForwardCommitment(commitment: PromiseOrValue<BytesLike>, transportFee: PromiseOrValue<BigNumberish>, toChainId: PromiseOrValue<BigNumberish>, commitTime: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    relayWindow(overrides?: CallOverrides): Promise<BigNumber>;
    renounceOwnership(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setAbsoluteMaxFee(_absoluteMaxFee: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setDispatcher(_dispatcher: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setMaxFeeBPS(_maxFeeBPS: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setRelayWindow(_relayWindow: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setSpokeConnector(chainId: PromiseOrValue<BigNumberish>, connector: PromiseOrValue<string>, exitTime: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        absoluteMaxFee(overrides?: CallOverrides): Promise<BigNumber>;
        dispatchCommitment(toChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        dispatcher(overrides?: CallOverrides): Promise<string>;
        getChainId(overrides?: CallOverrides): Promise<BigNumber>;
        getRelayReward(relayWindowStart: PromiseOrValue<BigNumberish>, feesCollected: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getSpokeChainId(connector: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getSpokeConnector(chainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        getSpokeExitTime(chainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        isCommitmentProven(fromChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
        maxFeeBPS(overrides?: CallOverrides): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<string>;
        provenCommitments(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
        receiveOrForwardCommitment(commitment: PromiseOrValue<BytesLike>, transportFee: PromiseOrValue<BigNumberish>, toChainId: PromiseOrValue<BigNumberish>, commitTime: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        relayWindow(overrides?: CallOverrides): Promise<BigNumber>;
        renounceOwnership(overrides?: CallOverrides): Promise<void>;
        setAbsoluteMaxFee(_absoluteMaxFee: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setDispatcher(_dispatcher: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setMaxFeeBPS(_maxFeeBPS: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setRelayWindow(_relayWindow: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setSpokeConnector(chainId: PromiseOrValue<BigNumberish>, connector: PromiseOrValue<string>, exitTime: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "CommitmentDispatched(uint256,bytes32,uint256)"(toChainId?: PromiseOrValue<BigNumberish> | null, commitment?: PromiseOrValue<BytesLike> | null, timestamp?: null): CommitmentDispatchedEventFilter;
        CommitmentDispatched(toChainId?: PromiseOrValue<BigNumberish> | null, commitment?: PromiseOrValue<BytesLike> | null, timestamp?: null): CommitmentDispatchedEventFilter;
        "CommitmentForwarded(uint256,uint256,bytes32)"(fromChainId?: PromiseOrValue<BigNumberish> | null, toChainId?: PromiseOrValue<BigNumberish> | null, commitment?: PromiseOrValue<BytesLike> | null): CommitmentForwardedEventFilter;
        CommitmentForwarded(fromChainId?: PromiseOrValue<BigNumberish> | null, toChainId?: PromiseOrValue<BigNumberish> | null, commitment?: PromiseOrValue<BytesLike> | null): CommitmentForwardedEventFilter;
        "CommitmentProven(uint256,bytes32)"(fromChainId?: PromiseOrValue<BigNumberish> | null, commitment?: PromiseOrValue<BytesLike> | null): CommitmentProvenEventFilter;
        CommitmentProven(fromChainId?: PromiseOrValue<BigNumberish> | null, commitment?: PromiseOrValue<BytesLike> | null): CommitmentProvenEventFilter;
        "CommitmentRelayed(uint256,uint256,bytes32,uint256,uint256,address)"(fromChainId?: PromiseOrValue<BigNumberish> | null, toChainId?: null, commitment?: PromiseOrValue<BytesLike> | null, transportFee?: null, relayWindowStart?: null, relayer?: PromiseOrValue<string> | null): CommitmentRelayedEventFilter;
        CommitmentRelayed(fromChainId?: PromiseOrValue<BigNumberish> | null, toChainId?: null, commitment?: PromiseOrValue<BytesLike> | null, transportFee?: null, relayWindowStart?: null, relayer?: PromiseOrValue<string> | null): CommitmentRelayedEventFilter;
        "ConfigUpdated()"(): ConfigUpdatedEventFilter;
        ConfigUpdated(): ConfigUpdatedEventFilter;
        "OwnershipTransferred(address,address)"(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        OwnershipTransferred(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
    };
    estimateGas: {
        absoluteMaxFee(overrides?: CallOverrides): Promise<BigNumber>;
        dispatchCommitment(toChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        dispatcher(overrides?: CallOverrides): Promise<BigNumber>;
        getChainId(overrides?: CallOverrides): Promise<BigNumber>;
        getRelayReward(relayWindowStart: PromiseOrValue<BigNumberish>, feesCollected: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getSpokeChainId(connector: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getSpokeConnector(chainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getSpokeExitTime(chainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        isCommitmentProven(fromChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        maxFeeBPS(overrides?: CallOverrides): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<BigNumber>;
        provenCommitments(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        receiveOrForwardCommitment(commitment: PromiseOrValue<BytesLike>, transportFee: PromiseOrValue<BigNumberish>, toChainId: PromiseOrValue<BigNumberish>, commitTime: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        relayWindow(overrides?: CallOverrides): Promise<BigNumber>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setAbsoluteMaxFee(_absoluteMaxFee: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setDispatcher(_dispatcher: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setMaxFeeBPS(_maxFeeBPS: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setRelayWindow(_relayWindow: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setSpokeConnector(chainId: PromiseOrValue<BigNumberish>, connector: PromiseOrValue<string>, exitTime: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        absoluteMaxFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        dispatchCommitment(toChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        dispatcher(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getChainId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getRelayReward(relayWindowStart: PromiseOrValue<BigNumberish>, feesCollected: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getSpokeChainId(connector: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getSpokeConnector(chainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getSpokeExitTime(chainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isCommitmentProven(fromChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        maxFeeBPS(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        provenCommitments(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        receiveOrForwardCommitment(commitment: PromiseOrValue<BytesLike>, transportFee: PromiseOrValue<BigNumberish>, toChainId: PromiseOrValue<BigNumberish>, commitTime: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        relayWindow(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setAbsoluteMaxFee(_absoluteMaxFee: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setDispatcher(_dispatcher: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setMaxFeeBPS(_maxFeeBPS: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setRelayWindow(_relayWindow: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setSpokeConnector(chainId: PromiseOrValue<BigNumberish>, connector: PromiseOrValue<string>, exitTime: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=HubTransporter.d.ts.map