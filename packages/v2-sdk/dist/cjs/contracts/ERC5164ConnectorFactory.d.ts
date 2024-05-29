import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common.js";
export interface ERC5164ConnectorFactoryInterface extends utils.Interface {
    functions: {
        "calculateAddress(uint256,address,uint256,address)": FunctionFragment;
        "deployConnector(address,uint256,address,address)": FunctionFragment;
        "getChainId()": FunctionFragment;
        "getSalt(address,uint256,address,uint256)": FunctionFragment;
        "messageDispatcher()": FunctionFragment;
        "messageExecutor()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "calculateAddress" | "deployConnector" | "getChainId" | "getSalt" | "messageDispatcher" | "messageExecutor"): FunctionFragment;
    encodeFunctionData(functionFragment: "calculateAddress", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "deployConnector", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "getChainId", values?: undefined): string;
    encodeFunctionData(functionFragment: "getSalt", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "messageDispatcher", values?: undefined): string;
    encodeFunctionData(functionFragment: "messageExecutor", values?: undefined): string;
    decodeFunctionResult(functionFragment: "calculateAddress", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deployConnector", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getSalt", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "messageDispatcher", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "messageExecutor", data: BytesLike): Result;
    events: {
        "ConnectorDeployed(address,address,uint256,address,address)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "ConnectorDeployed"): EventFragment;
}
export interface ConnectorDeployedEventObject {
    connector: string;
    target: string;
    counterpartChainId: BigNumber;
    counterpartConnector: string;
    counterpartTarget: string;
}
export type ConnectorDeployedEvent = TypedEvent<[
    string,
    string,
    BigNumber,
    string,
    string
], ConnectorDeployedEventObject>;
export type ConnectorDeployedEventFilter = TypedEventFilter<ConnectorDeployedEvent>;
export interface ERC5164ConnectorFactory extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: ERC5164ConnectorFactoryInterface;
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
        calculateAddress(chainId1: PromiseOrValue<BigNumberish>, target1: PromiseOrValue<string>, chainId2: PromiseOrValue<BigNumberish>, target2: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[string]>;
        deployConnector(target: PromiseOrValue<string>, counterpartChainId: PromiseOrValue<BigNumberish>, counterpartConnector: PromiseOrValue<string>, counterpartTarget: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getChainId(overrides?: CallOverrides): Promise<[BigNumber] & {
            chainId: BigNumber;
        }>;
        getSalt(target1: PromiseOrValue<string>, chainId1: PromiseOrValue<BigNumberish>, target2: PromiseOrValue<string>, chainId2: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        messageDispatcher(overrides?: CallOverrides): Promise<[string]>;
        messageExecutor(overrides?: CallOverrides): Promise<[string]>;
    };
    calculateAddress(chainId1: PromiseOrValue<BigNumberish>, target1: PromiseOrValue<string>, chainId2: PromiseOrValue<BigNumberish>, target2: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
    deployConnector(target: PromiseOrValue<string>, counterpartChainId: PromiseOrValue<BigNumberish>, counterpartConnector: PromiseOrValue<string>, counterpartTarget: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getChainId(overrides?: CallOverrides): Promise<BigNumber>;
    getSalt(target1: PromiseOrValue<string>, chainId1: PromiseOrValue<BigNumberish>, target2: PromiseOrValue<string>, chainId2: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    messageDispatcher(overrides?: CallOverrides): Promise<string>;
    messageExecutor(overrides?: CallOverrides): Promise<string>;
    callStatic: {
        calculateAddress(chainId1: PromiseOrValue<BigNumberish>, target1: PromiseOrValue<string>, chainId2: PromiseOrValue<BigNumberish>, target2: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
        deployConnector(target: PromiseOrValue<string>, counterpartChainId: PromiseOrValue<BigNumberish>, counterpartConnector: PromiseOrValue<string>, counterpartTarget: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
        getChainId(overrides?: CallOverrides): Promise<BigNumber>;
        getSalt(target1: PromiseOrValue<string>, chainId1: PromiseOrValue<BigNumberish>, target2: PromiseOrValue<string>, chainId2: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        messageDispatcher(overrides?: CallOverrides): Promise<string>;
        messageExecutor(overrides?: CallOverrides): Promise<string>;
    };
    filters: {
        "ConnectorDeployed(address,address,uint256,address,address)"(connector?: PromiseOrValue<string> | null, target?: PromiseOrValue<string> | null, counterpartChainId?: null, counterpartConnector?: PromiseOrValue<string> | null, counterpartTarget?: null): ConnectorDeployedEventFilter;
        ConnectorDeployed(connector?: PromiseOrValue<string> | null, target?: PromiseOrValue<string> | null, counterpartChainId?: null, counterpartConnector?: PromiseOrValue<string> | null, counterpartTarget?: null): ConnectorDeployedEventFilter;
    };
    estimateGas: {
        calculateAddress(chainId1: PromiseOrValue<BigNumberish>, target1: PromiseOrValue<string>, chainId2: PromiseOrValue<BigNumberish>, target2: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        deployConnector(target: PromiseOrValue<string>, counterpartChainId: PromiseOrValue<BigNumberish>, counterpartConnector: PromiseOrValue<string>, counterpartTarget: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getChainId(overrides?: CallOverrides): Promise<BigNumber>;
        getSalt(target1: PromiseOrValue<string>, chainId1: PromiseOrValue<BigNumberish>, target2: PromiseOrValue<string>, chainId2: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        messageDispatcher(overrides?: CallOverrides): Promise<BigNumber>;
        messageExecutor(overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        calculateAddress(chainId1: PromiseOrValue<BigNumberish>, target1: PromiseOrValue<string>, chainId2: PromiseOrValue<BigNumberish>, target2: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        deployConnector(target: PromiseOrValue<string>, counterpartChainId: PromiseOrValue<BigNumberish>, counterpartConnector: PromiseOrValue<string>, counterpartTarget: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getChainId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getSalt(target1: PromiseOrValue<string>, chainId1: PromiseOrValue<BigNumberish>, target2: PromiseOrValue<string>, chainId2: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        messageDispatcher(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        messageExecutor(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=ERC5164ConnectorFactory.d.ts.map