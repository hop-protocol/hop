# Interface: Swap

## Hierarchy

- `BaseContract`

  ↳ **`Swap`**

## Table of contents

### Properties

- [callStatic](Swap.md#callstatic)
- [estimateGas](Swap.md#estimategas)
- [filters](Swap.md#filters)
- [functions](Swap.md#functions)
- [interface](Swap.md#interface)
- [off](Swap.md#off)
- [on](Swap.md#on)
- [once](Swap.md#once)
- [populateTransaction](Swap.md#populatetransaction)
- [removeListener](Swap.md#removelistener)

### Methods

- [addLiquidity](Swap.md#addliquidity)
- [attach](Swap.md#attach)
- [calculateCurrentWithdrawFee](Swap.md#calculatecurrentwithdrawfee)
- [calculateRemoveLiquidity](Swap.md#calculateremoveliquidity)
- [calculateRemoveLiquidityOneToken](Swap.md#calculateremoveliquidityonetoken)
- [calculateSwap](Swap.md#calculateswap)
- [calculateTokenAmount](Swap.md#calculatetokenamount)
- [connect](Swap.md#connect)
- [deployed](Swap.md#deployed)
- [getA](Swap.md#geta)
- [getAPrecise](Swap.md#getaprecise)
- [getAdminBalance](Swap.md#getadminbalance)
- [getDepositTimestamp](Swap.md#getdeposittimestamp)
- [getToken](Swap.md#gettoken)
- [getTokenBalance](Swap.md#gettokenbalance)
- [getTokenIndex](Swap.md#gettokenindex)
- [getVirtualPrice](Swap.md#getvirtualprice)
- [initialize](Swap.md#initialize)
- [listeners](Swap.md#listeners)
- [queryFilter](Swap.md#queryfilter)
- [removeAllListeners](Swap.md#removealllisteners)
- [removeLiquidity](Swap.md#removeliquidity)
- [removeLiquidityImbalance](Swap.md#removeliquidityimbalance)
- [removeLiquidityOneToken](Swap.md#removeliquidityonetoken)
- [swap](Swap.md#swap)
- [swapStorage](Swap.md#swapstorage)
- [updateUserWithdrawFee](Swap.md#updateuserwithdrawfee)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `addLiquidity` | (`amounts`: `PromiseOrValue`\<`BigNumberish`\>[], `minToMint`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `calculateCurrentWithdrawFee` | (`user`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `calculateRemoveLiquidity` | (`account`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`[]\> |
| `calculateRemoveLiquidityOneToken` | (`account`: `PromiseOrValue`\<`string`\>, `tokenAmount`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndex`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `calculateSwap` | (`tokenIndexFrom`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndexTo`: `PromiseOrValue`\<`BigNumberish`\>, `dx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `calculateTokenAmount` | (`account`: `PromiseOrValue`\<`string`\>, `amounts`: `PromiseOrValue`\<`BigNumberish`\>[], `deposit`: `PromiseOrValue`\<`boolean`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getA` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getAPrecise` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getAdminBalance` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getDepositTimestamp` | (`user`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getToken` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `getTokenBalance` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getTokenIndex` | (`tokenAddress`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`number`\> |
| `getVirtualPrice` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `initialize` | (`_pooledTokens`: `PromiseOrValue`\<`string`\>[], `decimals`: `PromiseOrValue`\<`BigNumberish`\>[], `lpTokenName`: `PromiseOrValue`\<`string`\>, `lpTokenSymbol`: `PromiseOrValue`\<`string`\>, `_a`: `PromiseOrValue`\<`BigNumberish`\>, `_fee`: `PromiseOrValue`\<`BigNumberish`\>, `_adminFee`: `PromiseOrValue`\<`BigNumberish`\>, `_withdrawFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `removeLiquidity` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `minAmounts`: `PromiseOrValue`\<`BigNumberish`\>[], `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`[]\> |
| `removeLiquidityImbalance` | (`amounts`: `PromiseOrValue`\<`BigNumberish`\>[], `maxBurnAmount`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `removeLiquidityOneToken` | (`tokenAmount`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndex`: `PromiseOrValue`\<`BigNumberish`\>, `minAmount`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `swap` | (`tokenIndexFrom`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndexTo`: `PromiseOrValue`\<`BigNumberish`\>, `dx`: `PromiseOrValue`\<`BigNumberish`\>, `minDy`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `swapStorage` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `string`] & \{ `adminFee`: `BigNumber` ; `defaultWithdrawFee`: `BigNumber` ; `futureA`: `BigNumber` ; `futureATime`: `BigNumber` ; `initialA`: `BigNumber` ; `initialATime`: `BigNumber` ; `lpToken`: `string` ; `swapFee`: `BigNumber`  }\> |
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
| `calculateCurrentWithdrawFee` | (`user`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `calculateRemoveLiquidity` | (`account`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `calculateRemoveLiquidityOneToken` | (`account`: `PromiseOrValue`\<`string`\>, `tokenAmount`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndex`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `calculateSwap` | (`tokenIndexFrom`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndexTo`: `PromiseOrValue`\<`BigNumberish`\>, `dx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `calculateTokenAmount` | (`account`: `PromiseOrValue`\<`string`\>, `amounts`: `PromiseOrValue`\<`BigNumberish`\>[], `deposit`: `PromiseOrValue`\<`boolean`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getA` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getAPrecise` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getAdminBalance` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getDepositTimestamp` | (`user`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getToken` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getTokenBalance` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getTokenIndex` | (`tokenAddress`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getVirtualPrice` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `initialize` | (`_pooledTokens`: `PromiseOrValue`\<`string`\>[], `decimals`: `PromiseOrValue`\<`BigNumberish`\>[], `lpTokenName`: `PromiseOrValue`\<`string`\>, `lpTokenSymbol`: `PromiseOrValue`\<`string`\>, `_a`: `PromiseOrValue`\<`BigNumberish`\>, `_fee`: `PromiseOrValue`\<`BigNumberish`\>, `_adminFee`: `PromiseOrValue`\<`BigNumberish`\>, `_withdrawFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `removeLiquidity` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `minAmounts`: `PromiseOrValue`\<`BigNumberish`\>[], `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `removeLiquidityImbalance` | (`amounts`: `PromiseOrValue`\<`BigNumberish`\>[], `maxBurnAmount`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `removeLiquidityOneToken` | (`tokenAmount`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndex`: `PromiseOrValue`\<`BigNumberish`\>, `minAmount`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `swap` | (`tokenIndexFrom`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndexTo`: `PromiseOrValue`\<`BigNumberish`\>, `dx`: `PromiseOrValue`\<`BigNumberish`\>, `minDy`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `swapStorage` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `updateUserWithdrawFee` | (`recipient`: `PromiseOrValue`\<`string`\>, `transferAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `AddLiquidity` | (`provider?`: ``null`` \| `PromiseOrValue`\<`string`\>, `tokenAmounts?`: ``null``, `fees?`: ``null``, `invariant?`: ``null``, `lpTokenSupply?`: ``null``) => `AddLiquidityEventFilter` |
| `AddLiquidity(address,uint256[],uint256[],uint256,uint256)` | (`provider?`: ``null`` \| `PromiseOrValue`\<`string`\>, `tokenAmounts?`: ``null``, `fees?`: ``null``, `invariant?`: ``null``, `lpTokenSupply?`: ``null``) => `AddLiquidityEventFilter` |
| `NewAdminFee` | (`newAdminFee?`: ``null``) => `NewAdminFeeEventFilter` |
| `NewAdminFee(uint256)` | (`newAdminFee?`: ``null``) => `NewAdminFeeEventFilter` |
| `NewSwapFee` | (`newSwapFee?`: ``null``) => `NewSwapFeeEventFilter` |
| `NewSwapFee(uint256)` | (`newSwapFee?`: ``null``) => `NewSwapFeeEventFilter` |
| `NewWithdrawFee` | (`newWithdrawFee?`: ``null``) => `NewWithdrawFeeEventFilter` |
| `NewWithdrawFee(uint256)` | (`newWithdrawFee?`: ``null``) => `NewWithdrawFeeEventFilter` |
| `RampA` | (`oldA?`: ``null``, `newA?`: ``null``, `initialTime?`: ``null``, `futureTime?`: ``null``) => `RampAEventFilter` |
| `RampA(uint256,uint256,uint256,uint256)` | (`oldA?`: ``null``, `newA?`: ``null``, `initialTime?`: ``null``, `futureTime?`: ``null``) => `RampAEventFilter` |
| `RemoveLiquidity` | (`provider?`: ``null`` \| `PromiseOrValue`\<`string`\>, `tokenAmounts?`: ``null``, `lpTokenSupply?`: ``null``) => `RemoveLiquidityEventFilter` |
| `RemoveLiquidity(address,uint256[],uint256)` | (`provider?`: ``null`` \| `PromiseOrValue`\<`string`\>, `tokenAmounts?`: ``null``, `lpTokenSupply?`: ``null``) => `RemoveLiquidityEventFilter` |
| `RemoveLiquidityImbalance` | (`provider?`: ``null`` \| `PromiseOrValue`\<`string`\>, `tokenAmounts?`: ``null``, `fees?`: ``null``, `invariant?`: ``null``, `lpTokenSupply?`: ``null``) => `RemoveLiquidityImbalanceEventFilter` |
| `RemoveLiquidityImbalance(address,uint256[],uint256[],uint256,uint256)` | (`provider?`: ``null`` \| `PromiseOrValue`\<`string`\>, `tokenAmounts?`: ``null``, `fees?`: ``null``, `invariant?`: ``null``, `lpTokenSupply?`: ``null``) => `RemoveLiquidityImbalanceEventFilter` |
| `RemoveLiquidityOne` | (`provider?`: ``null`` \| `PromiseOrValue`\<`string`\>, `lpTokenAmount?`: ``null``, `lpTokenSupply?`: ``null``, `boughtId?`: ``null``, `tokensBought?`: ``null``) => `RemoveLiquidityOneEventFilter` |
| `RemoveLiquidityOne(address,uint256,uint256,uint256,uint256)` | (`provider?`: ``null`` \| `PromiseOrValue`\<`string`\>, `lpTokenAmount?`: ``null``, `lpTokenSupply?`: ``null``, `boughtId?`: ``null``, `tokensBought?`: ``null``) => `RemoveLiquidityOneEventFilter` |
| `StopRampA` | (`currentA?`: ``null``, `time?`: ``null``) => `StopRampAEventFilter` |
| `StopRampA(uint256,uint256)` | (`currentA?`: ``null``, `time?`: ``null``) => `StopRampAEventFilter` |
| `TokenSwap` | (`buyer?`: ``null`` \| `PromiseOrValue`\<`string`\>, `tokensSold?`: ``null``, `tokensBought?`: ``null``, `soldId?`: ``null``, `boughtId?`: ``null``) => `TokenSwapEventFilter` |
| `TokenSwap(address,uint256,uint256,uint128,uint128)` | (`buyer?`: ``null`` \| `PromiseOrValue`\<`string`\>, `tokensSold?`: ``null``, `tokensBought?`: ``null``, `soldId?`: ``null``, `boughtId?`: ``null``) => `TokenSwapEventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `addLiquidity` | (`amounts`: `PromiseOrValue`\<`BigNumberish`\>[], `minToMint`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `calculateCurrentWithdrawFee` | (`user`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `calculateRemoveLiquidity` | (`account`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`[]]\> |
| `calculateRemoveLiquidityOneToken` | (`account`: `PromiseOrValue`\<`string`\>, `tokenAmount`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndex`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`] & \{ `availableTokenAmount`: `BigNumber`  }\> |
| `calculateSwap` | (`tokenIndexFrom`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndexTo`: `PromiseOrValue`\<`BigNumberish`\>, `dx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `calculateTokenAmount` | (`account`: `PromiseOrValue`\<`string`\>, `amounts`: `PromiseOrValue`\<`BigNumberish`\>[], `deposit`: `PromiseOrValue`\<`boolean`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getA` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getAPrecise` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getAdminBalance` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getDepositTimestamp` | (`user`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getToken` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `getTokenBalance` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getTokenIndex` | (`tokenAddress`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`number`]\> |
| `getVirtualPrice` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `initialize` | (`_pooledTokens`: `PromiseOrValue`\<`string`\>[], `decimals`: `PromiseOrValue`\<`BigNumberish`\>[], `lpTokenName`: `PromiseOrValue`\<`string`\>, `lpTokenSymbol`: `PromiseOrValue`\<`string`\>, `_a`: `PromiseOrValue`\<`BigNumberish`\>, `_fee`: `PromiseOrValue`\<`BigNumberish`\>, `_adminFee`: `PromiseOrValue`\<`BigNumberish`\>, `_withdrawFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `removeLiquidity` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `minAmounts`: `PromiseOrValue`\<`BigNumberish`\>[], `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `removeLiquidityImbalance` | (`amounts`: `PromiseOrValue`\<`BigNumberish`\>[], `maxBurnAmount`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `removeLiquidityOneToken` | (`tokenAmount`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndex`: `PromiseOrValue`\<`BigNumberish`\>, `minAmount`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `swap` | (`tokenIndexFrom`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndexTo`: `PromiseOrValue`\<`BigNumberish`\>, `dx`: `PromiseOrValue`\<`BigNumberish`\>, `minDy`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `swapStorage` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `string`] & \{ `adminFee`: `BigNumber` ; `defaultWithdrawFee`: `BigNumber` ; `futureA`: `BigNumber` ; `futureATime`: `BigNumber` ; `initialA`: `BigNumber` ; `initialATime`: `BigNumber` ; `lpToken`: `string` ; `swapFee`: `BigNumber`  }\> |
| `updateUserWithdrawFee` | (`recipient`: `PromiseOrValue`\<`string`\>, `transferAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `SwapInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`Swap`](Swap.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`Swap`](Swap.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`Swap`](Swap.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `addLiquidity` | (`amounts`: `PromiseOrValue`\<`BigNumberish`\>[], `minToMint`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `calculateCurrentWithdrawFee` | (`user`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `calculateRemoveLiquidity` | (`account`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `calculateRemoveLiquidityOneToken` | (`account`: `PromiseOrValue`\<`string`\>, `tokenAmount`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndex`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `calculateSwap` | (`tokenIndexFrom`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndexTo`: `PromiseOrValue`\<`BigNumberish`\>, `dx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `calculateTokenAmount` | (`account`: `PromiseOrValue`\<`string`\>, `amounts`: `PromiseOrValue`\<`BigNumberish`\>[], `deposit`: `PromiseOrValue`\<`boolean`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getA` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getAPrecise` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getAdminBalance` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getDepositTimestamp` | (`user`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getToken` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getTokenBalance` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getTokenIndex` | (`tokenAddress`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getVirtualPrice` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `initialize` | (`_pooledTokens`: `PromiseOrValue`\<`string`\>[], `decimals`: `PromiseOrValue`\<`BigNumberish`\>[], `lpTokenName`: `PromiseOrValue`\<`string`\>, `lpTokenSymbol`: `PromiseOrValue`\<`string`\>, `_a`: `PromiseOrValue`\<`BigNumberish`\>, `_fee`: `PromiseOrValue`\<`BigNumberish`\>, `_adminFee`: `PromiseOrValue`\<`BigNumberish`\>, `_withdrawFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `removeLiquidity` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `minAmounts`: `PromiseOrValue`\<`BigNumberish`\>[], `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `removeLiquidityImbalance` | (`amounts`: `PromiseOrValue`\<`BigNumberish`\>[], `maxBurnAmount`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `removeLiquidityOneToken` | (`tokenAmount`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndex`: `PromiseOrValue`\<`BigNumberish`\>, `minAmount`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `swap` | (`tokenIndexFrom`: `PromiseOrValue`\<`BigNumberish`\>, `tokenIndexTo`: `PromiseOrValue`\<`BigNumberish`\>, `dx`: `PromiseOrValue`\<`BigNumberish`\>, `minDy`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `swapStorage` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `updateUserWithdrawFee` | (`recipient`: `PromiseOrValue`\<`string`\>, `transferAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`Swap`](Swap.md)\>

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

### <a id="calculatecurrentwithdrawfee" name="calculatecurrentwithdrawfee"></a> calculateCurrentWithdrawFee

▸ **calculateCurrentWithdrawFee**(`user`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="calculateremoveliquidity" name="calculateremoveliquidity"></a> calculateRemoveLiquidity

▸ **calculateRemoveLiquidity**(`account`, `amount`, `overrides?`): `Promise`\<`BigNumber`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `account` | `PromiseOrValue`\<`string`\> |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`[]\>

___

### <a id="calculateremoveliquidityonetoken" name="calculateremoveliquidityonetoken"></a> calculateRemoveLiquidityOneToken

▸ **calculateRemoveLiquidityOneToken**(`account`, `tokenAmount`, `tokenIndex`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `account` | `PromiseOrValue`\<`string`\> |
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

▸ **calculateTokenAmount**(`account`, `amounts`, `deposit`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `account` | `PromiseOrValue`\<`string`\> |
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

▸ **deployed**(): `Promise`\<[`Swap`](Swap.md)\>

#### Returns

`Promise`\<[`Swap`](Swap.md)\>

#### Overrides

BaseContract.deployed

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

### <a id="getaprecise" name="getaprecise"></a> getAPrecise

▸ **getAPrecise**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getadminbalance" name="getadminbalance"></a> getAdminBalance

▸ **getAdminBalance**(`index`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getdeposittimestamp" name="getdeposittimestamp"></a> getDepositTimestamp

▸ **getDepositTimestamp**(`user`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

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

▸ **initialize**(`_pooledTokens`, `decimals`, `lpTokenName`, `lpTokenSymbol`, `_a`, `_fee`, `_adminFee`, `_withdrawFee`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_pooledTokens` | `PromiseOrValue`\<`string`\>[] |
| `decimals` | `PromiseOrValue`\<`BigNumberish`\>[] |
| `lpTokenName` | `PromiseOrValue`\<`string`\> |
| `lpTokenSymbol` | `PromiseOrValue`\<`string`\> |
| `_a` | `PromiseOrValue`\<`BigNumberish`\> |
| `_fee` | `PromiseOrValue`\<`BigNumberish`\> |
| `_adminFee` | `PromiseOrValue`\<`BigNumberish`\> |
| `_withdrawFee` | `PromiseOrValue`\<`BigNumberish`\> |
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

### <a id="swapstorage" name="swapstorage"></a> swapStorage

▸ **swapStorage**(`overrides?`): `Promise`\<[`BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `string`] & \{ `adminFee`: `BigNumber` ; `defaultWithdrawFee`: `BigNumber` ; `futureA`: `BigNumber` ; `futureATime`: `BigNumber` ; `initialA`: `BigNumber` ; `initialATime`: `BigNumber` ; `lpToken`: `string` ; `swapFee`: `BigNumber`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<[`BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `string`] & \{ `adminFee`: `BigNumber` ; `defaultWithdrawFee`: `BigNumber` ; `futureA`: `BigNumber` ; `futureATime`: `BigNumber` ; `initialA`: `BigNumber` ; `initialATime`: `BigNumber` ; `lpToken`: `string` ; `swapFee`: `BigNumber`  }\>

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
