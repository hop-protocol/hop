import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common.js";
export interface TransporterInterface extends utils.Interface {
    functions: {
        "dispatchCommitment(uint256,bytes32)": FunctionFragment;
        "dispatcher()": FunctionFragment;
        "getChainId()": FunctionFragment;
        "isCommitmentProven(uint256,bytes32)": FunctionFragment;
        "owner()": FunctionFragment;
        "provenCommitments(uint256,bytes32)": FunctionFragment;
        "renounceOwnership()": FunctionFragment;
        "setDispatcher(address)": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "dispatchCommitment" | "dispatcher" | "getChainId" | "isCommitmentProven" | "owner" | "provenCommitments" | "renounceOwnership" | "setDispatcher" | "transferOwnership"): FunctionFragment;
    encodeFunctionData(functionFragment: "dispatchCommitment", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "dispatcher", values?: undefined): string;
    encodeFunctionData(functionFragment: "getChainId", values?: undefined): string;
    encodeFunctionData(functionFragment: "isCommitmentProven", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "provenCommitments", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "setDispatcher", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    decodeFunctionResult(functionFragment: "dispatchCommitment", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "dispatcher", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isCommitmentProven", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "provenCommitments", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setDispatcher", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    events: {
        "CommitmentDispatched(uint256,bytes32,uint256)": EventFragment;
        "CommitmentProven(uint256,bytes32)": EventFragment;
        "OwnershipTransferred(address,address)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "CommitmentDispatched"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "CommitmentProven"): EventFragment;
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
export interface OwnershipTransferredEventObject {
    previousOwner: string;
    newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<[
    string,
    string
], OwnershipTransferredEventObject>;
export type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;
export interface Transporter extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: TransporterInterface;
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
        getChainId(overrides?: CallOverrides): Promise<[BigNumber] & {
            chainId: BigNumber;
        }>;
        isCommitmentProven(fromChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
        owner(overrides?: CallOverrides): Promise<[string]>;
        provenCommitments(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setDispatcher(_dispatcher: PromiseOrValue<string>, overrides?: Overrides & {
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
    getChainId(overrides?: CallOverrides): Promise<BigNumber>;
    isCommitmentProven(fromChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    owner(overrides?: CallOverrides): Promise<string>;
    provenCommitments(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    renounceOwnership(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setDispatcher(_dispatcher: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        dispatchCommitment(toChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        dispatcher(overrides?: CallOverrides): Promise<string>;
        getChainId(overrides?: CallOverrides): Promise<BigNumber>;
        isCommitmentProven(fromChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
        owner(overrides?: CallOverrides): Promise<string>;
        provenCommitments(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
        renounceOwnership(overrides?: CallOverrides): Promise<void>;
        setDispatcher(_dispatcher: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "CommitmentDispatched(uint256,bytes32,uint256)"(toChainId?: PromiseOrValue<BigNumberish> | null, commitment?: PromiseOrValue<BytesLike> | null, timestamp?: null): CommitmentDispatchedEventFilter;
        CommitmentDispatched(toChainId?: PromiseOrValue<BigNumberish> | null, commitment?: PromiseOrValue<BytesLike> | null, timestamp?: null): CommitmentDispatchedEventFilter;
        "CommitmentProven(uint256,bytes32)"(fromChainId?: PromiseOrValue<BigNumberish> | null, commitment?: PromiseOrValue<BytesLike> | null): CommitmentProvenEventFilter;
        CommitmentProven(fromChainId?: PromiseOrValue<BigNumberish> | null, commitment?: PromiseOrValue<BytesLike> | null): CommitmentProvenEventFilter;
        "OwnershipTransferred(address,address)"(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        OwnershipTransferred(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
    };
    estimateGas: {
        dispatchCommitment(toChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        dispatcher(overrides?: CallOverrides): Promise<BigNumber>;
        getChainId(overrides?: CallOverrides): Promise<BigNumber>;
        isCommitmentProven(fromChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<BigNumber>;
        provenCommitments(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setDispatcher(_dispatcher: PromiseOrValue<string>, overrides?: Overrides & {
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
        getChainId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isCommitmentProven(fromChainId: PromiseOrValue<BigNumberish>, commitment: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        provenCommitments(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setDispatcher(_dispatcher: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=Transporter.d.ts.map