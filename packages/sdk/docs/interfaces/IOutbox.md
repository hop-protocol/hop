# Interface: IOutbox

## Hierarchy

- `BaseContract`

  ↳ **`IOutbox`**

## Table of contents

### Properties

- [callStatic](IOutbox.md#callstatic)
- [estimateGas](IOutbox.md#estimategas)
- [filters](IOutbox.md#filters)
- [functions](IOutbox.md#functions)
- [interface](IOutbox.md#interface)
- [off](IOutbox.md#off)
- [on](IOutbox.md#on)
- [once](IOutbox.md#once)
- [populateTransaction](IOutbox.md#populatetransaction)
- [removeListener](IOutbox.md#removelistener)

### Methods

- [attach](IOutbox.md#attach)
- [connect](IOutbox.md#connect)
- [deployed](IOutbox.md#deployed)
- [l2ToL1Block](IOutbox.md#l2tol1block)
- [l2ToL1EthBlock](IOutbox.md#l2tol1ethblock)
- [l2ToL1Sender](IOutbox.md#l2tol1sender)
- [l2ToL1Timestamp](IOutbox.md#l2tol1timestamp)
- [listeners](IOutbox.md#listeners)
- [processOutgoingMessages](IOutbox.md#processoutgoingmessages)
- [queryFilter](IOutbox.md#queryfilter)
- [removeAllListeners](IOutbox.md#removealllisteners)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `l2ToL1Block` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l2ToL1EthBlock` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l2ToL1Sender` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `l2ToL1Timestamp` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `processOutgoingMessages` | (`sendsData`: `PromiseOrValue`\<`BytesLike`\>, `sendLengths`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `l2ToL1Block` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l2ToL1EthBlock` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l2ToL1Sender` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l2ToL1Timestamp` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `processOutgoingMessages` | (`sendsData`: `PromiseOrValue`\<`BytesLike`\>, `sendLengths`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `OutboxEntryCreated` | (`batchNum?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `outboxIndex?`: ``null``, `outputRoot?`: ``null``, `numInBatch?`: ``null``) => `OutboxEntryCreatedEventFilter` |
| `OutboxEntryCreated(uint256,uint256,bytes32,uint256)` | (`batchNum?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `outboxIndex?`: ``null``, `outputRoot?`: ``null``, `numInBatch?`: ``null``) => `OutboxEntryCreatedEventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `l2ToL1Block` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `l2ToL1EthBlock` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `l2ToL1Sender` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `l2ToL1Timestamp` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `processOutgoingMessages` | (`sendsData`: `PromiseOrValue`\<`BytesLike`\>, `sendLengths`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `IOutboxInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`IOutbox`](IOutbox.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`IOutbox`](IOutbox.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`IOutbox`](IOutbox.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `l2ToL1Block` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `l2ToL1EthBlock` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `l2ToL1Sender` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `l2ToL1Timestamp` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `processOutgoingMessages` | (`sendsData`: `PromiseOrValue`\<`BytesLike`\>, `sendLengths`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`IOutbox`](IOutbox.md)\>

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

▸ **deployed**(): `Promise`\<[`IOutbox`](IOutbox.md)\>

#### Returns

`Promise`\<[`IOutbox`](IOutbox.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="l2tol1block" name="l2tol1block"></a> l2ToL1Block

▸ **l2ToL1Block**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="l2tol1ethblock" name="l2tol1ethblock"></a> l2ToL1EthBlock

▸ **l2ToL1EthBlock**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="l2tol1sender" name="l2tol1sender"></a> l2ToL1Sender

▸ **l2ToL1Sender**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="l2tol1timestamp" name="l2tol1timestamp"></a> l2ToL1Timestamp

▸ **l2ToL1Timestamp**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

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

### <a id="processoutgoingmessages" name="processoutgoingmessages"></a> processOutgoingMessages

▸ **processOutgoingMessages**(`sendsData`, `sendLengths`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sendsData` | `PromiseOrValue`\<`BytesLike`\> |
| `sendLengths` | `PromiseOrValue`\<`BigNumberish`\>[] |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

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
