# Interface: L2\_HopCCTPImplementation

## Hierarchy

- `BaseContract`

  ↳ **`L2_HopCCTPImplementation`**

## Table of contents

### Properties

- [callStatic](L2_HopCCTPImplementation.md#callstatic)
- [estimateGas](L2_HopCCTPImplementation.md#estimategas)
- [filters](L2_HopCCTPImplementation.md#filters)
- [functions](L2_HopCCTPImplementation.md#functions)
- [interface](L2_HopCCTPImplementation.md#interface)
- [off](L2_HopCCTPImplementation.md#off)
- [on](L2_HopCCTPImplementation.md#on)
- [once](L2_HopCCTPImplementation.md#once)
- [populateTransaction](L2_HopCCTPImplementation.md#populatetransaction)
- [removeListener](L2_HopCCTPImplementation.md#removelistener)

### Methods

- [activeChainIds](L2_HopCCTPImplementation.md#activechainids)
- [amm](L2_HopCCTPImplementation.md#amm)
- [attach](L2_HopCCTPImplementation.md#attach)
- [bridgedToken](L2_HopCCTPImplementation.md#bridgedtoken)
- [cctp](L2_HopCCTPImplementation.md#cctp)
- [connect](L2_HopCCTPImplementation.md#connect)
- [deployed](L2_HopCCTPImplementation.md#deployed)
- [destinationDomains](L2_HopCCTPImplementation.md#destinationdomains)
- [feeCollectorAddress](L2_HopCCTPImplementation.md#feecollectoraddress)
- [listeners](L2_HopCCTPImplementation.md#listeners)
- [minBonderFee](L2_HopCCTPImplementation.md#minbonderfee)
- [nativeToken](L2_HopCCTPImplementation.md#nativetoken)
- [queryFilter](L2_HopCCTPImplementation.md#queryfilter)
- [removeAllListeners](L2_HopCCTPImplementation.md#removealllisteners)
- [send](L2_HopCCTPImplementation.md#send)
- [swapAndSend](L2_HopCCTPImplementation.md#swapandsend)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `activeChainIds` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `amm` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `bridgedToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `cctp` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `destinationDomains` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`number`\> |
| `feeCollectorAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `minBonderFee` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `nativeToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `send` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `swapAndSend` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `swapParams`: `ExactInputParamsStruct`, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `activeChainIds` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `amm` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `bridgedToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `cctp` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `destinationDomains` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `feeCollectorAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `minBonderFee` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `nativeToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `send` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `swapAndSend` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `swapParams`: `ExactInputParamsStruct`, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CCTPTransferSent` | (`cctpNonce?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `chainId?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `recipient?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``, `bonderFee?`: ``null``) => `CCTPTransferSentEventFilter` |
| `CCTPTransferSent(uint64,uint256,address,uint256,uint256)` | (`cctpNonce?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `chainId?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `recipient?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``, `bonderFee?`: ``null``) => `CCTPTransferSentEventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `activeChainIds` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `amm` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `bridgedToken` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `cctp` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `destinationDomains` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`number`]\> |
| `feeCollectorAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `minBonderFee` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `nativeToken` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `send` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `swapAndSend` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `swapParams`: `ExactInputParamsStruct`, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `L2_HopCCTPImplementationInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`L2_HopCCTPImplementation`](L2_HopCCTPImplementation.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`L2_HopCCTPImplementation`](L2_HopCCTPImplementation.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`L2_HopCCTPImplementation`](L2_HopCCTPImplementation.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `activeChainIds` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `amm` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `bridgedToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `cctp` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `destinationDomains` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `feeCollectorAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `minBonderFee` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `nativeToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `send` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `swapAndSend` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `swapParams`: `ExactInputParamsStruct`, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`L2_HopCCTPImplementation`](L2_HopCCTPImplementation.md)\>

#### Overrides

BaseContract.removeListener

## Methods

### <a id="activechainids" name="activechainids"></a> activeChainIds

▸ **activeChainIds**(`arg0`, `overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="amm" name="amm"></a> amm

▸ **amm**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="attach" name="attach"></a> attach

▸ **attach**(`addressOrName`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `addressOrName` | `string` |

#### Returns

`this`

#### Overrides

BaseContract.attach

___

### <a id="bridgedtoken" name="bridgedtoken"></a> bridgedToken

▸ **bridgedToken**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="cctp" name="cctp"></a> cctp

▸ **cctp**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="connect" name="connect"></a> connect

▸ **connect**(`signerOrProvider`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `signerOrProvider` | `string` \| `Provider` \| `Signer` |

#### Returns

`this`

#### Overrides

BaseContract.connect

___

### <a id="deployed" name="deployed"></a> deployed

▸ **deployed**(): `Promise`\<[`L2_HopCCTPImplementation`](L2_HopCCTPImplementation.md)\>

#### Returns

`Promise`\<[`L2_HopCCTPImplementation`](L2_HopCCTPImplementation.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="destinationdomains" name="destinationdomains"></a> destinationDomains

▸ **destinationDomains**(`arg0`, `overrides?`): `Promise`\<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`number`\>

___

### <a id="feecollectoraddress" name="feecollectoraddress"></a> feeCollectorAddress

▸ **feeCollectorAddress**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="listeners" name="listeners"></a> listeners

▸ **listeners**\<`TEvent`\>(`eventFilter?`): `TypedListener`\<`TEvent`\>[]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEvent` | extends `TypedEvent`\<`any`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventFilter?` | `TypedEventFilter`\<`TEvent`\> |

#### Returns

`TypedListener`\<`TEvent`\>[]

#### Overrides

BaseContract.listeners

▸ **listeners**(`eventName?`): `Listener`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName?` | `string` |

#### Returns

`Listener`[]

#### Overrides

BaseContract.listeners

___

### <a id="minbonderfee" name="minbonderfee"></a> minBonderFee

▸ **minBonderFee**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="nativetoken" name="nativetoken"></a> nativeToken

▸ **nativeToken**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="queryfilter" name="queryfilter"></a> queryFilter

▸ **queryFilter**\<`TEvent`\>(`event`, `fromBlockOrBlockhash?`, `toBlock?`): `Promise`\<`TEvent`[]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEvent` | extends `TypedEvent`\<`any`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `TypedEventFilter`\<`TEvent`\> |
| `fromBlockOrBlockhash?` | `string` \| `number` |
| `toBlock?` | `string` \| `number` |

#### Returns

`Promise`\<`TEvent`[]\>

#### Overrides

BaseContract.queryFilter

___

### <a id="removealllisteners" name="removealllisteners"></a> removeAllListeners

▸ **removeAllListeners**\<`TEvent`\>(`eventFilter`): `this`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEvent` | extends `TypedEvent`\<`any`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventFilter` | `TypedEventFilter`\<`TEvent`\> |

#### Returns

`this`

#### Overrides

BaseContract.removeAllListeners

▸ **removeAllListeners**(`eventName?`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName?` | `string` |

#### Returns

`this`

#### Overrides

BaseContract.removeAllListeners

___

### <a id="send" name="send"></a> send

▸ **send**(`chainId`, `recipient`, `amount`, `bonderFee`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `PromiseOrValue`\<`BigNumberish`\> |
| `recipient` | `PromiseOrValue`\<`string`\> |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `bonderFee` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="swapandsend" name="swapandsend"></a> swapAndSend

▸ **swapAndSend**(`chainId`, `recipient`, `amount`, `bonderFee`, `swapParams`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `PromiseOrValue`\<`BigNumberish`\> |
| `recipient` | `PromiseOrValue`\<`string`\> |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `bonderFee` | `PromiseOrValue`\<`BigNumberish`\> |
| `swapParams` | `ExactInputParamsStruct` |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>
