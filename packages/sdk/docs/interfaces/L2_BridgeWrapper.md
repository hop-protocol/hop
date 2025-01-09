# Interface: L2\_BridgeWrapper

## Hierarchy

- `BaseContract`

  ↳ **`L2_BridgeWrapper`**

## Table of contents

### Properties

- [callStatic](L2_BridgeWrapper.md#callstatic)
- [estimateGas](L2_BridgeWrapper.md#estimategas)
- [filters](L2_BridgeWrapper.md#filters)
- [functions](L2_BridgeWrapper.md#functions)
- [interface](L2_BridgeWrapper.md#interface)
- [off](L2_BridgeWrapper.md#off)
- [on](L2_BridgeWrapper.md#on)
- [once](L2_BridgeWrapper.md#once)
- [populateTransaction](L2_BridgeWrapper.md#populatetransaction)
- [removeListener](L2_BridgeWrapper.md#removelistener)

### Methods

- [addBonder](L2_BridgeWrapper.md#addbonder)
- [addSupportedChainIds](L2_BridgeWrapper.md#addsupportedchainids)
- [attach](L2_BridgeWrapper.md#attach)
- [bondWithdrawal](L2_BridgeWrapper.md#bondwithdrawal)
- [bondWithdrawalAndDistribute](L2_BridgeWrapper.md#bondwithdrawalanddistribute)
- [commitTransfers](L2_BridgeWrapper.md#committransfers)
- [connect](L2_BridgeWrapper.md#connect)
- [defaultGasLimit](L2_BridgeWrapper.md#defaultgaslimit)
- [deployed](L2_BridgeWrapper.md#deployed)
- [distribute](L2_BridgeWrapper.md#distribute)
- [getBondedWithdrawalAmount](L2_BridgeWrapper.md#getbondedwithdrawalamount)
- [getChainId](L2_BridgeWrapper.md#getchainid)
- [getCredit](L2_BridgeWrapper.md#getcredit)
- [getDebitAndAdditionalDebit](L2_BridgeWrapper.md#getdebitandadditionaldebit)
- [getIsBonder](L2_BridgeWrapper.md#getisbonder)
- [getNextTransferNonce](L2_BridgeWrapper.md#getnexttransfernonce)
- [getRawDebit](L2_BridgeWrapper.md#getrawdebit)
- [getTransferId](L2_BridgeWrapper.md#gettransferid)
- [getTransferRoot](L2_BridgeWrapper.md#gettransferroot)
- [getTransferRootId](L2_BridgeWrapper.md#gettransferrootid)
- [hToken](L2_BridgeWrapper.md#htoken)
- [isTransferIdSpent](L2_BridgeWrapper.md#istransferidspent)
- [l1BridgeAddress](L2_BridgeWrapper.md#l1bridgeaddress)
- [l1Governance](L2_BridgeWrapper.md#l1governance)
- [l1MessengerWrapperAddress](L2_BridgeWrapper.md#l1messengerwrapperaddress)
- [l2CanonicalToken](L2_BridgeWrapper.md#l2canonicaltoken)
- [lastCommitTimeForChainId](L2_BridgeWrapper.md#lastcommittimeforchainid)
- [listeners](L2_BridgeWrapper.md#listeners)
- [maxPendingTransfers](L2_BridgeWrapper.md#maxpendingtransfers)
- [messenger](L2_BridgeWrapper.md#messenger)
- [messengerGasLimit](L2_BridgeWrapper.md#messengergaslimit)
- [minBonderBps](L2_BridgeWrapper.md#minbonderbps)
- [minBonderFeeAbsolute](L2_BridgeWrapper.md#minbonderfeeabsolute)
- [minimumForceCommitDelay](L2_BridgeWrapper.md#minimumforcecommitdelay)
- [pendingAmountForChainId](L2_BridgeWrapper.md#pendingamountforchainid)
- [pendingTransferIdsForChainId](L2_BridgeWrapper.md#pendingtransferidsforchainid)
- [queryFilter](L2_BridgeWrapper.md#queryfilter)
- [removeAllListeners](L2_BridgeWrapper.md#removealllisteners)
- [removeBonder](L2_BridgeWrapper.md#removebonder)
- [removeSupportedChainIds](L2_BridgeWrapper.md#removesupportedchainids)
- [rescueTransferRoot](L2_BridgeWrapper.md#rescuetransferroot)
- [send](L2_BridgeWrapper.md#send)
- [setHopBridgeTokenOwner](L2_BridgeWrapper.md#sethopbridgetokenowner)
- [setL1BridgeAddress](L2_BridgeWrapper.md#setl1bridgeaddress)
- [setL1MessengerWrapperAddress](L2_BridgeWrapper.md#setl1messengerwrapperaddress)
- [setMaxPendingTransfers](L2_BridgeWrapper.md#setmaxpendingtransfers)
- [setMessengerGasLimit](L2_BridgeWrapper.md#setmessengergaslimit)
- [setMinimumBonderFeeRequirements](L2_BridgeWrapper.md#setminimumbonderfeerequirements)
- [setMinimumForceCommitDelay](L2_BridgeWrapper.md#setminimumforcecommitdelay)
- [setTransferRoot](L2_BridgeWrapper.md#settransferroot)
- [setUniswapWrapper](L2_BridgeWrapper.md#setuniswapwrapper)
- [settleBondedWithdrawal](L2_BridgeWrapper.md#settlebondedwithdrawal)
- [settleBondedWithdrawals](L2_BridgeWrapper.md#settlebondedwithdrawals)
- [stake](L2_BridgeWrapper.md#stake)
- [supportedChainIds](L2_BridgeWrapper.md#supportedchainids)
- [transferNonceIncrementer](L2_BridgeWrapper.md#transfernonceincrementer)
- [uniswapWrapper](L2_BridgeWrapper.md#uniswapwrapper)
- [unstake](L2_BridgeWrapper.md#unstake)
- [withdraw](L2_BridgeWrapper.md#withdraw)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `addBonder` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `addSupportedChainIds` | (`chainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `bondWithdrawal` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `bondWithdrawalAndDistribute` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `commitTransfers` | (`destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `defaultGasLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<`number`\> |
| `distribute` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `relayerFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `getBondedWithdrawalAmount` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getCredit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getDebitAndAdditionalDebit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getIsBonder` | (`maybeBonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `getNextTransferNonce` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `getRawDebit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getTransferId` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `getTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`TransferRootStructOutput`\> |
| `getTransferRootId` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `hToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `isTransferIdSpent` | (`transferId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `l1BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `l1Governance` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `l1MessengerWrapperAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `l2CanonicalToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `lastCommitTimeForChainId` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `maxPendingTransfers` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `messenger` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `messengerGasLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `minBonderBps` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `minBonderFeeAbsolute` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `minimumForceCommitDelay` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `pendingAmountForChainId` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `pendingTransferIdsForChainId` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `arg1`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `removeBonder` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `removeSupportedChainIds` | (`chainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `rescueTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `originalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `send` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setHopBridgeTokenOwner` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setL1BridgeAddress` | (`_l1BridgeAddress`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setL1MessengerWrapperAddress` | (`_l1MessengerWrapperAddress`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setMaxPendingTransfers` | (`_maxPendingTransfers`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setMessengerGasLimit` | (`_messengerGasLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setMinimumBonderFeeRequirements` | (`_minBonderBps`: `PromiseOrValue`\<`BigNumberish`\>, `_minBonderFeeAbsolute`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setMinimumForceCommitDelay` | (`_minimumForceCommitDelay`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setUniswapWrapper` | (`_uniswapWrapper`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `settleBondedWithdrawal` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferId`: `PromiseOrValue`\<`BytesLike`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `transferRootTotalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `proof`: `PromiseOrValue`\<`BytesLike`\>[], `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `settleBondedWithdrawals` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferIds`: `PromiseOrValue`\<`BytesLike`\>[], `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `stake` | (`bonder`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `supportedChainIds` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `transferNonceIncrementer` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `uniswapWrapper` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `unstake` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `withdraw` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `transferRootTotalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `proof`: `PromiseOrValue`\<`BytesLike`\>[], `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `addBonder` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `addSupportedChainIds` | (`chainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `bondWithdrawal` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `bondWithdrawalAndDistribute` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `commitTransfers` | (`destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `defaultGasLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `distribute` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `relayerFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `getBondedWithdrawalAmount` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getCredit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getDebitAndAdditionalDebit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getIsBonder` | (`maybeBonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getNextTransferNonce` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getRawDebit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getTransferId` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getTransferRootId` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `hToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `isTransferIdSpent` | (`transferId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l1BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l1Governance` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l1MessengerWrapperAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l2CanonicalToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `lastCommitTimeForChainId` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `maxPendingTransfers` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `messenger` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `messengerGasLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `minBonderBps` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `minBonderFeeAbsolute` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `minimumForceCommitDelay` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `pendingAmountForChainId` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `pendingTransferIdsForChainId` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `arg1`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `removeBonder` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `removeSupportedChainIds` | (`chainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `rescueTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `originalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `send` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setHopBridgeTokenOwner` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setL1BridgeAddress` | (`_l1BridgeAddress`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setL1MessengerWrapperAddress` | (`_l1MessengerWrapperAddress`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setMaxPendingTransfers` | (`_maxPendingTransfers`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setMessengerGasLimit` | (`_messengerGasLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setMinimumBonderFeeRequirements` | (`_minBonderBps`: `PromiseOrValue`\<`BigNumberish`\>, `_minBonderFeeAbsolute`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setMinimumForceCommitDelay` | (`_minimumForceCommitDelay`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setUniswapWrapper` | (`_uniswapWrapper`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `settleBondedWithdrawal` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferId`: `PromiseOrValue`\<`BytesLike`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `transferRootTotalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `proof`: `PromiseOrValue`\<`BytesLike`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `settleBondedWithdrawals` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferIds`: `PromiseOrValue`\<`BytesLike`\>[], `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `stake` | (`bonder`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `supportedChainIds` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `transferNonceIncrementer` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `uniswapWrapper` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `unstake` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `withdraw` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `transferRootTotalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `proof`: `PromiseOrValue`\<`BytesLike`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `MultipleWithdrawalsSettled` | (`bonder?`: ``null``, `rootHash?`: ``null``, `totalBondsSettled?`: ``null``) => `MultipleWithdrawalsSettledEventFilter` |
| `MultipleWithdrawalsSettled(address,bytes32,uint256)` | (`bonder?`: ``null``, `rootHash?`: ``null``, `totalBondsSettled?`: ``null``) => `MultipleWithdrawalsSettledEventFilter` |
| `Stake` | (`amount?`: ``null``) => `StakeEventFilter` |
| `Stake(uint256)` | (`amount?`: ``null``) => `StakeEventFilter` |
| `TransferRootSet` | (`rootHash?`: ``null``, `totalAmount?`: ``null``) => `TransferRootSetEventFilter` |
| `TransferRootSet(bytes32,uint256)` | (`rootHash?`: ``null``, `totalAmount?`: ``null``) => `TransferRootSetEventFilter` |
| `TransferSent` | (`transferId?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `recipient?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``, `transferNonce?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `bonderFee?`: ``null``, `index?`: ``null``) => `TransferSentEventFilter` |
| `TransferSent(bytes32,address,uint256,bytes32,uint256,uint256)` | (`transferId?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `recipient?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``, `transferNonce?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `bonderFee?`: ``null``, `index?`: ``null``) => `TransferSentEventFilter` |
| `TransfersCommitted` | (`rootHash?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `totalAmount?`: ``null``, `rootCommittedAt?`: ``null``) => `TransfersCommittedEventFilter` |
| `TransfersCommitted(bytes32,uint256,uint256)` | (`rootHash?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `totalAmount?`: ``null``, `rootCommittedAt?`: ``null``) => `TransfersCommittedEventFilter` |
| `Unstake` | (`amount?`: ``null``) => `UnstakeEventFilter` |
| `Unstake(uint256)` | (`amount?`: ``null``) => `UnstakeEventFilter` |
| `WithdrawalBondSettled` | (`bonder?`: ``null``, `transferId?`: ``null``, `rootHash?`: ``null``) => `WithdrawalBondSettledEventFilter` |
| `WithdrawalBondSettled(address,bytes32,bytes32)` | (`bonder?`: ``null``, `transferId?`: ``null``, `rootHash?`: ``null``) => `WithdrawalBondSettledEventFilter` |
| `WithdrawalBonded` | (`transferId?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `recipient?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``, `transferNonce?`: ``null``, `bonderFee?`: ``null``) => `WithdrawalBondedEventFilter` |
| `WithdrawalBonded(bytes32,address,uint256,bytes32,uint256)` | (`transferId?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `recipient?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``, `transferNonce?`: ``null``, `bonderFee?`: ``null``) => `WithdrawalBondedEventFilter` |
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
| `addSupportedChainIds` | (`chainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `bondWithdrawal` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `bondWithdrawalAndDistribute` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `commitTransfers` | (`destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `defaultGasLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<[`number`]\> |
| `distribute` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `relayerFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `getBondedWithdrawalAmount` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`] & \{ `chainId`: `BigNumber`  }\> |
| `getCredit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getDebitAndAdditionalDebit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getIsBonder` | (`maybeBonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `getNextTransferNonce` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `getRawDebit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getTransferId` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `getTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`TransferRootStructOutput`]\> |
| `getTransferRootId` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `hToken` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `isTransferIdSpent` | (`transferId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `l1BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `l1Governance` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `l1MessengerWrapperAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `l2CanonicalToken` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `lastCommitTimeForChainId` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `maxPendingTransfers` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `messenger` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `messengerGasLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `minBonderBps` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `minBonderFeeAbsolute` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `minimumForceCommitDelay` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `pendingAmountForChainId` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `pendingTransferIdsForChainId` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `arg1`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `removeBonder` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `removeSupportedChainIds` | (`chainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `rescueTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `originalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `send` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setHopBridgeTokenOwner` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setL1BridgeAddress` | (`_l1BridgeAddress`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setL1MessengerWrapperAddress` | (`_l1MessengerWrapperAddress`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setMaxPendingTransfers` | (`_maxPendingTransfers`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setMessengerGasLimit` | (`_messengerGasLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setMinimumBonderFeeRequirements` | (`_minBonderBps`: `PromiseOrValue`\<`BigNumberish`\>, `_minBonderFeeAbsolute`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setMinimumForceCommitDelay` | (`_minimumForceCommitDelay`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setUniswapWrapper` | (`_uniswapWrapper`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `settleBondedWithdrawal` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferId`: `PromiseOrValue`\<`BytesLike`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `transferRootTotalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `proof`: `PromiseOrValue`\<`BytesLike`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `settleBondedWithdrawals` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferIds`: `PromiseOrValue`\<`BytesLike`\>[], `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `stake` | (`bonder`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `supportedChainIds` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `transferNonceIncrementer` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `uniswapWrapper` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `unstake` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `withdraw` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `transferRootTotalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `proof`: `PromiseOrValue`\<`BytesLike`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `L2_BridgeWrapperInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`L2_BridgeWrapper`](L2_BridgeWrapper.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`L2_BridgeWrapper`](L2_BridgeWrapper.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`L2_BridgeWrapper`](L2_BridgeWrapper.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `addBonder` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `addSupportedChainIds` | (`chainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `bondWithdrawal` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `bondWithdrawalAndDistribute` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `commitTransfers` | (`destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `defaultGasLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `distribute` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `relayerFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `getBondedWithdrawalAmount` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getCredit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getDebitAndAdditionalDebit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getIsBonder` | (`maybeBonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getNextTransferNonce` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getRawDebit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getTransferId` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getTransferRootId` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `hToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `isTransferIdSpent` | (`transferId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `l1BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `l1Governance` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `l1MessengerWrapperAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `l2CanonicalToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `lastCommitTimeForChainId` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `maxPendingTransfers` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `messenger` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `messengerGasLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `minBonderBps` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `minBonderFeeAbsolute` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `minimumForceCommitDelay` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `pendingAmountForChainId` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `pendingTransferIdsForChainId` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `arg1`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `removeBonder` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `removeSupportedChainIds` | (`chainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `rescueTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `originalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `send` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setHopBridgeTokenOwner` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setL1BridgeAddress` | (`_l1BridgeAddress`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setL1MessengerWrapperAddress` | (`_l1MessengerWrapperAddress`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setMaxPendingTransfers` | (`_maxPendingTransfers`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setMessengerGasLimit` | (`_messengerGasLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setMinimumBonderFeeRequirements` | (`_minBonderBps`: `PromiseOrValue`\<`BigNumberish`\>, `_minBonderFeeAbsolute`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setMinimumForceCommitDelay` | (`_minimumForceCommitDelay`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setUniswapWrapper` | (`_uniswapWrapper`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `settleBondedWithdrawal` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferId`: `PromiseOrValue`\<`BytesLike`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `transferRootTotalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `proof`: `PromiseOrValue`\<`BytesLike`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `settleBondedWithdrawals` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferIds`: `PromiseOrValue`\<`BytesLike`\>[], `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `stake` | (`bonder`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `supportedChainIds` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `transferNonceIncrementer` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `uniswapWrapper` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `unstake` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `withdraw` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `transferRootTotalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `proof`: `PromiseOrValue`\<`BytesLike`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`L2_BridgeWrapper`](L2_BridgeWrapper.md)\>

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

### <a id="addsupportedchainids" name="addsupportedchainids"></a> addSupportedChainIds

▸ **addSupportedChainIds**(`chainIds`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainIds` | `PromiseOrValue`\<`BigNumberish`\>[] |
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

### <a id="bondwithdrawalanddistribute" name="bondwithdrawalanddistribute"></a> bondWithdrawalAndDistribute

▸ **bondWithdrawalAndDistribute**(`recipient`, `amount`, `transferNonce`, `bonderFee`, `amountOutMin`, `deadline`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `recipient` | `PromiseOrValue`\<`string`\> |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `transferNonce` | `PromiseOrValue`\<`BytesLike`\> |
| `bonderFee` | `PromiseOrValue`\<`BigNumberish`\> |
| `amountOutMin` | `PromiseOrValue`\<`BigNumberish`\> |
| `deadline` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="committransfers" name="committransfers"></a> commitTransfers

▸ **commitTransfers**(`destinationChainId`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `destinationChainId` | `PromiseOrValue`\<`BigNumberish`\> |
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

### <a id="defaultgaslimit" name="defaultgaslimit"></a> defaultGasLimit

▸ **defaultGasLimit**(`overrides?`): `Promise`\<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`number`\>

___

### <a id="deployed" name="deployed"></a> deployed

▸ **deployed**(): `Promise`\<[`L2_BridgeWrapper`](L2_BridgeWrapper.md)\>

#### Returns

`Promise`\<[`L2_BridgeWrapper`](L2_BridgeWrapper.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="distribute" name="distribute"></a> distribute

▸ **distribute**(`recipient`, `amount`, `amountOutMin`, `deadline`, `relayerFee`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `recipient` | `PromiseOrValue`\<`string`\> |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `amountOutMin` | `PromiseOrValue`\<`BigNumberish`\> |
| `deadline` | `PromiseOrValue`\<`BigNumberish`\> |
| `relayerFee` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

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

### <a id="getnexttransfernonce" name="getnexttransfernonce"></a> getNextTransferNonce

▸ **getNextTransferNonce**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

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

▸ **getTransferRoot**(`rootHash`, `totalAmount`, `overrides?`): `Promise`\<`TransferRootStructOutput`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootHash` | `PromiseOrValue`\<`BytesLike`\> |
| `totalAmount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`TransferRootStructOutput`\>

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

### <a id="htoken" name="htoken"></a> hToken

▸ **hToken**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
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

### <a id="l1bridgeaddress" name="l1bridgeaddress"></a> l1BridgeAddress

▸ **l1BridgeAddress**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="l1governance" name="l1governance"></a> l1Governance

▸ **l1Governance**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="l1messengerwrapperaddress" name="l1messengerwrapperaddress"></a> l1MessengerWrapperAddress

▸ **l1MessengerWrapperAddress**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="l2canonicaltoken" name="l2canonicaltoken"></a> l2CanonicalToken

▸ **l2CanonicalToken**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="lastcommittimeforchainid" name="lastcommittimeforchainid"></a> lastCommitTimeForChainId

▸ **lastCommitTimeForChainId**(`arg0`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`BigNumberish`\> |
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

### <a id="maxpendingtransfers" name="maxpendingtransfers"></a> maxPendingTransfers

▸ **maxPendingTransfers**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

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

### <a id="messengergaslimit" name="messengergaslimit"></a> messengerGasLimit

▸ **messengerGasLimit**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="minbonderbps" name="minbonderbps"></a> minBonderBps

▸ **minBonderBps**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="minbonderfeeabsolute" name="minbonderfeeabsolute"></a> minBonderFeeAbsolute

▸ **minBonderFeeAbsolute**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="minimumforcecommitdelay" name="minimumforcecommitdelay"></a> minimumForceCommitDelay

▸ **minimumForceCommitDelay**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="pendingamountforchainid" name="pendingamountforchainid"></a> pendingAmountForChainId

▸ **pendingAmountForChainId**(`arg0`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="pendingtransferidsforchainid" name="pendingtransferidsforchainid"></a> pendingTransferIdsForChainId

▸ **pendingTransferIdsForChainId**(`arg0`, `arg1`, `overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`BigNumberish`\> |
| `arg1` | `PromiseOrValue`\<`BigNumberish`\> |
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

### <a id="removesupportedchainids" name="removesupportedchainids"></a> removeSupportedChainIds

▸ **removeSupportedChainIds**(`chainIds`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainIds` | `PromiseOrValue`\<`BigNumberish`\>[] |
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

### <a id="send" name="send"></a> send

▸ **send**(`chainId`, `recipient`, `amount`, `bonderFee`, `amountOutMin`, `deadline`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `PromiseOrValue`\<`BigNumberish`\> |
| `recipient` | `PromiseOrValue`\<`string`\> |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `bonderFee` | `PromiseOrValue`\<`BigNumberish`\> |
| `amountOutMin` | `PromiseOrValue`\<`BigNumberish`\> |
| `deadline` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="sethopbridgetokenowner" name="sethopbridgetokenowner"></a> setHopBridgeTokenOwner

▸ **setHopBridgeTokenOwner**(`newOwner`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `newOwner` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setl1bridgeaddress" name="setl1bridgeaddress"></a> setL1BridgeAddress

▸ **setL1BridgeAddress**(`_l1BridgeAddress`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_l1BridgeAddress` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setl1messengerwrapperaddress" name="setl1messengerwrapperaddress"></a> setL1MessengerWrapperAddress

▸ **setL1MessengerWrapperAddress**(`_l1MessengerWrapperAddress`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_l1MessengerWrapperAddress` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setmaxpendingtransfers" name="setmaxpendingtransfers"></a> setMaxPendingTransfers

▸ **setMaxPendingTransfers**(`_maxPendingTransfers`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_maxPendingTransfers` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setmessengergaslimit" name="setmessengergaslimit"></a> setMessengerGasLimit

▸ **setMessengerGasLimit**(`_messengerGasLimit`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_messengerGasLimit` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setminimumbonderfeerequirements" name="setminimumbonderfeerequirements"></a> setMinimumBonderFeeRequirements

▸ **setMinimumBonderFeeRequirements**(`_minBonderBps`, `_minBonderFeeAbsolute`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_minBonderBps` | `PromiseOrValue`\<`BigNumberish`\> |
| `_minBonderFeeAbsolute` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setminimumforcecommitdelay" name="setminimumforcecommitdelay"></a> setMinimumForceCommitDelay

▸ **setMinimumForceCommitDelay**(`_minimumForceCommitDelay`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_minimumForceCommitDelay` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="settransferroot" name="settransferroot"></a> setTransferRoot

▸ **setTransferRoot**(`rootHash`, `totalAmount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootHash` | `PromiseOrValue`\<`BytesLike`\> |
| `totalAmount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setuniswapwrapper" name="setuniswapwrapper"></a> setUniswapWrapper

▸ **setUniswapWrapper**(`_uniswapWrapper`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_uniswapWrapper` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="settlebondedwithdrawal" name="settlebondedwithdrawal"></a> settleBondedWithdrawal

▸ **settleBondedWithdrawal**(`bonder`, `transferId`, `rootHash`, `transferRootTotalAmount`, `proof`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `bonder` | `PromiseOrValue`\<`string`\> |
| `transferId` | `PromiseOrValue`\<`BytesLike`\> |
| `rootHash` | `PromiseOrValue`\<`BytesLike`\> |
| `transferRootTotalAmount` | `PromiseOrValue`\<`BigNumberish`\> |
| `proof` | `PromiseOrValue`\<`BytesLike`\>[] |
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

### <a id="supportedchainids" name="supportedchainids"></a> supportedChainIds

▸ **supportedChainIds**(`arg0`, `overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="transfernonceincrementer" name="transfernonceincrementer"></a> transferNonceIncrementer

▸ **transferNonceIncrementer**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="uniswapwrapper" name="uniswapwrapper"></a> uniswapWrapper

▸ **uniswapWrapper**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

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

▸ **withdraw**(`recipient`, `amount`, `transferNonce`, `bonderFee`, `amountOutMin`, `deadline`, `rootHash`, `transferRootTotalAmount`, `proof`, `overrides?`): `Promise`\<`ContractTransaction`\>

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
| `proof` | `PromiseOrValue`\<`BytesLike`\>[] |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>
