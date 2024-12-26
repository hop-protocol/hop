# Interface: ISwapFlashLoan

## Hierarchy

- `BaseContract`

  ↳ **`ISwapFlashLoan`**

## Table of contents

### Properties

- [callStatic](ISwapFlashLoan.md#callstatic)
- [estimateGas](ISwapFlashLoan.md#estimategas)
- [filters](ISwapFlashLoan.md#filters)
- [functions](ISwapFlashLoan.md#functions)
- [interface](ISwapFlashLoan.md#interface)
- [off](ISwapFlashLoan.md#off)
- [on](ISwapFlashLoan.md#on)
- [once](ISwapFlashLoan.md#once)
- [populateTransaction](ISwapFlashLoan.md#populatetransaction)
- [removeListener](ISwapFlashLoan.md#removelistener)

### Methods

- [addLiquidity](ISwapFlashLoan.md#addliquidity)
- [attach](ISwapFlashLoan.md#attach)
- [calculateRemoveLiquidity](ISwapFlashLoan.md#calculateremoveliquidity)
- [calculateRemoveLiquidityOneToken](ISwapFlashLoan.md#calculateremoveliquidityonetoken)
- [calculateSwap](ISwapFlashLoan.md#calculateswap)
- [calculateTokenAmount](ISwapFlashLoan.md#calculatetokenamount)
- [connect](ISwapFlashLoan.md#connect)
- [deployed](ISwapFlashLoan.md#deployed)
- [flashLoan](ISwapFlashLoan.md#flashloan)
- [getA](ISwapFlashLoan.md#geta)
- [getAllowlist](ISwapFlashLoan.md#getallowlist)
- [getToken](ISwapFlashLoan.md#gettoken)
- [getTokenBalance](ISwapFlashLoan.md#gettokenbalance)
- [getTokenIndex](ISwapFlashLoan.md#gettokenindex)
- [getVirtualPrice](ISwapFlashLoan.md#getvirtualprice)
- [initialize](ISwapFlashLoan.md#initialize)
- [isGuarded](ISwapFlashLoan.md#isguarded)
- [listeners](ISwapFlashLoan.md#listeners)
- [queryFilter](ISwapFlashLoan.md#queryfilter)
- [removeAllListeners](ISwapFlashLoan.md#removealllisteners)
- [removeLiquidity](ISwapFlashLoan.md#removeliquidity)
- [removeLiquidityImbalance](ISwapFlashLoan.md#removeliquidityimbalance)
- [removeLiquidityOneToken](ISwapFlashLoan.md#removeliquidityonetoken)
- [swap](ISwapFlashLoan.md#swap)
- [updateUserWithdrawFee](ISwapFlashLoan.md#updateuserwithdrawfee)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `addLiquidity` | (`amounts`: `PromiseOrValue`\<`BigNumberish`\>[], `minToMint`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `calculateRemoveLiquidity` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`[]\> |
| `calculateRemoveLiquidityOneToken` | (`tokenAmount`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndex`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `calculateSwap` | (`tokenIndexFrom`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndexTo`: `PromiseOrValue`\<`BigNumberish`\>, `dx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `calculateTokenAmount` | (`amounts`: `PromiseOrValue`\<`BigNumberish`\>[], `deposit`: `PromiseOrValue`\<`boolean`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `flashLoan` | (`receiver`: `PromiseOrValue`\<`string`\>, `token`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `params`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `getA` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getAllowlist` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `getToken` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `getTokenBalance` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getTokenIndex` | (`tokenAddress`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`number`\> |
| `getVirtualPrice` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `initialize` | (`pooledTokens`: `PromiseOrValue`\<`string`\>[], `decimals`: `PromiseOrValue`\<`BigNumberish`\>[], `lpTokenName`: `PromiseOrValue`\<`string`\>, `lpTokenSymbol`: `PromiseOrValue`\<`string`\>, `a`: `PromiseOrValue`\<`BigNumberish`\>, `fee`: `PromiseOrValue`\<`BigNumberish`\>, `adminFee`: `PromiseOrValue`\<`BigNumberish`\>, `withdrawFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `isGuarded` | (`overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `removeLiquidity` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `minAmounts`: `PromiseOrValue`\<`BigNumberish`\>[], `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`[]\> |
| `removeLiquidityImbalance` | (`amounts`: `PromiseOrValue`\<`BigNumberish`\>[], `maxBurnAmount`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `removeLiquidityOneToken` | (`tokenAmount`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndex`: `PromiseOrValue`\<`BigNumberish`\>, `minAmount`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `swap` | (`tokenIndexFrom`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndexTo`: `PromiseOrValue`\<`BigNumberish`\>, `dx`: `PromiseOrValue`\<`BigNumberish`\>, `minDy`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `updateUserWithdrawFee` | (`recipient`: `PromiseOrValue`\<`string`\>, `transferAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `addLiquidity` | (`amounts`: `PromiseOrValue`\<`BigNumberish`\>[], `minToMint`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `calculateRemoveLiquidity` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `calculateRemoveLiquidityOneToken` | (`tokenAmount`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndex`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `calculateSwap` | (`tokenIndexFrom`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndexTo`: `PromiseOrValue`\<`BigNumberish`\>, `dx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `calculateTokenAmount` | (`amounts`: `PromiseOrValue`\<`BigNumberish`\>[], `deposit`: `PromiseOrValue`\<`boolean`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `flashLoan` | (`receiver`: `PromiseOrValue`\<`string`\>, `token`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `params`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `getA` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getAllowlist` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getToken` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getTokenBalance` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getTokenIndex` | (`tokenAddress`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getVirtualPrice` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `initialize` | (`pooledTokens`: `PromiseOrValue`\<`string`\>[], `decimals`: `PromiseOrValue`\<`BigNumberish`\>[], `lpTokenName`: `PromiseOrValue`\<`string`\>, `lpTokenSymbol`: `PromiseOrValue`\<`string`\>, `a`: `PromiseOrValue`\<`BigNumberish`\>, `fee`: `PromiseOrValue`\<`BigNumberish`\>, `adminFee`: `PromiseOrValue`\<`BigNumberish`\>, `withdrawFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `isGuarded` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `removeLiquidity` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `minAmounts`: `PromiseOrValue`\<`BigNumberish`\>[], `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `removeLiquidityImbalance` | (`amounts`: `PromiseOrValue`\<`BigNumberish`\>[], `maxBurnAmount`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `removeLiquidityOneToken` | (`tokenAmount`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndex`: `PromiseOrValue`\<`BigNumberish`\>, `minAmount`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `swap` | (`tokenIndexFrom`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndexTo`: `PromiseOrValue`\<`BigNumberish`\>, `dx`: `PromiseOrValue`\<`BigNumberish`\>, `minDy`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `updateUserWithdrawFee` | (`recipient`: `PromiseOrValue`\<`string`\>, `transferAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

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
| `addLiquidity` | (`amounts`: `PromiseOrValue`\<`BigNumberish`\>[], `minToMint`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `calculateRemoveLiquidity` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`[]]\> |
| `calculateRemoveLiquidityOneToken` | (`tokenAmount`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndex`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`] & \{ `availableTokenAmount`: `BigNumber`  }\> |
| `calculateSwap` | (`tokenIndexFrom`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndexTo`: `PromiseOrValue`\<`BigNumberish`\>, `dx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `calculateTokenAmount` | (`amounts`: `PromiseOrValue`\<`BigNumberish`\>[], `deposit`: `PromiseOrValue`\<`boolean`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `flashLoan` | (`receiver`: `PromiseOrValue`\<`string`\>, `token`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `params`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `getA` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getAllowlist` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `getToken` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `getTokenBalance` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getTokenIndex` | (`tokenAddress`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`number`]\> |
| `getVirtualPrice` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `initialize` | (`pooledTokens`: `PromiseOrValue`\<`string`\>[], `decimals`: `PromiseOrValue`\<`BigNumberish`\>[], `lpTokenName`: `PromiseOrValue`\<`string`\>, `lpTokenSymbol`: `PromiseOrValue`\<`string`\>, `a`: `PromiseOrValue`\<`BigNumberish`\>, `fee`: `PromiseOrValue`\<`BigNumberish`\>, `adminFee`: `PromiseOrValue`\<`BigNumberish`\>, `withdrawFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `isGuarded` | (`overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `removeLiquidity` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `minAmounts`: `PromiseOrValue`\<`BigNumberish`\>[], `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `removeLiquidityImbalance` | (`amounts`: `PromiseOrValue`\<`BigNumberish`\>[], `maxBurnAmount`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `removeLiquidityOneToken` | (`tokenAmount`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndex`: `PromiseOrValue`\<`BigNumberish`\>, `minAmount`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `swap` | (`tokenIndexFrom`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndexTo`: `PromiseOrValue`\<`BigNumberish`\>, `dx`: `PromiseOrValue`\<`BigNumberish`\>, `minDy`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `updateUserWithdrawFee` | (`recipient`: `PromiseOrValue`\<`string`\>, `transferAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `ISwapFlashLoanInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`ISwapFlashLoan`](ISwapFlashLoan.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`ISwapFlashLoan`](ISwapFlashLoan.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`ISwapFlashLoan`](ISwapFlashLoan.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `addLiquidity` | (`amounts`: `PromiseOrValue`\<`BigNumberish`\>[], `minToMint`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `calculateRemoveLiquidity` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `calculateRemoveLiquidityOneToken` | (`tokenAmount`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndex`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `calculateSwap` | (`tokenIndexFrom`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndexTo`: `PromiseOrValue`\<`BigNumberish`\>, `dx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `calculateTokenAmount` | (`amounts`: `PromiseOrValue`\<`BigNumberish`\>[], `deposit`: `PromiseOrValue`\<`boolean`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `flashLoan` | (`receiver`: `PromiseOrValue`\<`string`\>, `token`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `params`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `getA` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getAllowlist` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getToken` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getTokenBalance` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getTokenIndex` | (`tokenAddress`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getVirtualPrice` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `initialize` | (`pooledTokens`: `PromiseOrValue`\<`string`\>[], `decimals`: `PromiseOrValue`\<`BigNumberish`\>[], `lpTokenName`: `PromiseOrValue`\<`string`\>, `lpTokenSymbol`: `PromiseOrValue`\<`string`\>, `a`: `PromiseOrValue`\<`BigNumberish`\>, `fee`: `PromiseOrValue`\<`BigNumberish`\>, `adminFee`: `PromiseOrValue`\<`BigNumberish`\>, `withdrawFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `isGuarded` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `removeLiquidity` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `minAmounts`: `PromiseOrValue`\<`BigNumberish`\>[], `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `removeLiquidityImbalance` | (`amounts`: `PromiseOrValue`\<`BigNumberish`\>[], `maxBurnAmount`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `removeLiquidityOneToken` | (`tokenAmount`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndex`: `PromiseOrValue`\<`BigNumberish`\>, `minAmount`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `swap` | (`tokenIndexFrom`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndexTo`: `PromiseOrValue`\<`BigNumberish`\>, `dx`: `PromiseOrValue`\<`BigNumberish`\>, `minDy`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `updateUserWithdrawFee` | (`recipient`: `PromiseOrValue`\<`string`\>, `transferAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`ISwapFlashLoan`](ISwapFlashLoan.md)\>

#### Overrides

BaseContract.removeListener

## Methods

### <a id="addliquidity" name="addliquidity"></a> addLiquidity

▸ **addLiquidity**(`amounts`, `minToMint`, `deadline`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amounts` | `PromiseOrValue`\<`BigNumberish`\>[] |
| `minToMint` | `PromiseOrValue`\<`BigNumberish`\> |
| `deadline` | `PromiseOrValue`\<`BigNumberish`\> |
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

### <a id="calculateremoveliquidity" name="calculateremoveliquidity"></a> calculateRemoveLiquidity

▸ **calculateRemoveLiquidity**(`amount`, `overrides?`): `Promise`\<`BigNumber`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`[]\>

___

### <a id="calculateremoveliquidityonetoken" name="calculateremoveliquidityonetoken"></a> calculateRemoveLiquidityOneToken

▸ **calculateRemoveLiquidityOneToken**(`tokenAmount`, `tokenIndex`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenAmount` | `PromiseOrValue`\<`BigNumberish`\> |
| `tokenIndex` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="calculateswap" name="calculateswap"></a> calculateSwap

▸ **calculateSwap**(`tokenIndexFrom`, `tokenIndexTo`, `dx`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenIndexFrom` | `PromiseOrValue`\<`BigNumberish`\> |
| `tokenIndexTo` | `PromiseOrValue`\<`BigNumberish`\> |
| `dx` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="calculatetokenamount" name="calculatetokenamount"></a> calculateTokenAmount

▸ **calculateTokenAmount**(`amounts`, `deposit`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amounts` | `PromiseOrValue`\<`BigNumberish`\>[] |
| `deposit` | `PromiseOrValue`\<`boolean`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

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

▸ **deployed**(): `Promise`\<[`ISwapFlashLoan`](ISwapFlashLoan.md)\>

#### Returns

`Promise`\<[`ISwapFlashLoan`](ISwapFlashLoan.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="flashloan" name="flashloan"></a> flashLoan

▸ **flashLoan**(`receiver`, `token`, `amount`, `params`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `receiver` | `PromiseOrValue`\<`string`\> |
| `token` | `PromiseOrValue`\<`string`\> |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `params` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="geta" name="geta"></a> getA

▸ **getA**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getallowlist" name="getallowlist"></a> getAllowlist

▸ **getAllowlist**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="gettoken" name="gettoken"></a> getToken

▸ **getToken**(`index`, `overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="gettokenbalance" name="gettokenbalance"></a> getTokenBalance

▸ **getTokenBalance**(`index`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="gettokenindex" name="gettokenindex"></a> getTokenIndex

▸ **getTokenIndex**(`tokenAddress`, `overrides?`): `Promise`\<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenAddress` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`number`\>

___

### <a id="getvirtualprice" name="getvirtualprice"></a> getVirtualPrice

▸ **getVirtualPrice**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="initialize" name="initialize"></a> initialize

▸ **initialize**(`pooledTokens`, `decimals`, `lpTokenName`, `lpTokenSymbol`, `a`, `fee`, `adminFee`, `withdrawFee`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `pooledTokens` | `PromiseOrValue`\<`string`\>[] |
| `decimals` | `PromiseOrValue`\<`BigNumberish`\>[] |
| `lpTokenName` | `PromiseOrValue`\<`string`\> |
| `lpTokenSymbol` | `PromiseOrValue`\<`string`\> |
| `a` | `PromiseOrValue`\<`BigNumberish`\> |
| `fee` | `PromiseOrValue`\<`BigNumberish`\> |
| `adminFee` | `PromiseOrValue`\<`BigNumberish`\> |
| `withdrawFee` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="isguarded" name="isguarded"></a> isGuarded

▸ **isGuarded**(`overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
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

### <a id="removeliquidity" name="removeliquidity"></a> removeLiquidity

▸ **removeLiquidity**(`amount`, `minAmounts`, `deadline`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `minAmounts` | `PromiseOrValue`\<`BigNumberish`\>[] |
| `deadline` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="removeliquidityimbalance" name="removeliquidityimbalance"></a> removeLiquidityImbalance

▸ **removeLiquidityImbalance**(`amounts`, `maxBurnAmount`, `deadline`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amounts` | `PromiseOrValue`\<`BigNumberish`\>[] |
| `maxBurnAmount` | `PromiseOrValue`\<`BigNumberish`\> |
| `deadline` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="removeliquidityonetoken" name="removeliquidityonetoken"></a> removeLiquidityOneToken

▸ **removeLiquidityOneToken**(`tokenAmount`, `tokenIndex`, `minAmount`, `deadline`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenAmount` | `PromiseOrValue`\<`BigNumberish`\> |
| `tokenIndex` | `PromiseOrValue`\<`BigNumberish`\> |
| `minAmount` | `PromiseOrValue`\<`BigNumberish`\> |
| `deadline` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="swap" name="swap"></a> swap

▸ **swap**(`tokenIndexFrom`, `tokenIndexTo`, `dx`, `minDy`, `deadline`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenIndexFrom` | `PromiseOrValue`\<`BigNumberish`\> |
| `tokenIndexTo` | `PromiseOrValue`\<`BigNumberish`\> |
| `dx` | `PromiseOrValue`\<`BigNumberish`\> |
| `minDy` | `PromiseOrValue`\<`BigNumberish`\> |
| `deadline` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="updateuserwithdrawfee" name="updateuserwithdrawfee"></a> updateUserWithdrawFee

▸ **updateUserWithdrawFee**(`recipient`, `transferAmount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `recipient` | `PromiseOrValue`\<`string`\> |
| `transferAmount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>
