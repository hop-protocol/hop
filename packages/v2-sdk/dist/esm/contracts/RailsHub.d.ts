import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common.js";
export interface RailsHubInterface extends utils.Interface {
    functions: {
        "bond(bytes32,bytes32,address,uint256,uint256,uint256,uint256,bytes32)": FunctionFragment;
        "confirmCheckpoint(bytes32,bytes32)": FunctionFragment;
        "getFee(bytes32)": FunctionFragment;
        "getPathId(uint256,address,uint256,address)": FunctionFragment;
        "getPathInfo(bytes32)": FunctionFragment;
        "getWithdrawableBalance(bytes32,address,uint256)": FunctionFragment;
        "initPath(address,uint256,address,address,address,uint256)": FunctionFragment;
        "postClaim(bytes32,bytes32,bytes32,uint256)": FunctionFragment;
        "removeClaim(bytes32,bytes32,uint256)": FunctionFragment;
        "send(bytes32,address,uint256,uint256,bytes32)": FunctionFragment;
        "withdraw(bytes32,uint256,uint256)": FunctionFragment;
        "withdrawAll(bytes32,uint256)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "bond" | "confirmCheckpoint" | "getFee" | "getPathId" | "getPathInfo" | "getWithdrawableBalance" | "initPath" | "postClaim" | "removeClaim" | "send" | "withdraw" | "withdrawAll"): FunctionFragment;
    encodeFunctionData(functionFragment: "bond", values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "confirmCheckpoint", values: [PromiseOrValue<BytesLike>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "getFee", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "getPathId", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "getPathInfo", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "getWithdrawableBalance", values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "initPath", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "postClaim", values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "removeClaim", values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "send", values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "withdraw", values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "withdrawAll", values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]): string;
    decodeFunctionResult(functionFragment: "bond", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "confirmCheckpoint", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPathId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPathInfo", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getWithdrawableBalance", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initPath", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "postClaim", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "removeClaim", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "send", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdrawAll", data: BytesLike): Result;
    events: {
        "TransferBonded(bytes32,bytes32,address,uint256,uint256,uint256)": EventFragment;
        "TransferSent(bytes32,bytes32,address,uint256,uint256,uint256)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "TransferBonded"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "TransferSent"): EventFragment;
}
export interface TransferBondedEventObject {
    transferId: string;
    pathId: string;
    to: string;
    amount: BigNumber;
    minAmountOut: BigNumber;
    totalSent: BigNumber;
}
export type TransferBondedEvent = TypedEvent<[
    string,
    string,
    string,
    BigNumber,
    BigNumber,
    BigNumber
], TransferBondedEventObject>;
export type TransferBondedEventFilter = TypedEventFilter<TransferBondedEvent>;
export interface TransferSentEventObject {
    transferId: string;
    pathId: string;
    to: string;
    amount: BigNumber;
    minAmountOut: BigNumber;
    totalSent: BigNumber;
}
export type TransferSentEvent = TypedEvent<[
    string,
    string,
    string,
    BigNumber,
    BigNumber,
    BigNumber
], TransferSentEventObject>;
export type TransferSentEventFilter = TypedEventFilter<TransferSentEvent>;
export interface RailsHub extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: RailsHubInterface;
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
        bond(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, totalSent: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        confirmCheckpoint(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getFee(pathId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[BigNumber]>;
        getPathId(chainId0: PromiseOrValue<BigNumberish>, token0: PromiseOrValue<string>, chainId1: PromiseOrValue<BigNumberish>, token1: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[string]>;
        getPathInfo(pathId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[BigNumber, string, BigNumber, string]>;
        getWithdrawableBalance(pathId: PromiseOrValue<BytesLike>, recipient: PromiseOrValue<string>, time: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        initPath(token: PromiseOrValue<string>, counterpartChainId: PromiseOrValue<BigNumberish>, counterpartToken: PromiseOrValue<string>, dispatcher: PromiseOrValue<string>, executor: PromiseOrValue<string>, rateDelta: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        postClaim(pathId: PromiseOrValue<BytesLike>, transferId: PromiseOrValue<BytesLike>, head: PromiseOrValue<BytesLike>, totalSent: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        removeClaim(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, nonce: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        send(pathId: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        withdraw(pathId: PromiseOrValue<BytesLike>, amount: PromiseOrValue<BigNumberish>, time: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        withdrawAll(pathId: PromiseOrValue<BytesLike>, time: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    bond(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, totalSent: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    confirmCheckpoint(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getFee(pathId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
    getPathId(chainId0: PromiseOrValue<BigNumberish>, token0: PromiseOrValue<string>, chainId1: PromiseOrValue<BigNumberish>, token1: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
    getPathInfo(pathId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[BigNumber, string, BigNumber, string]>;
    getWithdrawableBalance(pathId: PromiseOrValue<BytesLike>, recipient: PromiseOrValue<string>, time: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    initPath(token: PromiseOrValue<string>, counterpartChainId: PromiseOrValue<BigNumberish>, counterpartToken: PromiseOrValue<string>, dispatcher: PromiseOrValue<string>, executor: PromiseOrValue<string>, rateDelta: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    postClaim(pathId: PromiseOrValue<BytesLike>, transferId: PromiseOrValue<BytesLike>, head: PromiseOrValue<BytesLike>, totalSent: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    removeClaim(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, nonce: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    send(pathId: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    withdraw(pathId: PromiseOrValue<BytesLike>, amount: PromiseOrValue<BigNumberish>, time: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    withdrawAll(pathId: PromiseOrValue<BytesLike>, time: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        bond(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, totalSent: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        confirmCheckpoint(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        getFee(pathId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        getPathId(chainId0: PromiseOrValue<BigNumberish>, token0: PromiseOrValue<string>, chainId1: PromiseOrValue<BigNumberish>, token1: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
        getPathInfo(pathId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[BigNumber, string, BigNumber, string]>;
        getWithdrawableBalance(pathId: PromiseOrValue<BytesLike>, recipient: PromiseOrValue<string>, time: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        initPath(token: PromiseOrValue<string>, counterpartChainId: PromiseOrValue<BigNumberish>, counterpartToken: PromiseOrValue<string>, dispatcher: PromiseOrValue<string>, executor: PromiseOrValue<string>, rateDelta: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        postClaim(pathId: PromiseOrValue<BytesLike>, transferId: PromiseOrValue<BytesLike>, head: PromiseOrValue<BytesLike>, totalSent: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        removeClaim(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, nonce: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        send(pathId: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        withdraw(pathId: PromiseOrValue<BytesLike>, amount: PromiseOrValue<BigNumberish>, time: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        withdrawAll(pathId: PromiseOrValue<BytesLike>, time: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "TransferBonded(bytes32,bytes32,address,uint256,uint256,uint256)"(transferId?: PromiseOrValue<BytesLike> | null, pathId?: PromiseOrValue<BytesLike> | null, to?: PromiseOrValue<string> | null, amount?: null, minAmountOut?: null, totalSent?: null): TransferBondedEventFilter;
        TransferBonded(transferId?: PromiseOrValue<BytesLike> | null, pathId?: PromiseOrValue<BytesLike> | null, to?: PromiseOrValue<string> | null, amount?: null, minAmountOut?: null, totalSent?: null): TransferBondedEventFilter;
        "TransferSent(bytes32,bytes32,address,uint256,uint256,uint256)"(transferId?: PromiseOrValue<BytesLike> | null, pathId?: PromiseOrValue<BytesLike> | null, to?: PromiseOrValue<string> | null, amount?: null, minAmountOut?: null, totalSent?: null): TransferSentEventFilter;
        TransferSent(transferId?: PromiseOrValue<BytesLike> | null, pathId?: PromiseOrValue<BytesLike> | null, to?: PromiseOrValue<string> | null, amount?: null, minAmountOut?: null, totalSent?: null): TransferSentEventFilter;
    };
    estimateGas: {
        bond(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, totalSent: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        confirmCheckpoint(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getFee(pathId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        getPathId(chainId0: PromiseOrValue<BigNumberish>, token0: PromiseOrValue<string>, chainId1: PromiseOrValue<BigNumberish>, token1: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getPathInfo(pathId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        getWithdrawableBalance(pathId: PromiseOrValue<BytesLike>, recipient: PromiseOrValue<string>, time: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        initPath(token: PromiseOrValue<string>, counterpartChainId: PromiseOrValue<BigNumberish>, counterpartToken: PromiseOrValue<string>, dispatcher: PromiseOrValue<string>, executor: PromiseOrValue<string>, rateDelta: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        postClaim(pathId: PromiseOrValue<BytesLike>, transferId: PromiseOrValue<BytesLike>, head: PromiseOrValue<BytesLike>, totalSent: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        removeClaim(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, nonce: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        send(pathId: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        withdraw(pathId: PromiseOrValue<BytesLike>, amount: PromiseOrValue<BigNumberish>, time: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        withdrawAll(pathId: PromiseOrValue<BytesLike>, time: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        bond(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, totalSent: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        confirmCheckpoint(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getFee(pathId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getPathId(chainId0: PromiseOrValue<BigNumberish>, token0: PromiseOrValue<string>, chainId1: PromiseOrValue<BigNumberish>, token1: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getPathInfo(pathId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getWithdrawableBalance(pathId: PromiseOrValue<BytesLike>, recipient: PromiseOrValue<string>, time: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        initPath(token: PromiseOrValue<string>, counterpartChainId: PromiseOrValue<BigNumberish>, counterpartToken: PromiseOrValue<string>, dispatcher: PromiseOrValue<string>, executor: PromiseOrValue<string>, rateDelta: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        postClaim(pathId: PromiseOrValue<BytesLike>, transferId: PromiseOrValue<BytesLike>, head: PromiseOrValue<BytesLike>, totalSent: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        removeClaim(pathId: PromiseOrValue<BytesLike>, checkpoint: PromiseOrValue<BytesLike>, nonce: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        send(pathId: PromiseOrValue<BytesLike>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, minAmountOut: PromiseOrValue<BigNumberish>, attestedCheckpoint: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        withdraw(pathId: PromiseOrValue<BytesLike>, amount: PromiseOrValue<BigNumberish>, time: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        withdrawAll(pathId: PromiseOrValue<BytesLike>, time: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=RailsHub.d.ts.map