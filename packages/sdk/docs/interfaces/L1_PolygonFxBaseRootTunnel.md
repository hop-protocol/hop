# Interface: L1\_PolygonFxBaseRootTunnel

## Hierarchy

- `BaseContract`

  ↳ **`L1_PolygonFxBaseRootTunnel`**

## Table of contents

### Properties

- [callStatic](L1_PolygonFxBaseRootTunnel.md#callstatic)
- [estimateGas](L1_PolygonFxBaseRootTunnel.md#estimategas)
- [filters](L1_PolygonFxBaseRootTunnel.md#filters)
- [functions](L1_PolygonFxBaseRootTunnel.md#functions)
- [interface](L1_PolygonFxBaseRootTunnel.md#interface)
- [off](L1_PolygonFxBaseRootTunnel.md#off)
- [on](L1_PolygonFxBaseRootTunnel.md#on)
- [once](L1_PolygonFxBaseRootTunnel.md#once)
- [populateTransaction](L1_PolygonFxBaseRootTunnel.md#populatetransaction)
- [removeListener](L1_PolygonFxBaseRootTunnel.md#removelistener)

### Methods

- [SEND\_MESSAGE\_EVENT\_SIG](L1_PolygonFxBaseRootTunnel.md#send_message_event_sig)
- [attach](L1_PolygonFxBaseRootTunnel.md#attach)
- [checkpointManager](L1_PolygonFxBaseRootTunnel.md#checkpointmanager)
- [connect](L1_PolygonFxBaseRootTunnel.md#connect)
- [deployed](L1_PolygonFxBaseRootTunnel.md#deployed)
- [fxChildTunnel](L1_PolygonFxBaseRootTunnel.md#fxchildtunnel)
- [fxRoot](L1_PolygonFxBaseRootTunnel.md#fxroot)
- [listeners](L1_PolygonFxBaseRootTunnel.md#listeners)
- [processedExits](L1_PolygonFxBaseRootTunnel.md#processedexits)
- [queryFilter](L1_PolygonFxBaseRootTunnel.md#queryfilter)
- [receiveMessage](L1_PolygonFxBaseRootTunnel.md#receivemessage)
- [removeAllListeners](L1_PolygonFxBaseRootTunnel.md#removealllisteners)
- [setFxChildTunnel](L1_PolygonFxBaseRootTunnel.md#setfxchildtunnel)

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

• **interface**: `L1_PolygonFxBaseRootTunnelInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`L1_PolygonFxBaseRootTunnel`](L1_PolygonFxBaseRootTunnel.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`L1_PolygonFxBaseRootTunnel`](L1_PolygonFxBaseRootTunnel.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`L1_PolygonFxBaseRootTunnel`](L1_PolygonFxBaseRootTunnel.md)\>

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

• **removeListener**: `OnEvent`\<[`L1_PolygonFxBaseRootTunnel`](L1_PolygonFxBaseRootTunnel.md)\>

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

▸ **deployed**(): `Promise`\<[`L1_PolygonFxBaseRootTunnel`](L1_PolygonFxBaseRootTunnel.md)\>

#### Returns

`Promise`\<[`L1_PolygonFxBaseRootTunnel`](L1_PolygonFxBaseRootTunnel.md)\>

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
