import type { BaseContract, BigNumber, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common.js";
export interface ConnectorInterface extends utils.Interface {
    functions: {
        "counterpart()": FunctionFragment;
        "initialize(address,address)": FunctionFragment;
        "target()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "counterpart" | "initialize" | "target"): FunctionFragment;
    encodeFunctionData(functionFragment: "counterpart", values?: undefined): string;
    encodeFunctionData(functionFragment: "initialize", values: [PromiseOrValue<string>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "target", values?: undefined): string;
    decodeFunctionResult(functionFragment: "counterpart", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "target", data: BytesLike): Result;
    events: {};
}
export interface Connector extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: ConnectorInterface;
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
        initialize(_target: PromiseOrValue<string>, _counterpart: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        target(overrides?: CallOverrides): Promise<[string]>;
    };
    counterpart(overrides?: CallOverrides): Promise<string>;
    initialize(_target: PromiseOrValue<string>, _counterpart: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    target(overrides?: CallOverrides): Promise<string>;
    callStatic: {
        counterpart(overrides?: CallOverrides): Promise<string>;
        initialize(_target: PromiseOrValue<string>, _counterpart: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        target(overrides?: CallOverrides): Promise<string>;
    };
    filters: {};
    estimateGas: {
        counterpart(overrides?: CallOverrides): Promise<BigNumber>;
        initialize(_target: PromiseOrValue<string>, _counterpart: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        target(overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        counterpart(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        initialize(_target: PromiseOrValue<string>, _counterpart: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        target(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=Connector.d.ts.map