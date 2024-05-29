import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common.js";
export interface AliasFactoryInterface extends utils.Interface {
    functions: {
        "baseDispatcher()": FunctionFragment;
        "baseExecutor()": FunctionFragment;
        "calculateAliasAddress(uint256,address,address)": FunctionFragment;
        "calculateAliasDispatcherAddress(address)": FunctionFragment;
        "deployAlias(uint256,address,address)": FunctionFragment;
        "deployAliasDispatcher(address)": FunctionFragment;
        "getAliasDispatcherSalt(address)": FunctionFragment;
        "getAliasSalt(uint256,address,address)": FunctionFragment;
        "getChainId()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "baseDispatcher" | "baseExecutor" | "calculateAliasAddress" | "calculateAliasDispatcherAddress" | "deployAlias" | "deployAliasDispatcher" | "getAliasDispatcherSalt" | "getAliasSalt" | "getChainId"): FunctionFragment;
    encodeFunctionData(functionFragment: "baseDispatcher", values?: undefined): string;
    encodeFunctionData(functionFragment: "baseExecutor", values?: undefined): string;
    encodeFunctionData(functionFragment: "calculateAliasAddress", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "calculateAliasDispatcherAddress", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "deployAlias", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "deployAliasDispatcher", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getAliasDispatcherSalt", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getAliasSalt", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "getChainId", values?: undefined): string;
    decodeFunctionResult(functionFragment: "baseDispatcher", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "baseExecutor", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "calculateAliasAddress", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "calculateAliasDispatcherAddress", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deployAlias", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deployAliasDispatcher", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getAliasDispatcherSalt", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getAliasSalt", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getChainId", data: BytesLike): Result;
    events: {
        "AliasDeployed(address,uint256,address,address)": EventFragment;
        "AliasDispatcherDeployed(address,address,address)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "AliasDeployed"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "AliasDispatcherDeployed"): EventFragment;
}
export interface AliasDeployedEventObject {
    aliasAddress: string;
    sourceChainId: BigNumber;
    sourceAddress: string;
    aliasDispatcher: string;
}
export type AliasDeployedEvent = TypedEvent<[
    string,
    BigNumber,
    string,
    string
], AliasDeployedEventObject>;
export type AliasDeployedEventFilter = TypedEventFilter<AliasDeployedEvent>;
export interface AliasDispatcherDeployedEventObject {
    dispatcher: string;
    sourceAddress: string;
    aliasDispatcher: string;
}
export type AliasDispatcherDeployedEvent = TypedEvent<[
    string,
    string,
    string
], AliasDispatcherDeployedEventObject>;
export type AliasDispatcherDeployedEventFilter = TypedEventFilter<AliasDispatcherDeployedEvent>;
export interface AliasFactory extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: AliasFactoryInterface;
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
        baseDispatcher(overrides?: CallOverrides): Promise<[string]>;
        baseExecutor(overrides?: CallOverrides): Promise<[string]>;
        calculateAliasAddress(sourceChainId: PromiseOrValue<BigNumberish>, sourceAddress: PromiseOrValue<string>, aliasDispatcher: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[string]>;
        calculateAliasDispatcherAddress(sourceAddress: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[string]>;
        deployAlias(sourceChainId: PromiseOrValue<BigNumberish>, sourceAddress: PromiseOrValue<string>, aliasDispatcher: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        deployAliasDispatcher(sourceAddress: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getAliasDispatcherSalt(sourceAddress: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[string]>;
        getAliasSalt(sourceChainId: PromiseOrValue<BigNumberish>, sourceAddress: PromiseOrValue<string>, aliasDispatcher: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[string]>;
        getChainId(overrides?: CallOverrides): Promise<[BigNumber] & {
            chainId: BigNumber;
        }>;
    };
    baseDispatcher(overrides?: CallOverrides): Promise<string>;
    baseExecutor(overrides?: CallOverrides): Promise<string>;
    calculateAliasAddress(sourceChainId: PromiseOrValue<BigNumberish>, sourceAddress: PromiseOrValue<string>, aliasDispatcher: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
    calculateAliasDispatcherAddress(sourceAddress: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
    deployAlias(sourceChainId: PromiseOrValue<BigNumberish>, sourceAddress: PromiseOrValue<string>, aliasDispatcher: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    deployAliasDispatcher(sourceAddress: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getAliasDispatcherSalt(sourceAddress: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
    getAliasSalt(sourceChainId: PromiseOrValue<BigNumberish>, sourceAddress: PromiseOrValue<string>, aliasDispatcher: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
    getChainId(overrides?: CallOverrides): Promise<BigNumber>;
    callStatic: {
        baseDispatcher(overrides?: CallOverrides): Promise<string>;
        baseExecutor(overrides?: CallOverrides): Promise<string>;
        calculateAliasAddress(sourceChainId: PromiseOrValue<BigNumberish>, sourceAddress: PromiseOrValue<string>, aliasDispatcher: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
        calculateAliasDispatcherAddress(sourceAddress: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
        deployAlias(sourceChainId: PromiseOrValue<BigNumberish>, sourceAddress: PromiseOrValue<string>, aliasDispatcher: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
        deployAliasDispatcher(sourceAddress: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
        getAliasDispatcherSalt(sourceAddress: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
        getAliasSalt(sourceChainId: PromiseOrValue<BigNumberish>, sourceAddress: PromiseOrValue<string>, aliasDispatcher: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
        getChainId(overrides?: CallOverrides): Promise<BigNumber>;
    };
    filters: {
        "AliasDeployed(address,uint256,address,address)"(aliasAddress?: PromiseOrValue<string> | null, sourceChainId?: PromiseOrValue<BigNumberish> | null, sourceAddress?: PromiseOrValue<string> | null, aliasDispatcher?: null): AliasDeployedEventFilter;
        AliasDeployed(aliasAddress?: PromiseOrValue<string> | null, sourceChainId?: PromiseOrValue<BigNumberish> | null, sourceAddress?: PromiseOrValue<string> | null, aliasDispatcher?: null): AliasDeployedEventFilter;
        "AliasDispatcherDeployed(address,address,address)"(dispatcher?: PromiseOrValue<string> | null, sourceAddress?: null, aliasDispatcher?: null): AliasDispatcherDeployedEventFilter;
        AliasDispatcherDeployed(dispatcher?: PromiseOrValue<string> | null, sourceAddress?: null, aliasDispatcher?: null): AliasDispatcherDeployedEventFilter;
    };
    estimateGas: {
        baseDispatcher(overrides?: CallOverrides): Promise<BigNumber>;
        baseExecutor(overrides?: CallOverrides): Promise<BigNumber>;
        calculateAliasAddress(sourceChainId: PromiseOrValue<BigNumberish>, sourceAddress: PromiseOrValue<string>, aliasDispatcher: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        calculateAliasDispatcherAddress(sourceAddress: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        deployAlias(sourceChainId: PromiseOrValue<BigNumberish>, sourceAddress: PromiseOrValue<string>, aliasDispatcher: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        deployAliasDispatcher(sourceAddress: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getAliasDispatcherSalt(sourceAddress: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getAliasSalt(sourceChainId: PromiseOrValue<BigNumberish>, sourceAddress: PromiseOrValue<string>, aliasDispatcher: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getChainId(overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        baseDispatcher(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        baseExecutor(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        calculateAliasAddress(sourceChainId: PromiseOrValue<BigNumberish>, sourceAddress: PromiseOrValue<string>, aliasDispatcher: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        calculateAliasDispatcherAddress(sourceAddress: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        deployAlias(sourceChainId: PromiseOrValue<BigNumberish>, sourceAddress: PromiseOrValue<string>, aliasDispatcher: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        deployAliasDispatcher(sourceAddress: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getAliasDispatcherSalt(sourceAddress: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getAliasSalt(sourceChainId: PromiseOrValue<BigNumberish>, sourceAddress: PromiseOrValue<string>, aliasDispatcher: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getChainId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=AliasFactory.d.ts.map