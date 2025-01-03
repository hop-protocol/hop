# Interface: IArbSys

## Hierarchy

- `BaseContract`

  ↳ **`IArbSys`**

## Table of contents

### Properties

- [callStatic](IArbSys.md#callstatic)
- [estimateGas](IArbSys.md#estimategas)
- [filters](IArbSys.md#filters)
- [functions](IArbSys.md#functions)
- [interface](IArbSys.md#interface)
- [off](IArbSys.md#off)
- [on](IArbSys.md#on)
- [once](IArbSys.md#once)
- [populateTransaction](IArbSys.md#populatetransaction)
- [removeListener](IArbSys.md#removelistener)

### Methods

- [arbOSVersion](IArbSys.md#arbosversion)
- [attach](IArbSys.md#attach)
- [connect](IArbSys.md#connect)
- [deployed](IArbSys.md#deployed)
- [getTransactionCount](IArbSys.md#gettransactioncount)
- [listeners](IArbSys.md#listeners)
- [queryFilter](IArbSys.md#queryfilter)
- [removeAllListeners](IArbSys.md#removealllisteners)
- [sendTxToL1](IArbSys.md#sendtxtol1)
- [withdrawEth](IArbSys.md#withdraweth)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `arbOSVersion` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getTransactionCount` | (`account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `sendTxToL1` | (`destAddr`: `PromiseOrValue`\<`string`\>, `calldataForL1`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `withdrawEth` | (`dest`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `arbOSVersion` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getTransactionCount` | (`account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `sendTxToL1` | (`destAddr`: `PromiseOrValue`\<`string`\>, `calldataForL1`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `withdrawEth` | (`dest`: `PromiseOrValue`\<`string`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ERC20Withdrawal` | (`destAddr?`: ``null`` \| `PromiseOrValue`\<`string`\>, `tokenAddr?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``) => `ERC20WithdrawalEventFilter` |
| `ERC20Withdrawal(address,address,uint256)` | (`destAddr?`: ``null`` \| `PromiseOrValue`\<`string`\>, `tokenAddr?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``) => `ERC20WithdrawalEventFilter` |
| `ERC721Withdrawal` | (`destAddr?`: ``null`` \| `PromiseOrValue`\<`string`\>, `tokenAddr?`: ``null`` \| `PromiseOrValue`\<`string`\>, `id?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>) => `ERC721WithdrawalEventFilter` |
| `ERC721Withdrawal(address,address,uint256)` | (`destAddr?`: ``null`` \| `PromiseOrValue`\<`string`\>, `tokenAddr?`: ``null`` \| `PromiseOrValue`\<`string`\>, `id?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>) => `ERC721WithdrawalEventFilter` |
| `EthWithdrawal` | (`destAddr?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``) => `EthWithdrawalEventFilter` |
| `EthWithdrawal(address,uint256)` | (`destAddr?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``) => `EthWithdrawalEventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `arbOSVersion` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getTransactionCount` | (`account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `sendTxToL1` | (`destAddr`: `PromiseOrValue`\<`string`\>, `calldataForL1`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `withdrawEth` | (`dest`: `PromiseOrValue`\<`string`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `IArbSysInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`IArbSys`](IArbSys.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`IArbSys`](IArbSys.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`IArbSys`](IArbSys.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `arbOSVersion` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getTransactionCount` | (`account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `sendTxToL1` | (`destAddr`: `PromiseOrValue`\<`string`\>, `calldataForL1`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `withdrawEth` | (`dest`: `PromiseOrValue`\<`string`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`IArbSys`](IArbSys.md)\>

#### Overrides

BaseContract.removeListener

## Methods

### <a id="arbosversion" name="arbosversion"></a> arbOSVersion

▸ **arbOSVersion**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

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

▸ **deployed**(): `Promise`\<[`IArbSys`](IArbSys.md)\>

#### Returns

`Promise`\<[`IArbSys`](IArbSys.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="gettransactioncount" name="gettransactioncount"></a> getTransactionCount

▸ **getTransactionCount**(`account`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `account` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

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

### <a id="sendtxtol1" name="sendtxtol1"></a> sendTxToL1

▸ **sendTxToL1**(`destAddr`, `calldataForL1`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `destAddr` | `PromiseOrValue`\<`string`\> |
| `calldataForL1` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="withdraweth" name="withdraweth"></a> withdrawEth

▸ **withdrawEth**(`dest`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `dest` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>
