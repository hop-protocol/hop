# Interface: MockOVM\_CrossDomainMessenger

## Hierarchy

- `BaseContract`

  ↳ **`MockOVM_CrossDomainMessenger`**

## Table of contents

### Properties

- [callStatic](MockOVM_CrossDomainMessenger-1.md#callstatic)
- [estimateGas](MockOVM_CrossDomainMessenger-1.md#estimategas)
- [filters](MockOVM_CrossDomainMessenger-1.md#filters)
- [functions](MockOVM_CrossDomainMessenger-1.md#functions)
- [interface](MockOVM_CrossDomainMessenger-1.md#interface)
- [off](MockOVM_CrossDomainMessenger-1.md#off)
- [on](MockOVM_CrossDomainMessenger-1.md#on)
- [once](MockOVM_CrossDomainMessenger-1.md#once)
- [populateTransaction](MockOVM_CrossDomainMessenger-1.md#populatetransaction)
- [removeListener](MockOVM_CrossDomainMessenger-1.md#removelistener)

### Methods

- [attach](MockOVM_CrossDomainMessenger-1.md#attach)
- [connect](MockOVM_CrossDomainMessenger-1.md#connect)
- [delay](MockOVM_CrossDomainMessenger-1.md#delay)
- [deployed](MockOVM_CrossDomainMessenger-1.md#deployed)
- [fullReceivedMessages](MockOVM_CrossDomainMessenger-1.md#fullreceivedmessages)
- [hasNextMessage](MockOVM_CrossDomainMessenger-1.md#hasnextmessage)
- [lastRelayedMessage](MockOVM_CrossDomainMessenger-1.md#lastrelayedmessage)
- [listeners](MockOVM_CrossDomainMessenger-1.md#listeners)
- [messageNonce](MockOVM_CrossDomainMessenger-1.md#messagenonce)
- [queryFilter](MockOVM_CrossDomainMessenger-1.md#queryfilter)
- [receiveMessage](MockOVM_CrossDomainMessenger-1.md#receivemessage)
- [relayNextMessage](MockOVM_CrossDomainMessenger-1.md#relaynextmessage)
- [relayedMessages](MockOVM_CrossDomainMessenger-1.md#relayedmessages)
- [removeAllListeners](MockOVM_CrossDomainMessenger-1.md#removealllisteners)
- [sendMessage](MockOVM_CrossDomainMessenger-1.md#sendmessage)
- [sentMessages](MockOVM_CrossDomainMessenger-1.md#sentmessages)
- [setTargetMessengerAddress](MockOVM_CrossDomainMessenger-1.md#settargetmessengeraddress)
- [successfulMessages](MockOVM_CrossDomainMessenger-1.md#successfulmessages)
- [targetMessengerAddress](MockOVM_CrossDomainMessenger-1.md#targetmessengeraddress)
- [xDomainMessageSender](MockOVM_CrossDomainMessenger-1.md#xdomainmessagesender)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `delay` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `fullReceivedMessages` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `string`, `string`, `string`, `BigNumber`, `BigNumber`] & \{ `gasLimit`: `BigNumber` ; `message`: `string` ; `messageNonce`: `BigNumber` ; `sender`: `string` ; `target`: `string` ; `timestamp`: `BigNumber`  }\> |
| `hasNextMessage` | (`overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `lastRelayedMessage` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `messageNonce` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `receiveMessage` | (`_message`: [`ReceivedMessageStruct`](../modules/MockOVM_CrossDomainMessenger.md#receivedmessagestruct), `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `relayNextMessage` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `relayedMessages` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `sendMessage` | (`_target`: `PromiseOrValue`\<`string`\>, `_message`: `PromiseOrValue`\<`BytesLike`\>, `_gasLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `sentMessages` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `setTargetMessengerAddress` | (`_targetMessengerAddress`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `successfulMessages` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `targetMessengerAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `xDomainMessageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `delay` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `fullReceivedMessages` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `hasNextMessage` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `lastRelayedMessage` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `messageNonce` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `receiveMessage` | (`_message`: [`ReceivedMessageStruct`](../modules/MockOVM_CrossDomainMessenger.md#receivedmessagestruct), `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `relayNextMessage` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `relayedMessages` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `sendMessage` | (`_target`: `PromiseOrValue`\<`string`\>, `_message`: `PromiseOrValue`\<`BytesLike`\>, `_gasLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `sentMessages` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `setTargetMessengerAddress` | (`_targetMessengerAddress`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `successfulMessages` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `targetMessengerAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
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
| `delay` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `fullReceivedMessages` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `string`, `string`, `string`, `BigNumber`, `BigNumber`] & \{ `gasLimit`: `BigNumber` ; `message`: `string` ; `messageNonce`: `BigNumber` ; `sender`: `string` ; `target`: `string` ; `timestamp`: `BigNumber`  }\> |
| `hasNextMessage` | (`overrides?`: `CallOverrides`) => `Promise`\<[`boolean`] & \{ `_exists`: `boolean`  }\> |
| `lastRelayedMessage` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `messageNonce` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `receiveMessage` | (`_message`: [`ReceivedMessageStruct`](../modules/MockOVM_CrossDomainMessenger.md#receivedmessagestruct), `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `relayNextMessage` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `relayedMessages` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `sendMessage` | (`_target`: `PromiseOrValue`\<`string`\>, `_message`: `PromiseOrValue`\<`BytesLike`\>, `_gasLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `sentMessages` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `setTargetMessengerAddress` | (`_targetMessengerAddress`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `successfulMessages` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `targetMessengerAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `xDomainMessageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `MockOVM_CrossDomainMessengerInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`MockOVM_CrossDomainMessenger`](MockOVM_CrossDomainMessenger-1.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`MockOVM_CrossDomainMessenger`](MockOVM_CrossDomainMessenger-1.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`MockOVM_CrossDomainMessenger`](MockOVM_CrossDomainMessenger-1.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `delay` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `fullReceivedMessages` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `hasNextMessage` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `lastRelayedMessage` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `messageNonce` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `receiveMessage` | (`_message`: [`ReceivedMessageStruct`](../modules/MockOVM_CrossDomainMessenger.md#receivedmessagestruct), `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `relayNextMessage` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `relayedMessages` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `sendMessage` | (`_target`: `PromiseOrValue`\<`string`\>, `_message`: `PromiseOrValue`\<`BytesLike`\>, `_gasLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `sentMessages` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `setTargetMessengerAddress` | (`_targetMessengerAddress`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `successfulMessages` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `targetMessengerAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `xDomainMessageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`MockOVM_CrossDomainMessenger`](MockOVM_CrossDomainMessenger-1.md)\>

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

▸ **deployed**(): `Promise`\<[`MockOVM_CrossDomainMessenger`](MockOVM_CrossDomainMessenger-1.md)\>

#### Returns

`Promise`\<[`MockOVM_CrossDomainMessenger`](MockOVM_CrossDomainMessenger-1.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="fullreceivedmessages" name="fullreceivedmessages"></a> fullReceivedMessages

▸ **fullReceivedMessages**(`arg0`, `overrides?`): `Promise`\<[`BigNumber`, `string`, `string`, `string`, `BigNumber`, `BigNumber`] & \{ `gasLimit`: `BigNumber` ; `message`: `string` ; `messageNonce`: `BigNumber` ; `sender`: `string` ; `target`: `string` ; `timestamp`: `BigNumber`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<[`BigNumber`, `string`, `string`, `string`, `BigNumber`, `BigNumber`] & \{ `gasLimit`: `BigNumber` ; `message`: `string` ; `messageNonce`: `BigNumber` ; `sender`: `string` ; `target`: `string` ; `timestamp`: `BigNumber`  }\>

___

### <a id="hasnextmessage" name="hasnextmessage"></a> hasNextMessage

▸ **hasNextMessage**(`overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="lastrelayedmessage" name="lastrelayedmessage"></a> lastRelayedMessage

▸ **lastRelayedMessage**(`overrides?`): `Promise`\<`BigNumber`\>

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

### <a id="receivemessage" name="receivemessage"></a> receiveMessage

▸ **receiveMessage**(`_message`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_message` | [`ReceivedMessageStruct`](../modules/MockOVM_CrossDomainMessenger.md#receivedmessagestruct) |
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

### <a id="settargetmessengeraddress" name="settargetmessengeraddress"></a> setTargetMessengerAddress

▸ **setTargetMessengerAddress**(`_targetMessengerAddress`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_targetMessengerAddress` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

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

### <a id="targetmessengeraddress" name="targetmessengeraddress"></a> targetMessengerAddress

▸ **targetMessengerAddress**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="xdomainmessagesender" name="xdomainmessagesender"></a> xDomainMessageSender

▸ **xDomainMessageSender**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>
