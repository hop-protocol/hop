import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common.js";
export interface SpokeTransporterInterface extends utils.Interface {
    functions: {
        "dispatchCommitment(uint256,bytes32)": FunctionFragment;
        "dispatcher()": FunctionFragment;
        "distributeFees()": FunctionFragment;
        "feeCollector()": FunctionFragment;
        "feeForCommitment(bytes32)": FunctionFragment;
        "feeReserve()": FunctionFragment;
        "getChainId()": FunctionFragment;
        "hubChainId()": FunctionFragment;
        "hubTransporterConnector()": FunctionFragment;
        "isCommitmentProven(uint256,bytes32)": FunctionFragment;
        "owner()": FunctionFragment;
        "payRelayerFee(address,uint256,bytes32)": FunctionFragment;
        "pendingBundleNonceForChainId(uint256)": FunctionFragment;
        "pendingFeeBatchSize()": FunctionFragment;
        "pendingMessageIdsForChainId(uint256,uint256)": FunctionFragment;
        "provenCommitments(uint256,bytes32)": FunctionFragment;
        "receiveCommitment(uint256,bytes32)": FunctionFragment;
        "renounceOwnership()": FunctionFragment;
        "setDispatcher(address)": FunctionFragment;
        "setHubConnector(address)": FunctionFragment;
        "setpendingFeeBatchSize(uint256)": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "dispatchCommitment" | "dispatcher" | "distributeFees" | "feeCollector" | "feeForCommitment" | "feeReserve" | "getChainId" | "hubChainId" | "hubTransporterConnector" | "isCommitmentProven" | "owner" | "payRelayerFee" | "pendingBundleNonceForChainId" | "pendingFeeBatchSize" | "pendingMessageIdsForChainId" | "provenCommitments" | "receiveCommitment" | "renounceOwnership" | "setDispatcher" | "setHubConnector" | "setpendingFeeBatchSize" | "transferOwnership"): FunctionFragment;
    encodeFunctionData(functionFragment: "dispatchCommitment", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "dispatcher", values?: undefined): string;
    encodeFunctionData(functionFragment: "distributeFees", values?: undefined): string;
    encodeFunctionData(functionFragment: "feeCollector", values?: undefined): string;
    encodeFunctionData(functionFragment: "feeForCommitment", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "feeReserve", values?: undefined): string;
    encodeFunctionData(functionFragment: "getChainId", values?: undefined): string;
    encodeFunctionData(functionFragment: "hubChainId", values?: undefined): string;
    encodeFunctionData(functionFragment: "hubTransporterConnector", values?: undefined): string;
    encodeFunctionData(functionFragment: "isCommitmentProven", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "payRelayerFee", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "pendingBundleNonceForChainId", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "pendingFeeBatchSize", values?: undefined): string;
    encodeFunctionData(functionFragment: "pendingMessageIdsForChainId", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "provenCommitments", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "receiveCommitment", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "setDispatcher", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "setHubConnector", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "setpendingFeeBatchSize", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    decodeFunctionResult(functionFragment: "dispatchCommitment", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "dispatcher", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "distributeFees", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "feeCollector", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "feeForCommitment", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "feeReserve", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hubChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hubTransporterConnector", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isCommitmentProven", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "payRelayerFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pendingBundleNonceForChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pendingFeeBatchSize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pendingMessageIdsForChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "provenCommitments", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "receiveCommitment", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setDispatcher", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setHubConnector", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setpendingFeeBatchSize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    events: {
        "CommitmentDispatched(uint256,bytes32,uint256)": EventFragment;
        "CommitmentProven(uint256,bytes32)": EventFragment;
        "ExcessFeesDistributed(address,uint256)": EventFragment;
        "FeePaid(address,uint256,uint256)": EventFragment;
        "OwnershipTransferred(address,address)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "CommitmentDispatched"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "CommitmentProven"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "ExcessFeesDistributed"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "FeePaid"): EventFragment;
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
export interface CommitmentProvenEventObject {
    fromChainId: BigNumber;
    commitment: string;
}
export type CommitmentProvenEvent = TypedEvent<[
    BigNumber,
    string
], CommitmentProvenEventObject>;
export type CommitmentProvenEventFilter = TypedEventFilter<CommitmentProvenEvent>;
export interface ExcessFeesDistributedEventObject {
    to: string;
    amount: BigNumber;
}
export type ExcessFeesDistributedEvent = TypedEvent<[
    string,
    BigNumber
], ExcessFeesDistributedEventObject>;
export type ExcessFeesDistributedEventFilter = TypedEventFilter<ExcessFeesDistributedEvent>;
export interface FeePaidEventObject {
    to: string;
    amount: BigNumber;
    feesCollected: BigNumber;
}
export type FeePaidEvent = TypedEvent<[
    string,
    BigNumber,
    BigNumber
], FeePaidEventObject>;
export type FeePaidEventFilter = TypedEventFilter<FeePaidEvent>;
export interface OwnershipTransferredEventObject {
    previousOwner: string;
    newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<[
    string,
    string
], OwnershipTransferredEventObject>;
export type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;
export interface SpokeTransporter extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: SpokeTransporterInterface;
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
        dispatchCommitment(toChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        dispatcher(overrides?: CallOverrides): Promise<[string]>;
        distributeFees(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        feeCollector(overrides?: CallOverrides): Promise<[string]>;
        feeForCommitment(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[BigNumber]>;
        feeReserve(overrides?: CallOverrides): Promise<[BigNumber]>;
        getChainId(overrides?: CallOverrides): Promise<[BigNumber] & {
            chainId: BigNumber;
        }>;
        hubChainId(overrides?: CallOverrides): Promise<[BigNumber]>;
        hubTransporterConnector(overrides?: CallOverrides): Promise<[string]>;
        isCommitmentProven(fromChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
        owner(overrides?: CallOverrides): Promise<[string]>;
        payRelayerFee(relayer: PromiseOrValue<string>, relayerFee: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        pendingBundleNonceForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        pendingFeeBatchSize(overrides?: CallOverrides): Promise<[BigNumber]>;
        pendingMessageIdsForChainId(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        provenCommitments(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
        receiveCommitment(fromChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setDispatcher(_dispatcher: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setHubConnector(_hubTransporterConnector: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setpendingFeeBatchSize(_pendingFeeBatchSize: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    dispatchCommitment(toChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    dispatcher(overrides?: CallOverrides): Promise<string>;
    distributeFees(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    feeCollector(overrides?: CallOverrides): Promise<string>;
    feeForCommitment(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
    feeReserve(overrides?: CallOverrides): Promise<BigNumber>;
    getChainId(overrides?: CallOverrides): Promise<BigNumber>;
    hubChainId(overrides?: CallOverrides): Promise<BigNumber>;
    hubTransporterConnector(overrides?: CallOverrides): Promise<string>;
    isCommitmentProven(fromChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    owner(overrides?: CallOverrides): Promise<string>;
    payRelayerFee(relayer: PromiseOrValue<string>, relayerFee: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    pendingBundleNonceForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    pendingFeeBatchSize(overrides?: CallOverrides): Promise<BigNumber>;
    pendingMessageIdsForChainId(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    provenCommitments(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    receiveCommitment(fromChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    renounceOwnership(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setDispatcher(_dispatcher: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setHubConnector(_hubTransporterConnector: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setpendingFeeBatchSize(_pendingFeeBatchSize: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        dispatchCommitment(toChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        dispatcher(overrides?: CallOverrides): Promise<string>;
        distributeFees(overrides?: CallOverrides): Promise<void>;
        feeCollector(overrides?: CallOverrides): Promise<string>;
        feeForCommitment(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        feeReserve(overrides?: CallOverrides): Promise<BigNumber>;
        getChainId(overrides?: CallOverrides): Promise<BigNumber>;
        hubChainId(overrides?: CallOverrides): Promise<BigNumber>;
        hubTransporterConnector(overrides?: CallOverrides): Promise<string>;
        isCommitmentProven(fromChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
        owner(overrides?: CallOverrides): Promise<string>;
        payRelayerFee(relayer: PromiseOrValue<string>, relayerFee: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        pendingBundleNonceForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        pendingFeeBatchSize(overrides?: CallOverrides): Promise<BigNumber>;
        pendingMessageIdsForChainId(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        provenCommitments(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
        receiveCommitment(fromChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        renounceOwnership(overrides?: CallOverrides): Promise<void>;
        setDispatcher(_dispatcher: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setHubConnector(_hubTransporterConnector: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setpendingFeeBatchSize(_pendingFeeBatchSize: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "CommitmentDispatched(uint256,bytes32,uint256)"(toChainId?: PromiseOrValue<BigNumberish> | null, commitment?: PromiseOrValue<BytesLike> | null, timestamp?: null): CommitmentDispatchedEventFilter;
        CommitmentDispatched(toChainId?: PromiseOrValue<BigNumberish> | null, commitment?: PromiseOrValue<BytesLike> | null, timestamp?: null): CommitmentDispatchedEventFilter;
        "CommitmentProven(uint256,bytes32)"(fromChainId?: PromiseOrValue<BigNumberish> | null, commitment?: PromiseOrValue<BytesLike> | null): CommitmentProvenEventFilter;
        CommitmentProven(fromChainId?: PromiseOrValue<BigNumberish> | null, commitment?: PromiseOrValue<BytesLike> | null): CommitmentProvenEventFilter;
        "ExcessFeesDistributed(address,uint256)"(to?: PromiseOrValue<string> | null, amount?: null): ExcessFeesDistributedEventFilter;
        ExcessFeesDistributed(to?: PromiseOrValue<string> | null, amount?: null): ExcessFeesDistributedEventFilter;
        "FeePaid(address,uint256,uint256)"(to?: PromiseOrValue<string> | null, amount?: null, feesCollected?: null): FeePaidEventFilter;
        FeePaid(to?: PromiseOrValue<string> | null, amount?: null, feesCollected?: null): FeePaidEventFilter;
        "OwnershipTransferred(address,address)"(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        OwnershipTransferred(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
    };
    estimateGas: {
        dispatchCommitment(toChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        dispatcher(overrides?: CallOverrides): Promise<BigNumber>;
        distributeFees(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        feeCollector(overrides?: CallOverrides): Promise<BigNumber>;
        feeForCommitment(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        feeReserve(overrides?: CallOverrides): Promise<BigNumber>;
        getChainId(overrides?: CallOverrides): Promise<BigNumber>;
        hubChainId(overrides?: CallOverrides): Promise<BigNumber>;
        hubTransporterConnector(overrides?: CallOverrides): Promise<BigNumber>;
        isCommitmentProven(fromChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<BigNumber>;
        payRelayerFee(relayer: PromiseOrValue<string>, relayerFee: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        pendingBundleNonceForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        pendingFeeBatchSize(overrides?: CallOverrides): Promise<BigNumber>;
        pendingMessageIdsForChainId(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        provenCommitments(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        receiveCommitment(fromChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setDispatcher(_dispatcher: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setHubConnector(_hubTransporterConnector: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setpendingFeeBatchSize(_pendingFeeBatchSize: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        dispatchCommitment(toChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        dispatcher(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        distributeFees(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        feeCollector(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        feeForCommitment(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        feeReserve(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getChainId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        hubChainId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        hubTransporterConnector(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isCommitmentProven(fromChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        payRelayerFee(relayer: PromiseOrValue<string>, relayerFee: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        pendingBundleNonceForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        pendingFeeBatchSize(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        pendingMessageIdsForChainId(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        provenCommitments(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        receiveCommitment(fromChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setDispatcher(_dispatcher: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setHubConnector(_hubTransporterConnector: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setpendingFeeBatchSize(_pendingFeeBatchSize: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=SpokeTransporter.d.ts.map