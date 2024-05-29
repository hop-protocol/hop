import type { BaseContract, BigNumber, BigNumberish, BytesLike, Signer, utils } from "ethers";
import type { EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common.js";
export interface MessageExecutorInterface extends utils.Interface {
    functions: {};
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
export interface MessageExecutor extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: MessageExecutorInterface;
    queryFilter<TEvent extends TypedEvent>(event: TypedEventFilter<TEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TEvent>>;
    listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
    listeners(eventName?: string): Array<Listener>;
    removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
    removeAllListeners(eventName?: string): this;
    off: OnEvent<this>;
    on: OnEvent<this>;
    once: OnEvent<this>;
    removeListener: OnEvent<this>;
    functions: {};
    callStatic: {};
    filters: {
        "MessageIdExecuted(uint256,bytes32)"(fromChainId?: PromiseOrValue<BigNumberish> | null, messageId?: PromiseOrValue<BytesLike> | null): MessageIdExecutedEventFilter;
        MessageIdExecuted(fromChainId?: PromiseOrValue<BigNumberish> | null, messageId?: PromiseOrValue<BytesLike> | null): MessageIdExecutedEventFilter;
    };
    estimateGas: {};
    populateTransaction: {};
}
//# sourceMappingURL=MessageExecutor.d.ts.map