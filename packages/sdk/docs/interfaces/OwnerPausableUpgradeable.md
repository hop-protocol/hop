# Interface: OwnerPausableUpgradeable

## Hierarchy

- `BaseContract`

  ↳ **`OwnerPausableUpgradeable`**

## Table of contents

### Properties

- [callStatic](OwnerPausableUpgradeable.md#callstatic)
- [estimateGas](OwnerPausableUpgradeable.md#estimategas)
- [filters](OwnerPausableUpgradeable.md#filters)
- [functions](OwnerPausableUpgradeable.md#functions)
- [interface](OwnerPausableUpgradeable.md#interface)
- [off](OwnerPausableUpgradeable.md#off)
- [on](OwnerPausableUpgradeable.md#on)
- [once](OwnerPausableUpgradeable.md#once)
- [populateTransaction](OwnerPausableUpgradeable.md#populatetransaction)
- [removeListener](OwnerPausableUpgradeable.md#removelistener)

### Methods

- [attach](OwnerPausableUpgradeable.md#attach)
- [connect](OwnerPausableUpgradeable.md#connect)
- [deployed](OwnerPausableUpgradeable.md#deployed)
- [listeners](OwnerPausableUpgradeable.md#listeners)
- [owner](OwnerPausableUpgradeable.md#owner)
- [pause](OwnerPausableUpgradeable.md#pause)
- [paused](OwnerPausableUpgradeable.md#paused)
- [queryFilter](OwnerPausableUpgradeable.md#queryfilter)
- [removeAllListeners](OwnerPausableUpgradeable.md#removealllisteners)
- [renounceOwnership](OwnerPausableUpgradeable.md#renounceownership)
- [transferOwnership](OwnerPausableUpgradeable.md#transferownership)
- [unpause](OwnerPausableUpgradeable.md#unpause)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `pause` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `paused` | (`overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `renounceOwnership` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `unpause` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `pause` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `paused` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `renounceOwnership` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `unpause` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `OwnershipTransferred` | (`previousOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>, `newOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `OwnershipTransferredEventFilter` |
| `OwnershipTransferred(address,address)` | (`previousOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>, `newOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `OwnershipTransferredEventFilter` |
| `Paused` | (`account?`: ``null``) => `PausedEventFilter` |
| `Paused(address)` | (`account?`: ``null``) => `PausedEventFilter` |
| `Unpaused` | (`account?`: ``null``) => `UnpausedEventFilter` |
| `Unpaused(address)` | (`account?`: ``null``) => `UnpausedEventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `pause` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `paused` | (`overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `renounceOwnership` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `unpause` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `OwnerPausableUpgradeableInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`OwnerPausableUpgradeable`](OwnerPausableUpgradeable.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`OwnerPausableUpgradeable`](OwnerPausableUpgradeable.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`OwnerPausableUpgradeable`](OwnerPausableUpgradeable.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `pause` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `paused` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `renounceOwnership` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `unpause` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`OwnerPausableUpgradeable`](OwnerPausableUpgradeable.md)\>

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

▸ **deployed**(): `Promise`\<[`OwnerPausableUpgradeable`](OwnerPausableUpgradeable.md)\>

#### Returns

`Promise`\<[`OwnerPausableUpgradeable`](OwnerPausableUpgradeable.md)\>

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

### <a id="owner" name="owner"></a> owner

▸ **owner**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="pause" name="pause"></a> pause

▸ **pause**(`overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="paused" name="paused"></a> paused

▸ **paused**(`overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

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

### <a id="renounceownership" name="renounceownership"></a> renounceOwnership

▸ **renounceOwnership**(`overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="transferownership" name="transferownership"></a> transferOwnership

▸ **transferOwnership**(`newOwner`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `newOwner` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="unpause" name="unpause"></a> unpause

▸ **unpause**(`overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>
