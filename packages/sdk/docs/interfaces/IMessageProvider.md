# Interface: IMessageProvider

## Hierarchy

- `BaseContract`

  ↳ **`IMessageProvider`**

## Table of contents

### Properties

- [callStatic](IMessageProvider.md#callstatic)
- [estimateGas](IMessageProvider.md#estimategas)
- [filters](IMessageProvider.md#filters)
- [functions](IMessageProvider.md#functions)
- [interface](IMessageProvider.md#interface)
- [off](IMessageProvider.md#off)
- [on](IMessageProvider.md#on)
- [once](IMessageProvider.md#once)
- [populateTransaction](IMessageProvider.md#populatetransaction)
- [removeListener](IMessageProvider.md#removelistener)

### Methods

- [attach](IMessageProvider.md#attach)
- [connect](IMessageProvider.md#connect)
- [deployed](IMessageProvider.md#deployed)
- [listeners](IMessageProvider.md#listeners)
- [queryFilter](IMessageProvider.md#queryfilter)
- [removeAllListeners](IMessageProvider.md#removealllisteners)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `InboxMessageDelivered` | (`messageNum?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `data?`: ``null``) => `InboxMessageDeliveredEventFilter` |
| `InboxMessageDelivered(uint256,bytes)` | (`messageNum?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `data?`: ``null``) => `InboxMessageDeliveredEventFilter` |
| `InboxMessageDeliveredFromOrigin` | (`messageNum?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>) => `InboxMessageDeliveredFromOriginEventFilter` |
| `InboxMessageDeliveredFromOrigin(uint256)` | (`messageNum?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>) => `InboxMessageDeliveredFromOriginEventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `IMessageProviderInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`IMessageProvider`](IMessageProvider.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`IMessageProvider`](IMessageProvider.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`IMessageProvider`](IMessageProvider.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`IMessageProvider`](IMessageProvider.md)\>

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

▸ **deployed**(): `Promise`\<[`IMessageProvider`](IMessageProvider.md)\>

#### Returns

`Promise`\<[`IMessageProvider`](IMessageProvider.md)\>

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
