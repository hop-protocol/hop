# Interface: FxBaseChildTunnel

## Hierarchy

- `BaseContract`

  ↳ **`FxBaseChildTunnel`**

## Table of contents

### Properties

- [callStatic](FxBaseChildTunnel.md#callstatic)
- [estimateGas](FxBaseChildTunnel.md#estimategas)
- [filters](FxBaseChildTunnel.md#filters)
- [functions](FxBaseChildTunnel.md#functions)
- [interface](FxBaseChildTunnel.md#interface)
- [off](FxBaseChildTunnel.md#off)
- [on](FxBaseChildTunnel.md#on)
- [once](FxBaseChildTunnel.md#once)
- [populateTransaction](FxBaseChildTunnel.md#populatetransaction)
- [removeListener](FxBaseChildTunnel.md#removelistener)

### Methods

- [attach](FxBaseChildTunnel.md#attach)
- [connect](FxBaseChildTunnel.md#connect)
- [deployed](FxBaseChildTunnel.md#deployed)
- [fxChild](FxBaseChildTunnel.md#fxchild)
- [fxRootTunnel](FxBaseChildTunnel.md#fxroottunnel)
- [listeners](FxBaseChildTunnel.md#listeners)
- [processMessageFromRoot](FxBaseChildTunnel.md#processmessagefromroot)
- [queryFilter](FxBaseChildTunnel.md#queryfilter)
- [removeAllListeners](FxBaseChildTunnel.md#removealllisteners)
- [setFxRootTunnel](FxBaseChildTunnel.md#setfxroottunnel)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fxChild` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `fxRootTunnel` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `processMessageFromRoot` | (`stateId`: `PromiseOrValue`\<`BigNumberish`\>, `rootMessageSender`: `PromiseOrValue`\<`string`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setFxRootTunnel` | (`_fxRootTunnel`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fxChild` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `fxRootTunnel` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `processMessageFromRoot` | (`stateId`: `PromiseOrValue`\<`BigNumberish`\>, `rootMessageSender`: `PromiseOrValue`\<`string`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setFxRootTunnel` | (`_fxRootTunnel`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

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
| `fxChild` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `fxRootTunnel` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `processMessageFromRoot` | (`stateId`: `PromiseOrValue`\<`BigNumberish`\>, `rootMessageSender`: `PromiseOrValue`\<`string`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setFxRootTunnel` | (`_fxRootTunnel`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `FxBaseChildTunnelInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`FxBaseChildTunnel`](FxBaseChildTunnel.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`FxBaseChildTunnel`](FxBaseChildTunnel.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`FxBaseChildTunnel`](FxBaseChildTunnel.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fxChild` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `fxRootTunnel` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `processMessageFromRoot` | (`stateId`: `PromiseOrValue`\<`BigNumberish`\>, `rootMessageSender`: `PromiseOrValue`\<`string`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setFxRootTunnel` | (`_fxRootTunnel`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`FxBaseChildTunnel`](FxBaseChildTunnel.md)\>

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

▸ **deployed**(): `Promise`\<[`FxBaseChildTunnel`](FxBaseChildTunnel.md)\>

#### Returns

`Promise`\<[`FxBaseChildTunnel`](FxBaseChildTunnel.md)\>

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

### <a id="setfxroottunnel" name="setfxroottunnel"></a> setFxRootTunnel

▸ **setFxRootTunnel**(`_fxRootTunnel`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_fxRootTunnel` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>
