# Interface: L2\_AmmWrapper

## Hierarchy

- `BaseContract`

  ↳ **`L2_AmmWrapper`**

## Table of contents

### Properties

- [callStatic](L2_AmmWrapper.md#callstatic)
- [estimateGas](L2_AmmWrapper.md#estimategas)
- [filters](L2_AmmWrapper.md#filters)
- [functions](L2_AmmWrapper.md#functions)
- [interface](L2_AmmWrapper.md#interface)
- [off](L2_AmmWrapper.md#off)
- [on](L2_AmmWrapper.md#on)
- [once](L2_AmmWrapper.md#once)
- [populateTransaction](L2_AmmWrapper.md#populatetransaction)
- [removeListener](L2_AmmWrapper.md#removelistener)

### Methods

- [attach](L2_AmmWrapper.md#attach)
- [attemptSwap](L2_AmmWrapper.md#attemptswap)
- [bridge](L2_AmmWrapper.md#bridge)
- [connect](L2_AmmWrapper.md#connect)
- [deployed](L2_AmmWrapper.md#deployed)
- [exchangeAddress](L2_AmmWrapper.md#exchangeaddress)
- [hToken](L2_AmmWrapper.md#htoken)
- [l2CanonicalToken](L2_AmmWrapper.md#l2canonicaltoken)
- [l2CanonicalTokenIsEth](L2_AmmWrapper.md#l2canonicaltokeniseth)
- [listeners](L2_AmmWrapper.md#listeners)
- [queryFilter](L2_AmmWrapper.md#queryfilter)
- [removeAllListeners](L2_AmmWrapper.md#removealllisteners)
- [swapAndSend](L2_AmmWrapper.md#swapandsend)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `attemptSwap` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `bridge` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `exchangeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `hToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `l2CanonicalToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `l2CanonicalTokenIsEth` | (`overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `swapAndSend` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `destinationAmountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `destinationDeadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `attemptSwap` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `bridge` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `exchangeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `hToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l2CanonicalToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l2CanonicalTokenIsEth` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `swapAndSend` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `destinationAmountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `destinationDeadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `attemptSwap` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `bridge` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `exchangeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `hToken` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `l2CanonicalToken` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `l2CanonicalTokenIsEth` | (`overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `swapAndSend` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `destinationAmountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `destinationDeadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `L2_AmmWrapperInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`L2_AmmWrapper`](L2_AmmWrapper.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`L2_AmmWrapper`](L2_AmmWrapper.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`L2_AmmWrapper`](L2_AmmWrapper.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `attemptSwap` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `bridge` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `exchangeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `hToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `l2CanonicalToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `l2CanonicalTokenIsEth` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `swapAndSend` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `destinationAmountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `destinationDeadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`L2_AmmWrapper`](L2_AmmWrapper.md)\>

#### Overrides

BaseContract.removeListener

## Methods

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

### <a id="attemptswap" name="attemptswap"></a> attemptSwap

▸ **attemptSwap**(`recipient`, `amount`, `amountOutMin`, `deadline`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `recipient` | `PromiseOrValue`\<`string`\> |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `amountOutMin` | `PromiseOrValue`\<`BigNumberish`\> |
| `deadline` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="bridge" name="bridge"></a> bridge

▸ **bridge**(`overrides?`): `Promise`\<`string`\>

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

▸ **deployed**(): `Promise`\<[`L2_AmmWrapper`](L2_AmmWrapper.md)\>

#### Returns

`Promise`\<[`L2_AmmWrapper`](L2_AmmWrapper.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="exchangeaddress" name="exchangeaddress"></a> exchangeAddress

▸ **exchangeAddress**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="htoken" name="htoken"></a> hToken

▸ **hToken**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="l2canonicaltoken" name="l2canonicaltoken"></a> l2CanonicalToken

▸ **l2CanonicalToken**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="l2canonicaltokeniseth" name="l2canonicaltokeniseth"></a> l2CanonicalTokenIsEth

▸ **l2CanonicalTokenIsEth**(`overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

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

### <a id="swapandsend" name="swapandsend"></a> swapAndSend

▸ **swapAndSend**(`chainId`, `recipient`, `amount`, `bonderFee`, `amountOutMin`, `deadline`, `destinationAmountOutMin`, `destinationDeadline`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `PromiseOrValue`\<`BigNumberish`\> |
| `recipient` | `PromiseOrValue`\<`string`\> |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `bonderFee` | `PromiseOrValue`\<`BigNumberish`\> |
| `amountOutMin` | `PromiseOrValue`\<`BigNumberish`\> |
| `deadline` | `PromiseOrValue`\<`BigNumberish`\> |
| `destinationAmountOutMin` | `PromiseOrValue`\<`BigNumberish`\> |
| `destinationDeadline` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>
