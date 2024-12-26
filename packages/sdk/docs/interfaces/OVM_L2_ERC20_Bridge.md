# Interface: OVM\_L2\_ERC20\_Bridge

## Hierarchy

- `BaseContract`

  ↳ **`OVM_L2_ERC20_Bridge`**

## Table of contents

### Properties

- [callStatic](OVM_L2_ERC20_Bridge.md#callstatic)
- [estimateGas](OVM_L2_ERC20_Bridge.md#estimategas)
- [filters](OVM_L2_ERC20_Bridge.md#filters)
- [functions](OVM_L2_ERC20_Bridge.md#functions)
- [interface](OVM_L2_ERC20_Bridge.md#interface)
- [off](OVM_L2_ERC20_Bridge.md#off)
- [on](OVM_L2_ERC20_Bridge.md#on)
- [once](OVM_L2_ERC20_Bridge.md#once)
- [populateTransaction](OVM_L2_ERC20_Bridge.md#populatetransaction)
- [removeListener](OVM_L2_ERC20_Bridge.md#removelistener)

### Methods

- [attach](OVM_L2_ERC20_Bridge.md#attach)
- [connect](OVM_L2_ERC20_Bridge.md#connect)
- [deployed](OVM_L2_ERC20_Bridge.md#deployed)
- [l1ERC20BridgeAddress](OVM_L2_ERC20_Bridge.md#l1erc20bridgeaddress)
- [l2Messenger](OVM_L2_ERC20_Bridge.md#l2messenger)
- [listeners](OVM_L2_ERC20_Bridge.md#listeners)
- [queryFilter](OVM_L2_ERC20_Bridge.md#queryfilter)
- [removeAllListeners](OVM_L2_ERC20_Bridge.md#removealllisteners)
- [withdraw](OVM_L2_ERC20_Bridge.md#withdraw)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `l1ERC20BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `l2Messenger` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `withdraw` | (`_l1TokenAddress`: `PromiseOrValue`\<`string`\>, `_l2TokenAddress`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `l1ERC20BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l2Messenger` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `withdraw` | (`_l1TokenAddress`: `PromiseOrValue`\<`string`\>, `_l2TokenAddress`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

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
| `l1ERC20BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `l2Messenger` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `withdraw` | (`_l1TokenAddress`: `PromiseOrValue`\<`string`\>, `_l2TokenAddress`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `OVM_L2_ERC20_BridgeInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`OVM_L2_ERC20_Bridge`](OVM_L2_ERC20_Bridge.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`OVM_L2_ERC20_Bridge`](OVM_L2_ERC20_Bridge.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`OVM_L2_ERC20_Bridge`](OVM_L2_ERC20_Bridge.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `l1ERC20BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `l2Messenger` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `withdraw` | (`_l1TokenAddress`: `PromiseOrValue`\<`string`\>, `_l2TokenAddress`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`OVM_L2_ERC20_Bridge`](OVM_L2_ERC20_Bridge.md)\>

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

▸ **deployed**(): `Promise`\<[`OVM_L2_ERC20_Bridge`](OVM_L2_ERC20_Bridge.md)\>

#### Returns

`Promise`\<[`OVM_L2_ERC20_Bridge`](OVM_L2_ERC20_Bridge.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="l1erc20bridgeaddress" name="l1erc20bridgeaddress"></a> l1ERC20BridgeAddress

▸ **l1ERC20BridgeAddress**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="l2messenger" name="l2messenger"></a> l2Messenger

▸ **l2Messenger**(`overrides?`): `Promise`\<`string`\>

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

### <a id="withdraw" name="withdraw"></a> withdraw

▸ **withdraw**(`_l1TokenAddress`, `_l2TokenAddress`, `_amount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_l1TokenAddress` | `PromiseOrValue`\<`string`\> |
| `_l2TokenAddress` | `PromiseOrValue`\<`string`\> |
| `_amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>
