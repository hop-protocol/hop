# Interface: L1\_xDaiMessenger

## Hierarchy

- `BaseContract`

  ↳ **`L1_xDaiMessenger`**

## Table of contents

### Properties

- [callStatic](L1_xDaiMessenger.md#callstatic)
- [estimateGas](L1_xDaiMessenger.md#estimategas)
- [filters](L1_xDaiMessenger.md#filters)
- [functions](L1_xDaiMessenger.md#functions)
- [interface](L1_xDaiMessenger.md#interface)
- [off](L1_xDaiMessenger.md#off)
- [on](L1_xDaiMessenger.md#on)
- [once](L1_xDaiMessenger.md#once)
- [populateTransaction](L1_xDaiMessenger.md#populatetransaction)
- [removeListener](L1_xDaiMessenger.md#removelistener)

### Methods

- [attach](L1_xDaiMessenger.md#attach)
- [connect](L1_xDaiMessenger.md#connect)
- [deployed](L1_xDaiMessenger.md#deployed)
- [failedMessageDataHash](L1_xDaiMessenger.md#failedmessagedatahash)
- [failedMessageReceiver](L1_xDaiMessenger.md#failedmessagereceiver)
- [failedMessageSender](L1_xDaiMessenger.md#failedmessagesender)
- [listeners](L1_xDaiMessenger.md#listeners)
- [maxGasPerTx](L1_xDaiMessenger.md#maxgaspertx)
- [messageCallStatus](L1_xDaiMessenger.md#messagecallstatus)
- [messageId](L1_xDaiMessenger.md#messageid)
- [messageSender](L1_xDaiMessenger.md#messagesender)
- [messageSourceChainId](L1_xDaiMessenger.md#messagesourcechainid)
- [queryFilter](L1_xDaiMessenger.md#queryfilter)
- [removeAllListeners](L1_xDaiMessenger.md#removealllisteners)
- [requireToPassMessage](L1_xDaiMessenger.md#requiretopassmessage)
- [transactionHash](L1_xDaiMessenger.md#transactionhash)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `failedMessageDataHash` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `failedMessageReceiver` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `failedMessageSender` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `maxGasPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `messageCallStatus` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `messageId` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `messageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `messageSourceChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `requireToPassMessage` | (`_contract`: `PromiseOrValue`\<`string`\>, `_data`: `PromiseOrValue`\<`BytesLike`\>, `_gas`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `transactionHash` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `failedMessageDataHash` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `failedMessageReceiver` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `failedMessageSender` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `maxGasPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `messageCallStatus` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `messageId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `messageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `messageSourceChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `requireToPassMessage` | (`_contract`: `PromiseOrValue`\<`string`\>, `_data`: `PromiseOrValue`\<`BytesLike`\>, `_gas`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `transactionHash` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |

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
| `failedMessageDataHash` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `failedMessageReceiver` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `failedMessageSender` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `maxGasPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `messageCallStatus` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `messageId` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `messageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `messageSourceChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `requireToPassMessage` | (`_contract`: `PromiseOrValue`\<`string`\>, `_data`: `PromiseOrValue`\<`BytesLike`\>, `_gas`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `transactionHash` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `L1_xDaiMessengerInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`L1_xDaiMessenger`](L1_xDaiMessenger.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`L1_xDaiMessenger`](L1_xDaiMessenger.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`L1_xDaiMessenger`](L1_xDaiMessenger.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `failedMessageDataHash` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `failedMessageReceiver` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `failedMessageSender` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `maxGasPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `messageCallStatus` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `messageId` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `messageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `messageSourceChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `requireToPassMessage` | (`_contract`: `PromiseOrValue`\<`string`\>, `_data`: `PromiseOrValue`\<`BytesLike`\>, `_gas`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `transactionHash` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`L1_xDaiMessenger`](L1_xDaiMessenger.md)\>

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

▸ **deployed**(): `Promise`\<[`L1_xDaiMessenger`](L1_xDaiMessenger.md)\>

#### Returns

`Promise`\<[`L1_xDaiMessenger`](L1_xDaiMessenger.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="failedmessagedatahash" name="failedmessagedatahash"></a> failedMessageDataHash

▸ **failedMessageDataHash**(`_messageId`, `overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_messageId` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="failedmessagereceiver" name="failedmessagereceiver"></a> failedMessageReceiver

▸ **failedMessageReceiver**(`_messageId`, `overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_messageId` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="failedmessagesender" name="failedmessagesender"></a> failedMessageSender

▸ **failedMessageSender**(`_messageId`, `overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_messageId` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

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

### <a id="maxgaspertx" name="maxgaspertx"></a> maxGasPerTx

▸ **maxGasPerTx**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="messagecallstatus" name="messagecallstatus"></a> messageCallStatus

▸ **messageCallStatus**(`_messageId`, `overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_messageId` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="messageid" name="messageid"></a> messageId

▸ **messageId**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

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

### <a id="requiretopassmessage" name="requiretopassmessage"></a> requireToPassMessage

▸ **requireToPassMessage**(`_contract`, `_data`, `_gas`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_contract` | `PromiseOrValue`\<`string`\> |
| `_data` | `PromiseOrValue`\<`BytesLike`\> |
| `_gas` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="transactionhash" name="transactionhash"></a> transactionHash

▸ **transactionHash**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>
