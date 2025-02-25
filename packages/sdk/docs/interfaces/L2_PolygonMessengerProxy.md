# Interface: L2\_PolygonMessengerProxy

## Hierarchy

- `BaseContract`

  ↳ **`L2_PolygonMessengerProxy`**

## Table of contents

### Properties

- [callStatic](L2_PolygonMessengerProxy.md#callstatic)
- [estimateGas](L2_PolygonMessengerProxy.md#estimategas)
- [filters](L2_PolygonMessengerProxy.md#filters)
- [functions](L2_PolygonMessengerProxy.md#functions)
- [interface](L2_PolygonMessengerProxy.md#interface)
- [off](L2_PolygonMessengerProxy.md#off)
- [on](L2_PolygonMessengerProxy.md#on)
- [once](L2_PolygonMessengerProxy.md#once)
- [populateTransaction](L2_PolygonMessengerProxy.md#populatetransaction)
- [removeListener](L2_PolygonMessengerProxy.md#removelistener)

### Methods

- [DEAD\_ADDRESS](L2_PolygonMessengerProxy.md#dead_address)
- [attach](L2_PolygonMessengerProxy.md#attach)
- [connect](L2_PolygonMessengerProxy.md#connect)
- [deployed](L2_PolygonMessengerProxy.md#deployed)
- [fxChild](L2_PolygonMessengerProxy.md#fxchild)
- [fxRootTunnel](L2_PolygonMessengerProxy.md#fxroottunnel)
- [l2Bridge](L2_PolygonMessengerProxy.md#l2bridge)
- [listeners](L2_PolygonMessengerProxy.md#listeners)
- [processMessageFromRoot](L2_PolygonMessengerProxy.md#processmessagefromroot)
- [queryFilter](L2_PolygonMessengerProxy.md#queryfilter)
- [removeAllListeners](L2_PolygonMessengerProxy.md#removealllisteners)
- [sendCrossDomainMessage](L2_PolygonMessengerProxy.md#sendcrossdomainmessage)
- [setFxRootTunnel](L2_PolygonMessengerProxy.md#setfxroottunnel)
- [setL2Bridge](L2_PolygonMessengerProxy.md#setl2bridge)
- [xDomainMessageSender](L2_PolygonMessengerProxy.md#xdomainmessagesender)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `DEAD_ADDRESS` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `fxChild` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `fxRootTunnel` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `l2Bridge` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `processMessageFromRoot` | (`stateId`: `PromiseOrValue`\<`BigNumberish`\>, `rootMessageSender`: `PromiseOrValue`\<`string`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `sendCrossDomainMessage` | (`message`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setFxRootTunnel` | (`_fxRootTunnel`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setL2Bridge` | (`_l2Bridge`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `xDomainMessageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `DEAD_ADDRESS` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `fxChild` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `fxRootTunnel` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l2Bridge` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `processMessageFromRoot` | (`stateId`: `PromiseOrValue`\<`BigNumberish`\>, `rootMessageSender`: `PromiseOrValue`\<`string`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `sendCrossDomainMessage` | (`message`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setFxRootTunnel` | (`_fxRootTunnel`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setL2Bridge` | (`_l2Bridge`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `xDomainMessageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `MessageSent` | (`message?`: ``null``) => `MessageSentEventFilter` |
| `MessageSent(bytes)` | (`message?`: ``null``) => `MessageSentEventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `DEAD_ADDRESS` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `fxChild` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `fxRootTunnel` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `l2Bridge` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `processMessageFromRoot` | (`stateId`: `PromiseOrValue`\<`BigNumberish`\>, `rootMessageSender`: `PromiseOrValue`\<`string`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `sendCrossDomainMessage` | (`message`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setFxRootTunnel` | (`_fxRootTunnel`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setL2Bridge` | (`_l2Bridge`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `xDomainMessageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `L2_PolygonMessengerProxyInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`L2_PolygonMessengerProxy`](L2_PolygonMessengerProxy.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`L2_PolygonMessengerProxy`](L2_PolygonMessengerProxy.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`L2_PolygonMessengerProxy`](L2_PolygonMessengerProxy.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `DEAD_ADDRESS` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `fxChild` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `fxRootTunnel` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `l2Bridge` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `processMessageFromRoot` | (`stateId`: `PromiseOrValue`\<`BigNumberish`\>, `rootMessageSender`: `PromiseOrValue`\<`string`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `sendCrossDomainMessage` | (`message`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setFxRootTunnel` | (`_fxRootTunnel`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setL2Bridge` | (`_l2Bridge`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `xDomainMessageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`L2_PolygonMessengerProxy`](L2_PolygonMessengerProxy.md)\>

#### Overrides

BaseContract.removeListener

## Methods

### <a id="dead_address" name="dead_address"></a> DEAD\_ADDRESS

▸ **DEAD_ADDRESS**(`overrides?`): `Promise`\<`string`\>

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

▸ **deployed**(): `Promise`\<[`L2_PolygonMessengerProxy`](L2_PolygonMessengerProxy.md)\>

#### Returns

`Promise`\<[`L2_PolygonMessengerProxy`](L2_PolygonMessengerProxy.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="fxchild" name="fxchild"></a> fxChild

▸ **fxChild**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="fxroottunnel" name="fxroottunnel"></a> fxRootTunnel

▸ **fxRootTunnel**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="l2bridge" name="l2bridge"></a> l2Bridge

▸ **l2Bridge**(`overrides?`): `Promise`\<`string`\>

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

### <a id="processmessagefromroot" name="processmessagefromroot"></a> processMessageFromRoot

▸ **processMessageFromRoot**(`stateId`, `rootMessageSender`, `data`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateId` | `PromiseOrValue`\<`BigNumberish`\> |
| `rootMessageSender` | `PromiseOrValue`\<`string`\> |
| `data` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

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

### <a id="sendcrossdomainmessage" name="sendcrossdomainmessage"></a> sendCrossDomainMessage

▸ **sendCrossDomainMessage**(`message`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setfxroottunnel" name="setfxroottunnel"></a> setFxRootTunnel

▸ **setFxRootTunnel**(`_fxRootTunnel`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_fxRootTunnel` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setl2bridge" name="setl2bridge"></a> setL2Bridge

▸ **setL2Bridge**(`_l2Bridge`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_l2Bridge` | `PromiseOrValue`\<`string`\> |
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
