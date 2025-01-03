# Interface: Mock\_L1\_CanonicalBridge

## Hierarchy

- `BaseContract`

  ↳ **`Mock_L1_CanonicalBridge`**

## Table of contents

### Properties

- [callStatic](Mock_L1_CanonicalBridge.md#callstatic)
- [estimateGas](Mock_L1_CanonicalBridge.md#estimategas)
- [filters](Mock_L1_CanonicalBridge.md#filters)
- [functions](Mock_L1_CanonicalBridge.md#functions)
- [interface](Mock_L1_CanonicalBridge.md#interface)
- [off](Mock_L1_CanonicalBridge.md#off)
- [on](Mock_L1_CanonicalBridge.md#on)
- [once](Mock_L1_CanonicalBridge.md#once)
- [populateTransaction](Mock_L1_CanonicalBridge.md#populatetransaction)
- [removeListener](Mock_L1_CanonicalBridge.md#removelistener)

### Methods

- [attach](Mock_L1_CanonicalBridge.md#attach)
- [canonicalToken](Mock_L1_CanonicalBridge.md#canonicaltoken)
- [connect](Mock_L1_CanonicalBridge.md#connect)
- [deployed](Mock_L1_CanonicalBridge.md#deployed)
- [listeners](Mock_L1_CanonicalBridge.md#listeners)
- [messenger](Mock_L1_CanonicalBridge.md#messenger)
- [queryFilter](Mock_L1_CanonicalBridge.md#queryfilter)
- [removeAllListeners](Mock_L1_CanonicalBridge.md#removealllisteners)
- [sendMessage](Mock_L1_CanonicalBridge.md#sendmessage)
- [sendTokens](Mock_L1_CanonicalBridge.md#sendtokens)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `canonicalToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `messenger` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `sendMessage` | (`_target`: `PromiseOrValue`\<`string`\>, `_message`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `sendTokens` | (`_target`: `PromiseOrValue`\<`string`\>, `_recipient`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `isPolygon`: `PromiseOrValue`\<`boolean`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `canonicalToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `messenger` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `sendMessage` | (`_target`: `PromiseOrValue`\<`string`\>, `_message`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `sendTokens` | (`_target`: `PromiseOrValue`\<`string`\>, `_recipient`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `isPolygon`: `PromiseOrValue`\<`boolean`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

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
| `messenger` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `sendMessage` | (`_target`: `PromiseOrValue`\<`string`\>, `_message`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `sendTokens` | (`_target`: `PromiseOrValue`\<`string`\>, `_recipient`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `isPolygon`: `PromiseOrValue`\<`boolean`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `Mock_L1_CanonicalBridgeInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`Mock_L1_CanonicalBridge`](Mock_L1_CanonicalBridge.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`Mock_L1_CanonicalBridge`](Mock_L1_CanonicalBridge.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`Mock_L1_CanonicalBridge`](Mock_L1_CanonicalBridge.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `canonicalToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `messenger` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `sendMessage` | (`_target`: `PromiseOrValue`\<`string`\>, `_message`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `sendTokens` | (`_target`: `PromiseOrValue`\<`string`\>, `_recipient`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `isPolygon`: `PromiseOrValue`\<`boolean`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`Mock_L1_CanonicalBridge`](Mock_L1_CanonicalBridge.md)\>

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

▸ **deployed**(): `Promise`\<[`Mock_L1_CanonicalBridge`](Mock_L1_CanonicalBridge.md)\>

#### Returns

`Promise`\<[`Mock_L1_CanonicalBridge`](Mock_L1_CanonicalBridge.md)\>

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

### <a id="messenger" name="messenger"></a> messenger

▸ **messenger**(`overrides?`): `Promise`\<`string`\>

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

### <a id="sendmessage" name="sendmessage"></a> sendMessage

▸ **sendMessage**(`_target`, `_message`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_target` | `PromiseOrValue`\<`string`\> |
| `_message` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="sendtokens" name="sendtokens"></a> sendTokens

▸ **sendTokens**(`_target`, `_recipient`, `_amount`, `isPolygon`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_target` | `PromiseOrValue`\<`string`\> |
| `_recipient` | `PromiseOrValue`\<`string`\> |
| `_amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `isPolygon` | `PromiseOrValue`\<`boolean`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>
