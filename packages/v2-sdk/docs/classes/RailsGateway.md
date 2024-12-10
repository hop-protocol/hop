# Class: RailsGateway

## Hierarchy

- `StakingRegistry`

  ↳ **`RailsGateway`**

## Table of contents

### Constructors

- [constructor](RailsGateway.md#constructor)

### Properties

- [batchBlocks](RailsGateway.md#batchblocks)
- [chainId](RailsGateway.md#chainid)
- [contractAddresses](RailsGateway.md#contractaddresses)
- [gasPriceMultiplier](RailsGateway.md#gaspricemultiplier)
- [l1ChainId](RailsGateway.md#l1chainid)
- [network](RailsGateway.md#network)
- [signersOrProviders](RailsGateway.md#signersorproviders)
- [EventName](RailsGateway.md#eventname)

### Accessors

- [helpers](RailsGateway.md#helpers)
- [populateTransaction](RailsGateway.md#populatetransaction)
- [utils](RailsGateway.md#utils)

### Methods

- [acceptSlash](RailsGateway.md#acceptslash)
- [addDecodedTypesToEvent](RailsGateway.md#adddecodedtypestoevent)
- [addDecodedTypesToEvents](RailsGateway.md#adddecodedtypestoevents)
- [addDecodedTypesToTransferBondedEvents](RailsGateway.md#adddecodedtypestotransferbondedevents)
- [addDecodedTypesToTransferSentEvents](RailsGateway.md#adddecodedtypestotransfersentevents)
- [addToAppeal](RailsGateway.md#addtoappeal)
- [addToChallenge](RailsGateway.md#addtochallenge)
- [appealPeriod](RailsGateway.md#appealperiod)
- [batchUpdateClaimChain](RailsGateway.md#batchupdateclaimchain)
- [bond](RailsGateway.md#bond)
- [challengePeriod](RailsGateway.md#challengeperiod)
- [challenges](RailsGateway.md#challenges)
- [claimFeesFromPath](RailsGateway.md#claimfeesfrompath)
- [confirmClaim](RailsGateway.md#confirmclaim)
- [createChallenge](RailsGateway.md#createchallenge)
- [distributeClaimedFees](RailsGateway.md#distributeclaimedfees)
- [distributeExcessFees](RailsGateway.md#distributeexcessfees)
- [forceSettleChallenge](RailsGateway.md#forcesettlechallenge)
- [fullAppeal](RailsGateway.md#fullappeal)
- [getAmountOut](RailsGateway.md#getamountout)
- [getBatchUpdateFee](RailsGateway.md#getbatchupdatefee)
- [getBucketIndex](RailsGateway.md#getbucketindex)
- [getChainIdsSupportedByTokenSymbol](RailsGateway.md#getchainidssupportedbytokensymbol)
- [getChallengeId](RailsGateway.md#getchallengeid)
- [getClaimFeesFee](RailsGateway.md#getclaimfeesfee)
- [getColorForChainId](RailsGateway.md#getcolorforchainid)
- [getConfigAddress](RailsGateway.md#getconfigaddress)
- [getConfigStartBlock](RailsGateway.md#getconfigstartblock)
- [getContractAddresses](RailsGateway.md#getcontractaddresses)
- [getContractExists](RailsGateway.md#getcontractexists)
- [getDefaultProvider](RailsGateway.md#getdefaultprovider)
- [getDefaultProviders](RailsGateway.md#getdefaultproviders)
- [getEthersWeb3Signer](RailsGateway.md#getethersweb3signer)
- [getEventFetcher](RailsGateway.md#geteventfetcher)
- [getEventFilter](RailsGateway.md#geteventfilter)
- [getEventNames](RailsGateway.md#geteventnames)
- [getExplorerApiBaseUrl](RailsGateway.md#getexplorerapibaseurl)
- [getFeePrice](RailsGateway.md#getfeeprice)
- [getHasSufficientBalance](RailsGateway.md#gethassufficientbalance)
- [getHeadClaimId](RailsGateway.md#getheadclaimid)
- [getHopBalance](RailsGateway.md#gethopbalance)
- [getHopTokenAddress](RailsGateway.md#gethoptokenaddress)
- [getHopTokenContract](RailsGateway.md#gethoptokencontract)
- [getHubChainId](RailsGateway.md#gethubchainid)
- [getIsClaimIdValid](RailsGateway.md#getisclaimidvalid)
- [getMessageFee](RailsGateway.md#getmessagefee)
- [getMinBonderStake](RailsGateway.md#getminbonderstake)
- [getNextHopsHash](RailsGateway.md#getnexthopshash)
- [getPathId](RailsGateway.md#getpathid)
- [getPathInfo](RailsGateway.md#getpathinfo)
- [getProvider](RailsGateway.md#getprovider)
- [getRailsGatewayContract](RailsGateway.md#getrailsgatewaycontract)
- [getRailsGatewayContractAddress](RailsGateway.md#getrailsgatewaycontractaddress)
- [getRemoveFee](RailsGateway.md#getremovefee)
- [getSendFee](RailsGateway.md#getsendfee)
- [getSigner](RailsGateway.md#getsigner)
- [getSignerAddress](RailsGateway.md#getsigneraddress)
- [getSignerOrProvider](RailsGateway.md#getsignerorprovider)
- [getSignerProviderChainId](RailsGateway.md#getsignerproviderchainid)
- [getStakedBalance](RailsGateway.md#getstakedbalance)
- [getStakingRegistryAddress](RailsGateway.md#getstakingregistryaddress)
- [getStakingRegistryContract](RailsGateway.md#getstakingregistrycontract)
- [getSupportedChainIds](RailsGateway.md#getsupportedchainids)
- [getSupportedTokenSymbols](RailsGateway.md#getsupportedtokensymbols)
- [getSupportedTokenSymbolsByChainId](RailsGateway.md#getsupportedtokensymbolsbychainid)
- [getTokenAddressByTokenSymbol](RailsGateway.md#gettokenaddressbytokensymbol)
- [getTokenContract](RailsGateway.md#gettokencontract)
- [getTokenInfo](RailsGateway.md#gettokeninfo)
- [getTokenSymbolByTokenAddress](RailsGateway.md#gettokensymbolbytokenaddress)
- [getTransferBondedEventFilter](RailsGateway.md#gettransferbondedeventfilter)
- [getTransferBondedEventFromTransactionHash](RailsGateway.md#gettransferbondedeventfromtransactionhash)
- [getTransferBondedEventFromTransactionReceipt](RailsGateway.md#gettransferbondedeventfromtransactionreceipt)
- [getTransferBondedEventFromTransferId](RailsGateway.md#gettransferbondedeventfromtransferid)
- [getTransferBondedEvents](RailsGateway.md#gettransferbondedevents)
- [getTransferDataHash](RailsGateway.md#gettransferdatahash)
- [getTransferSentEventFilter](RailsGateway.md#gettransfersenteventfilter)
- [getTransferSentEventFromTransactionHash](RailsGateway.md#gettransfersenteventfromtransactionhash)
- [getTransferSentEventFromTransactionReceipt](RailsGateway.md#gettransfersenteventfromtransactionreceipt)
- [getTransferSentEventFromTransferId](RailsGateway.md#gettransfersenteventfromtransferid)
- [getTransferSentEvents](RailsGateway.md#gettransfersentevents)
- [getTransferSentEventsFromPathId](RailsGateway.md#gettransfersenteventsfrompathid)
- [getTransferSentEventsInBatches](RailsGateway.md#gettransfersenteventsinbatches)
- [getTxOverrides](RailsGateway.md#gettxoverrides)
- [getUpdateFee](RailsGateway.md#getupdatefee)
- [getWithdrawableBalance](RailsGateway.md#getwithdrawablebalance)
- [getWithdrawableStakeBalance](RailsGateway.md#getwithdrawablestakebalance)
- [isStaked](RailsGateway.md#isstaked)
- [isValidClaim](RailsGateway.md#isvalidclaim)
- [isValidTransfer](RailsGateway.md#isvalidtransfer)
- [minChallengeIncrease](RailsGateway.md#minchallengeincrease)
- [minHopStake](RailsGateway.md#minhopstake)
- [optimisticallySettleChallenge](RailsGateway.md#optimisticallysettlechallenge)
- [postClaim](RailsGateway.md#postclaim)
- [registryStakeHop](RailsGateway.md#registrystakehop)
- [registryStakeHopPopulatedTx](RailsGateway.md#registrystakehoppopulatedtx)
- [registryUnstakeHop](RailsGateway.md#registryunstakehop)
- [registryUnstakeHopPopulatedTx](RailsGateway.md#registryunstakehoppopulatedtx)
- [registryWithdraw](RailsGateway.md#registrywithdraw)
- [registryWithdrawPopulatedTx](RailsGateway.md#registrywithdrawpopulatedtx)
- [removeClaim](RailsGateway.md#removeclaim)
- [send](RailsGateway.md#send)
- [sendTransaction](RailsGateway.md#sendtransaction)
- [setContractAddresses](RailsGateway.md#setcontractaddresses)
- [setExplorerApiBaseUrl](RailsGateway.md#setexplorerapibaseurl)
- [setFeePrice](RailsGateway.md#setfeeprice)
- [setFeePrices](RailsGateway.md#setfeeprices)
- [setProvider](RailsGateway.md#setprovider)
- [setProviderUrl](RailsGateway.md#setproviderurl)
- [setProviderUrls](RailsGateway.md#setproviderurls)
- [setProviders](RailsGateway.md#setproviders)
- [signalPreference](RailsGateway.md#signalpreference)
- [signalPreferencePopulatedTx](RailsGateway.md#signalpreferencepopulatedtx)
- [stakeHop](RailsGateway.md#stakehop)
- [throwError](RailsGateway.md#throwerror)
- [totalClaims](RailsGateway.md#totalclaims)
- [totalClaimsAtClaimId](RailsGateway.md#totalclaimsatclaimid)
- [totalConfirmed](RailsGateway.md#totalconfirmed)
- [totalSent](RailsGateway.md#totalsent)
- [unstakeHop](RailsGateway.md#unstakehop)
- [updateClaimChain](RailsGateway.md#updateclaimchain)
- [withdraw](RailsGateway.md#withdraw)
- [withdrawAll](RailsGateway.md#withdrawall)
- [withdrawHop](RailsGateway.md#withdrawhop)
- [addDecodedTypesToEvent](RailsGateway.md#adddecodedtypestoevent-1)
- [addDecodedTypesToEvents](RailsGateway.md#adddecodedtypestoevents-1)
- [addDecodedTypesToTransferBondedEvents](RailsGateway.md#adddecodedtypestotransferbondedevents-1)
- [addDecodedTypesToTransferSentEvents](RailsGateway.md#adddecodedtypestotransfersentevents-1)
- [deriveNetwork](RailsGateway.md#derivenetwork)
- [getComputedNextHopsHash](RailsGateway.md#getcomputednexthopshash)
- [getDefaultProvider](RailsGateway.md#getdefaultprovider-1)
- [getDefaultProviders](RailsGateway.md#getdefaultproviders-1)
- [getEventNames](RailsGateway.md#geteventnames-1)
- [getTransferBondedEventSignature](RailsGateway.md#gettransferbondedeventsignature)
- [getTransferSentEventSignature](RailsGateway.md#gettransfersenteventsignature)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new RailsGateway**(`«destructured»`): [`RailsGateway`](RailsGateway.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`RailsGatewayConstructorInput`](../modules.md#railsgatewayconstructorinput) |

#### Returns

[`RailsGateway`](RailsGateway.md)

#### Overrides

StakingRegistry.constructor

## Properties

### <a id="batchblocks" name="batchblocks"></a> batchBlocks

• **batchBlocks**: `number`

#### Inherited from

StakingRegistry.batchBlocks

___

### <a id="chainid" name="chainid"></a> chainId

• **chainId**: `BigNumberish`

___

### <a id="contractaddresses" name="contractaddresses"></a> contractAddresses

• **contractAddresses**: `Addresses`

#### Inherited from

StakingRegistry.contractAddresses

___

### <a id="gaspricemultiplier" name="gaspricemultiplier"></a> gasPriceMultiplier

• **gasPriceMultiplier**: `number`

#### Inherited from

StakingRegistry.gasPriceMultiplier

___

### <a id="l1chainid" name="l1chainid"></a> l1ChainId

• **l1ChainId**: `number`

#### Inherited from

StakingRegistry.l1ChainId

___

### <a id="network" name="network"></a> network

• **network**: `string`

#### Inherited from

StakingRegistry.network

___

### <a id="signersorproviders" name="signersorproviders"></a> signersOrProviders

• **signersOrProviders**: `SignersOrProviders`

#### Inherited from

StakingRegistry.signersOrProviders

___

### <a id="eventname" name="eventname"></a> EventName

▪ `Static` **EventName**: typeof [`RailsGatewayEventName`](../enums/RailsGatewayEventName.md) = `EventName`

## Accessors

### <a id="helpers" name="helpers"></a> helpers

• `get` **helpers**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `approveBond` | (`input`: [`ApproveBondInput`](../modules.md#approvebondinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionResponse`\> |
| `approveSend` | (`input`: [`ApproveSendInput`](../modules.md#approvesendinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionResponse`\> |
| `getComputedNextHopsHash` | (`__namedParameters`: [`GetNextHopsHashInput`](../modules.md#getnexthopshashinput)) => `string` |
| `getIsPathIdLive` | (`__namedParameters`: [`GetIsPathIdLiveInput`](../modules.md#getispathidliveinput)) => `Promise`\<`boolean`\> |
| `getIsTransferBonded` | (`__namedParameters`: [`GetIsTransferBondedInput`](../modules.md#getistransferbondedinput)) => `Promise`\<`boolean`\> |
| `getIsTransferClaimed` | (`__namedParameters`: [`GetIsTransferClaimedInput`](../modules.md#getistransferclaimedinput)) => `Promise`\<`boolean`\> |
| `getNeedsApprovalForBond` | (`__namedParameters`: [`GetNeedsApprovalForBondInput`](../modules.md#getneedsapprovalforbondinput)) => `Promise`\<`boolean`\> |
| `getNeedsApprovalForSend` | (`__namedParameters`: [`GetNeedsApprovalForSendInput`](../modules.md#getneedsapprovalforsendinput)) => `Promise`\<`boolean`\> |

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• `get` **populateTransaction**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `approveBond` | (`__namedParameters`: [`ApproveBondInput`](../modules.md#approvebondinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `approveSend` | (`__namedParameters`: [`ApproveSendInput`](../modules.md#approvesendinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `approveStakeHop` | (`__namedParameters`: [`StakeHopInput`](../modules.md#stakehopinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `batchUpdateClaimChain` | (`__namedParameters`: [`BatchUpdateClaimChainInput`](../modules.md#batchupdateclaimchaininput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `bond` | (`__namedParameters`: [`BondInput`](../modules.md#bondinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `claimFeesFromPath` | (`__namedParameters`: [`ClaimFeesFromPathInput`](../modules.md#claimfeesfrompathinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `confirmClaim` | (`__namedParameters`: [`ConfirmClaimInput`](../modules.md#confirmclaiminput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `distributeClaimedFees` | (`__namedParameters`: [`DistributeClaimedFeesInput`](../modules.md#distributeclaimedfeesinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `distributeExcessFees` | (`__namedParameters`: [`DistributeExcessFeesInput`](../modules.md#distributeexcessfeesinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `postClaim` | (`__namedParameters`: [`PostClaimInput`](../modules.md#postclaiminput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `removeClaim` | (`__namedParameters`: [`RemoveClaimInput`](../modules.md#removeclaiminput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `send` | (`__namedParameters`: [`SendInput`](../modules.md#sendinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `setFeePrice` | (`__namedParameters`: [`SetFeePriceInput`](../modules.md#setfeepriceinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `setFeePrices` | (`__namedParameters`: [`SetFeePricesInput`](../modules.md#setfeepricesinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `stakeHop` | (`__namedParameters`: [`StakeHopInput`](../modules.md#stakehopinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `unstakeHop` | (`__namedParameters`: [`UnstakeHopInput`](../modules.md#unstakehopinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `updateClaimChain` | (`__namedParameters`: [`UpdateClaimChainInput`](../modules.md#updateclaimchaininput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `withdraw` | (`__namedParameters`: [`WithdrawInput`](../modules.md#withdrawinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `withdrawAll` | (`__namedParameters`: [`WithdrawAllInput`](../modules.md#withdrawallinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `withdrawHop` | (`__namedParameters`: [`WithdrawHopInput`](../modules.md#withdrawhopinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |

___

### <a id="utils" name="utils"></a> utils

• `get` **utils**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `estimateGas` | (`provider`: `Provider`, `tx`: `TransactionRequest`) => `Promise`\<`BigNumber`\> |
| `generateZeroBytes32` | () => `string` |
| `getAddressExplorerUrl` | (`address`: `string`, `chainId`: `BigNumberish`) => `string` |
| `getBumpedGasPrice` | (`provider`: `Provider`, `percent`: `number`) => `Promise`\<`BigNumber`\> |
| `getChainInfo` | (`chainId`: `BigNumberish`) => `any` |
| `getChainSlug` | (`chainId`: `BigNumberish`) => `string` |
| `getConnectedChainId` | (`provider`: `Provider`) => `Promise`\<`BigNumber`\> |
| `getGasPrice` | (`signerOrProvider`: `Provider` \| `Signer`) => `Promise`\<`BigNumber`\> |
| `getLogoForChainId` | (`chainId`: `BigNumberish`) => `string` |
| `getLogoForChainSlug` | (`chainSlug`: `string`) => `string` |
| `getLogoForTokenSymbol` | (`tokenSymbol`: `string`) => `string` |
| `getTokenExplorerUrl` | (`address`: `string`, `chainId`: `BigNumberish`) => `string` |
| `getTransactionHashExplorerUrl` | (`txHash`: `string`, `chainId`: `BigNumberish`) => `string` |
| `isContractError` | (`err`: `unknown`) => `boolean` |
| `isValidAddress` | (`address`: `string`) => `boolean` |
| `isValidBytes` | (`bytes`: `string`) => `boolean` |
| `isValidBytes32` | (`hash`: `string`) => `boolean` |
| `isValidChainId` | (`chainId`: `BigNumberish`) => `boolean` |
| `isValidFilterBlock` | (`blockTag`: `string` \| `number`) => `boolean` |
| `isValidNumericValue` | (`value`: ``null`` \| `object` \| `BigNumberish`) => `boolean` |
| `isValidObject` | (`obj`: `any`) => `boolean` |
| `isValidTxHash` | (`txHash`: `string`) => `boolean` |
| `switchChain` | (`chainId`: `BigNumberish`, `provider`: `Provider`) => `Promise`\<`void`\> |
| `willTransactionFail` | (`provider`: `Provider`, `tx`: `TransactionRequest`) => `Promise`\<`boolean`\> |

#### Inherited from

StakingRegistry.utils

## Methods

### <a id="acceptslash" name="acceptslash"></a> acceptSlash

▸ **acceptSlash**(`input`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `AcceptSlashInput` |

#### Returns

`Promise`\<`any`\>

#### Inherited from

StakingRegistry.acceptSlash

___

### <a id="adddecodedtypestoevent" name="adddecodedtypestoevent"></a> addDecodedTypesToEvent

▸ **addDecodedTypesToEvent**(`event`): `EthersEventWithDecodedTypes`\<`TransferSent` \| `TransferBonded`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `any` |

#### Returns

`EthersEventWithDecodedTypes`\<`TransferSent` \| `TransferBonded`\>

___

### <a id="adddecodedtypestoevents" name="adddecodedtypestoevents"></a> addDecodedTypesToEvents

▸ **addDecodedTypesToEvents**(`events`): `EthersEventWithDecodedTypes`\<`TransferSent` \| `TransferBonded`\>[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `events` | `any`[] |

#### Returns

`EthersEventWithDecodedTypes`\<`TransferSent` \| `TransferBonded`\>[]

___

### <a id="adddecodedtypestotransferbondedevents" name="adddecodedtypestotransferbondedevents"></a> addDecodedTypesToTransferBondedEvents

▸ **addDecodedTypesToTransferBondedEvents**(`events`): `EthersEventWithDecodedTypes`\<`TransferBonded`\>[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `events` | `any`[] |

#### Returns

`EthersEventWithDecodedTypes`\<`TransferBonded`\>[]

___

### <a id="adddecodedtypestotransfersentevents" name="adddecodedtypestotransfersentevents"></a> addDecodedTypesToTransferSentEvents

▸ **addDecodedTypesToTransferSentEvents**(`events`): `EthersEventWithDecodedTypes`\<`TransferSent`\>[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `events` | `any`[] |

#### Returns

`EthersEventWithDecodedTypes`\<`TransferSent`\>[]

___

### <a id="addtoappeal" name="addtoappeal"></a> addToAppeal

▸ **addToAppeal**(`input`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `AddToAppealInput` |

#### Returns

`Promise`\<`any`\>

#### Inherited from

StakingRegistry.addToAppeal

___

### <a id="addtochallenge" name="addtochallenge"></a> addToChallenge

▸ **addToChallenge**(`input`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `AddToChallengeInput` |

#### Returns

`Promise`\<`any`\>

#### Inherited from

StakingRegistry.addToChallenge

___

### <a id="appealperiod" name="appealperiod"></a> appealPeriod

▸ **appealPeriod**(`chainId`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`Promise`\<`any`\>

#### Inherited from

StakingRegistry.appealPeriod

___

### <a id="batchupdateclaimchain" name="batchupdateclaimchain"></a> batchUpdateClaimChain

▸ **batchUpdateClaimChain**(`input`, `txOverrides?`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`BatchUpdateClaimChainInput`](../modules.md#batchupdateclaimchaininput) |
| `txOverrides` | `TxOverrides` |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="bond" name="bond"></a> bond

▸ **bond**(`input`, `txOverrides?`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`BondInput`](../modules.md#bondinput) |
| `txOverrides` | `TxOverrides` |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="challengeperiod" name="challengeperiod"></a> challengePeriod

▸ **challengePeriod**(`chainId`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`Promise`\<`any`\>

#### Inherited from

StakingRegistry.challengePeriod

___

### <a id="challenges" name="challenges"></a> challenges

▸ **challenges**(`chainId`, `challengeId`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `challengeId` | `string` |

#### Returns

`Promise`\<`any`\>

#### Inherited from

StakingRegistry.challenges

___

### <a id="claimfeesfrompath" name="claimfeesfrompath"></a> claimFeesFromPath

▸ **claimFeesFromPath**(`input`, `txOverrides?`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`ClaimFeesFromPathInput`](../modules.md#claimfeesfrompathinput) |
| `txOverrides` | `TxOverrides` |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="confirmclaim" name="confirmclaim"></a> confirmClaim

▸ **confirmClaim**(`input`, `txOverrides?`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`ConfirmClaimInput`](../modules.md#confirmclaiminput) |
| `txOverrides` | `TxOverrides` |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="createchallenge" name="createchallenge"></a> createChallenge

▸ **createChallenge**(`input`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `CreateChallengeInput` |

#### Returns

`Promise`\<`any`\>

#### Inherited from

StakingRegistry.createChallenge

___

### <a id="distributeclaimedfees" name="distributeclaimedfees"></a> distributeClaimedFees

▸ **distributeClaimedFees**(`input`, `txOverrides?`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`DistributeClaimedFeesInput`](../modules.md#distributeclaimedfeesinput) |
| `txOverrides` | `TxOverrides` |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="distributeexcessfees" name="distributeexcessfees"></a> distributeExcessFees

▸ **distributeExcessFees**(`input`, `txOverrides?`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`DistributeExcessFeesInput`](../modules.md#distributeexcessfeesinput) |
| `txOverrides` | `TxOverrides` |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="forcesettlechallenge" name="forcesettlechallenge"></a> forceSettleChallenge

▸ **forceSettleChallenge**(`input`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `ForceSettleChallengeInput` |

#### Returns

`Promise`\<`any`\>

#### Inherited from

StakingRegistry.forceSettleChallenge

___

### <a id="fullappeal" name="fullappeal"></a> fullAppeal

▸ **fullAppeal**(`chainId`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`Promise`\<`any`\>

#### Inherited from

StakingRegistry.fullAppeal

___

### <a id="getamountout" name="getamountout"></a> getAmountOut

▸ **getAmountOut**(`«destructured»`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetAmountOutInput`](../modules.md#getamountoutinput) |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getbatchupdatefee" name="getbatchupdatefee"></a> getBatchUpdateFee

▸ **getBatchUpdateFee**(`«destructured»`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetBatchUpdateFeeInput`](../modules.md#getbatchupdatefeeinput) |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getbucketindex" name="getbucketindex"></a> getBucketIndex

▸ **getBucketIndex**(`«destructured»`): `Promise`\<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetBucketIndexInput`](../modules.md#getbucketindexinput) |

#### Returns

`Promise`\<`number`\>

___

### <a id="getchainidssupportedbytokensymbol" name="getchainidssupportedbytokensymbol"></a> getChainIdsSupportedByTokenSymbol

▸ **getChainIdsSupportedByTokenSymbol**(`tokenSymbol`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenSymbol` | `string` |

#### Returns

`string`[]

#### Inherited from

StakingRegistry.getChainIdsSupportedByTokenSymbol

___

### <a id="getchallengeid" name="getchallengeid"></a> getChallengeId

▸ **getChallengeId**(`input`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `GetChallengeIdInput` |

#### Returns

`Promise`\<`any`\>

#### Inherited from

StakingRegistry.getChallengeId

___

### <a id="getclaimfeesfee" name="getclaimfeesfee"></a> getClaimFeesFee

▸ **getClaimFeesFee**(`«destructured»`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetClaimFeesFeeInput`](../modules.md#getclaimfeesfeeinput) |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getcolorforchainid" name="getcolorforchainid"></a> getColorForChainId

▸ **getColorForChainId**(`chainId`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`string`

#### Inherited from

StakingRegistry.getColorForChainId

___

### <a id="getconfigaddress" name="getconfigaddress"></a> getConfigAddress

▸ **getConfigAddress**(`chainId`, `key`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `key` | `string` |

#### Returns

`string`

#### Inherited from

StakingRegistry.getConfigAddress

___

### <a id="getconfigstartblock" name="getconfigstartblock"></a> getConfigStartBlock

▸ **getConfigStartBlock**(`chainId`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`number`

#### Inherited from

StakingRegistry.getConfigStartBlock

___

### <a id="getcontractaddresses" name="getcontractaddresses"></a> getContractAddresses

▸ **getContractAddresses**(): `Addresses`

#### Returns

`Addresses`

#### Inherited from

StakingRegistry.getContractAddresses

___

### <a id="getcontractexists" name="getcontractexists"></a> getContractExists

▸ **getContractExists**(`address`, `provider`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `provider` | `Provider` |

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

StakingRegistry.getContractExists

___

### <a id="getdefaultprovider" name="getdefaultprovider"></a> getDefaultProvider

▸ **getDefaultProvider**(`chainId`): `Provider`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`Provider`

#### Inherited from

StakingRegistry.getDefaultProvider

___

### <a id="getdefaultproviders" name="getdefaultproviders"></a> getDefaultProviders

▸ **getDefaultProviders**(): `SignersOrProviders`

#### Returns

`SignersOrProviders`

#### Inherited from

StakingRegistry.getDefaultProviders

___

### <a id="getethersweb3signer" name="getethersweb3signer"></a> getEthersWeb3Signer

▸ **getEthersWeb3Signer**(`signer`): `Signer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `signer` | `any` |

#### Returns

`Signer`

#### Inherited from

StakingRegistry.getEthersWeb3Signer

___

### <a id="geteventfetcher" name="geteventfetcher"></a> getEventFetcher

▸ **getEventFetcher**(`eventName`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | [`RailsGatewayEventName`](../enums/RailsGatewayEventName.md) |

#### Returns

`any`

___

### <a id="geteventfilter" name="geteventfilter"></a> getEventFilter

▸ **getEventFilter**(`eventName`, `input?`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | [`RailsGatewayEventName`](../enums/RailsGatewayEventName.md) |
| `input` | [`GetEventFilterInput`](../modules.md#geteventfilterinput) |

#### Returns

`any`

___

### <a id="geteventnames" name="geteventnames"></a> getEventNames

▸ **getEventNames**(): `string`[]

#### Returns

`string`[]

___

### <a id="getexplorerapibaseurl" name="getexplorerapibaseurl"></a> getExplorerApiBaseUrl

▸ **getExplorerApiBaseUrl**(): `string`

#### Returns

`string`

#### Inherited from

StakingRegistry.getExplorerApiBaseUrl

___

### <a id="getfeeprice" name="getfeeprice"></a> getFeePrice

▸ **getFeePrice**(`«destructured»`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetFeePriceInput`](../modules.md#getfeepriceinput) |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="gethassufficientbalance" name="gethassufficientbalance"></a> getHasSufficientBalance

▸ **getHasSufficientBalance**(`«destructured»`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetHasSufficientBalanceInput`](../modules.md#gethassufficientbalanceinput) |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="getheadclaimid" name="getheadclaimid"></a> getHeadClaimId

▸ **getHeadClaimId**(`«destructured»`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetHeadClaimIdInput`](../modules.md#getheadclaimidinput) |

#### Returns

`Promise`\<`string`\>

___

### <a id="gethopbalance" name="gethopbalance"></a> getHopBalance

▸ **getHopBalance**(`address?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address?` | ``null`` \| `string` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="gethoptokenaddress" name="gethoptokenaddress"></a> getHopTokenAddress

▸ **getHopTokenAddress**(): `Promise`\<`string`\>

#### Returns

`Promise`\<`string`\>

___

### <a id="gethoptokencontract" name="gethoptokencontract"></a> getHopTokenContract

▸ **getHopTokenContract**(): `Promise`\<`Contract`\>

#### Returns

`Promise`\<`Contract`\>

___

### <a id="gethubchainid" name="gethubchainid"></a> getHubChainId

▸ **getHubChainId**(): `string`

#### Returns

`string`

#### Inherited from

StakingRegistry.getHubChainId

___

### <a id="getisclaimidvalid" name="getisclaimidvalid"></a> getIsClaimIdValid

▸ **getIsClaimIdValid**(`«destructured»`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetIsClaimIdValidInput`](../modules.md#getisclaimidvalidinput) |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="getmessagefee" name="getmessagefee"></a> getMessageFee

▸ **getMessageFee**(`«destructured»`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`RailsGatewayGetMessageFeeInput`](../modules.md#railsgatewaygetmessagefeeinput) |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getminbonderstake" name="getminbonderstake"></a> getMinBonderStake

▸ **getMinBonderStake**(): `Promise`\<`BigNumber`\>

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getnexthopshash" name="getnexthopshash"></a> getNextHopsHash

▸ **getNextHopsHash**(`«destructured»`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetNextHopsHashInput`](../modules.md#getnexthopshashinput) |

#### Returns

`Promise`\<`string`\>

___

### <a id="getpathid" name="getpathid"></a> getPathId

▸ **getPathId**(`«destructured»`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetPathIdInput`](../modules.md#getpathidinput) |

#### Returns

`Promise`\<`string`\>

___

### <a id="getpathinfo" name="getpathinfo"></a> getPathInfo

▸ **getPathInfo**(`«destructured»`): `Promise`\<[`Path`](../modules.md#path)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetPathInfoInput`](../modules.md#getpathinfoinput) |

#### Returns

`Promise`\<[`Path`](../modules.md#path)\>

___

### <a id="getprovider" name="getprovider"></a> getProvider

▸ **getProvider**(`chainId`): ``null`` \| `Provider`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

``null`` \| `Provider`

#### Inherited from

StakingRegistry.getProvider

___

### <a id="getrailsgatewaycontract" name="getrailsgatewaycontract"></a> getRailsGatewayContract

▸ **getRailsGatewayContract**(): `Promise`\<`Contract`\>

#### Returns

`Promise`\<`Contract`\>

___

### <a id="getrailsgatewaycontractaddress" name="getrailsgatewaycontractaddress"></a> getRailsGatewayContractAddress

▸ **getRailsGatewayContractAddress**(): `string`

#### Returns

`string`

___

### <a id="getremovefee" name="getremovefee"></a> getRemoveFee

▸ **getRemoveFee**(): `Promise`\<`BigNumber`\>

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getsendfee" name="getsendfee"></a> getSendFee

▸ **getSendFee**(`«destructured»`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`RailsGatewayGetSendFeeInput`](../modules.md#railsgatewaygetsendfeeinput) |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getsigner" name="getsigner"></a> getSigner

▸ **getSigner**(`chainId`): `Promise`\<``null`` \| `Signer`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`Promise`\<``null`` \| `Signer`\>

#### Inherited from

StakingRegistry.getSigner

___

### <a id="getsigneraddress" name="getsigneraddress"></a> getSignerAddress

▸ **getSignerAddress**(`chainId`): `Promise`\<``null`` \| `string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`Promise`\<``null`` \| `string`\>

#### Inherited from

StakingRegistry.getSignerAddress

___

### <a id="getsignerorprovider" name="getsignerorprovider"></a> getSignerOrProvider

▸ **getSignerOrProvider**(`chainId`): `Promise`\<`Provider` \| `Signer`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`Promise`\<`Provider` \| `Signer`\>

#### Inherited from

StakingRegistry.getSignerOrProvider

___

### <a id="getsignerproviderchainid" name="getsignerproviderchainid"></a> getSignerProviderChainId

▸ **getSignerProviderChainId**(`chainId`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`Promise`\<`BigNumber`\>

#### Inherited from

StakingRegistry.getSignerProviderChainId

___

### <a id="getstakedbalance" name="getstakedbalance"></a> getStakedBalance

▸ **getStakedBalance**(`input`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `GetStakedBalanceInput` |

#### Returns

`Promise`\<`any`\>

#### Inherited from

StakingRegistry.getStakedBalance

___

### <a id="getstakingregistryaddress" name="getstakingregistryaddress"></a> getStakingRegistryAddress

▸ **getStakingRegistryAddress**(`chainId`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`string`

#### Inherited from

StakingRegistry.getStakingRegistryAddress

___

### <a id="getstakingregistrycontract" name="getstakingregistrycontract"></a> getStakingRegistryContract

▸ **getStakingRegistryContract**(`chainId`): `Contract`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`Contract`

#### Inherited from

StakingRegistry.getStakingRegistryContract

___

### <a id="getsupportedchainids" name="getsupportedchainids"></a> getSupportedChainIds

▸ **getSupportedChainIds**(): `string`[]

#### Returns

`string`[]

#### Inherited from

StakingRegistry.getSupportedChainIds

___

### <a id="getsupportedtokensymbols" name="getsupportedtokensymbols"></a> getSupportedTokenSymbols

▸ **getSupportedTokenSymbols**(): `string`[]

#### Returns

`string`[]

#### Inherited from

StakingRegistry.getSupportedTokenSymbols

___

### <a id="getsupportedtokensymbolsbychainid" name="getsupportedtokensymbolsbychainid"></a> getSupportedTokenSymbolsByChainId

▸ **getSupportedTokenSymbolsByChainId**(`chainId`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`string`[]

#### Inherited from

StakingRegistry.getSupportedTokenSymbolsByChainId

___

### <a id="gettokenaddressbytokensymbol" name="gettokenaddressbytokensymbol"></a> getTokenAddressByTokenSymbol

▸ **getTokenAddressByTokenSymbol**(`chainId`, `tokenSymbol`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `tokenSymbol` | `string` |

#### Returns

`string`

#### Inherited from

StakingRegistry.getTokenAddressByTokenSymbol

___

### <a id="gettokencontract" name="gettokencontract"></a> getTokenContract

▸ **getTokenContract**(`«destructured»`): `Contract`

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetTokenContractInput`](../modules.md#gettokencontractinput) |

#### Returns

`Contract`

___

### <a id="gettokeninfo" name="gettokeninfo"></a> getTokenInfo

▸ **getTokenInfo**(`«destructured»`): `Promise`\<[`Token`](../modules.md#token)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetTokenInfoInput`](../modules.md#gettokeninfoinput) |

#### Returns

`Promise`\<[`Token`](../modules.md#token)\>

___

### <a id="gettokensymbolbytokenaddress" name="gettokensymbolbytokenaddress"></a> getTokenSymbolByTokenAddress

▸ **getTokenSymbolByTokenAddress**(`chainId`, `tokenAddress`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `tokenAddress` | `string` |

#### Returns

`string`

#### Inherited from

StakingRegistry.getTokenSymbolByTokenAddress

___

### <a id="gettransferbondedeventfilter" name="gettransferbondedeventfilter"></a> getTransferBondedEventFilter

▸ **getTransferBondedEventFilter**(`input?`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `TransferBondedIndexes` |

#### Returns

`any`

___

### <a id="gettransferbondedeventfromtransactionhash" name="gettransferbondedeventfromtransactionhash"></a> getTransferBondedEventFromTransactionHash

▸ **getTransferBondedEventFromTransactionHash**(`«destructured»`): `Promise`\<``null`` \| `EthersEventWithDecodedTypes`\<`TransferBonded`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetTransferBondedEventFromTransactionHashInput`](../modules.md#gettransferbondedeventfromtransactionhashinput) |

#### Returns

`Promise`\<``null`` \| `EthersEventWithDecodedTypes`\<`TransferBonded`\>\>

___

### <a id="gettransferbondedeventfromtransactionreceipt" name="gettransferbondedeventfromtransactionreceipt"></a> getTransferBondedEventFromTransactionReceipt

▸ **getTransferBondedEventFromTransactionReceipt**(`«destructured»`): `Promise`\<``null`` \| `EthersEventWithDecodedTypes`\<`TransferBonded`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetTransferBondedEventFromTransactionReceiptInput`](../modules.md#gettransferbondedeventfromtransactionreceiptinput) |

#### Returns

`Promise`\<``null`` \| `EthersEventWithDecodedTypes`\<`TransferBonded`\>\>

___

### <a id="gettransferbondedeventfromtransferid" name="gettransferbondedeventfromtransferid"></a> getTransferBondedEventFromTransferId

▸ **getTransferBondedEventFromTransferId**(`«destructured»`): `Promise`\<``null`` \| `EthersEventWithDecodedTypes`\<`TransferBonded`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetTransferBondedEventFromTransferIdInput`](../modules.md#gettransferbondedeventfromtransferidinput) |

#### Returns

`Promise`\<``null`` \| `EthersEventWithDecodedTypes`\<`TransferBonded`\>\>

___

### <a id="gettransferbondedevents" name="gettransferbondedevents"></a> getTransferBondedEvents

▸ **getTransferBondedEvents**(`input`): `Promise`\<`EthersEventWithDecodedTypes`\<`TransferBonded`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`TransferBondedEventInput`](../modules.md#transferbondedeventinput) |

#### Returns

`Promise`\<`EthersEventWithDecodedTypes`\<`TransferBonded`\>[]\>

___

### <a id="gettransferdatahash" name="gettransferdatahash"></a> getTransferDataHash

▸ **getTransferDataHash**(`«destructured»`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetTransferDataHashInput`](../modules.md#gettransferdatahashinput) |

#### Returns

`Promise`\<`string`\>

___

### <a id="gettransfersenteventfilter" name="gettransfersenteventfilter"></a> getTransferSentEventFilter

▸ **getTransferSentEventFilter**(`input?`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `TransferSentIndexes` |

#### Returns

`any`

___

### <a id="gettransfersenteventfromtransactionhash" name="gettransfersenteventfromtransactionhash"></a> getTransferSentEventFromTransactionHash

▸ **getTransferSentEventFromTransactionHash**(`«destructured»`): `Promise`\<``null`` \| `EthersEventWithDecodedTypes`\<`TransferSent`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetTransferSentEventFromTransactionHashInput`](../modules.md#gettransfersenteventfromtransactionhashinput) |

#### Returns

`Promise`\<``null`` \| `EthersEventWithDecodedTypes`\<`TransferSent`\>\>

___

### <a id="gettransfersenteventfromtransactionreceipt" name="gettransfersenteventfromtransactionreceipt"></a> getTransferSentEventFromTransactionReceipt

▸ **getTransferSentEventFromTransactionReceipt**(`«destructured»`): `Promise`\<``null`` \| `EthersEventWithDecodedTypes`\<`TransferSent`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetTransferSentEventFromTransactionReceiptInput`](../modules.md#gettransfersenteventfromtransactionreceiptinput) |

#### Returns

`Promise`\<``null`` \| `EthersEventWithDecodedTypes`\<`TransferSent`\>\>

___

### <a id="gettransfersenteventfromtransferid" name="gettransfersenteventfromtransferid"></a> getTransferSentEventFromTransferId

▸ **getTransferSentEventFromTransferId**(`«destructured»`): `Promise`\<`EthersEventWithDecodedTypes`\<`TransferSent`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetTransferSentEventFromTransferIdInput`](../modules.md#gettransfersenteventfromtransferidinput) |

#### Returns

`Promise`\<`EthersEventWithDecodedTypes`\<`TransferSent`\>\>

___

### <a id="gettransfersentevents" name="gettransfersentevents"></a> getTransferSentEvents

▸ **getTransferSentEvents**(`input`): `Promise`\<`EthersEventWithDecodedTypes`\<`TransferSent`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`TransferSentEventInput`](../modules.md#transfersenteventinput) |

#### Returns

`Promise`\<`EthersEventWithDecodedTypes`\<`TransferSent`\>[]\>

___

### <a id="gettransfersenteventsfrompathid" name="gettransfersenteventsfrompathid"></a> getTransferSentEventsFromPathId

▸ **getTransferSentEventsFromPathId**(`«destructured»`): `Promise`\<`EthersEventWithDecodedTypes`\<`TransferSent`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetTransferSentEventsFromPathIdInput`](../modules.md#gettransfersenteventsfrompathidinput) |

#### Returns

`Promise`\<`EthersEventWithDecodedTypes`\<`TransferSent`\>[]\>

___

### <a id="gettransfersenteventsinbatches" name="gettransfersenteventsinbatches"></a> getTransferSentEventsInBatches

▸ **getTransferSentEventsInBatches**(`«destructured»`): `AsyncGenerator`\<`any`, `void`, `unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`TransferSentEventInput`](../modules.md#transfersenteventinput) |

#### Returns

`AsyncGenerator`\<`any`, `void`, `unknown`\>

___

### <a id="gettxoverrides" name="gettxoverrides"></a> getTxOverrides

▸ **getTxOverrides**(`fromChainId`, `toChainId`): `Promise`\<`TxOverrides`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fromChainId` | `BigNumberish` |
| `toChainId` | `BigNumberish` |

#### Returns

`Promise`\<`TxOverrides`\>

#### Inherited from

StakingRegistry.getTxOverrides

___

### <a id="getupdatefee" name="getupdatefee"></a> getUpdateFee

▸ **getUpdateFee**(): `Promise`\<`BigNumber`\>

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getwithdrawablebalance" name="getwithdrawablebalance"></a> getWithdrawableBalance

▸ **getWithdrawableBalance**(`«destructured»`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`WithdrawableBalanceInput`](../modules.md#withdrawablebalanceinput) |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getwithdrawablestakebalance" name="getwithdrawablestakebalance"></a> getWithdrawableStakeBalance

▸ **getWithdrawableStakeBalance**(`input`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `GetWithdrawableBalanceInput` |

#### Returns

`Promise`\<`any`\>

#### Inherited from

StakingRegistry.getWithdrawableStakeBalance

___

### <a id="isstaked" name="isstaked"></a> isStaked

▸ **isStaked**(`input`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `IsStakedInput` |

#### Returns

`Promise`\<`any`\>

#### Inherited from

StakingRegistry.isStaked

___

### <a id="isvalidclaim" name="isvalidclaim"></a> isValidClaim

▸ **isValidClaim**(`«destructured»`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`IsValidClaimInput`](../modules.md#isvalidclaiminput) |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="isvalidtransfer" name="isvalidtransfer"></a> isValidTransfer

▸ **isValidTransfer**(`«destructured»`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`IsValidClaimInput`](../modules.md#isvalidclaiminput) |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="minchallengeincrease" name="minchallengeincrease"></a> minChallengeIncrease

▸ **minChallengeIncrease**(`chainId`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`Promise`\<`any`\>

#### Inherited from

StakingRegistry.minChallengeIncrease

___

### <a id="minhopstake" name="minhopstake"></a> minHopStake

▸ **minHopStake**(`input`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `MinHopStakeInput` |

#### Returns

`Promise`\<`any`\>

#### Inherited from

StakingRegistry.minHopStake

___

### <a id="optimisticallysettlechallenge" name="optimisticallysettlechallenge"></a> optimisticallySettleChallenge

▸ **optimisticallySettleChallenge**(`input`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `OptimisticallySettleChallengeInput` |

#### Returns

`Promise`\<`any`\>

#### Inherited from

StakingRegistry.optimisticallySettleChallenge

___

### <a id="postclaim" name="postclaim"></a> postClaim

▸ **postClaim**(`input`, `txOverrides?`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`PostClaimInput`](../modules.md#postclaiminput) |
| `txOverrides` | `TxOverrides` |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="registrystakehop" name="registrystakehop"></a> registryStakeHop

▸ **registryStakeHop**(`input`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `RegistryStakeHopInput` |

#### Returns

`Promise`\<`TransactionResponse`\>

#### Inherited from

StakingRegistry.registryStakeHop

___

### <a id="registrystakehoppopulatedtx" name="registrystakehoppopulatedtx"></a> registryStakeHopPopulatedTx

▸ **registryStakeHopPopulatedTx**(`input`): `Promise`\<`PopulatedTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `RegistryStakeHopInput` |

#### Returns

`Promise`\<`PopulatedTransaction`\>

#### Inherited from

StakingRegistry.registryStakeHopPopulatedTx

___

### <a id="registryunstakehop" name="registryunstakehop"></a> registryUnstakeHop

▸ **registryUnstakeHop**(`input`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `RegistryUnstakeHopInput` |

#### Returns

`Promise`\<`TransactionResponse`\>

#### Inherited from

StakingRegistry.registryUnstakeHop

___

### <a id="registryunstakehoppopulatedtx" name="registryunstakehoppopulatedtx"></a> registryUnstakeHopPopulatedTx

▸ **registryUnstakeHopPopulatedTx**(`input`): `Promise`\<`PopulatedTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `RegistryUnstakeHopInput` |

#### Returns

`Promise`\<`PopulatedTransaction`\>

#### Inherited from

StakingRegistry.registryUnstakeHopPopulatedTx

___

### <a id="registrywithdraw" name="registrywithdraw"></a> registryWithdraw

▸ **registryWithdraw**(`input`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `RegistryWithdrawInput` |

#### Returns

`Promise`\<`TransactionResponse`\>

#### Inherited from

StakingRegistry.registryWithdraw

___

### <a id="registrywithdrawpopulatedtx" name="registrywithdrawpopulatedtx"></a> registryWithdrawPopulatedTx

▸ **registryWithdrawPopulatedTx**(`input`): `Promise`\<`PopulatedTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `RegistryWithdrawInput` |

#### Returns

`Promise`\<`PopulatedTransaction`\>

#### Inherited from

StakingRegistry.registryWithdrawPopulatedTx

___

### <a id="removeclaim" name="removeclaim"></a> removeClaim

▸ **removeClaim**(`input`, `txOverrides?`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`RemoveClaimInput`](../modules.md#removeclaiminput) |
| `txOverrides` | `TxOverrides` |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="send" name="send"></a> send

▸ **send**(`input`, `txOverrides?`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`SendInput`](../modules.md#sendinput) |
| `txOverrides` | `TxOverrides` |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="sendtransaction" name="sendtransaction"></a> sendTransaction

▸ **sendTransaction**(`transactionRequest`, `chainId?`, `customSigner?`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionRequest` | `TransactionRequest` |
| `chainId?` | `BigNumberish` |
| `customSigner?` | ``null`` \| `Signer` |

#### Returns

`Promise`\<`TransactionResponse`\>

#### Inherited from

StakingRegistry.sendTransaction

___

### <a id="setcontractaddresses" name="setcontractaddresses"></a> setContractAddresses

▸ **setContractAddresses**(`contractAddresses`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `contractAddresses` | `Addresses` |

#### Returns

`void`

#### Inherited from

StakingRegistry.setContractAddresses

___

### <a id="setexplorerapibaseurl" name="setexplorerapibaseurl"></a> setExplorerApiBaseUrl

▸ **setExplorerApiBaseUrl**(`url`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |

#### Returns

`void`

#### Inherited from

StakingRegistry.setExplorerApiBaseUrl

___

### <a id="setfeeprice" name="setfeeprice"></a> setFeePrice

▸ **setFeePrice**(`input`, `txOverrides?`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`SetFeePriceInput`](../modules.md#setfeepriceinput) |
| `txOverrides` | `TxOverrides` |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="setfeeprices" name="setfeeprices"></a> setFeePrices

▸ **setFeePrices**(`input`, `txOverrides?`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`SetFeePricesInput`](../modules.md#setfeepricesinput) |
| `txOverrides` | `TxOverrides` |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="setprovider" name="setprovider"></a> setProvider

▸ **setProvider**(`chainId`, `provider`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `provider` | `Provider` |

#### Returns

`void`

#### Inherited from

StakingRegistry.setProvider

___

### <a id="setproviderurl" name="setproviderurl"></a> setProviderUrl

▸ **setProviderUrl**(`chainId`, `url`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `url` | `string` \| `string`[] |

#### Returns

`void`

#### Inherited from

StakingRegistry.setProviderUrl

___

### <a id="setproviderurls" name="setproviderurls"></a> setProviderUrls

▸ **setProviderUrls**(`signersOrProviders`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `signersOrProviders` | `Record`\<`string`, `string` \| `string`[]\> |

#### Returns

`void`

#### Inherited from

StakingRegistry.setProviderUrls

___

### <a id="setproviders" name="setproviders"></a> setProviders

▸ **setProviders**(`signersOrProviders`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `signersOrProviders` | `SignersOrProviders` |

#### Returns

`void`

#### Inherited from

StakingRegistry.setProviders

___

### <a id="signalpreference" name="signalpreference"></a> signalPreference

▸ **signalPreference**(`input`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`SignalPreferenceInput`](../modules.md#signalpreferenceinput) |

#### Returns

`Promise`\<`TransactionResponse`\>

#### Inherited from

StakingRegistry.signalPreference

___

### <a id="signalpreferencepopulatedtx" name="signalpreferencepopulatedtx"></a> signalPreferencePopulatedTx

▸ **signalPreferencePopulatedTx**(`input`): `Promise`\<`PopulatedTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`SignalPreferenceInput`](../modules.md#signalpreferenceinput) |

#### Returns

`Promise`\<`PopulatedTransaction`\>

#### Inherited from

StakingRegistry.signalPreferencePopulatedTx

___

### <a id="stakehop" name="stakehop"></a> stakeHop

▸ **stakeHop**(`input`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`StakeHopInput`](../modules.md#stakehopinput) |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="throwerror" name="throwerror"></a> throwError

▸ **throwError**(`err`): `unknown`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `unknown` |

#### Returns

`unknown`

#### Inherited from

StakingRegistry.throwError

___

### <a id="totalclaims" name="totalclaims"></a> totalClaims

▸ **totalClaims**(`«destructured»`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`TotalClaimsInput`](../modules.md#totalclaimsinput) |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="totalclaimsatclaimid" name="totalclaimsatclaimid"></a> totalClaimsAtClaimId

▸ **totalClaimsAtClaimId**(`«destructured»`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`TotalClaimsAtClaimIdInput`](../modules.md#totalclaimsatclaimidinput) |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="totalconfirmed" name="totalconfirmed"></a> totalConfirmed

▸ **totalConfirmed**(`«destructured»`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`TotalConfirmedInput`](../modules.md#totalconfirmedinput) |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="totalsent" name="totalsent"></a> totalSent

▸ **totalSent**(`«destructured»`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`TotalSentInput`](../modules.md#totalsentinput) |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="unstakehop" name="unstakehop"></a> unstakeHop

▸ **unstakeHop**(`input`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`UnstakeHopInput`](../modules.md#unstakehopinput) |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="updateclaimchain" name="updateclaimchain"></a> updateClaimChain

▸ **updateClaimChain**(`input`, `txOverrides?`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`UpdateClaimChainInput`](../modules.md#updateclaimchaininput) |
| `txOverrides` | `TxOverrides` |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="withdraw" name="withdraw"></a> withdraw

▸ **withdraw**(`input`, `txOverrides?`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`WithdrawInput`](../modules.md#withdrawinput) |
| `txOverrides` | `TxOverrides` |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="withdrawall" name="withdrawall"></a> withdrawAll

▸ **withdrawAll**(`input`, `txOverrides?`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`WithdrawAllInput`](../modules.md#withdrawallinput) |
| `txOverrides` | `TxOverrides` |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="withdrawhop" name="withdrawhop"></a> withdrawHop

▸ **withdrawHop**(`input`, `txOverrides?`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`WithdrawHopInput`](../modules.md#withdrawhopinput) |
| `txOverrides` | `TxOverrides` |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="adddecodedtypestoevent-1" name="adddecodedtypestoevent-1"></a> addDecodedTypesToEvent

▸ **addDecodedTypesToEvent**(`event`): `EthersEventWithDecodedTypes`\<`TransferSent` \| `TransferBonded`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `any` |

#### Returns

`EthersEventWithDecodedTypes`\<`TransferSent` \| `TransferBonded`\>

___

### <a id="adddecodedtypestoevents-1" name="adddecodedtypestoevents-1"></a> addDecodedTypesToEvents

▸ **addDecodedTypesToEvents**(`events`): `EthersEventWithDecodedTypes`\<`TransferSent` \| `TransferBonded`\>[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `events` | `any`[] |

#### Returns

`EthersEventWithDecodedTypes`\<`TransferSent` \| `TransferBonded`\>[]

___

### <a id="adddecodedtypestotransferbondedevents-1" name="adddecodedtypestotransferbondedevents-1"></a> addDecodedTypesToTransferBondedEvents

▸ **addDecodedTypesToTransferBondedEvents**(`events`): `EthersEventWithDecodedTypes`\<`TransferBonded`\>[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `events` | `any`[] |

#### Returns

`EthersEventWithDecodedTypes`\<`TransferBonded`\>[]

___

### <a id="adddecodedtypestotransfersentevents-1" name="adddecodedtypestotransfersentevents-1"></a> addDecodedTypesToTransferSentEvents

▸ **addDecodedTypesToTransferSentEvents**(`events`): `EthersEventWithDecodedTypes`\<`TransferSent`\>[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `events` | `any`[] |

#### Returns

`EthersEventWithDecodedTypes`\<`TransferSent`\>[]

___

### <a id="derivenetwork" name="derivenetwork"></a> deriveNetwork

▸ **deriveNetwork**(`chainId`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`string`

___

### <a id="getcomputednexthopshash" name="getcomputednexthopshash"></a> getComputedNextHopsHash

▸ **getComputedNextHopsHash**(`«destructured»`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetNextHopsHashInput`](../modules.md#getnexthopshashinput) |

#### Returns

`string`

___

### <a id="getdefaultprovider-1" name="getdefaultprovider-1"></a> getDefaultProvider

▸ **getDefaultProvider**(`chainId`): `Provider`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`Provider`

#### Inherited from

StakingRegistry.getDefaultProvider

___

### <a id="getdefaultproviders-1" name="getdefaultproviders-1"></a> getDefaultProviders

▸ **getDefaultProviders**(`network`): `SignersOrProviders`

#### Parameters

| Name | Type |
| :------ | :------ |
| `network` | `string` |

#### Returns

`SignersOrProviders`

#### Inherited from

StakingRegistry.getDefaultProviders

___

### <a id="geteventnames-1" name="geteventnames-1"></a> getEventNames

▸ **getEventNames**(): `string`[]

#### Returns

`string`[]

___

### <a id="gettransferbondedeventsignature" name="gettransferbondedeventsignature"></a> getTransferBondedEventSignature

▸ **getTransferBondedEventSignature**(): `string`

#### Returns

`string`

___

### <a id="gettransfersenteventsignature" name="gettransfersenteventsignature"></a> getTransferSentEventSignature

▸ **getTransferSentEventSignature**(): `string`

#### Returns

`string`
