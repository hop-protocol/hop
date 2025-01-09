# Interface: IAbs\_BaseCrossDomainMessenger

## Hierarchy

- `BaseContract`

  ↳ **`IAbs_BaseCrossDomainMessenger`**

## Table of contents

### Properties

- [callStatic](IAbs_BaseCrossDomainMessenger.md#callstatic)
- [estimateGas](IAbs_BaseCrossDomainMessenger.md#estimategas)
- [filters](IAbs_BaseCrossDomainMessenger.md#filters)
- [functions](IAbs_BaseCrossDomainMessenger.md#functions)
- [interface](IAbs_BaseCrossDomainMessenger.md#interface)
- [off](IAbs_BaseCrossDomainMessenger.md#off)
- [on](IAbs_BaseCrossDomainMessenger.md#on)
- [once](IAbs_BaseCrossDomainMessenger.md#once)
- [populateTransaction](IAbs_BaseCrossDomainMessenger.md#populatetransaction)
- [removeListener](IAbs_BaseCrossDomainMessenger.md#removelistener)

### Methods

- [attach](IAbs_BaseCrossDomainMessenger.md#attach)
- [connect](IAbs_BaseCrossDomainMessenger.md#connect)
- [deployed](IAbs_BaseCrossDomainMessenger.md#deployed)
- [listeners](IAbs_BaseCrossDomainMessenger.md#listeners)
- [queryFilter](IAbs_BaseCrossDomainMessenger.md#queryfilter)
- [removeAllListeners](IAbs_BaseCrossDomainMessenger.md#removealllisteners)
- [sendMessage](IAbs_BaseCrossDomainMessenger.md#sendmessage)
- [xDomainMessageSender](IAbs_BaseCrossDomainMessenger.md#xdomainmessagesender)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `sendMessage` | (`_target`: `PromiseOrValue`\<`string`\>, `_message`: `PromiseOrValue`\<`BytesLike`\>, `_gasLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `xDomainMessageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `sendMessage` | (`_target`: `PromiseOrValue`\<`string`\>, `_message`: `PromiseOrValue`\<`BytesLike`\>, `_gasLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `xDomainMessageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `RelayedMessage` | (`msgHash?`: ``null``) => `RelayedMessageEventFilter` |
| `RelayedMessage(bytes32)` | (`msgHash?`: ``null``) => `RelayedMessageEventFilter` |
| `SentMessage` | (`message?`: ``null``) => `SentMessageEventFilter` |
| `SentMessage(bytes)` | (`message?`: ``null``) => `SentMessageEventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `sendMessage` | (`_target`: `PromiseOrValue`\<`string`\>, `_message`: `PromiseOrValue`\<`BytesLike`\>, `_gasLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `xDomainMessageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `IAbs_BaseCrossDomainMessengerInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`IAbs_BaseCrossDomainMessenger`](IAbs_BaseCrossDomainMessenger.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`IAbs_BaseCrossDomainMessenger`](IAbs_BaseCrossDomainMessenger.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`IAbs_BaseCrossDomainMessenger`](IAbs_BaseCrossDomainMessenger.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `sendMessage` | (`_target`: `PromiseOrValue`\<`string`\>, `_message`: `PromiseOrValue`\<`BytesLike`\>, `_gasLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `xDomainMessageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`IAbs_BaseCrossDomainMessenger`](IAbs_BaseCrossDomainMessenger.md)\>

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

▸ **deployed**(): `Promise`\<[`IAbs_BaseCrossDomainMessenger`](IAbs_BaseCrossDomainMessenger.md)\>

#### Returns

`Promise`\<[`IAbs_BaseCrossDomainMessenger`](IAbs_BaseCrossDomainMessenger.md)\>

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

### <a id="sendmessage" name="sendmessage"></a> sendMessage

▸ **sendMessage**(`_target`, `_message`, `_gasLimit`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_target` | `PromiseOrValue`\<`string`\> |
| `_message` | `PromiseOrValue`\<`BytesLike`\> |
| `_gasLimit` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="xdomainmessagesender" name="xdomainmessagesender"></a> xDomainMessageSender

▸ **xDomainMessageSender**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>
