# Interface: IGlobalInbox

## Hierarchy

- `BaseContract`

  ↳ **`IGlobalInbox`**

## Table of contents

### Properties

- [callStatic](IGlobalInbox.md#callstatic)
- [estimateGas](IGlobalInbox.md#estimategas)
- [filters](IGlobalInbox.md#filters)
- [functions](IGlobalInbox.md#functions)
- [interface](IGlobalInbox.md#interface)
- [off](IGlobalInbox.md#off)
- [on](IGlobalInbox.md#on)
- [once](IGlobalInbox.md#once)
- [populateTransaction](IGlobalInbox.md#populatetransaction)
- [removeListener](IGlobalInbox.md#removelistener)

### Methods

- [attach](IGlobalInbox.md#attach)
- [connect](IGlobalInbox.md#connect)
- [deployL2ContractPair](IGlobalInbox.md#deployl2contractpair)
- [deployed](IGlobalInbox.md#deployed)
- [getInbox](IGlobalInbox.md#getinbox)
- [listeners](IGlobalInbox.md#listeners)
- [queryFilter](IGlobalInbox.md#queryfilter)
- [removeAllListeners](IGlobalInbox.md#removealllisteners)
- [sendInitializationMessage](IGlobalInbox.md#sendinitializationmessage)
- [sendL2Message](IGlobalInbox.md#sendl2message)
- [sendMessages](IGlobalInbox.md#sendmessages)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `deployL2ContractPair` | (`chain`: `PromiseOrValue`\<`string`\>, `maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `payment`: `PromiseOrValue`\<`BigNumberish`\>, `contractData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `getInbox` | (`account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`, `BigNumber`]\> |
| `sendInitializationMessage` | (`messageData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `sendL2Message` | (`chain`: `PromiseOrValue`\<`string`\>, `messageData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `sendMessages` | (`_messages`: `PromiseOrValue`\<`BytesLike`\>, `initialMaxSendCount`: `PromiseOrValue`\<`BigNumberish`\>, `finalMaxSendCount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `deployL2ContractPair` | (`chain`: `PromiseOrValue`\<`string`\>, `maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `payment`: `PromiseOrValue`\<`BigNumberish`\>, `contractData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `getInbox` | (`account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `sendInitializationMessage` | (`messageData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `sendL2Message` | (`chain`: `PromiseOrValue`\<`string`\>, `messageData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `sendMessages` | (`_messages`: `PromiseOrValue`\<`BytesLike`\>, `initialMaxSendCount`: `PromiseOrValue`\<`BigNumberish`\>, `finalMaxSendCount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `BuddyContractDeployed` | (`sender?`: ``null`` \| `PromiseOrValue`\<`string`\>, `data?`: ``null``) => `BuddyContractDeployedEventFilter` |
| `BuddyContractDeployed(address,bytes)` | (`sender?`: ``null`` \| `PromiseOrValue`\<`string`\>, `data?`: ``null``) => `BuddyContractDeployedEventFilter` |
| `BuddyContractPair` | (`sender?`: ``null`` \| `PromiseOrValue`\<`string`\>, `data?`: ``null``) => `BuddyContractPairEventFilter` |
| `BuddyContractPair(address,address)` | (`sender?`: ``null`` \| `PromiseOrValue`\<`string`\>, `data?`: ``null``) => `BuddyContractPairEventFilter` |
| `MessageDelivered` | (`chain?`: ``null`` \| `PromiseOrValue`\<`string`\>, `kind?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `sender?`: ``null`` \| `PromiseOrValue`\<`string`\>, `inboxSeqNum?`: ``null``, `data?`: ``null``) => `MessageDeliveredEventFilter` |
| `MessageDelivered(address,uint8,address,uint256,bytes)` | (`chain?`: ``null`` \| `PromiseOrValue`\<`string`\>, `kind?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `sender?`: ``null`` \| `PromiseOrValue`\<`string`\>, `inboxSeqNum?`: ``null``, `data?`: ``null``) => `MessageDeliveredEventFilter` |
| `MessageDeliveredFromOrigin` | (`chain?`: ``null`` \| `PromiseOrValue`\<`string`\>, `kind?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `sender?`: ``null`` \| `PromiseOrValue`\<`string`\>, `inboxSeqNum?`: ``null``) => `MessageDeliveredFromOriginEventFilter` |
| `MessageDeliveredFromOrigin(address,uint8,address,uint256)` | (`chain?`: ``null`` \| `PromiseOrValue`\<`string`\>, `kind?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `sender?`: ``null`` \| `PromiseOrValue`\<`string`\>, `inboxSeqNum?`: ``null``) => `MessageDeliveredFromOriginEventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `deployL2ContractPair` | (`chain`: `PromiseOrValue`\<`string`\>, `maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `payment`: `PromiseOrValue`\<`BigNumberish`\>, `contractData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `getInbox` | (`account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`, `BigNumber`]\> |
| `sendInitializationMessage` | (`messageData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `sendL2Message` | (`chain`: `PromiseOrValue`\<`string`\>, `messageData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `sendMessages` | (`_messages`: `PromiseOrValue`\<`BytesLike`\>, `initialMaxSendCount`: `PromiseOrValue`\<`BigNumberish`\>, `finalMaxSendCount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `IGlobalInboxInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`IGlobalInbox`](IGlobalInbox.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`IGlobalInbox`](IGlobalInbox.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`IGlobalInbox`](IGlobalInbox.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `deployL2ContractPair` | (`chain`: `PromiseOrValue`\<`string`\>, `maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `payment`: `PromiseOrValue`\<`BigNumberish`\>, `contractData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `getInbox` | (`account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `sendInitializationMessage` | (`messageData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `sendL2Message` | (`chain`: `PromiseOrValue`\<`string`\>, `messageData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `sendMessages` | (`_messages`: `PromiseOrValue`\<`BytesLike`\>, `initialMaxSendCount`: `PromiseOrValue`\<`BigNumberish`\>, `finalMaxSendCount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`IGlobalInbox`](IGlobalInbox.md)\>

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

### <a id="deployl2contractpair" name="deployl2contractpair"></a> deployL2ContractPair

▸ **deployL2ContractPair**(`chain`, `maxGas`, `gasPriceBid`, `payment`, `contractData`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | `PromiseOrValue`\<`string`\> |
| `maxGas` | `PromiseOrValue`\<`BigNumberish`\> |
| `gasPriceBid` | `PromiseOrValue`\<`BigNumberish`\> |
| `payment` | `PromiseOrValue`\<`BigNumberish`\> |
| `contractData` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="deployed" name="deployed"></a> deployed

▸ **deployed**(): `Promise`\<[`IGlobalInbox`](IGlobalInbox.md)\>

#### Returns

`Promise`\<[`IGlobalInbox`](IGlobalInbox.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="getinbox" name="getinbox"></a> getInbox

▸ **getInbox**(`account`, `overrides?`): `Promise`\<[`string`, `BigNumber`]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `account` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<[`string`, `BigNumber`]\>

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

### <a id="sendinitializationmessage" name="sendinitializationmessage"></a> sendInitializationMessage

▸ **sendInitializationMessage**(`messageData`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `messageData` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="sendl2message" name="sendl2message"></a> sendL2Message

▸ **sendL2Message**(`chain`, `messageData`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | `PromiseOrValue`\<`string`\> |
| `messageData` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="sendmessages" name="sendmessages"></a> sendMessages

▸ **sendMessages**(`_messages`, `initialMaxSendCount`, `finalMaxSendCount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_messages` | `PromiseOrValue`\<`BytesLike`\> |
| `initialMaxSendCount` | `PromiseOrValue`\<`BigNumberish`\> |
| `finalMaxSendCount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>
