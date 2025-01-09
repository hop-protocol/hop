# Interface: WETH9

## Hierarchy

- `BaseContract`

  ↳ **`WETH9`**

## Table of contents

### Properties

- [callStatic](WETH9.md#callstatic)
- [estimateGas](WETH9.md#estimategas)
- [filters](WETH9.md#filters)
- [functions](WETH9.md#functions)
- [interface](WETH9.md#interface)
- [off](WETH9.md#off)
- [on](WETH9.md#on)
- [once](WETH9.md#once)
- [populateTransaction](WETH9.md#populatetransaction)
- [removeListener](WETH9.md#removelistener)

### Methods

- [allowance](WETH9.md#allowance)
- [approve](WETH9.md#approve)
- [attach](WETH9.md#attach)
- [balanceOf](WETH9.md#balanceof)
- [connect](WETH9.md#connect)
- [decimals](WETH9.md#decimals)
- [deployed](WETH9.md#deployed)
- [deposit](WETH9.md#deposit)
- [listeners](WETH9.md#listeners)
- [name](WETH9.md#name)
- [queryFilter](WETH9.md#queryfilter)
- [removeAllListeners](WETH9.md#removealllisteners)
- [symbol](WETH9.md#symbol)
- [totalSupply](WETH9.md#totalsupply)
- [transfer](WETH9.md#transfer)
- [transferFrom](WETH9.md#transferfrom)
- [withdraw](WETH9.md#withdraw)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `allowance` | (`arg0`: `PromiseOrValue`\<`string`\>, `arg1`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `approve` | (`guy`: `PromiseOrValue`\<`string`\>, `wad`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `balanceOf` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `decimals` | (`overrides?`: `CallOverrides`) => `Promise`\<`number`\> |
| `deposit` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `name` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `symbol` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `totalSupply` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `transfer` | (`dst`: `PromiseOrValue`\<`string`\>, `wad`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `transferFrom` | (`src`: `PromiseOrValue`\<`string`\>, `dst`: `PromiseOrValue`\<`string`\>, `wad`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `withdraw` | (`wad`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `allowance` | (`arg0`: `PromiseOrValue`\<`string`\>, `arg1`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `approve` | (`guy`: `PromiseOrValue`\<`string`\>, `wad`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `balanceOf` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `decimals` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `deposit` | (`overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `name` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `symbol` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `totalSupply` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `transfer` | (`dst`: `PromiseOrValue`\<`string`\>, `wad`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `transferFrom` | (`src`: `PromiseOrValue`\<`string`\>, `dst`: `PromiseOrValue`\<`string`\>, `wad`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `withdraw` | (`wad`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Approval` | (`src?`: ``null`` \| `PromiseOrValue`\<`string`\>, `guy?`: ``null`` \| `PromiseOrValue`\<`string`\>, `wad?`: ``null``) => `ApprovalEventFilter` |
| `Approval(address,address,uint256)` | (`src?`: ``null`` \| `PromiseOrValue`\<`string`\>, `guy?`: ``null`` \| `PromiseOrValue`\<`string`\>, `wad?`: ``null``) => `ApprovalEventFilter` |
| `Deposit` | (`dst?`: ``null`` \| `PromiseOrValue`\<`string`\>, `wad?`: ``null``) => `DepositEventFilter` |
| `Deposit(address,uint256)` | (`dst?`: ``null`` \| `PromiseOrValue`\<`string`\>, `wad?`: ``null``) => `DepositEventFilter` |
| `Transfer` | (`src?`: ``null`` \| `PromiseOrValue`\<`string`\>, `dst?`: ``null`` \| `PromiseOrValue`\<`string`\>, `wad?`: ``null``) => `TransferEventFilter` |
| `Transfer(address,address,uint256)` | (`src?`: ``null`` \| `PromiseOrValue`\<`string`\>, `dst?`: ``null`` \| `PromiseOrValue`\<`string`\>, `wad?`: ``null``) => `TransferEventFilter` |
| `Withdrawal` | (`src?`: ``null`` \| `PromiseOrValue`\<`string`\>, `wad?`: ``null``) => `WithdrawalEventFilter` |
| `Withdrawal(address,uint256)` | (`src?`: ``null`` \| `PromiseOrValue`\<`string`\>, `wad?`: ``null``) => `WithdrawalEventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `allowance` | (`arg0`: `PromiseOrValue`\<`string`\>, `arg1`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `approve` | (`guy`: `PromiseOrValue`\<`string`\>, `wad`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `balanceOf` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `decimals` | (`overrides?`: `CallOverrides`) => `Promise`\<[`number`]\> |
| `deposit` | (`overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `name` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `symbol` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `totalSupply` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `transfer` | (`dst`: `PromiseOrValue`\<`string`\>, `wad`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `transferFrom` | (`src`: `PromiseOrValue`\<`string`\>, `dst`: `PromiseOrValue`\<`string`\>, `wad`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `withdraw` | (`wad`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `WETH9Interface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`WETH9`](WETH9.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`WETH9`](WETH9.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`WETH9`](WETH9.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `allowance` | (`arg0`: `PromiseOrValue`\<`string`\>, `arg1`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `approve` | (`guy`: `PromiseOrValue`\<`string`\>, `wad`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `balanceOf` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `decimals` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `deposit` | (`overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `name` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `symbol` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `totalSupply` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `transfer` | (`dst`: `PromiseOrValue`\<`string`\>, `wad`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `transferFrom` | (`src`: `PromiseOrValue`\<`string`\>, `dst`: `PromiseOrValue`\<`string`\>, `wad`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `withdraw` | (`wad`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`WETH9`](WETH9.md)\>

#### Overrides

BaseContract.removeListener

## Methods

### <a id="allowance" name="allowance"></a> allowance

▸ **allowance**(`arg0`, `arg1`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`string`\> |
| `arg1` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="approve" name="approve"></a> approve

▸ **approve**(`guy`, `wad`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `guy` | `PromiseOrValue`\<`string`\> |
| `wad` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

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

### <a id="balanceof" name="balanceof"></a> balanceOf

▸ **balanceOf**(`arg0`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

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

### <a id="decimals" name="decimals"></a> decimals

▸ **decimals**(`overrides?`): `Promise`\<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`number`\>

___

### <a id="deployed" name="deployed"></a> deployed

▸ **deployed**(): `Promise`\<[`WETH9`](WETH9.md)\>

#### Returns

`Promise`\<[`WETH9`](WETH9.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="deposit" name="deposit"></a> deposit

▸ **deposit**(`overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

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

### <a id="name" name="name"></a> name

▸ **name**(`overrides?`): `Promise`\<`string`\>

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

### <a id="symbol" name="symbol"></a> symbol

▸ **symbol**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="totalsupply" name="totalsupply"></a> totalSupply

▸ **totalSupply**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="transfer" name="transfer"></a> transfer

▸ **transfer**(`dst`, `wad`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `dst` | `PromiseOrValue`\<`string`\> |
| `wad` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="transferfrom" name="transferfrom"></a> transferFrom

▸ **transferFrom**(`src`, `dst`, `wad`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `src` | `PromiseOrValue`\<`string`\> |
| `dst` | `PromiseOrValue`\<`string`\> |
| `wad` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="withdraw" name="withdraw"></a> withdraw

▸ **withdraw**(`wad`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `wad` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>
