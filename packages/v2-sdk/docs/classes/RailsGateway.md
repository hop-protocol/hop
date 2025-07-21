# Class: RailsGateway

## Hierarchy

- `Base`

  ↳ **`RailsGateway`**

## Table of contents

### Constructors

- [constructor](RailsGateway.md#constructor)

### Properties

- [batchBlocks](RailsGateway.md#batchblocks)
- [chainId](RailsGateway.md#chainid)
- [contractAddresses](RailsGateway.md#contractaddresses)
- [gasPriceMultiplier](RailsGateway.md#gaspricemultiplier)
- [hubChainId](RailsGateway.md#hubchainid)
- [l1ChainId](RailsGateway.md#l1chainid)
- [network](RailsGateway.md#network)
- [signersOrProviders](RailsGateway.md#signersorproviders)
- [EventName](RailsGateway.md#eventname)

### Accessors

- [helpers](RailsGateway.md#helpers)
- [populateTransaction](RailsGateway.md#populatetransaction)
- [utils](RailsGateway.md#utils)

### Methods

- [addDecodedTypesToEvent](RailsGateway.md#adddecodedtypestoevent)
- [addDecodedTypesToEvents](RailsGateway.md#adddecodedtypestoevents)
- [bond](RailsGateway.md#bond)
- [claimFeesFromPath](RailsGateway.md#claimfeesfrompath)
- [confirmClaim](RailsGateway.md#confirmclaim)
- [counterpartChainIds](RailsGateway.md#counterpartchainids)
- [defaultTokenFee](RailsGateway.md#defaulttokenfee)
- [dispatcher](RailsGateway.md#dispatcher)
- [distributeClaimedFees](RailsGateway.md#distributeclaimedfees)
- [executor](RailsGateway.md#executor)
- [feeManager](RailsGateway.md#feemanager)
- [gateways](RailsGateway.md#gateways)
- [getAmountOut](RailsGateway.md#getamountout)
- [getChainIdsSupportedByTokenSymbol](RailsGateway.md#getchainidssupportedbytokensymbol)
- [getColorForChainId](RailsGateway.md#getcolorforchainid)
- [getConfigAddress](RailsGateway.md#getconfigaddress)
- [getConfigStartBlock](RailsGateway.md#getconfigstartblock)
- [getContractAddresses](RailsGateway.md#getcontractaddresses)
- [getContractExists](RailsGateway.md#getcontractexists)
- [getCounterpartChainId](RailsGateway.md#getcounterpartchainid)
- [getDefaultProvider](RailsGateway.md#getdefaultprovider)
- [getDefaultProviders](RailsGateway.md#getdefaultproviders)
- [getEthersWeb3Signer](RailsGateway.md#getethersweb3signer)
- [getEventFetcher](RailsGateway.md#geteventfetcher)
- [getEventFilter](RailsGateway.md#geteventfilter)
- [getEventNames](RailsGateway.md#geteventnames)
- [getExplorerApiBaseUrl](RailsGateway.md#getexplorerapibaseurl)
- [getHubChainId](RailsGateway.md#gethubchainid)
- [getMessageFee](RailsGateway.md#getmessagefee)
- [getNextHopsHash](RailsGateway.md#getnexthopshash)
- [getPath](RailsGateway.md#getpath)
- [getPathId](RailsGateway.md#getpathid)
- [getProvider](RailsGateway.md#getprovider)
- [getPushClaimFee](RailsGateway.md#getpushclaimfee)
- [getRailsGatewayContract](RailsGateway.md#getrailsgatewaycontract)
- [getRailsGatewayContractAddress](RailsGateway.md#getrailsgatewaycontractaddress)
- [getRailsPath](RailsGateway.md#getrailspath)
- [getRemoveFee](RailsGateway.md#getremovefee)
- [getSendFee](RailsGateway.md#getsendfee)
- [getSigner](RailsGateway.md#getsigner)
- [getSignerAddress](RailsGateway.md#getsigneraddress)
- [getSignerOrProvider](RailsGateway.md#getsignerorprovider)
- [getSignerProviderChainId](RailsGateway.md#getsignerproviderchainid)
- [getStakingRegistry](RailsGateway.md#getstakingregistry)
- [getStakingRegistryContractAddress](RailsGateway.md#getstakingregistrycontractaddress)
- [getSupportedChainIds](RailsGateway.md#getsupportedchainids)
- [getSupportedTokenSymbols](RailsGateway.md#getsupportedtokensymbols)
- [getSupportedTokenSymbolsByChainId](RailsGateway.md#getsupportedtokensymbolsbychainid)
- [getTokenAddressByTokenSymbol](RailsGateway.md#gettokenaddressbytokensymbol)
- [getTokenSymbolByTokenAddress](RailsGateway.md#gettokensymbolbytokenaddress)
- [getTransferDataHash](RailsGateway.md#gettransferdatahash)
- [getTxOverrides](RailsGateway.md#gettxoverrides)
- [initChain](RailsGateway.md#initchain)
- [initPath](RailsGateway.md#initpath)
- [isPathInitialized](RailsGateway.md#ispathinitialized)
- [pushClaim](RailsGateway.md#pushclaim)
- [pushClaimAndBond](RailsGateway.md#pushclaimandbond)
- [pushClaimAndWithdraw](RailsGateway.md#pushclaimandwithdraw)
- [railsPathImplementation](RailsGateway.md#railspathimplementation)
- [readdClaim](RailsGateway.md#readdclaim)
- [removeClaim](RailsGateway.md#removeclaim)
- [send](RailsGateway.md#send)
- [sendTransaction](RailsGateway.md#sendtransaction)
- [setContractAddresses](RailsGateway.md#setcontractaddresses)
- [setDefaultTokenFee](RailsGateway.md#setdefaulttokenfee)
- [setExplorerApiBaseUrl](RailsGateway.md#setexplorerapibaseurl)
- [setHubChainId](RailsGateway.md#sethubchainid)
- [setProvider](RailsGateway.md#setprovider)
- [setProviderUrl](RailsGateway.md#setproviderurl)
- [setProviderUrls](RailsGateway.md#setproviderurls)
- [setProviders](RailsGateway.md#setproviders)
- [setStakingRegistry](RailsGateway.md#setstakingregistry)
- [setTokenFeeRecipient](RailsGateway.md#settokenfeerecipient)
- [stakingRegistry](RailsGateway.md#stakingregistry)
- [throwError](RailsGateway.md#throwerror)
- [tokens](RailsGateway.md#tokens)
- [updateDefaultTokenFee](RailsGateway.md#updatedefaulttokenfee)
- [updateTokenFee](RailsGateway.md#updatetokenfee)
- [withdrawBonds](RailsGateway.md#withdrawbonds)
- [withdrawClaim](RailsGateway.md#withdrawclaim)
- [addDecodedTypesToEvent](RailsGateway.md#adddecodedtypestoevent-1)
- [addDecodedTypesToEvents](RailsGateway.md#adddecodedtypestoevents-1)
- [deriveNetwork](RailsGateway.md#derivenetwork)
- [getComputedNextHopsHash](RailsGateway.md#getcomputednexthopshash)
- [getDefaultProvider](RailsGateway.md#getdefaultprovider-1)
- [getDefaultProviders](RailsGateway.md#getdefaultproviders-1)
- [getEventNames](RailsGateway.md#geteventnames-1)
- [getEventSignature](RailsGateway.md#geteventsignature)

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

Base.constructor

## Properties

### <a id="batchblocks" name="batchblocks"></a> batchBlocks

• **batchBlocks**: `number`

#### Inherited from

Base.batchBlocks

___

### <a id="chainid" name="chainid"></a> chainId

• **chainId**: `BigNumberish`

___

### <a id="contractaddresses" name="contractaddresses"></a> contractAddresses

• **contractAddresses**: `Addresses`

#### Inherited from

Base.contractAddresses

___

### <a id="gaspricemultiplier" name="gaspricemultiplier"></a> gasPriceMultiplier

• **gasPriceMultiplier**: `number`

#### Inherited from

Base.gasPriceMultiplier

___

### <a id="hubchainid" name="hubchainid"></a> hubChainId

• **hubChainId**: `string`

#### Inherited from

Base.hubChainId

___

### <a id="l1chainid" name="l1chainid"></a> l1ChainId

• **l1ChainId**: `number`

#### Inherited from

Base.l1ChainId

___

### <a id="network" name="network"></a> network

• **network**: `string`

#### Inherited from

Base.network

___

### <a id="signersorproviders" name="signersorproviders"></a> signersOrProviders

• **signersOrProviders**: `SignersOrProviders`

#### Inherited from

Base.signersOrProviders

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
| `decodeBondTxInputData` | (`data`: `string`) => `Promise`\<`DecodedBondInputData`\> |
| `decodeSendTxInputData` | (`data`: `string`) => `Promise`\<`DecodedSendInputData`\> |
| `estimateGasCostForSend` | (`__namedParameters`: `EstimateGasCostForSendInput`) => `Promise`\<`BigNumber`\> |
| `getBucketIndex` | (`__namedParameters`: [`GetBucketIndexInput`](../modules.md#getbucketindexinput)) => `Promise`\<`number`\> |
| `getClaim` | (`__namedParameters`: [`GetClaimInput`](../modules.md#getclaiminput)) => `Promise`\<[`Claim`](../modules.md#claim)\> |
| `getComputedNextHopsHash` | (`input`: [`GetNextHopsHashInput`](../modules.md#getnexthopshashinput)) => `string` |
| `getComputedTransferDataHash` | (`input`: `GetComputedTransferDataHashInput`) => `string` |
| `getComputedTransferId` | (`__namedParameters`: `GetComputedTransferIdInput`) => `string` |
| `getHasSufficientBalance` | (`__namedParameters`: [`GetHasSufficientBalanceInput`](../modules.md#gethassufficientbalanceinput)) => `Promise`\<`boolean`\> |
| `getHeadClaimId` | (`__namedParameters`: [`GetHeadClaimIdInput`](../modules.md#getheadclaimidinput)) => `Promise`\<`string`\> |
| `getHopBalance` | (`address?`: ``null`` \| `string`) => `Promise`\<`BigNumber`\> |
| `getHopTokenAddress` | () => `Promise`\<`string`\> |
| `getHopTokenContract` | () => `Promise`\<`Contract`\> |
| `getInitialReserve` | (`__namedParameters`: [`GetInitialReserveInput`](../modules.md#getinitialreserveinput)) => `Promise`\<`BigNumber`\> |
| `getInitialReserveByTokenAddress` | (`__namedParameters`: [`GetInitialReserveByTokenAddressInput`](../modules.md#getinitialreservebytokenaddressinput)) => `Promise`\<`BigNumber`\> |
| `getInitialReserveByTokenSymbol` | (`__namedParameters`: [`GetInitialReserveByTokenSymbolInput`](../modules.md#getinitialreservebytokensymbolinput)) => `Promise`\<`BigNumber`\> |
| `getIsClaimBondedOrWithdrawn` | (`__namedParameters`: [`GetIsClaimBondedOrWithdrawnInput`](../modules.md#getisclaimbondedorwithdrawninput)) => `Promise`\<`boolean`\> |
| `getIsClaimPushed` | (`__namedParameters`: `GetIsClaimPushedInput`) => `Promise`\<`boolean`\> |
| `getIsPathIdLive` | (`__namedParameters`: [`GetIsPathIdLiveInput`](../modules.md#getispathidliveinput)) => `Promise`\<`boolean`\> |
| `getNeedsApprovalForBond` | (`__namedParameters`: [`GetNeedsApprovalForBondInput`](../modules.md#getneedsapprovalforbondinput)) => `Promise`\<`boolean`\> |
| `getNeedsApprovalForSend` | (`__namedParameters`: [`GetNeedsApprovalForSendInput`](../modules.md#getneedsapprovalforsendinput)) => `Promise`\<`boolean`\> |
| `getPathInfo` | (`__namedParameters`: [`GetPathInfoInput`](../modules.md#getpathinfoinput)) => `Promise`\<[`Path`](../modules.md#path)\> |
| `getSourcePool` | (`__namedParameters`: `GetSourcePoolInput`) => `Promise`\<`BigNumber`\> |
| `getTokenContract` | (`__namedParameters`: [`GetTokenContractInput`](../modules.md#gettokencontractinput)) => `Contract` |
| `getTokenInfo` | (`__namedParameters`: [`GetTokenInfoInput`](../modules.md#gettokeninfoinput)) => `Promise`\<[`Token`](../modules.md#token)\> |
| `getTotalSent` | (`__namedParameters`: [`GetTotalSentInput`](../modules.md#gettotalsentinput)) => `Promise`\<`BigNumber`\> |
| `getTransferBondedEventFromTransactionHash` | (`__namedParameters`: [`GetTransferBondedEventFromTransactionHashInput`](../modules.md#gettransferbondedeventfromtransactionhashinput)) => `Promise`\<``null`` \| `EthersEventWithDecodedTypes`\<`TransferBonded`\>\> |
| `getTransferBondedEventFromTransactionReceipt` | (`__namedParameters`: [`GetTransferBondedEventFromTransactionReceiptInput`](../modules.md#gettransferbondedeventfromtransactionreceiptinput)) => `Promise`\<``null`` \| `EthersEventWithDecodedTypes`\<`TransferBonded`\>\> |
| `getTransferBondedEventFromTransferId` | (`__namedParameters`: [`GetTransferBondedEventFromTransferIdInput`](../modules.md#gettransferbondedeventfromtransferidinput)) => `Promise`\<``null`` \| `EthersEventWithDecodedTypes`\<`TransferBonded`\>\> |
| `getTransferSentEventFromTransactionHash` | (`__namedParameters`: [`GetTransferSentEventFromTransactionHashInput`](../modules.md#gettransfersenteventfromtransactionhashinput)) => `Promise`\<``null`` \| `EthersEventWithDecodedTypes`\<`TransferSent`\>\> |
| `getTransferSentEventFromTransactionReceipt` | (`__namedParameters`: [`GetTransferSentEventFromTransactionReceiptInput`](../modules.md#gettransfersenteventfromtransactionreceiptinput)) => `Promise`\<``null`` \| `EthersEventWithDecodedTypes`\<`TransferSent`\>\> |
| `getTransferSentEventFromTransferId` | (`__namedParameters`: [`GetTransferSentEventFromTransferIdInput`](../modules.md#gettransfersenteventfromtransferidinput)) => `Promise`\<``null`` \| `EthersEventWithDecodedTypes`\<`TransferSent`\>\> |
| `getWithdrawableBalance` | (`__namedParameters`: [`GetWithdrawableBalanceInput`](../modules.md#getwithdrawablebalanceinput)) => `Promise`\<`BigNumber`\> |
| `isValidClaim` | (`__namedParameters`: [`GetIsClaimIdValidInput`](../modules.md#getisclaimidvalidinput)) => `Promise`\<`boolean`\> |
| `isValidTransfer` | (`__namedParameters`: `GetIsTransferIdValidInput`) => `Promise`\<`boolean`\> |
| `getAbi` | () => (\{ `anonymous?`: `undefined` ; `inputs`: \{ `internalType`: `string` ; `name`: `string` ; `type`: `string`  }[] ; `name?`: `undefined` ; `outputs?`: `undefined` ; `stateMutability`: `string` ; `type`: `string`  } \| \{ `anonymous?`: `undefined` ; `inputs?`: `undefined` ; `name?`: `undefined` ; `outputs?`: `undefined` ; `stateMutability`: `string` ; `type`: `string`  } \| \{ `anonymous?`: `undefined` ; `inputs`: (\{ `components?`: `undefined` ; `internalType`: `string` ; `name`: `string` ; `type`: `string`  } \| \{ `components`: \{ `internalType`: `string` ; `name`: `string` ; `type`: `string`  }[] ; `internalType`: `string` ; `name`: `string` ; `type`: `string`  })[] ; `name`: `string` ; `outputs`: \{ `internalType`: `string` ; `name`: `string` ; `type`: `string`  }[] ; `stateMutability`: `string` ; `type`: `string`  } \| \{ `anonymous`: `boolean` ; `inputs`: \{ `indexed`: `boolean` ; `internalType`: `string` ; `name`: `string` ; `type`: `string`  }[] ; `name`: `string` ; `outputs?`: `undefined` ; `stateMutability?`: `undefined` ; `type`: `string`  })[] |

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• `get` **populateTransaction**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `approveBond` | (`__namedParameters`: [`ApproveBondInput`](../modules.md#approvebondinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `approveSend` | (`__namedParameters`: [`ApproveSendInput`](../modules.md#approvesendinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `bond` | (`__namedParameters`: [`BondInput`](../modules.md#bondinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `claimFeesFromPath` | (`__namedParameters`: [`ClaimFeesFromPathInput`](../modules.md#claimfeesfrompathinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `confirmClaim` | (`__namedParameters`: [`ConfirmClaimInput`](../modules.md#confirmclaiminput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `distributeClaimedFees` | (`__namedParameters`: [`DistributeClaimedFeesInput`](../modules.md#distributeclaimedfeesinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `pushClaim` | (`__namedParameters`: [`PushClaimInput`](../modules.md#pushclaiminput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `pushClaimAndBond` | (`__namedParameters`: [`PushClaimAndBondInput`](../modules.md#pushclaimandbondinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `pushClaimAndWithdraw` | (`__namedParameters`: [`PushClaimAndWithdrawInput`](../modules.md#pushclaimandwithdrawinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `readdClaim` | (`__namedParameters`: [`ReaddClaimInput`](../modules.md#readdclaiminput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `removeClaim` | (`__namedParameters`: [`RemoveClaimInput`](../modules.md#removeclaiminput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `send` | (`__namedParameters`: [`SendInput`](../modules.md#sendinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `withdrawBonds` | (`__namedParameters`: [`WithdrawBondsInput`](../modules.md#withdrawbondsinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `withdrawClaim` | (`__namedParameters`: [`WithdrawClaimInput`](../modules.md#withdrawclaiminput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |

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

Base.utils

## Methods

### <a id="adddecodedtypestoevent" name="adddecodedtypestoevent"></a> addDecodedTypesToEvent

▸ **addDecodedTypesToEvent**(`event`): `EthersEventWithDecodedTypesAndBaseContext`\<`PathInitialized`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `any` |

#### Returns

`EthersEventWithDecodedTypesAndBaseContext`\<`PathInitialized`\>

___

### <a id="adddecodedtypestoevents" name="adddecodedtypestoevents"></a> addDecodedTypesToEvents

▸ **addDecodedTypesToEvents**(`events`): `EthersEventWithDecodedTypesAndBaseContext`\<`PathInitialized`\>[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `events` | `any`[] |

#### Returns

`EthersEventWithDecodedTypesAndBaseContext`\<`PathInitialized`\>[]

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

### <a id="counterpartchainids" name="counterpartchainids"></a> counterpartChainIds

▸ **counterpartChainIds**(`«destructured»`): `Promise`\<`BigNumber`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`CounterpartChainIdsInput`](../modules.md#counterpartchainidsinput) |

#### Returns

`Promise`\<`BigNumber`[]\>

___

### <a id="defaulttokenfee" name="defaulttokenfee"></a> defaultTokenFee

▸ **defaultTokenFee**(): `Promise`\<`BigNumber`\>

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="dispatcher" name="dispatcher"></a> dispatcher

▸ **dispatcher**(): `Promise`\<`string`\>

#### Returns

`Promise`\<`string`\>

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

### <a id="executor" name="executor"></a> executor

▸ **executor**(): `Promise`\<`string`\>

#### Returns

`Promise`\<`string`\>

___

### <a id="feemanager" name="feemanager"></a> feeManager

▸ **feeManager**(): `Promise`\<`string`\>

#### Returns

`Promise`\<`string`\>

___

### <a id="gateways" name="gateways"></a> gateways

▸ **gateways**(`«destructured»`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `GetGatewaysInput` |

#### Returns

`Promise`\<`string`\>

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

### <a id="getchainidssupportedbytokensymbol" name="getchainidssupportedbytokensymbol"></a> getChainIdsSupportedByTokenSymbol

▸ **getChainIdsSupportedByTokenSymbol**(`tokenSymbol`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenSymbol` | `string` |

#### Returns

`string`[]

#### Inherited from

Base.getChainIdsSupportedByTokenSymbol

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

Base.getColorForChainId

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

Base.getConfigAddress

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

Base.getConfigStartBlock

___

### <a id="getcontractaddresses" name="getcontractaddresses"></a> getContractAddresses

▸ **getContractAddresses**(): `Addresses`

#### Returns

`Addresses`

#### Inherited from

Base.getContractAddresses

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

Base.getContractExists

___

### <a id="getcounterpartchainid" name="getcounterpartchainid"></a> getCounterpartChainId

▸ **getCounterpartChainId**(`«destructured»`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetCounterpartChainIdInput`](../modules.md#getcounterpartchainidinput) |

#### Returns

`Promise`\<`BigNumber`\>

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

Base.getDefaultProvider

___

### <a id="getdefaultproviders" name="getdefaultproviders"></a> getDefaultProviders

▸ **getDefaultProviders**(): `SignersOrProviders`

#### Returns

`SignersOrProviders`

#### Inherited from

Base.getDefaultProviders

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

Base.getEthersWeb3Signer

___

### <a id="geteventfetcher" name="geteventfetcher"></a> getEventFetcher

▸ **getEventFetcher**(`eventName`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` |

#### Returns

`any`

___

### <a id="geteventfilter" name="geteventfilter"></a> getEventFilter

▸ **getEventFilter**(`eventName`, `input?`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | [`PathInitialized`](../enums/RailsGatewayEventName.md#pathinitialized) |
| `input` | `PathInitializedIndexes` |

#### Returns

`any`

___

### <a id="geteventnames" name="geteventnames"></a> getEventNames

▸ **getEventNames**(): `string`[]

EVENT HANDLERS

#### Returns

`string`[]

___

### <a id="getexplorerapibaseurl" name="getexplorerapibaseurl"></a> getExplorerApiBaseUrl

▸ **getExplorerApiBaseUrl**(): `string`

#### Returns

`string`

#### Inherited from

Base.getExplorerApiBaseUrl

___

### <a id="gethubchainid" name="gethubchainid"></a> getHubChainId

▸ **getHubChainId**(): `string`

#### Returns

`string`

#### Inherited from

Base.getHubChainId

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

### <a id="getnexthopshash" name="getnexthopshash"></a> getNextHopsHash

▸ **getNextHopsHash**(`«destructured»`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetNextHopsHashInput`](../modules.md#getnexthopshashinput) |

#### Returns

`Promise`\<`string`\>

___

### <a id="getpath" name="getpath"></a> getPath

▸ **getPath**(`«destructured»`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetPathInput`](../modules.md#getpathinput) |

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

### <a id="getprovider" name="getprovider"></a> getProvider

▸ **getProvider**(`chainId`): ``null`` \| `Provider`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

``null`` \| `Provider`

#### Inherited from

Base.getProvider

___

### <a id="getpushclaimfee" name="getpushclaimfee"></a> getPushClaimFee

▸ **getPushClaimFee**(): `Promise`\<`BigNumber`\>

#### Returns

`Promise`\<`BigNumber`\>

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

### <a id="getrailspath" name="getrailspath"></a> getRailsPath

▸ **getRailsPath**(`pathId?`, `address?`): `Promise`\<[`RailsPath`](RailsPath.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `pathId?` | `string` |
| `address?` | `string` |

#### Returns

`Promise`\<[`RailsPath`](RailsPath.md)\>

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

Base.getSigner

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

Base.getSignerAddress

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

Base.getSignerOrProvider

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

Base.getSignerProviderChainId

___

### <a id="getstakingregistry" name="getstakingregistry"></a> getStakingRegistry

▸ **getStakingRegistry**(): `StakingRegistry`

#### Returns

`StakingRegistry`

___

### <a id="getstakingregistrycontractaddress" name="getstakingregistrycontractaddress"></a> getStakingRegistryContractAddress

▸ **getStakingRegistryContractAddress**(): `Promise`\<`string`\>

#### Returns

`Promise`\<`string`\>

___

### <a id="getsupportedchainids" name="getsupportedchainids"></a> getSupportedChainIds

▸ **getSupportedChainIds**(): `string`[]

#### Returns

`string`[]

#### Inherited from

Base.getSupportedChainIds

___

### <a id="getsupportedtokensymbols" name="getsupportedtokensymbols"></a> getSupportedTokenSymbols

▸ **getSupportedTokenSymbols**(): `string`[]

#### Returns

`string`[]

#### Inherited from

Base.getSupportedTokenSymbols

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

Base.getSupportedTokenSymbolsByChainId

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

Base.getTokenAddressByTokenSymbol

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

Base.getTokenSymbolByTokenAddress

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

Base.getTxOverrides

___

### <a id="initchain" name="initchain"></a> initChain

▸ **initChain**(`«destructured»`): `Promise`\<`TransactionResponse`\>

ADMIN FUNCTIONS

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`InitChainInput`](../modules.md#initchaininput) |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="initpath" name="initpath"></a> initPath

▸ **initPath**(`«destructured»`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`InitPathInput`](../modules.md#initpathinput) |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="ispathinitialized" name="ispathinitialized"></a> isPathInitialized

▸ **isPathInitialized**(`«destructured»`): `Promise`\<`boolean`\>

/END ADMIN FUNCTIONS

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`IsPathInitializedInput`](../modules.md#ispathinitializedinput) |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="pushclaim" name="pushclaim"></a> pushClaim

▸ **pushClaim**(`input`, `txOverrides?`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`PushClaimInput`](../modules.md#pushclaiminput) |
| `txOverrides` | `TxOverrides` |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="pushclaimandbond" name="pushclaimandbond"></a> pushClaimAndBond

▸ **pushClaimAndBond**(`input`, `txOverrides?`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`PushClaimAndBondInput`](../modules.md#pushclaimandbondinput) |
| `txOverrides` | `TxOverrides` |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="pushclaimandwithdraw" name="pushclaimandwithdraw"></a> pushClaimAndWithdraw

▸ **pushClaimAndWithdraw**(`input`, `txOverrides?`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`PushClaimAndWithdrawInput`](../modules.md#pushclaimandwithdrawinput) |
| `txOverrides` | `TxOverrides` |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="railspathimplementation" name="railspathimplementation"></a> railsPathImplementation

▸ **railsPathImplementation**(): `Promise`\<`string`\>

#### Returns

`Promise`\<`string`\>

___

### <a id="readdclaim" name="readdclaim"></a> readdClaim

▸ **readdClaim**(`input`, `txOverrides?`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`ReaddClaimInput`](../modules.md#readdclaiminput) |
| `txOverrides` | `TxOverrides` |

#### Returns

`Promise`\<`TransactionResponse`\>

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

Base.sendTransaction

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

Base.setContractAddresses

___

### <a id="setdefaulttokenfee" name="setdefaulttokenfee"></a> setDefaultTokenFee

▸ **setDefaultTokenFee**(`«destructured»`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`SetDefaultTokenFeeInput`](../modules.md#setdefaulttokenfeeinput) |

#### Returns

`Promise`\<`TransactionResponse`\>

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

Base.setExplorerApiBaseUrl

___

### <a id="sethubchainid" name="sethubchainid"></a> setHubChainId

▸ **setHubChainId**(`newChainId`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `newChainId` | `BigNumberish` |

#### Returns

`void`

#### Inherited from

Base.setHubChainId

___

### <a id="setprovider" name="setprovider"></a> setProvider

▸ **setProvider**(`chainId`, `provider`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `provider` | `Provider` \| `Signer` |

#### Returns

`void`

#### Inherited from

Base.setProvider

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

Base.setProviderUrl

___

### <a id="setproviderurls" name="setproviderurls"></a> setProviderUrls

▸ **setProviderUrls**(`signersOrProvidersUrls`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `signersOrProvidersUrls` | `Record`\<`string`, `string` \| `string`[]\> |

#### Returns

`void`

#### Inherited from

Base.setProviderUrls

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

Base.setProviders

___

### <a id="setstakingregistry" name="setstakingregistry"></a> setStakingRegistry

▸ **setStakingRegistry**(`«destructured»`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`SetStakingRegistryInput`](../modules.md#setstakingregistryinput) |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="settokenfeerecipient" name="settokenfeerecipient"></a> setTokenFeeRecipient

▸ **setTokenFeeRecipient**(`«destructured»`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`SetTokenFeeRecipientInput`](../modules.md#settokenfeerecipientinput) |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="stakingregistry" name="stakingregistry"></a> stakingRegistry

▸ **stakingRegistry**(): `Promise`\<`string`\>

#### Returns

`Promise`\<`string`\>

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

Base.throwError

___

### <a id="tokens" name="tokens"></a> tokens

▸ **tokens**(`«destructured»`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`TokensInput`](../modules.md#tokensinput) |

#### Returns

`Promise`\<`string`\>

___

### <a id="updatedefaulttokenfee" name="updatedefaulttokenfee"></a> updateDefaultTokenFee

▸ **updateDefaultTokenFee**(`«destructured»`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`UpdateDefaultTokenFeeInput`](../modules.md#updatedefaulttokenfeeinput) |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="updatetokenfee" name="updatetokenfee"></a> updateTokenFee

▸ **updateTokenFee**(`«destructured»`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`UpdateTokenFeeInput`](../modules.md#updatetokenfeeinput) |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="withdrawbonds" name="withdrawbonds"></a> withdrawBonds

▸ **withdrawBonds**(`input`, `txOverrides?`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`WithdrawBondsInput`](../modules.md#withdrawbondsinput) |
| `txOverrides` | `TxOverrides` |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="withdrawclaim" name="withdrawclaim"></a> withdrawClaim

▸ **withdrawClaim**(`input`, `txOverrides?`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`WithdrawClaimInput`](../modules.md#withdrawclaiminput) |
| `txOverrides` | `TxOverrides` |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="adddecodedtypestoevent-1" name="adddecodedtypestoevent-1"></a> addDecodedTypesToEvent

▸ **addDecodedTypesToEvent**(`event`, `chainId?`): `EthersEventWithDecodedTypesAndBaseContext`\<`PathInitialized`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `any` |
| `chainId?` | `BigNumberish` |

#### Returns

`EthersEventWithDecodedTypesAndBaseContext`\<`PathInitialized`\>

___

### <a id="adddecodedtypestoevents-1" name="adddecodedtypestoevents-1"></a> addDecodedTypesToEvents

▸ **addDecodedTypesToEvents**(`events`, `chainId?`): `EthersEventWithDecodedTypesAndBaseContext`\<`PathInitialized`\>[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `events` | `any`[] |
| `chainId?` | `BigNumberish` |

#### Returns

`EthersEventWithDecodedTypesAndBaseContext`\<`PathInitialized`\>[]

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

STATIC METHODS

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

Base.getDefaultProvider

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

Base.getDefaultProviders

___

### <a id="geteventnames-1" name="geteventnames-1"></a> getEventNames

▸ **getEventNames**(): `string`[]

#### Returns

`string`[]

___

### <a id="geteventsignature" name="geteventsignature"></a> getEventSignature

▸ **getEventSignature**(`eventName`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | [`PathInitialized`](../enums/RailsGatewayEventName.md#pathinitialized) |

#### Returns

`string`
