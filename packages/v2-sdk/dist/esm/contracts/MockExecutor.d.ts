import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common.js";
export interface MockExecutorInterface extends utils.Interface {
    functions: {
        "execute(bytes32,uint256,address,address,bytes)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "execute"): FunctionFragment;
    encodeFunctionData(functionFragment: "execute", values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>
    ]): string;
    decodeFunctionResult(functionFragment: "execute", data: BytesLike): Result;
    events: {
        "MessageIdExecuted(uint256,bytes32)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "MessageIdExecuted"): EventFragment;
}
export interface MessageIdExecutedEventObject {
    fromChainId: BigNumber;
    messageId: string;
}
export type MessageIdExecutedEvent = TypedEvent<[
    BigNumber,
    string
], MessageIdExecutedEventObject>;
export type MessageIdExecutedEventFilter = TypedEventFilter<MessageIdExecutedEvent>;
export interface MockExecutor extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: MockExecutorInterface;
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
        execute(messageId: PromiseOrValue<BytesLike>, fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    execute(messageId: PromiseOrValue<BytesLike>, fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        execute(messageId: PromiseOrValue<BytesLike>, fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "MessageIdExecuted(uint256,bytes32)"(fromChainId?: PromiseOrValue<BigNumberish> | null, messageId?: PromiseOrValue<BytesLike> | null): MessageIdExecutedEventFilter;
        MessageIdExecuted(fromChainId?: PromiseOrValue<BigNumberish> | null, messageId?: PromiseOrValue<BytesLike> | null): MessageIdExecutedEventFilter;
    };
    estimateGas: {
        execute(messageId: PromiseOrValue<BytesLike>, fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        execute(messageId: PromiseOrValue<BytesLike>, fromChainId: PromiseOrValue<BigNumberish>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=MockExecutor.d.ts.map