import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common.js";
export type BundleProofStruct = {
    bundleId: PromiseOrValue<BytesLike>;
    treeIndex: PromiseOrValue<BigNumberish>;
    siblings: PromiseOrValue<BytesLike>[];
    totalLeaves: PromiseOrValue<BigNumberish>;
};
export type BundleProofStructOutput = [
    string,
    BigNumber,
    string[],
    BigNumber
] & {
    bundleId: string;
    treeIndex: BigNumber;
    siblings: string[];
    totalLeaves: BigNumber;
};
export interface MessageBridgeInterface extends utils.Interface {
    functions: {
        "bundles(bytes32)": FunctionFragment;
        "getChainId()": FunctionFragment;
        "getSpokeMessageId(bytes32,uint256,uint256,address,uint256,address,bytes)": FunctionFragment;
        "getXDomainChainId()": FunctionFragment;
        "getXDomainData()": FunctionFragment;
        "getXDomainSender()": FunctionFragment;
        "noMessageList(address)": FunctionFragment;
        "owner()": FunctionFragment;
        "relayMessage(uint256,address,address,bytes,(bytes32,uint256,bytes32[],uint256))": FunctionFragment;
        "relayedMessage(bytes32)": FunctionFragment;
        "renounceOwnership()": FunctionFragment;
        "sendMessage(uint256,address,bytes)": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
        "validateProof((bytes32,uint256,bytes32[],uint256),bytes32)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "bundles" | "getChainId" | "getSpokeMessageId" | "getXDomainChainId" | "getXDomainData" | "getXDomainSender" | "noMessageList" | "owner" | "relayMessage" | "relayedMessage" | "renounceOwnership" | "sendMessage" | "transferOwnership" | "validateProof"): FunctionFragment;
    encodeFunctionData(functionFragment: "bundles", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "getChainId", values?: undefined): string;
    encodeFunctionData(functionFragment: "getSpokeMessageId", values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "getXDomainChainId", values?: undefined): string;
    encodeFunctionData(functionFragment: "getXDomainData", values?: undefined): string;
    encodeFunctionData(functionFragment: "getXDomainSender", values?: undefined): string;
    encodeFunctionData(functionFragment: "noMessageList", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "relayMessage", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>,
        BundleProofStruct
    ]): string;
    encodeFunctionData(functionFragment: "relayedMessage", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "sendMessage", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "validateProof", values: [BundleProofStruct, PromiseOrValue<BytesLike>]): string;
    decodeFunctionResult(functionFragment: "bundles", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getSpokeMessageId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getXDomainChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getXDomainData", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getXDomainSender", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "noMessageList", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "relayMessage", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "relayedMessage", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "sendMessage", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "validateProof", data: BytesLike): Result;
    events: {
        "BundleSet(bytes32,bytes32,uint256)": EventFragment;
        "MessageRelayed(bytes32,uint256,address,address)": EventFragment;
        "MessageReverted(bytes32,uint256,address,address)": EventFragment;
        "MessageSent(bytes32,address,uint256,address,bytes)": EventFragment;
        "OwnershipTransferred(address,address)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "BundleSet"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "MessageRelayed"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "MessageReverted"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "MessageSent"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}
export interface BundleSetEventObject {
    bundleId: string;
    bundleRoot: string;
    fromChainId: BigNumber;
}
export type BundleSetEvent = TypedEvent<[
    string,
    string,
    BigNumber
], BundleSetEventObject>;
export type BundleSetEventFilter = TypedEventFilter<BundleSetEvent>;
export interface MessageRelayedEventObject {
    messageId: string;
    fromChainId: BigNumber;
    from: string;
    to: string;
}
export type MessageRelayedEvent = TypedEvent<[
    string,
    BigNumber,
    string,
    string
], MessageRelayedEventObject>;
export type MessageRelayedEventFilter = TypedEventFilter<MessageRelayedEvent>;
export interface MessageRevertedEventObject {
    messageId: string;
    fromChainId: BigNumber;
    from: string;
    to: string;
}
export type MessageRevertedEvent = TypedEvent<[
    string,
    BigNumber,
    string,
    string
], MessageRevertedEventObject>;
export type MessageRevertedEventFilter = TypedEventFilter<MessageRevertedEvent>;
export interface MessageSentEventObject {
    messageId: string;
    from: string;
    toChainId: BigNumber;
    to: string;
    data: string;
}
export type MessageSentEvent = TypedEvent<[
    string,
    string,
    BigNumber,
    string,
    string
], MessageSentEventObject>;
export type MessageSentEventFilter = TypedEventFilter<MessageSentEvent>;
export interface OwnershipTransferredEventObject {
    previousOwner: string;
    newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<[
    string,
    string
], OwnershipTransferredEventObject>;
export type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;
export interface MessageBridge extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: MessageBridgeInterface;
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
        bundles(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string, BigNumber] & {
            root: string;
            fromChainId: BigNumber;
        }>;
        getChainId(overrides?: CallOverrides): Promise<[BigNumber] & {
            chainId: BigNumber;
        }>;
        getSpokeMessageId(bundleId: PromiseOrValue<BytesLike>, treeIndex: PromiseOrValue<BigNumberish>, fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string]>;
        getXDomainChainId(overrides?: CallOverrides): Promise<[BigNumber]>;
        getXDomainData(overrides?: CallOverrides): Promise<[BigNumber, string]>;
        getXDomainSender(overrides?: CallOverrides): Promise<[string]>;
        noMessageList(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        owner(overrides?: CallOverrides): Promise<[string]>;
        relayMessage(fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, bundleProof: BundleProofStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        relayedMessage(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        sendMessage(toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        validateProof(bundleProof: BundleProofStruct, messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[void]>;
    };
    bundles(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string, BigNumber] & {
        root: string;
        fromChainId: BigNumber;
    }>;
    getChainId(overrides?: CallOverrides): Promise<BigNumber>;
    getSpokeMessageId(bundleId: PromiseOrValue<BytesLike>, treeIndex: PromiseOrValue<BigNumberish>, fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
    getXDomainChainId(overrides?: CallOverrides): Promise<BigNumber>;
    getXDomainData(overrides?: CallOverrides): Promise<[BigNumber, string]>;
    getXDomainSender(overrides?: CallOverrides): Promise<string>;
    noMessageList(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    owner(overrides?: CallOverrides): Promise<string>;
    relayMessage(fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, bundleProof: BundleProofStruct, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    relayedMessage(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    renounceOwnership(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    sendMessage(toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    validateProof(bundleProof: BundleProofStruct, messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
    callStatic: {
        bundles(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string, BigNumber] & {
            root: string;
            fromChainId: BigNumber;
        }>;
        getChainId(overrides?: CallOverrides): Promise<BigNumber>;
        getSpokeMessageId(bundleId: PromiseOrValue<BytesLike>, treeIndex: PromiseOrValue<BigNumberish>, fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        getXDomainChainId(overrides?: CallOverrides): Promise<BigNumber>;
        getXDomainData(overrides?: CallOverrides): Promise<[BigNumber, string]>;
        getXDomainSender(overrides?: CallOverrides): Promise<string>;
        noMessageList(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        owner(overrides?: CallOverrides): Promise<string>;
        relayMessage(fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, bundleProof: BundleProofStruct, overrides?: CallOverrides): Promise<void>;
        relayedMessage(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
        renounceOwnership(overrides?: CallOverrides): Promise<void>;
        sendMessage(toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        validateProof(bundleProof: BundleProofStruct, messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "BundleSet(bytes32,bytes32,uint256)"(bundleId?: PromiseOrValue<BytesLike> | null, bundleRoot?: null, fromChainId?: PromiseOrValue<BigNumberish> | null): BundleSetEventFilter;
        BundleSet(bundleId?: PromiseOrValue<BytesLike> | null, bundleRoot?: null, fromChainId?: PromiseOrValue<BigNumberish> | null): BundleSetEventFilter;
        "MessageRelayed(bytes32,uint256,address,address)"(messageId?: null, fromChainId?: null, from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null): MessageRelayedEventFilter;
        MessageRelayed(messageId?: null, fromChainId?: null, from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null): MessageRelayedEventFilter;
        "MessageReverted(bytes32,uint256,address,address)"(messageId?: null, fromChainId?: null, from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null): MessageRevertedEventFilter;
        MessageReverted(messageId?: null, fromChainId?: null, from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null): MessageRevertedEventFilter;
        "MessageSent(bytes32,address,uint256,address,bytes)"(messageId?: PromiseOrValue<BytesLike> | null, from?: PromiseOrValue<string> | null, toChainId?: PromiseOrValue<BigNumberish> | null, to?: null, data?: null): MessageSentEventFilter;
        MessageSent(messageId?: PromiseOrValue<BytesLike> | null, from?: PromiseOrValue<string> | null, toChainId?: PromiseOrValue<BigNumberish> | null, to?: null, data?: null): MessageSentEventFilter;
        "OwnershipTransferred(address,address)"(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        OwnershipTransferred(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
    };
    estimateGas: {
        bundles(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        getChainId(overrides?: CallOverrides): Promise<BigNumber>;
        getSpokeMessageId(bundleId: PromiseOrValue<BytesLike>, treeIndex: PromiseOrValue<BigNumberish>, fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        getXDomainChainId(overrides?: CallOverrides): Promise<BigNumber>;
        getXDomainData(overrides?: CallOverrides): Promise<BigNumber>;
        getXDomainSender(overrides?: CallOverrides): Promise<BigNumber>;
        noMessageList(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<BigNumber>;
        relayMessage(fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, bundleProof: BundleProofStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        relayedMessage(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        sendMessage(toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        validateProof(bundleProof: BundleProofStruct, messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        bundles(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getChainId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getSpokeMessageId(bundleId: PromiseOrValue<BytesLike>, treeIndex: PromiseOrValue<BigNumberish>, fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getXDomainChainId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getXDomainData(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getXDomainSender(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        noMessageList(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        relayMessage(fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, bundleProof: BundleProofStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        relayedMessage(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        sendMessage(toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        validateProof(bundleProof: BundleProofStruct, messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=MessageBridge.d.ts.map