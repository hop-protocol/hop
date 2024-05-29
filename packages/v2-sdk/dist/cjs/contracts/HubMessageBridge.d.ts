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
export interface HubMessageBridgeInterface extends utils.Interface {
    functions: {
        "bundles(bytes32)": FunctionFragment;
        "dispatchMessage(uint256,address,bytes)": FunctionFragment;
        "executeMessage(uint256,address,address,bytes,(bytes32,uint256,bytes32[],uint256))": FunctionFragment;
        "getChainId()": FunctionFragment;
        "getCrossChainChainId()": FunctionFragment;
        "getCrossChainData()": FunctionFragment;
        "getCrossChainSender()": FunctionFragment;
        "getFeeDistributor(uint256)": FunctionFragment;
        "getHubMessageId(uint256)": FunctionFragment;
        "getRelayReward(uint256,uint256,uint256)": FunctionFragment;
        "getSpokeBridge(uint256)": FunctionFragment;
        "getSpokeChainId(address)": FunctionFragment;
        "getSpokeExitTime(uint256)": FunctionFragment;
        "getSpokeMessageId(bytes32,uint256,uint256,address,uint256,address,bytes)": FunctionFragment;
        "isMessageSpent(bytes32,uint256)": FunctionFragment;
        "messageNonce()": FunctionFragment;
        "noMessageList(address)": FunctionFragment;
        "owner()": FunctionFragment;
        "receiveOrForwardMessageBundle(bytes32,bytes32,uint256,uint256,uint256)": FunctionFragment;
        "renounceOwnership()": FunctionFragment;
        "setSpokeBridge(uint256,address,uint256,address)": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
        "validateProof((bytes32,uint256,bytes32[],uint256),bytes32)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "bundles" | "dispatchMessage" | "executeMessage" | "getChainId" | "getCrossChainChainId" | "getCrossChainData" | "getCrossChainSender" | "getFeeDistributor" | "getHubMessageId" | "getRelayReward" | "getSpokeBridge" | "getSpokeChainId" | "getSpokeExitTime" | "getSpokeMessageId" | "isMessageSpent" | "messageNonce" | "noMessageList" | "owner" | "receiveOrForwardMessageBundle" | "renounceOwnership" | "setSpokeBridge" | "transferOwnership" | "validateProof"): FunctionFragment;
    encodeFunctionData(functionFragment: "bundles", values: [PromiseOrValue<BytesLike>]): string;
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
    encodeFunctionData(functionFragment: "getChainId", values?: undefined): string;
    encodeFunctionData(functionFragment: "getCrossChainChainId", values?: undefined): string;
    encodeFunctionData(functionFragment: "getCrossChainData", values?: undefined): string;
    encodeFunctionData(functionFragment: "getCrossChainSender", values?: undefined): string;
    encodeFunctionData(functionFragment: "getFeeDistributor", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getHubMessageId", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getRelayReward", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "getSpokeBridge", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getSpokeChainId", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getSpokeExitTime", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getSpokeMessageId", values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "isMessageSpent", values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "messageNonce", values?: undefined): string;
    encodeFunctionData(functionFragment: "noMessageList", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "receiveOrForwardMessageBundle", values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "setSpokeBridge", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "validateProof", values: [BundleProofStruct, PromiseOrValue<BytesLike>]): string;
    decodeFunctionResult(functionFragment: "bundles", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "dispatchMessage", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "executeMessage", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getCrossChainChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getCrossChainData", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getCrossChainSender", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getFeeDistributor", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getHubMessageId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRelayReward", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getSpokeBridge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getSpokeChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getSpokeExitTime", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getSpokeMessageId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isMessageSpent", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "messageNonce", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "noMessageList", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "receiveOrForwardMessageBundle", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setSpokeBridge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "validateProof", data: BytesLike): Result;
    events: {
        "BundleForwarded(bytes32,bytes32,uint256,uint256)": EventFragment;
        "BundleReceived(bytes32,bytes32,uint256,uint256,uint256,uint256,address)": EventFragment;
        "BundleSet(bytes32,bytes32,uint256)": EventFragment;
        "MessageExecuted(uint256,bytes32)": EventFragment;
        "MessageSent(bytes32,address,uint256,address,bytes)": EventFragment;
        "OwnershipTransferred(address,address)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "BundleForwarded"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "BundleReceived"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "BundleSet"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "MessageExecuted"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "MessageSent"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}
export interface BundleForwardedEventObject {
    bundleId: string;
    bundleRoot: string;
    fromChainId: BigNumber;
    toChainId: BigNumber;
}
export type BundleForwardedEvent = TypedEvent<[
    string,
    string,
    BigNumber,
    BigNumber
], BundleForwardedEventObject>;
export type BundleForwardedEventFilter = TypedEventFilter<BundleForwardedEvent>;
export interface BundleReceivedEventObject {
    bundleId: string;
    bundleRoot: string;
    bundleFees: BigNumber;
    fromChainId: BigNumber;
    toChainId: BigNumber;
    relayWindowStart: BigNumber;
    relayer: string;
}
export type BundleReceivedEvent = TypedEvent<[
    string,
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    string
], BundleReceivedEventObject>;
export type BundleReceivedEventFilter = TypedEventFilter<BundleReceivedEvent>;
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
export interface HubMessageBridge extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: HubMessageBridgeInterface;
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
        dispatchMessage(toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        executeMessage(fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, bundleProof: BundleProofStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getChainId(overrides?: CallOverrides): Promise<[BigNumber] & {
            chainId: BigNumber;
        }>;
        getCrossChainChainId(overrides?: CallOverrides): Promise<[BigNumber]>;
        getCrossChainData(overrides?: CallOverrides): Promise<[BigNumber, string]>;
        getCrossChainSender(overrides?: CallOverrides): Promise<[string]>;
        getFeeDistributor(chainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        getHubMessageId(nonce: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        getRelayReward(fromChainId: PromiseOrValue<BigNumberish>, bundleFees: PromiseOrValue<BigNumberish>, commitTime: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        getSpokeBridge(chainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        getSpokeChainId(bridge: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        getSpokeExitTime(chainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        getSpokeMessageId(bundleId: PromiseOrValue<BytesLike>, treeIndex: PromiseOrValue<BigNumberish>, fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string]>;
        isMessageSpent(bundleId: PromiseOrValue<BytesLike>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[boolean]>;
        messageNonce(overrides?: CallOverrides): Promise<[BigNumber]>;
        noMessageList(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        owner(overrides?: CallOverrides): Promise<[string]>;
        receiveOrForwardMessageBundle(bundleId: PromiseOrValue<BytesLike>, bundleRoot: PromiseOrValue<BytesLike>, bundleFees: PromiseOrValue<BigNumberish>, toChainId: PromiseOrValue<BigNumberish>, commitTime: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setSpokeBridge(chainId: PromiseOrValue<BigNumberish>, spokeBridge: PromiseOrValue<string>, exitTime: PromiseOrValue<BigNumberish>, feeDistributor: PromiseOrValue<string>, overrides?: Overrides & {
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
    dispatchMessage(toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    executeMessage(fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, bundleProof: BundleProofStruct, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getChainId(overrides?: CallOverrides): Promise<BigNumber>;
    getCrossChainChainId(overrides?: CallOverrides): Promise<BigNumber>;
    getCrossChainData(overrides?: CallOverrides): Promise<[BigNumber, string]>;
    getCrossChainSender(overrides?: CallOverrides): Promise<string>;
    getFeeDistributor(chainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    getHubMessageId(nonce: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    getRelayReward(fromChainId: PromiseOrValue<BigNumberish>, bundleFees: PromiseOrValue<BigNumberish>, commitTime: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    getSpokeBridge(chainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    getSpokeChainId(bridge: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    getSpokeExitTime(chainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    getSpokeMessageId(bundleId: PromiseOrValue<BytesLike>, treeIndex: PromiseOrValue<BigNumberish>, fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
    isMessageSpent(bundleId: PromiseOrValue<BytesLike>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
    messageNonce(overrides?: CallOverrides): Promise<BigNumber>;
    noMessageList(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    owner(overrides?: CallOverrides): Promise<string>;
    receiveOrForwardMessageBundle(bundleId: PromiseOrValue<BytesLike>, bundleRoot: PromiseOrValue<BytesLike>, bundleFees: PromiseOrValue<BigNumberish>, toChainId: PromiseOrValue<BigNumberish>, commitTime: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    renounceOwnership(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setSpokeBridge(chainId: PromiseOrValue<BigNumberish>, spokeBridge: PromiseOrValue<string>, exitTime: PromiseOrValue<BigNumberish>, feeDistributor: PromiseOrValue<string>, overrides?: Overrides & {
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
        dispatchMessage(toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        executeMessage(fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, bundleProof: BundleProofStruct, overrides?: CallOverrides): Promise<void>;
        getChainId(overrides?: CallOverrides): Promise<BigNumber>;
        getCrossChainChainId(overrides?: CallOverrides): Promise<BigNumber>;
        getCrossChainData(overrides?: CallOverrides): Promise<[BigNumber, string]>;
        getCrossChainSender(overrides?: CallOverrides): Promise<string>;
        getFeeDistributor(chainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        getHubMessageId(nonce: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        getRelayReward(fromChainId: PromiseOrValue<BigNumberish>, bundleFees: PromiseOrValue<BigNumberish>, commitTime: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getSpokeBridge(chainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        getSpokeChainId(bridge: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getSpokeExitTime(chainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getSpokeMessageId(bundleId: PromiseOrValue<BytesLike>, treeIndex: PromiseOrValue<BigNumberish>, fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        isMessageSpent(bundleId: PromiseOrValue<BytesLike>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
        messageNonce(overrides?: CallOverrides): Promise<BigNumber>;
        noMessageList(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        owner(overrides?: CallOverrides): Promise<string>;
        receiveOrForwardMessageBundle(bundleId: PromiseOrValue<BytesLike>, bundleRoot: PromiseOrValue<BytesLike>, bundleFees: PromiseOrValue<BigNumberish>, toChainId: PromiseOrValue<BigNumberish>, commitTime: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        renounceOwnership(overrides?: CallOverrides): Promise<void>;
        setSpokeBridge(chainId: PromiseOrValue<BigNumberish>, spokeBridge: PromiseOrValue<string>, exitTime: PromiseOrValue<BigNumberish>, feeDistributor: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        validateProof(bundleProof: BundleProofStruct, messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "BundleForwarded(bytes32,bytes32,uint256,uint256)"(bundleId?: PromiseOrValue<BytesLike> | null, bundleRoot?: null, fromChainId?: PromiseOrValue<BigNumberish> | null, toChainId?: PromiseOrValue<BigNumberish> | null): BundleForwardedEventFilter;
        BundleForwarded(bundleId?: PromiseOrValue<BytesLike> | null, bundleRoot?: null, fromChainId?: PromiseOrValue<BigNumberish> | null, toChainId?: PromiseOrValue<BigNumberish> | null): BundleForwardedEventFilter;
        "BundleReceived(bytes32,bytes32,uint256,uint256,uint256,uint256,address)"(bundleId?: PromiseOrValue<BytesLike> | null, bundleRoot?: null, bundleFees?: null, fromChainId?: null, toChainId?: null, relayWindowStart?: null, relayer?: PromiseOrValue<string> | null): BundleReceivedEventFilter;
        BundleReceived(bundleId?: PromiseOrValue<BytesLike> | null, bundleRoot?: null, bundleFees?: null, fromChainId?: null, toChainId?: null, relayWindowStart?: null, relayer?: PromiseOrValue<string> | null): BundleReceivedEventFilter;
        "BundleSet(bytes32,bytes32,uint256)"(bundleId?: PromiseOrValue<BytesLike> | null, bundleRoot?: null, fromChainId?: PromiseOrValue<BigNumberish> | null): BundleSetEventFilter;
        BundleSet(bundleId?: PromiseOrValue<BytesLike> | null, bundleRoot?: null, fromChainId?: PromiseOrValue<BigNumberish> | null): BundleSetEventFilter;
        "MessageExecuted(uint256,bytes32)"(fromChainId?: null, messageId?: null): MessageExecutedEventFilter;
        MessageExecuted(fromChainId?: null, messageId?: null): MessageExecutedEventFilter;
        "MessageSent(bytes32,address,uint256,address,bytes)"(messageId?: PromiseOrValue<BytesLike> | null, from?: PromiseOrValue<string> | null, toChainId?: PromiseOrValue<BigNumberish> | null, to?: null, data?: null): MessageSentEventFilter;
        MessageSent(messageId?: PromiseOrValue<BytesLike> | null, from?: PromiseOrValue<string> | null, toChainId?: PromiseOrValue<BigNumberish> | null, to?: null, data?: null): MessageSentEventFilter;
        "OwnershipTransferred(address,address)"(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        OwnershipTransferred(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
    };
    estimateGas: {
        bundles(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        dispatchMessage(toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        executeMessage(fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, bundleProof: BundleProofStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getChainId(overrides?: CallOverrides): Promise<BigNumber>;
        getCrossChainChainId(overrides?: CallOverrides): Promise<BigNumber>;
        getCrossChainData(overrides?: CallOverrides): Promise<BigNumber>;
        getCrossChainSender(overrides?: CallOverrides): Promise<BigNumber>;
        getFeeDistributor(chainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getHubMessageId(nonce: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getRelayReward(fromChainId: PromiseOrValue<BigNumberish>, bundleFees: PromiseOrValue<BigNumberish>, commitTime: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getSpokeBridge(chainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getSpokeChainId(bridge: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getSpokeExitTime(chainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getSpokeMessageId(bundleId: PromiseOrValue<BytesLike>, treeIndex: PromiseOrValue<BigNumberish>, fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        isMessageSpent(bundleId: PromiseOrValue<BytesLike>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        messageNonce(overrides?: CallOverrides): Promise<BigNumber>;
        noMessageList(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<BigNumber>;
        receiveOrForwardMessageBundle(bundleId: PromiseOrValue<BytesLike>, bundleRoot: PromiseOrValue<BytesLike>, bundleFees: PromiseOrValue<BigNumberish>, toChainId: PromiseOrValue<BigNumberish>, commitTime: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setSpokeBridge(chainId: PromiseOrValue<BigNumberish>, spokeBridge: PromiseOrValue<string>, exitTime: PromiseOrValue<BigNumberish>, feeDistributor: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        validateProof(bundleProof: BundleProofStruct, messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        bundles(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        dispatchMessage(toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        executeMessage(fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, bundleProof: BundleProofStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getChainId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getCrossChainChainId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getCrossChainData(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getCrossChainSender(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getFeeDistributor(chainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getHubMessageId(nonce: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getRelayReward(fromChainId: PromiseOrValue<BigNumberish>, bundleFees: PromiseOrValue<BigNumberish>, commitTime: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getSpokeBridge(chainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getSpokeChainId(bridge: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getSpokeExitTime(chainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getSpokeMessageId(bundleId: PromiseOrValue<BytesLike>, treeIndex: PromiseOrValue<BigNumberish>, fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, toChainId: PromiseOrValue<BigNumberish>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isMessageSpent(bundleId: PromiseOrValue<BytesLike>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        messageNonce(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        noMessageList(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        receiveOrForwardMessageBundle(bundleId: PromiseOrValue<BytesLike>, bundleRoot: PromiseOrValue<BytesLike>, bundleFees: PromiseOrValue<BigNumberish>, toChainId: PromiseOrValue<BigNumberish>, commitTime: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setSpokeBridge(chainId: PromiseOrValue<BigNumberish>, spokeBridge: PromiseOrValue<string>, exitTime: PromiseOrValue<BigNumberish>, feeDistributor: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        validateProof(bundleProof: BundleProofStruct, messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=HubMessageBridge.d.ts.map