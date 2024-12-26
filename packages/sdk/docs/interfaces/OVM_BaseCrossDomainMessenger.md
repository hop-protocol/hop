# Interface: OVM\_BaseCrossDomainMessenger

## Hierarchy

- `BaseContract`

  ↳ **`OVM_BaseCrossDomainMessenger`**

## Table of contents

### Properties

- [callStatic](OVM_BaseCrossDomainMessenger.md#callstatic)
- [estimateGas](OVM_BaseCrossDomainMessenger.md#estimategas)
- [filters](OVM_BaseCrossDomainMessenger.md#filters)
- [functions](OVM_BaseCrossDomainMessenger.md#functions)
- [interface](OVM_BaseCrossDomainMessenger.md#interface)
- [off](OVM_BaseCrossDomainMessenger.md#off)
- [on](OVM_BaseCrossDomainMessenger.md#on)
- [once](OVM_BaseCrossDomainMessenger.md#once)
- [populateTransaction](OVM_BaseCrossDomainMessenger.md#populatetransaction)
- [removeListener](OVM_BaseCrossDomainMessenger.md#removelistener)

### Methods

- [attach](OVM_BaseCrossDomainMessenger.md#attach)
- [connect](OVM_BaseCrossDomainMessenger.md#connect)
- [deployed](OVM_BaseCrossDomainMessenger.md#deployed)
- [listeners](OVM_BaseCrossDomainMessenger.md#listeners)
- [messageNonce](OVM_BaseCrossDomainMessenger.md#messagenonce)
- [queryFilter](OVM_BaseCrossDomainMessenger.md#queryfilter)
- [relayedMessages](OVM_BaseCrossDomainMessenger.md#relayedmessages)
- [removeAllListeners](OVM_BaseCrossDomainMessenger.md#removealllisteners)
- [sentMessages](OVM_BaseCrossDomainMessenger.md#sentmessages)
- [successfulMessages](OVM_BaseCrossDomainMessenger.md#successfulmessages)
- [xDomainMessageSender](OVM_BaseCrossDomainMessenger.md#xdomainmessagesender)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `messageNonce` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `relayedMessages` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `sentMessages` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `successfulMessages` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `xDomainMessageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `messageNonce` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `relayedMessages` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `sentMessages` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `successfulMessages` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
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
| `messageNonce` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `relayedMessages` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `sentMessages` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `successfulMessages` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `xDomainMessageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `OVM_BaseCrossDomainMessengerInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`OVM_BaseCrossDomainMessenger`](OVM_BaseCrossDomainMessenger.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`OVM_BaseCrossDomainMessenger`](OVM_BaseCrossDomainMessenger.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`OVM_BaseCrossDomainMessenger`](OVM_BaseCrossDomainMessenger.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `messageNonce` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `relayedMessages` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `sentMessages` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `successfulMessages` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `xDomainMessageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`OVM_BaseCrossDomainMessenger`](OVM_BaseCrossDomainMessenger.md)\>

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

▸ **deployed**(): `Promise`\<[`OVM_BaseCrossDomainMessenger`](OVM_BaseCrossDomainMessenger.md)\>

#### Returns

`Promise`\<[`OVM_BaseCrossDomainMessenger`](OVM_BaseCrossDomainMessenger.md)\>

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

### <a id="messagenonce" name="messagenonce"></a> messageNonce

▸ **messageNonce**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

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

### <a id="relayedmessages" name="relayedmessages"></a> relayedMessages

▸ **relayedMessages**(`arg0`, `overrides?`): `Promise`\<`boolean`\>

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

### <a id="sentmessages" name="sentmessages"></a> sentMessages

▸ **sentMessages**(`arg0`, `overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="successfulmessages" name="successfulmessages"></a> successfulMessages

▸ **successfulMessages**(`arg0`, `overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="xdomainmessagesender" name="xdomainmessagesender"></a> xDomainMessageSender

▸ **xDomainMessageSender**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>
