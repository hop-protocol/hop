# Interface: Arbitrum\_L1\_ERC20\_Bridge

## Hierarchy

- `BaseContract`

  ↳ **`Arbitrum_L1_ERC20_Bridge`**

## Table of contents

### Properties

- [callStatic](Arbitrum_L1_ERC20_Bridge.md#callstatic)
- [estimateGas](Arbitrum_L1_ERC20_Bridge.md#estimategas)
- [filters](Arbitrum_L1_ERC20_Bridge.md#filters)
- [functions](Arbitrum_L1_ERC20_Bridge.md#functions)
- [interface](Arbitrum_L1_ERC20_Bridge.md#interface)
- [off](Arbitrum_L1_ERC20_Bridge.md#off)
- [on](Arbitrum_L1_ERC20_Bridge.md#on)
- [once](Arbitrum_L1_ERC20_Bridge.md#once)
- [populateTransaction](Arbitrum_L1_ERC20_Bridge.md#populatetransaction)
- [removeListener](Arbitrum_L1_ERC20_Bridge.md#removelistener)

### Methods

- [attach](Arbitrum_L1_ERC20_Bridge.md#attach)
- [connect](Arbitrum_L1_ERC20_Bridge.md#connect)
- [deployed](Arbitrum_L1_ERC20_Bridge.md#deployed)
- [deposit](Arbitrum_L1_ERC20_Bridge.md#deposit)
- [listeners](Arbitrum_L1_ERC20_Bridge.md#listeners)
- [messenger](Arbitrum_L1_ERC20_Bridge.md#messenger)
- [queryFilter](Arbitrum_L1_ERC20_Bridge.md#queryfilter)
- [removeAllListeners](Arbitrum_L1_ERC20_Bridge.md#removealllisteners)
- [withdraw](Arbitrum_L1_ERC20_Bridge.md#withdraw)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `deposit` | (`_l1TokenAddress`: `PromiseOrValue`\<`string`\>, `_l2TokenAddress`: `PromiseOrValue`\<`string`\>, `_depositor`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `messenger` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `withdraw` | (`_l1TokenAddress`: `PromiseOrValue`\<`string`\>, `_withdrawer`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `deposit` | (`_l1TokenAddress`: `PromiseOrValue`\<`string`\>, `_l2TokenAddress`: `PromiseOrValue`\<`string`\>, `_depositor`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `messenger` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `withdraw` | (`_l1TokenAddress`: `PromiseOrValue`\<`string`\>, `_withdrawer`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Deposit` | (`_sender?`: ``null`` \| `PromiseOrValue`\<`string`\>, `_amount?`: ``null``) => `DepositEventFilter` |
| `Deposit(address,uint256)` | (`_sender?`: ``null`` \| `PromiseOrValue`\<`string`\>, `_amount?`: ``null``) => `DepositEventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `deposit` | (`_l1TokenAddress`: `PromiseOrValue`\<`string`\>, `_l2TokenAddress`: `PromiseOrValue`\<`string`\>, `_depositor`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `messenger` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `withdraw` | (`_l1TokenAddress`: `PromiseOrValue`\<`string`\>, `_withdrawer`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `Arbitrum_L1_ERC20_BridgeInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`Arbitrum_L1_ERC20_Bridge`](Arbitrum_L1_ERC20_Bridge.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`Arbitrum_L1_ERC20_Bridge`](Arbitrum_L1_ERC20_Bridge.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`Arbitrum_L1_ERC20_Bridge`](Arbitrum_L1_ERC20_Bridge.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `deposit` | (`_l1TokenAddress`: `PromiseOrValue`\<`string`\>, `_l2TokenAddress`: `PromiseOrValue`\<`string`\>, `_depositor`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `messenger` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `withdraw` | (`_l1TokenAddress`: `PromiseOrValue`\<`string`\>, `_withdrawer`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`Arbitrum_L1_ERC20_Bridge`](Arbitrum_L1_ERC20_Bridge.md)\>

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

▸ **deployed**(): `Promise`\<[`Arbitrum_L1_ERC20_Bridge`](Arbitrum_L1_ERC20_Bridge.md)\>

#### Returns

`Promise`\<[`Arbitrum_L1_ERC20_Bridge`](Arbitrum_L1_ERC20_Bridge.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="deposit" name="deposit"></a> deposit

▸ **deposit**(`_l1TokenAddress`, `_l2TokenAddress`, `_depositor`, `_amount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_l1TokenAddress` | `PromiseOrValue`\<`string`\> |
| `_l2TokenAddress` | `PromiseOrValue`\<`string`\> |
| `_depositor` | `PromiseOrValue`\<`string`\> |
| `_amount` | `PromiseOrValue`\<`BigNumberish`\> |
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

### <a id="withdraw" name="withdraw"></a> withdraw

▸ **withdraw**(`_l1TokenAddress`, `_withdrawer`, `_amount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_l1TokenAddress` | `PromiseOrValue`\<`string`\> |
| `_withdrawer` | `PromiseOrValue`\<`string`\> |
| `_amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>
