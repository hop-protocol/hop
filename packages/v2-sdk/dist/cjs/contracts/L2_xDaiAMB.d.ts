import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common.js";
export interface L2_xDaiAMBInterface extends utils.Interface {
    functions: {
        "transactionHash()": FunctionFragment;
        "numMessagesSigned(bytes32)": FunctionFragment;
        "sourceChainId()": FunctionFragment;
        "_sendMessage(address,bytes,uint256,uint256)": FunctionFragment;
        "signature(bytes32,uint256)": FunctionFragment;
        "initialize(uint256,uint256,address,uint256,uint256,uint256,address)": FunctionFragment;
        "isInitialized()": FunctionFragment;
        "requiredBlockConfirmations()": FunctionFragment;
        "getMinimumGasUsage(bytes)": FunctionFragment;
        "failedMessageReceiver(bytes32)": FunctionFragment;
        "getBridgeMode()": FunctionFragment;
        "setChainIds(uint256,uint256)": FunctionFragment;
        "message(bytes32)": FunctionFragment;
        "failedMessageSender(bytes32)": FunctionFragment;
        "submitSignature(bytes,bytes)": FunctionFragment;
        "messageId()": FunctionFragment;
        "numAffirmationsSigned(bytes32)": FunctionFragment;
        "affirmationsSigned(bytes32)": FunctionFragment;
        "setMaxGasPerTx(uint256)": FunctionFragment;
        "requiredSignatures()": FunctionFragment;
        "owner()": FunctionFragment;
        "messagesSigned(bytes32)": FunctionFragment;
        "requireToConfirmMessage(address,bytes,uint256)": FunctionFragment;
        "validatorContract()": FunctionFragment;
        "deployedAtBlock()": FunctionFragment;
        "getBridgeInterfacesVersion()": FunctionFragment;
        "messageSourceChainId()": FunctionFragment;
        "setRequiredBlockConfirmations(uint256)": FunctionFragment;
        "destinationChainId()": FunctionFragment;
        "setGasPrice(uint256)": FunctionFragment;
        "messageCallStatus(bytes32)": FunctionFragment;
        "messageSender()": FunctionFragment;
        "decimalShift()": FunctionFragment;
        "requireToPassMessage(address,bytes,uint256)": FunctionFragment;
        "failedMessageDataHash(bytes32)": FunctionFragment;
        "maxGasPerTx()": FunctionFragment;
        "executeAffirmation(bytes)": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
        "gasPrice()": FunctionFragment;
        "isAlreadyProcessed(uint256)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "transactionHash" | "numMessagesSigned" | "sourceChainId" | "_sendMessage" | "signature" | "initialize" | "isInitialized" | "requiredBlockConfirmations" | "getMinimumGasUsage" | "failedMessageReceiver" | "getBridgeMode" | "setChainIds" | "message" | "failedMessageSender" | "submitSignature" | "messageId" | "numAffirmationsSigned" | "affirmationsSigned" | "setMaxGasPerTx" | "requiredSignatures" | "owner" | "messagesSigned" | "requireToConfirmMessage" | "validatorContract" | "deployedAtBlock" | "getBridgeInterfacesVersion" | "messageSourceChainId" | "setRequiredBlockConfirmations" | "destinationChainId" | "setGasPrice" | "messageCallStatus" | "messageSender" | "decimalShift" | "requireToPassMessage" | "failedMessageDataHash" | "maxGasPerTx" | "executeAffirmation" | "transferOwnership" | "gasPrice" | "isAlreadyProcessed"): FunctionFragment;
    encodeFunctionData(functionFragment: "transactionHash", values?: undefined): string;
    encodeFunctionData(functionFragment: "numMessagesSigned", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "sourceChainId", values?: undefined): string;
    encodeFunctionData(functionFragment: "_sendMessage", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "signature", values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "initialize", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "isInitialized", values?: undefined): string;
    encodeFunctionData(functionFragment: "requiredBlockConfirmations", values?: undefined): string;
    encodeFunctionData(functionFragment: "getMinimumGasUsage", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "failedMessageReceiver", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "getBridgeMode", values?: undefined): string;
    encodeFunctionData(functionFragment: "setChainIds", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "message", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "failedMessageSender", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "submitSignature", values: [PromiseOrValue<BytesLike>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "messageId", values?: undefined): string;
    encodeFunctionData(functionFragment: "numAffirmationsSigned", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "affirmationsSigned", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "setMaxGasPerTx", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "requiredSignatures", values?: undefined): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "messagesSigned", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "requireToConfirmMessage", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "validatorContract", values?: undefined): string;
    encodeFunctionData(functionFragment: "deployedAtBlock", values?: undefined): string;
    encodeFunctionData(functionFragment: "getBridgeInterfacesVersion", values?: undefined): string;
    encodeFunctionData(functionFragment: "messageSourceChainId", values?: undefined): string;
    encodeFunctionData(functionFragment: "setRequiredBlockConfirmations", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "destinationChainId", values?: undefined): string;
    encodeFunctionData(functionFragment: "setGasPrice", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "messageCallStatus", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "messageSender", values?: undefined): string;
    encodeFunctionData(functionFragment: "decimalShift", values?: undefined): string;
    encodeFunctionData(functionFragment: "requireToPassMessage", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "failedMessageDataHash", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "maxGasPerTx", values?: undefined): string;
    encodeFunctionData(functionFragment: "executeAffirmation", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "gasPrice", values?: undefined): string;
    encodeFunctionData(functionFragment: "isAlreadyProcessed", values: [PromiseOrValue<BigNumberish>]): string;
    decodeFunctionResult(functionFragment: "transactionHash", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "numMessagesSigned", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "sourceChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "_sendMessage", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "signature", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isInitialized", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "requiredBlockConfirmations", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getMinimumGasUsage", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "failedMessageReceiver", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getBridgeMode", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setChainIds", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "message", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "failedMessageSender", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "submitSignature", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "messageId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "numAffirmationsSigned", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "affirmationsSigned", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setMaxGasPerTx", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "requiredSignatures", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "messagesSigned", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "requireToConfirmMessage", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "validatorContract", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deployedAtBlock", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getBridgeInterfacesVersion", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "messageSourceChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setRequiredBlockConfirmations", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "destinationChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setGasPrice", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "messageCallStatus", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "messageSender", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "decimalShift", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "requireToPassMessage", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "failedMessageDataHash", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "maxGasPerTx", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "executeAffirmation", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "gasPrice", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isAlreadyProcessed", data: BytesLike): Result;
    events: {
        "UserRequestForSignature(bytes32,bytes)": EventFragment;
        "AffirmationCompleted(address,address,bytes32,bool)": EventFragment;
        "SignedForUserRequest(address,bytes32)": EventFragment;
        "SignedForAffirmation(address,bytes32)": EventFragment;
        "CollectedSignatures(address,bytes32,uint256)": EventFragment;
        "GasPriceChanged(uint256)": EventFragment;
        "RequiredBlockConfirmationChanged(uint256)": EventFragment;
        "OwnershipTransferred(address,address)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "UserRequestForSignature"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "AffirmationCompleted"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "SignedForUserRequest"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "SignedForAffirmation"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "CollectedSignatures"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "GasPriceChanged"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "RequiredBlockConfirmationChanged"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}
export interface UserRequestForSignatureEventObject {
    messageId: string;
    encodedData: string;
}
export type UserRequestForSignatureEvent = TypedEvent<[
    string,
    string
], UserRequestForSignatureEventObject>;
export type UserRequestForSignatureEventFilter = TypedEventFilter<UserRequestForSignatureEvent>;
export interface AffirmationCompletedEventObject {
    sender: string;
    executor: string;
    messageId: string;
    status: boolean;
}
export type AffirmationCompletedEvent = TypedEvent<[
    string,
    string,
    string,
    boolean
], AffirmationCompletedEventObject>;
export type AffirmationCompletedEventFilter = TypedEventFilter<AffirmationCompletedEvent>;
export interface SignedForUserRequestEventObject {
    signer: string;
    messageHash: string;
}
export type SignedForUserRequestEvent = TypedEvent<[
    string,
    string
], SignedForUserRequestEventObject>;
export type SignedForUserRequestEventFilter = TypedEventFilter<SignedForUserRequestEvent>;
export interface SignedForAffirmationEventObject {
    signer: string;
    messageHash: string;
}
export type SignedForAffirmationEvent = TypedEvent<[
    string,
    string
], SignedForAffirmationEventObject>;
export type SignedForAffirmationEventFilter = TypedEventFilter<SignedForAffirmationEvent>;
export interface CollectedSignaturesEventObject {
    authorityResponsibleForRelay: string;
    messageHash: string;
    NumberOfCollectedSignatures: BigNumber;
}
export type CollectedSignaturesEvent = TypedEvent<[
    string,
    string,
    BigNumber
], CollectedSignaturesEventObject>;
export type CollectedSignaturesEventFilter = TypedEventFilter<CollectedSignaturesEvent>;
export interface GasPriceChangedEventObject {
    gasPrice: BigNumber;
}
export type GasPriceChangedEvent = TypedEvent<[
    BigNumber
], GasPriceChangedEventObject>;
export type GasPriceChangedEventFilter = TypedEventFilter<GasPriceChangedEvent>;
export interface RequiredBlockConfirmationChangedEventObject {
    requiredBlockConfirmations: BigNumber;
}
export type RequiredBlockConfirmationChangedEvent = TypedEvent<[
    BigNumber
], RequiredBlockConfirmationChangedEventObject>;
export type RequiredBlockConfirmationChangedEventFilter = TypedEventFilter<RequiredBlockConfirmationChangedEvent>;
export interface OwnershipTransferredEventObject {
    previousOwner: string;
    newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<[
    string,
    string
], OwnershipTransferredEventObject>;
export type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;
export interface L2_xDaiAMB extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: L2_xDaiAMBInterface;
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
        transactionHash(overrides?: CallOverrides): Promise<[string]>;
        numMessagesSigned(_message: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[BigNumber]>;
        sourceChainId(overrides?: CallOverrides): Promise<[BigNumber]>;
        _sendMessage(_contract: PromiseOrValue<string>, _data: PromiseOrValue<BytesLike>, _gas: PromiseOrValue<BigNumberish>, _dataType: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        signature(_hash: PromiseOrValue<BytesLike>, _index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        initialize(_sourceChainId: PromiseOrValue<BigNumberish>, _destinationChainId: PromiseOrValue<BigNumberish>, _validatorContract: PromiseOrValue<string>, _maxGasPerTx: PromiseOrValue<BigNumberish>, _gasPrice: PromiseOrValue<BigNumberish>, _requiredBlockConfirmations: PromiseOrValue<BigNumberish>, _owner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        isInitialized(overrides?: CallOverrides): Promise<[boolean]>;
        requiredBlockConfirmations(overrides?: CallOverrides): Promise<[BigNumber]>;
        getMinimumGasUsage(_data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[BigNumber] & {
            gas: BigNumber;
        }>;
        failedMessageReceiver(_messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string]>;
        getBridgeMode(overrides?: CallOverrides): Promise<[string] & {
            _data: string;
        }>;
        setChainIds(_sourceChainId: PromiseOrValue<BigNumberish>, _destinationChainId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        message(_hash: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string]>;
        failedMessageSender(_messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string]>;
        submitSignature(signature: PromiseOrValue<BytesLike>, message: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        messageId(overrides?: CallOverrides): Promise<[string] & {
            id: string;
        }>;
        numAffirmationsSigned(_hash: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[BigNumber]>;
        affirmationsSigned(_hash: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
        setMaxGasPerTx(_maxGasPerTx: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        requiredSignatures(overrides?: CallOverrides): Promise<[BigNumber]>;
        owner(overrides?: CallOverrides): Promise<[string]>;
        messagesSigned(_message: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
        requireToConfirmMessage(_contract: PromiseOrValue<string>, _data: PromiseOrValue<BytesLike>, _gas: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        validatorContract(overrides?: CallOverrides): Promise<[string]>;
        deployedAtBlock(overrides?: CallOverrides): Promise<[BigNumber]>;
        getBridgeInterfacesVersion(overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber,
            BigNumber
        ] & {
            major: BigNumber;
            minor: BigNumber;
            patch: BigNumber;
        }>;
        messageSourceChainId(overrides?: CallOverrides): Promise<[BigNumber] & {
            id: BigNumber;
        }>;
        setRequiredBlockConfirmations(_blockConfirmations: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        destinationChainId(overrides?: CallOverrides): Promise<[BigNumber]>;
        setGasPrice(_gasPrice: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        messageCallStatus(_messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
        messageSender(overrides?: CallOverrides): Promise<[string] & {
            sender: string;
        }>;
        decimalShift(overrides?: CallOverrides): Promise<[BigNumber]>;
        requireToPassMessage(_contract: PromiseOrValue<string>, _data: PromiseOrValue<BytesLike>, _gas: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        failedMessageDataHash(_messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string]>;
        maxGasPerTx(overrides?: CallOverrides): Promise<[BigNumber]>;
        executeAffirmation(message: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        gasPrice(overrides?: CallOverrides): Promise<[BigNumber]>;
        isAlreadyProcessed(_number: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[boolean]>;
    };
    transactionHash(overrides?: CallOverrides): Promise<string>;
    numMessagesSigned(_message: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
    sourceChainId(overrides?: CallOverrides): Promise<BigNumber>;
    _sendMessage(_contract: PromiseOrValue<string>, _data: PromiseOrValue<BytesLike>, _gas: PromiseOrValue<BigNumberish>, _dataType: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    signature(_hash: PromiseOrValue<BytesLike>, _index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    initialize(_sourceChainId: PromiseOrValue<BigNumberish>, _destinationChainId: PromiseOrValue<BigNumberish>, _validatorContract: PromiseOrValue<string>, _maxGasPerTx: PromiseOrValue<BigNumberish>, _gasPrice: PromiseOrValue<BigNumberish>, _requiredBlockConfirmations: PromiseOrValue<BigNumberish>, _owner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    isInitialized(overrides?: CallOverrides): Promise<boolean>;
    requiredBlockConfirmations(overrides?: CallOverrides): Promise<BigNumber>;
    getMinimumGasUsage(_data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
    failedMessageReceiver(_messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
    getBridgeMode(overrides?: CallOverrides): Promise<string>;
    setChainIds(_sourceChainId: PromiseOrValue<BigNumberish>, _destinationChainId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    message(_hash: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
    failedMessageSender(_messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
    submitSignature(signature: PromiseOrValue<BytesLike>, message: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    messageId(overrides?: CallOverrides): Promise<string>;
    numAffirmationsSigned(_hash: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
    affirmationsSigned(_hash: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    setMaxGasPerTx(_maxGasPerTx: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    requiredSignatures(overrides?: CallOverrides): Promise<BigNumber>;
    owner(overrides?: CallOverrides): Promise<string>;
    messagesSigned(_message: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    requireToConfirmMessage(_contract: PromiseOrValue<string>, _data: PromiseOrValue<BytesLike>, _gas: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    validatorContract(overrides?: CallOverrides): Promise<string>;
    deployedAtBlock(overrides?: CallOverrides): Promise<BigNumber>;
    getBridgeInterfacesVersion(overrides?: CallOverrides): Promise<[
        BigNumber,
        BigNumber,
        BigNumber
    ] & {
        major: BigNumber;
        minor: BigNumber;
        patch: BigNumber;
    }>;
    messageSourceChainId(overrides?: CallOverrides): Promise<BigNumber>;
    setRequiredBlockConfirmations(_blockConfirmations: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    destinationChainId(overrides?: CallOverrides): Promise<BigNumber>;
    setGasPrice(_gasPrice: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    messageCallStatus(_messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    messageSender(overrides?: CallOverrides): Promise<string>;
    decimalShift(overrides?: CallOverrides): Promise<BigNumber>;
    requireToPassMessage(_contract: PromiseOrValue<string>, _data: PromiseOrValue<BytesLike>, _gas: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    failedMessageDataHash(_messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
    maxGasPerTx(overrides?: CallOverrides): Promise<BigNumber>;
    executeAffirmation(message: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    gasPrice(overrides?: CallOverrides): Promise<BigNumber>;
    isAlreadyProcessed(_number: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
    callStatic: {
        transactionHash(overrides?: CallOverrides): Promise<string>;
        numMessagesSigned(_message: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        sourceChainId(overrides?: CallOverrides): Promise<BigNumber>;
        _sendMessage(_contract: PromiseOrValue<string>, _data: PromiseOrValue<BytesLike>, _gas: PromiseOrValue<BigNumberish>, _dataType: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        signature(_hash: PromiseOrValue<BytesLike>, _index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        initialize(_sourceChainId: PromiseOrValue<BigNumberish>, _destinationChainId: PromiseOrValue<BigNumberish>, _validatorContract: PromiseOrValue<string>, _maxGasPerTx: PromiseOrValue<BigNumberish>, _gasPrice: PromiseOrValue<BigNumberish>, _requiredBlockConfirmations: PromiseOrValue<BigNumberish>, _owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        isInitialized(overrides?: CallOverrides): Promise<boolean>;
        requiredBlockConfirmations(overrides?: CallOverrides): Promise<BigNumber>;
        getMinimumGasUsage(_data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        failedMessageReceiver(_messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        getBridgeMode(overrides?: CallOverrides): Promise<string>;
        setChainIds(_sourceChainId: PromiseOrValue<BigNumberish>, _destinationChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        message(_hash: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        failedMessageSender(_messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        submitSignature(signature: PromiseOrValue<BytesLike>, message: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        messageId(overrides?: CallOverrides): Promise<string>;
        numAffirmationsSigned(_hash: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        affirmationsSigned(_hash: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
        setMaxGasPerTx(_maxGasPerTx: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        requiredSignatures(overrides?: CallOverrides): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<string>;
        messagesSigned(_message: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
        requireToConfirmMessage(_contract: PromiseOrValue<string>, _data: PromiseOrValue<BytesLike>, _gas: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        validatorContract(overrides?: CallOverrides): Promise<string>;
        deployedAtBlock(overrides?: CallOverrides): Promise<BigNumber>;
        getBridgeInterfacesVersion(overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber,
            BigNumber
        ] & {
            major: BigNumber;
            minor: BigNumber;
            patch: BigNumber;
        }>;
        messageSourceChainId(overrides?: CallOverrides): Promise<BigNumber>;
        setRequiredBlockConfirmations(_blockConfirmations: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        destinationChainId(overrides?: CallOverrides): Promise<BigNumber>;
        setGasPrice(_gasPrice: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        messageCallStatus(_messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
        messageSender(overrides?: CallOverrides): Promise<string>;
        decimalShift(overrides?: CallOverrides): Promise<BigNumber>;
        requireToPassMessage(_contract: PromiseOrValue<string>, _data: PromiseOrValue<BytesLike>, _gas: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        failedMessageDataHash(_messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        maxGasPerTx(overrides?: CallOverrides): Promise<BigNumber>;
        executeAffirmation(message: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        gasPrice(overrides?: CallOverrides): Promise<BigNumber>;
        isAlreadyProcessed(_number: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
    };
    filters: {
        "UserRequestForSignature(bytes32,bytes)"(messageId?: PromiseOrValue<BytesLike> | null, encodedData?: null): UserRequestForSignatureEventFilter;
        UserRequestForSignature(messageId?: PromiseOrValue<BytesLike> | null, encodedData?: null): UserRequestForSignatureEventFilter;
        "AffirmationCompleted(address,address,bytes32,bool)"(sender?: PromiseOrValue<string> | null, executor?: PromiseOrValue<string> | null, messageId?: PromiseOrValue<BytesLike> | null, status?: null): AffirmationCompletedEventFilter;
        AffirmationCompleted(sender?: PromiseOrValue<string> | null, executor?: PromiseOrValue<string> | null, messageId?: PromiseOrValue<BytesLike> | null, status?: null): AffirmationCompletedEventFilter;
        "SignedForUserRequest(address,bytes32)"(signer?: PromiseOrValue<string> | null, messageHash?: null): SignedForUserRequestEventFilter;
        SignedForUserRequest(signer?: PromiseOrValue<string> | null, messageHash?: null): SignedForUserRequestEventFilter;
        "SignedForAffirmation(address,bytes32)"(signer?: PromiseOrValue<string> | null, messageHash?: null): SignedForAffirmationEventFilter;
        SignedForAffirmation(signer?: PromiseOrValue<string> | null, messageHash?: null): SignedForAffirmationEventFilter;
        "CollectedSignatures(address,bytes32,uint256)"(authorityResponsibleForRelay?: null, messageHash?: null, NumberOfCollectedSignatures?: null): CollectedSignaturesEventFilter;
        CollectedSignatures(authorityResponsibleForRelay?: null, messageHash?: null, NumberOfCollectedSignatures?: null): CollectedSignaturesEventFilter;
        "GasPriceChanged(uint256)"(gasPrice?: null): GasPriceChangedEventFilter;
        GasPriceChanged(gasPrice?: null): GasPriceChangedEventFilter;
        "RequiredBlockConfirmationChanged(uint256)"(requiredBlockConfirmations?: null): RequiredBlockConfirmationChangedEventFilter;
        RequiredBlockConfirmationChanged(requiredBlockConfirmations?: null): RequiredBlockConfirmationChangedEventFilter;
        "OwnershipTransferred(address,address)"(previousOwner?: null, newOwner?: null): OwnershipTransferredEventFilter;
        OwnershipTransferred(previousOwner?: null, newOwner?: null): OwnershipTransferredEventFilter;
    };
    estimateGas: {
        transactionHash(overrides?: CallOverrides): Promise<BigNumber>;
        numMessagesSigned(_message: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        sourceChainId(overrides?: CallOverrides): Promise<BigNumber>;
        _sendMessage(_contract: PromiseOrValue<string>, _data: PromiseOrValue<BytesLike>, _gas: PromiseOrValue<BigNumberish>, _dataType: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        signature(_hash: PromiseOrValue<BytesLike>, _index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        initialize(_sourceChainId: PromiseOrValue<BigNumberish>, _destinationChainId: PromiseOrValue<BigNumberish>, _validatorContract: PromiseOrValue<string>, _maxGasPerTx: PromiseOrValue<BigNumberish>, _gasPrice: PromiseOrValue<BigNumberish>, _requiredBlockConfirmations: PromiseOrValue<BigNumberish>, _owner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        isInitialized(overrides?: CallOverrides): Promise<BigNumber>;
        requiredBlockConfirmations(overrides?: CallOverrides): Promise<BigNumber>;
        getMinimumGasUsage(_data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        failedMessageReceiver(_messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        getBridgeMode(overrides?: CallOverrides): Promise<BigNumber>;
        setChainIds(_sourceChainId: PromiseOrValue<BigNumberish>, _destinationChainId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        message(_hash: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        failedMessageSender(_messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        submitSignature(signature: PromiseOrValue<BytesLike>, message: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        messageId(overrides?: CallOverrides): Promise<BigNumber>;
        numAffirmationsSigned(_hash: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        affirmationsSigned(_hash: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        setMaxGasPerTx(_maxGasPerTx: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        requiredSignatures(overrides?: CallOverrides): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<BigNumber>;
        messagesSigned(_message: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        requireToConfirmMessage(_contract: PromiseOrValue<string>, _data: PromiseOrValue<BytesLike>, _gas: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        validatorContract(overrides?: CallOverrides): Promise<BigNumber>;
        deployedAtBlock(overrides?: CallOverrides): Promise<BigNumber>;
        getBridgeInterfacesVersion(overrides?: CallOverrides): Promise<BigNumber>;
        messageSourceChainId(overrides?: CallOverrides): Promise<BigNumber>;
        setRequiredBlockConfirmations(_blockConfirmations: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        destinationChainId(overrides?: CallOverrides): Promise<BigNumber>;
        setGasPrice(_gasPrice: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        messageCallStatus(_messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        messageSender(overrides?: CallOverrides): Promise<BigNumber>;
        decimalShift(overrides?: CallOverrides): Promise<BigNumber>;
        requireToPassMessage(_contract: PromiseOrValue<string>, _data: PromiseOrValue<BytesLike>, _gas: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        failedMessageDataHash(_messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        maxGasPerTx(overrides?: CallOverrides): Promise<BigNumber>;
        executeAffirmation(message: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        gasPrice(overrides?: CallOverrides): Promise<BigNumber>;
        isAlreadyProcessed(_number: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        transactionHash(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        numMessagesSigned(_message: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        sourceChainId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        _sendMessage(_contract: PromiseOrValue<string>, _data: PromiseOrValue<BytesLike>, _gas: PromiseOrValue<BigNumberish>, _dataType: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        signature(_hash: PromiseOrValue<BytesLike>, _index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        initialize(_sourceChainId: PromiseOrValue<BigNumberish>, _destinationChainId: PromiseOrValue<BigNumberish>, _validatorContract: PromiseOrValue<string>, _maxGasPerTx: PromiseOrValue<BigNumberish>, _gasPrice: PromiseOrValue<BigNumberish>, _requiredBlockConfirmations: PromiseOrValue<BigNumberish>, _owner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        isInitialized(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        requiredBlockConfirmations(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getMinimumGasUsage(_data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        failedMessageReceiver(_messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getBridgeMode(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        setChainIds(_sourceChainId: PromiseOrValue<BigNumberish>, _destinationChainId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        message(_hash: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        failedMessageSender(_messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        submitSignature(signature: PromiseOrValue<BytesLike>, message: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        messageId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        numAffirmationsSigned(_hash: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        affirmationsSigned(_hash: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        setMaxGasPerTx(_maxGasPerTx: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        requiredSignatures(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        messagesSigned(_message: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        requireToConfirmMessage(_contract: PromiseOrValue<string>, _data: PromiseOrValue<BytesLike>, _gas: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        validatorContract(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        deployedAtBlock(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getBridgeInterfacesVersion(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        messageSourceChainId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        setRequiredBlockConfirmations(_blockConfirmations: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        destinationChainId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        setGasPrice(_gasPrice: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        messageCallStatus(_messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        messageSender(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        decimalShift(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        requireToPassMessage(_contract: PromiseOrValue<string>, _data: PromiseOrValue<BytesLike>, _gas: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        failedMessageDataHash(_messageId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        maxGasPerTx(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        executeAffirmation(message: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        gasPrice(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isAlreadyProcessed(_number: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=L2_xDaiAMB.d.ts.map