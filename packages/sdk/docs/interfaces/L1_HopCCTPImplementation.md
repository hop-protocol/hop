# Interface: L1\_HopCCTPImplementation

## Hierarchy

- `BaseContract`

  ↳ **`L1_HopCCTPImplementation`**

## Table of contents

### Properties

- [callStatic](L1_HopCCTPImplementation.md#callstatic)
- [estimateGas](L1_HopCCTPImplementation.md#estimategas)
- [filters](L1_HopCCTPImplementation.md#filters)
- [functions](L1_HopCCTPImplementation.md#functions)
- [interface](L1_HopCCTPImplementation.md#interface)
- [off](L1_HopCCTPImplementation.md#off)
- [on](L1_HopCCTPImplementation.md#on)
- [once](L1_HopCCTPImplementation.md#once)
- [populateTransaction](L1_HopCCTPImplementation.md#populatetransaction)
- [removeListener](L1_HopCCTPImplementation.md#removelistener)

### Methods

- [activeChainIds](L1_HopCCTPImplementation.md#activechainids)
- [attach](L1_HopCCTPImplementation.md#attach)
- [cctp](L1_HopCCTPImplementation.md#cctp)
- [connect](L1_HopCCTPImplementation.md#connect)
- [deployed](L1_HopCCTPImplementation.md#deployed)
- [destinationDomains](L1_HopCCTPImplementation.md#destinationdomains)
- [feeCollectorAddress](L1_HopCCTPImplementation.md#feecollectoraddress)
- [listeners](L1_HopCCTPImplementation.md#listeners)
- [minBonderFee](L1_HopCCTPImplementation.md#minbonderfee)
- [nativeToken](L1_HopCCTPImplementation.md#nativetoken)
- [queryFilter](L1_HopCCTPImplementation.md#queryfilter)
- [removeAllListeners](L1_HopCCTPImplementation.md#removealllisteners)
- [send](L1_HopCCTPImplementation.md#send)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `activeChainIds` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `cctp` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `destinationDomains` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`number`\> |
| `feeCollectorAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `minBonderFee` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `nativeToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `send` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `activeChainIds` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `cctp` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `destinationDomains` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `feeCollectorAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `minBonderFee` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `nativeToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `send` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

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
| `cctp` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `destinationDomains` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`number`]\> |
| `feeCollectorAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `minBonderFee` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `nativeToken` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `send` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `L1_HopCCTPImplementationInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`L1_HopCCTPImplementation`](L1_HopCCTPImplementation.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`L1_HopCCTPImplementation`](L1_HopCCTPImplementation.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`L1_HopCCTPImplementation`](L1_HopCCTPImplementation.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `activeChainIds` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `cctp` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `destinationDomains` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `feeCollectorAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `minBonderFee` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `nativeToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `send` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`L1_HopCCTPImplementation`](L1_HopCCTPImplementation.md)\>

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

▸ **deployed**(): `Promise`\<[`L1_HopCCTPImplementation`](L1_HopCCTPImplementation.md)\>

#### Returns

`Promise`\<[`L1_HopCCTPImplementation`](L1_HopCCTPImplementation.md)\>

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
