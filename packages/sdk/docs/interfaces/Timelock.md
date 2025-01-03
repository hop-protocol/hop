# Interface: Timelock

## Hierarchy

- `BaseContract`

  ↳ **`Timelock`**

## Table of contents

### Properties

- [callStatic](Timelock.md#callstatic)
- [estimateGas](Timelock.md#estimategas)
- [filters](Timelock.md#filters)
- [functions](Timelock.md#functions)
- [interface](Timelock.md#interface)
- [off](Timelock.md#off)
- [on](Timelock.md#on)
- [once](Timelock.md#once)
- [populateTransaction](Timelock.md#populatetransaction)
- [removeListener](Timelock.md#removelistener)

### Methods

- [GRACE\_PERIOD](Timelock.md#grace_period)
- [MAXIMUM\_DELAY](Timelock.md#maximum_delay)
- [MINIMUM\_DELAY](Timelock.md#minimum_delay)
- [acceptAdmin](Timelock.md#acceptadmin)
- [admin](Timelock.md#admin)
- [attach](Timelock.md#attach)
- [cancelTransaction](Timelock.md#canceltransaction)
- [connect](Timelock.md#connect)
- [delay](Timelock.md#delay)
- [deployed](Timelock.md#deployed)
- [executeTransaction](Timelock.md#executetransaction)
- [listeners](Timelock.md#listeners)
- [pendingAdmin](Timelock.md#pendingadmin)
- [queryFilter](Timelock.md#queryfilter)
- [queueTransaction](Timelock.md#queuetransaction)
- [queuedTransactions](Timelock.md#queuedtransactions)
- [removeAllListeners](Timelock.md#removealllisteners)
- [setDelay](Timelock.md#setdelay)
- [setPendingAdmin](Timelock.md#setpendingadmin)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `GRACE_PERIOD` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `MAXIMUM_DELAY` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `MINIMUM_DELAY` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `acceptAdmin` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `admin` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `cancelTransaction` | (`target`: `PromiseOrValue`\<`string`\>, `value`: `PromiseOrValue`\<`BigNumberish`\>, `signature`: `PromiseOrValue`\<`string`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `eta`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `delay` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `executeTransaction` | (`target`: `PromiseOrValue`\<`string`\>, `value`: `PromiseOrValue`\<`BigNumberish`\>, `signature`: `PromiseOrValue`\<`string`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `eta`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `pendingAdmin` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `queueTransaction` | (`target`: `PromiseOrValue`\<`string`\>, `value`: `PromiseOrValue`\<`BigNumberish`\>, `signature`: `PromiseOrValue`\<`string`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `eta`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `queuedTransactions` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `setDelay` | (`delay_`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setPendingAdmin` | (`pendingAdmin_`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `GRACE_PERIOD` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `MAXIMUM_DELAY` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `MINIMUM_DELAY` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `acceptAdmin` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `admin` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `cancelTransaction` | (`target`: `PromiseOrValue`\<`string`\>, `value`: `PromiseOrValue`\<`BigNumberish`\>, `signature`: `PromiseOrValue`\<`string`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `eta`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `delay` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `executeTransaction` | (`target`: `PromiseOrValue`\<`string`\>, `value`: `PromiseOrValue`\<`BigNumberish`\>, `signature`: `PromiseOrValue`\<`string`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `eta`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `pendingAdmin` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `queueTransaction` | (`target`: `PromiseOrValue`\<`string`\>, `value`: `PromiseOrValue`\<`BigNumberish`\>, `signature`: `PromiseOrValue`\<`string`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `eta`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `queuedTransactions` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `setDelay` | (`delay_`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setPendingAdmin` | (`pendingAdmin_`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CancelTransaction` | (`txHash?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `target?`: ``null`` \| `PromiseOrValue`\<`string`\>, `value?`: ``null``, `signature?`: ``null``, `data?`: ``null``, `eta?`: ``null``) => `CancelTransactionEventFilter` |
| `CancelTransaction(bytes32,address,uint256,string,bytes,uint256)` | (`txHash?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `target?`: ``null`` \| `PromiseOrValue`\<`string`\>, `value?`: ``null``, `signature?`: ``null``, `data?`: ``null``, `eta?`: ``null``) => `CancelTransactionEventFilter` |
| `ExecuteTransaction` | (`txHash?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `target?`: ``null`` \| `PromiseOrValue`\<`string`\>, `value?`: ``null``, `signature?`: ``null``, `data?`: ``null``, `eta?`: ``null``) => `ExecuteTransactionEventFilter` |
| `ExecuteTransaction(bytes32,address,uint256,string,bytes,uint256)` | (`txHash?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `target?`: ``null`` \| `PromiseOrValue`\<`string`\>, `value?`: ``null``, `signature?`: ``null``, `data?`: ``null``, `eta?`: ``null``) => `ExecuteTransactionEventFilter` |
| `NewAdmin` | (`newAdmin?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `NewAdminEventFilter` |
| `NewAdmin(address)` | (`newAdmin?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `NewAdminEventFilter` |
| `NewDelay` | (`newDelay?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>) => `NewDelayEventFilter` |
| `NewDelay(uint256)` | (`newDelay?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>) => `NewDelayEventFilter` |
| `NewPendingAdmin` | (`newPendingAdmin?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `NewPendingAdminEventFilter` |
| `NewPendingAdmin(address)` | (`newPendingAdmin?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `NewPendingAdminEventFilter` |
| `QueueTransaction` | (`txHash?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `target?`: ``null`` \| `PromiseOrValue`\<`string`\>, `value?`: ``null``, `signature?`: ``null``, `data?`: ``null``, `eta?`: ``null``) => `QueueTransactionEventFilter` |
| `QueueTransaction(bytes32,address,uint256,string,bytes,uint256)` | (`txHash?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `target?`: ``null`` \| `PromiseOrValue`\<`string`\>, `value?`: ``null``, `signature?`: ``null``, `data?`: ``null``, `eta?`: ``null``) => `QueueTransactionEventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `GRACE_PERIOD` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `MAXIMUM_DELAY` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `MINIMUM_DELAY` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `acceptAdmin` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `admin` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `cancelTransaction` | (`target`: `PromiseOrValue`\<`string`\>, `value`: `PromiseOrValue`\<`BigNumberish`\>, `signature`: `PromiseOrValue`\<`string`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `eta`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `delay` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `executeTransaction` | (`target`: `PromiseOrValue`\<`string`\>, `value`: `PromiseOrValue`\<`BigNumberish`\>, `signature`: `PromiseOrValue`\<`string`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `eta`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `pendingAdmin` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `queueTransaction` | (`target`: `PromiseOrValue`\<`string`\>, `value`: `PromiseOrValue`\<`BigNumberish`\>, `signature`: `PromiseOrValue`\<`string`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `eta`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `queuedTransactions` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `setDelay` | (`delay_`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setPendingAdmin` | (`pendingAdmin_`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `TimelockInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`Timelock`](Timelock.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`Timelock`](Timelock.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`Timelock`](Timelock.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `GRACE_PERIOD` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `MAXIMUM_DELAY` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `MINIMUM_DELAY` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `acceptAdmin` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `admin` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `cancelTransaction` | (`target`: `PromiseOrValue`\<`string`\>, `value`: `PromiseOrValue`\<`BigNumberish`\>, `signature`: `PromiseOrValue`\<`string`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `eta`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `delay` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `executeTransaction` | (`target`: `PromiseOrValue`\<`string`\>, `value`: `PromiseOrValue`\<`BigNumberish`\>, `signature`: `PromiseOrValue`\<`string`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `eta`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `pendingAdmin` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `queueTransaction` | (`target`: `PromiseOrValue`\<`string`\>, `value`: `PromiseOrValue`\<`BigNumberish`\>, `signature`: `PromiseOrValue`\<`string`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `eta`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `queuedTransactions` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `setDelay` | (`delay_`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setPendingAdmin` | (`pendingAdmin_`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`Timelock`](Timelock.md)\>

#### Overrides

BaseContract.removeListener

## Methods

### <a id="grace_period" name="grace_period"></a> GRACE\_PERIOD

▸ **GRACE_PERIOD**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="maximum_delay" name="maximum_delay"></a> MAXIMUM\_DELAY

▸ **MAXIMUM_DELAY**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="minimum_delay" name="minimum_delay"></a> MINIMUM\_DELAY

▸ **MINIMUM_DELAY**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="acceptadmin" name="acceptadmin"></a> acceptAdmin

▸ **acceptAdmin**(`overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="admin" name="admin"></a> admin

▸ **admin**(`overrides?`): `Promise`\<`string`\>

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

### <a id="canceltransaction" name="canceltransaction"></a> cancelTransaction

▸ **cancelTransaction**(`target`, `value`, `signature`, `data`, `eta`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `PromiseOrValue`\<`string`\> |
| `value` | `PromiseOrValue`\<`BigNumberish`\> |
| `signature` | `PromiseOrValue`\<`string`\> |
| `data` | `PromiseOrValue`\<`BytesLike`\> |
| `eta` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

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

### <a id="delay" name="delay"></a> delay

▸ **delay**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="deployed" name="deployed"></a> deployed

▸ **deployed**(): `Promise`\<[`Timelock`](Timelock.md)\>

#### Returns

`Promise`\<[`Timelock`](Timelock.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="executetransaction" name="executetransaction"></a> executeTransaction

▸ **executeTransaction**(`target`, `value`, `signature`, `data`, `eta`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `PromiseOrValue`\<`string`\> |
| `value` | `PromiseOrValue`\<`BigNumberish`\> |
| `signature` | `PromiseOrValue`\<`string`\> |
| `data` | `PromiseOrValue`\<`BytesLike`\> |
| `eta` | `PromiseOrValue`\<`BigNumberish`\> |
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

### <a id="pendingadmin" name="pendingadmin"></a> pendingAdmin

▸ **pendingAdmin**(`overrides?`): `Promise`\<`string`\>

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

### <a id="queuetransaction" name="queuetransaction"></a> queueTransaction

▸ **queueTransaction**(`target`, `value`, `signature`, `data`, `eta`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `PromiseOrValue`\<`string`\> |
| `value` | `PromiseOrValue`\<`BigNumberish`\> |
| `signature` | `PromiseOrValue`\<`string`\> |
| `data` | `PromiseOrValue`\<`BytesLike`\> |
| `eta` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="queuedtransactions" name="queuedtransactions"></a> queuedTransactions

▸ **queuedTransactions**(`arg0`, `overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

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

### <a id="setdelay" name="setdelay"></a> setDelay

▸ **setDelay**(`delay_`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `delay_` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setpendingadmin" name="setpendingadmin"></a> setPendingAdmin

▸ **setPendingAdmin**(`pendingAdmin_`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `pendingAdmin_` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>
