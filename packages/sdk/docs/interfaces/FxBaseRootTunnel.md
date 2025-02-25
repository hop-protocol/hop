# Interface: FxBaseRootTunnel

## Hierarchy

- `BaseContract`

  ↳ **`FxBaseRootTunnel`**

## Table of contents

### Properties

- [callStatic](FxBaseRootTunnel.md#callstatic)
- [estimateGas](FxBaseRootTunnel.md#estimategas)
- [filters](FxBaseRootTunnel.md#filters)
- [functions](FxBaseRootTunnel.md#functions)
- [interface](FxBaseRootTunnel.md#interface)
- [off](FxBaseRootTunnel.md#off)
- [on](FxBaseRootTunnel.md#on)
- [once](FxBaseRootTunnel.md#once)
- [populateTransaction](FxBaseRootTunnel.md#populatetransaction)
- [removeListener](FxBaseRootTunnel.md#removelistener)

### Methods

- [SEND\_MESSAGE\_EVENT\_SIG](FxBaseRootTunnel.md#send_message_event_sig)
- [attach](FxBaseRootTunnel.md#attach)
- [checkpointManager](FxBaseRootTunnel.md#checkpointmanager)
- [connect](FxBaseRootTunnel.md#connect)
- [deployed](FxBaseRootTunnel.md#deployed)
- [fxChildTunnel](FxBaseRootTunnel.md#fxchildtunnel)
- [fxRoot](FxBaseRootTunnel.md#fxroot)
- [listeners](FxBaseRootTunnel.md#listeners)
- [processedExits](FxBaseRootTunnel.md#processedexits)
- [queryFilter](FxBaseRootTunnel.md#queryfilter)
- [receiveMessage](FxBaseRootTunnel.md#receivemessage)
- [removeAllListeners](FxBaseRootTunnel.md#removealllisteners)
- [setFxChildTunnel](FxBaseRootTunnel.md#setfxchildtunnel)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `SEND_MESSAGE_EVENT_SIG` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `checkpointManager` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `fxChildTunnel` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `fxRoot` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `processedExits` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `receiveMessage` | (`inputData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setFxChildTunnel` | (`_fxChildTunnel`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `SEND_MESSAGE_EVENT_SIG` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `checkpointManager` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `fxChildTunnel` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `fxRoot` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `processedExits` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `receiveMessage` | (`inputData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setFxChildTunnel` | (`_fxChildTunnel`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

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
| `SEND_MESSAGE_EVENT_SIG` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `checkpointManager` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `fxChildTunnel` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `fxRoot` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `processedExits` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `receiveMessage` | (`inputData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setFxChildTunnel` | (`_fxChildTunnel`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `FxBaseRootTunnelInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`FxBaseRootTunnel`](FxBaseRootTunnel.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`FxBaseRootTunnel`](FxBaseRootTunnel.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`FxBaseRootTunnel`](FxBaseRootTunnel.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `SEND_MESSAGE_EVENT_SIG` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `checkpointManager` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `fxChildTunnel` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `fxRoot` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `processedExits` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `receiveMessage` | (`inputData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setFxChildTunnel` | (`_fxChildTunnel`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`FxBaseRootTunnel`](FxBaseRootTunnel.md)\>

#### Overrides

BaseContract.removeListener

## Methods

### <a id="send_message_event_sig" name="send_message_event_sig"></a> SEND\_MESSAGE\_EVENT\_SIG

▸ **SEND_MESSAGE_EVENT_SIG**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

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

### <a id="checkpointmanager" name="checkpointmanager"></a> checkpointManager

▸ **checkpointManager**(`overrides?`): `Promise`\<`string`\>

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

▸ **deployed**(): `Promise`\<[`FxBaseRootTunnel`](FxBaseRootTunnel.md)\>

#### Returns

`Promise`\<[`FxBaseRootTunnel`](FxBaseRootTunnel.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="fxchildtunnel" name="fxchildtunnel"></a> fxChildTunnel

▸ **fxChildTunnel**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="fxroot" name="fxroot"></a> fxRoot

▸ **fxRoot**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
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

### <a id="processedexits" name="processedexits"></a> processedExits

▸ **processedExits**(`arg0`, `overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

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

▸ **receiveMessage**(`inputData`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputData` | `PromiseOrValue`\<`BytesLike`\> |
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

### <a id="setfxchildtunnel" name="setfxchildtunnel"></a> setFxChildTunnel

▸ **setFxChildTunnel**(`_fxChildTunnel`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_fxChildTunnel` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>
