# Class: RailsGateway

## Hierarchy

- `StakingRegistry`

  ↳ **`RailsGateway`**

## Table of contents

### Constructors

- [constructor](RailsGateway.md#constructor)

### Properties

- [batchBlocks](RailsGateway.md#batchblocks)
- [chainProviders](RailsGateway.md#chainproviders)
- [contractAddresses](RailsGateway.md#contractaddresses)
- [gasPriceMultiplier](RailsGateway.md#gaspricemultiplier)
- [l1ChainId](RailsGateway.md#l1chainid)
- [network](RailsGateway.md#network)
- [signer](RailsGateway.md#signer)

### Accessors

- [populateTransaction](RailsGateway.md#populatetransaction)
- [utils](RailsGateway.md#utils)

### Methods

- [acceptSlash](RailsGateway.md#acceptslash)
- [addDecodedTypesToEvents](RailsGateway.md#adddecodedtypestoevents)
- [addDecodedTypesToTransferBondedEvents](RailsGateway.md#adddecodedtypestotransferbondedevents)
- [addDecodedTypesToTransferSentEvents](RailsGateway.md#adddecodedtypestotransfersentevents)
- [addToAppeal](RailsGateway.md#addtoappeal)
- [addToChallenge](RailsGateway.md#addtochallenge)
- [approveBond](RailsGateway.md#approvebond)
- [approveSend](RailsGateway.md#approvesend)
- [bond](RailsGateway.md#bond)
- [calcAmountOutMin](RailsGateway.md#calcamountoutmin)
- [confirmClaim](RailsGateway.md#confirmclaim)
- [connect](RailsGateway.md#connect)
- [createChallenge](RailsGateway.md#createchallenge)
- [forceSettleChallenge](RailsGateway.md#forcesettlechallenge)
- [getAppealPeriod](RailsGateway.md#getappealperiod)
- [getChainIdsSupportedByTokenSymbol](RailsGateway.md#getchainidssupportedbytokensymbol)
- [getChallengeId](RailsGateway.md#getchallengeid)
- [getChallengePeriod](RailsGateway.md#getchallengeperiod)
- [getChallenges](RailsGateway.md#getchallenges)
- [getColorForChainId](RailsGateway.md#getcolorforchainid)
- [getConfigAddress](RailsGateway.md#getconfigaddress)
- [getConfigStartBlock](RailsGateway.md#getconfigstartblock)
- [getContractAddresses](RailsGateway.md#getcontractaddresses)
- [getContractExists](RailsGateway.md#getcontractexists)
- [getDefaultChainRpcProvider](RailsGateway.md#getdefaultchainrpcprovider)
- [getDefaultChainRpcProviders](RailsGateway.md#getdefaultchainrpcproviders)
- [getEventFetcher](RailsGateway.md#geteventfetcher)
- [getEventNames](RailsGateway.md#geteventnames)
- [getFee](RailsGateway.md#getfee)
- [getFullAppeal](RailsGateway.md#getfullappeal)
- [getHasSufficientBalance](RailsGateway.md#gethassufficientbalance)
- [getHopBalance](RailsGateway.md#gethopbalance)
- [getHopTokenAddress](RailsGateway.md#gethoptokenaddress)
- [getHopTokenContract](RailsGateway.md#gethoptokencontract)
- [getIsClaimIdValid](RailsGateway.md#getisclaimidvalid)
- [getIsPathIdLive](RailsGateway.md#getispathidlive)
- [getIsTransferBonded](RailsGateway.md#getistransferbonded)
- [getIsTransferClaimed](RailsGateway.md#getistransferclaimed)
- [getLatestClaim](RailsGateway.md#getlatestclaim)
- [getMinBonderStake](RailsGateway.md#getminbonderstake)
- [getMinChallengeIncrease](RailsGateway.md#getminchallengeincrease)
- [getMinHopStakeForRole](RailsGateway.md#getminhopstakeforrole)
- [getNeedsApprovalForBond](RailsGateway.md#getneedsapprovalforbond)
- [getNeedsApprovalForSend](RailsGateway.md#getneedsapprovalforsend)
- [getNextHopsHash](RailsGateway.md#getnexthopshash)
- [getPathId](RailsGateway.md#getpathid)
- [getPathInfo](RailsGateway.md#getpathinfo)
- [getRailsGatewayContract](RailsGateway.md#getrailsgatewaycontract)
- [getRailsGatewayContractAddress](RailsGateway.md#getrailsgatewaycontractaddress)
- [getRoleForRoleName](RailsGateway.md#getroleforrolename)
- [getRpcProviderForChainId](RailsGateway.md#getrpcproviderforchainid)
- [getSigner](RailsGateway.md#getsigner)
- [getSignerAddress](RailsGateway.md#getsigneraddress)
- [getSignerOrProvider](RailsGateway.md#getsignerorprovider)
- [getStakedBalance](RailsGateway.md#getstakedbalance)
- [getStakingRegistryAddress](RailsGateway.md#getstakingregistryaddress)
- [getStakingRegistryContract](RailsGateway.md#getstakingregistrycontract)
- [getSupportedChainIds](RailsGateway.md#getsupportedchainids)
- [getSupportedTokenSymbols](RailsGateway.md#getsupportedtokensymbols)
- [getSupportedTokenSymbolsByChainId](RailsGateway.md#getsupportedtokensymbolsbychainid)
- [getTokenAddressByTokenSymbol](RailsGateway.md#gettokenaddressbytokensymbol)
- [getTokenContract](RailsGateway.md#gettokencontract)
- [getTokenInfo](RailsGateway.md#gettokeninfo)
- [getTotalSent](RailsGateway.md#gettotalsent)
- [getTransferBondedEventFilter](RailsGateway.md#gettransferbondedeventfilter)
- [getTransferBondedEventFromTransactionHash](RailsGateway.md#gettransferbondedeventfromtransactionhash)
- [getTransferBondedEventFromTransactionReceipt](RailsGateway.md#gettransferbondedeventfromtransactionreceipt)
- [getTransferBondedEventFromTransferId](RailsGateway.md#gettransferbondedeventfromtransferid)
- [getTransferBondedEvents](RailsGateway.md#gettransferbondedevents)
- [getTransferId](RailsGateway.md#gettransferid)
- [getTransferSentEventFilter](RailsGateway.md#gettransfersenteventfilter)
- [getTransferSentEventFromTransactionHash](RailsGateway.md#gettransfersenteventfromtransactionhash)
- [getTransferSentEventFromTransactionReceipt](RailsGateway.md#gettransfersenteventfromtransactionreceipt)
- [getTransferSentEventFromTransferId](RailsGateway.md#gettransfersenteventfromtransferid)
- [getTransferSentEvents](RailsGateway.md#gettransfersentevents)
- [getTransferSentEventsInBatches](RailsGateway.md#gettransfersenteventsinbatches)
- [getTransferStatus](RailsGateway.md#gettransferstatus)
- [getTxOverrides](RailsGateway.md#gettxoverrides)
- [getWithdrawableBalance](RailsGateway.md#getwithdrawablebalance)
- [getWithdrawableEth](RailsGateway.md#getwithdrawableeth)
- [getWithdrawableStakeBalance](RailsGateway.md#getwithdrawablestakebalance)
- [isStaked](RailsGateway.md#isstaked)
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
- [setChainRpcProvider](RailsGateway.md#setchainrpcprovider)
- [setChainRpcProviderUrl](RailsGateway.md#setchainrpcproviderurl)
- [setChainRpcProviderUrls](RailsGateway.md#setchainrpcproviderurls)
- [setChainRpcProviders](RailsGateway.md#setchainrpcproviders)
- [setContractAddresses](RailsGateway.md#setcontractaddresses)
- [stakeHop](RailsGateway.md#stakehop)
- [throwError](RailsGateway.md#throwerror)
- [unstakeHop](RailsGateway.md#unstakehop)
- [withdrawAllClaims](RailsGateway.md#withdrawallclaims)
- [withdrawClaim](RailsGateway.md#withdrawclaim)
- [withdrawHop](RailsGateway.md#withdrawhop)
- [getTransferBondedEventSignature](RailsGateway.md#gettransferbondedeventsignature)
- [getTransferSentEventSignature](RailsGateway.md#gettransfersenteventsignature)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new RailsGateway**(`«destructured»`): [`RailsGateway`](RailsGateway.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `BaseConfig` |

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

### <a id="chainproviders" name="chainproviders"></a> chainProviders

• **chainProviders**: `ChainProviders`

#### Inherited from

StakingRegistry.chainProviders

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

### <a id="signer" name="signer"></a> signer

• **signer**: `Signer`

#### Inherited from

StakingRegistry.signer

## Accessors

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• `get` **populateTransaction**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `approveBond` | (`__namedParameters`: [`ApproveBondInput`](../modules.md#approvebondinput)) => `Promise`\<`TransactionRequest`\> |
| `approveSend` | (`__namedParameters`: [`ApproveSendInput`](../modules.md#approvesendinput)) => `Promise`\<`TransactionRequest`\> |
| `approveStakeHop` | (`__namedParameters`: [`StakeHopInput`](../modules.md#stakehopinput)) => `Promise`\<`TransactionRequest`\> |
| `bond` | (`__namedParameters`: [`BondInput`](../modules.md#bondinput)) => `Promise`\<`TransactionRequest`\> |
| `confirmClaim` | (`__namedParameters`: [`ConfirmClaimInput`](../modules.md#confirmclaiminput)) => `Promise`\<`TransactionRequest`\> |
| `postClaim` | (`__namedParameters`: [`PostClaimInput`](../modules.md#postclaiminput)) => `Promise`\<`TransactionRequest`\> |
| `removeClaim` | (`__namedParameters`: [`RemoveClaimInput`](../modules.md#removeclaiminput)) => `Promise`\<`TransactionRequest`\> |
| `send` | (`__namedParameters`: [`SendInput`](../modules.md#sendinput)) => `Promise`\<`TransactionRequest`\> |
| `stakeHop` | (`__namedParameters`: [`StakeHopInput`](../modules.md#stakehopinput)) => `Promise`\<`TransactionRequest`\> |
| `unstakeHop` | (`__namedParameters`: [`UnstakeHopInput`](../modules.md#unstakehopinput)) => `Promise`\<`TransactionRequest`\> |
| `withdrawAllClaims` | (`__namedParameters`: [`WithdrawAllInput`](../modules.md#withdrawallinput)) => `Promise`\<`TransactionRequest`\> |
| `withdrawClaim` | (`__namedParameters`: [`WithdrawInput`](../modules.md#withdrawinput)) => `Promise`\<`TransactionRequest`\> |
| `withdrawHop` | (`__namedParameters`: [`WithdrawHopInput`](../modules.md#withdrawhopinput)) => `Promise`\<`TransactionRequest`\> |

___

### <a id="utils" name="utils"></a> utils

• `get` **utils**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `estimateGas` | (`provider`: `Provider`, `tx`: `TransactionRequest`) => `Promise`\<`BigNumber`\> |
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

### <a id="approvebond" name="approvebond"></a> approveBond

▸ **approveBond**(`input`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`ApproveBondInput`](../modules.md#approvebondinput) |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="approvesend" name="approvesend"></a> approveSend

▸ **approveSend**(`input`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`ApproveSendInput`](../modules.md#approvesendinput) |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="bond" name="bond"></a> bond

▸ **bond**(`input`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`BondInput`](../modules.md#bondinput) |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="calcamountoutmin" name="calcamountoutmin"></a> calcAmountOutMin

▸ **calcAmountOutMin**(`«destructured»`): `BigNumber`

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`CalcAmountOutMinInput`](../modules.md#calcamountoutmininput) |

#### Returns

`BigNumber`

___

### <a id="confirmclaim" name="confirmclaim"></a> confirmClaim

▸ **confirmClaim**(`input`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`ConfirmClaimInput`](../modules.md#confirmclaiminput) |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="connect" name="connect"></a> connect

▸ **connect**(`signer`): [`RailsGateway`](RailsGateway.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `signer` | `Signer` |

#### Returns

[`RailsGateway`](RailsGateway.md)

#### Overrides

StakingRegistry.connect

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

### <a id="getappealperiod" name="getappealperiod"></a> getAppealPeriod

▸ **getAppealPeriod**(`chainId`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`Promise`\<`any`\>

#### Inherited from

StakingRegistry.getAppealPeriod

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

### <a id="getchallengeperiod" name="getchallengeperiod"></a> getChallengePeriod

▸ **getChallengePeriod**(`chainId`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`Promise`\<`any`\>

#### Inherited from

StakingRegistry.getChallengePeriod

___

### <a id="getchallenges" name="getchallenges"></a> getChallenges

▸ **getChallenges**(`input`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `GetChallengesInput` |

#### Returns

`Promise`\<`any`\>

#### Inherited from

StakingRegistry.getChallenges

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

### <a id="getdefaultchainrpcprovider" name="getdefaultchainrpcprovider"></a> getDefaultChainRpcProvider

▸ **getDefaultChainRpcProvider**(`chainId`): `Provider`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`Provider`

#### Inherited from

StakingRegistry.getDefaultChainRpcProvider

___

### <a id="getdefaultchainrpcproviders" name="getdefaultchainrpcproviders"></a> getDefaultChainRpcProviders

▸ **getDefaultChainRpcProviders**(): `ChainProviders`

#### Returns

`ChainProviders`

#### Inherited from

StakingRegistry.getDefaultChainRpcProviders

___

### <a id="geteventfetcher" name="geteventfetcher"></a> getEventFetcher

▸ **getEventFetcher**(`eventName`, `chainId`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `EventName` |
| `chainId` | `BigNumberish` |

#### Returns

`any`

___

### <a id="geteventnames" name="geteventnames"></a> getEventNames

▸ **getEventNames**(): `string`[]

#### Returns

`string`[]

___

### <a id="getfee" name="getfee"></a> getFee

▸ **getFee**(`«destructured»`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetFeeInput`](../modules.md#getfeeinput) |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getfullappeal" name="getfullappeal"></a> getFullAppeal

▸ **getFullAppeal**(`chainId`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`Promise`\<`any`\>

#### Inherited from

StakingRegistry.getFullAppeal

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

### <a id="gethopbalance" name="gethopbalance"></a> getHopBalance

▸ **getHopBalance**(`chainId`, `address?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `address?` | ``null`` \| `string` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="gethoptokenaddress" name="gethoptokenaddress"></a> getHopTokenAddress

▸ **getHopTokenAddress**(`chainId`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`Promise`\<`string`\>

___

### <a id="gethoptokencontract" name="gethoptokencontract"></a> getHopTokenContract

▸ **getHopTokenContract**(`chainId`): `Promise`\<`Contract`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`Promise`\<`Contract`\>

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

### <a id="getispathidlive" name="getispathidlive"></a> getIsPathIdLive

▸ **getIsPathIdLive**(`«destructured»`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetIsPathIdLiveInput`](../modules.md#getispathidliveinput) |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="getistransferbonded" name="getistransferbonded"></a> getIsTransferBonded

▸ **getIsTransferBonded**(`«destructured»`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetIsTransferBondedInput`](../modules.md#getistransferbondedinput) |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="getistransferclaimed" name="getistransferclaimed"></a> getIsTransferClaimed

▸ **getIsTransferClaimed**(`«destructured»`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetIsTransferClaimedInput`](../modules.md#getistransferclaimedinput) |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="getlatestclaim" name="getlatestclaim"></a> getLatestClaim

▸ **getLatestClaim**(`«destructured»`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetLatestClaimInput`](../modules.md#getlatestclaiminput) |

#### Returns

`Promise`\<`string`\>

___

### <a id="getminbonderstake" name="getminbonderstake"></a> getMinBonderStake

▸ **getMinBonderStake**(`chainId`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getminchallengeincrease" name="getminchallengeincrease"></a> getMinChallengeIncrease

▸ **getMinChallengeIncrease**(`chainId`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`Promise`\<`any`\>

#### Inherited from

StakingRegistry.getMinChallengeIncrease

___

### <a id="getminhopstakeforrole" name="getminhopstakeforrole"></a> getMinHopStakeForRole

▸ **getMinHopStakeForRole**(`input`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `MinHopStakeForRoleInput` |

#### Returns

`Promise`\<`any`\>

#### Inherited from

StakingRegistry.getMinHopStakeForRole

___

### <a id="getneedsapprovalforbond" name="getneedsapprovalforbond"></a> getNeedsApprovalForBond

▸ **getNeedsApprovalForBond**(`«destructured»`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetNeedsApprovalForBondInput`](../modules.md#getneedsapprovalforbondinput) |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="getneedsapprovalforsend" name="getneedsapprovalforsend"></a> getNeedsApprovalForSend

▸ **getNeedsApprovalForSend**(`«destructured»`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetNeedsApprovalForSendInput`](../modules.md#getneedsapprovalforsendinput) |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="getnexthopshash" name="getnexthopshash"></a> getNextHopsHash

▸ **getNextHopsHash**(`«destructured»`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetNextHopsHashInput`](../modules.md#getnexthopshashinput) |

#### Returns

`string`

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

### <a id="getrailsgatewaycontract" name="getrailsgatewaycontract"></a> getRailsGatewayContract

▸ **getRailsGatewayContract**(`chainId`): `Promise`\<`Contract`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`Promise`\<`Contract`\>

___

### <a id="getrailsgatewaycontractaddress" name="getrailsgatewaycontractaddress"></a> getRailsGatewayContractAddress

▸ **getRailsGatewayContractAddress**(`chainId`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`string`

___

### <a id="getroleforrolename" name="getroleforrolename"></a> getRoleForRoleName

▸ **getRoleForRoleName**(`roleName`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `roleName` | `string` |

#### Returns

`Promise`\<`string`\>

#### Inherited from

StakingRegistry.getRoleForRoleName

___

### <a id="getrpcproviderforchainid" name="getrpcproviderforchainid"></a> getRpcProviderForChainId

▸ **getRpcProviderForChainId**(`chainId`): `Provider`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`Provider`

#### Inherited from

StakingRegistry.getRpcProviderForChainId

___

### <a id="getsigner" name="getsigner"></a> getSigner

▸ **getSigner**(): ``null`` \| `Signer`

#### Returns

``null`` \| `Signer`

#### Inherited from

StakingRegistry.getSigner

___

### <a id="getsigneraddress" name="getsigneraddress"></a> getSignerAddress

▸ **getSignerAddress**(): `Promise`\<``null`` \| `string`\>

#### Returns

`Promise`\<``null`` \| `string`\>

#### Inherited from

StakingRegistry.getSignerAddress

___

### <a id="getsignerorprovider" name="getsignerorprovider"></a> getSignerOrProvider

▸ **getSignerOrProvider**(`chainId`, `signer?`): `Promise`\<`Provider` \| `Signer`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `signer?` | `Signer` |

#### Returns

`Promise`\<`Provider` \| `Signer`\>

#### Inherited from

StakingRegistry.getSignerOrProvider

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

### <a id="gettotalsent" name="gettotalsent"></a> getTotalSent

▸ **getTotalSent**(`«destructured»`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `GetTotalSentInput` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="gettransferbondedeventfilter" name="gettransferbondedeventfilter"></a> getTransferBondedEventFilter

▸ **getTransferBondedEventFilter**(`«destructured»`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetTransferBondedEventFilterInput`](../modules.md#gettransferbondedeventfilterinput) |

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

### <a id="gettransferid" name="gettransferid"></a> getTransferId

▸ **getTransferId**(`«destructured»`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetTransferIdInput`](../modules.md#gettransferidinput) |

#### Returns

`Promise`\<`string`\>

___

### <a id="gettransfersenteventfilter" name="gettransfersenteventfilter"></a> getTransferSentEventFilter

▸ **getTransferSentEventFilter**(`«destructured»`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetTransferSentEventFilterInput`](../modules.md#gettransfersenteventfilterinput) |

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

### <a id="gettransfersenteventsinbatches" name="gettransfersenteventsinbatches"></a> getTransferSentEventsInBatches

▸ **getTransferSentEventsInBatches**(`«destructured»`): `AsyncGenerator`\<`any`, `void`, `unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`TransferSentEventInput`](../modules.md#transfersenteventinput) |

#### Returns

`AsyncGenerator`\<`any`, `void`, `unknown`\>

___

### <a id="gettransferstatus" name="gettransferstatus"></a> getTransferStatus

▸ **getTransferStatus**(`«destructured»`): `Promise`\<[`TransferStatus`](../modules.md#transferstatus)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetTransferStatusInput`](../modules.md#gettransferstatusinput) |

#### Returns

`Promise`\<[`TransferStatus`](../modules.md#transferstatus)\>

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

### <a id="getwithdrawablebalance" name="getwithdrawablebalance"></a> getWithdrawableBalance

▸ **getWithdrawableBalance**(`«destructured»`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`WithdrawBalanceInput`](../modules.md#withdrawbalanceinput) |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getwithdrawableeth" name="getwithdrawableeth"></a> getWithdrawableEth

▸ **getWithdrawableEth**(`input`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `GetWithdrawableEthInput` |

#### Returns

`Promise`\<`any`\>

#### Inherited from

StakingRegistry.getWithdrawableEth

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

▸ **postClaim**(`input`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`PostClaimInput`](../modules.md#postclaiminput) |

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

▸ **removeClaim**(`input`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`RemoveClaimInput`](../modules.md#removeclaiminput) |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="send" name="send"></a> send

▸ **send**(`input`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`SendInput`](../modules.md#sendinput) |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="sendtransaction" name="sendtransaction"></a> sendTransaction

▸ **sendTransaction**(`transactionRequest`, `chainId?`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionRequest` | `TransactionRequest` |
| `chainId?` | `BigNumberish` |

#### Returns

`Promise`\<`TransactionResponse`\>

#### Inherited from

StakingRegistry.sendTransaction

___

### <a id="setchainrpcprovider" name="setchainrpcprovider"></a> setChainRpcProvider

▸ **setChainRpcProvider**(`chainId`, `provider`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `provider` | `Provider` |

#### Returns

`void`

#### Inherited from

StakingRegistry.setChainRpcProvider

___

### <a id="setchainrpcproviderurl" name="setchainrpcproviderurl"></a> setChainRpcProviderUrl

▸ **setChainRpcProviderUrl**(`chainId`, `url`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `url` | `string` \| `string`[] |

#### Returns

`void`

#### Inherited from

StakingRegistry.setChainRpcProviderUrl

___

### <a id="setchainrpcproviderurls" name="setchainrpcproviderurls"></a> setChainRpcProviderUrls

▸ **setChainRpcProviderUrls**(`chainProviders`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainProviders` | `Record`\<`string`, `string` \| `string`[]\> |

#### Returns

`void`

#### Inherited from

StakingRegistry.setChainRpcProviderUrls

___

### <a id="setchainrpcproviders" name="setchainrpcproviders"></a> setChainRpcProviders

▸ **setChainRpcProviders**(`chainProviders`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainProviders` | `ChainProviders` |

#### Returns

`void`

#### Inherited from

StakingRegistry.setChainRpcProviders

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

### <a id="unstakehop" name="unstakehop"></a> unstakeHop

▸ **unstakeHop**(`input`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`UnstakeHopInput`](../modules.md#unstakehopinput) |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="withdrawallclaims" name="withdrawallclaims"></a> withdrawAllClaims

▸ **withdrawAllClaims**(`input`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`WithdrawAllInput`](../modules.md#withdrawallinput) |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="withdrawclaim" name="withdrawclaim"></a> withdrawClaim

▸ **withdrawClaim**(`input`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`WithdrawInput`](../modules.md#withdrawinput) |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="withdrawhop" name="withdrawhop"></a> withdrawHop

▸ **withdrawHop**(`input`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`WithdrawHopInput`](../modules.md#withdrawhopinput) |

#### Returns

`Promise`\<`TransactionResponse`\>

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
