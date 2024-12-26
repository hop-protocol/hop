# Interface: IFxStateSender

## Hierarchy

- `BaseContract`

  ↳ **`IFxStateSender`**

## Table of contents

### Properties

- [callStatic](IFxStateSender.md#callstatic)
- [estimateGas](IFxStateSender.md#estimategas)
- [filters](IFxStateSender.md#filters)
- [functions](IFxStateSender.md#functions)
- [interface](IFxStateSender.md#interface)
- [off](IFxStateSender.md#off)
- [on](IFxStateSender.md#on)
- [once](IFxStateSender.md#once)
- [populateTransaction](IFxStateSender.md#populatetransaction)
- [removeListener](IFxStateSender.md#removelistener)

### Methods

- [attach](IFxStateSender.md#attach)
- [connect](IFxStateSender.md#connect)
- [deployed](IFxStateSender.md#deployed)
- [listeners](IFxStateSender.md#listeners)
- [queryFilter](IFxStateSender.md#queryfilter)
- [removeAllListeners](IFxStateSender.md#removealllisteners)
- [sendMessageToChild](IFxStateSender.md#sendmessagetochild)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `sendMessageToChild` | (`_receiver`: `PromiseOrValue`\<`string`\>, `_data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `sendMessageToChild` | (`_receiver`: `PromiseOrValue`\<`string`\>, `_data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

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
| `sendMessageToChild` | (`_receiver`: `PromiseOrValue`\<`string`\>, `_data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `IFxStateSenderInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`IFxStateSender`](IFxStateSender.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`IFxStateSender`](IFxStateSender.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`IFxStateSender`](IFxStateSender.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `sendMessageToChild` | (`_receiver`: `PromiseOrValue`\<`string`\>, `_data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`IFxStateSender`](IFxStateSender.md)\>

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

▸ **deployed**(): `Promise`\<[`IFxStateSender`](IFxStateSender.md)\>

#### Returns

`Promise`\<[`IFxStateSender`](IFxStateSender.md)\>

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

___

### <a id="sendmessagetochild" name="sendmessagetochild"></a> sendMessageToChild

▸ **sendMessageToChild**(`_receiver`, `_data`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_receiver` | `PromiseOrValue`\<`string`\> |
| `_data` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>
