# Interface: L1\_HomeAMBNativeToErc20

## Hierarchy

- `BaseContract`

  ↳ **`L1_HomeAMBNativeToErc20`**

## Table of contents

### Properties

- [callStatic](L1_HomeAMBNativeToErc20.md#callstatic)
- [estimateGas](L1_HomeAMBNativeToErc20.md#estimategas)
- [filters](L1_HomeAMBNativeToErc20.md#filters)
- [functions](L1_HomeAMBNativeToErc20.md#functions)
- [interface](L1_HomeAMBNativeToErc20.md#interface)
- [off](L1_HomeAMBNativeToErc20.md#off)
- [on](L1_HomeAMBNativeToErc20.md#on)
- [once](L1_HomeAMBNativeToErc20.md#once)
- [populateTransaction](L1_HomeAMBNativeToErc20.md#populatetransaction)
- [removeListener](L1_HomeAMBNativeToErc20.md#removelistener)

### Methods

- [attach](L1_HomeAMBNativeToErc20.md#attach)
- [bridgeContract](L1_HomeAMBNativeToErc20.md#bridgecontract)
- [claimTokens](L1_HomeAMBNativeToErc20.md#claimtokens)
- [connect](L1_HomeAMBNativeToErc20.md#connect)
- [dailyLimit](L1_HomeAMBNativeToErc20.md#dailylimit)
- [decimalShift](L1_HomeAMBNativeToErc20.md#decimalshift)
- [deployed](L1_HomeAMBNativeToErc20.md#deployed)
- [executionDailyLimit](L1_HomeAMBNativeToErc20.md#executiondailylimit)
- [executionMaxPerTx](L1_HomeAMBNativeToErc20.md#executionmaxpertx)
- [feeManagerContract](L1_HomeAMBNativeToErc20.md#feemanagercontract)
- [fixFailedMessage](L1_HomeAMBNativeToErc20.md#fixfailedmessage)
- [fixMediatorBalance](L1_HomeAMBNativeToErc20.md#fixmediatorbalance)
- [getBridgeInterfacesVersion](L1_HomeAMBNativeToErc20.md#getbridgeinterfacesversion)
- [getBridgeMode](L1_HomeAMBNativeToErc20.md#getbridgemode)
- [getCurrentDay](L1_HomeAMBNativeToErc20.md#getcurrentday)
- [handleBridgedTokens](L1_HomeAMBNativeToErc20.md#handlebridgedtokens)
- [initialize](L1_HomeAMBNativeToErc20.md#initialize)
- [isInitialized](L1_HomeAMBNativeToErc20.md#isinitialized)
- [listeners](L1_HomeAMBNativeToErc20.md#listeners)
- [maxAvailablePerTx](L1_HomeAMBNativeToErc20.md#maxavailablepertx)
- [maxPerTx](L1_HomeAMBNativeToErc20.md#maxpertx)
- [mediatorBalance](L1_HomeAMBNativeToErc20.md#mediatorbalance)
- [mediatorContractOnOtherSide](L1_HomeAMBNativeToErc20.md#mediatorcontractonotherside)
- [messageFixed](L1_HomeAMBNativeToErc20.md#messagefixed)
- [minPerTx](L1_HomeAMBNativeToErc20.md#minpertx)
- [owner](L1_HomeAMBNativeToErc20.md#owner)
- [queryFilter](L1_HomeAMBNativeToErc20.md#queryfilter)
- [relayTokens](L1_HomeAMBNativeToErc20.md#relaytokens)
- [removeAllListeners](L1_HomeAMBNativeToErc20.md#removealllisteners)
- [requestFailedMessageFix](L1_HomeAMBNativeToErc20.md#requestfailedmessagefix)
- [requestGasLimit](L1_HomeAMBNativeToErc20.md#requestgaslimit)
- [setBridgeContract](L1_HomeAMBNativeToErc20.md#setbridgecontract)
- [setDailyLimit](L1_HomeAMBNativeToErc20.md#setdailylimit)
- [setExecutionDailyLimit](L1_HomeAMBNativeToErc20.md#setexecutiondailylimit)
- [setExecutionMaxPerTx](L1_HomeAMBNativeToErc20.md#setexecutionmaxpertx)
- [setFeeManagerContract](L1_HomeAMBNativeToErc20.md#setfeemanagercontract)
- [setMaxPerTx](L1_HomeAMBNativeToErc20.md#setmaxpertx)
- [setMediatorContractOnOtherSide](L1_HomeAMBNativeToErc20.md#setmediatorcontractonotherside)
- [setMinPerTx](L1_HomeAMBNativeToErc20.md#setminpertx)
- [setRequestGasLimit](L1_HomeAMBNativeToErc20.md#setrequestgaslimit)
- [totalExecutedPerDay](L1_HomeAMBNativeToErc20.md#totalexecutedperday)
- [totalSpentPerDay](L1_HomeAMBNativeToErc20.md#totalspentperday)
- [transferOwnership](L1_HomeAMBNativeToErc20.md#transferownership)
- [withinExecutionLimit](L1_HomeAMBNativeToErc20.md#withinexecutionlimit)
- [withinLimit](L1_HomeAMBNativeToErc20.md#withinlimit)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bridgeContract` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `claimTokens` | (`_token`: `PromiseOrValue`\<`string`\>, `_to`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `dailyLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `decimalShift` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `executionDailyLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `executionMaxPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `feeManagerContract` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `fixFailedMessage` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `fixMediatorBalance` | (`_receiver`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `getBridgeInterfacesVersion` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `BigNumber`, `BigNumber`] & \{ `major`: `BigNumber` ; `minor`: `BigNumber` ; `patch`: `BigNumber`  }\> |
| `getBridgeMode` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `getCurrentDay` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `handleBridgedTokens` | (`_recipient`: `PromiseOrValue`\<`string`\>, `_value`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `initialize` | (`_bridgeContract`: `PromiseOrValue`\<`string`\>, `_mediatorContract`: `PromiseOrValue`\<`string`\>, `_dailyLimitMaxPerTxMinPerTxArray`: [`PromiseOrValue`\<`BigNumberish`\>, `PromiseOrValue`\<`BigNumberish`\>, `PromiseOrValue`\<`BigNumberish`\>], `_executionDailyLimitExecutionMaxPerTxArray`: [`PromiseOrValue`\<`BigNumberish`\>, `PromiseOrValue`\<`BigNumberish`\>], `_requestGasLimit`: `PromiseOrValue`\<`BigNumberish`\>, `_decimalShift`: `PromiseOrValue`\<`BigNumberish`\>, `_owner`: `PromiseOrValue`\<`string`\>, `_feeManager`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `isInitialized` | (`overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `maxAvailablePerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `maxPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `mediatorBalance` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `mediatorContractOnOtherSide` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `messageFixed` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `minPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `relayTokens` | (`_receiver`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `requestFailedMessageFix` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `requestGasLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `setBridgeContract` | (`_bridgeContract`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setDailyLimit` | (`_dailyLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setExecutionDailyLimit` | (`_dailyLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setExecutionMaxPerTx` | (`_maxPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setFeeManagerContract` | (`_feeManager`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setMaxPerTx` | (`_maxPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setMediatorContractOnOtherSide` | (`_mediatorContract`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setMinPerTx` | (`_minPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setRequestGasLimit` | (`_requestGasLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `totalExecutedPerDay` | (`_day`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `totalSpentPerDay` | (`_day`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
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
| `bridgeContract` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `claimTokens` | (`_token`: `PromiseOrValue`\<`string`\>, `_to`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `dailyLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `decimalShift` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `executionDailyLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `executionMaxPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `feeManagerContract` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `fixFailedMessage` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `fixMediatorBalance` | (`_receiver`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `getBridgeInterfacesVersion` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getBridgeMode` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getCurrentDay` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `handleBridgedTokens` | (`_recipient`: `PromiseOrValue`\<`string`\>, `_value`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `initialize` | (`_bridgeContract`: `PromiseOrValue`\<`string`\>, `_mediatorContract`: `PromiseOrValue`\<`string`\>, `_dailyLimitMaxPerTxMinPerTxArray`: [`PromiseOrValue`\<`BigNumberish`\>, `PromiseOrValue`\<`BigNumberish`\>, `PromiseOrValue`\<`BigNumberish`\>], `_executionDailyLimitExecutionMaxPerTxArray`: [`PromiseOrValue`\<`BigNumberish`\>, `PromiseOrValue`\<`BigNumberish`\>], `_requestGasLimit`: `PromiseOrValue`\<`BigNumberish`\>, `_decimalShift`: `PromiseOrValue`\<`BigNumberish`\>, `_owner`: `PromiseOrValue`\<`string`\>, `_feeManager`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `isInitialized` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `maxAvailablePerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `maxPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `mediatorBalance` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `mediatorContractOnOtherSide` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `messageFixed` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `minPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `relayTokens` | (`_receiver`: `PromiseOrValue`\<`string`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `requestFailedMessageFix` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `requestGasLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `setBridgeContract` | (`_bridgeContract`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setDailyLimit` | (`_dailyLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setExecutionDailyLimit` | (`_dailyLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setExecutionMaxPerTx` | (`_maxPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setFeeManagerContract` | (`_feeManager`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setMaxPerTx` | (`_maxPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setMediatorContractOnOtherSide` | (`_mediatorContract`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setMinPerTx` | (`_minPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setRequestGasLimit` | (`_requestGasLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `totalExecutedPerDay` | (`_day`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `totalSpentPerDay` | (`_day`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
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
| `FailedMessageFixed` | (`messageId?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `recipient?`: ``null``, `value?`: ``null``) => `FailedMessageFixedEventFilter` |
| `FailedMessageFixed(bytes32,address,uint256)` | (`messageId?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `recipient?`: ``null``, `value?`: ``null``) => `FailedMessageFixedEventFilter` |
| `FeeDistributed` | (`feeAmount?`: ``null``, `messageId?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>) => `FeeDistributedEventFilter` |
| `FeeDistributed(uint256,bytes32)` | (`feeAmount?`: ``null``, `messageId?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>) => `FeeDistributedEventFilter` |
| `OwnershipTransferred` | (`previousOwner?`: ``null``, `newOwner?`: ``null``) => `OwnershipTransferredEventFilter` |
| `OwnershipTransferred(address,address)` | (`previousOwner?`: ``null``, `newOwner?`: ``null``) => `OwnershipTransferredEventFilter` |
| `TokensBridged` | (`recipient?`: ``null`` \| `PromiseOrValue`\<`string`\>, `value?`: ``null``, `messageId?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>) => `TokensBridgedEventFilter` |
| `TokensBridged(address,uint256,bytes32)` | (`recipient?`: ``null`` \| `PromiseOrValue`\<`string`\>, `value?`: ``null``, `messageId?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>) => `TokensBridgedEventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bridgeContract` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `claimTokens` | (`_token`: `PromiseOrValue`\<`string`\>, `_to`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `dailyLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `decimalShift` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `executionDailyLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `executionMaxPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `feeManagerContract` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `fixFailedMessage` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `fixMediatorBalance` | (`_receiver`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `getBridgeInterfacesVersion` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `BigNumber`, `BigNumber`] & \{ `major`: `BigNumber` ; `minor`: `BigNumber` ; `patch`: `BigNumber`  }\> |
| `getBridgeMode` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`] & \{ `_data`: `string`  }\> |
| `getCurrentDay` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `handleBridgedTokens` | (`_recipient`: `PromiseOrValue`\<`string`\>, `_value`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `initialize` | (`_bridgeContract`: `PromiseOrValue`\<`string`\>, `_mediatorContract`: `PromiseOrValue`\<`string`\>, `_dailyLimitMaxPerTxMinPerTxArray`: [`PromiseOrValue`\<`BigNumberish`\>, `PromiseOrValue`\<`BigNumberish`\>, `PromiseOrValue`\<`BigNumberish`\>], `_executionDailyLimitExecutionMaxPerTxArray`: [`PromiseOrValue`\<`BigNumberish`\>, `PromiseOrValue`\<`BigNumberish`\>], `_requestGasLimit`: `PromiseOrValue`\<`BigNumberish`\>, `_decimalShift`: `PromiseOrValue`\<`BigNumberish`\>, `_owner`: `PromiseOrValue`\<`string`\>, `_feeManager`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `isInitialized` | (`overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `maxAvailablePerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `maxPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `mediatorBalance` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `mediatorContractOnOtherSide` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `messageFixed` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `minPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `relayTokens` | (`_receiver`: `PromiseOrValue`\<`string`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `requestFailedMessageFix` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `requestGasLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `setBridgeContract` | (`_bridgeContract`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setDailyLimit` | (`_dailyLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setExecutionDailyLimit` | (`_dailyLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setExecutionMaxPerTx` | (`_maxPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setFeeManagerContract` | (`_feeManager`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setMaxPerTx` | (`_maxPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setMediatorContractOnOtherSide` | (`_mediatorContract`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setMinPerTx` | (`_minPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setRequestGasLimit` | (`_requestGasLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `totalExecutedPerDay` | (`_day`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `totalSpentPerDay` | (`_day`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `withinExecutionLimit` | (`_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `withinLimit` | (`_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `L1_HomeAMBNativeToErc20Interface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`L1_HomeAMBNativeToErc20`](L1_HomeAMBNativeToErc20.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`L1_HomeAMBNativeToErc20`](L1_HomeAMBNativeToErc20.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`L1_HomeAMBNativeToErc20`](L1_HomeAMBNativeToErc20.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bridgeContract` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `claimTokens` | (`_token`: `PromiseOrValue`\<`string`\>, `_to`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `dailyLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `decimalShift` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `executionDailyLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `executionMaxPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `feeManagerContract` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `fixFailedMessage` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `fixMediatorBalance` | (`_receiver`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `getBridgeInterfacesVersion` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getBridgeMode` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getCurrentDay` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `handleBridgedTokens` | (`_recipient`: `PromiseOrValue`\<`string`\>, `_value`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `initialize` | (`_bridgeContract`: `PromiseOrValue`\<`string`\>, `_mediatorContract`: `PromiseOrValue`\<`string`\>, `_dailyLimitMaxPerTxMinPerTxArray`: [`PromiseOrValue`\<`BigNumberish`\>, `PromiseOrValue`\<`BigNumberish`\>, `PromiseOrValue`\<`BigNumberish`\>], `_executionDailyLimitExecutionMaxPerTxArray`: [`PromiseOrValue`\<`BigNumberish`\>, `PromiseOrValue`\<`BigNumberish`\>], `_requestGasLimit`: `PromiseOrValue`\<`BigNumberish`\>, `_decimalShift`: `PromiseOrValue`\<`BigNumberish`\>, `_owner`: `PromiseOrValue`\<`string`\>, `_feeManager`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `isInitialized` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `maxAvailablePerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `maxPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `mediatorBalance` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `mediatorContractOnOtherSide` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `messageFixed` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `minPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `relayTokens` | (`_receiver`: `PromiseOrValue`\<`string`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `requestFailedMessageFix` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `requestGasLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `setBridgeContract` | (`_bridgeContract`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setDailyLimit` | (`_dailyLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setExecutionDailyLimit` | (`_dailyLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setExecutionMaxPerTx` | (`_maxPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setFeeManagerContract` | (`_feeManager`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setMaxPerTx` | (`_maxPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setMediatorContractOnOtherSide` | (`_mediatorContract`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setMinPerTx` | (`_minPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setRequestGasLimit` | (`_requestGasLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `totalExecutedPerDay` | (`_day`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `totalSpentPerDay` | (`_day`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `withinExecutionLimit` | (`_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `withinLimit` | (`_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`L1_HomeAMBNativeToErc20`](L1_HomeAMBNativeToErc20.md)\>

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

### <a id="bridgecontract" name="bridgecontract"></a> bridgeContract

▸ **bridgeContract**(`overrides?`): `Promise`\<`string`\>

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

▸ **deployed**(): `Promise`\<[`L1_HomeAMBNativeToErc20`](L1_HomeAMBNativeToErc20.md)\>

#### Returns

`Promise`\<[`L1_HomeAMBNativeToErc20`](L1_HomeAMBNativeToErc20.md)\>

#### Overrides

BaseContract.deployed

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

### <a id="feemanagercontract" name="feemanagercontract"></a> feeManagerContract

▸ **feeManagerContract**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="fixfailedmessage" name="fixfailedmessage"></a> fixFailedMessage

▸ **fixFailedMessage**(`_messageId`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_messageId` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="fixmediatorbalance" name="fixmediatorbalance"></a> fixMediatorBalance

▸ **fixMediatorBalance**(`_receiver`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_receiver` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

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

### <a id="handlebridgedtokens" name="handlebridgedtokens"></a> handleBridgedTokens

▸ **handleBridgedTokens**(`_recipient`, `_value`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_recipient` | `PromiseOrValue`\<`string`\> |
| `_value` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="initialize" name="initialize"></a> initialize

▸ **initialize**(`_bridgeContract`, `_mediatorContract`, `_dailyLimitMaxPerTxMinPerTxArray`, `_executionDailyLimitExecutionMaxPerTxArray`, `_requestGasLimit`, `_decimalShift`, `_owner`, `_feeManager`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_bridgeContract` | `PromiseOrValue`\<`string`\> |
| `_mediatorContract` | `PromiseOrValue`\<`string`\> |
| `_dailyLimitMaxPerTxMinPerTxArray` | [`PromiseOrValue`\<`BigNumberish`\>, `PromiseOrValue`\<`BigNumberish`\>, `PromiseOrValue`\<`BigNumberish`\>] |
| `_executionDailyLimitExecutionMaxPerTxArray` | [`PromiseOrValue`\<`BigNumberish`\>, `PromiseOrValue`\<`BigNumberish`\>] |
| `_requestGasLimit` | `PromiseOrValue`\<`BigNumberish`\> |
| `_decimalShift` | `PromiseOrValue`\<`BigNumberish`\> |
| `_owner` | `PromiseOrValue`\<`string`\> |
| `_feeManager` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

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

### <a id="maxavailablepertx" name="maxavailablepertx"></a> maxAvailablePerTx

▸ **maxAvailablePerTx**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

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

### <a id="mediatorbalance" name="mediatorbalance"></a> mediatorBalance

▸ **mediatorBalance**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="mediatorcontractonotherside" name="mediatorcontractonotherside"></a> mediatorContractOnOtherSide

▸ **mediatorContractOnOtherSide**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="messagefixed" name="messagefixed"></a> messageFixed

▸ **messageFixed**(`_messageId`, `overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_messageId` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

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

▸ **relayTokens**(`_receiver`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_receiver` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

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

### <a id="requestfailedmessagefix" name="requestfailedmessagefix"></a> requestFailedMessageFix

▸ **requestFailedMessageFix**(`_messageId`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_messageId` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="requestgaslimit" name="requestgaslimit"></a> requestGasLimit

▸ **requestGasLimit**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="setbridgecontract" name="setbridgecontract"></a> setBridgeContract

▸ **setBridgeContract**(`_bridgeContract`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_bridgeContract` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

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

### <a id="setfeemanagercontract" name="setfeemanagercontract"></a> setFeeManagerContract

▸ **setFeeManagerContract**(`_feeManager`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_feeManager` | `PromiseOrValue`\<`string`\> |
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

### <a id="setmediatorcontractonotherside" name="setmediatorcontractonotherside"></a> setMediatorContractOnOtherSide

▸ **setMediatorContractOnOtherSide**(`_mediatorContract`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_mediatorContract` | `PromiseOrValue`\<`string`\> |
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

### <a id="setrequestgaslimit" name="setrequestgaslimit"></a> setRequestGasLimit

▸ **setRequestGasLimit**(`_requestGasLimit`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_requestGasLimit` | `PromiseOrValue`\<`BigNumberish`\> |
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
