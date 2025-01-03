# Interface: IBridge

## Hierarchy

- `BaseContract`

  ↳ **`IBridge`**

## Table of contents

### Properties

- [callStatic](IBridge.md#callstatic)
- [estimateGas](IBridge.md#estimategas)
- [filters](IBridge.md#filters)
- [functions](IBridge.md#functions)
- [interface](IBridge.md#interface)
- [off](IBridge.md#off)
- [on](IBridge.md#on)
- [once](IBridge.md#once)
- [populateTransaction](IBridge.md#populatetransaction)
- [removeListener](IBridge.md#removelistener)

### Methods

- [activeOutbox](IBridge.md#activeoutbox)
- [allowedInboxes](IBridge.md#allowedinboxes)
- [allowedOutboxes](IBridge.md#allowedoutboxes)
- [attach](IBridge.md#attach)
- [connect](IBridge.md#connect)
- [deliverMessageToInbox](IBridge.md#delivermessagetoinbox)
- [deployed](IBridge.md#deployed)
- [executeCall](IBridge.md#executecall)
- [inboxAccs](IBridge.md#inboxaccs)
- [listeners](IBridge.md#listeners)
- [messageCount](IBridge.md#messagecount)
- [queryFilter](IBridge.md#queryfilter)
- [removeAllListeners](IBridge.md#removealllisteners)
- [setInbox](IBridge.md#setinbox)
- [setOutbox](IBridge.md#setoutbox)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `activeOutbox` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `allowedInboxes` | (`inbox`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `allowedOutboxes` | (`outbox`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `deliverMessageToInbox` | (`kind`: `PromiseOrValue`\<`BigNumberish`\>, `sender`: `PromiseOrValue`\<`string`\>, `messageDataHash`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `executeCall` | (`destAddr`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`, `string`] & \{ `returnData`: `string` ; `success`: `boolean`  }\> |
| `inboxAccs` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `messageCount` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `setInbox` | (`inbox`: `PromiseOrValue`\<`string`\>, `enabled`: `PromiseOrValue`\<`boolean`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setOutbox` | (`inbox`: `PromiseOrValue`\<`string`\>, `enabled`: `PromiseOrValue`\<`boolean`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `activeOutbox` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `allowedInboxes` | (`inbox`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `allowedOutboxes` | (`outbox`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `deliverMessageToInbox` | (`kind`: `PromiseOrValue`\<`BigNumberish`\>, `sender`: `PromiseOrValue`\<`string`\>, `messageDataHash`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `executeCall` | (`destAddr`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `inboxAccs` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `messageCount` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `setInbox` | (`inbox`: `PromiseOrValue`\<`string`\>, `enabled`: `PromiseOrValue`\<`boolean`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setOutbox` | (`inbox`: `PromiseOrValue`\<`string`\>, `enabled`: `PromiseOrValue`\<`boolean`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `MessageDelivered` | (`messageIndex?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `beforeInboxAcc?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `inbox?`: ``null``, `kind?`: ``null``, `sender?`: ``null``, `messageDataHash?`: ``null``) => `MessageDeliveredEventFilter` |
| `MessageDelivered(uint256,bytes32,address,uint8,address,bytes32)` | (`messageIndex?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `beforeInboxAcc?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `inbox?`: ``null``, `kind?`: ``null``, `sender?`: ``null``, `messageDataHash?`: ``null``) => `MessageDeliveredEventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `activeOutbox` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `allowedInboxes` | (`inbox`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `allowedOutboxes` | (`outbox`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `deliverMessageToInbox` | (`kind`: `PromiseOrValue`\<`BigNumberish`\>, `sender`: `PromiseOrValue`\<`string`\>, `messageDataHash`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `executeCall` | (`destAddr`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `inboxAccs` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `messageCount` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `setInbox` | (`inbox`: `PromiseOrValue`\<`string`\>, `enabled`: `PromiseOrValue`\<`boolean`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setOutbox` | (`inbox`: `PromiseOrValue`\<`string`\>, `enabled`: `PromiseOrValue`\<`boolean`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `IBridgeInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`IBridge`](IBridge.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`IBridge`](IBridge.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`IBridge`](IBridge.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `activeOutbox` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `allowedInboxes` | (`inbox`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `allowedOutboxes` | (`outbox`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `deliverMessageToInbox` | (`kind`: `PromiseOrValue`\<`BigNumberish`\>, `sender`: `PromiseOrValue`\<`string`\>, `messageDataHash`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `executeCall` | (`destAddr`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `inboxAccs` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `messageCount` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `setInbox` | (`inbox`: `PromiseOrValue`\<`string`\>, `enabled`: `PromiseOrValue`\<`boolean`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setOutbox` | (`inbox`: `PromiseOrValue`\<`string`\>, `enabled`: `PromiseOrValue`\<`boolean`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`IBridge`](IBridge.md)\>

#### Overrides

BaseContract.removeListener

## Methods

### <a id="activeoutbox" name="activeoutbox"></a> activeOutbox

▸ **activeOutbox**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="allowedinboxes" name="allowedinboxes"></a> allowedInboxes

▸ **allowedInboxes**(`inbox`, `overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `inbox` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="allowedoutboxes" name="allowedoutboxes"></a> allowedOutboxes

▸ **allowedOutboxes**(`outbox`, `overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `outbox` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

___

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

### <a id="delivermessagetoinbox" name="delivermessagetoinbox"></a> deliverMessageToInbox

▸ **deliverMessageToInbox**(`kind`, `sender`, `messageDataHash`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `kind` | `PromiseOrValue`\<`BigNumberish`\> |
| `sender` | `PromiseOrValue`\<`string`\> |
| `messageDataHash` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="deployed" name="deployed"></a> deployed

▸ **deployed**(): `Promise`\<[`IBridge`](IBridge.md)\>

#### Returns

`Promise`\<[`IBridge`](IBridge.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="executecall" name="executecall"></a> executeCall

▸ **executeCall**(`destAddr`, `amount`, `data`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `destAddr` | `PromiseOrValue`\<`string`\> |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `data` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="inboxaccs" name="inboxaccs"></a> inboxAccs

▸ **inboxAccs**(`index`, `overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `PromiseOrValue`\<`BigNumberish`\> |
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

### <a id="messagecount" name="messagecount"></a> messageCount

▸ **messageCount**(`overrides?`): `Promise`\<`BigNumber`\>

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

### <a id="setinbox" name="setinbox"></a> setInbox

▸ **setInbox**(`inbox`, `enabled`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `inbox` | `PromiseOrValue`\<`string`\> |
| `enabled` | `PromiseOrValue`\<`boolean`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setoutbox" name="setoutbox"></a> setOutbox

▸ **setOutbox**(`inbox`, `enabled`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `inbox` | `PromiseOrValue`\<`string`\> |
| `enabled` | `PromiseOrValue`\<`boolean`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>
