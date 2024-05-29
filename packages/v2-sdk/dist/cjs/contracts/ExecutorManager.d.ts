import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common.js";
export type BundleProofStruct = {
    bundleNonce: PromiseOrValue<BytesLike>;
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
    bundleNonce: string;
    treeIndex: BigNumber;
    siblings: string[];
    totalLeaves: BigNumber;
};
export interface ExecutorManagerInterface extends utils.Interface {
    functions: {
        "defaultTransporter()": FunctionFragment;
        "executeMessage(uint256,address,address,bytes,(bytes32,uint256,bytes32[],uint256))": FunctionFragment;
        "getChainId()": FunctionFragment;
        "head()": FunctionFragment;
        "isBundleVerified(uint256,bytes32,bytes32,address)": FunctionFragment;
        "isMessageSpent(bytes32,uint256)": FunctionFragment;
        "owner()": FunctionFragment;
        "proveBundle(address,uint256,bytes32,bytes32)": FunctionFragment;
        "registedTransporters(address)": FunctionFragment;
        "registerMessageReceiver(address)": FunctionFragment;
        "renounceOwnership()": FunctionFragment;
        "setDefaultTransporter(address)": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
        "verificationManager()": FunctionFragment;
        "verifiedBundleIds(address,uint256,bytes32)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "defaultTransporter" | "executeMessage" | "getChainId" | "head" | "isBundleVerified" | "isMessageSpent" | "owner" | "proveBundle" | "registedTransporters" | "registerMessageReceiver" | "renounceOwnership" | "setDefaultTransporter" | "transferOwnership" | "verificationManager" | "verifiedBundleIds"): FunctionFragment;
    encodeFunctionData(functionFragment: "defaultTransporter", values?: undefined): string;
    encodeFunctionData(functionFragment: "executeMessage", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>,
        BundleProofStruct
    ]): string;
    encodeFunctionData(functionFragment: "getChainId", values?: undefined): string;
    encodeFunctionData(functionFragment: "head", values?: undefined): string;
    encodeFunctionData(functionFragment: "isBundleVerified", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "isMessageSpent", values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "proveBundle", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "registedTransporters", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "registerMessageReceiver", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "setDefaultTransporter", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "verificationManager", values?: undefined): string;
    encodeFunctionData(functionFragment: "verifiedBundleIds", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    decodeFunctionResult(functionFragment: "defaultTransporter", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "executeMessage", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "head", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isBundleVerified", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isMessageSpent", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "proveBundle", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "registedTransporters", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "registerMessageReceiver", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setDefaultTransporter", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "verificationManager", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "verifiedBundleIds", data: BytesLike): Result;
    events: {
        "BundleProven(uint256,bytes32,bytes32,bytes32)": EventFragment;
        "OwnershipTransferred(address,address)": EventFragment;
        "VerifierRegistered(address,address)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "BundleProven"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "VerifierRegistered"): EventFragment;
}
export interface BundleProvenEventObject {
    fromChainId: BigNumber;
    bundleNonce: string;
    bundleRoot: string;
    bundleId: string;
}
export type BundleProvenEvent = TypedEvent<[
    BigNumber,
    string,
    string,
    string
], BundleProvenEventObject>;
export type BundleProvenEventFilter = TypedEventFilter<BundleProvenEvent>;
export interface OwnershipTransferredEventObject {
    previousOwner: string;
    newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<[
    string,
    string
], OwnershipTransferredEventObject>;
export type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;
export interface VerifierRegisteredEventObject {
    receiver: string;
    transporter: string;
}
export type VerifierRegisteredEvent = TypedEvent<[
    string,
    string
], VerifierRegisteredEventObject>;
export type VerifierRegisteredEventFilter = TypedEventFilter<VerifierRegisteredEvent>;
export interface ExecutorManager extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: ExecutorManagerInterface;
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
        defaultTransporter(overrides?: CallOverrides): Promise<[string]>;
        executeMessage(fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, bundleProof: BundleProofStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getChainId(overrides?: CallOverrides): Promise<[BigNumber] & {
            chainId: BigNumber;
        }>;
        head(overrides?: CallOverrides): Promise<[string]>;
        isBundleVerified(fromChainId: PromiseOrValue<BigNumberish>, bundleNonce: PromiseOrValue<BytesLike>, bundleRoot: PromiseOrValue<BytesLike>, messageReceiver: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        isMessageSpent(bundleNonce: PromiseOrValue<BytesLike>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[boolean]>;
        owner(overrides?: CallOverrides): Promise<[string]>;
        proveBundle(transportLayer: PromiseOrValue<string>, fromChainId: PromiseOrValue<BigNumberish>, bundleNonce: PromiseOrValue<BytesLike>, bundleRoot: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        registedTransporters(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[string]>;
        registerMessageReceiver(receiver: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setDefaultTransporter(verifier: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        verificationManager(overrides?: CallOverrides): Promise<[string]>;
        verifiedBundleIds(arg0: PromiseOrValue<string>, arg1: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
    };
    defaultTransporter(overrides?: CallOverrides): Promise<string>;
    executeMessage(fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, bundleProof: BundleProofStruct, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getChainId(overrides?: CallOverrides): Promise<BigNumber>;
    head(overrides?: CallOverrides): Promise<string>;
    isBundleVerified(fromChainId: PromiseOrValue<BigNumberish>, bundleNonce: PromiseOrValue<BytesLike>, bundleRoot: PromiseOrValue<BytesLike>, messageReceiver: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    isMessageSpent(bundleNonce: PromiseOrValue<BytesLike>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
    owner(overrides?: CallOverrides): Promise<string>;
    proveBundle(transportLayer: PromiseOrValue<string>, fromChainId: PromiseOrValue<BigNumberish>, bundleNonce: PromiseOrValue<BytesLike>, bundleRoot: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    registedTransporters(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
    registerMessageReceiver(receiver: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    renounceOwnership(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setDefaultTransporter(verifier: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    verificationManager(overrides?: CallOverrides): Promise<string>;
    verifiedBundleIds(arg0: PromiseOrValue<string>, arg1: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    callStatic: {
        defaultTransporter(overrides?: CallOverrides): Promise<string>;
        executeMessage(fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, bundleProof: BundleProofStruct, overrides?: CallOverrides): Promise<void>;
        getChainId(overrides?: CallOverrides): Promise<BigNumber>;
        head(overrides?: CallOverrides): Promise<string>;
        isBundleVerified(fromChainId: PromiseOrValue<BigNumberish>, bundleNonce: PromiseOrValue<BytesLike>, bundleRoot: PromiseOrValue<BytesLike>, messageReceiver: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        isMessageSpent(bundleNonce: PromiseOrValue<BytesLike>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
        owner(overrides?: CallOverrides): Promise<string>;
        proveBundle(transportLayer: PromiseOrValue<string>, fromChainId: PromiseOrValue<BigNumberish>, bundleNonce: PromiseOrValue<BytesLike>, bundleRoot: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        registedTransporters(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
        registerMessageReceiver(receiver: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        renounceOwnership(overrides?: CallOverrides): Promise<void>;
        setDefaultTransporter(verifier: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        verificationManager(overrides?: CallOverrides): Promise<string>;
        verifiedBundleIds(arg0: PromiseOrValue<string>, arg1: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    };
    filters: {
        "BundleProven(uint256,bytes32,bytes32,bytes32)"(fromChainId?: PromiseOrValue<BigNumberish> | null, bundleNonce?: PromiseOrValue<BytesLike> | null, bundleRoot?: null, bundleId?: null): BundleProvenEventFilter;
        BundleProven(fromChainId?: PromiseOrValue<BigNumberish> | null, bundleNonce?: PromiseOrValue<BytesLike> | null, bundleRoot?: null, bundleId?: null): BundleProvenEventFilter;
        "OwnershipTransferred(address,address)"(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        OwnershipTransferred(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        "VerifierRegistered(address,address)"(receiver?: PromiseOrValue<string> | null, transporter?: PromiseOrValue<string> | null): VerifierRegisteredEventFilter;
        VerifierRegistered(receiver?: PromiseOrValue<string> | null, transporter?: PromiseOrValue<string> | null): VerifierRegisteredEventFilter;
    };
    estimateGas: {
        defaultTransporter(overrides?: CallOverrides): Promise<BigNumber>;
        executeMessage(fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, bundleProof: BundleProofStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getChainId(overrides?: CallOverrides): Promise<BigNumber>;
        head(overrides?: CallOverrides): Promise<BigNumber>;
        isBundleVerified(fromChainId: PromiseOrValue<BigNumberish>, bundleNonce: PromiseOrValue<BytesLike>, bundleRoot: PromiseOrValue<BytesLike>, messageReceiver: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        isMessageSpent(bundleNonce: PromiseOrValue<BytesLike>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<BigNumber>;
        proveBundle(transportLayer: PromiseOrValue<string>, fromChainId: PromiseOrValue<BigNumberish>, bundleNonce: PromiseOrValue<BytesLike>, bundleRoot: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        registedTransporters(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        registerMessageReceiver(receiver: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setDefaultTransporter(verifier: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        verificationManager(overrides?: CallOverrides): Promise<BigNumber>;
        verifiedBundleIds(arg0: PromiseOrValue<string>, arg1: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        defaultTransporter(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        executeMessage(fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, bundleProof: BundleProofStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getChainId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        head(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isBundleVerified(fromChainId: PromiseOrValue<BigNumberish>, bundleNonce: PromiseOrValue<BytesLike>, bundleRoot: PromiseOrValue<BytesLike>, messageReceiver: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isMessageSpent(bundleNonce: PromiseOrValue<BytesLike>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        proveBundle(transportLayer: PromiseOrValue<string>, fromChainId: PromiseOrValue<BigNumberish>, bundleNonce: PromiseOrValue<BytesLike>, bundleRoot: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        registedTransporters(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        registerMessageReceiver(receiver: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setDefaultTransporter(verifier: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        verificationManager(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        verifiedBundleIds(arg0: PromiseOrValue<string>, arg1: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=ExecutorManager.d.ts.map