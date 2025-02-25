# Class: Messenger

## Hierarchy

- `Base`

  ↳ **`Messenger`**

## Table of contents

### Constructors

- [constructor](Messenger.md#constructor)

### Properties

- [batchBlocks](Messenger.md#batchblocks)
- [chainId](Messenger.md#chainid)
- [contractAddresses](Messenger.md#contractaddresses)
- [gasPriceMultiplier](Messenger.md#gaspricemultiplier)
- [gasPriceOracle](Messenger.md#gaspriceoracle)
- [l1ChainId](Messenger.md#l1chainid)
- [network](Messenger.md#network)
- [signersOrProviders](Messenger.md#signersorproviders)
- [EventName](Messenger.md#eventname)

### Accessors

- [populateTransaction](Messenger.md#populatetransaction)
- [utils](Messenger.md#utils)

### Methods

- [bundleExit](Messenger.md#bundleexit)
- [execute](Messenger.md#execute)
- [exitBundle](Messenger.md#exitbundle)
- [getBundleCommittedEvents](Messenger.md#getbundlecommittedevents)
- [getBundleForwardedEvents](Messenger.md#getbundleforwardedevents)
- [getBundleProofFromMessageId](Messenger.md#getbundleprooffrommessageid)
- [getBundleProofFromTransactionHash](Messenger.md#getbundleprooffromtransactionhash)
- [getBundleReceivedEvents](Messenger.md#getbundlereceivedevents)
- [getBundleSetEvents](Messenger.md#getbundlesetevents)
- [getChainIdsSupportedByTokenSymbol](Messenger.md#getchainidssupportedbytokensymbol)
- [getColorForChainId](Messenger.md#getcolorforchainid)
- [getConfigAddress](Messenger.md#getconfigaddress)
- [getConfigStartBlock](Messenger.md#getconfigstartblock)
- [getContractAddresses](Messenger.md#getcontractaddresses)
- [getContractExists](Messenger.md#getcontractexists)
- [getDefaultProvider](Messenger.md#getdefaultprovider)
- [getDefaultProviders](Messenger.md#getdefaultproviders)
- [getEstimatedTxCostForForwardMessage](Messenger.md#getestimatedtxcostforforwardmessage)
- [getEthersWeb3Signer](Messenger.md#getethersweb3signer)
- [getEventFetcher](Messenger.md#geteventfetcher)
- [getEventNames](Messenger.md#geteventnames)
- [getExecutorContractAddress](Messenger.md#getexecutorcontractaddress)
- [getExplorerApiBaseUrl](Messenger.md#getexplorerapibaseurl)
- [getFeesSentToHubEvents](Messenger.md#getfeessenttohubevents)
- [getHasAuctionStarted](Messenger.md#gethasauctionstarted)
- [getHubChainId](Messenger.md#gethubchainid)
- [getHubMessageBridgeContractAddress](Messenger.md#gethubmessagebridgecontractaddress)
- [getIsBundleSet](Messenger.md#getisbundleset)
- [getIsL2TxHashExited](Messenger.md#getisl2txhashexited)
- [getIsMessageIdRelayed](Messenger.md#getismessageidrelayed)
- [getMaxBundleMessageCount](Messenger.md#getmaxbundlemessagecount)
- [getMerkleProofForMessageId](Messenger.md#getmerkleproofformessageid)
- [getMessageBundleIdFromMessageId](Messenger.md#getmessagebundleidfrommessageid)
- [getMessageBundleIdFromTransactionHash](Messenger.md#getmessagebundleidfromtransactionhash)
- [getMessageBundledEventFromMessageId](Messenger.md#getmessagebundledeventfrommessageid)
- [getMessageBundledEventFromTransactionHash](Messenger.md#getmessagebundledeventfromtransactionhash)
- [getMessageBundledEvents](Messenger.md#getmessagebundledevents)
- [getMessageBundledEventsForBundleId](Messenger.md#getmessagebundledeventsforbundleid)
- [getMessageCalldataFromMessageId](Messenger.md#getmessagecalldatafrommessageid)
- [getMessageExecutedEventFromMessageId](Messenger.md#getmessageexecutedeventfrommessageid)
- [getMessageExecutedEvents](Messenger.md#getmessageexecutedevents)
- [getMessageFee](Messenger.md#getmessagefee)
- [getMessageIdFromTransactionHash](Messenger.md#getmessageidfromtransactionhash)
- [getMessageIdsForBundleId](Messenger.md#getmessageidsforbundleid)
- [getMessageSentEventFromMessageId](Messenger.md#getmessagesenteventfrommessageid)
- [getMessageSentEventFromTransactionHash](Messenger.md#getmessagesenteventfromtransactionhash)
- [getMessageSentEventFromTransactionReceipt](Messenger.md#getmessagesenteventfromtransactionreceipt)
- [getMessageSentEvents](Messenger.md#getmessagesentevents)
- [getMessageSentEventsFromTransactionReceipt](Messenger.md#getmessagesenteventsfromtransactionreceipt)
- [getMessageTreeIndexFromMessageId](Messenger.md#getmessagetreeindexfrommessageid)
- [getMessageTreeIndexFromTransactionHash](Messenger.md#getmessagetreeindexfromtransactionhash)
- [getProvider](Messenger.md#getprovider)
- [getRelayFee](Messenger.md#getrelayfee)
- [getRelayMessageDataFromTransactionHash](Messenger.md#getrelaymessagedatafromtransactionhash)
- [getRelayReward](Messenger.md#getrelayreward)
- [getRelayWindowHours](Messenger.md#getrelaywindowhours)
- [getRouteData](Messenger.md#getroutedata)
- [getShouldAttemptForwardMessage](Messenger.md#getshouldattemptforwardmessage)
- [getSigner](Messenger.md#getsigner)
- [getSignerAddress](Messenger.md#getsigneraddress)
- [getSignerOrProvider](Messenger.md#getsignerorprovider)
- [getSignerProviderChainId](Messenger.md#getsignerproviderchainid)
- [getSpokeExitTime](Messenger.md#getspokeexittime)
- [getSpokeMessageBridgeContractAddress](Messenger.md#getspokemessagebridgecontractaddress)
- [getSupportedChainIds](Messenger.md#getsupportedchainids)
- [getSupportedTokenSymbols](Messenger.md#getsupportedtokensymbols)
- [getSupportedTokenSymbolsByChainId](Messenger.md#getsupportedtokensymbolsbychainid)
- [getTokenAddressByTokenSymbol](Messenger.md#gettokenaddressbytokensymbol)
- [getTokenSymbolByTokenAddress](Messenger.md#gettokensymbolbytokenaddress)
- [getTxOverrides](Messenger.md#gettxoverrides)
- [isValidBundleProof](Messenger.md#isvalidbundleproof)
- [relayMessage](Messenger.md#relaymessage)
- [sendMessage](Messenger.md#sendmessage)
- [sendTransaction](Messenger.md#sendtransaction)
- [setContractAddresses](Messenger.md#setcontractaddresses)
- [setExplorerApiBaseUrl](Messenger.md#setexplorerapibaseurl)
- [setProvider](Messenger.md#setprovider)
- [setProviderUrl](Messenger.md#setproviderurl)
- [setProviderUrls](Messenger.md#setproviderurls)
- [setProviders](Messenger.md#setproviders)
- [throwError](Messenger.md#throwerror)
- [deriveNetwork](Messenger.md#derivenetwork)
- [getBundleCommittedEventSignature](Messenger.md#getbundlecommittedeventsignature)
- [getBundleForwardedEventSignature](Messenger.md#getbundleforwardedeventsignature)
- [getBundleReceivedEventSignature](Messenger.md#getbundlereceivedeventsignature)
- [getBundleSetEventSignature](Messenger.md#getbundleseteventsignature)
- [getDefaultProvider](Messenger.md#getdefaultprovider-1)
- [getDefaultProviders](Messenger.md#getdefaultproviders-1)
- [getFeesSentToHubEventSignature](Messenger.md#getfeessenttohubeventsignature)
- [getMessageBundledEventSignature](Messenger.md#getmessagebundledeventsignature)
- [getMessageExecutedEventSignature](Messenger.md#getmessageexecutedeventsignature)
- [getMessageSentEventSignature](Messenger.md#getmessagesenteventsignature)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new Messenger**(`«destructured»`): [`Messenger`](Messenger.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`MessengerConstructorInput`](../modules.md#messengerconstructorinput) |

#### Returns

[`Messenger`](Messenger.md)

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

### <a id="gaspriceoracle" name="gaspriceoracle"></a> gasPriceOracle

• **gasPriceOracle**: `GasPriceOracle`

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

▪ `Static` **EventName**: typeof [`MessengerEventName`](../enums/MessengerEventName.md) = `EventName`

## Accessors

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• `get` **populateTransaction**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `bundleExit` | (`__namedParameters`: [`GetBundleExitPopulatedTxInput`](../modules.md#getbundleexitpopulatedtxinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `execute` | (`__namedParameters`: [`ExecuteInput`](../modules.md#executeinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `relayMessage` | (`__namedParameters`: [`GetRelayMessagePopulatedTxInput`](../modules.md#getrelaymessagepopulatedtxinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |
| `sendMessage` | (`__namedParameters`: [`GetSendMessagePopulatedTxInput`](../modules.md#getsendmessagepopulatedtxinput), `txOverrides`: `TxOverrides`) => `Promise`\<`TransactionRequest`\> |

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

### <a id="bundleexit" name="bundleexit"></a> bundleExit

▸ **bundleExit**(`input`, `txOverrides?`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`GetBundleExitPopulatedTxInput`](../modules.md#getbundleexitpopulatedtxinput) |
| `txOverrides` | `TxOverrides` |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="execute" name="execute"></a> execute

▸ **execute**(`input`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`ExecuteInput`](../modules.md#executeinput) |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="exitbundle" name="exitbundle"></a> exitBundle

▸ **exitBundle**(`«destructured»`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`ExitBundleInput`](../modules.md#exitbundleinput) |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="getbundlecommittedevents" name="getbundlecommittedevents"></a> getBundleCommittedEvents

▸ **getBundleCommittedEvents**(`«destructured»`): `Promise`\<`EthersEventWithDecodedTypes`\<`BundleCommitted`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `GetEventsInput` |

#### Returns

`Promise`\<`EthersEventWithDecodedTypes`\<`BundleCommitted`\>[]\>

___

### <a id="getbundleforwardedevents" name="getbundleforwardedevents"></a> getBundleForwardedEvents

▸ **getBundleForwardedEvents**(`«destructured»`): `Promise`\<`EthersEventWithDecodedTypes`\<`BundleForwarded`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `GetEventsInput` |

#### Returns

`Promise`\<`EthersEventWithDecodedTypes`\<`BundleForwarded`\>[]\>

___

### <a id="getbundleprooffrommessageid" name="getbundleprooffrommessageid"></a> getBundleProofFromMessageId

▸ **getBundleProofFromMessageId**(`«destructured»`): `Promise`\<[`BundleProof`](../modules.md#bundleproof)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetBundleProofFromMessageIdInput`](../modules.md#getbundleprooffrommessageidinput) |

#### Returns

`Promise`\<[`BundleProof`](../modules.md#bundleproof)\>

___

### <a id="getbundleprooffromtransactionhash" name="getbundleprooffromtransactionhash"></a> getBundleProofFromTransactionHash

▸ **getBundleProofFromTransactionHash**(`«destructured»`): `Promise`\<[`BundleProof`](../modules.md#bundleproof)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetBundleProofFromTransactionHashInput`](../modules.md#getbundleprooffromtransactionhashinput) |

#### Returns

`Promise`\<[`BundleProof`](../modules.md#bundleproof)\>

___

### <a id="getbundlereceivedevents" name="getbundlereceivedevents"></a> getBundleReceivedEvents

▸ **getBundleReceivedEvents**(`«destructured»`): `Promise`\<`EthersEventWithDecodedTypes`\<`BundleReceived`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `GetEventsInput` |

#### Returns

`Promise`\<`EthersEventWithDecodedTypes`\<`BundleReceived`\>[]\>

___

### <a id="getbundlesetevents" name="getbundlesetevents"></a> getBundleSetEvents

▸ **getBundleSetEvents**(`«destructured»`): `Promise`\<`EthersEventWithDecodedTypes`\<`BundleSet`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `GetEventsInput` |

#### Returns

`Promise`\<`EthersEventWithDecodedTypes`\<`BundleSet`\>[]\>

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

### <a id="getestimatedtxcostforforwardmessage" name="getestimatedtxcostforforwardmessage"></a> getEstimatedTxCostForForwardMessage

▸ **getEstimatedTxCostForForwardMessage**(): `Promise`\<`number`\>

#### Returns

`Promise`\<`number`\>

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
| `eventName` | [`MessengerEventName`](../enums/MessengerEventName.md) |

#### Returns

`any`

___

### <a id="geteventnames" name="geteventnames"></a> getEventNames

▸ **getEventNames**(): `string`[]

#### Returns

`string`[]

___

### <a id="getexecutorcontractaddress" name="getexecutorcontractaddress"></a> getExecutorContractAddress

▸ **getExecutorContractAddress**(): `string`

#### Returns

`string`

___

### <a id="getexplorerapibaseurl" name="getexplorerapibaseurl"></a> getExplorerApiBaseUrl

▸ **getExplorerApiBaseUrl**(): `string`

#### Returns

`string`

#### Inherited from

Base.getExplorerApiBaseUrl

___

### <a id="getfeessenttohubevents" name="getfeessenttohubevents"></a> getFeesSentToHubEvents

▸ **getFeesSentToHubEvents**(`«destructured»`): `Promise`\<`EthersEventWithDecodedTypes`\<`FeesSentToHub`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `GetEventsInput` |

#### Returns

`Promise`\<`EthersEventWithDecodedTypes`\<`FeesSentToHub`\>[]\>

___

### <a id="gethasauctionstarted" name="gethasauctionstarted"></a> getHasAuctionStarted

▸ **getHasAuctionStarted**(`«destructured»`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`HasAuctionStartedInput`](../modules.md#hasauctionstartedinput) |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="gethubchainid" name="gethubchainid"></a> getHubChainId

▸ **getHubChainId**(): `string`

#### Returns

`string`

#### Inherited from

Base.getHubChainId

___

### <a id="gethubmessagebridgecontractaddress" name="gethubmessagebridgecontractaddress"></a> getHubMessageBridgeContractAddress

▸ **getHubMessageBridgeContractAddress**(): `string`

#### Returns

`string`

___

### <a id="getisbundleset" name="getisbundleset"></a> getIsBundleSet

▸ **getIsBundleSet**(`«destructured»`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetIsBundleSetInput`](../modules.md#getisbundlesetinput) |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="getisl2txhashexited" name="getisl2txhashexited"></a> getIsL2TxHashExited

▸ **getIsL2TxHashExited**(`«destructured»`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetIsL2TxHashExitedInput`](../modules.md#getisl2txhashexitedinput) |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="getismessageidrelayed" name="getismessageidrelayed"></a> getIsMessageIdRelayed

▸ **getIsMessageIdRelayed**(`«destructured»`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetIsMessageIdRelayedInput`](../modules.md#getismessageidrelayedinput) |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="getmaxbundlemessagecount" name="getmaxbundlemessagecount"></a> getMaxBundleMessageCount

▸ **getMaxBundleMessageCount**(`«destructured»`): `Promise`\<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetMaxBundleMessageCountInput`](../modules.md#getmaxbundlemessagecountinput) |

#### Returns

`Promise`\<`number`\>

___

### <a id="getmerkleproofformessageid" name="getmerkleproofformessageid"></a> getMerkleProofForMessageId

▸ **getMerkleProofForMessageId**(`«destructured»`): `Promise`\<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetMerkleProofForMessageIdInput`](../modules.md#getmerkleproofformessageidinput) |

#### Returns

`Promise`\<`string`[]\>

___

### <a id="getmessagebundleidfrommessageid" name="getmessagebundleidfrommessageid"></a> getMessageBundleIdFromMessageId

▸ **getMessageBundleIdFromMessageId**(`«destructured»`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetMessageBundleIdFromMessageIdInput`](../modules.md#getmessagebundleidfrommessageidinput) |

#### Returns

`Promise`\<`string`\>

___

### <a id="getmessagebundleidfromtransactionhash" name="getmessagebundleidfromtransactionhash"></a> getMessageBundleIdFromTransactionHash

▸ **getMessageBundleIdFromTransactionHash**(`«destructured»`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetMessageBundleIdFromTransactionHashInput`](../modules.md#getmessagebundleidfromtransactionhashinput) |

#### Returns

`Promise`\<`string`\>

___

### <a id="getmessagebundledeventfrommessageid" name="getmessagebundledeventfrommessageid"></a> getMessageBundledEventFromMessageId

▸ **getMessageBundledEventFromMessageId**(`«destructured»`): `Promise`\<``null`` \| `EthersEventWithDecodedTypes`\<`MessageBundled`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetMessageBundledEventFromMessageIdInput`](../modules.md#getmessagebundledeventfrommessageidinput) |

#### Returns

`Promise`\<``null`` \| `EthersEventWithDecodedTypes`\<`MessageBundled`\>\>

___

### <a id="getmessagebundledeventfromtransactionhash" name="getmessagebundledeventfromtransactionhash"></a> getMessageBundledEventFromTransactionHash

▸ **getMessageBundledEventFromTransactionHash**(`«destructured»`): `Promise`\<``null`` \| `EthersEventWithDecodedTypes`\<`MessageBundled`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetMessageBundledEventFromTransactionHashInput`](../modules.md#getmessagebundledeventfromtransactionhashinput) |

#### Returns

`Promise`\<``null`` \| `EthersEventWithDecodedTypes`\<`MessageBundled`\>\>

___

### <a id="getmessagebundledevents" name="getmessagebundledevents"></a> getMessageBundledEvents

▸ **getMessageBundledEvents**(`«destructured»`): `Promise`\<`EthersEventWithDecodedTypes`\<`MessageBundled`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `GetEventsInput` |

#### Returns

`Promise`\<`EthersEventWithDecodedTypes`\<`MessageBundled`\>[]\>

___

### <a id="getmessagebundledeventsforbundleid" name="getmessagebundledeventsforbundleid"></a> getMessageBundledEventsForBundleId

▸ **getMessageBundledEventsForBundleId**(`«destructured»`): `Promise`\<`EthersEventWithDecodedTypes`\<`MessageBundled`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetMessageBundledEventsForBundleIdInput`](../modules.md#getmessagebundledeventsforbundleidinput) |

#### Returns

`Promise`\<`EthersEventWithDecodedTypes`\<`MessageBundled`\>[]\>

___

### <a id="getmessagecalldatafrommessageid" name="getmessagecalldatafrommessageid"></a> getMessageCalldataFromMessageId

▸ **getMessageCalldataFromMessageId**(`«destructured»`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetMessageCalldataInput`](../modules.md#getmessagecalldatainput) |

#### Returns

`Promise`\<`string`\>

___

### <a id="getmessageexecutedeventfrommessageid" name="getmessageexecutedeventfrommessageid"></a> getMessageExecutedEventFromMessageId

▸ **getMessageExecutedEventFromMessageId**(`«destructured»`): `Promise`\<``null`` \| `EthersEventWithDecodedTypes`\<`MessageExecuted`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetMessageExecutedEventFromMessageIdInput`](../modules.md#getmessageexecutedeventfrommessageidinput) |

#### Returns

`Promise`\<``null`` \| `EthersEventWithDecodedTypes`\<`MessageExecuted`\>\>

___

### <a id="getmessageexecutedevents" name="getmessageexecutedevents"></a> getMessageExecutedEvents

▸ **getMessageExecutedEvents**(`«destructured»`): `Promise`\<`EthersEventWithDecodedTypes`\<`MessageExecuted`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `GetEventsInput` |

#### Returns

`Promise`\<`EthersEventWithDecodedTypes`\<`MessageExecuted`\>[]\>

___

### <a id="getmessagefee" name="getmessagefee"></a> getMessageFee

▸ **getMessageFee**(`«destructured»`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetMessageFeeInput`](../modules.md#getmessagefeeinput) |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getmessageidfromtransactionhash" name="getmessageidfromtransactionhash"></a> getMessageIdFromTransactionHash

▸ **getMessageIdFromTransactionHash**(`«destructured»`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetMessageIdFromTransactionHashInput`](../modules.md#getmessageidfromtransactionhashinput) |

#### Returns

`Promise`\<`string`\>

___

### <a id="getmessageidsforbundleid" name="getmessageidsforbundleid"></a> getMessageIdsForBundleId

▸ **getMessageIdsForBundleId**(`«destructured»`): `Promise`\<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetMessageIdsForBundleIdInput`](../modules.md#getmessageidsforbundleidinput) |

#### Returns

`Promise`\<`string`[]\>

___

### <a id="getmessagesenteventfrommessageid" name="getmessagesenteventfrommessageid"></a> getMessageSentEventFromMessageId

▸ **getMessageSentEventFromMessageId**(`«destructured»`): `Promise`\<``null`` \| `EthersEventWithDecodedTypes`\<`MessageSent`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetMessageSentEventFromMessageIdInput`](../modules.md#getmessagesenteventfrommessageidinput) |

#### Returns

`Promise`\<``null`` \| `EthersEventWithDecodedTypes`\<`MessageSent`\>\>

___

### <a id="getmessagesenteventfromtransactionhash" name="getmessagesenteventfromtransactionhash"></a> getMessageSentEventFromTransactionHash

▸ **getMessageSentEventFromTransactionHash**(`«destructured»`): `Promise`\<``null`` \| `EthersEventWithDecodedTypes`\<`MessageSent`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetMessageSentEventFromTransactionHashInput`](../modules.md#getmessagesenteventfromtransactionhashinput) |

#### Returns

`Promise`\<``null`` \| `EthersEventWithDecodedTypes`\<`MessageSent`\>\>

___

### <a id="getmessagesenteventfromtransactionreceipt" name="getmessagesenteventfromtransactionreceipt"></a> getMessageSentEventFromTransactionReceipt

▸ **getMessageSentEventFromTransactionReceipt**(`«destructured»`): `Promise`\<``null`` \| `EthersEventWithDecodedTypes`\<`MessageSent`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetMessageSentEventFromTransactionReceiptInput`](../modules.md#getmessagesenteventfromtransactionreceiptinput) |

#### Returns

`Promise`\<``null`` \| `EthersEventWithDecodedTypes`\<`MessageSent`\>\>

___

### <a id="getmessagesentevents" name="getmessagesentevents"></a> getMessageSentEvents

▸ **getMessageSentEvents**(`«destructured»`): `Promise`\<`EthersEventWithDecodedTypes`\<`MessageSent`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `GetEventsInput` |

#### Returns

`Promise`\<`EthersEventWithDecodedTypes`\<`MessageSent`\>[]\>

___

### <a id="getmessagesenteventsfromtransactionreceipt" name="getmessagesenteventsfromtransactionreceipt"></a> getMessageSentEventsFromTransactionReceipt

▸ **getMessageSentEventsFromTransactionReceipt**(`«destructured»`): `Promise`\<``null`` \| `EthersEventWithDecodedTypes`\<`MessageSent`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetMessageSentEventFromTransactionReceiptInput`](../modules.md#getmessagesenteventfromtransactionreceiptinput) |

#### Returns

`Promise`\<``null`` \| `EthersEventWithDecodedTypes`\<`MessageSent`\>[]\>

___

### <a id="getmessagetreeindexfrommessageid" name="getmessagetreeindexfrommessageid"></a> getMessageTreeIndexFromMessageId

▸ **getMessageTreeIndexFromMessageId**(`«destructured»`): `Promise`\<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetMessageTreeIndexFromMessageIdInput`](../modules.md#getmessagetreeindexfrommessageidinput) |

#### Returns

`Promise`\<`number`\>

___

### <a id="getmessagetreeindexfromtransactionhash" name="getmessagetreeindexfromtransactionhash"></a> getMessageTreeIndexFromTransactionHash

▸ **getMessageTreeIndexFromTransactionHash**(`«destructured»`): `Promise`\<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetMessageTreeIndexFromTransactionHashInput`](../modules.md#getmessagetreeindexfromtransactionhashinput) |

#### Returns

`Promise`\<`number`\>

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

### <a id="getrelayfee" name="getrelayfee"></a> getRelayFee

▸ **getRelayFee**(`«destructured»`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetRelayFeeInput`](../modules.md#getrelayfeeinput) |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getrelaymessagedatafromtransactionhash" name="getrelaymessagedatafromtransactionhash"></a> getRelayMessageDataFromTransactionHash

▸ **getRelayMessageDataFromTransactionHash**(`«destructured»`): `Promise`\<[`RelayMessageData`](../modules.md#relaymessagedata)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetRelayMessageDataFromTransactionHashInput`](../modules.md#getrelaymessagedatafromtransactionhashinput) |

#### Returns

`Promise`\<[`RelayMessageData`](../modules.md#relaymessagedata)\>

___

### <a id="getrelayreward" name="getrelayreward"></a> getRelayReward

▸ **getRelayReward**(`«destructured»`): `Promise`\<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetRelayRewardInput`](../modules.md#getrelayrewardinput) |

#### Returns

`Promise`\<`number`\>

___

### <a id="getrelaywindowhours" name="getrelaywindowhours"></a> getRelayWindowHours

▸ **getRelayWindowHours**(): `Promise`\<`number`\>

#### Returns

`Promise`\<`number`\>

___

### <a id="getroutedata" name="getroutedata"></a> getRouteData

▸ **getRouteData**(`«destructured»`): `Promise`\<[`RouteData`](../modules.md#routedata)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetRouteDataInput`](../modules.md#getroutedatainput) |

#### Returns

`Promise`\<[`RouteData`](../modules.md#routedata)\>

___

### <a id="getshouldattemptforwardmessage" name="getshouldattemptforwardmessage"></a> getShouldAttemptForwardMessage

▸ **getShouldAttemptForwardMessage**(`«destructured»`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`ShouldAttemptForwardMessageInput`](../modules.md#shouldattemptforwardmessageinput) |

#### Returns

`Promise`\<`boolean`\>

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

### <a id="getspokeexittime" name="getspokeexittime"></a> getSpokeExitTime

▸ **getSpokeExitTime**(`«destructured»`): `Promise`\<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`GetSpokeExitTimeInput`](../modules.md#getspokeexittimeinput) |

#### Returns

`Promise`\<`number`\>

___

### <a id="getspokemessagebridgecontractaddress" name="getspokemessagebridgecontractaddress"></a> getSpokeMessageBridgeContractAddress

▸ **getSpokeMessageBridgeContractAddress**(): `string`

#### Returns

`string`

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

### <a id="isvalidbundleproof" name="isvalidbundleproof"></a> isValidBundleProof

▸ **isValidBundleProof**(`bundleProof`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `bundleProof` | [`BundleProof`](../modules.md#bundleproof) |

#### Returns

`boolean`

___

### <a id="relaymessage" name="relaymessage"></a> relayMessage

▸ **relayMessage**(`input`, `txOverrides?`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`GetRelayMessagePopulatedTxInput`](../modules.md#getrelaymessagepopulatedtxinput) |
| `txOverrides` | `TxOverrides` |

#### Returns

`Promise`\<`TransactionResponse`\>

___

### <a id="sendmessage" name="sendmessage"></a> sendMessage

▸ **sendMessage**(`input`, `txOverrides?`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`GetSendMessagePopulatedTxInput`](../modules.md#getsendmessagepopulatedtxinput) |
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

### <a id="derivenetwork" name="derivenetwork"></a> deriveNetwork

▸ **deriveNetwork**(`chainId`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`string`

___

### <a id="getbundlecommittedeventsignature" name="getbundlecommittedeventsignature"></a> getBundleCommittedEventSignature

▸ **getBundleCommittedEventSignature**(): `string`

#### Returns

`string`

___

### <a id="getbundleforwardedeventsignature" name="getbundleforwardedeventsignature"></a> getBundleForwardedEventSignature

▸ **getBundleForwardedEventSignature**(): `string`

#### Returns

`string`

___

### <a id="getbundlereceivedeventsignature" name="getbundlereceivedeventsignature"></a> getBundleReceivedEventSignature

▸ **getBundleReceivedEventSignature**(): `string`

#### Returns

`string`

___

### <a id="getbundleseteventsignature" name="getbundleseteventsignature"></a> getBundleSetEventSignature

▸ **getBundleSetEventSignature**(): `string`

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

### <a id="getfeessenttohubeventsignature" name="getfeessenttohubeventsignature"></a> getFeesSentToHubEventSignature

▸ **getFeesSentToHubEventSignature**(): `string`

#### Returns

`string`

___

### <a id="getmessagebundledeventsignature" name="getmessagebundledeventsignature"></a> getMessageBundledEventSignature

▸ **getMessageBundledEventSignature**(): `string`

#### Returns

`string`

___

### <a id="getmessageexecutedeventsignature" name="getmessageexecutedeventsignature"></a> getMessageExecutedEventSignature

▸ **getMessageExecutedEventSignature**(): `string`

#### Returns

`string`

___

### <a id="getmessagesenteventsignature" name="getmessagesenteventsignature"></a> getMessageSentEventSignature

▸ **getMessageSentEventSignature**(): `string`

#### Returns

`string`
