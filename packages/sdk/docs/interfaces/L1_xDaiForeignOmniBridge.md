# Interface: L1\_xDaiForeignOmniBridge

## Hierarchy

- `BaseContract`

  ↳ **`L1_xDaiForeignOmniBridge`**

## Table of contents

### Properties

- [callStatic](L1_xDaiForeignOmniBridge.md#callstatic)
- [estimateGas](L1_xDaiForeignOmniBridge.md#estimategas)
- [filters](L1_xDaiForeignOmniBridge.md#filters)
- [functions](L1_xDaiForeignOmniBridge.md#functions)
- [interface](L1_xDaiForeignOmniBridge.md#interface)
- [off](L1_xDaiForeignOmniBridge.md#off)
- [on](L1_xDaiForeignOmniBridge.md#on)
- [once](L1_xDaiForeignOmniBridge.md#once)
- [populateTransaction](L1_xDaiForeignOmniBridge.md#populatetransaction)
- [removeListener](L1_xDaiForeignOmniBridge.md#removelistener)

### Methods

- [attach](L1_xDaiForeignOmniBridge.md#attach)
- [chaiBalance](L1_xDaiForeignOmniBridge.md#chaibalance)
- [chaiToken](L1_xDaiForeignOmniBridge.md#chaitoken)
- [claimTokens](L1_xDaiForeignOmniBridge.md#claimtokens)
- [connect](L1_xDaiForeignOmniBridge.md#connect)
- [convertDaiToChai](L1_xDaiForeignOmniBridge.md#convertdaitochai)
- [dailyLimit](L1_xDaiForeignOmniBridge.md#dailylimit)
- [decimalShift](L1_xDaiForeignOmniBridge.md#decimalshift)
- [deployed](L1_xDaiForeignOmniBridge.md#deployed)
- [deployedAtBlock](L1_xDaiForeignOmniBridge.md#deployedatblock)
- [dsrBalance](L1_xDaiForeignOmniBridge.md#dsrbalance)
- [erc20token](L1_xDaiForeignOmniBridge.md#erc20token)
- [executeSignatures](L1_xDaiForeignOmniBridge.md#executesignatures)
- [executionDailyLimit](L1_xDaiForeignOmniBridge.md#executiondailylimit)
- [executionMaxPerTx](L1_xDaiForeignOmniBridge.md#executionmaxpertx)
- [fixLockedSai](L1_xDaiForeignOmniBridge.md#fixlockedsai)
- [gasPrice](L1_xDaiForeignOmniBridge.md#gasprice)
- [getBridgeInterfacesVersion](L1_xDaiForeignOmniBridge.md#getbridgeinterfacesversion)
- [getBridgeMode](L1_xDaiForeignOmniBridge.md#getbridgemode)
- [getCurrentDay](L1_xDaiForeignOmniBridge.md#getcurrentday)
- [halfDuplexErc20token](L1_xDaiForeignOmniBridge.md#halfduplexerc20token)
- [initialize](L1_xDaiForeignOmniBridge.md#initialize)
- [initializeChaiToken()](L1_xDaiForeignOmniBridge.md#initializechaitoken())
- [initializeChaiToken(address)](L1_xDaiForeignOmniBridge.md#initializechaitoken(address))
- [interestCollectionPeriod](L1_xDaiForeignOmniBridge.md#interestcollectionperiod)
- [interestReceiver](L1_xDaiForeignOmniBridge.md#interestreceiver)
- [investedAmountInDai](L1_xDaiForeignOmniBridge.md#investedamountindai)
- [isChaiTokenEnabled](L1_xDaiForeignOmniBridge.md#ischaitokenenabled)
- [isDaiNeedsToBeInvested](L1_xDaiForeignOmniBridge.md#isdaineedstobeinvested)
- [isHDTokenBalanceAboveMinBalance](L1_xDaiForeignOmniBridge.md#ishdtokenbalanceaboveminbalance)
- [isInitialized](L1_xDaiForeignOmniBridge.md#isinitialized)
- [isTokenSwapAllowed](L1_xDaiForeignOmniBridge.md#istokenswapallowed)
- [lastInterestPayment](L1_xDaiForeignOmniBridge.md#lastinterestpayment)
- [listeners](L1_xDaiForeignOmniBridge.md#listeners)
- [maxPerTx](L1_xDaiForeignOmniBridge.md#maxpertx)
- [minDaiTokenBalance](L1_xDaiForeignOmniBridge.md#mindaitokenbalance)
- [minHDTokenBalance](L1_xDaiForeignOmniBridge.md#minhdtokenbalance)
- [minPerTx](L1_xDaiForeignOmniBridge.md#minpertx)
- [owner](L1_xDaiForeignOmniBridge.md#owner)
- [payInterest](L1_xDaiForeignOmniBridge.md#payinterest)
- [queryFilter](L1_xDaiForeignOmniBridge.md#queryfilter)
- [relayTokens](L1_xDaiForeignOmniBridge.md#relaytokens)
- [relayedMessages](L1_xDaiForeignOmniBridge.md#relayedmessages)
- [removeAllListeners](L1_xDaiForeignOmniBridge.md#removealllisteners)
- [removeChaiToken](L1_xDaiForeignOmniBridge.md#removechaitoken)
- [requiredBlockConfirmations](L1_xDaiForeignOmniBridge.md#requiredblockconfirmations)
- [requiredSignatures](L1_xDaiForeignOmniBridge.md#requiredsignatures)
- [setDailyLimit](L1_xDaiForeignOmniBridge.md#setdailylimit)
- [setExecutionDailyLimit](L1_xDaiForeignOmniBridge.md#setexecutiondailylimit)
- [setExecutionMaxPerTx](L1_xDaiForeignOmniBridge.md#setexecutionmaxpertx)
- [setGasPrice](L1_xDaiForeignOmniBridge.md#setgasprice)
- [setInterestCollectionPeriod](L1_xDaiForeignOmniBridge.md#setinterestcollectionperiod)
- [setInterestReceiver](L1_xDaiForeignOmniBridge.md#setinterestreceiver)
- [setMaxPerTx](L1_xDaiForeignOmniBridge.md#setmaxpertx)
- [setMinDaiTokenBalance](L1_xDaiForeignOmniBridge.md#setmindaitokenbalance)
- [setMinHDTokenBalance](L1_xDaiForeignOmniBridge.md#setminhdtokenbalance)
- [setMinPerTx](L1_xDaiForeignOmniBridge.md#setminpertx)
- [setRequiredBlockConfirmations](L1_xDaiForeignOmniBridge.md#setrequiredblockconfirmations)
- [swapTokens](L1_xDaiForeignOmniBridge.md#swaptokens)
- [totalExecutedPerDay](L1_xDaiForeignOmniBridge.md#totalexecutedperday)
- [totalSpentPerDay](L1_xDaiForeignOmniBridge.md#totalspentperday)
- [transferOwnership](L1_xDaiForeignOmniBridge.md#transferownership)
- [validatorContract](L1_xDaiForeignOmniBridge.md#validatorcontract)
- [withinExecutionLimit](L1_xDaiForeignOmniBridge.md#withinexecutionlimit)
- [withinLimit](L1_xDaiForeignOmniBridge.md#withinlimit)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chaiBalance` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `chaiToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `claimTokens` | (`_token`: `PromiseOrValue`\<`string`\>, `_to`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `convertDaiToChai` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `dailyLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `decimalShift` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `deployedAtBlock` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `dsrBalance` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `erc20token` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `executeSignatures` | (`message`: `PromiseOrValue`\<`BytesLike`\>, `signatures`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `executionDailyLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `executionMaxPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `fixLockedSai` | (`_receiver`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `gasPrice` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getBridgeInterfacesVersion` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `BigNumber`, `BigNumber`] & \{ `major`: `BigNumber` ; `minor`: `BigNumber` ; `patch`: `BigNumber`  }\> |
| `getBridgeMode` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `getCurrentDay` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `halfDuplexErc20token` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `initialize` | (`_validatorContract`: `PromiseOrValue`\<`string`\>, `_erc20token`: `PromiseOrValue`\<`string`\>, `_requiredBlockConfirmations`: `PromiseOrValue`\<`BigNumberish`\>, `_gasPrice`: `PromiseOrValue`\<`BigNumberish`\>, `_dailyLimitMaxPerTxMinPerTxArray`: `PromiseOrValue`\<`BigNumberish`\>[], `_homeDailyLimitHomeMaxPerTxArray`: `PromiseOrValue`\<`BigNumberish`\>[], `_owner`: `PromiseOrValue`\<`string`\>, `_decimalShift`: `PromiseOrValue`\<`BigNumberish`\>, `_bridgeOnOtherSide`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `initializeChaiToken()` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `initializeChaiToken(address)` | (`_interestReceiver`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `interestCollectionPeriod` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `interestReceiver` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `investedAmountInDai` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `isChaiTokenEnabled` | (`overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `isDaiNeedsToBeInvested` | (`overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `isHDTokenBalanceAboveMinBalance` | (`overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `isInitialized` | (`overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `isTokenSwapAllowed` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `lastInterestPayment` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `maxPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `minDaiTokenBalance` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `minHDTokenBalance` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `minPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `payInterest` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `relayTokens` | (`token`: `PromiseOrValue`\<`string`\>, `_receiver`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `relayedMessages` | (`_txHash`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `removeChaiToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `requiredBlockConfirmations` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `requiredSignatures` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `setDailyLimit` | (`_dailyLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setExecutionDailyLimit` | (`_dailyLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setExecutionMaxPerTx` | (`_maxPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setGasPrice` | (`_gasPrice`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setInterestCollectionPeriod` | (`period`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setInterestReceiver` | (`receiver`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setMaxPerTx` | (`_maxPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setMinDaiTokenBalance` | (`_minBalance`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setMinHDTokenBalance` | (`_minBalance`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setMinPerTx` | (`_minPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setRequiredBlockConfirmations` | (`_blockConfirmations`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `swapTokens` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `totalExecutedPerDay` | (`_day`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `totalSpentPerDay` | (`_day`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `validatorContract` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `withinExecutionLimit` | (`_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `withinLimit` | (`_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chaiBalance` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `chaiToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `claimTokens` | (`_token`: `PromiseOrValue`\<`string`\>, `_to`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `convertDaiToChai` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `dailyLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `decimalShift` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `deployedAtBlock` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `dsrBalance` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `erc20token` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `executeSignatures` | (`message`: `PromiseOrValue`\<`BytesLike`\>, `signatures`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `executionDailyLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `executionMaxPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `fixLockedSai` | (`_receiver`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `gasPrice` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getBridgeInterfacesVersion` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getBridgeMode` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getCurrentDay` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `halfDuplexErc20token` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `initialize` | (`_validatorContract`: `PromiseOrValue`\<`string`\>, `_erc20token`: `PromiseOrValue`\<`string`\>, `_requiredBlockConfirmations`: `PromiseOrValue`\<`BigNumberish`\>, `_gasPrice`: `PromiseOrValue`\<`BigNumberish`\>, `_dailyLimitMaxPerTxMinPerTxArray`: `PromiseOrValue`\<`BigNumberish`\>[], `_homeDailyLimitHomeMaxPerTxArray`: `PromiseOrValue`\<`BigNumberish`\>[], `_owner`: `PromiseOrValue`\<`string`\>, `_decimalShift`: `PromiseOrValue`\<`BigNumberish`\>, `_bridgeOnOtherSide`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `initializeChaiToken()` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `initializeChaiToken(address)` | (`_interestReceiver`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `interestCollectionPeriod` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `interestReceiver` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `investedAmountInDai` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `isChaiTokenEnabled` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `isDaiNeedsToBeInvested` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `isHDTokenBalanceAboveMinBalance` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `isInitialized` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `isTokenSwapAllowed` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `lastInterestPayment` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `maxPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `minDaiTokenBalance` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `minHDTokenBalance` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `minPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `payInterest` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `relayTokens` | (`token`: `PromiseOrValue`\<`string`\>, `_receiver`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `relayedMessages` | (`_txHash`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `removeChaiToken` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `requiredBlockConfirmations` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `requiredSignatures` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `setDailyLimit` | (`_dailyLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setExecutionDailyLimit` | (`_dailyLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setExecutionMaxPerTx` | (`_maxPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setGasPrice` | (`_gasPrice`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setInterestCollectionPeriod` | (`period`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setInterestReceiver` | (`receiver`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setMaxPerTx` | (`_maxPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setMinDaiTokenBalance` | (`_minBalance`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setMinHDTokenBalance` | (`_minBalance`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setMinPerTx` | (`_minPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setRequiredBlockConfirmations` | (`_blockConfirmations`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `swapTokens` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `totalExecutedPerDay` | (`_day`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `totalSpentPerDay` | (`_day`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `validatorContract` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `withinExecutionLimit` | (`_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `withinLimit` | (`_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `DailyLimitChanged` | (`newLimit?`: ``null``) => `DailyLimitChangedEventFilter` |
| `DailyLimitChanged(uint256)` | (`newLimit?`: ``null``) => `DailyLimitChangedEventFilter` |
| `ExecutionDailyLimitChanged` | (`newLimit?`: ``null``) => `ExecutionDailyLimitChangedEventFilter` |
| `ExecutionDailyLimitChanged(uint256)` | (`newLimit?`: ``null``) => `ExecutionDailyLimitChangedEventFilter` |
| `GasPriceChanged` | (`gasPrice?`: ``null``) => `GasPriceChangedEventFilter` |
| `GasPriceChanged(uint256)` | (`gasPrice?`: ``null``) => `GasPriceChangedEventFilter` |
| `OwnershipTransferred` | (`previousOwner?`: ``null``, `newOwner?`: ``null``) => `OwnershipTransferredEventFilter` |
| `OwnershipTransferred(address,address)` | (`previousOwner?`: ``null``, `newOwner?`: ``null``) => `OwnershipTransferredEventFilter` |
| `PaidInterest` | (`to?`: ``null``, `value?`: ``null``) => `PaidInterestEventFilter` |
| `PaidInterest(address,uint256)` | (`to?`: ``null``, `value?`: ``null``) => `PaidInterestEventFilter` |
| `RelayedMessage` | (`recipient?`: ``null``, `value?`: ``null``, `transactionHash?`: ``null``) => `RelayedMessageEventFilter` |
| `RelayedMessage(address,uint256,bytes32)` | (`recipient?`: ``null``, `value?`: ``null``, `transactionHash?`: ``null``) => `RelayedMessageEventFilter` |
| `RequiredBlockConfirmationChanged` | (`requiredBlockConfirmations?`: ``null``) => `RequiredBlockConfirmationChangedEventFilter` |
| `RequiredBlockConfirmationChanged(uint256)` | (`requiredBlockConfirmations?`: ``null``) => `RequiredBlockConfirmationChangedEventFilter` |
| `TokensSwapped` | (`from?`: ``null`` \| `PromiseOrValue`\<`string`\>, `to?`: ``null`` \| `PromiseOrValue`\<`string`\>, `value?`: ``null``) => `TokensSwappedEventFilter` |
| `TokensSwapped(address,address,uint256)` | (`from?`: ``null`` \| `PromiseOrValue`\<`string`\>, `to?`: ``null`` \| `PromiseOrValue`\<`string`\>, `value?`: ``null``) => `TokensSwappedEventFilter` |
| `UserRequestForAffirmation` | (`recipient?`: ``null``, `value?`: ``null``) => `UserRequestForAffirmationEventFilter` |
| `UserRequestForAffirmation(address,uint256)` | (`recipient?`: ``null``, `value?`: ``null``) => `UserRequestForAffirmationEventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chaiBalance` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `chaiToken` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `claimTokens` | (`_token`: `PromiseOrValue`\<`string`\>, `_to`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `convertDaiToChai` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `dailyLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `decimalShift` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `deployedAtBlock` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `dsrBalance` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `erc20token` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `executeSignatures` | (`message`: `PromiseOrValue`\<`BytesLike`\>, `signatures`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `executionDailyLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `executionMaxPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `fixLockedSai` | (`_receiver`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `gasPrice` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getBridgeInterfacesVersion` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `BigNumber`, `BigNumber`] & \{ `major`: `BigNumber` ; `minor`: `BigNumber` ; `patch`: `BigNumber`  }\> |
| `getBridgeMode` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`] & \{ `_data`: `string`  }\> |
| `getCurrentDay` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `halfDuplexErc20token` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `initialize` | (`_validatorContract`: `PromiseOrValue`\<`string`\>, `_erc20token`: `PromiseOrValue`\<`string`\>, `_requiredBlockConfirmations`: `PromiseOrValue`\<`BigNumberish`\>, `_gasPrice`: `PromiseOrValue`\<`BigNumberish`\>, `_dailyLimitMaxPerTxMinPerTxArray`: `PromiseOrValue`\<`BigNumberish`\>[], `_homeDailyLimitHomeMaxPerTxArray`: `PromiseOrValue`\<`BigNumberish`\>[], `_owner`: `PromiseOrValue`\<`string`\>, `_decimalShift`: `PromiseOrValue`\<`BigNumberish`\>, `_bridgeOnOtherSide`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `initializeChaiToken()` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `initializeChaiToken(address)` | (`_interestReceiver`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `interestCollectionPeriod` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `interestReceiver` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `investedAmountInDai` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `isChaiTokenEnabled` | (`overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `isDaiNeedsToBeInvested` | (`overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `isHDTokenBalanceAboveMinBalance` | (`overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `isInitialized` | (`overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `isTokenSwapAllowed` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `lastInterestPayment` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `maxPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `minDaiTokenBalance` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `minHDTokenBalance` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `minPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `payInterest` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `relayTokens` | (`token`: `PromiseOrValue`\<`string`\>, `_receiver`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `relayedMessages` | (`_txHash`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `removeChaiToken` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `requiredBlockConfirmations` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `requiredSignatures` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `setDailyLimit` | (`_dailyLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setExecutionDailyLimit` | (`_dailyLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setExecutionMaxPerTx` | (`_maxPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setGasPrice` | (`_gasPrice`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setInterestCollectionPeriod` | (`period`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setInterestReceiver` | (`receiver`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setMaxPerTx` | (`_maxPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setMinDaiTokenBalance` | (`_minBalance`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setMinHDTokenBalance` | (`_minBalance`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setMinPerTx` | (`_minPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setRequiredBlockConfirmations` | (`_blockConfirmations`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `swapTokens` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `totalExecutedPerDay` | (`_day`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `totalSpentPerDay` | (`_day`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `validatorContract` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `withinExecutionLimit` | (`_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `withinLimit` | (`_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `L1_xDaiForeignOmniBridgeInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`L1_xDaiForeignOmniBridge`](L1_xDaiForeignOmniBridge.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`L1_xDaiForeignOmniBridge`](L1_xDaiForeignOmniBridge.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`L1_xDaiForeignOmniBridge`](L1_xDaiForeignOmniBridge.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chaiBalance` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `chaiToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `claimTokens` | (`_token`: `PromiseOrValue`\<`string`\>, `_to`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `convertDaiToChai` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `dailyLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `decimalShift` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `deployedAtBlock` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `dsrBalance` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `erc20token` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `executeSignatures` | (`message`: `PromiseOrValue`\<`BytesLike`\>, `signatures`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `executionDailyLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `executionMaxPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `fixLockedSai` | (`_receiver`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `gasPrice` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getBridgeInterfacesVersion` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getBridgeMode` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getCurrentDay` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `halfDuplexErc20token` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `initialize` | (`_validatorContract`: `PromiseOrValue`\<`string`\>, `_erc20token`: `PromiseOrValue`\<`string`\>, `_requiredBlockConfirmations`: `PromiseOrValue`\<`BigNumberish`\>, `_gasPrice`: `PromiseOrValue`\<`BigNumberish`\>, `_dailyLimitMaxPerTxMinPerTxArray`: `PromiseOrValue`\<`BigNumberish`\>[], `_homeDailyLimitHomeMaxPerTxArray`: `PromiseOrValue`\<`BigNumberish`\>[], `_owner`: `PromiseOrValue`\<`string`\>, `_decimalShift`: `PromiseOrValue`\<`BigNumberish`\>, `_bridgeOnOtherSide`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `initializeChaiToken()` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `initializeChaiToken(address)` | (`_interestReceiver`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `interestCollectionPeriod` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `interestReceiver` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `investedAmountInDai` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `isChaiTokenEnabled` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `isDaiNeedsToBeInvested` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `isHDTokenBalanceAboveMinBalance` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `isInitialized` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `isTokenSwapAllowed` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `lastInterestPayment` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `maxPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `minDaiTokenBalance` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `minHDTokenBalance` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `minPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `payInterest` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `relayTokens` | (`token`: `PromiseOrValue`\<`string`\>, `_receiver`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `relayedMessages` | (`_txHash`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `removeChaiToken` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `requiredBlockConfirmations` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `requiredSignatures` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `setDailyLimit` | (`_dailyLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setExecutionDailyLimit` | (`_dailyLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setExecutionMaxPerTx` | (`_maxPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setGasPrice` | (`_gasPrice`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setInterestCollectionPeriod` | (`period`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setInterestReceiver` | (`receiver`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setMaxPerTx` | (`_maxPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setMinDaiTokenBalance` | (`_minBalance`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setMinHDTokenBalance` | (`_minBalance`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setMinPerTx` | (`_minPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setRequiredBlockConfirmations` | (`_blockConfirmations`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `swapTokens` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `totalExecutedPerDay` | (`_day`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `totalSpentPerDay` | (`_day`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `validatorContract` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `withinExecutionLimit` | (`_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `withinLimit` | (`_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`L1_xDaiForeignOmniBridge`](L1_xDaiForeignOmniBridge.md)\>

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

### <a id="chaibalance" name="chaibalance"></a> chaiBalance

▸ **chaiBalance**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="chaitoken" name="chaitoken"></a> chaiToken

▸ **chaiToken**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="claimtokens" name="claimtokens"></a> claimTokens

▸ **claimTokens**(`_token`, `_to`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_token` | `PromiseOrValue`\<`string`\> |
| `_to` | `PromiseOrValue`\<`string`\> |
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

### <a id="convertdaitochai" name="convertdaitochai"></a> convertDaiToChai

▸ **convertDaiToChai**(`overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="dailylimit" name="dailylimit"></a> dailyLimit

▸ **dailyLimit**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="decimalshift" name="decimalshift"></a> decimalShift

▸ **decimalShift**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="deployed" name="deployed"></a> deployed

▸ **deployed**(): `Promise`\<[`L1_xDaiForeignOmniBridge`](L1_xDaiForeignOmniBridge.md)\>

#### Returns

`Promise`\<[`L1_xDaiForeignOmniBridge`](L1_xDaiForeignOmniBridge.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="deployedatblock" name="deployedatblock"></a> deployedAtBlock

▸ **deployedAtBlock**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="dsrbalance" name="dsrbalance"></a> dsrBalance

▸ **dsrBalance**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="erc20token" name="erc20token"></a> erc20token

▸ **erc20token**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="executesignatures" name="executesignatures"></a> executeSignatures

▸ **executeSignatures**(`message`, `signatures`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `PromiseOrValue`\<`BytesLike`\> |
| `signatures` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="executiondailylimit" name="executiondailylimit"></a> executionDailyLimit

▸ **executionDailyLimit**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="executionmaxpertx" name="executionmaxpertx"></a> executionMaxPerTx

▸ **executionMaxPerTx**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="fixlockedsai" name="fixlockedsai"></a> fixLockedSai

▸ **fixLockedSai**(`_receiver`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_receiver` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="gasprice" name="gasprice"></a> gasPrice

▸ **gasPrice**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getbridgeinterfacesversion" name="getbridgeinterfacesversion"></a> getBridgeInterfacesVersion

▸ **getBridgeInterfacesVersion**(`overrides?`): `Promise`\<[`BigNumber`, `BigNumber`, `BigNumber`] & \{ `major`: `BigNumber` ; `minor`: `BigNumber` ; `patch`: `BigNumber`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<[`BigNumber`, `BigNumber`, `BigNumber`] & \{ `major`: `BigNumber` ; `minor`: `BigNumber` ; `patch`: `BigNumber`  }\>

___

### <a id="getbridgemode" name="getbridgemode"></a> getBridgeMode

▸ **getBridgeMode**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="getcurrentday" name="getcurrentday"></a> getCurrentDay

▸ **getCurrentDay**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="halfduplexerc20token" name="halfduplexerc20token"></a> halfDuplexErc20token

▸ **halfDuplexErc20token**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="initialize" name="initialize"></a> initialize

▸ **initialize**(`_validatorContract`, `_erc20token`, `_requiredBlockConfirmations`, `_gasPrice`, `_dailyLimitMaxPerTxMinPerTxArray`, `_homeDailyLimitHomeMaxPerTxArray`, `_owner`, `_decimalShift`, `_bridgeOnOtherSide`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_validatorContract` | `PromiseOrValue`\<`string`\> |
| `_erc20token` | `PromiseOrValue`\<`string`\> |
| `_requiredBlockConfirmations` | `PromiseOrValue`\<`BigNumberish`\> |
| `_gasPrice` | `PromiseOrValue`\<`BigNumberish`\> |
| `_dailyLimitMaxPerTxMinPerTxArray` | `PromiseOrValue`\<`BigNumberish`\>[] |
| `_homeDailyLimitHomeMaxPerTxArray` | `PromiseOrValue`\<`BigNumberish`\>[] |
| `_owner` | `PromiseOrValue`\<`string`\> |
| `_decimalShift` | `PromiseOrValue`\<`BigNumberish`\> |
| `_bridgeOnOtherSide` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="initializechaitoken()" name="initializechaitoken()"></a> initializeChaiToken()

▸ **initializeChaiToken()**(`overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="initializechaitoken(address)" name="initializechaitoken(address)"></a> initializeChaiToken(address)

▸ **initializeChaiToken(address)**(`_interestReceiver`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_interestReceiver` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="interestcollectionperiod" name="interestcollectionperiod"></a> interestCollectionPeriod

▸ **interestCollectionPeriod**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="interestreceiver" name="interestreceiver"></a> interestReceiver

▸ **interestReceiver**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="investedamountindai" name="investedamountindai"></a> investedAmountInDai

▸ **investedAmountInDai**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="ischaitokenenabled" name="ischaitokenenabled"></a> isChaiTokenEnabled

▸ **isChaiTokenEnabled**(`overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="isdaineedstobeinvested" name="isdaineedstobeinvested"></a> isDaiNeedsToBeInvested

▸ **isDaiNeedsToBeInvested**(`overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="ishdtokenbalanceaboveminbalance" name="ishdtokenbalanceaboveminbalance"></a> isHDTokenBalanceAboveMinBalance

▸ **isHDTokenBalanceAboveMinBalance**(`overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="isinitialized" name="isinitialized"></a> isInitialized

▸ **isInitialized**(`overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="istokenswapallowed" name="istokenswapallowed"></a> isTokenSwapAllowed

▸ **isTokenSwapAllowed**(`arg0`, `overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="lastinterestpayment" name="lastinterestpayment"></a> lastInterestPayment

▸ **lastInterestPayment**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
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

### <a id="maxpertx" name="maxpertx"></a> maxPerTx

▸ **maxPerTx**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="mindaitokenbalance" name="mindaitokenbalance"></a> minDaiTokenBalance

▸ **minDaiTokenBalance**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="minhdtokenbalance" name="minhdtokenbalance"></a> minHDTokenBalance

▸ **minHDTokenBalance**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="minpertx" name="minpertx"></a> minPerTx

▸ **minPerTx**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="owner" name="owner"></a> owner

▸ **owner**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="payinterest" name="payinterest"></a> payInterest

▸ **payInterest**(`overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
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

### <a id="relaytokens" name="relaytokens"></a> relayTokens

▸ **relayTokens**(`token`, `_receiver`, `_amount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | `PromiseOrValue`\<`string`\> |
| `_receiver` | `PromiseOrValue`\<`string`\> |
| `_amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="relayedmessages" name="relayedmessages"></a> relayedMessages

▸ **relayedMessages**(`_txHash`, `overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_txHash` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

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

### <a id="removechaitoken" name="removechaitoken"></a> removeChaiToken

▸ **removeChaiToken**(`overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="requiredblockconfirmations" name="requiredblockconfirmations"></a> requiredBlockConfirmations

▸ **requiredBlockConfirmations**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="requiredsignatures" name="requiredsignatures"></a> requiredSignatures

▸ **requiredSignatures**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="setdailylimit" name="setdailylimit"></a> setDailyLimit

▸ **setDailyLimit**(`_dailyLimit`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_dailyLimit` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setexecutiondailylimit" name="setexecutiondailylimit"></a> setExecutionDailyLimit

▸ **setExecutionDailyLimit**(`_dailyLimit`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_dailyLimit` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setexecutionmaxpertx" name="setexecutionmaxpertx"></a> setExecutionMaxPerTx

▸ **setExecutionMaxPerTx**(`_maxPerTx`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_maxPerTx` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setgasprice" name="setgasprice"></a> setGasPrice

▸ **setGasPrice**(`_gasPrice`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_gasPrice` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setinterestcollectionperiod" name="setinterestcollectionperiod"></a> setInterestCollectionPeriod

▸ **setInterestCollectionPeriod**(`period`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `period` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setinterestreceiver" name="setinterestreceiver"></a> setInterestReceiver

▸ **setInterestReceiver**(`receiver`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `receiver` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setmaxpertx" name="setmaxpertx"></a> setMaxPerTx

▸ **setMaxPerTx**(`_maxPerTx`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_maxPerTx` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setmindaitokenbalance" name="setmindaitokenbalance"></a> setMinDaiTokenBalance

▸ **setMinDaiTokenBalance**(`_minBalance`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_minBalance` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setminhdtokenbalance" name="setminhdtokenbalance"></a> setMinHDTokenBalance

▸ **setMinHDTokenBalance**(`_minBalance`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_minBalance` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setminpertx" name="setminpertx"></a> setMinPerTx

▸ **setMinPerTx**(`_minPerTx`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_minPerTx` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setrequiredblockconfirmations" name="setrequiredblockconfirmations"></a> setRequiredBlockConfirmations

▸ **setRequiredBlockConfirmations**(`_blockConfirmations`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_blockConfirmations` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="swaptokens" name="swaptokens"></a> swapTokens

▸ **swapTokens**(`overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="totalexecutedperday" name="totalexecutedperday"></a> totalExecutedPerDay

▸ **totalExecutedPerDay**(`_day`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_day` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="totalspentperday" name="totalspentperday"></a> totalSpentPerDay

▸ **totalSpentPerDay**(`_day`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_day` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="transferownership" name="transferownership"></a> transferOwnership

▸ **transferOwnership**(`newOwner`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `newOwner` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="validatorcontract" name="validatorcontract"></a> validatorContract

▸ **validatorContract**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="withinexecutionlimit" name="withinexecutionlimit"></a> withinExecutionLimit

▸ **withinExecutionLimit**(`_amount`, `overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="withinlimit" name="withinlimit"></a> withinLimit

▸ **withinLimit**(`_amount`, `overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>
