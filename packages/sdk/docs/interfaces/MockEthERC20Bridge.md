# Interface: MockEthERC20Bridge

## Hierarchy

- `BaseContract`

  ↳ **`MockEthERC20Bridge`**

## Table of contents

### Properties

- [callStatic](MockEthERC20Bridge.md#callstatic)
- [estimateGas](MockEthERC20Bridge.md#estimategas)
- [filters](MockEthERC20Bridge.md#filters)
- [functions](MockEthERC20Bridge.md#functions)
- [interface](MockEthERC20Bridge.md#interface)
- [off](MockEthERC20Bridge.md#off)
- [on](MockEthERC20Bridge.md#on)
- [once](MockEthERC20Bridge.md#once)
- [populateTransaction](MockEthERC20Bridge.md#populatetransaction)
- [removeListener](MockEthERC20Bridge.md#removelistener)

### Methods

- [attach](MockEthERC20Bridge.md#attach)
- [connect](MockEthERC20Bridge.md#connect)
- [deployed](MockEthERC20Bridge.md#deployed)
- [depositAsERC20](MockEthERC20Bridge.md#depositaserc20)
- [listeners](MockEthERC20Bridge.md#listeners)
- [queryFilter](MockEthERC20Bridge.md#queryfilter)
- [removeAllListeners](MockEthERC20Bridge.md#removealllisteners)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `depositAsERC20` | (`erc20`: `PromiseOrValue`\<`string`\>, `destination`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `maxSubmissionCost`: `PromiseOrValue`\<`BigNumberish`\>, `maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `callHookData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `depositAsERC20` | (`erc20`: `PromiseOrValue`\<`string`\>, `destination`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `maxSubmissionCost`: `PromiseOrValue`\<`BigNumberish`\>, `maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `callHookData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

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
| `depositAsERC20` | (`erc20`: `PromiseOrValue`\<`string`\>, `destination`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `maxSubmissionCost`: `PromiseOrValue`\<`BigNumberish`\>, `maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `callHookData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `MockEthERC20BridgeInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`MockEthERC20Bridge`](MockEthERC20Bridge.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`MockEthERC20Bridge`](MockEthERC20Bridge.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`MockEthERC20Bridge`](MockEthERC20Bridge.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `depositAsERC20` | (`erc20`: `PromiseOrValue`\<`string`\>, `destination`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `maxSubmissionCost`: `PromiseOrValue`\<`BigNumberish`\>, `maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `callHookData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`MockEthERC20Bridge`](MockEthERC20Bridge.md)\>

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

▸ **deployed**(): `Promise`\<[`MockEthERC20Bridge`](MockEthERC20Bridge.md)\>

#### Returns

`Promise`\<[`MockEthERC20Bridge`](MockEthERC20Bridge.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="depositaserc20" name="depositaserc20"></a> depositAsERC20

▸ **depositAsERC20**(`erc20`, `destination`, `amount`, `maxSubmissionCost`, `maxGas`, `gasPriceBid`, `callHookData`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `erc20` | `PromiseOrValue`\<`string`\> |
| `destination` | `PromiseOrValue`\<`string`\> |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `maxSubmissionCost` | `PromiseOrValue`\<`BigNumberish`\> |
| `maxGas` | `PromiseOrValue`\<`BigNumberish`\> |
| `gasPriceBid` | `PromiseOrValue`\<`BigNumberish`\> |
| `callHookData` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

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
