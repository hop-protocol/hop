# Interface: Bridge

## Hierarchy

- `BaseContract`

  ↳ **`Bridge`**

## Table of contents

### Properties

- [callStatic](Bridge-1.md#callstatic)
- [estimateGas](Bridge-1.md#estimategas)
- [filters](Bridge-1.md#filters)
- [functions](Bridge-1.md#functions)
- [interface](Bridge-1.md#interface)
- [off](Bridge-1.md#off)
- [on](Bridge-1.md#on)
- [once](Bridge-1.md#once)
- [populateTransaction](Bridge-1.md#populatetransaction)
- [removeListener](Bridge-1.md#removelistener)

### Methods

- [addBonder](Bridge-1.md#addbonder)
- [attach](Bridge-1.md#attach)
- [bondWithdrawal](Bridge-1.md#bondwithdrawal)
- [connect](Bridge-1.md#connect)
- [deployed](Bridge-1.md#deployed)
- [getBondedWithdrawalAmount](Bridge-1.md#getbondedwithdrawalamount)
- [getChainId](Bridge-1.md#getchainid)
- [getCredit](Bridge-1.md#getcredit)
- [getDebitAndAdditionalDebit](Bridge-1.md#getdebitandadditionaldebit)
- [getIsBonder](Bridge-1.md#getisbonder)
- [getRawDebit](Bridge-1.md#getrawdebit)
- [getTransferId](Bridge-1.md#gettransferid)
- [getTransferRoot](Bridge-1.md#gettransferroot)
- [getTransferRootId](Bridge-1.md#gettransferrootid)
- [isTransferIdSpent](Bridge-1.md#istransferidspent)
- [listeners](Bridge-1.md#listeners)
- [queryFilter](Bridge-1.md#queryfilter)
- [removeAllListeners](Bridge-1.md#removealllisteners)
- [removeBonder](Bridge-1.md#removebonder)
- [rescueTransferRoot](Bridge-1.md#rescuetransferroot)
- [settleBondedWithdrawal](Bridge-1.md#settlebondedwithdrawal)
- [settleBondedWithdrawals](Bridge-1.md#settlebondedwithdrawals)
- [stake](Bridge-1.md#stake)
- [unstake](Bridge-1.md#unstake)
- [withdraw](Bridge-1.md#withdraw)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `addBonder` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `bondWithdrawal` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `getBondedWithdrawalAmount` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getCredit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getDebitAndAdditionalDebit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getIsBonder` | (`maybeBonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `getRawDebit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getTransferId` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `getTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`TransferRootStructOutput`](../modules/Bridge.md#transferrootstructoutput)\> |
| `getTransferRootId` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `isTransferIdSpent` | (`transferId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `removeBonder` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `rescueTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `originalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `settleBondedWithdrawal` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferId`: `PromiseOrValue`\<`BytesLike`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `transferRootTotalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `transferIdTreeIndex`: `PromiseOrValue`\<`BigNumberish`\>, `siblings`: `PromiseOrValue`\<`BytesLike`\>[], `totalLeaves`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `settleBondedWithdrawals` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferIds`: `PromiseOrValue`\<`BytesLike`\>[], `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `stake` | (`bonder`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `unstake` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `withdraw` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `transferRootTotalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `transferIdTreeIndex`: `PromiseOrValue`\<`BigNumberish`\>, `siblings`: `PromiseOrValue`\<`BytesLike`\>[], `totalLeaves`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `addBonder` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `bondWithdrawal` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `getBondedWithdrawalAmount` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getCredit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getDebitAndAdditionalDebit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getIsBonder` | (`maybeBonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getRawDebit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getTransferId` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getTransferRootId` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `isTransferIdSpent` | (`transferId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `removeBonder` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `rescueTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `originalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `settleBondedWithdrawal` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferId`: `PromiseOrValue`\<`BytesLike`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `transferRootTotalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `transferIdTreeIndex`: `PromiseOrValue`\<`BigNumberish`\>, `siblings`: `PromiseOrValue`\<`BytesLike`\>[], `totalLeaves`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `settleBondedWithdrawals` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferIds`: `PromiseOrValue`\<`BytesLike`\>[], `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `stake` | (`bonder`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `unstake` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `withdraw` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `transferRootTotalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `transferIdTreeIndex`: `PromiseOrValue`\<`BigNumberish`\>, `siblings`: `PromiseOrValue`\<`BytesLike`\>[], `totalLeaves`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `BonderAdded` | (`newBonder?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `BonderAddedEventFilter` |
| `BonderAdded(address)` | (`newBonder?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `BonderAddedEventFilter` |
| `BonderRemoved` | (`previousBonder?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `BonderRemovedEventFilter` |
| `BonderRemoved(address)` | (`previousBonder?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `BonderRemovedEventFilter` |
| `MultipleWithdrawalsSettled` | (`bonder?`: ``null`` \| `PromiseOrValue`\<`string`\>, `rootHash?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `totalBondsSettled?`: ``null``) => `MultipleWithdrawalsSettledEventFilter` |
| `MultipleWithdrawalsSettled(address,bytes32,uint256)` | (`bonder?`: ``null`` \| `PromiseOrValue`\<`string`\>, `rootHash?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `totalBondsSettled?`: ``null``) => `MultipleWithdrawalsSettledEventFilter` |
| `Stake` | (`account?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``) => `StakeEventFilter` |
| `Stake(address,uint256)` | (`account?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``) => `StakeEventFilter` |
| `TransferRootSet` | (`rootHash?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `totalAmount?`: ``null``) => `TransferRootSetEventFilter` |
| `TransferRootSet(bytes32,uint256)` | (`rootHash?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `totalAmount?`: ``null``) => `TransferRootSetEventFilter` |
| `Unstake` | (`account?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``) => `UnstakeEventFilter` |
| `Unstake(address,uint256)` | (`account?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``) => `UnstakeEventFilter` |
| `WithdrawalBondSettled` | (`bonder?`: ``null`` \| `PromiseOrValue`\<`string`\>, `transferId?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `rootHash?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>) => `WithdrawalBondSettledEventFilter` |
| `WithdrawalBondSettled(address,bytes32,bytes32)` | (`bonder?`: ``null`` \| `PromiseOrValue`\<`string`\>, `transferId?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `rootHash?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>) => `WithdrawalBondSettledEventFilter` |
| `WithdrawalBonded` | (`transferId?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `amount?`: ``null``) => `WithdrawalBondedEventFilter` |
| `WithdrawalBonded(bytes32,uint256)` | (`transferId?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `amount?`: ``null``) => `WithdrawalBondedEventFilter` |
| `Withdrew` | (`transferId?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `recipient?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``, `transferNonce?`: ``null``) => `WithdrewEventFilter` |
| `Withdrew(bytes32,address,uint256,bytes32)` | (`transferId?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `recipient?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``, `transferNonce?`: ``null``) => `WithdrewEventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `addBonder` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `bondWithdrawal` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `getBondedWithdrawalAmount` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`] & \{ `chainId`: `BigNumber`  }\> |
| `getCredit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getDebitAndAdditionalDebit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getIsBonder` | (`maybeBonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `getRawDebit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getTransferId` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `getTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[[`TransferRootStructOutput`](../modules/Bridge.md#transferrootstructoutput)]\> |
| `getTransferRootId` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `isTransferIdSpent` | (`transferId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `removeBonder` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `rescueTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `originalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `settleBondedWithdrawal` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferId`: `PromiseOrValue`\<`BytesLike`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `transferRootTotalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `transferIdTreeIndex`: `PromiseOrValue`\<`BigNumberish`\>, `siblings`: `PromiseOrValue`\<`BytesLike`\>[], `totalLeaves`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `settleBondedWithdrawals` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferIds`: `PromiseOrValue`\<`BytesLike`\>[], `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `stake` | (`bonder`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `unstake` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `withdraw` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `transferRootTotalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `transferIdTreeIndex`: `PromiseOrValue`\<`BigNumberish`\>, `siblings`: `PromiseOrValue`\<`BytesLike`\>[], `totalLeaves`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `BridgeInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`Bridge`](Bridge-1.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`Bridge`](Bridge-1.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`Bridge`](Bridge-1.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `addBonder` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `bondWithdrawal` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `getBondedWithdrawalAmount` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getCredit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getDebitAndAdditionalDebit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getIsBonder` | (`maybeBonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getRawDebit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getTransferId` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getTransferRootId` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `isTransferIdSpent` | (`transferId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `removeBonder` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `rescueTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `originalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `settleBondedWithdrawal` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferId`: `PromiseOrValue`\<`BytesLike`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `transferRootTotalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `transferIdTreeIndex`: `PromiseOrValue`\<`BigNumberish`\>, `siblings`: `PromiseOrValue`\<`BytesLike`\>[], `totalLeaves`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `settleBondedWithdrawals` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferIds`: `PromiseOrValue`\<`BytesLike`\>[], `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `stake` | (`bonder`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `unstake` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `withdraw` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `transferRootTotalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `transferIdTreeIndex`: `PromiseOrValue`\<`BigNumberish`\>, `siblings`: `PromiseOrValue`\<`BytesLike`\>[], `totalLeaves`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`Bridge`](Bridge-1.md)\>

#### Overrides

BaseContract.removeListener

## Methods

### <a id="addbonder" name="addbonder"></a> addBonder

▸ **addBonder**(`bonder`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `bonder` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

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

### <a id="bondwithdrawal" name="bondwithdrawal"></a> bondWithdrawal

▸ **bondWithdrawal**(`recipient`, `amount`, `transferNonce`, `bonderFee`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `recipient` | `PromiseOrValue`\<`string`\> |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `transferNonce` | `PromiseOrValue`\<`BytesLike`\> |
| `bonderFee` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

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

▸ **deployed**(): `Promise`\<[`Bridge`](Bridge-1.md)\>

#### Returns

`Promise`\<[`Bridge`](Bridge-1.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="getbondedwithdrawalamount" name="getbondedwithdrawalamount"></a> getBondedWithdrawalAmount

▸ **getBondedWithdrawalAmount**(`bonder`, `transferId`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `bonder` | `PromiseOrValue`\<`string`\> |
| `transferId` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getchainid" name="getchainid"></a> getChainId

▸ **getChainId**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getcredit" name="getcredit"></a> getCredit

▸ **getCredit**(`bonder`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `bonder` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getdebitandadditionaldebit" name="getdebitandadditionaldebit"></a> getDebitAndAdditionalDebit

▸ **getDebitAndAdditionalDebit**(`bonder`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `bonder` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getisbonder" name="getisbonder"></a> getIsBonder

▸ **getIsBonder**(`maybeBonder`, `overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `maybeBonder` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="getrawdebit" name="getrawdebit"></a> getRawDebit

▸ **getRawDebit**(`bonder`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `bonder` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="gettransferid" name="gettransferid"></a> getTransferId

▸ **getTransferId**(`chainId`, `recipient`, `amount`, `transferNonce`, `bonderFee`, `amountOutMin`, `deadline`, `overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `PromiseOrValue`\<`BigNumberish`\> |
| `recipient` | `PromiseOrValue`\<`string`\> |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `transferNonce` | `PromiseOrValue`\<`BytesLike`\> |
| `bonderFee` | `PromiseOrValue`\<`BigNumberish`\> |
| `amountOutMin` | `PromiseOrValue`\<`BigNumberish`\> |
| `deadline` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="gettransferroot" name="gettransferroot"></a> getTransferRoot

▸ **getTransferRoot**(`rootHash`, `totalAmount`, `overrides?`): `Promise`\<[`TransferRootStructOutput`](../modules/Bridge.md#transferrootstructoutput)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootHash` | `PromiseOrValue`\<`BytesLike`\> |
| `totalAmount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<[`TransferRootStructOutput`](../modules/Bridge.md#transferrootstructoutput)\>

___

### <a id="gettransferrootid" name="gettransferrootid"></a> getTransferRootId

▸ **getTransferRootId**(`rootHash`, `totalAmount`, `overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootHash` | `PromiseOrValue`\<`BytesLike`\> |
| `totalAmount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="istransferidspent" name="istransferidspent"></a> isTransferIdSpent

▸ **isTransferIdSpent**(`transferId`, `overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transferId` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

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

### <a id="removebonder" name="removebonder"></a> removeBonder

▸ **removeBonder**(`bonder`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `bonder` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="rescuetransferroot" name="rescuetransferroot"></a> rescueTransferRoot

▸ **rescueTransferRoot**(`rootHash`, `originalAmount`, `recipient`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootHash` | `PromiseOrValue`\<`BytesLike`\> |
| `originalAmount` | `PromiseOrValue`\<`BigNumberish`\> |
| `recipient` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="settlebondedwithdrawal" name="settlebondedwithdrawal"></a> settleBondedWithdrawal

▸ **settleBondedWithdrawal**(`bonder`, `transferId`, `rootHash`, `transferRootTotalAmount`, `transferIdTreeIndex`, `siblings`, `totalLeaves`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `bonder` | `PromiseOrValue`\<`string`\> |
| `transferId` | `PromiseOrValue`\<`BytesLike`\> |
| `rootHash` | `PromiseOrValue`\<`BytesLike`\> |
| `transferRootTotalAmount` | `PromiseOrValue`\<`BigNumberish`\> |
| `transferIdTreeIndex` | `PromiseOrValue`\<`BigNumberish`\> |
| `siblings` | `PromiseOrValue`\<`BytesLike`\>[] |
| `totalLeaves` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="settlebondedwithdrawals" name="settlebondedwithdrawals"></a> settleBondedWithdrawals

▸ **settleBondedWithdrawals**(`bonder`, `transferIds`, `totalAmount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `bonder` | `PromiseOrValue`\<`string`\> |
| `transferIds` | `PromiseOrValue`\<`BytesLike`\>[] |
| `totalAmount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="stake" name="stake"></a> stake

▸ **stake**(`bonder`, `amount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `bonder` | `PromiseOrValue`\<`string`\> |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="unstake" name="unstake"></a> unstake

▸ **unstake**(`amount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="withdraw" name="withdraw"></a> withdraw

▸ **withdraw**(`recipient`, `amount`, `transferNonce`, `bonderFee`, `amountOutMin`, `deadline`, `rootHash`, `transferRootTotalAmount`, `transferIdTreeIndex`, `siblings`, `totalLeaves`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `recipient` | `PromiseOrValue`\<`string`\> |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `transferNonce` | `PromiseOrValue`\<`BytesLike`\> |
| `bonderFee` | `PromiseOrValue`\<`BigNumberish`\> |
| `amountOutMin` | `PromiseOrValue`\<`BigNumberish`\> |
| `deadline` | `PromiseOrValue`\<`BigNumberish`\> |
| `rootHash` | `PromiseOrValue`\<`BytesLike`\> |
| `transferRootTotalAmount` | `PromiseOrValue`\<`BigNumberish`\> |
| `transferIdTreeIndex` | `PromiseOrValue`\<`BigNumberish`\> |
| `siblings` | `PromiseOrValue`\<`BytesLike`\>[] |
| `totalLeaves` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>
