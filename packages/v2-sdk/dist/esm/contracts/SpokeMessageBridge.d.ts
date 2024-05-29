import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common.js";
export type RouteStruct = {
    chainId: PromiseOrValue<BigNumberish>;
    messageFee: PromiseOrValue<BigNumberish>;
    maxBundleMessages: PromiseOrValue<BigNumberish>;
};
export type RouteStructOutput = [BigNumber, BigNumber, BigNumber] & {
    chainId: BigNumber;
    messageFee: BigNumber;
    maxBundleMessages: BigNumber;
};
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
export interface SpokeMessageBridgeInterface extends utils.Interface {
    functions: {
        "bundles(bytes32)": FunctionFragment;
        "commitPendingBundle(uint256)": FunctionFragment;
        "dispatchMessage(uint256,address,bytes)": FunctionFragment;
        "executeMessage(uint256,address,address,bytes,(bytes32,uint256,bytes32[],uint256))": FunctionFragment;
        "forwardMessage(bytes32,address,address,bytes)": FunctionFragment;
        "getChainId()": FunctionFragment;
        "getCrossChainChainId()": FunctionFragment;
        "getCrossChainData()": FunctionFragment;
        "getCrossChainSender()": FunctionFragment;
        "getFee(uint256)": FunctionFragment;
        "getSpokeMessageId(bytes32,uint256,uint256,address,uint256,address,bytes)": FunctionFragment;
        "hubBridgeConnector()": FunctionFragment;
        "hubChainId()": FunctionFragment;
        "hubFeeDistributor()": FunctionFragment;
        "initialBundleId(uint256)": FunctionFragment;
        "isMessageSpent(bytes32,uint256)": FunctionFragment;
        "noMessageList(address)": FunctionFragment;
        "owner()": FunctionFragment;
        "pendingBundleIdForChainId(uint256)": FunctionFragment;
        "pendingFeeBatchSize()": FunctionFragment;
        "pendingFeesForChainId(uint256)": FunctionFragment;
        "pendingMessageIdsForChainId(uint256,uint256)": FunctionFragment;
        "receiveMessageBundle(bytes32,bytes32,uint256)": FunctionFragment;
        "renounceOwnership()": FunctionFragment;
        "routeData(uint256)": FunctionFragment;
        "setHubBridge(address,address)": FunctionFragment;
        "setRoute((uint256,uint128,uint128))": FunctionFragment;
        "setpendingFeeBatchSize(uint256)": FunctionFragment;
        "totalFeesForHub()": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
        "validateProof((bytes32,uint256,bytes32[],uint256),bytes32)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "bundles" | "commitPendingBundle" | "dispatchMessage" | "executeMessage" | "forwardMessage" | "getChainId" | "getCrossChainChainId" | "getCrossChainData" | "getCrossChainSender" | "getFee" | "getSpokeMessageId" | "hubBridgeConnector" | "hubChainId" | "hubFeeDistributor" | "initialBundleId" | "isMessageSpent" | "noMessageList" | "owner" | "pendingBundleIdForChainId" | "pendingFeeBatchSize" | "pendingFeesForChainId" | "pendingMessageIdsForChainId" | "receiveMessageBundle" | "renounceOwnership" | "routeData" | "setHubBridge" | "setRoute" | "setpendingFeeBatchSize" | "totalFeesForHub" | "transferOwnership" | "validateProof"): FunctionFragment;
    encodeFunctionData(functionFragment: "bundles", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "commitPendingBundle", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "dispatchMessage", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "executeMessage", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>,
        BundleProofStruct
    ]): string;
    encodeFunctionData(functionFragment: "forwardMessage", values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "getChainId", values?: undefined): string;
    encodeFunctionData(functionFragment: "getCrossChainChainId", values?: undefined): string;
    encodeFunctionData(functionFragment: "getCrossChainData", values?: undefined): string;
    encodeFunctionData(functionFragment: "getCrossChainSender", values?: undefined): string;
    encodeFunctionData(functionFragment: "getFee", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getSpokeMessageId", values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "hubBridgeConnector", values?: undefined): string;
    encodeFunctionData(functionFragment: "hubChainId", values?: undefined): string;
    encodeFunctionData(functionFragment: "hubFeeDistributor", values?: undefined): string;
    encodeFunctionData(functionFragment: "initialBundleId", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "isMessageSpent", values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "noMessageList", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "pendingBundleIdForChainId", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "pendingFeeBatchSize", values?: undefined): string;
    encodeFunctionData(functionFragment: "pendingFeesForChainId", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "pendingMessageIdsForChainId", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "receiveMessageBundle", values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "routeData", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setHubBridge", values: [PromiseOrValue<string>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "setRoute", values: [RouteStruct]): string;
    encodeFunctionData(functionFragment: "setpendingFeeBatchSize", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "totalFeesForHub", values?: undefined): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "validateProof", values: [BundleProofStruct, PromiseOrValue<BytesLike>]): string;
    decodeFunctionResult(functionFragment: "bundles", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "commitPendingBundle", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "dispatchMessage", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "executeMessage", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "forwardMessage", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getCrossChainChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getCrossChainData", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getCrossChainSender", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getSpokeMessageId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hubBridgeConnector", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hubChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hubFeeDistributor", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initialBundleId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isMessageSpent", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "noMessageList", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pendingBundleIdForChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pendingFeeBatchSize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pendingFeesForChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pendingMessageIdsForChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "receiveMessageBundle", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "routeData", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setHubBridge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setRoute", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setpendingFeeBatchSize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "totalFeesForHub", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "validateProof", data: BytesLike): Result;
    events: {
        "BundleCommitted(bytes32,bytes32,uint256,uint256,uint256)": EventFragment;
        "BundleSet(bytes32,bytes32,uint256)": EventFragment;
        "FeesSentToHub(uint256)": EventFragment;
        "MessageBundled(bytes32,uint256,bytes32)": EventFragment;
        "MessageExecuted(uint256,bytes32)": EventFragment;
        "MessageSent(bytes32,address,uint256,address,bytes)": EventFragment;
        "OwnershipTransferred(address,address)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "BundleCommitted"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "BundleSet"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "FeesSentToHub"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "MessageBundled"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "MessageExecuted"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "MessageSent"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}
export interface BundleCommittedEventObject {
    bundleId: string;
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
export interface FeesSentToHubEventObject {
    amount: BigNumber;
}
export type FeesSentToHubEvent = TypedEvent<[
    BigNumber
], FeesSentToHubEventObject>;
export type FeesSentToHubEventFilter = TypedEventFilter<FeesSentToHubEvent>;
export interface MessageBundledEventObject {
    bundleId: string;
    treeIndex: BigNumber;
    messageId: string;
}
export type MessageBundledEvent = TypedEvent<[
    string,
    BigNumber,
    string
], MessageBundledEventObject>;
export type MessageBundledEventFilter = TypedEventFilter<MessageBundledEvent>;
export interface MessageExecutedEventObject {
    fromChainId: BigNumber;
    messageId: string;
}
export type MessageExecutedEvent = TypedEvent<[
    BigNumber,
    string
], MessageExecutedEventObject>;
export type MessageExecutedEventFilter = TypedEventFilter<MessageExecutedEvent>;
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
export interface SpokeMessageBridge extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: SpokeMessageBridgeInterface;
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
        commitPendingBundle(toChainId: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        dispatchMessage(toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        executeMessage(fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, bundleProof: BundleProofStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        forwardMessage(messageId: PromiseOrValue<BytesLike>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getChainId(overrides?: CallOverrides): Promise<[BigNumber] & {
            chainId: BigNumber;
        }>;
        getCrossChainChainId(overrides?: CallOverrides): Promise<[BigNumber]>;
        getCrossChainData(overrides?: CallOverrides): Promise<[BigNumber, string]>;
        getCrossChainSender(overrides?: CallOverrides): Promise<[string]>;
        getFee(toChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        getSpokeMessageId(bundleId: PromiseOrValue<BytesLike>, treeIndex: PromiseOrValue<BigNumberish>, fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string]>;
        hubBridgeConnector(overrides?: CallOverrides): Promise<[string]>;
        hubChainId(overrides?: CallOverrides): Promise<[BigNumber]>;
        hubFeeDistributor(overrides?: CallOverrides): Promise<[string]>;
        initialBundleId(toChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        isMessageSpent(bundleId: PromiseOrValue<BytesLike>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[boolean]>;
        noMessageList(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        owner(overrides?: CallOverrides): Promise<[string]>;
        pendingBundleIdForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        pendingFeeBatchSize(overrides?: CallOverrides): Promise<[BigNumber]>;
        pendingFeesForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        pendingMessageIdsForChainId(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        receiveMessageBundle(bundleId: PromiseOrValue<BytesLike>, bundleRoot: PromiseOrValue<BytesLike>, fromChainId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        routeData(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber
        ] & {
            messageFee: BigNumber;
            maxBundleMessages: BigNumber;
        }>;
        setHubBridge(_hubBridgeConnector: PromiseOrValue<string>, _hubFeeDistributor: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setRoute(route: RouteStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setpendingFeeBatchSize(_pendingFeeBatchSize: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        totalFeesForHub(overrides?: CallOverrides): Promise<[BigNumber]>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        validateProof(bundleProof: BundleProofStruct, messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[void]>;
    };
    bundles(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string, BigNumber] & {
        root: string;
        fromChainId: BigNumber;
    }>;
    commitPendingBundle(toChainId: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    dispatchMessage(toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    executeMessage(fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, bundleProof: BundleProofStruct, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    forwardMessage(messageId: PromiseOrValue<BytesLike>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getChainId(overrides?: CallOverrides): Promise<BigNumber>;
    getCrossChainChainId(overrides?: CallOverrides): Promise<BigNumber>;
    getCrossChainData(overrides?: CallOverrides): Promise<[BigNumber, string]>;
    getCrossChainSender(overrides?: CallOverrides): Promise<string>;
    getFee(toChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    getSpokeMessageId(bundleId: PromiseOrValue<BytesLike>, treeIndex: PromiseOrValue<BigNumberish>, fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
    hubBridgeConnector(overrides?: CallOverrides): Promise<string>;
    hubChainId(overrides?: CallOverrides): Promise<BigNumber>;
    hubFeeDistributor(overrides?: CallOverrides): Promise<string>;
    initialBundleId(toChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    isMessageSpent(bundleId: PromiseOrValue<BytesLike>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
    noMessageList(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    owner(overrides?: CallOverrides): Promise<string>;
    pendingBundleIdForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    pendingFeeBatchSize(overrides?: CallOverrides): Promise<BigNumber>;
    pendingFeesForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    pendingMessageIdsForChainId(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    receiveMessageBundle(bundleId: PromiseOrValue<BytesLike>, bundleRoot: PromiseOrValue<BytesLike>, fromChainId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    renounceOwnership(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    routeData(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
        BigNumber,
        BigNumber
    ] & {
        messageFee: BigNumber;
        maxBundleMessages: BigNumber;
    }>;
    setHubBridge(_hubBridgeConnector: PromiseOrValue<string>, _hubFeeDistributor: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setRoute(route: RouteStruct, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setpendingFeeBatchSize(_pendingFeeBatchSize: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    totalFeesForHub(overrides?: CallOverrides): Promise<BigNumber>;
    transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    validateProof(bundleProof: BundleProofStruct, messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
    callStatic: {
        bundles(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string, BigNumber] & {
            root: string;
            fromChainId: BigNumber;
        }>;
        commitPendingBundle(toChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        dispatchMessage(toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        executeMessage(fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, bundleProof: BundleProofStruct, overrides?: CallOverrides): Promise<void>;
        forwardMessage(messageId: PromiseOrValue<BytesLike>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        getChainId(overrides?: CallOverrides): Promise<BigNumber>;
        getCrossChainChainId(overrides?: CallOverrides): Promise<BigNumber>;
        getCrossChainData(overrides?: CallOverrides): Promise<[BigNumber, string]>;
        getCrossChainSender(overrides?: CallOverrides): Promise<string>;
        getFee(toChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getSpokeMessageId(bundleId: PromiseOrValue<BytesLike>, treeIndex: PromiseOrValue<BigNumberish>, fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        hubBridgeConnector(overrides?: CallOverrides): Promise<string>;
        hubChainId(overrides?: CallOverrides): Promise<BigNumber>;
        hubFeeDistributor(overrides?: CallOverrides): Promise<string>;
        initialBundleId(toChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        isMessageSpent(bundleId: PromiseOrValue<BytesLike>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
        noMessageList(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        owner(overrides?: CallOverrides): Promise<string>;
        pendingBundleIdForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        pendingFeeBatchSize(overrides?: CallOverrides): Promise<BigNumber>;
        pendingFeesForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        pendingMessageIdsForChainId(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        receiveMessageBundle(bundleId: PromiseOrValue<BytesLike>, bundleRoot: PromiseOrValue<BytesLike>, fromChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        renounceOwnership(overrides?: CallOverrides): Promise<void>;
        routeData(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber
        ] & {
            messageFee: BigNumber;
            maxBundleMessages: BigNumber;
        }>;
        setHubBridge(_hubBridgeConnector: PromiseOrValue<string>, _hubFeeDistributor: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setRoute(route: RouteStruct, overrides?: CallOverrides): Promise<void>;
        setpendingFeeBatchSize(_pendingFeeBatchSize: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        totalFeesForHub(overrides?: CallOverrides): Promise<BigNumber>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        validateProof(bundleProof: BundleProofStruct, messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "BundleCommitted(bytes32,bytes32,uint256,uint256,uint256)"(bundleId?: PromiseOrValue<BytesLike> | null, bundleRoot?: null, bundleFees?: null, toChainId?: PromiseOrValue<BigNumberish> | null, commitTime?: null): BundleCommittedEventFilter;
        BundleCommitted(bundleId?: PromiseOrValue<BytesLike> | null, bundleRoot?: null, bundleFees?: null, toChainId?: PromiseOrValue<BigNumberish> | null, commitTime?: null): BundleCommittedEventFilter;
        "BundleSet(bytes32,bytes32,uint256)"(bundleId?: PromiseOrValue<BytesLike> | null, bundleRoot?: null, fromChainId?: PromiseOrValue<BigNumberish> | null): BundleSetEventFilter;
        BundleSet(bundleId?: PromiseOrValue<BytesLike> | null, bundleRoot?: null, fromChainId?: PromiseOrValue<BigNumberish> | null): BundleSetEventFilter;
        "FeesSentToHub(uint256)"(amount?: null): FeesSentToHubEventFilter;
        FeesSentToHub(amount?: null): FeesSentToHubEventFilter;
        "MessageBundled(bytes32,uint256,bytes32)"(bundleId?: PromiseOrValue<BytesLike> | null, treeIndex?: PromiseOrValue<BigNumberish> | null, messageId?: PromiseOrValue<BytesLike> | null): MessageBundledEventFilter;
        MessageBundled(bundleId?: PromiseOrValue<BytesLike> | null, treeIndex?: PromiseOrValue<BigNumberish> | null, messageId?: PromiseOrValue<BytesLike> | null): MessageBundledEventFilter;
        "MessageExecuted(uint256,bytes32)"(fromChainId?: null, messageId?: null): MessageExecutedEventFilter;
        MessageExecuted(fromChainId?: null, messageId?: null): MessageExecutedEventFilter;
        "MessageSent(bytes32,address,uint256,address,bytes)"(messageId?: PromiseOrValue<BytesLike> | null, from?: PromiseOrValue<string> | null, toChainId?: PromiseOrValue<BigNumberish> | null, to?: null, data?: null): MessageSentEventFilter;
        MessageSent(messageId?: PromiseOrValue<BytesLike> | null, from?: PromiseOrValue<string> | null, toChainId?: PromiseOrValue<BigNumberish> | null, to?: null, data?: null): MessageSentEventFilter;
        "OwnershipTransferred(address,address)"(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        OwnershipTransferred(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
    };
    estimateGas: {
        bundles(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        commitPendingBundle(toChainId: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        dispatchMessage(toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        executeMessage(fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, bundleProof: BundleProofStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        forwardMessage(messageId: PromiseOrValue<BytesLike>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getChainId(overrides?: CallOverrides): Promise<BigNumber>;
        getCrossChainChainId(overrides?: CallOverrides): Promise<BigNumber>;
        getCrossChainData(overrides?: CallOverrides): Promise<BigNumber>;
        getCrossChainSender(overrides?: CallOverrides): Promise<BigNumber>;
        getFee(toChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getSpokeMessageId(bundleId: PromiseOrValue<BytesLike>, treeIndex: PromiseOrValue<BigNumberish>, fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        hubBridgeConnector(overrides?: CallOverrides): Promise<BigNumber>;
        hubChainId(overrides?: CallOverrides): Promise<BigNumber>;
        hubFeeDistributor(overrides?: CallOverrides): Promise<BigNumber>;
        initialBundleId(toChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        isMessageSpent(bundleId: PromiseOrValue<BytesLike>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        noMessageList(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<BigNumber>;
        pendingBundleIdForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        pendingFeeBatchSize(overrides?: CallOverrides): Promise<BigNumber>;
        pendingFeesForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        pendingMessageIdsForChainId(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        receiveMessageBundle(bundleId: PromiseOrValue<BytesLike>, bundleRoot: PromiseOrValue<BytesLike>, fromChainId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        routeData(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        setHubBridge(_hubBridgeConnector: PromiseOrValue<string>, _hubFeeDistributor: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setRoute(route: RouteStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setpendingFeeBatchSize(_pendingFeeBatchSize: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        totalFeesForHub(overrides?: CallOverrides): Promise<BigNumber>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        validateProof(bundleProof: BundleProofStruct, messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        bundles(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        commitPendingBundle(toChainId: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        dispatchMessage(toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        executeMessage(fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, bundleProof: BundleProofStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        forwardMessage(messageId: PromiseOrValue<BytesLike>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getChainId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getCrossChainChainId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getCrossChainData(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getCrossChainSender(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getFee(toChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getSpokeMessageId(bundleId: PromiseOrValue<BytesLike>, treeIndex: PromiseOrValue<BigNumberish>, fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        hubBridgeConnector(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        hubChainId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        hubFeeDistributor(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        initialBundleId(toChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isMessageSpent(bundleId: PromiseOrValue<BytesLike>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        noMessageList(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        pendingBundleIdForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        pendingFeeBatchSize(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        pendingFeesForChainId(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        pendingMessageIdsForChainId(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        receiveMessageBundle(bundleId: PromiseOrValue<BytesLike>, bundleRoot: PromiseOrValue<BytesLike>, fromChainId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        routeData(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        setHubBridge(_hubBridgeConnector: PromiseOrValue<string>, _hubFeeDistributor: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setRoute(route: RouteStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setpendingFeeBatchSize(_pendingFeeBatchSize: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        totalFeesForHub(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        validateProof(bundleProof: BundleProofStruct, messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=SpokeMessageBridge.d.ts.map