# Class: Base

Class with base methods.

**`Namespace`**

Base

## Hierarchy

- **`Base`**

  ↳ [`Hop`](Hop.md)

  ↳ [`HopBridge`](HopBridge.md)

  ↳ [`CanonicalBridge`](CanonicalBridge.md)

  ↳ [`AMM`](AMM.md)

  ↳ [`Token`](Token.md)

## Table of contents

### Constructors

- [constructor](Base.md#constructor)

### Properties

- [addresses](Base.md#addresses)
- [baseConfigUrl](Base.md#baseconfigurl)
- [baseExplorerUrl](Base.md#baseexplorerurl)
- [blocklist](Base.md#blocklist)
- [bonders](Base.md#bonders)
- [chainProviders](Base.md#chainproviders)
- [chains](Base.md#chains)
- [configFileFetchEnabled](Base.md#configfilefetchenabled)
- [customAvailableLiquidityJsonUrl](Base.md#customavailableliquidityjsonurl)
- [customCoreConfigJsonUrl](Base.md#customcoreconfigjsonurl)
- [destinationFeeGasPriceMultiplier](Base.md#destinationfeegaspricemultiplier)
- [fees](Base.md#fees)
- [gasPriceMultiplier](Base.md#gaspricemultiplier)
- [getContract](Base.md#getcontract)
- [network](Base.md#network)
- [relayerFeeEnabled](Base.md#relayerfeeenabled)
- [signer](Base.md#signer)

### Accessors

- [availableLiqudityJsonUrl](Base.md#availableliqudityjsonurl)
- [configChains](Base.md#configchains)
- [coreConfigJsonUrl](Base.md#coreconfigjsonurl)
- [supportedChains](Base.md#supportedchains)
- [supportedNetworks](Base.md#supportednetworks)

### Methods

- [\_getBonderAddress](Base.md#_getbonderaddress)
- [\_getMessengerWrapperAddress](Base.md#_getmessengerwrapperaddress)
- [checkBlocklist](Base.md#checkblocklist)
- [estimateOptimismL1FeeFromData](Base.md#estimateoptimisml1feefromdata)
- [fetchBonderAvailableLiquidityData](Base.md#fetchbonderavailableliquiditydata)
- [fetchBonderAvailableLiquidityDataWithIpfsFallback](Base.md#fetchbonderavailableliquiditydatawithipfsfallback)
- [fetchConfigFromS3](Base.md#fetchconfigfroms3)
- [fetchCoreConfigData](Base.md#fetchcoreconfigdata)
- [fetchCoreConfigDataWithIpfsFallback](Base.md#fetchcoreconfigdatawithipfsfallback)
- [fetchIpfsBonderAvailableLiquidityData](Base.md#fetchipfsbonderavailableliquiditydata)
- [fetchIpfsCoreConfigData](Base.md#fetchipfscoreconfigdata)
- [geConfigChains](Base.md#geconfigchains)
- [getArbChainAddress](Base.md#getarbchainaddress)
- [getAvailableRoutes](Base.md#getavailableroutes)
- [getBumpedGasPrice](Base.md#getbumpedgasprice)
- [getChainId](Base.md#getchainid)
- [getChainProvider](Base.md#getchainprovider)
- [getChainProviderUrls](Base.md#getchainproviderurls)
- [getChainProviders](Base.md#getchainproviders)
- [getConfigAddresses](Base.md#getconfigaddresses)
- [getDestinationFeeGasPriceMultiplier](Base.md#getdestinationfeegaspricemultiplier)
- [getExplorerUrl](Base.md#getexplorerurl)
- [getExplorerUrlForAccount](Base.md#getexplorerurlforaccount)
- [getExplorerUrlForTransactionHash](Base.md#getexplorerurlfortransactionhash)
- [getExplorerUrlForTransferId](Base.md#getexplorerurlfortransferid)
- [getFeeBps](Base.md#getfeebps)
- [getIpfsBaseConfigUrl](Base.md#getipfsbaseconfigurl)
- [getL1AmbBridgeAddress](Base.md#getl1ambbridgeaddress)
- [getL1BridgeAddress](Base.md#getl1bridgeaddress)
- [getL1BridgeWrapperAddress](Base.md#getl1bridgewrapperaddress)
- [getL1CanonicalBridgeAddress](Base.md#getl1canonicalbridgeaddress)
- [getL1CanonicalTokenAddress](Base.md#getl1canonicaltokenaddress)
- [getL1PosErc20PredicateAddress](Base.md#getl1poserc20predicateaddress)
- [getL1PosRootChainManagerAddress](Base.md#getl1posrootchainmanageraddress)
- [getL2AmbBridgeAddress](Base.md#getl2ambbridgeaddress)
- [getL2AmmWrapperAddress](Base.md#getl2ammwrapperaddress)
- [getL2BridgeAddress](Base.md#getl2bridgeaddress)
- [getL2CanonicalBridgeAddress](Base.md#getl2canonicalbridgeaddress)
- [getL2CanonicalTokenAddress](Base.md#getl2canonicaltokenaddress)
- [getL2HopBridgeTokenAddress](Base.md#getl2hopbridgetokenaddress)
- [getL2SaddleLpTokenAddress](Base.md#getl2saddlelptokenaddress)
- [getL2SaddleSwapAddress](Base.md#getl2saddleswapaddress)
- [getProviderRpcUrl](Base.md#getproviderrpcurl)
- [getRelayerFee](Base.md#getrelayerfee)
- [getS3ConfigData](Base.md#gets3configdata)
- [getSignerAddress](Base.md#getsigneraddress)
- [getSignerOrProvider](Base.md#getsignerorprovider)
- [getSupportedAssets](Base.md#getsupportedassets)
- [getSupportedAssetsForChain](Base.md#getsupportedassetsforchain)
- [getSupportedChains](Base.md#getsupportedchains)
- [getSupportedTokens](Base.md#getsupportedtokens)
- [getTransferStatus](Base.md#gettransferstatus)
- [getWaitConfirmations](Base.md#getwaitconfirmations)
- [isValidChain](Base.md#isvalidchain)
- [isValidNetwork](Base.md#isvalidnetwork)
- [resolveDnslink](Base.md#resolvednslink)
- [sendTransaction](Base.md#sendtransaction)
- [setAvailableLiqudityJsonUrl](Base.md#setavailableliqudityjsonurl)
- [setBaseConfigUrl](Base.md#setbaseconfigurl)
- [setChainProvider](Base.md#setchainprovider)
- [setChainProviderUrls](Base.md#setchainproviderurls)
- [setChainProviders](Base.md#setchainproviders)
- [setConfigAddresses](Base.md#setconfigaddresses)
- [setConfigFileFetchEnabled](Base.md#setconfigfilefetchenabled)
- [setCoreConfigJsonUrl](Base.md#setcoreconfigjsonurl)
- [setGasPriceMultiplier](Base.md#setgaspricemultiplier)
- [toChainModel](Base.md#tochainmodel)
- [toTokenModel](Base.md#totokenmodel)
- [txOverrides](Base.md#txoverrides)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new Base**(`networkOrOptionsObject`, `signer`, `chainProviders?`)

**`Desc`**

Instantiates Base class.
Returns a new Base class instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `networkOrOptionsObject` | `string` \| `BaseConstructorOptions` | L1 network name (e.g. 'mainnet', 'kovan', 'goerli') |
| `signer` | [`TProvider`](../modules.md#tprovider) | - |
| `chainProviders?` | `ChainProviders` | - |

## Properties

### <a id="addresses" name="addresses"></a> addresses

• **addresses**: `Record`<`string`, `any`\>

___

### <a id="baseconfigurl" name="baseconfigurl"></a> baseConfigUrl

• **baseConfigUrl**: `string` = `defaultBaseConfigUrl`

___

### <a id="baseexplorerurl" name="baseexplorerurl"></a> baseExplorerUrl

• **baseExplorerUrl**: `string` = `'https://explorer.hop.exchange'`

___

### <a id="blocklist" name="blocklist"></a> blocklist

• **blocklist**: `Record`<`string`, `boolean`\> = `null`

___

### <a id="bonders" name="bonders"></a> bonders

• **bonders**: `Record`<`string`, `any`\>

___

### <a id="chainproviders" name="chainproviders"></a> chainProviders

• **chainProviders**: `ChainProviders` = `{}`

___

### <a id="chains" name="chains"></a> chains

• **chains**: `Record`<`string`, `any`\>

___

### <a id="configfilefetchenabled" name="configfilefetchenabled"></a> configFileFetchEnabled

• **configFileFetchEnabled**: `boolean` = `true`

___

### <a id="customavailableliquidityjsonurl" name="customavailableliquidityjsonurl"></a> customAvailableLiquidityJsonUrl

• **customAvailableLiquidityJsonUrl**: `string` = `''`

___

### <a id="customcoreconfigjsonurl" name="customcoreconfigjsonurl"></a> customCoreConfigJsonUrl

• **customCoreConfigJsonUrl**: `string` = `''`

___

### <a id="destinationfeegaspricemultiplier" name="destinationfeegaspricemultiplier"></a> destinationFeeGasPriceMultiplier

• **destinationFeeGasPriceMultiplier**: `number` = `1`

___

### <a id="fees" name="fees"></a> fees

• **fees**: `Object`

#### Index signature

▪ [token: `string`]: `Record`<`string`, `number`\>

___

### <a id="gaspricemultiplier" name="gaspricemultiplier"></a> gasPriceMultiplier

• **gasPriceMultiplier**: `number` = `0`

___

### <a id="getcontract" name="getcontract"></a> getContract

• **getContract**: (`factory`: `Factory`, `address`: `string`, `provider`: [`TProvider`](../modules.md#tprovider)) => `Promise`<`any`\> = `getContract`

#### Type declaration

▸ (`factory`, `address`, `provider`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `factory` | `Factory` |
| `address` | `string` |
| `provider` | [`TProvider`](../modules.md#tprovider) |

##### Returns

`Promise`<`any`\>

___

### <a id="network" name="network"></a> network

• **network**: `string`

Network name

___

### <a id="relayerfeeenabled" name="relayerfeeenabled"></a> relayerFeeEnabled

• **relayerFeeEnabled**: `Record`<`string`, `boolean`\>

___

### <a id="signer" name="signer"></a> signer

• **signer**: [`TProvider`](../modules.md#tprovider)

Ethers signer or provider

## Accessors

### <a id="availableliqudityjsonurl" name="availableliqudityjsonurl"></a> availableLiqudityJsonUrl

• `get` **availableLiqudityJsonUrl**(): `string`

#### Returns

`string`

___

### <a id="configchains" name="configchains"></a> configChains

• `get` **configChains**(): `string`[]

#### Returns

`string`[]

___

### <a id="coreconfigjsonurl" name="coreconfigjsonurl"></a> coreConfigJsonUrl

• `get` **coreConfigJsonUrl**(): `string`

#### Returns

`string`

___

### <a id="supportedchains" name="supportedchains"></a> supportedChains

• `get` **supportedChains**(): `string`[]

#### Returns

`string`[]

___

### <a id="supportednetworks" name="supportednetworks"></a> supportedNetworks

• `get` **supportedNetworks**(): `string`[]

#### Returns

`string`[]

## Methods

### <a id="_getbonderaddress" name="_getbonderaddress"></a> \_getBonderAddress

▸ `Protected` **_getBonderAddress**(`token`, `sourceChain`, `destinationChain`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `sourceChain` | [`TChain`](../modules.md#tchain) |
| `destinationChain` | [`TChain`](../modules.md#tchain) |

#### Returns

`Promise`<`string`\>

___

### <a id="_getmessengerwrapperaddress" name="_getmessengerwrapperaddress"></a> \_getMessengerWrapperAddress

▸ `Protected` **_getMessengerWrapperAddress**(`token`, `destinationChain`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `destinationChain` | [`TChain`](../modules.md#tchain) |

#### Returns

`Promise`<`string`\>

___

### <a id="checkblocklist" name="checkblocklist"></a> checkBlocklist

▸ **checkBlocklist**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

___

### <a id="estimateoptimisml1feefromdata" name="estimateoptimisml1feefromdata"></a> estimateOptimismL1FeeFromData

▸ **estimateOptimismL1FeeFromData**(`gasLimit`, `data?`, `to?`, `destChain?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `gasLimit` | `BigNumberish` | `undefined` |
| `data` | `string` | `'0x'` |
| `to` | `string` | `constants.AddressZero` |
| `destChain` | `string` \| [`Chain`](Chain.md) | `Chain.Optimism` |

#### Returns

`Promise`<`any`\>

___

### <a id="fetchbonderavailableliquiditydata" name="fetchbonderavailableliquiditydata"></a> fetchBonderAvailableLiquidityData

▸ **fetchBonderAvailableLiquidityData**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

___

### <a id="fetchbonderavailableliquiditydatawithipfsfallback" name="fetchbonderavailableliquiditydatawithipfsfallback"></a> fetchBonderAvailableLiquidityDataWithIpfsFallback

▸ **fetchBonderAvailableLiquidityDataWithIpfsFallback**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

___

### <a id="fetchconfigfroms3" name="fetchconfigfroms3"></a> fetchConfigFromS3

▸ **fetchConfigFromS3**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

___

### <a id="fetchcoreconfigdata" name="fetchcoreconfigdata"></a> fetchCoreConfigData

▸ **fetchCoreConfigData**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

___

### <a id="fetchcoreconfigdatawithipfsfallback" name="fetchcoreconfigdatawithipfsfallback"></a> fetchCoreConfigDataWithIpfsFallback

▸ **fetchCoreConfigDataWithIpfsFallback**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

___

### <a id="fetchipfsbonderavailableliquiditydata" name="fetchipfsbonderavailableliquiditydata"></a> fetchIpfsBonderAvailableLiquidityData

▸ **fetchIpfsBonderAvailableLiquidityData**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

___

### <a id="fetchipfscoreconfigdata" name="fetchipfscoreconfigdata"></a> fetchIpfsCoreConfigData

▸ **fetchIpfsCoreConfigData**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

___

### <a id="geconfigchains" name="geconfigchains"></a> geConfigChains

▸ **geConfigChains**(): `string`[]

#### Returns

`string`[]

___

### <a id="getarbchainaddress" name="getarbchainaddress"></a> getArbChainAddress

▸ **getArbChainAddress**(`token`, `chain`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`string`

___

### <a id="getavailableroutes" name="getavailableroutes"></a> getAvailableRoutes

▸ **getAvailableRoutes**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

___

### <a id="getbumpedgasprice" name="getbumpedgasprice"></a> getBumpedGasPrice

▸ **getBumpedGasPrice**(`signer`, `percent`): `Promise`<`BigNumber`\>

**`Desc`**

Calculates current gas price plus increased percentage amount.

**`Example`**

```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
const bumpedGasPrice = await hop.getBumpedGasPrice(signer, 1.20)
console.log(bumpedGasPrice.toNumber())
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | [`TProvider`](../modules.md#tprovider) | Ether's Signer |
| `percent` | `number` | Percentage to bump by. |

#### Returns

`Promise`<`BigNumber`\>

Bumped as price as BigNumber

___

### <a id="getchainid" name="getchainid"></a> getChainId

▸ **getChainId**(`chain`): `number`

**`Desc`**

Returns Chain ID for specified Chain model.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chain` | [`Chain`](Chain.md) | Chain model. |

#### Returns

`number`

- Chain ID.

___

### <a id="getchainprovider" name="getchainprovider"></a> getChainProvider

▸ **getChainProvider**(`chain`): `any`

**`Desc`**

Returns Ethers provider for specified Chain model.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chain` | `string` \| [`Chain`](Chain.md) | Chain model. |

#### Returns

`any`

Ethers provider.

___

### <a id="getchainproviderurls" name="getchainproviderurls"></a> getChainProviderUrls

▸ **getChainProviderUrls**(): `any`

#### Returns

`any`

___

### <a id="getchainproviders" name="getchainproviders"></a> getChainProviders

▸ **getChainProviders**(): `any`

#### Returns

`any`

___

### <a id="getconfigaddresses" name="getconfigaddresses"></a> getConfigAddresses

▸ **getConfigAddresses**(`token`, `chain`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`any`

___

### <a id="getdestinationfeegaspricemultiplier" name="getdestinationfeegaspricemultiplier"></a> getDestinationFeeGasPriceMultiplier

▸ **getDestinationFeeGasPriceMultiplier**(): `number`

#### Returns

`number`

___

### <a id="getexplorerurl" name="getexplorerurl"></a> getExplorerUrl

▸ **getExplorerUrl**(): `string`

#### Returns

`string`

___

### <a id="getexplorerurlforaccount" name="getexplorerurlforaccount"></a> getExplorerUrlForAccount

▸ **getExplorerUrlForAccount**(`accountAddress`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `accountAddress` | `string` |

#### Returns

`string`

___

### <a id="getexplorerurlfortransactionhash" name="getexplorerurlfortransactionhash"></a> getExplorerUrlForTransactionHash

▸ **getExplorerUrlForTransactionHash**(`transactionHash`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionHash` | `string` |

#### Returns

`string`

___

### <a id="getexplorerurlfortransferid" name="getexplorerurlfortransferid"></a> getExplorerUrlForTransferId

▸ **getExplorerUrlForTransferId**(`transferId`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `transferId` | `string` |

#### Returns

`string`

___

### <a id="getfeebps" name="getfeebps"></a> getFeeBps

▸ **getFeeBps**(`token`, `destinationChain`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `destinationChain` | [`TChain`](../modules.md#tchain) |

#### Returns

`Promise`<`number`\>

___

### <a id="getipfsbaseconfigurl" name="getipfsbaseconfigurl"></a> getIpfsBaseConfigUrl

▸ **getIpfsBaseConfigUrl**(`ipfsHash`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ipfsHash` | `string` |

#### Returns

`string`

___

### <a id="getl1ambbridgeaddress" name="getl1ambbridgeaddress"></a> getL1AmbBridgeAddress

▸ **getL1AmbBridgeAddress**(`token`, `chain`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`string`

___

### <a id="getl1bridgeaddress" name="getl1bridgeaddress"></a> getL1BridgeAddress

▸ **getL1BridgeAddress**(`token`, `chain`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`string`

___

### <a id="getl1bridgewrapperaddress" name="getl1bridgewrapperaddress"></a> getL1BridgeWrapperAddress

▸ **getL1BridgeWrapperAddress**(`token`, `sourceChain`, `destinationChain`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `sourceChain` | [`TChain`](../modules.md#tchain) |
| `destinationChain` | [`TChain`](../modules.md#tchain) |

#### Returns

`string`

___

### <a id="getl1canonicalbridgeaddress" name="getl1canonicalbridgeaddress"></a> getL1CanonicalBridgeAddress

▸ **getL1CanonicalBridgeAddress**(`token`, `chain`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`string`

___

### <a id="getl1canonicaltokenaddress" name="getl1canonicaltokenaddress"></a> getL1CanonicalTokenAddress

▸ **getL1CanonicalTokenAddress**(`token`, `chain`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`string`

___

### <a id="getl1poserc20predicateaddress" name="getl1poserc20predicateaddress"></a> getL1PosErc20PredicateAddress

▸ **getL1PosErc20PredicateAddress**(`token`, `chain`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`string`

___

### <a id="getl1posrootchainmanageraddress" name="getl1posrootchainmanageraddress"></a> getL1PosRootChainManagerAddress

▸ **getL1PosRootChainManagerAddress**(`token`, `chain`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`string`

___

### <a id="getl2ambbridgeaddress" name="getl2ambbridgeaddress"></a> getL2AmbBridgeAddress

▸ **getL2AmbBridgeAddress**(`token`, `chain`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`string`

___

### <a id="getl2ammwrapperaddress" name="getl2ammwrapperaddress"></a> getL2AmmWrapperAddress

▸ **getL2AmmWrapperAddress**(`token`, `chain`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`string`

___

### <a id="getl2bridgeaddress" name="getl2bridgeaddress"></a> getL2BridgeAddress

▸ **getL2BridgeAddress**(`token`, `chain`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`string`

___

### <a id="getl2canonicalbridgeaddress" name="getl2canonicalbridgeaddress"></a> getL2CanonicalBridgeAddress

▸ **getL2CanonicalBridgeAddress**(`token`, `chain`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`string`

___

### <a id="getl2canonicaltokenaddress" name="getl2canonicaltokenaddress"></a> getL2CanonicalTokenAddress

▸ **getL2CanonicalTokenAddress**(`token`, `chain`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`string`

___

### <a id="getl2hopbridgetokenaddress" name="getl2hopbridgetokenaddress"></a> getL2HopBridgeTokenAddress

▸ **getL2HopBridgeTokenAddress**(`token`, `chain`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`string`

___

### <a id="getl2saddlelptokenaddress" name="getl2saddlelptokenaddress"></a> getL2SaddleLpTokenAddress

▸ **getL2SaddleLpTokenAddress**(`token`, `chain`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`string`

___

### <a id="getl2saddleswapaddress" name="getl2saddleswapaddress"></a> getL2SaddleSwapAddress

▸ **getL2SaddleSwapAddress**(`token`, `chain`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`string`

___

### <a id="getproviderrpcurl" name="getproviderrpcurl"></a> getProviderRpcUrl

▸ **getProviderRpcUrl**(`provider`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `provider` | `any` |

#### Returns

`string`

___

### <a id="getrelayerfee" name="getrelayerfee"></a> getRelayerFee

▸ **getRelayerFee**(`destinationChain`, `tokenSymbol`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `destinationChain` | [`TChain`](../modules.md#tchain) |
| `tokenSymbol` | `string` |

#### Returns

`Promise`<`BigNumber`\>

___

### <a id="gets3configdata" name="gets3configdata"></a> getS3ConfigData

▸ **getS3ConfigData**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

___

### <a id="getsigneraddress" name="getsigneraddress"></a> getSignerAddress

▸ **getSignerAddress**(): `Promise`<`string`\>

**`Desc`**

Returns the connected signer address.

**`Example`**

```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
const address = await hop.getSignerAddress()
console.log(address)
```

#### Returns

`Promise`<`string`\>

Ethers signer address.

___

### <a id="getsignerorprovider" name="getsignerorprovider"></a> getSignerOrProvider

▸ **getSignerOrProvider**(`chain`, `signer?`): `Promise`<`Provider` \| `Signer`\>

**`Desc`**

Returns the connected signer if it's connected to the specified
chain id, otherwise it returns a regular provider for the specified chain.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) | Chain name or model |
| `signer` | [`TProvider`](../modules.md#tprovider) | Ethers signer or provider |

#### Returns

`Promise`<`Provider` \| `Signer`\>

Ethers signer or provider

___

### <a id="getsupportedassets" name="getsupportedassets"></a> getSupportedAssets

▸ **getSupportedAssets**(): `any`

#### Returns

`any`

___

### <a id="getsupportedassetsforchain" name="getsupportedassetsforchain"></a> getSupportedAssetsForChain

▸ **getSupportedAssetsForChain**(`chain`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`any`

___

### <a id="getsupportedchains" name="getsupportedchains"></a> getSupportedChains

▸ **getSupportedChains**(): `string`[]

#### Returns

`string`[]

___

### <a id="getsupportedtokens" name="getsupportedtokens"></a> getSupportedTokens

▸ **getSupportedTokens**(): `string`[]

#### Returns

`string`[]

___

### <a id="gettransferstatus" name="gettransferstatus"></a> getTransferStatus

▸ **getTransferStatus**(`transferIdOrTxHash`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transferIdOrTxHash` | `String` |

#### Returns

`Promise`<`any`\>

___

### <a id="getwaitconfirmations" name="getwaitconfirmations"></a> getWaitConfirmations

▸ **getWaitConfirmations**(`chain`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`number`

___

### <a id="isvalidchain" name="isvalidchain"></a> isValidChain

▸ **isValidChain**(`chain`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | `string` |

#### Returns

`boolean`

___

### <a id="isvalidnetwork" name="isvalidnetwork"></a> isValidNetwork

▸ **isValidNetwork**(`network`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `network` | `string` |

#### Returns

`boolean`

___

### <a id="resolvednslink" name="resolvednslink"></a> resolveDnslink

▸ **resolveDnslink**(`dnslinkDomain`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `dnslinkDomain` | `string` |

#### Returns

`Promise`<`string`\>

___

### <a id="sendtransaction" name="sendtransaction"></a> sendTransaction

▸ **sendTransaction**(`transactionRequest`, `chain`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionRequest` | `TransactionRequest` |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`Promise`<`any`\>

___

### <a id="setavailableliqudityjsonurl" name="setavailableliqudityjsonurl"></a> setAvailableLiqudityJsonUrl

▸ **setAvailableLiqudityJsonUrl**(`url`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |

#### Returns

`Promise`<`void`\>

___

### <a id="setbaseconfigurl" name="setbaseconfigurl"></a> setBaseConfigUrl

▸ **setBaseConfigUrl**(`url`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |

#### Returns

`Promise`<`void`\>

___

### <a id="setchainprovider" name="setchainprovider"></a> setChainProvider

▸ **setChainProvider**(`chain`, `provider`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) |
| `provider` | `Provider` |

#### Returns

`void`

___

### <a id="setchainproviderurls" name="setchainproviderurls"></a> setChainProviderUrls

▸ **setChainProviderUrls**(`chainProviders`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainProviders` | `Record`<`string`, `string`\> |

#### Returns

`void`

___

### <a id="setchainproviders" name="setchainproviders"></a> setChainProviders

▸ **setChainProviders**(`chainProviders`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainProviders` | `ChainProviders` |

#### Returns

`void`

___

### <a id="setconfigaddresses" name="setconfigaddresses"></a> setConfigAddresses

▸ **setConfigAddresses**(`addresses`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `addresses` | `Addresses` |

#### Returns

`void`

___

### <a id="setconfigfilefetchenabled" name="setconfigfilefetchenabled"></a> setConfigFileFetchEnabled

▸ **setConfigFileFetchEnabled**(`enabled`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `enabled` | `boolean` |

#### Returns

`void`

___

### <a id="setcoreconfigjsonurl" name="setcoreconfigjsonurl"></a> setCoreConfigJsonUrl

▸ **setCoreConfigJsonUrl**(`url`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |

#### Returns

`Promise`<`any`\>

___

### <a id="setgaspricemultiplier" name="setgaspricemultiplier"></a> setGasPriceMultiplier

▸ **setGasPriceMultiplier**(`gasPriceMultiplier`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `gasPriceMultiplier` | `number` |

#### Returns

`number`

___

### <a id="tochainmodel" name="tochainmodel"></a> toChainModel

▸ **toChainModel**(`chain`): [`Chain`](Chain.md)

**`Desc`**

Returns a Chain model instance with connected provider.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) | Chain name or model. |

#### Returns

[`Chain`](Chain.md)

Chain model with connected provider.

___

### <a id="totokenmodel" name="totokenmodel"></a> toTokenModel

▸ **toTokenModel**(`token`): [`TokenModel`](TokenModel.md)

**`Desc`**

Returns a Token instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) | Token name or model. |

#### Returns

[`TokenModel`](TokenModel.md)

Token model.

___

### <a id="txoverrides" name="txoverrides"></a> txOverrides

▸ **txOverrides**(`sourceChain`, `destinationChain?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sourceChain` | [`Chain`](Chain.md) |
| `destinationChain?` | [`Chain`](Chain.md) |

#### Returns

`Promise`<`any`\>
