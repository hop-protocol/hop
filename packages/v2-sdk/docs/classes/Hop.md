# Class: Hop

## Hierarchy

- `Base`

  ↳ **`Hop`**

## Table of contents

### Constructors

- [constructor](Hop.md#constructor)

### Properties

- [batchBlocks](Hop.md#batchblocks)
- [contractAddresses](Hop.md#contractaddresses)
- [gasPriceMultiplier](Hop.md#gaspricemultiplier)
- [hubConnector](Hop.md#hubconnector)
- [l1ChainId](Hop.md#l1chainid)
- [messenger](Hop.md#messenger)
- [network](Hop.md#network)
- [railsGateways](Hop.md#railsgateways)
- [signersOrProviders](Hop.md#signersorproviders)

### Accessors

- [populateTransaction](Hop.md#populatetransaction)
- [utils](Hop.md#utils)
- [version](Hop.md#version)

### Methods

- [approveSendTokens](Hop.md#approvesendtokens)
- [calcAmountOutMin](Hop.md#calcamountoutmin)
- [connectTargets](Hop.md#connecttargets)
- [getChainIdsSupportedByTokenSymbol](Hop.md#getchainidssupportedbytokensymbol)
- [getColorForChainId](Hop.md#getcolorforchainid)
- [getConfigAddress](Hop.md#getconfigaddress)
- [getConfigStartBlock](Hop.md#getconfigstartblock)
- [getContractAddresses](Hop.md#getcontractaddresses)
- [getContractExists](Hop.md#getcontractexists)
- [getDefaultProvider](Hop.md#getdefaultprovider)
- [getDefaultProviders](Hop.md#getdefaultproviders)
- [getEstimatedReceived](Hop.md#getestimatedreceived)
- [getEthersWeb3Signer](Hop.md#getethersweb3signer)
- [getEvents](Hop.md#getevents)
- [getHubConnectorContractAddress](Hop.md#gethubconnectorcontractaddress)
- [getMessenger](Hop.md#getmessenger)
- [getNeedsApprovalForSendTokens](Hop.md#getneedsapprovalforsendtokens)
- [getPathInfo](Hop.md#getpathinfo)
- [getProvider](Hop.md#getprovider)
- [getRailsGateway](Hop.md#getrailsgateway)
- [getRailsGatewayContractAddress](Hop.md#getrailsgatewaycontractaddress)
- [getSendData](Hop.md#getsenddata)
- [getSendFee](Hop.md#getsendfee)
- [getSigner](Hop.md#getsigner)
- [getSignerAddress](Hop.md#getsigneraddress)
- [getSignerOrProvider](Hop.md#getsignerorprovider)
- [getSignerProviderChainId](Hop.md#getsignerproviderchainid)
- [getSupportedChainIds](Hop.md#getsupportedchainids)
- [getSupportedTokenSymbols](Hop.md#getsupportedtokensymbols)
- [getSupportedTokenSymbolsByChainId](Hop.md#getsupportedtokensymbolsbychainid)
- [getTokenAddressByTokenSymbol](Hop.md#gettokenaddressbytokensymbol)
- [getTokenContract](Hop.md#gettokencontract)
- [getTransferIdFromTransactionHash](Hop.md#gettransferidfromtransactionhash)
- [getTransferStatus](Hop.md#gettransferstatus)
- [getTxOverrides](Hop.md#gettxoverrides)
- [getWillSendTokensFail](Hop.md#getwillsendtokensfail)
- [sendTokens](Hop.md#sendtokens)
- [sendTransaction](Hop.md#sendtransaction)
- [setContractAddresses](Hop.md#setcontractaddresses)
- [setProvider](Hop.md#setprovider)
- [setProviderUrl](Hop.md#setproviderurl)
- [setProviderUrls](Hop.md#setproviderurls)
- [setProviders](Hop.md#setproviders)
- [switchChain](Hop.md#switchchain)
- [throwError](Hop.md#throwerror)
- [calcAmountOutMin](Hop.md#calcamountoutmin-1)
- [getDefaultProvider](Hop.md#getdefaultprovider-1)
- [getDefaultProviders](Hop.md#getdefaultproviders-1)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new Hop**(`options?`): [`Hop`](Hop.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`HopConstructorInput`](../modules.md#hopconstructorinput) |

#### Returns

[`Hop`](Hop.md)

#### Overrides

Base.constructor

## Properties

### <a id="batchblocks" name="batchblocks"></a> batchBlocks

• **batchBlocks**: `number`

#### Inherited from

Base.batchBlocks

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

### <a id="hubconnector" name="hubconnector"></a> hubConnector

• `Readonly` **hubConnector**: `HubConnector`

___

### <a id="l1chainid" name="l1chainid"></a> l1ChainId

• **l1ChainId**: `number`

#### Inherited from

Base.l1ChainId

___

### <a id="messenger" name="messenger"></a> messenger

• `Readonly` **messenger**: `Messenger`

___

### <a id="network" name="network"></a> network

• **network**: `string`

#### Inherited from

Base.network

___

### <a id="railsgateways" name="railsgateways"></a> railsGateways

• `Readonly` **railsGateways**: `Record`\<`string`, `RailsGateway`\> = `{}`

___

### <a id="signersorproviders" name="signersorproviders"></a> signersOrProviders

• **signersOrProviders**: `SignersOrProviders`

#### Inherited from

Base.signersOrProviders

## Accessors

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• `get` **populateTransaction**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `approveSendTokens` | (`__namedParameters`: [`ApproveSendTokensInput`](../modules.md#approvesendtokensinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `sendTokens` | (`__namedParameters`: [`SendTokensInput`](../modules.md#sendtokensinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |

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

___

### <a id="version" name="version"></a> version

• `get` **version**(): `string`

#### Returns

`string`

## Methods

### <a id="approvesendtokens" name="approvesendtokens"></a> approveSendTokens

▸ **approveSendTokens**(`input`, `txOverrides?`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`ApproveSendTokensInput`](../modules.md#approvesendtokensinput) |
| `txOverrides` | `TxOverrides` |

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

### <a id="connecttargets" name="connecttargets"></a> connectTargets

▸ **connectTargets**(`input`, `txOverrides?`): `Promise`\<\{ `connectorAddress`: `string` ; `tx`: `TransactionResponse`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `ConnectTargetsInput` |
| `txOverrides` | `TxOverrides` |

#### Returns

`Promise`\<\{ `connectorAddress`: `string` ; `tx`: `TransactionResponse`  }\>

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

### <a id="getestimatedreceived" name="getestimatedreceived"></a> getEstimatedReceived

▸ **getEstimatedReceived**(`«destructured»`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`SendTokensInput`](../modules.md#sendtokensinput) |

#### Returns

`Promise`\<`BigNumber`\>

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

### <a id="getevents" name="getevents"></a> getEvents

▸ **getEvents**(`«destructured»`): `Promise`\<`EthersEventWithDecodedTypesAndContext`\<[`AllEventTypes`](../modules.md#alleventtypes)\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetGeneralEventsInput`](../modules.md#getgeneraleventsinput) |

#### Returns

`Promise`\<`EthersEventWithDecodedTypesAndContext`\<[`AllEventTypes`](../modules.md#alleventtypes)\>[]\>

___

### <a id="gethubconnectorcontractaddress" name="gethubconnectorcontractaddress"></a> getHubConnectorContractAddress

▸ **getHubConnectorContractAddress**(`chainId`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`string`

___

### <a id="getmessenger" name="getmessenger"></a> getMessenger

▸ **getMessenger**(): `Messenger`

#### Returns

`Messenger`

___

### <a id="getneedsapprovalforsendtokens" name="getneedsapprovalforsendtokens"></a> getNeedsApprovalForSendTokens

▸ **getNeedsApprovalForSendTokens**(`input`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`GetNeedsApprovalForSendTokensInput`](../modules.md#getneedsapprovalforsendtokensinput) |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="getpathinfo" name="getpathinfo"></a> getPathInfo

▸ **getPathInfo**(`«destructured»`): `Promise`\<`Path`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `GetPathInfoInput` |

#### Returns

`Promise`\<`Path`\>

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

### <a id="getrailsgateway" name="getrailsgateway"></a> getRailsGateway

▸ **getRailsGateway**(`chainId`): `RailsGateway`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`RailsGateway`

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

### <a id="getsenddata" name="getsenddata"></a> getSendData

▸ **getSendData**(`«destructured»`): `Promise`\<`SendData`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `GetSendDataInput` |

#### Returns

`Promise`\<`SendData`\>

___

### <a id="getsendfee" name="getsendfee"></a> getSendFee

▸ **getSendFee**(`«destructured»`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetSendFeeInput`](../modules.md#getsendfeeinput) |

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

### <a id="gettokencontract" name="gettokencontract"></a> getTokenContract

▸ **getTokenContract**(`«destructured»`): `Contract`

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `GetTokenContractInput` |

#### Returns

`Contract`

___

### <a id="gettransferidfromtransactionhash" name="gettransferidfromtransactionhash"></a> getTransferIdFromTransactionHash

▸ **getTransferIdFromTransactionHash**(`«destructured»`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetTransferIdFromTransactionHashInput`](../modules.md#gettransferidfromtransactionhashinput) |

#### Returns

`Promise`\<`string`\>

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

Base.getTxOverrides

___

### <a id="getwillsendtokensfail" name="getwillsendtokensfail"></a> getWillSendTokensFail

▸ **getWillSendTokensFail**(`«destructured»`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`WillSendTokensFailInput`](../modules.md#willsendtokensfailinput) |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="sendtokens" name="sendtokens"></a> sendTokens

▸ **sendTokens**(`input`, `txOverrides?`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`SendTokensInput`](../modules.md#sendtokensinput) |
| `txOverrides` | `TxOverrides` |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="sendtransaction" name="sendtransaction"></a> sendTransaction

▸ **sendTransaction**(`transactionRequest`, `chainId?`, `signer?`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionRequest` | `TransactionRequest` |
| `chainId?` | `BigNumberish` |
| `signer?` | ``null`` \| `Signer` |

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

▸ **setProviderUrls**(`signersOrProviders`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `signersOrProviders` | `Record`\<`string`, `string` \| `string`[]\> |

#### Returns

`void`

#### Overrides

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

### <a id="switchchain" name="switchchain"></a> switchChain

▸ **switchChain**(`chainId`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`Promise`\<`void`\>

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

### <a id="calcamountoutmin-1" name="calcamountoutmin-1"></a> calcAmountOutMin

▸ **calcAmountOutMin**(`«destructured»`): `BigNumber`

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`CalcAmountOutMinInput`](../modules.md#calcamountoutmininput) |

#### Returns

`BigNumber`

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
