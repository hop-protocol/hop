import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common.js";
export interface ERC5164ConnectorInterface extends utils.Interface {
    functions: {
        "counterpart()": FunctionFragment;
        "counterpartChainId()": FunctionFragment;
        "getFee(uint256[])": FunctionFragment;
        "initialize(address,address)": FunctionFragment;
        "initialize(address,address,address,address,uint256)": FunctionFragment;
        "messageDispatcher()": FunctionFragment;
        "messageExecutor()": FunctionFragment;
        "target()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "counterpart" | "counterpartChainId" | "getFee" | "initialize(address,address)" | "initialize(address,address,address,address,uint256)" | "messageDispatcher" | "messageExecutor" | "target"): FunctionFragment;
    encodeFunctionData(functionFragment: "counterpart", values?: undefined): string;
    encodeFunctionData(functionFragment: "counterpartChainId", values?: undefined): string;
    encodeFunctionData(functionFragment: "getFee", values: [PromiseOrValue<BigNumberish>[]]): string;
    encodeFunctionData(functionFragment: "initialize(address,address)", values: [PromiseOrValue<string>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "initialize(address,address,address,address,uint256)", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "messageDispatcher", values?: undefined): string;
    encodeFunctionData(functionFragment: "messageExecutor", values?: undefined): string;
    encodeFunctionData(functionFragment: "target", values?: undefined): string;
    decodeFunctionResult(functionFragment: "counterpart", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "counterpartChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initialize(address,address)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initialize(address,address,address,address,uint256)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "messageDispatcher", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "messageExecutor", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "target", data: BytesLike): Result;
    events: {};
}
export interface ERC5164Connector extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: ERC5164ConnectorInterface;
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
        counterpart(overrides?: CallOverrides): Promise<[string]>;
        counterpartChainId(overrides?: CallOverrides): Promise<[BigNumber]>;
        getFee(chainIds: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<[BigNumber]>;
        "initialize(address,address)"(_target: PromiseOrValue<string>, _counterpart: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        "initialize(address,address,address,address,uint256)"(target: PromiseOrValue<string>, counterpart: PromiseOrValue<string>, _messageDispatcher: PromiseOrValue<string>, _messageExecutor: PromiseOrValue<string>, _counterpartChainId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        messageDispatcher(overrides?: CallOverrides): Promise<[string]>;
        messageExecutor(overrides?: CallOverrides): Promise<[string]>;
        target(overrides?: CallOverrides): Promise<[string]>;
    };
    counterpart(overrides?: CallOverrides): Promise<string>;
    counterpartChainId(overrides?: CallOverrides): Promise<BigNumber>;
    getFee(chainIds: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<BigNumber>;
    "initialize(address,address)"(_target: PromiseOrValue<string>, _counterpart: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    "initialize(address,address,address,address,uint256)"(target: PromiseOrValue<string>, counterpart: PromiseOrValue<string>, _messageDispatcher: PromiseOrValue<string>, _messageExecutor: PromiseOrValue<string>, _counterpartChainId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    messageDispatcher(overrides?: CallOverrides): Promise<string>;
    messageExecutor(overrides?: CallOverrides): Promise<string>;
    target(overrides?: CallOverrides): Promise<string>;
    callStatic: {
        counterpart(overrides?: CallOverrides): Promise<string>;
        counterpartChainId(overrides?: CallOverrides): Promise<BigNumber>;
        getFee(chainIds: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<BigNumber>;
        "initialize(address,address)"(_target: PromiseOrValue<string>, _counterpart: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        "initialize(address,address,address,address,uint256)"(target: PromiseOrValue<string>, counterpart: PromiseOrValue<string>, _messageDispatcher: PromiseOrValue<string>, _messageExecutor: PromiseOrValue<string>, _counterpartChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        messageDispatcher(overrides?: CallOverrides): Promise<string>;
        messageExecutor(overrides?: CallOverrides): Promise<string>;
        target(overrides?: CallOverrides): Promise<string>;
    };
    filters: {};
    estimateGas: {
        counterpart(overrides?: CallOverrides): Promise<BigNumber>;
        counterpartChainId(overrides?: CallOverrides): Promise<BigNumber>;
        getFee(chainIds: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<BigNumber>;
        "initialize(address,address)"(_target: PromiseOrValue<string>, _counterpart: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        "initialize(address,address,address,address,uint256)"(target: PromiseOrValue<string>, counterpart: PromiseOrValue<string>, _messageDispatcher: PromiseOrValue<string>, _messageExecutor: PromiseOrValue<string>, _counterpartChainId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        messageDispatcher(overrides?: CallOverrides): Promise<BigNumber>;
        messageExecutor(overrides?: CallOverrides): Promise<BigNumber>;
        target(overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        counterpart(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        counterpartChainId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getFee(chainIds: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<PopulatedTransaction>;
        "initialize(address,address)"(_target: PromiseOrValue<string>, _counterpart: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        "initialize(address,address,address,address,uint256)"(target: PromiseOrValue<string>, counterpart: PromiseOrValue<string>, _messageDispatcher: PromiseOrValue<string>, _messageExecutor: PromiseOrValue<string>, _counterpartChainId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        messageDispatcher(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        messageExecutor(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        target(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=ERC5164Connector.d.ts.map