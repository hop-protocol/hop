# Interface: L1\_OptimismTokenBridge

## Hierarchy

- `BaseContract`

  ↳ **`L1_OptimismTokenBridge`**

## Table of contents

### Properties

- [callStatic](L1_OptimismTokenBridge.md#callstatic)
- [estimateGas](L1_OptimismTokenBridge.md#estimategas)
- [filters](L1_OptimismTokenBridge.md#filters)
- [functions](L1_OptimismTokenBridge.md#functions)
- [interface](L1_OptimismTokenBridge.md#interface)
- [off](L1_OptimismTokenBridge.md#off)
- [on](L1_OptimismTokenBridge.md#on)
- [once](L1_OptimismTokenBridge.md#once)
- [populateTransaction](L1_OptimismTokenBridge.md#populatetransaction)
- [removeListener](L1_OptimismTokenBridge.md#removelistener)

### Methods

- [attach](L1_OptimismTokenBridge.md#attach)
- [connect](L1_OptimismTokenBridge.md#connect)
- [deployed](L1_OptimismTokenBridge.md#deployed)
- [deposit](L1_OptimismTokenBridge.md#deposit)
- [l1ERC20](L1_OptimismTokenBridge.md#l1erc20)
- [l2ERC20Address](L1_OptimismTokenBridge.md#l2erc20address)
- [listeners](L1_OptimismTokenBridge.md#listeners)
- [messenger](L1_OptimismTokenBridge.md#messenger)
- [queryFilter](L1_OptimismTokenBridge.md#queryfilter)
- [removeAllListeners](L1_OptimismTokenBridge.md#removealllisteners)
- [setL1ERC20](L1_OptimismTokenBridge.md#setl1erc20)
- [setL2ERC20](L1_OptimismTokenBridge.md#setl2erc20)
- [setMessenger](L1_OptimismTokenBridge.md#setmessenger)
- [withdraw](L1_OptimismTokenBridge.md#withdraw)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `deposit` | (`_l1TokenAddress`: `PromiseOrValue`\<`string`\>, `_l2TokenAddress`: `PromiseOrValue`\<`string`\>, `_depositor`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `l1ERC20` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `l2ERC20Address` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `messenger` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `setL1ERC20` | (`_l1erc20`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setL2ERC20` | (`_l2erc20`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setMessenger` | (`_messenger`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `withdraw` | (`_withdrawer`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `deposit` | (`_l1TokenAddress`: `PromiseOrValue`\<`string`\>, `_l2TokenAddress`: `PromiseOrValue`\<`string`\>, `_depositor`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `l1ERC20` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l2ERC20Address` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `messenger` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `setL1ERC20` | (`_l1erc20`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setL2ERC20` | (`_l2erc20`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setMessenger` | (`_messenger`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `withdraw` | (`_withdrawer`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

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
| `l1ERC20` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `l2ERC20Address` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `messenger` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `setL1ERC20` | (`_l1erc20`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setL2ERC20` | (`_l2erc20`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setMessenger` | (`_messenger`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `withdraw` | (`_withdrawer`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `L1_OptimismTokenBridgeInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`L1_OptimismTokenBridge`](L1_OptimismTokenBridge.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`L1_OptimismTokenBridge`](L1_OptimismTokenBridge.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`L1_OptimismTokenBridge`](L1_OptimismTokenBridge.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `deposit` | (`_l1TokenAddress`: `PromiseOrValue`\<`string`\>, `_l2TokenAddress`: `PromiseOrValue`\<`string`\>, `_depositor`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `l1ERC20` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `l2ERC20Address` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `messenger` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `setL1ERC20` | (`_l1erc20`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setL2ERC20` | (`_l2erc20`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setMessenger` | (`_messenger`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `withdraw` | (`_withdrawer`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`L1_OptimismTokenBridge`](L1_OptimismTokenBridge.md)\>

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

▸ **deployed**(): `Promise`\<[`L1_OptimismTokenBridge`](L1_OptimismTokenBridge.md)\>

#### Returns

`Promise`\<[`L1_OptimismTokenBridge`](L1_OptimismTokenBridge.md)\>

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

### <a id="l1erc20" name="l1erc20"></a> l1ERC20

▸ **l1ERC20**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="l2erc20address" name="l2erc20address"></a> l2ERC20Address

▸ **l2ERC20Address**(`overrides?`): `Promise`\<`string`\>

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

### <a id="setl1erc20" name="setl1erc20"></a> setL1ERC20

▸ **setL1ERC20**(`_l1erc20`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_l1erc20` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setl2erc20" name="setl2erc20"></a> setL2ERC20

▸ **setL2ERC20**(`_l2erc20`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_l2erc20` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setmessenger" name="setmessenger"></a> setMessenger

▸ **setMessenger**(`_messenger`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_messenger` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="withdraw" name="withdraw"></a> withdraw

▸ **withdraw**(`_withdrawer`, `_amount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_withdrawer` | `PromiseOrValue`\<`string`\> |
| `_amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>
