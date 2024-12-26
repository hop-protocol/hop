# Interface: L2\_ArbitrumBridge

## Hierarchy

- `BaseContract`

  ↳ **`L2_ArbitrumBridge`**

## Table of contents

### Properties

- [callStatic](L2_ArbitrumBridge.md#callstatic)
- [estimateGas](L2_ArbitrumBridge.md#estimategas)
- [filters](L2_ArbitrumBridge.md#filters)
- [functions](L2_ArbitrumBridge.md#functions)
- [interface](L2_ArbitrumBridge.md#interface)
- [off](L2_ArbitrumBridge.md#off)
- [on](L2_ArbitrumBridge.md#on)
- [once](L2_ArbitrumBridge.md#once)
- [populateTransaction](L2_ArbitrumBridge.md#populatetransaction)
- [removeListener](L2_ArbitrumBridge.md#removelistener)

### Methods

- [activeChainIds](L2_ArbitrumBridge.md#activechainids)
- [addActiveChainIds](L2_ArbitrumBridge.md#addactivechainids)
- [addBonder](L2_ArbitrumBridge.md#addbonder)
- [ammWrapper](L2_ArbitrumBridge.md#ammwrapper)
- [attach](L2_ArbitrumBridge.md#attach)
- [bondWithdrawal](L2_ArbitrumBridge.md#bondwithdrawal)
- [bondWithdrawalAndDistribute](L2_ArbitrumBridge.md#bondwithdrawalanddistribute)
- [commitTransfers](L2_ArbitrumBridge.md#committransfers)
- [connect](L2_ArbitrumBridge.md#connect)
- [deployed](L2_ArbitrumBridge.md#deployed)
- [distribute](L2_ArbitrumBridge.md#distribute)
- [getBondedWithdrawalAmount](L2_ArbitrumBridge.md#getbondedwithdrawalamount)
- [getChainId](L2_ArbitrumBridge.md#getchainid)
- [getCredit](L2_ArbitrumBridge.md#getcredit)
- [getDebitAndAdditionalDebit](L2_ArbitrumBridge.md#getdebitandadditionaldebit)
- [getIsBonder](L2_ArbitrumBridge.md#getisbonder)
- [getNextTransferNonce](L2_ArbitrumBridge.md#getnexttransfernonce)
- [getRawDebit](L2_ArbitrumBridge.md#getrawdebit)
- [getTransferId](L2_ArbitrumBridge.md#gettransferid)
- [getTransferRoot](L2_ArbitrumBridge.md#gettransferroot)
- [getTransferRootId](L2_ArbitrumBridge.md#gettransferrootid)
- [hToken](L2_ArbitrumBridge.md#htoken)
- [isTransferIdSpent](L2_ArbitrumBridge.md#istransferidspent)
- [l1BridgeAddress](L2_ArbitrumBridge.md#l1bridgeaddress)
- [l1BridgeCaller](L2_ArbitrumBridge.md#l1bridgecaller)
- [l1Governance](L2_ArbitrumBridge.md#l1governance)
- [lastCommitTimeForChainId](L2_ArbitrumBridge.md#lastcommittimeforchainid)
- [listeners](L2_ArbitrumBridge.md#listeners)
- [maxPendingTransfers](L2_ArbitrumBridge.md#maxpendingtransfers)
- [messenger](L2_ArbitrumBridge.md#messenger)
- [minBonderBps](L2_ArbitrumBridge.md#minbonderbps)
- [minBonderFeeAbsolute](L2_ArbitrumBridge.md#minbonderfeeabsolute)
- [minimumForceCommitDelay](L2_ArbitrumBridge.md#minimumforcecommitdelay)
- [pendingAmountForChainId](L2_ArbitrumBridge.md#pendingamountforchainid)
- [pendingTransferIdsForChainId](L2_ArbitrumBridge.md#pendingtransferidsforchainid)
- [queryFilter](L2_ArbitrumBridge.md#queryfilter)
- [removeActiveChainIds](L2_ArbitrumBridge.md#removeactivechainids)
- [removeAllListeners](L2_ArbitrumBridge.md#removealllisteners)
- [removeBonder](L2_ArbitrumBridge.md#removebonder)
- [rescueTransferRoot](L2_ArbitrumBridge.md#rescuetransferroot)
- [send](L2_ArbitrumBridge.md#send)
- [setAmmWrapper](L2_ArbitrumBridge.md#setammwrapper)
- [setHopBridgeTokenOwner](L2_ArbitrumBridge.md#sethopbridgetokenowner)
- [setL1BridgeAddress](L2_ArbitrumBridge.md#setl1bridgeaddress)
- [setL1BridgeCaller](L2_ArbitrumBridge.md#setl1bridgecaller)
- [setL1Governance](L2_ArbitrumBridge.md#setl1governance)
- [setMaxPendingTransfers](L2_ArbitrumBridge.md#setmaxpendingtransfers)
- [setMessenger](L2_ArbitrumBridge.md#setmessenger)
- [setMinimumBonderFeeRequirements](L2_ArbitrumBridge.md#setminimumbonderfeerequirements)
- [setMinimumForceCommitDelay](L2_ArbitrumBridge.md#setminimumforcecommitdelay)
- [setTransferRoot](L2_ArbitrumBridge.md#settransferroot)
- [settleBondedWithdrawal](L2_ArbitrumBridge.md#settlebondedwithdrawal)
- [settleBondedWithdrawals](L2_ArbitrumBridge.md#settlebondedwithdrawals)
- [stake](L2_ArbitrumBridge.md#stake)
- [transferNonceIncrementer](L2_ArbitrumBridge.md#transfernonceincrementer)
- [unstake](L2_ArbitrumBridge.md#unstake)
- [withdraw](L2_ArbitrumBridge.md#withdraw)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `activeChainIds` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `addActiveChainIds` | (`chainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `addBonder` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `ammWrapper` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `bondWithdrawal` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `bondWithdrawalAndDistribute` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `commitTransfers` | (`destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `distribute` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `relayer`: `PromiseOrValue`\<`string`\>, `relayerFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
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
| `l1BridgeCaller` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `l1Governance` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `lastCommitTimeForChainId` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `maxPendingTransfers` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `messenger` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `minBonderBps` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `minBonderFeeAbsolute` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `minimumForceCommitDelay` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `pendingAmountForChainId` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `pendingTransferIdsForChainId` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `arg1`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `removeActiveChainIds` | (`chainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `removeBonder` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `rescueTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `originalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `send` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setAmmWrapper` | (`_ammWrapper`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setHopBridgeTokenOwner` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setL1BridgeAddress` | (`_l1BridgeAddress`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setL1BridgeCaller` | (`_l1BridgeCaller`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setL1Governance` | (`_l1Governance`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setMaxPendingTransfers` | (`_maxPendingTransfers`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setMessenger` | (`_messenger`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setMinimumBonderFeeRequirements` | (`_minBonderBps`: `PromiseOrValue`\<`BigNumberish`\>, `_minBonderFeeAbsolute`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setMinimumForceCommitDelay` | (`_minimumForceCommitDelay`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `settleBondedWithdrawal` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferId`: `PromiseOrValue`\<`BytesLike`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `transferRootTotalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `transferIdTreeIndex`: `PromiseOrValue`\<`BigNumberish`\>, `siblings`: `PromiseOrValue`\<`BytesLike`\>[], `totalLeaves`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `settleBondedWithdrawals` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferIds`: `PromiseOrValue`\<`BytesLike`\>[], `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `stake` | (`bonder`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `transferNonceIncrementer` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
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
| `activeChainIds` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `addActiveChainIds` | (`chainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `addBonder` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `ammWrapper` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `bondWithdrawal` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `bondWithdrawalAndDistribute` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `commitTransfers` | (`destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `distribute` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `relayer`: `PromiseOrValue`\<`string`\>, `relayerFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
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
| `l1BridgeCaller` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l1Governance` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `lastCommitTimeForChainId` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `maxPendingTransfers` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `messenger` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `minBonderBps` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `minBonderFeeAbsolute` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `minimumForceCommitDelay` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `pendingAmountForChainId` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `pendingTransferIdsForChainId` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `arg1`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `removeActiveChainIds` | (`chainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `removeBonder` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `rescueTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `originalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `send` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setAmmWrapper` | (`_ammWrapper`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setHopBridgeTokenOwner` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setL1BridgeAddress` | (`_l1BridgeAddress`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setL1BridgeCaller` | (`_l1BridgeCaller`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setL1Governance` | (`_l1Governance`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setMaxPendingTransfers` | (`_maxPendingTransfers`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setMessenger` | (`_messenger`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setMinimumBonderFeeRequirements` | (`_minBonderBps`: `PromiseOrValue`\<`BigNumberish`\>, `_minBonderFeeAbsolute`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setMinimumForceCommitDelay` | (`_minimumForceCommitDelay`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `settleBondedWithdrawal` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferId`: `PromiseOrValue`\<`BytesLike`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `transferRootTotalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `transferIdTreeIndex`: `PromiseOrValue`\<`BigNumberish`\>, `siblings`: `PromiseOrValue`\<`BytesLike`\>[], `totalLeaves`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `settleBondedWithdrawals` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferIds`: `PromiseOrValue`\<`BytesLike`\>[], `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `stake` | (`bonder`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `transferNonceIncrementer` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
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
| `TransferFromL1Completed` | (`recipient?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``, `amountOutMin?`: ``null``, `deadline?`: ``null``, `relayer?`: ``null`` \| `PromiseOrValue`\<`string`\>, `relayerFee?`: ``null``) => `TransferFromL1CompletedEventFilter` |
| `TransferFromL1Completed(address,uint256,uint256,uint256,address,uint256)` | (`recipient?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``, `amountOutMin?`: ``null``, `deadline?`: ``null``, `relayer?`: ``null`` \| `PromiseOrValue`\<`string`\>, `relayerFee?`: ``null``) => `TransferFromL1CompletedEventFilter` |
| `TransferRootSet` | (`rootHash?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `totalAmount?`: ``null``) => `TransferRootSetEventFilter` |
| `TransferRootSet(bytes32,uint256)` | (`rootHash?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `totalAmount?`: ``null``) => `TransferRootSetEventFilter` |
| `TransferSent` | (`transferId?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `chainId?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `recipient?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``, `transferNonce?`: ``null``, `bonderFee?`: ``null``, `index?`: ``null``, `amountOutMin?`: ``null``, `deadline?`: ``null``) => `TransferSentEventFilter` |
| `TransferSent(bytes32,uint256,address,uint256,bytes32,uint256,uint256,uint256,uint256)` | (`transferId?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `chainId?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `recipient?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``, `transferNonce?`: ``null``, `bonderFee?`: ``null``, `index?`: ``null``, `amountOutMin?`: ``null``, `deadline?`: ``null``) => `TransferSentEventFilter` |
| `TransfersCommitted` | (`destinationChainId?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `rootHash?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `totalAmount?`: ``null``, `rootCommittedAt?`: ``null``) => `TransfersCommittedEventFilter` |
| `TransfersCommitted(uint256,bytes32,uint256,uint256)` | (`destinationChainId?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `rootHash?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `totalAmount?`: ``null``, `rootCommittedAt?`: ``null``) => `TransfersCommittedEventFilter` |
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
| `activeChainIds` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `addActiveChainIds` | (`chainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `addBonder` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `ammWrapper` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `bondWithdrawal` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `bondWithdrawalAndDistribute` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `commitTransfers` | (`destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `distribute` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `relayer`: `PromiseOrValue`\<`string`\>, `relayerFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
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
| `l1BridgeCaller` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `l1Governance` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `lastCommitTimeForChainId` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `maxPendingTransfers` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `messenger` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `minBonderBps` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `minBonderFeeAbsolute` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `minimumForceCommitDelay` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `pendingAmountForChainId` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `pendingTransferIdsForChainId` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `arg1`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `removeActiveChainIds` | (`chainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `removeBonder` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `rescueTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `originalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `send` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setAmmWrapper` | (`_ammWrapper`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setHopBridgeTokenOwner` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setL1BridgeAddress` | (`_l1BridgeAddress`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setL1BridgeCaller` | (`_l1BridgeCaller`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setL1Governance` | (`_l1Governance`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setMaxPendingTransfers` | (`_maxPendingTransfers`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setMessenger` | (`_messenger`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setMinimumBonderFeeRequirements` | (`_minBonderBps`: `PromiseOrValue`\<`BigNumberish`\>, `_minBonderFeeAbsolute`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setMinimumForceCommitDelay` | (`_minimumForceCommitDelay`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `settleBondedWithdrawal` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferId`: `PromiseOrValue`\<`BytesLike`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `transferRootTotalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `transferIdTreeIndex`: `PromiseOrValue`\<`BigNumberish`\>, `siblings`: `PromiseOrValue`\<`BytesLike`\>[], `totalLeaves`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `settleBondedWithdrawals` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferIds`: `PromiseOrValue`\<`BytesLike`\>[], `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `stake` | (`bonder`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `transferNonceIncrementer` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `unstake` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `withdraw` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `transferRootTotalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `transferIdTreeIndex`: `PromiseOrValue`\<`BigNumberish`\>, `siblings`: `PromiseOrValue`\<`BytesLike`\>[], `totalLeaves`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `L2_ArbitrumBridgeInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`L2_ArbitrumBridge`](L2_ArbitrumBridge.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`L2_ArbitrumBridge`](L2_ArbitrumBridge.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`L2_ArbitrumBridge`](L2_ArbitrumBridge.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `activeChainIds` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `addActiveChainIds` | (`chainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `addBonder` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `ammWrapper` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `bondWithdrawal` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `bondWithdrawalAndDistribute` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `commitTransfers` | (`destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `distribute` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `relayer`: `PromiseOrValue`\<`string`\>, `relayerFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
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
| `l1BridgeCaller` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `l1Governance` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `lastCommitTimeForChainId` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `maxPendingTransfers` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `messenger` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `minBonderBps` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `minBonderFeeAbsolute` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `minimumForceCommitDelay` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `pendingAmountForChainId` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `pendingTransferIdsForChainId` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `arg1`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `removeActiveChainIds` | (`chainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `removeBonder` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `rescueTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `originalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `send` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setAmmWrapper` | (`_ammWrapper`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setHopBridgeTokenOwner` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setL1BridgeAddress` | (`_l1BridgeAddress`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setL1BridgeCaller` | (`_l1BridgeCaller`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setL1Governance` | (`_l1Governance`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setMaxPendingTransfers` | (`_maxPendingTransfers`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setMessenger` | (`_messenger`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setMinimumBonderFeeRequirements` | (`_minBonderBps`: `PromiseOrValue`\<`BigNumberish`\>, `_minBonderFeeAbsolute`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setMinimumForceCommitDelay` | (`_minimumForceCommitDelay`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `settleBondedWithdrawal` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferId`: `PromiseOrValue`\<`BytesLike`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `transferRootTotalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `transferIdTreeIndex`: `PromiseOrValue`\<`BigNumberish`\>, `siblings`: `PromiseOrValue`\<`BytesLike`\>[], `totalLeaves`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `settleBondedWithdrawals` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferIds`: `PromiseOrValue`\<`BytesLike`\>[], `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `stake` | (`bonder`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `transferNonceIncrementer` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `unstake` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `withdraw` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `transferRootTotalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `transferIdTreeIndex`: `PromiseOrValue`\<`BigNumberish`\>, `siblings`: `PromiseOrValue`\<`BytesLike`\>[], `totalLeaves`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`L2_ArbitrumBridge`](L2_ArbitrumBridge.md)\>

#### Overrides

BaseContract.removeListener

## Methods

### <a id="activechainids" name="activechainids"></a> activeChainIds

▸ **activeChainIds**(`arg0`, `overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="addactivechainids" name="addactivechainids"></a> addActiveChainIds

▸ **addActiveChainIds**(`chainIds`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainIds` | `PromiseOrValue`\<`BigNumberish`\>[] |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

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

### <a id="ammwrapper" name="ammwrapper"></a> ammWrapper

▸ **ammWrapper**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

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

### <a id="deployed" name="deployed"></a> deployed

▸ **deployed**(): `Promise`\<[`L2_ArbitrumBridge`](L2_ArbitrumBridge.md)\>

#### Returns

`Promise`\<[`L2_ArbitrumBridge`](L2_ArbitrumBridge.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="distribute" name="distribute"></a> distribute

▸ **distribute**(`recipient`, `amount`, `amountOutMin`, `deadline`, `relayer`, `relayerFee`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `recipient` | `PromiseOrValue`\<`string`\> |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `amountOutMin` | `PromiseOrValue`\<`BigNumberish`\> |
| `deadline` | `PromiseOrValue`\<`BigNumberish`\> |
| `relayer` | `PromiseOrValue`\<`string`\> |
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

### <a id="l1bridgecaller" name="l1bridgecaller"></a> l1BridgeCaller

▸ **l1BridgeCaller**(`overrides?`): `Promise`\<`string`\>

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

### <a id="removeactivechainids" name="removeactivechainids"></a> removeActiveChainIds

▸ **removeActiveChainIds**(`chainIds`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainIds` | `PromiseOrValue`\<`BigNumberish`\>[] |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

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

### <a id="setammwrapper" name="setammwrapper"></a> setAmmWrapper

▸ **setAmmWrapper**(`_ammWrapper`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_ammWrapper` | `PromiseOrValue`\<`string`\> |
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

### <a id="setl1bridgecaller" name="setl1bridgecaller"></a> setL1BridgeCaller

▸ **setL1BridgeCaller**(`_l1BridgeCaller`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_l1BridgeCaller` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setl1governance" name="setl1governance"></a> setL1Governance

▸ **setL1Governance**(`_l1Governance`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_l1Governance` | `PromiseOrValue`\<`string`\> |
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

### <a id="transfernonceincrementer" name="transfernonceincrementer"></a> transferNonceIncrementer

▸ **transferNonceIncrementer**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

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
