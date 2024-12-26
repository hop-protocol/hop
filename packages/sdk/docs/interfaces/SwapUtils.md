# Interface: SwapUtils

## Hierarchy

- `BaseContract`

  ↳ **`SwapUtils`**

## Table of contents

### Properties

- [callStatic](SwapUtils.md#callstatic)
- [estimateGas](SwapUtils.md#estimategas)
- [filters](SwapUtils.md#filters)
- [functions](SwapUtils.md#functions)
- [interface](SwapUtils.md#interface)
- [off](SwapUtils.md#off)
- [on](SwapUtils.md#on)
- [once](SwapUtils.md#once)
- [populateTransaction](SwapUtils.md#populatetransaction)
- [removeListener](SwapUtils.md#removelistener)

### Methods

- [A\_PRECISION](SwapUtils.md#a_precision)
- [MAX\_A](SwapUtils.md#max_a)
- [MAX\_ADMIN\_FEE](SwapUtils.md#max_admin_fee)
- [MAX\_SWAP\_FEE](SwapUtils.md#max_swap_fee)
- [MAX\_WITHDRAW\_FEE](SwapUtils.md#max_withdraw_fee)
- [POOL\_PRECISION\_DECIMALS](SwapUtils.md#pool_precision_decimals)
- [attach](SwapUtils.md#attach)
- [connect](SwapUtils.md#connect)
- [deployed](SwapUtils.md#deployed)
- [listeners](SwapUtils.md#listeners)
- [queryFilter](SwapUtils.md#queryfilter)
- [removeAllListeners](SwapUtils.md#removealllisteners)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `A_PRECISION` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `MAX_A` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `MAX_ADMIN_FEE` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `MAX_SWAP_FEE` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `MAX_WITHDRAW_FEE` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `POOL_PRECISION_DECIMALS` | (`overrides?`: `CallOverrides`) => `Promise`\<`number`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `A_PRECISION` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `MAX_A` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `MAX_ADMIN_FEE` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `MAX_SWAP_FEE` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `MAX_WITHDRAW_FEE` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `POOL_PRECISION_DECIMALS` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `AddLiquidity` | (`provider?`: ``null`` \| `PromiseOrValue`\<`string`\>, `tokenAmounts?`: ``null``, `fees?`: ``null``, `invariant?`: ``null``, `lpTokenSupply?`: ``null``) => `AddLiquidityEventFilter` |
| `AddLiquidity(address,uint256[],uint256[],uint256,uint256)` | (`provider?`: ``null`` \| `PromiseOrValue`\<`string`\>, `tokenAmounts?`: ``null``, `fees?`: ``null``, `invariant?`: ``null``, `lpTokenSupply?`: ``null``) => `AddLiquidityEventFilter` |
| `RemoveLiquidity` | (`provider?`: ``null`` \| `PromiseOrValue`\<`string`\>, `tokenAmounts?`: ``null``, `lpTokenSupply?`: ``null``) => `RemoveLiquidityEventFilter` |
| `RemoveLiquidity(address,uint256[],uint256)` | (`provider?`: ``null`` \| `PromiseOrValue`\<`string`\>, `tokenAmounts?`: ``null``, `lpTokenSupply?`: ``null``) => `RemoveLiquidityEventFilter` |
| `RemoveLiquidityImbalance` | (`provider?`: ``null`` \| `PromiseOrValue`\<`string`\>, `tokenAmounts?`: ``null``, `fees?`: ``null``, `invariant?`: ``null``, `lpTokenSupply?`: ``null``) => `RemoveLiquidityImbalanceEventFilter` |
| `RemoveLiquidityImbalance(address,uint256[],uint256[],uint256,uint256)` | (`provider?`: ``null`` \| `PromiseOrValue`\<`string`\>, `tokenAmounts?`: ``null``, `fees?`: ``null``, `invariant?`: ``null``, `lpTokenSupply?`: ``null``) => `RemoveLiquidityImbalanceEventFilter` |
| `RemoveLiquidityOne` | (`provider?`: ``null`` \| `PromiseOrValue`\<`string`\>, `lpTokenAmount?`: ``null``, `lpTokenSupply?`: ``null``, `boughtId?`: ``null``, `tokensBought?`: ``null``) => `RemoveLiquidityOneEventFilter` |
| `RemoveLiquidityOne(address,uint256,uint256,uint256,uint256)` | (`provider?`: ``null`` \| `PromiseOrValue`\<`string`\>, `lpTokenAmount?`: ``null``, `lpTokenSupply?`: ``null``, `boughtId?`: ``null``, `tokensBought?`: ``null``) => `RemoveLiquidityOneEventFilter` |
| `TokenSwap` | (`buyer?`: ``null`` \| `PromiseOrValue`\<`string`\>, `tokensSold?`: ``null``, `tokensBought?`: ``null``, `soldId?`: ``null``, `boughtId?`: ``null``) => `TokenSwapEventFilter` |
| `TokenSwap(address,uint256,uint256,uint128,uint128)` | (`buyer?`: ``null`` \| `PromiseOrValue`\<`string`\>, `tokensSold?`: ``null``, `tokensBought?`: ``null``, `soldId?`: ``null``, `boughtId?`: ``null``) => `TokenSwapEventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `A_PRECISION` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `MAX_A` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `MAX_ADMIN_FEE` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `MAX_SWAP_FEE` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `MAX_WITHDRAW_FEE` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `POOL_PRECISION_DECIMALS` | (`overrides?`: `CallOverrides`) => `Promise`\<[`number`]\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `SwapUtilsInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`SwapUtils`](SwapUtils.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`SwapUtils`](SwapUtils.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`SwapUtils`](SwapUtils.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `A_PRECISION` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `MAX_A` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `MAX_ADMIN_FEE` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `MAX_SWAP_FEE` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `MAX_WITHDRAW_FEE` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `POOL_PRECISION_DECIMALS` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`SwapUtils`](SwapUtils.md)\>

#### Overrides

BaseContract.removeListener

## Methods

### <a id="a_precision" name="a_precision"></a> A\_PRECISION

▸ **A_PRECISION**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="max_a" name="max_a"></a> MAX\_A

▸ **MAX_A**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="max_admin_fee" name="max_admin_fee"></a> MAX\_ADMIN\_FEE

▸ **MAX_ADMIN_FEE**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="max_swap_fee" name="max_swap_fee"></a> MAX\_SWAP\_FEE

▸ **MAX_SWAP_FEE**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="max_withdraw_fee" name="max_withdraw_fee"></a> MAX\_WITHDRAW\_FEE

▸ **MAX_WITHDRAW_FEE**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="pool_precision_decimals" name="pool_precision_decimals"></a> POOL\_PRECISION\_DECIMALS

▸ **POOL_PRECISION_DECIMALS**(`overrides?`): `Promise`\<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`number`\>

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

▸ **deployed**(): `Promise`\<[`SwapUtils`](SwapUtils.md)\>

#### Returns

`Promise`\<[`SwapUtils`](SwapUtils.md)\>

#### Overrides

BaseContract.deployed

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
