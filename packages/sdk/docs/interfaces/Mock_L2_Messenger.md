# Interface: Mock\_L2\_Messenger

## Hierarchy

- `BaseContract`

  ↳ **`Mock_L2_Messenger`**

## Table of contents

### Properties

- [callStatic](Mock_L2_Messenger.md#callstatic)
- [estimateGas](Mock_L2_Messenger.md#estimategas)
- [filters](Mock_L2_Messenger.md#filters)
- [functions](Mock_L2_Messenger.md#functions)
- [interface](Mock_L2_Messenger.md#interface)
- [off](Mock_L2_Messenger.md#off)
- [on](Mock_L2_Messenger.md#on)
- [once](Mock_L2_Messenger.md#once)
- [populateTransaction](Mock_L2_Messenger.md#populatetransaction)
- [removeListener](Mock_L2_Messenger.md#removelistener)

### Methods

- [attach](Mock_L2_Messenger.md#attach)
- [canonicalToken](Mock_L2_Messenger.md#canonicaltoken)
- [connect](Mock_L2_Messenger.md#connect)
- [deployed](Mock_L2_Messenger.md#deployed)
- [listeners](Mock_L2_Messenger.md#listeners)
- [messageSender](Mock_L2_Messenger.md#messagesender)
- [messageSourceChainId](Mock_L2_Messenger.md#messagesourcechainid)
- [nextMessage](Mock_L2_Messenger.md#nextmessage)
- [polygonTarget](Mock_L2_Messenger.md#polygontarget)
- [queryFilter](Mock_L2_Messenger.md#queryfilter)
- [receiveMessage](Mock_L2_Messenger.md#receivemessage)
- [relayNextMessage](Mock_L2_Messenger.md#relaynextmessage)
- [removeAllListeners](Mock_L2_Messenger.md#removealllisteners)
- [requireToPassMessage](Mock_L2_Messenger.md#requiretopassmessage)
- [sendMessage](Mock_L2_Messenger.md#sendmessage)
- [sendTxToL1](Mock_L2_Messenger.md#sendtxtol1)
- [setPolygonTarget](Mock_L2_Messenger.md#setpolygontarget)
- [setTargetMessenger](Mock_L2_Messenger.md#settargetmessenger)
- [targetMessenger](Mock_L2_Messenger.md#targetmessenger)
- [xDomainMessageSender](Mock_L2_Messenger.md#xdomainmessagesender)

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
| `polygonTarget` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `receiveMessage` | (`_target`: `PromiseOrValue`\<`string`\>, `_message`: `PromiseOrValue`\<`BytesLike`\>, `_sender`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `relayNextMessage` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `requireToPassMessage` | (`_target`: `PromiseOrValue`\<`string`\>, `_message`: `PromiseOrValue`\<`BytesLike`\>, `arg2`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `sendMessage` | (`_target`: `PromiseOrValue`\<`string`\>, `_message`: `PromiseOrValue`\<`BytesLike`\>, `arg2`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `sendTxToL1` | (`_destAddr`: `PromiseOrValue`\<`string`\>, `_calldataForL1`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setPolygonTarget` | (`_polygonTarget`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setTargetMessenger` | (`_targetMessenger`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `targetMessenger` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
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
| `polygonTarget` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `receiveMessage` | (`_target`: `PromiseOrValue`\<`string`\>, `_message`: `PromiseOrValue`\<`BytesLike`\>, `_sender`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `relayNextMessage` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `requireToPassMessage` | (`_target`: `PromiseOrValue`\<`string`\>, `_message`: `PromiseOrValue`\<`BytesLike`\>, `arg2`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `sendMessage` | (`_target`: `PromiseOrValue`\<`string`\>, `_message`: `PromiseOrValue`\<`BytesLike`\>, `arg2`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `sendTxToL1` | (`_destAddr`: `PromiseOrValue`\<`string`\>, `_calldataForL1`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setPolygonTarget` | (`_polygonTarget`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setTargetMessenger` | (`_targetMessenger`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `targetMessenger` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
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
| `polygonTarget` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `receiveMessage` | (`_target`: `PromiseOrValue`\<`string`\>, `_message`: `PromiseOrValue`\<`BytesLike`\>, `_sender`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `relayNextMessage` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `requireToPassMessage` | (`_target`: `PromiseOrValue`\<`string`\>, `_message`: `PromiseOrValue`\<`BytesLike`\>, `arg2`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `sendMessage` | (`_target`: `PromiseOrValue`\<`string`\>, `_message`: `PromiseOrValue`\<`BytesLike`\>, `arg2`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `sendTxToL1` | (`_destAddr`: `PromiseOrValue`\<`string`\>, `_calldataForL1`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setPolygonTarget` | (`_polygonTarget`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setTargetMessenger` | (`_targetMessenger`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `targetMessenger` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `xDomainMessageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `Mock_L2_MessengerInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`Mock_L2_Messenger`](Mock_L2_Messenger.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`Mock_L2_Messenger`](Mock_L2_Messenger.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`Mock_L2_Messenger`](Mock_L2_Messenger.md)\>

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
| `polygonTarget` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `receiveMessage` | (`_target`: `PromiseOrValue`\<`string`\>, `_message`: `PromiseOrValue`\<`BytesLike`\>, `_sender`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `relayNextMessage` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `requireToPassMessage` | (`_target`: `PromiseOrValue`\<`string`\>, `_message`: `PromiseOrValue`\<`BytesLike`\>, `arg2`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `sendMessage` | (`_target`: `PromiseOrValue`\<`string`\>, `_message`: `PromiseOrValue`\<`BytesLike`\>, `arg2`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `sendTxToL1` | (`_destAddr`: `PromiseOrValue`\<`string`\>, `_calldataForL1`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setPolygonTarget` | (`_polygonTarget`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setTargetMessenger` | (`_targetMessenger`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `targetMessenger` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `xDomainMessageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`Mock_L2_Messenger`](Mock_L2_Messenger.md)\>

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

▸ **deployed**(): `Promise`\<[`Mock_L2_Messenger`](Mock_L2_Messenger.md)\>

#### Returns

`Promise`\<[`Mock_L2_Messenger`](Mock_L2_Messenger.md)\>

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

### <a id="polygontarget" name="polygontarget"></a> polygonTarget

▸ **polygonTarget**(`overrides?`): `Promise`\<`string`\>

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

### <a id="requiretopassmessage" name="requiretopassmessage"></a> requireToPassMessage

▸ **requireToPassMessage**(`_target`, `_message`, `arg2`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_target` | `PromiseOrValue`\<`string`\> |
| `_message` | `PromiseOrValue`\<`BytesLike`\> |
| `arg2` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="sendmessage" name="sendmessage"></a> sendMessage

▸ **sendMessage**(`_target`, `_message`, `arg2`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_target` | `PromiseOrValue`\<`string`\> |
| `_message` | `PromiseOrValue`\<`BytesLike`\> |
| `arg2` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="sendtxtol1" name="sendtxtol1"></a> sendTxToL1

▸ **sendTxToL1**(`_destAddr`, `_calldataForL1`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_destAddr` | `PromiseOrValue`\<`string`\> |
| `_calldataForL1` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setpolygontarget" name="setpolygontarget"></a> setPolygonTarget

▸ **setPolygonTarget**(`_polygonTarget`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_polygonTarget` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="settargetmessenger" name="settargetmessenger"></a> setTargetMessenger

▸ **setTargetMessenger**(`_targetMessenger`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_targetMessenger` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="targetmessenger" name="targetmessenger"></a> targetMessenger

▸ **targetMessenger**(`overrides?`): `Promise`\<`string`\>

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
