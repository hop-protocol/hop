# Interface: Mock\_L1\_ETH\_Bridge

## Hierarchy

- `BaseContract`

  ↳ **`Mock_L1_ETH_Bridge`**

## Table of contents

### Properties

- [callStatic](Mock_L1_ETH_Bridge.md#callstatic)
- [estimateGas](Mock_L1_ETH_Bridge.md#estimategas)
- [filters](Mock_L1_ETH_Bridge.md#filters)
- [functions](Mock_L1_ETH_Bridge.md#functions)
- [interface](Mock_L1_ETH_Bridge.md#interface)
- [off](Mock_L1_ETH_Bridge.md#off)
- [on](Mock_L1_ETH_Bridge.md#on)
- [once](Mock_L1_ETH_Bridge.md#once)
- [populateTransaction](Mock_L1_ETH_Bridge.md#populatetransaction)
- [removeListener](Mock_L1_ETH_Bridge.md#removelistener)

### Methods

- [CHALLENGE\_AMOUNT\_DIVISOR](Mock_L1_ETH_Bridge.md#challenge_amount_divisor)
- [TIME\_SLOT\_SIZE](Mock_L1_ETH_Bridge.md#time_slot_size)
- [addBonder](Mock_L1_ETH_Bridge.md#addbonder)
- [attach](Mock_L1_ETH_Bridge.md#attach)
- [bondTransferRoot](Mock_L1_ETH_Bridge.md#bondtransferroot)
- [bondWithdrawal](Mock_L1_ETH_Bridge.md#bondwithdrawal)
- [chainBalance](Mock_L1_ETH_Bridge.md#chainbalance)
- [challengePeriod](Mock_L1_ETH_Bridge.md#challengeperiod)
- [challengeResolutionPeriod](Mock_L1_ETH_Bridge.md#challengeresolutionperiod)
- [challengeTransferBond](Mock_L1_ETH_Bridge.md#challengetransferbond)
- [confirmTransferRoot](Mock_L1_ETH_Bridge.md#confirmtransferroot)
- [connect](Mock_L1_ETH_Bridge.md#connect)
- [crossDomainMessengerWrappers](Mock_L1_ETH_Bridge.md#crossdomainmessengerwrappers)
- [deployed](Mock_L1_ETH_Bridge.md#deployed)
- [getBondForTransferAmount](Mock_L1_ETH_Bridge.md#getbondfortransferamount)
- [getBondedWithdrawalAmount](Mock_L1_ETH_Bridge.md#getbondedwithdrawalamount)
- [getChainId](Mock_L1_ETH_Bridge.md#getchainid)
- [getChallengeAmountForTransferAmount](Mock_L1_ETH_Bridge.md#getchallengeamountfortransferamount)
- [getCredit](Mock_L1_ETH_Bridge.md#getcredit)
- [getDebitAndAdditionalDebit](Mock_L1_ETH_Bridge.md#getdebitandadditionaldebit)
- [getIsBonder](Mock_L1_ETH_Bridge.md#getisbonder)
- [getRawDebit](Mock_L1_ETH_Bridge.md#getrawdebit)
- [getTimeSlot](Mock_L1_ETH_Bridge.md#gettimeslot)
- [getTransferId](Mock_L1_ETH_Bridge.md#gettransferid)
- [getTransferRoot](Mock_L1_ETH_Bridge.md#gettransferroot)
- [getTransferRootId](Mock_L1_ETH_Bridge.md#gettransferrootid)
- [governance](Mock_L1_ETH_Bridge.md#governance)
- [isChainIdPaused](Mock_L1_ETH_Bridge.md#ischainidpaused)
- [isTransferIdSpent](Mock_L1_ETH_Bridge.md#istransferidspent)
- [listeners](Mock_L1_ETH_Bridge.md#listeners)
- [minTransferRootBondDelay](Mock_L1_ETH_Bridge.md#mintransferrootbonddelay)
- [queryFilter](Mock_L1_ETH_Bridge.md#queryfilter)
- [removeAllListeners](Mock_L1_ETH_Bridge.md#removealllisteners)
- [removeBonder](Mock_L1_ETH_Bridge.md#removebonder)
- [rescueTransferRoot](Mock_L1_ETH_Bridge.md#rescuetransferroot)
- [resolveChallenge](Mock_L1_ETH_Bridge.md#resolvechallenge)
- [sendToL2](Mock_L1_ETH_Bridge.md#sendtol2)
- [setChainIdDepositsPaused](Mock_L1_ETH_Bridge.md#setchainiddepositspaused)
- [setChallengePeriod](Mock_L1_ETH_Bridge.md#setchallengeperiod)
- [setChallengeResolutionPeriod](Mock_L1_ETH_Bridge.md#setchallengeresolutionperiod)
- [setCrossDomainMessengerWrapper](Mock_L1_ETH_Bridge.md#setcrossdomainmessengerwrapper)
- [setGovernance](Mock_L1_ETH_Bridge.md#setgovernance)
- [setMinTransferRootBondDelay](Mock_L1_ETH_Bridge.md#setmintransferrootbonddelay)
- [settleBondedWithdrawal](Mock_L1_ETH_Bridge.md#settlebondedwithdrawal)
- [settleBondedWithdrawals](Mock_L1_ETH_Bridge.md#settlebondedwithdrawals)
- [stake](Mock_L1_ETH_Bridge.md#stake)
- [timeSlotToAmountBonded](Mock_L1_ETH_Bridge.md#timeslottoamountbonded)
- [transferBonds](Mock_L1_ETH_Bridge.md#transferbonds)
- [transferRootCommittedAt](Mock_L1_ETH_Bridge.md#transferrootcommittedat)
- [unstake](Mock_L1_ETH_Bridge.md#unstake)
- [withdraw](Mock_L1_ETH_Bridge.md#withdraw)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CHALLENGE_AMOUNT_DIVISOR` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `TIME_SLOT_SIZE` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `addBonder` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `bondTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `bondWithdrawal` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `chainBalance` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `challengePeriod` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `challengeResolutionPeriod` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `challengeTransferBond` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `originalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `confirmTransferRoot` | (`originChainId`: `PromiseOrValue`\<`BigNumberish`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `rootCommittedAt`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `crossDomainMessengerWrappers` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `getBondForTransferAmount` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getBondedWithdrawalAmount` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getChallengeAmountForTransferAmount` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getCredit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getDebitAndAdditionalDebit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getIsBonder` | (`maybeBonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `getRawDebit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getTimeSlot` | (`time`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getTransferId` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `getTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`TransferRootStructOutput`\> |
| `getTransferRootId` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `governance` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `isChainIdPaused` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `isTransferIdSpent` | (`transferId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `minTransferRootBondDelay` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `removeBonder` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `rescueTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `originalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `resolveChallenge` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `originalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `sendToL2` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `relayer`: `PromiseOrValue`\<`string`\>, `relayerFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setChainIdDepositsPaused` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `isPaused`: `PromiseOrValue`\<`boolean`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setChallengePeriod` | (`_challengePeriod`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setChallengeResolutionPeriod` | (`_challengeResolutionPeriod`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setCrossDomainMessengerWrapper` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `_crossDomainMessengerWrapper`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setGovernance` | (`_newGovernance`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setMinTransferRootBondDelay` | (`_minTransferRootBondDelay`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `settleBondedWithdrawal` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferId`: `PromiseOrValue`\<`BytesLike`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `transferRootTotalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `transferIdTreeIndex`: `PromiseOrValue`\<`BigNumberish`\>, `siblings`: `PromiseOrValue`\<`BytesLike`\>[], `totalLeaves`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `settleBondedWithdrawals` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferIds`: `PromiseOrValue`\<`BytesLike`\>[], `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `stake` | (`bonder`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `timeSlotToAmountBonded` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `arg1`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `transferBonds` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`, `BigNumber`, `BigNumber`, `BigNumber`, `string`, `boolean`] & \{ `bonder`: `string` ; `challengeResolved`: `boolean` ; `challengeStartTime`: `BigNumber` ; `challenger`: `string` ; `createdAt`: `BigNumber` ; `totalAmount`: `BigNumber`  }\> |
| `transferRootCommittedAt` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
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
| `CHALLENGE_AMOUNT_DIVISOR` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `TIME_SLOT_SIZE` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `addBonder` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `bondTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `bondWithdrawal` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `chainBalance` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `challengePeriod` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `challengeResolutionPeriod` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `challengeTransferBond` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `originalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `confirmTransferRoot` | (`originChainId`: `PromiseOrValue`\<`BigNumberish`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `rootCommittedAt`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `crossDomainMessengerWrappers` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getBondForTransferAmount` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getBondedWithdrawalAmount` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getChallengeAmountForTransferAmount` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getCredit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getDebitAndAdditionalDebit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getIsBonder` | (`maybeBonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getRawDebit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getTimeSlot` | (`time`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getTransferId` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getTransferRootId` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `governance` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `isChainIdPaused` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `isTransferIdSpent` | (`transferId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `minTransferRootBondDelay` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `removeBonder` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `rescueTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `originalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `resolveChallenge` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `originalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `sendToL2` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `relayer`: `PromiseOrValue`\<`string`\>, `relayerFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setChainIdDepositsPaused` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `isPaused`: `PromiseOrValue`\<`boolean`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setChallengePeriod` | (`_challengePeriod`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setChallengeResolutionPeriod` | (`_challengeResolutionPeriod`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setCrossDomainMessengerWrapper` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `_crossDomainMessengerWrapper`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setGovernance` | (`_newGovernance`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setMinTransferRootBondDelay` | (`_minTransferRootBondDelay`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `settleBondedWithdrawal` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferId`: `PromiseOrValue`\<`BytesLike`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `transferRootTotalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `transferIdTreeIndex`: `PromiseOrValue`\<`BigNumberish`\>, `siblings`: `PromiseOrValue`\<`BytesLike`\>[], `totalLeaves`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `settleBondedWithdrawals` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferIds`: `PromiseOrValue`\<`BytesLike`\>[], `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `stake` | (`bonder`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `timeSlotToAmountBonded` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `arg1`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `transferBonds` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `transferRootCommittedAt` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
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
| `ChallengeResolved` | (`transferRootId?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `rootHash?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `originalAmount?`: ``null``) => `ChallengeResolvedEventFilter` |
| `ChallengeResolved(bytes32,bytes32,uint256)` | (`transferRootId?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `rootHash?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `originalAmount?`: ``null``) => `ChallengeResolvedEventFilter` |
| `MultipleWithdrawalsSettled` | (`bonder?`: ``null`` \| `PromiseOrValue`\<`string`\>, `rootHash?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `totalBondsSettled?`: ``null``) => `MultipleWithdrawalsSettledEventFilter` |
| `MultipleWithdrawalsSettled(address,bytes32,uint256)` | (`bonder?`: ``null`` \| `PromiseOrValue`\<`string`\>, `rootHash?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `totalBondsSettled?`: ``null``) => `MultipleWithdrawalsSettledEventFilter` |
| `Stake` | (`account?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``) => `StakeEventFilter` |
| `Stake(address,uint256)` | (`account?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``) => `StakeEventFilter` |
| `TransferBondChallenged` | (`transferRootId?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `rootHash?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `originalAmount?`: ``null``) => `TransferBondChallengedEventFilter` |
| `TransferBondChallenged(bytes32,bytes32,uint256)` | (`transferRootId?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `rootHash?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `originalAmount?`: ``null``) => `TransferBondChallengedEventFilter` |
| `TransferRootBonded` | (`root?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `amount?`: ``null``) => `TransferRootBondedEventFilter` |
| `TransferRootBonded(bytes32,uint256)` | (`root?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `amount?`: ``null``) => `TransferRootBondedEventFilter` |
| `TransferRootConfirmed` | (`originChainId?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `destinationChainId?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `rootHash?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `totalAmount?`: ``null``) => `TransferRootConfirmedEventFilter` |
| `TransferRootConfirmed(uint256,uint256,bytes32,uint256)` | (`originChainId?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `destinationChainId?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `rootHash?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `totalAmount?`: ``null``) => `TransferRootConfirmedEventFilter` |
| `TransferRootSet` | (`rootHash?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `totalAmount?`: ``null``) => `TransferRootSetEventFilter` |
| `TransferRootSet(bytes32,uint256)` | (`rootHash?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `totalAmount?`: ``null``) => `TransferRootSetEventFilter` |
| `TransferSentToL2` | (`chainId?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `recipient?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``, `amountOutMin?`: ``null``, `deadline?`: ``null``, `relayer?`: ``null`` \| `PromiseOrValue`\<`string`\>, `relayerFee?`: ``null``) => `TransferSentToL2EventFilter` |
| `TransferSentToL2(uint256,address,uint256,uint256,uint256,address,uint256)` | (`chainId?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `recipient?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``, `amountOutMin?`: ``null``, `deadline?`: ``null``, `relayer?`: ``null`` \| `PromiseOrValue`\<`string`\>, `relayerFee?`: ``null``) => `TransferSentToL2EventFilter` |
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
| `CHALLENGE_AMOUNT_DIVISOR` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `TIME_SLOT_SIZE` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `addBonder` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `bondTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `bondWithdrawal` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `chainBalance` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `challengePeriod` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `challengeResolutionPeriod` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `challengeTransferBond` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `originalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `confirmTransferRoot` | (`originChainId`: `PromiseOrValue`\<`BigNumberish`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `rootCommittedAt`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `crossDomainMessengerWrappers` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `getBondForTransferAmount` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getBondedWithdrawalAmount` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getChallengeAmountForTransferAmount` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getCredit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getDebitAndAdditionalDebit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getIsBonder` | (`maybeBonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `getRawDebit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getTimeSlot` | (`time`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getTransferId` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `getTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`TransferRootStructOutput`]\> |
| `getTransferRootId` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `governance` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `isChainIdPaused` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `isTransferIdSpent` | (`transferId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `minTransferRootBondDelay` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `removeBonder` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `rescueTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `originalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `resolveChallenge` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `originalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `sendToL2` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `relayer`: `PromiseOrValue`\<`string`\>, `relayerFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setChainIdDepositsPaused` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `isPaused`: `PromiseOrValue`\<`boolean`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setChallengePeriod` | (`_challengePeriod`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setChallengeResolutionPeriod` | (`_challengeResolutionPeriod`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setCrossDomainMessengerWrapper` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `_crossDomainMessengerWrapper`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setGovernance` | (`_newGovernance`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setMinTransferRootBondDelay` | (`_minTransferRootBondDelay`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `settleBondedWithdrawal` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferId`: `PromiseOrValue`\<`BytesLike`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `transferRootTotalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `transferIdTreeIndex`: `PromiseOrValue`\<`BigNumberish`\>, `siblings`: `PromiseOrValue`\<`BytesLike`\>[], `totalLeaves`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `settleBondedWithdrawals` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferIds`: `PromiseOrValue`\<`BytesLike`\>[], `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `stake` | (`bonder`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `timeSlotToAmountBonded` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `arg1`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `transferBonds` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`, `BigNumber`, `BigNumber`, `BigNumber`, `string`, `boolean`] & \{ `bonder`: `string` ; `challengeResolved`: `boolean` ; `challengeStartTime`: `BigNumber` ; `challenger`: `string` ; `createdAt`: `BigNumber` ; `totalAmount`: `BigNumber`  }\> |
| `transferRootCommittedAt` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `unstake` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `withdraw` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `transferRootTotalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `transferIdTreeIndex`: `PromiseOrValue`\<`BigNumberish`\>, `siblings`: `PromiseOrValue`\<`BytesLike`\>[], `totalLeaves`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `Mock_L1_ETH_BridgeInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`Mock_L1_ETH_Bridge`](Mock_L1_ETH_Bridge.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`Mock_L1_ETH_Bridge`](Mock_L1_ETH_Bridge.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`Mock_L1_ETH_Bridge`](Mock_L1_ETH_Bridge.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CHALLENGE_AMOUNT_DIVISOR` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `TIME_SLOT_SIZE` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `addBonder` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `bondTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `bondWithdrawal` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `chainBalance` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `challengePeriod` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `challengeResolutionPeriod` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `challengeTransferBond` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `originalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `confirmTransferRoot` | (`originChainId`: `PromiseOrValue`\<`BigNumberish`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `rootCommittedAt`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `crossDomainMessengerWrappers` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getBondForTransferAmount` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getBondedWithdrawalAmount` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getChallengeAmountForTransferAmount` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getCredit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getDebitAndAdditionalDebit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getIsBonder` | (`maybeBonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getRawDebit` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getTimeSlot` | (`time`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getTransferId` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getTransferRootId` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `governance` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `isChainIdPaused` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `isTransferIdSpent` | (`transferId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `minTransferRootBondDelay` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `removeBonder` | (`bonder`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `rescueTransferRoot` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `originalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `resolveChallenge` | (`rootHash`: `PromiseOrValue`\<`BytesLike`\>, `originalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `sendToL2` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `relayer`: `PromiseOrValue`\<`string`\>, `relayerFee`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setChainIdDepositsPaused` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `isPaused`: `PromiseOrValue`\<`boolean`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setChallengePeriod` | (`_challengePeriod`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setChallengeResolutionPeriod` | (`_challengeResolutionPeriod`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setCrossDomainMessengerWrapper` | (`chainId`: `PromiseOrValue`\<`BigNumberish`\>, `_crossDomainMessengerWrapper`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setGovernance` | (`_newGovernance`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setMinTransferRootBondDelay` | (`_minTransferRootBondDelay`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `settleBondedWithdrawal` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferId`: `PromiseOrValue`\<`BytesLike`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `transferRootTotalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `transferIdTreeIndex`: `PromiseOrValue`\<`BigNumberish`\>, `siblings`: `PromiseOrValue`\<`BytesLike`\>[], `totalLeaves`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `settleBondedWithdrawals` | (`bonder`: `PromiseOrValue`\<`string`\>, `transferIds`: `PromiseOrValue`\<`BytesLike`\>[], `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `stake` | (`bonder`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `timeSlotToAmountBonded` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `arg1`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `transferBonds` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `transferRootCommittedAt` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `unstake` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `withdraw` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `transferNonce`: `PromiseOrValue`\<`BytesLike`\>, `bonderFee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOutMin`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `transferRootTotalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `transferIdTreeIndex`: `PromiseOrValue`\<`BigNumberish`\>, `siblings`: `PromiseOrValue`\<`BytesLike`\>[], `totalLeaves`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`Mock_L1_ETH_Bridge`](Mock_L1_ETH_Bridge.md)\>

#### Overrides

BaseContract.removeListener

## Methods

### <a id="challenge_amount_divisor" name="challenge_amount_divisor"></a> CHALLENGE\_AMOUNT\_DIVISOR

▸ **CHALLENGE_AMOUNT_DIVISOR**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="time_slot_size" name="time_slot_size"></a> TIME\_SLOT\_SIZE

▸ **TIME_SLOT_SIZE**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

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

### <a id="bondtransferroot" name="bondtransferroot"></a> bondTransferRoot

▸ **bondTransferRoot**(`rootHash`, `destinationChainId`, `totalAmount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootHash` | `PromiseOrValue`\<`BytesLike`\> |
| `destinationChainId` | `PromiseOrValue`\<`BigNumberish`\> |
| `totalAmount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

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

### <a id="chainbalance" name="chainbalance"></a> chainBalance

▸ **chainBalance**(`arg0`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="challengeperiod" name="challengeperiod"></a> challengePeriod

▸ **challengePeriod**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="challengeresolutionperiod" name="challengeresolutionperiod"></a> challengeResolutionPeriod

▸ **challengeResolutionPeriod**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="challengetransferbond" name="challengetransferbond"></a> challengeTransferBond

▸ **challengeTransferBond**(`rootHash`, `originalAmount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootHash` | `PromiseOrValue`\<`BytesLike`\> |
| `originalAmount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="confirmtransferroot" name="confirmtransferroot"></a> confirmTransferRoot

▸ **confirmTransferRoot**(`originChainId`, `rootHash`, `destinationChainId`, `totalAmount`, `rootCommittedAt`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `originChainId` | `PromiseOrValue`\<`BigNumberish`\> |
| `rootHash` | `PromiseOrValue`\<`BytesLike`\> |
| `destinationChainId` | `PromiseOrValue`\<`BigNumberish`\> |
| `totalAmount` | `PromiseOrValue`\<`BigNumberish`\> |
| `rootCommittedAt` | `PromiseOrValue`\<`BigNumberish`\> |
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

### <a id="crossdomainmessengerwrappers" name="crossdomainmessengerwrappers"></a> crossDomainMessengerWrappers

▸ **crossDomainMessengerWrappers**(`arg0`, `overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="deployed" name="deployed"></a> deployed

▸ **deployed**(): `Promise`\<[`Mock_L1_ETH_Bridge`](Mock_L1_ETH_Bridge.md)\>

#### Returns

`Promise`\<[`Mock_L1_ETH_Bridge`](Mock_L1_ETH_Bridge.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="getbondfortransferamount" name="getbondfortransferamount"></a> getBondForTransferAmount

▸ **getBondForTransferAmount**(`amount`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

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

### <a id="getchallengeamountfortransferamount" name="getchallengeamountfortransferamount"></a> getChallengeAmountForTransferAmount

▸ **getChallengeAmountForTransferAmount**(`amount`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
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

### <a id="gettimeslot" name="gettimeslot"></a> getTimeSlot

▸ **getTimeSlot**(`time`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `time` | `PromiseOrValue`\<`BigNumberish`\> |
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

### <a id="governance" name="governance"></a> governance

▸ **governance**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="ischainidpaused" name="ischainidpaused"></a> isChainIdPaused

▸ **isChainIdPaused**(`arg0`, `overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

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

### <a id="mintransferrootbonddelay" name="mintransferrootbonddelay"></a> minTransferRootBondDelay

▸ **minTransferRootBondDelay**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

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

### <a id="resolvechallenge" name="resolvechallenge"></a> resolveChallenge

▸ **resolveChallenge**(`rootHash`, `originalAmount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootHash` | `PromiseOrValue`\<`BytesLike`\> |
| `originalAmount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="sendtol2" name="sendtol2"></a> sendToL2

▸ **sendToL2**(`chainId`, `recipient`, `amount`, `amountOutMin`, `deadline`, `relayer`, `relayerFee`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `PromiseOrValue`\<`BigNumberish`\> |
| `recipient` | `PromiseOrValue`\<`string`\> |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `amountOutMin` | `PromiseOrValue`\<`BigNumberish`\> |
| `deadline` | `PromiseOrValue`\<`BigNumberish`\> |
| `relayer` | `PromiseOrValue`\<`string`\> |
| `relayerFee` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setchainiddepositspaused" name="setchainiddepositspaused"></a> setChainIdDepositsPaused

▸ **setChainIdDepositsPaused**(`chainId`, `isPaused`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `PromiseOrValue`\<`BigNumberish`\> |
| `isPaused` | `PromiseOrValue`\<`boolean`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setchallengeperiod" name="setchallengeperiod"></a> setChallengePeriod

▸ **setChallengePeriod**(`_challengePeriod`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_challengePeriod` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setchallengeresolutionperiod" name="setchallengeresolutionperiod"></a> setChallengeResolutionPeriod

▸ **setChallengeResolutionPeriod**(`_challengeResolutionPeriod`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_challengeResolutionPeriod` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setcrossdomainmessengerwrapper" name="setcrossdomainmessengerwrapper"></a> setCrossDomainMessengerWrapper

▸ **setCrossDomainMessengerWrapper**(`chainId`, `_crossDomainMessengerWrapper`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `PromiseOrValue`\<`BigNumberish`\> |
| `_crossDomainMessengerWrapper` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setgovernance" name="setgovernance"></a> setGovernance

▸ **setGovernance**(`_newGovernance`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_newGovernance` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setmintransferrootbonddelay" name="setmintransferrootbonddelay"></a> setMinTransferRootBondDelay

▸ **setMinTransferRootBondDelay**(`_minTransferRootBondDelay`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_minTransferRootBondDelay` | `PromiseOrValue`\<`BigNumberish`\> |
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

### <a id="timeslottoamountbonded" name="timeslottoamountbonded"></a> timeSlotToAmountBonded

▸ **timeSlotToAmountBonded**(`arg0`, `arg1`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`BigNumberish`\> |
| `arg1` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="transferbonds" name="transferbonds"></a> transferBonds

▸ **transferBonds**(`arg0`, `overrides?`): `Promise`\<[`string`, `BigNumber`, `BigNumber`, `BigNumber`, `string`, `boolean`] & \{ `bonder`: `string` ; `challengeResolved`: `boolean` ; `challengeStartTime`: `BigNumber` ; `challenger`: `string` ; `createdAt`: `BigNumber` ; `totalAmount`: `BigNumber`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<[`string`, `BigNumber`, `BigNumber`, `BigNumber`, `string`, `boolean`] & \{ `bonder`: `string` ; `challengeResolved`: `boolean` ; `challengeStartTime`: `BigNumber` ; `challenger`: `string` ; `createdAt`: `BigNumber` ; `totalAmount`: `BigNumber`  }\>

___

### <a id="transferrootcommittedat" name="transferrootcommittedat"></a> transferRootCommittedAt

▸ **transferRootCommittedAt**(`arg0`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`BytesLike`\> |
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
