# Interface: MockMessenger

## Hierarchy

- `BaseContract`

  ↳ **`MockMessenger`**

## Table of contents

### Properties

- [callStatic](MockMessenger.md#callstatic)
- [estimateGas](MockMessenger.md#estimategas)
- [filters](MockMessenger.md#filters)
- [functions](MockMessenger.md#functions)
- [interface](MockMessenger.md#interface)
- [off](MockMessenger.md#off)
- [on](MockMessenger.md#on)
- [once](MockMessenger.md#once)
- [populateTransaction](MockMessenger.md#populatetransaction)
- [removeListener](MockMessenger.md#removelistener)

### Methods

- [attach](MockMessenger.md#attach)
- [canonicalToken](MockMessenger.md#canonicaltoken)
- [connect](MockMessenger.md#connect)
- [deployed](MockMessenger.md#deployed)
- [listeners](MockMessenger.md#listeners)
- [messageSender](MockMessenger.md#messagesender)
- [messageSourceChainId](MockMessenger.md#messagesourcechainid)
- [nextMessage](MockMessenger.md#nextmessage)
- [queryFilter](MockMessenger.md#queryfilter)
- [receiveMessage](MockMessenger.md#receivemessage)
- [relayNextMessage](MockMessenger.md#relaynextmessage)
- [removeAllListeners](MockMessenger.md#removealllisteners)
- [xDomainMessageSender](MockMessenger.md#xdomainmessagesender)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `canonicalToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `messageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `messageSourceChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `nextMessage` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`, `string`, `string`] & \{ `message`: `string` ; `sender`: `string` ; `target`: `string`  }\> |
| `receiveMessage` | (`_target`: `PromiseOrValue`\<`string`\>, `_message`: `PromiseOrValue`\<`BytesLike`\>, `_sender`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `relayNextMessage` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `xDomainMessageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `canonicalToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `messageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `messageSourceChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `nextMessage` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `receiveMessage` | (`_target`: `PromiseOrValue`\<`string`\>, `_message`: `PromiseOrValue`\<`BytesLike`\>, `_sender`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `relayNextMessage` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `xDomainMessageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |

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
| `canonicalToken` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `messageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `messageSourceChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `nextMessage` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`, `string`, `string`] & \{ `message`: `string` ; `sender`: `string` ; `target`: `string`  }\> |
| `receiveMessage` | (`_target`: `PromiseOrValue`\<`string`\>, `_message`: `PromiseOrValue`\<`BytesLike`\>, `_sender`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `relayNextMessage` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `xDomainMessageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `MockMessengerInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`MockMessenger`](MockMessenger.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`MockMessenger`](MockMessenger.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`MockMessenger`](MockMessenger.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `canonicalToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `messageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `messageSourceChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `nextMessage` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `receiveMessage` | (`_target`: `PromiseOrValue`\<`string`\>, `_message`: `PromiseOrValue`\<`BytesLike`\>, `_sender`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `relayNextMessage` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `xDomainMessageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`MockMessenger`](MockMessenger.md)\>

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

### <a id="canonicaltoken" name="canonicaltoken"></a> canonicalToken

▸ **canonicalToken**(`overrides?`): `Promise`\<`string`\>

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

▸ **deployed**(): `Promise`\<[`MockMessenger`](MockMessenger.md)\>

#### Returns

`Promise`\<[`MockMessenger`](MockMessenger.md)\>

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

### <a id="messagesender" name="messagesender"></a> messageSender

▸ **messageSender**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="messagesourcechainid" name="messagesourcechainid"></a> messageSourceChainId

▸ **messageSourceChainId**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="nextmessage" name="nextmessage"></a> nextMessage

▸ **nextMessage**(`overrides?`): `Promise`\<[`string`, `string`, `string`] & \{ `message`: `string` ; `sender`: `string` ; `target`: `string`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<[`string`, `string`, `string`] & \{ `message`: `string` ; `sender`: `string` ; `target`: `string`  }\>

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

### <a id="receivemessage" name="receivemessage"></a> receiveMessage

▸ **receiveMessage**(`_target`, `_message`, `_sender`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_target` | `PromiseOrValue`\<`string`\> |
| `_message` | `PromiseOrValue`\<`BytesLike`\> |
| `_sender` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="relaynextmessage" name="relaynextmessage"></a> relayNextMessage

▸ **relayNextMessage**(`overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

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

### <a id="xdomainmessagesender" name="xdomainmessagesender"></a> xDomainMessageSender

▸ **xDomainMessageSender**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>
