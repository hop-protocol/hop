import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common.js";
export interface FeeDistributorInterface extends utils.Interface {
    functions: {
        "fullPoolSize()": FunctionFragment;
        "hubBridge()": FunctionFragment;
        "maxBundleFee()": FunctionFragment;
        "maxBundleFeeBPS()": FunctionFragment;
        "minPublicGoodsBps()": FunctionFragment;
        "owner()": FunctionFragment;
        "payFee(address,uint256,uint256)": FunctionFragment;
        "pendingFeeBatchSize()": FunctionFragment;
        "publicGoods()": FunctionFragment;
        "publicGoodsBps()": FunctionFragment;
        "relayWindow()": FunctionFragment;
        "renounceOwnership()": FunctionFragment;
        "setFullPoolSize(uint256)": FunctionFragment;
        "setMaxBundleFee(uint256)": FunctionFragment;
        "setMaxBundleFeeBPS(uint256)": FunctionFragment;
        "setPendingFeeBatchSize(uint256)": FunctionFragment;
        "setPublicGoods(address)": FunctionFragment;
        "setPublicGoodsBps(uint256)": FunctionFragment;
        "setRelayWindow(uint256)": FunctionFragment;
        "setTreasury(address)": FunctionFragment;
        "skimExcessFees()": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
        "treasury()": FunctionFragment;
        "virtualBalance()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "fullPoolSize" | "hubBridge" | "maxBundleFee" | "maxBundleFeeBPS" | "minPublicGoodsBps" | "owner" | "payFee" | "pendingFeeBatchSize" | "publicGoods" | "publicGoodsBps" | "relayWindow" | "renounceOwnership" | "setFullPoolSize" | "setMaxBundleFee" | "setMaxBundleFeeBPS" | "setPendingFeeBatchSize" | "setPublicGoods" | "setPublicGoodsBps" | "setRelayWindow" | "setTreasury" | "skimExcessFees" | "transferOwnership" | "treasury" | "virtualBalance"): FunctionFragment;
    encodeFunctionData(functionFragment: "fullPoolSize", values?: undefined): string;
    encodeFunctionData(functionFragment: "hubBridge", values?: undefined): string;
    encodeFunctionData(functionFragment: "maxBundleFee", values?: undefined): string;
    encodeFunctionData(functionFragment: "maxBundleFeeBPS", values?: undefined): string;
    encodeFunctionData(functionFragment: "minPublicGoodsBps", values?: undefined): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "payFee", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "pendingFeeBatchSize", values?: undefined): string;
    encodeFunctionData(functionFragment: "publicGoods", values?: undefined): string;
    encodeFunctionData(functionFragment: "publicGoodsBps", values?: undefined): string;
    encodeFunctionData(functionFragment: "relayWindow", values?: undefined): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "setFullPoolSize", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setMaxBundleFee", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setMaxBundleFeeBPS", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setPendingFeeBatchSize", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setPublicGoods", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "setPublicGoodsBps", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setRelayWindow", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setTreasury", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "skimExcessFees", values?: undefined): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "treasury", values?: undefined): string;
    encodeFunctionData(functionFragment: "virtualBalance", values?: undefined): string;
    decodeFunctionResult(functionFragment: "fullPoolSize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hubBridge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "maxBundleFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "maxBundleFeeBPS", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "minPublicGoodsBps", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "payFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pendingFeeBatchSize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "publicGoods", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "publicGoodsBps", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "relayWindow", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setFullPoolSize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setMaxBundleFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setMaxBundleFeeBPS", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setPendingFeeBatchSize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setPublicGoods", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setPublicGoodsBps", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setRelayWindow", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setTreasury", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "skimExcessFees", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "treasury", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "virtualBalance", data: BytesLike): Result;
    events: {
        "ExcessFeesSkimmed(uint256,uint256)": EventFragment;
        "FeePaid(address,uint256,uint256)": EventFragment;
        "FullPoolSizeSet(uint256)": EventFragment;
        "MaxBundleFeeBPSSet(uint256)": EventFragment;
        "MaxBundleFeeSet(uint256)": EventFragment;
        "OwnershipTransferred(address,address)": EventFragment;
        "PendingFeeBatchSizeSet(uint256)": EventFragment;
        "PublicGoodsBpsSet(uint256)": EventFragment;
        "PublicGoodsSet(address)": EventFragment;
        "RelayWindowSet(uint256)": EventFragment;
        "TreasurySet(address)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "ExcessFeesSkimmed"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "FeePaid"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "FullPoolSizeSet"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "MaxBundleFeeBPSSet"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "MaxBundleFeeSet"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "PendingFeeBatchSizeSet"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "PublicGoodsBpsSet"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "PublicGoodsSet"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "RelayWindowSet"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "TreasurySet"): EventFragment;
}
export interface ExcessFeesSkimmedEventObject {
    publicGoodsAmount: BigNumber;
    treasuryAmount: BigNumber;
}
export type ExcessFeesSkimmedEvent = TypedEvent<[
    BigNumber,
    BigNumber
], ExcessFeesSkimmedEventObject>;
export type ExcessFeesSkimmedEventFilter = TypedEventFilter<ExcessFeesSkimmedEvent>;
export interface FeePaidEventObject {
    to: string;
    amount: BigNumber;
    feesCollected: BigNumber;
}
export type FeePaidEvent = TypedEvent<[
    string,
    BigNumber,
    BigNumber
], FeePaidEventObject>;
export type FeePaidEventFilter = TypedEventFilter<FeePaidEvent>;
export interface FullPoolSizeSetEventObject {
    fullPoolSize: BigNumber;
}
export type FullPoolSizeSetEvent = TypedEvent<[
    BigNumber
], FullPoolSizeSetEventObject>;
export type FullPoolSizeSetEventFilter = TypedEventFilter<FullPoolSizeSetEvent>;
export interface MaxBundleFeeBPSSetEventObject {
    maxBundleFeeBPS: BigNumber;
}
export type MaxBundleFeeBPSSetEvent = TypedEvent<[
    BigNumber
], MaxBundleFeeBPSSetEventObject>;
export type MaxBundleFeeBPSSetEventFilter = TypedEventFilter<MaxBundleFeeBPSSetEvent>;
export interface MaxBundleFeeSetEventObject {
    maxBundleFee: BigNumber;
}
export type MaxBundleFeeSetEvent = TypedEvent<[
    BigNumber
], MaxBundleFeeSetEventObject>;
export type MaxBundleFeeSetEventFilter = TypedEventFilter<MaxBundleFeeSetEvent>;
export interface OwnershipTransferredEventObject {
    previousOwner: string;
    newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<[
    string,
    string
], OwnershipTransferredEventObject>;
export type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;
export interface PendingFeeBatchSizeSetEventObject {
    pendingFeeBatchSize: BigNumber;
}
export type PendingFeeBatchSizeSetEvent = TypedEvent<[
    BigNumber
], PendingFeeBatchSizeSetEventObject>;
export type PendingFeeBatchSizeSetEventFilter = TypedEventFilter<PendingFeeBatchSizeSetEvent>;
export interface PublicGoodsBpsSetEventObject {
    publicGoodsBps: BigNumber;
}
export type PublicGoodsBpsSetEvent = TypedEvent<[
    BigNumber
], PublicGoodsBpsSetEventObject>;
export type PublicGoodsBpsSetEventFilter = TypedEventFilter<PublicGoodsBpsSetEvent>;
export interface PublicGoodsSetEventObject {
    publicGoods: string;
}
export type PublicGoodsSetEvent = TypedEvent<[
    string
], PublicGoodsSetEventObject>;
export type PublicGoodsSetEventFilter = TypedEventFilter<PublicGoodsSetEvent>;
export interface RelayWindowSetEventObject {
    relayWindow: BigNumber;
}
export type RelayWindowSetEvent = TypedEvent<[
    BigNumber
], RelayWindowSetEventObject>;
export type RelayWindowSetEventFilter = TypedEventFilter<RelayWindowSetEvent>;
export interface TreasurySetEventObject {
    treasury: string;
}
export type TreasurySetEvent = TypedEvent<[string], TreasurySetEventObject>;
export type TreasurySetEventFilter = TypedEventFilter<TreasurySetEvent>;
export interface FeeDistributor extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: FeeDistributorInterface;
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
        fullPoolSize(overrides?: CallOverrides): Promise<[BigNumber]>;
        hubBridge(overrides?: CallOverrides): Promise<[string]>;
        maxBundleFee(overrides?: CallOverrides): Promise<[BigNumber]>;
        maxBundleFeeBPS(overrides?: CallOverrides): Promise<[BigNumber]>;
        minPublicGoodsBps(overrides?: CallOverrides): Promise<[BigNumber]>;
        owner(overrides?: CallOverrides): Promise<[string]>;
        payFee(to: PromiseOrValue<string>, relayWindowStart: PromiseOrValue<BigNumberish>, feesCollected: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        pendingFeeBatchSize(overrides?: CallOverrides): Promise<[BigNumber]>;
        publicGoods(overrides?: CallOverrides): Promise<[string]>;
        publicGoodsBps(overrides?: CallOverrides): Promise<[BigNumber]>;
        relayWindow(overrides?: CallOverrides): Promise<[BigNumber]>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setFullPoolSize(_fullPoolSize: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setMaxBundleFee(_maxBundleFee: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setMaxBundleFeeBPS(_maxBundleFeeBPS: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setPendingFeeBatchSize(_pendingFeeBatchSize: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setPublicGoods(_publicGoods: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setPublicGoodsBps(_publicGoodsBps: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setRelayWindow(_relayWindow: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setTreasury(_treasury: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        skimExcessFees(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        treasury(overrides?: CallOverrides): Promise<[string]>;
        virtualBalance(overrides?: CallOverrides): Promise<[BigNumber]>;
    };
    fullPoolSize(overrides?: CallOverrides): Promise<BigNumber>;
    hubBridge(overrides?: CallOverrides): Promise<string>;
    maxBundleFee(overrides?: CallOverrides): Promise<BigNumber>;
    maxBundleFeeBPS(overrides?: CallOverrides): Promise<BigNumber>;
    minPublicGoodsBps(overrides?: CallOverrides): Promise<BigNumber>;
    owner(overrides?: CallOverrides): Promise<string>;
    payFee(to: PromiseOrValue<string>, relayWindowStart: PromiseOrValue<BigNumberish>, feesCollected: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    pendingFeeBatchSize(overrides?: CallOverrides): Promise<BigNumber>;
    publicGoods(overrides?: CallOverrides): Promise<string>;
    publicGoodsBps(overrides?: CallOverrides): Promise<BigNumber>;
    relayWindow(overrides?: CallOverrides): Promise<BigNumber>;
    renounceOwnership(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setFullPoolSize(_fullPoolSize: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setMaxBundleFee(_maxBundleFee: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setMaxBundleFeeBPS(_maxBundleFeeBPS: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setPendingFeeBatchSize(_pendingFeeBatchSize: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setPublicGoods(_publicGoods: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setPublicGoodsBps(_publicGoodsBps: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setRelayWindow(_relayWindow: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setTreasury(_treasury: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    skimExcessFees(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    treasury(overrides?: CallOverrides): Promise<string>;
    virtualBalance(overrides?: CallOverrides): Promise<BigNumber>;
    callStatic: {
        fullPoolSize(overrides?: CallOverrides): Promise<BigNumber>;
        hubBridge(overrides?: CallOverrides): Promise<string>;
        maxBundleFee(overrides?: CallOverrides): Promise<BigNumber>;
        maxBundleFeeBPS(overrides?: CallOverrides): Promise<BigNumber>;
        minPublicGoodsBps(overrides?: CallOverrides): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<string>;
        payFee(to: PromiseOrValue<string>, relayWindowStart: PromiseOrValue<BigNumberish>, feesCollected: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        pendingFeeBatchSize(overrides?: CallOverrides): Promise<BigNumber>;
        publicGoods(overrides?: CallOverrides): Promise<string>;
        publicGoodsBps(overrides?: CallOverrides): Promise<BigNumber>;
        relayWindow(overrides?: CallOverrides): Promise<BigNumber>;
        renounceOwnership(overrides?: CallOverrides): Promise<void>;
        setFullPoolSize(_fullPoolSize: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setMaxBundleFee(_maxBundleFee: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setMaxBundleFeeBPS(_maxBundleFeeBPS: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setPendingFeeBatchSize(_pendingFeeBatchSize: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setPublicGoods(_publicGoods: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setPublicGoodsBps(_publicGoodsBps: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setRelayWindow(_relayWindow: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setTreasury(_treasury: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        skimExcessFees(overrides?: CallOverrides): Promise<void>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        treasury(overrides?: CallOverrides): Promise<string>;
        virtualBalance(overrides?: CallOverrides): Promise<BigNumber>;
    };
    filters: {
        "ExcessFeesSkimmed(uint256,uint256)"(publicGoodsAmount?: null, treasuryAmount?: null): ExcessFeesSkimmedEventFilter;
        ExcessFeesSkimmed(publicGoodsAmount?: null, treasuryAmount?: null): ExcessFeesSkimmedEventFilter;
        "FeePaid(address,uint256,uint256)"(to?: PromiseOrValue<string> | null, amount?: null, feesCollected?: null): FeePaidEventFilter;
        FeePaid(to?: PromiseOrValue<string> | null, amount?: null, feesCollected?: null): FeePaidEventFilter;
        "FullPoolSizeSet(uint256)"(fullPoolSize?: null): FullPoolSizeSetEventFilter;
        FullPoolSizeSet(fullPoolSize?: null): FullPoolSizeSetEventFilter;
        "MaxBundleFeeBPSSet(uint256)"(maxBundleFeeBPS?: null): MaxBundleFeeBPSSetEventFilter;
        MaxBundleFeeBPSSet(maxBundleFeeBPS?: null): MaxBundleFeeBPSSetEventFilter;
        "MaxBundleFeeSet(uint256)"(maxBundleFee?: null): MaxBundleFeeSetEventFilter;
        MaxBundleFeeSet(maxBundleFee?: null): MaxBundleFeeSetEventFilter;
        "OwnershipTransferred(address,address)"(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        OwnershipTransferred(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        "PendingFeeBatchSizeSet(uint256)"(pendingFeeBatchSize?: null): PendingFeeBatchSizeSetEventFilter;
        PendingFeeBatchSizeSet(pendingFeeBatchSize?: null): PendingFeeBatchSizeSetEventFilter;
        "PublicGoodsBpsSet(uint256)"(publicGoodsBps?: null): PublicGoodsBpsSetEventFilter;
        PublicGoodsBpsSet(publicGoodsBps?: null): PublicGoodsBpsSetEventFilter;
        "PublicGoodsSet(address)"(publicGoods?: PromiseOrValue<string> | null): PublicGoodsSetEventFilter;
        PublicGoodsSet(publicGoods?: PromiseOrValue<string> | null): PublicGoodsSetEventFilter;
        "RelayWindowSet(uint256)"(relayWindow?: null): RelayWindowSetEventFilter;
        RelayWindowSet(relayWindow?: null): RelayWindowSetEventFilter;
        "TreasurySet(address)"(treasury?: PromiseOrValue<string> | null): TreasurySetEventFilter;
        TreasurySet(treasury?: PromiseOrValue<string> | null): TreasurySetEventFilter;
    };
    estimateGas: {
        fullPoolSize(overrides?: CallOverrides): Promise<BigNumber>;
        hubBridge(overrides?: CallOverrides): Promise<BigNumber>;
        maxBundleFee(overrides?: CallOverrides): Promise<BigNumber>;
        maxBundleFeeBPS(overrides?: CallOverrides): Promise<BigNumber>;
        minPublicGoodsBps(overrides?: CallOverrides): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<BigNumber>;
        payFee(to: PromiseOrValue<string>, relayWindowStart: PromiseOrValue<BigNumberish>, feesCollected: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        pendingFeeBatchSize(overrides?: CallOverrides): Promise<BigNumber>;
        publicGoods(overrides?: CallOverrides): Promise<BigNumber>;
        publicGoodsBps(overrides?: CallOverrides): Promise<BigNumber>;
        relayWindow(overrides?: CallOverrides): Promise<BigNumber>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setFullPoolSize(_fullPoolSize: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setMaxBundleFee(_maxBundleFee: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setMaxBundleFeeBPS(_maxBundleFeeBPS: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setPendingFeeBatchSize(_pendingFeeBatchSize: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setPublicGoods(_publicGoods: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setPublicGoodsBps(_publicGoodsBps: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setRelayWindow(_relayWindow: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setTreasury(_treasury: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        skimExcessFees(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        treasury(overrides?: CallOverrides): Promise<BigNumber>;
        virtualBalance(overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        fullPoolSize(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        hubBridge(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        maxBundleFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        maxBundleFeeBPS(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        minPublicGoodsBps(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        payFee(to: PromiseOrValue<string>, relayWindowStart: PromiseOrValue<BigNumberish>, feesCollected: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        pendingFeeBatchSize(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        publicGoods(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        publicGoodsBps(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        relayWindow(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setFullPoolSize(_fullPoolSize: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setMaxBundleFee(_maxBundleFee: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setMaxBundleFeeBPS(_maxBundleFeeBPS: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setPendingFeeBatchSize(_pendingFeeBatchSize: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setPublicGoods(_publicGoods: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setPublicGoodsBps(_publicGoodsBps: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setRelayWindow(_relayWindow: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setTreasury(_treasury: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        skimExcessFees(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        treasury(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        virtualBalance(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=FeeDistributor.d.ts.map