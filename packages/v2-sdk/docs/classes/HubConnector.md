# Class: HubConnector

## Hierarchy

- `Base`

  ↳ **`HubConnector`**

## Table of contents

### Constructors

- [constructor](HubConnector.md#constructor)

### Properties

- [batchBlocks](HubConnector.md#batchblocks)
- [chainProviders](HubConnector.md#chainproviders)
- [contractAddresses](HubConnector.md#contractaddresses)
- [gasPriceMultiplier](HubConnector.md#gaspricemultiplier)
- [l1ChainId](HubConnector.md#l1chainid)
- [network](HubConnector.md#network)
- [requireChainIdInput](HubConnector.md#requirechainidinput)
- [signer](HubConnector.md#signer)

### Accessors

- [populateTransaction](HubConnector.md#populatetransaction)
- [utils](HubConnector.md#utils)

### Methods

- [connect](HubConnector.md#connect)
- [connectTargets](HubConnector.md#connecttargets)
- [getChainIdsSupportedByTokenSymbol](HubConnector.md#getchainidssupportedbytokensymbol)
- [getColorForChainId](HubConnector.md#getcolorforchainid)
- [getConfigAddress](HubConnector.md#getconfigaddress)
- [getConfigStartBlock](HubConnector.md#getconfigstartblock)
- [getConnectorAddressFromReceipt](HubConnector.md#getconnectoraddressfromreceipt)
- [getConnectorAddressFromTx](HubConnector.md#getconnectoraddressfromtx)
- [getConnectorDeployedEvents](HubConnector.md#getconnectordeployedevents)
- [getContractAddresses](HubConnector.md#getcontractaddresses)
- [getContractExists](HubConnector.md#getcontractexists)
- [getDefaultChainRpcProvider](HubConnector.md#getdefaultchainrpcprovider)
- [getDefaultChainRpcProviders](HubConnector.md#getdefaultchainrpcproviders)
- [getHubConnectorContractAddress](HubConnector.md#gethubconnectorcontractaddress)
- [getRpcProviderForChainId](HubConnector.md#getrpcproviderforchainid)
- [getSigner](HubConnector.md#getsigner)
- [getSignerAddress](HubConnector.md#getsigneraddress)
- [getSignerOrProvider](HubConnector.md#getsignerorprovider)
- [getSignerProviderChainId](HubConnector.md#getsignerproviderchainid)
- [getSupportedChainIds](HubConnector.md#getsupportedchainids)
- [getSupportedTokenSymbols](HubConnector.md#getsupportedtokensymbols)
- [getSupportedTokenSymbolsByChainId](HubConnector.md#getsupportedtokensymbolsbychainid)
- [getTokenAddressByTokenSymbol](HubConnector.md#gettokenaddressbytokensymbol)
- [getTxOverrides](HubConnector.md#gettxoverrides)
- [sendTransaction](HubConnector.md#sendtransaction)
- [setChainRpcProvider](HubConnector.md#setchainrpcprovider)
- [setChainRpcProviderUrl](HubConnector.md#setchainrpcproviderurl)
- [setChainRpcProviderUrls](HubConnector.md#setchainrpcproviderurls)
- [setChainRpcProviders](HubConnector.md#setchainrpcproviders)
- [setContractAddresses](HubConnector.md#setcontractaddresses)
- [throwError](HubConnector.md#throwerror)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new HubConnector**(`config`): [`HubConnector`](HubConnector.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `BaseConfig` |

#### Returns

[`HubConnector`](HubConnector.md)

#### Overrides

Base.constructor

## Properties

### <a id="batchblocks" name="batchblocks"></a> batchBlocks

• **batchBlocks**: `number`

#### Inherited from

Base.batchBlocks

___

### <a id="chainproviders" name="chainproviders"></a> chainProviders

• **chainProviders**: `ChainProviders`

#### Inherited from

Base.chainProviders

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

### <a id="requirechainidinput" name="requirechainidinput"></a> requireChainIdInput

• **requireChainIdInput**: `boolean`

#### Inherited from

Base.requireChainIdInput

___

### <a id="signer" name="signer"></a> signer

• **signer**: `Signer`

#### Inherited from

Base.signer

## Accessors

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• `get` **populateTransaction**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `connectTargets` | (`__namedParameters`: [`ConnectTargetsInput`](../modules.md#connecttargetsinput)) => `Promise`\<`TransactionRequest`\> |

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

Base.utils

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`signer`): [`HubConnector`](HubConnector.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `signer` | `Signer` |

#### Returns

[`HubConnector`](HubConnector.md)

#### Overrides

Base.connect

___

### <a id="connecttargets" name="connecttargets"></a> connectTargets

▸ **connectTargets**(`input`): `Promise`\<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`ConnectTargetsInput`](../modules.md#connecttargetsinput) |

#### Returns

`Promise`\<`TransactionResponse`\>

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

### <a id="getconnectoraddressfromreceipt" name="getconnectoraddressfromreceipt"></a> getConnectorAddressFromReceipt

▸ **getConnectorAddressFromReceipt**(`receipt`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `receipt` | [`TransactionReceiptWithEvents`](../modules.md#transactionreceiptwithevents) |

#### Returns

`Promise`\<`string`\>

___

### <a id="getconnectoraddressfromtx" name="getconnectoraddressfromtx"></a> getConnectorAddressFromTx

▸ **getConnectorAddressFromTx**(`tx`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | `TransactionResponse` |

#### Returns

`Promise`\<`string`\>

___

### <a id="getconnectordeployedevents" name="getconnectordeployedevents"></a> getConnectorDeployedEvents

▸ **getConnectorDeployedEvents**(`«destructured»`): `Promise`\<`ConnectorDeployed`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `GetEventsInput` |

#### Returns

`Promise`\<`ConnectorDeployed`[]\>

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

### <a id="getdefaultchainrpcprovider" name="getdefaultchainrpcprovider"></a> getDefaultChainRpcProvider

▸ **getDefaultChainRpcProvider**(`chainId`): `Provider`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`Provider`

#### Inherited from

Base.getDefaultChainRpcProvider

___

### <a id="getdefaultchainrpcproviders" name="getdefaultchainrpcproviders"></a> getDefaultChainRpcProviders

▸ **getDefaultChainRpcProviders**(): `ChainProviders`

#### Returns

`ChainProviders`

#### Inherited from

Base.getDefaultChainRpcProviders

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

### <a id="getrpcproviderforchainid" name="getrpcproviderforchainid"></a> getRpcProviderForChainId

▸ **getRpcProviderForChainId**(`chainId`): `Provider`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

#### Returns

`Provider`

#### Inherited from

Base.getRpcProviderForChainId

___

### <a id="getsigner" name="getsigner"></a> getSigner

▸ **getSigner**(): ``null`` \| `Signer`

#### Returns

``null`` \| `Signer`

#### Inherited from

Base.getSigner

___

### <a id="getsigneraddress" name="getsigneraddress"></a> getSignerAddress

▸ **getSignerAddress**(): `Promise`\<``null`` \| `string`\>

#### Returns

`Promise`\<``null`` \| `string`\>

#### Inherited from

Base.getSignerAddress

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

Base.getSignerOrProvider

___

### <a id="getsignerproviderchainid" name="getsignerproviderchainid"></a> getSignerProviderChainId

▸ **getSignerProviderChainId**(): `Promise`\<`BigNumber`\>

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

Base.sendTransaction

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

Base.setChainRpcProvider

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

Base.setChainRpcProviderUrl

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

Base.setChainRpcProviderUrls

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

Base.setChainRpcProviders

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
