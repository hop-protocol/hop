import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common.js";
export interface DispatcherInterface extends utils.Interface {
    functions: {
        "commitPendingBundle(uint256)": FunctionFragment;
        "dispatchMessage(uint256,address,bytes)": FunctionFragment;
        "eip712Domain()": FunctionFragment;
        "getBundleId(uint256,uint256,bytes32,bytes32)": FunctionFragment;
        "getChainId()": FunctionFragment;
        "getFee(uint256[])": FunctionFragment;
        "initialBundleNonce(uint256)": FunctionFragment;
        "maxBundleMessagesForChainId(uint256)": FunctionFragment;
        "messageFeeForChainId(uint256)": FunctionFragment;
        "owner()": FunctionFragment;
        "pendingBundleNonceForChainId(uint256)": FunctionFragment;
        "pendingFeesForChainId(uint256)": FunctionFragment;
        "pendingMessageIdsForChainId(uint256,uint256)": FunctionFragment;
        "renounceOwnership()": FunctionFragment;
        "setRoute(uint256,uint256,uint256)": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
        "transporter()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "commitPendingBundle" | "dispatchMessage" | "eip712Domain" | "getBundleId" | "getChainId" | "getFee" | "initialBundleNonce" | "maxBundleMessagesForChainId" | "messageFeeForChainId" | "owner" | "pendingBundleNonceForChainId" | "pendingFeesForChainId" | "pendingMessageIdsForChainId" | "renounceOwnership" | "setRoute" | "transferOwnership" | "transporter"): FunctionFragment;
    encodeFunctionData(functionFragment: "commitPendingBundle", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "dispatchMessage", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "eip712Domain", values?: undefined): string;
    encodeFunctionData(functionFragment: "getBundleId", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "getChainId", values?: undefined): string;
    encodeFunctionData(functionFragment: "getFee", values: [PromiseOrValue<BigNumberish>[]]): string;
    encodeFunctionData(functionFragment: "initialBundleNonce", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "maxBundleMessagesForChainId", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "messageFeeForChainId", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "pendingBundleNonceForChainId", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "pendingFeesForChainId", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "pendingMessageIdsForChainId", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "setRoute", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "transporter", values?: undefined): string;
    decodeFunctionResult(functionFragment: "commitPendingBundle", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "dispatchMessage", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "eip712Domain", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getBundleId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initialBundleNonce", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "maxBundleMessagesForChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "messageFeeForChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pendingBundleNonceForChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pendingFeesForChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pendingMessageIdsForChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setRoute", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transporter", data: BytesLike): Result;
    events: {
        "BundleCommitted(bytes32,bytes32,uint256,uint256,uint256)": EventFragment;
        "EIP712DomainChanged()": EventFragment;
        "MessageBundled(bytes32,uint256,bytes32)": EventFragment;
        "MessageSent(bytes32,address,uint256,address,bytes)": EventFragment;
        "OwnershipTransferred(address,address)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "BundleCommitted"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "EIP712DomainChanged"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "MessageBundled"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "MessageSent"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}
export interface BundleCommittedEventObject {
    bundleNonce: string;
    bundleRoot: string;
    bundleFees: BigNumber;
    toChainId: BigNumber;
    commitTime: BigNumber;
}
export type BundleCommittedEvent = TypedEvent<[
    string,
    string,
    BigNumber,
    BigNumber,
    BigNumber
], BundleCommittedEventObject>;
export type BundleCommittedEventFilter = TypedEventFilter<BundleCommittedEvent>;
export interface EIP712DomainChangedEventObject {
}
export type EIP712DomainChangedEvent = TypedEvent<[
], EIP712DomainChangedEventObject>;
export type EIP712DomainChangedEventFilter = TypedEventFilter<EIP712DomainChangedEvent>;
export interface MessageBundledEventObject {
    bundleNonce: string;
    treeIndex: BigNumber;
    messageId: string;
}
export type MessageBundledEvent = TypedEvent<[
    string,
    BigNumber,
    string
], MessageBundledEventObject>;
export type MessageBundledEventFilter = TypedEventFilter<MessageBundledEvent>;
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
export interface Dispatcher extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: DispatcherInterface;
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
        commitPendingBundle(toChainId: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        dispatchMessage(toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        eip712Domain(overrides?: CallOverrides): Promise<[
            string,
            string,
            string,
            BigNumber,
            string,
            string,
            BigNumber[]
        ] & {
            fields: string;
            name: string;
            version: string;
            chainId: BigNumber;
            verifyingContract: string;
            salt: string;
            extensions: BigNumber[];
        }>;
        getBundleId(fromChainId: PromiseOrValue<BigNumberish>, toChainId: PromiseOrValue<BigNumberish>, bundleNonce: PromiseOrValue<BytesLike>, bundleRoot: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string]>;
        getChainId(overrides?: CallOverrides): Promise<[BigNumber] & {
            chainId: BigNumber;
        }>;
        getFee(chainIds: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<[BigNumber]>;
        initialBundleNonce(toChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        maxBundleMessagesForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        messageFeeForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        owner(overrides?: CallOverrides): Promise<[string]>;
        pendingBundleNonceForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        pendingFeesForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        pendingMessageIdsForChainId(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setRoute(chainId: PromiseOrValue<BigNumberish>, messageFee: PromiseOrValue<BigNumberish>, maxBundleMessages: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        transporter(overrides?: CallOverrides): Promise<[string]>;
    };
    commitPendingBundle(toChainId: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    dispatchMessage(toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    eip712Domain(overrides?: CallOverrides): Promise<[
        string,
        string,
        string,
        BigNumber,
        string,
        string,
        BigNumber[]
    ] & {
        fields: string;
        name: string;
        version: string;
        chainId: BigNumber;
        verifyingContract: string;
        salt: string;
        extensions: BigNumber[];
    }>;
    getBundleId(fromChainId: PromiseOrValue<BigNumberish>, toChainId: PromiseOrValue<BigNumberish>, bundleNonce: PromiseOrValue<BytesLike>, bundleRoot: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
    getChainId(overrides?: CallOverrides): Promise<BigNumber>;
    getFee(chainIds: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<BigNumber>;
    initialBundleNonce(toChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    maxBundleMessagesForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    messageFeeForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    owner(overrides?: CallOverrides): Promise<string>;
    pendingBundleNonceForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    pendingFeesForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    pendingMessageIdsForChainId(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    renounceOwnership(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setRoute(chainId: PromiseOrValue<BigNumberish>, messageFee: PromiseOrValue<BigNumberish>, maxBundleMessages: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    transporter(overrides?: CallOverrides): Promise<string>;
    callStatic: {
        commitPendingBundle(toChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        dispatchMessage(toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        eip712Domain(overrides?: CallOverrides): Promise<[
            string,
            string,
            string,
            BigNumber,
            string,
            string,
            BigNumber[]
        ] & {
            fields: string;
            name: string;
            version: string;
            chainId: BigNumber;
            verifyingContract: string;
            salt: string;
            extensions: BigNumber[];
        }>;
        getBundleId(fromChainId: PromiseOrValue<BigNumberish>, toChainId: PromiseOrValue<BigNumberish>, bundleNonce: PromiseOrValue<BytesLike>, bundleRoot: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        getChainId(overrides?: CallOverrides): Promise<BigNumber>;
        getFee(chainIds: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<BigNumber>;
        initialBundleNonce(toChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        maxBundleMessagesForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        messageFeeForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<string>;
        pendingBundleNonceForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        pendingFeesForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        pendingMessageIdsForChainId(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        renounceOwnership(overrides?: CallOverrides): Promise<void>;
        setRoute(chainId: PromiseOrValue<BigNumberish>, messageFee: PromiseOrValue<BigNumberish>, maxBundleMessages: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        transporter(overrides?: CallOverrides): Promise<string>;
    };
    filters: {
        "BundleCommitted(bytes32,bytes32,uint256,uint256,uint256)"(bundleNonce?: PromiseOrValue<BytesLike> | null, bundleRoot?: null, bundleFees?: null, toChainId?: PromiseOrValue<BigNumberish> | null, commitTime?: null): BundleCommittedEventFilter;
        BundleCommitted(bundleNonce?: PromiseOrValue<BytesLike> | null, bundleRoot?: null, bundleFees?: null, toChainId?: PromiseOrValue<BigNumberish> | null, commitTime?: null): BundleCommittedEventFilter;
        "EIP712DomainChanged()"(): EIP712DomainChangedEventFilter;
        EIP712DomainChanged(): EIP712DomainChangedEventFilter;
        "MessageBundled(bytes32,uint256,bytes32)"(bundleNonce?: PromiseOrValue<BytesLike> | null, treeIndex?: PromiseOrValue<BigNumberish> | null, messageId?: PromiseOrValue<BytesLike> | null): MessageBundledEventFilter;
        MessageBundled(bundleNonce?: PromiseOrValue<BytesLike> | null, treeIndex?: PromiseOrValue<BigNumberish> | null, messageId?: PromiseOrValue<BytesLike> | null): MessageBundledEventFilter;
        "MessageSent(bytes32,address,uint256,address,bytes)"(messageId?: PromiseOrValue<BytesLike> | null, from?: PromiseOrValue<string> | null, toChainId?: PromiseOrValue<BigNumberish> | null, to?: null, data?: null): MessageSentEventFilter;
        MessageSent(messageId?: PromiseOrValue<BytesLike> | null, from?: PromiseOrValue<string> | null, toChainId?: PromiseOrValue<BigNumberish> | null, to?: null, data?: null): MessageSentEventFilter;
        "OwnershipTransferred(address,address)"(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        OwnershipTransferred(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
    };
    estimateGas: {
        commitPendingBundle(toChainId: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        dispatchMessage(toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        eip712Domain(overrides?: CallOverrides): Promise<BigNumber>;
        getBundleId(fromChainId: PromiseOrValue<BigNumberish>, toChainId: PromiseOrValue<BigNumberish>, bundleNonce: PromiseOrValue<BytesLike>, bundleRoot: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        getChainId(overrides?: CallOverrides): Promise<BigNumber>;
        getFee(chainIds: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<BigNumber>;
        initialBundleNonce(toChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        maxBundleMessagesForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        messageFeeForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<BigNumber>;
        pendingBundleNonceForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        pendingFeesForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        pendingMessageIdsForChainId(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setRoute(chainId: PromiseOrValue<BigNumberish>, messageFee: PromiseOrValue<BigNumberish>, maxBundleMessages: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        transporter(overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        commitPendingBundle(toChainId: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        dispatchMessage(toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        eip712Domain(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getBundleId(fromChainId: PromiseOrValue<BigNumberish>, toChainId: PromiseOrValue<BigNumberish>, bundleNonce: PromiseOrValue<BytesLike>, bundleRoot: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getChainId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getFee(chainIds: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<PopulatedTransaction>;
        initialBundleNonce(toChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        maxBundleMessagesForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        messageFeeForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        pendingBundleNonceForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        pendingFeesForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        pendingMessageIdsForChainId(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setRoute(chainId: PromiseOrValue<BigNumberish>, messageFee: PromiseOrValue<BigNumberish>, maxBundleMessages: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        transporter(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=Dispatcher.d.ts.map