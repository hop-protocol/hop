# Interface: ICheckpointManager

## Hierarchy

- `BaseContract`

  ↳ **`ICheckpointManager`**

## Table of contents

### Properties

- [callStatic](ICheckpointManager.md#callstatic)
- [estimateGas](ICheckpointManager.md#estimategas)
- [filters](ICheckpointManager.md#filters)
- [functions](ICheckpointManager.md#functions)
- [interface](ICheckpointManager.md#interface)
- [off](ICheckpointManager.md#off)
- [on](ICheckpointManager.md#on)
- [once](ICheckpointManager.md#once)
- [populateTransaction](ICheckpointManager.md#populatetransaction)
- [removeListener](ICheckpointManager.md#removelistener)

### Methods

- [attach](ICheckpointManager.md#attach)
- [connect](ICheckpointManager.md#connect)
- [deployed](ICheckpointManager.md#deployed)
- [headerBlocks](ICheckpointManager.md#headerblocks)
- [listeners](ICheckpointManager.md#listeners)
- [queryFilter](ICheckpointManager.md#queryfilter)
- [removeAllListeners](ICheckpointManager.md#removealllisteners)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `headerBlocks` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`, `BigNumber`, `BigNumber`, `BigNumber`, `string`] & \{ `createdAt`: `BigNumber` ; `end`: `BigNumber` ; `proposer`: `string` ; `root`: `string` ; `start`: `BigNumber`  }\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `headerBlocks` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |

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
| `headerBlocks` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`, `BigNumber`, `BigNumber`, `BigNumber`, `string`] & \{ `createdAt`: `BigNumber` ; `end`: `BigNumber` ; `proposer`: `string` ; `root`: `string` ; `start`: `BigNumber`  }\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `ICheckpointManagerInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`ICheckpointManager`](ICheckpointManager.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`ICheckpointManager`](ICheckpointManager.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`ICheckpointManager`](ICheckpointManager.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `headerBlocks` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`ICheckpointManager`](ICheckpointManager.md)\>

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

▸ **deployed**(): `Promise`\<[`ICheckpointManager`](ICheckpointManager.md)\>

#### Returns

`Promise`\<[`ICheckpointManager`](ICheckpointManager.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="headerblocks" name="headerblocks"></a> headerBlocks

▸ **headerBlocks**(`arg0`, `overrides?`): `Promise`\<[`string`, `BigNumber`, `BigNumber`, `BigNumber`, `string`] & \{ `createdAt`: `BigNumber` ; `end`: `BigNumber` ; `proposer`: `string` ; `root`: `string` ; `start`: `BigNumber`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<[`string`, `BigNumber`, `BigNumber`, `BigNumber`, `string`] & \{ `createdAt`: `BigNumber` ; `end`: `BigNumber` ; `proposer`: `string` ; `root`: `string` ; `start`: `BigNumber`  }\>

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
