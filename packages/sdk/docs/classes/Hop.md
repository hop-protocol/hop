# Class: Hop

Class reprensenting Hop
 Hop

## Hierarchy

- [`Base`](Base.md)

  ↳ **`Hop`**

## Table of contents

### Constructors

- [constructor](Hop.md#constructor)

### Properties

- [Chain](Hop.md#chain)
- [Event](Hop.md#event)
- [Token](Hop.md#token)
- [addresses](Hop.md#addresses)
- [baseConfigUrl](Hop.md#baseconfigurl)
- [baseExplorerUrl](Hop.md#baseexplorerurl)
- [blocklist](Hop.md#blocklist)
- [bonders](Hop.md#bonders)
- [bridgeDeprecated](Hop.md#bridgedeprecated)
- [chainProviders](Hop.md#chainproviders)
- [chains](Hop.md#chains)
- [configFileFetchEnabled](Hop.md#configfilefetchenabled)
- [customAvailableLiquidityJsonUrl](Hop.md#customavailableliquidityjsonurl)
- [customCoreConfigJsonUrl](Hop.md#customcoreconfigjsonurl)
- [debugTimeLogsCache](Hop.md#debugtimelogscache)
- [debugTimeLogsCacheEnabled](Hop.md#debugtimelogscacheenabled)
- [debugTimeLogsEnabled](Hop.md#debugtimelogsenabled)
- [destinationFeeGasPriceMultiplier](Hop.md#destinationfeegaspricemultiplier)
- [fees](Hop.md#fees)
- [gasPriceMultiplier](Hop.md#gaspricemultiplier)
- [getContract](Hop.md#getcontract)
- [getGasPrice](Hop.md#getgasprice)
- [network](Hop.md#network)
- [priceFeedApiKeys](Hop.md#pricefeedapikeys)
- [relayerFeeEnabled](Hop.md#relayerfeeenabled)
- [relayerFeeWei](Hop.md#relayerfeewei)
- [signer](Hop.md#signer)
- [Chain](Hop.md#chain-1)
- [Event](Hop.md#event-1)
- [Token](Hop.md#token-1)

### Accessors

- [availableLiqudityJsonUrl](Hop.md#availableliqudityjsonurl)
- [configChains](Hop.md#configchains)
- [coreConfigJsonUrl](Hop.md#coreconfigjsonurl)
- [supportedChains](Hop.md#supportedchains)
- [supportedNetworks](Hop.md#supportednetworks)
- [version](Hop.md#version)

### Methods

- [\_getBonderAddress](Hop.md#_getbonderaddress)
- [\_getMessengerWrapperAddress](Hop.md#_getmessengerwrapperaddress)
- [bridge](Hop.md#bridge)
- [checkBlocklist](Hop.md#checkblocklist)
- [connect](Hop.md#connect)
- [debugTimeLog](Hop.md#debugtimelog)
- [estimateGas](Hop.md#estimategas)
- [estimateOptimismL1FeeFromData](Hop.md#estimateoptimisml1feefromdata)
- [fetchBonderAvailableLiquidityData](Hop.md#fetchbonderavailableliquiditydata)
- [fetchBonderAvailableLiquidityDataWithIpfsFallback](Hop.md#fetchbonderavailableliquiditydatawithipfsfallback)
- [fetchConfigFromS3](Hop.md#fetchconfigfroms3)
- [fetchCoreConfigData](Hop.md#fetchcoreconfigdata)
- [fetchCoreConfigDataWithIpfsFallback](Hop.md#fetchcoreconfigdatawithipfsfallback)
- [fetchIpfsBonderAvailableLiquidityData](Hop.md#fetchipfsbonderavailableliquiditydata)
- [fetchIpfsCoreConfigData](Hop.md#fetchipfscoreconfigdata)
- [geConfigChains](Hop.md#geconfigchains)
- [getArbChainAddress](Hop.md#getarbchainaddress)
- [getAvailableRoutes](Hop.md#getavailableroutes)
- [getBumpedGasPrice](Hop.md#getbumpedgasprice)
- [getChainId](Hop.md#getchainid)
- [getChainProvider](Hop.md#getchainprovider)
- [getChainProviderUrls](Hop.md#getchainproviderurls)
- [getChainProviders](Hop.md#getchainproviders)
- [getConfigAddresses](Hop.md#getconfigaddresses)
- [getDebugTimeLogs](Hop.md#getdebugtimelogs)
- [getDestinationFeeGasPriceMultiplier](Hop.md#getdestinationfeegaspricemultiplier)
- [getExplorerUrl](Hop.md#getexplorerurl)
- [getExplorerUrlForAccount](Hop.md#getexplorerurlforaccount)
- [getExplorerUrlForTransactionHash](Hop.md#getexplorerurlfortransactionhash)
- [getExplorerUrlForTransferId](Hop.md#getexplorerurlfortransferid)
- [getFeeBps](Hop.md#getfeebps)
- [getIpfsBaseConfigUrl](Hop.md#getipfsbaseconfigurl)
- [getIsBridgeDeprecated](Hop.md#getisbridgedeprecated)
- [getL1AmbBridgeAddress](Hop.md#getl1ambbridgeaddress)
- [getL1BridgeAddress](Hop.md#getl1bridgeaddress)
- [getL1CanonicalBridgeAddress](Hop.md#getl1canonicalbridgeaddress)
- [getL1CanonicalTokenAddress](Hop.md#getl1canonicaltokenaddress)
- [getL1PosErc20PredicateAddress](Hop.md#getl1poserc20predicateaddress)
- [getL1PosRootChainManagerAddress](Hop.md#getl1posrootchainmanageraddress)
- [getL2AmbBridgeAddress](Hop.md#getl2ambbridgeaddress)
- [getL2AmmWrapperAddress](Hop.md#getl2ammwrapperaddress)
- [getL2BridgeAddress](Hop.md#getl2bridgeaddress)
- [getL2CanonicalBridgeAddress](Hop.md#getl2canonicalbridgeaddress)
- [getL2CanonicalTokenAddress](Hop.md#getl2canonicaltokenaddress)
- [getL2HopBridgeTokenAddress](Hop.md#getl2hopbridgetokenaddress)
- [getL2SaddleLpTokenAddress](Hop.md#getl2saddlelptokenaddress)
- [getL2SaddleSwapAddress](Hop.md#getl2saddleswapaddress)
- [getProviderRpcUrl](Hop.md#getproviderrpcurl)
- [getRelayerFee](Hop.md#getrelayerfee)
- [getS3ConfigData](Hop.md#gets3configdata)
- [getSignerAddress](Hop.md#getsigneraddress)
- [getSignerOrProvider](Hop.md#getsignerorprovider)
- [getSupportedAssets](Hop.md#getsupportedassets)
- [getSupportedAssetsForChain](Hop.md#getsupportedassetsforchain)
- [getSupportedChains](Hop.md#getsupportedchains)
- [getSupportedTokens](Hop.md#getsupportedtokens)
- [getTokenBalancesForAccount](Hop.md#gettokenbalancesforaccount)
- [getTransferStatus](Hop.md#gettransferstatus)
- [getTransferTimes](Hop.md#gettransfertimes)
- [isValidChain](Hop.md#isvalidchain)
- [isValidNetwork](Hop.md#isvalidnetwork)
- [resolveDnslink](Hop.md#resolvednslink)
- [sendTransaction](Hop.md#sendtransaction)
- [setAvailableLiqudityJsonUrl](Hop.md#setavailableliqudityjsonurl)
- [setBaseConfigUrl](Hop.md#setbaseconfigurl)
- [setChainProvider](Hop.md#setchainprovider)
- [setChainProviderUrls](Hop.md#setchainproviderurls)
- [setChainProviders](Hop.md#setchainproviders)
- [setConfigAddresses](Hop.md#setconfigaddresses)
- [setConfigFileFetchEnabled](Hop.md#setconfigfilefetchenabled)
- [setCoreConfigJsonUrl](Hop.md#setcoreconfigjsonurl)
- [setGasPriceMultiplier](Hop.md#setgaspricemultiplier)
- [setPriceFeedApiKeys](Hop.md#setpricefeedapikeys)
- [toChainModel](Hop.md#tochainmodel)
- [toTokenModel](Hop.md#totokenmodel)
- [txOverrides](Hop.md#txoverrides)
- [watch](Hop.md#watch)
- [watchBridge](Hop.md#watchbridge)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new Hop**(`networkOrOptionsObject`, `signer?`, `chainProviders?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `networkOrOptionsObject` | `string` \| `BaseConstructorOptions` | L1 network name (e.g. 'mainnet', 'goerli') |
| `signer?` | [`TProvider`](../modules.md#tprovider) | Ethers `Signer` for signing transactions. |
| `chainProviders?` | `ChainProviders` | - |

**`Desc`**

Instantiates Hop SDK.
Returns a new Hop SDK instance.

**`Example`**

```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop('mainnet')
```

**`Example`**

```js
import { Hop } from '@hop-protocol/sdk'
import { Wallet } from 'ethers'

const signer = new Wallet(privateKey)
const hop = new Hop('mainnet', signer)
```

#### Overrides

[Base](Base.md).[constructor](Base.md#constructor)

## Properties

### <a id="chain" name="chain"></a> Chain

• **Chain**: typeof [`Chain`](Chain.md) = `Chain`

Chain class

___

### <a id="event" name="event"></a> Event

• **Event**: typeof `Event` = `Event`

Event enum

___

### <a id="token" name="token"></a> Token

• **Token**: typeof [`TokenModel`](TokenModel.md) = `Token`

Token class

___

### <a id="addresses" name="addresses"></a> addresses

• **addresses**: `Record`<`string`, `any`\>

#### Inherited from

[Base](Base.md).[addresses](Base.md#addresses)

___

### <a id="baseconfigurl" name="baseconfigurl"></a> baseConfigUrl

• **baseConfigUrl**: `string` = `defaultBaseConfigUrl`

#### Inherited from

[Base](Base.md).[baseConfigUrl](Base.md#baseconfigurl)

___

### <a id="baseexplorerurl" name="baseexplorerurl"></a> baseExplorerUrl

• **baseExplorerUrl**: `string` = `'https://explorer.hop.exchange'`

#### Inherited from

[Base](Base.md).[baseExplorerUrl](Base.md#baseexplorerurl)

___

### <a id="blocklist" name="blocklist"></a> blocklist

• **blocklist**: `Record`<`string`, `boolean`\> = `null`

#### Inherited from

[Base](Base.md).[blocklist](Base.md#blocklist)

___

### <a id="bonders" name="bonders"></a> bonders

• **bonders**: `Record`<`string`, `any`\>

#### Inherited from

[Base](Base.md).[bonders](Base.md#bonders)

___

### <a id="bridgedeprecated" name="bridgedeprecated"></a> bridgeDeprecated

• **bridgeDeprecated**: `Record`<`string`, `boolean`\>

#### Inherited from

[Base](Base.md).[bridgeDeprecated](Base.md#bridgedeprecated)

___

### <a id="chainproviders" name="chainproviders"></a> chainProviders

• **chainProviders**: `ChainProviders` = `{}`

#### Inherited from

[Base](Base.md).[chainProviders](Base.md#chainproviders)

___

### <a id="chains" name="chains"></a> chains

• **chains**: `Record`<`string`, `any`\>

#### Inherited from

[Base](Base.md).[chains](Base.md#chains)

___

### <a id="configfilefetchenabled" name="configfilefetchenabled"></a> configFileFetchEnabled

• **configFileFetchEnabled**: `boolean` = `true`

#### Inherited from

[Base](Base.md).[configFileFetchEnabled](Base.md#configfilefetchenabled)

___

### <a id="customavailableliquidityjsonurl" name="customavailableliquidityjsonurl"></a> customAvailableLiquidityJsonUrl

• **customAvailableLiquidityJsonUrl**: `string` = `''`

#### Inherited from

[Base](Base.md).[customAvailableLiquidityJsonUrl](Base.md#customavailableliquidityjsonurl)

___

### <a id="customcoreconfigjsonurl" name="customcoreconfigjsonurl"></a> customCoreConfigJsonUrl

• **customCoreConfigJsonUrl**: `string` = `''`

#### Inherited from

[Base](Base.md).[customCoreConfigJsonUrl](Base.md#customcoreconfigjsonurl)

___

### <a id="debugtimelogscache" name="debugtimelogscache"></a> debugTimeLogsCache

• **debugTimeLogsCache**: `any`[] = `[]`

#### Inherited from

[Base](Base.md).[debugTimeLogsCache](Base.md#debugtimelogscache)

___

### <a id="debugtimelogscacheenabled" name="debugtimelogscacheenabled"></a> debugTimeLogsCacheEnabled

• **debugTimeLogsCacheEnabled**: `boolean` = `false`

#### Inherited from

[Base](Base.md).[debugTimeLogsCacheEnabled](Base.md#debugtimelogscacheenabled)

___

### <a id="debugtimelogsenabled" name="debugtimelogsenabled"></a> debugTimeLogsEnabled

• **debugTimeLogsEnabled**: `boolean` = `false`

#### Inherited from

[Base](Base.md).[debugTimeLogsEnabled](Base.md#debugtimelogsenabled)

___

### <a id="destinationfeegaspricemultiplier" name="destinationfeegaspricemultiplier"></a> destinationFeeGasPriceMultiplier

• **destinationFeeGasPriceMultiplier**: `number` = `1`

#### Inherited from

[Base](Base.md).[destinationFeeGasPriceMultiplier](Base.md#destinationfeegaspricemultiplier)

___

### <a id="fees" name="fees"></a> fees

• **fees**: `Object`

#### Index signature

▪ [token: `string`]: `Record`<`string`, `number`\>

#### Inherited from

[Base](Base.md).[fees](Base.md#fees)

___

### <a id="gaspricemultiplier" name="gaspricemultiplier"></a> gasPriceMultiplier

• **gasPriceMultiplier**: `number` = `0`

#### Inherited from

[Base](Base.md).[gasPriceMultiplier](Base.md#gaspricemultiplier)

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

#### Inherited from

[Base](Base.md).[getContract](Base.md#getcontract)

___

### <a id="getgasprice" name="getgasprice"></a> getGasPrice

• **getGasPrice**: (...`args`: [signerOrProvider: TProvider]) => `Promise`<`BigNumber`\>

#### Type declaration

▸ (`...args`): `Promise`<`BigNumber`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [signerOrProvider: TProvider] |

##### Returns

`Promise`<`BigNumber`\>

#### Inherited from

[Base](Base.md).[getGasPrice](Base.md#getgasprice)

___

### <a id="network" name="network"></a> network

• **network**: `string`

Network name

#### Inherited from

[Base](Base.md).[network](Base.md#network)

___

### <a id="pricefeedapikeys" name="pricefeedapikeys"></a> priceFeedApiKeys

• **priceFeedApiKeys**: `ApiKeys` = `null`

___

### <a id="relayerfeeenabled" name="relayerfeeenabled"></a> relayerFeeEnabled

• **relayerFeeEnabled**: `Record`<`string`, `boolean`\>

#### Inherited from

[Base](Base.md).[relayerFeeEnabled](Base.md#relayerfeeenabled)

___

### <a id="relayerfeewei" name="relayerfeewei"></a> relayerFeeWei

• **relayerFeeWei**: `Record`<`string`, `string`\>

#### Inherited from

[Base](Base.md).[relayerFeeWei](Base.md#relayerfeewei)

___

### <a id="signer" name="signer"></a> signer

• **signer**: [`TProvider`](../modules.md#tprovider)

Ethers signer or provider

#### Inherited from

[Base](Base.md).[signer](Base.md#signer)

___

### <a id="chain-1" name="chain-1"></a> Chain

▪ `Static` **Chain**: typeof [`Chain`](Chain.md) = `Chain`

Chain class

___

### <a id="event-1" name="event-1"></a> Event

▪ `Static` **Event**: typeof `Event` = `Event`

Event enum

___

### <a id="token-1" name="token-1"></a> Token

▪ `Static` **Token**: typeof [`TokenModel`](TokenModel.md) = `Token`

Token class

## Accessors

### <a id="availableliqudityjsonurl" name="availableliqudityjsonurl"></a> availableLiqudityJsonUrl

• `get` **availableLiqudityJsonUrl**(): `string`

#### Returns

`string`

#### Inherited from

Base.availableLiqudityJsonUrl

___

### <a id="configchains" name="configchains"></a> configChains

• `get` **configChains**(): `string`[]

#### Returns

`string`[]

#### Inherited from

Base.configChains

___

### <a id="coreconfigjsonurl" name="coreconfigjsonurl"></a> coreConfigJsonUrl

• `get` **coreConfigJsonUrl**(): `string`

#### Returns

`string`

#### Inherited from

Base.coreConfigJsonUrl

___

### <a id="supportedchains" name="supportedchains"></a> supportedChains

• `get` **supportedChains**(): `string`[]

#### Returns

`string`[]

#### Inherited from

Base.supportedChains

___

### <a id="supportednetworks" name="supportednetworks"></a> supportedNetworks

• `get` **supportedNetworks**(): `string`[]

#### Returns

`string`[]

#### Inherited from

Base.supportedNetworks

___

### <a id="version" name="version"></a> version

• `get` **version**(): `string`

#### Returns

`string`

version string

**`Desc`**

Returns the SDK version.

**`Example`**

```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
console.log(hop.version)
```

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

#### Inherited from

[Base](Base.md).[_getBonderAddress](Base.md#_getbonderaddress)

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

#### Inherited from

[Base](Base.md).[_getMessengerWrapperAddress](Base.md#_getmessengerwrapperaddress)

___

### <a id="bridge" name="bridge"></a> bridge

▸ **bridge**(`token`): [`HopBridge`](HopBridge.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) | Token model or symbol of token of bridge to use. |

#### Returns

[`HopBridge`](HopBridge.md)

A HopBridge instance.

**`Desc`**

Returns a bridge set instance.

**`Example`**

```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
const bridge = hop.bridge('USDC')
```

___

### <a id="checkblocklist" name="checkblocklist"></a> checkBlocklist

▸ **checkBlocklist**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

[Base](Base.md).[checkBlocklist](Base.md#checkblocklist)

___

### <a id="connect" name="connect"></a> connect

▸ **connect**(`signer`): [`Hop`](Hop.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | [`TProvider`](../modules.md#tprovider) | Ethers `Signer` for signing transactions. |

#### Returns

[`Hop`](Hop.md)

A new Hop SDK instance with connected Ethers Signer.

**`Desc`**

Returns hop instance with signer connected. Used for adding or changing signer.

**`Example`**

```js
import { Hop } from '@hop-protocol/sdk'
import { Wallet } from 'ethers'

const signer = new Wallet(privateKey)
let hop = new Hop()
// ...
hop = hop.connect(signer)
```

___

### <a id="debugtimelog" name="debugtimelog"></a> debugTimeLog

▸ **debugTimeLog**(`label`, `timeStart`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `label` | `string` |
| `timeStart` | `number` |

#### Returns

`void`

#### Inherited from

[Base](Base.md).[debugTimeLog](Base.md#debugtimelog)

___

### <a id="estimategas" name="estimategas"></a> estimateGas

▸ **estimateGas**(`signerOrProvider`, `tx`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `signerOrProvider` | [`TProvider`](../modules.md#tprovider) |
| `tx` | `any` |

#### Returns

`Promise`<`BigNumber`\>

#### Inherited from

[Base](Base.md).[estimateGas](Base.md#estimategas)

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

#### Inherited from

[Base](Base.md).[estimateOptimismL1FeeFromData](Base.md#estimateoptimisml1feefromdata)

___

### <a id="fetchbonderavailableliquiditydata" name="fetchbonderavailableliquiditydata"></a> fetchBonderAvailableLiquidityData

▸ **fetchBonderAvailableLiquidityData**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Inherited from

[Base](Base.md).[fetchBonderAvailableLiquidityData](Base.md#fetchbonderavailableliquiditydata)

___

### <a id="fetchbonderavailableliquiditydatawithipfsfallback" name="fetchbonderavailableliquiditydatawithipfsfallback"></a> fetchBonderAvailableLiquidityDataWithIpfsFallback

▸ **fetchBonderAvailableLiquidityDataWithIpfsFallback**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Inherited from

[Base](Base.md).[fetchBonderAvailableLiquidityDataWithIpfsFallback](Base.md#fetchbonderavailableliquiditydatawithipfsfallback)

___

### <a id="fetchconfigfroms3" name="fetchconfigfroms3"></a> fetchConfigFromS3

▸ **fetchConfigFromS3**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Inherited from

[Base](Base.md).[fetchConfigFromS3](Base.md#fetchconfigfroms3)

___

### <a id="fetchcoreconfigdata" name="fetchcoreconfigdata"></a> fetchCoreConfigData

▸ **fetchCoreConfigData**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Inherited from

[Base](Base.md).[fetchCoreConfigData](Base.md#fetchcoreconfigdata)

___

### <a id="fetchcoreconfigdatawithipfsfallback" name="fetchcoreconfigdatawithipfsfallback"></a> fetchCoreConfigDataWithIpfsFallback

▸ **fetchCoreConfigDataWithIpfsFallback**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Inherited from

[Base](Base.md).[fetchCoreConfigDataWithIpfsFallback](Base.md#fetchcoreconfigdatawithipfsfallback)

___

### <a id="fetchipfsbonderavailableliquiditydata" name="fetchipfsbonderavailableliquiditydata"></a> fetchIpfsBonderAvailableLiquidityData

▸ **fetchIpfsBonderAvailableLiquidityData**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Inherited from

[Base](Base.md).[fetchIpfsBonderAvailableLiquidityData](Base.md#fetchipfsbonderavailableliquiditydata)

___

### <a id="fetchipfscoreconfigdata" name="fetchipfscoreconfigdata"></a> fetchIpfsCoreConfigData

▸ **fetchIpfsCoreConfigData**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Inherited from

[Base](Base.md).[fetchIpfsCoreConfigData](Base.md#fetchipfscoreconfigdata)

___

### <a id="geconfigchains" name="geconfigchains"></a> geConfigChains

▸ **geConfigChains**(): `string`[]

#### Returns

`string`[]

#### Inherited from

[Base](Base.md).[geConfigChains](Base.md#geconfigchains)

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

#### Inherited from

[Base](Base.md).[getArbChainAddress](Base.md#getarbchainaddress)

___

### <a id="getavailableroutes" name="getavailableroutes"></a> getAvailableRoutes

▸ **getAvailableRoutes**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Inherited from

[Base](Base.md).[getAvailableRoutes](Base.md#getavailableroutes)

___

### <a id="getbumpedgasprice" name="getbumpedgasprice"></a> getBumpedGasPrice

▸ **getBumpedGasPrice**(`signer`, `percent`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | [`TProvider`](../modules.md#tprovider) | Ether's Signer |
| `percent` | `number` | Percentage to bump by. |

#### Returns

`Promise`<`BigNumber`\>

Bumped as price as BigNumber

**`Desc`**

Calculates current gas price plus increased percentage amount.

**`Example`**

```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
const bumpedGasPrice = await hop.getBumpedGasPrice(signer, 1.20)
console.log(bumpedGasPrice.toNumber())
```

#### Inherited from

[Base](Base.md).[getBumpedGasPrice](Base.md#getbumpedgasprice)

___

### <a id="getchainid" name="getchainid"></a> getChainId

▸ **getChainId**(`chain`): `number`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chain` | [`Chain`](Chain.md) | Chain model. |

#### Returns

`number`

- Chain ID.

**`Desc`**

Returns Chain ID for specified Chain model.

#### Inherited from

[Base](Base.md).[getChainId](Base.md#getchainid)

___

### <a id="getchainprovider" name="getchainprovider"></a> getChainProvider

▸ **getChainProvider**(`chain`): `any`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chain` | `string` \| [`Chain`](Chain.md) | Chain model. |

#### Returns

`any`

Ethers provider.

**`Desc`**

Returns Ethers provider for specified Chain model.

#### Inherited from

[Base](Base.md).[getChainProvider](Base.md#getchainprovider)

___

### <a id="getchainproviderurls" name="getchainproviderurls"></a> getChainProviderUrls

▸ **getChainProviderUrls**(): `any`

#### Returns

`any`

#### Inherited from

[Base](Base.md).[getChainProviderUrls](Base.md#getchainproviderurls)

___

### <a id="getchainproviders" name="getchainproviders"></a> getChainProviders

▸ **getChainProviders**(): `any`

#### Returns

`any`

#### Inherited from

[Base](Base.md).[getChainProviders](Base.md#getchainproviders)

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

#### Inherited from

[Base](Base.md).[getConfigAddresses](Base.md#getconfigaddresses)

___

### <a id="getdebugtimelogs" name="getdebugtimelogs"></a> getDebugTimeLogs

▸ **getDebugTimeLogs**(): `any`[]

#### Returns

`any`[]

#### Inherited from

[Base](Base.md).[getDebugTimeLogs](Base.md#getdebugtimelogs)

___

### <a id="getdestinationfeegaspricemultiplier" name="getdestinationfeegaspricemultiplier"></a> getDestinationFeeGasPriceMultiplier

▸ **getDestinationFeeGasPriceMultiplier**(): `number`

#### Returns

`number`

#### Inherited from

[Base](Base.md).[getDestinationFeeGasPriceMultiplier](Base.md#getdestinationfeegaspricemultiplier)

___

### <a id="getexplorerurl" name="getexplorerurl"></a> getExplorerUrl

▸ **getExplorerUrl**(): `string`

#### Returns

`string`

#### Inherited from

[Base](Base.md).[getExplorerUrl](Base.md#getexplorerurl)

___

### <a id="getexplorerurlforaccount" name="getexplorerurlforaccount"></a> getExplorerUrlForAccount

▸ **getExplorerUrlForAccount**(`accountAddress`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `accountAddress` | `string` |

#### Returns

`string`

#### Inherited from

[Base](Base.md).[getExplorerUrlForAccount](Base.md#getexplorerurlforaccount)

___

### <a id="getexplorerurlfortransactionhash" name="getexplorerurlfortransactionhash"></a> getExplorerUrlForTransactionHash

▸ **getExplorerUrlForTransactionHash**(`transactionHash`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionHash` | `string` |

#### Returns

`string`

#### Inherited from

[Base](Base.md).[getExplorerUrlForTransactionHash](Base.md#getexplorerurlfortransactionhash)

___

### <a id="getexplorerurlfortransferid" name="getexplorerurlfortransferid"></a> getExplorerUrlForTransferId

▸ **getExplorerUrlForTransferId**(`transferId`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `transferId` | `string` |

#### Returns

`string`

#### Inherited from

[Base](Base.md).[getExplorerUrlForTransferId](Base.md#getexplorerurlfortransferid)

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

#### Inherited from

[Base](Base.md).[getFeeBps](Base.md#getfeebps)

___

### <a id="getipfsbaseconfigurl" name="getipfsbaseconfigurl"></a> getIpfsBaseConfigUrl

▸ **getIpfsBaseConfigUrl**(`ipfsHash`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ipfsHash` | `string` |

#### Returns

`string`

#### Inherited from

[Base](Base.md).[getIpfsBaseConfigUrl](Base.md#getipfsbaseconfigurl)

___

### <a id="getisbridgedeprecated" name="getisbridgedeprecated"></a> getIsBridgeDeprecated

▸ **getIsBridgeDeprecated**(`token`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |

#### Returns

`Promise`<`boolean`\>

#### Inherited from

[Base](Base.md).[getIsBridgeDeprecated](Base.md#getisbridgedeprecated)

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

#### Inherited from

[Base](Base.md).[getL1AmbBridgeAddress](Base.md#getl1ambbridgeaddress)

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

#### Inherited from

[Base](Base.md).[getL1BridgeAddress](Base.md#getl1bridgeaddress)

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

#### Inherited from

[Base](Base.md).[getL1CanonicalBridgeAddress](Base.md#getl1canonicalbridgeaddress)

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

#### Inherited from

[Base](Base.md).[getL1CanonicalTokenAddress](Base.md#getl1canonicaltokenaddress)

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

#### Inherited from

[Base](Base.md).[getL1PosErc20PredicateAddress](Base.md#getl1poserc20predicateaddress)

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

#### Inherited from

[Base](Base.md).[getL1PosRootChainManagerAddress](Base.md#getl1posrootchainmanageraddress)

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

#### Inherited from

[Base](Base.md).[getL2AmbBridgeAddress](Base.md#getl2ambbridgeaddress)

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

#### Inherited from

[Base](Base.md).[getL2AmmWrapperAddress](Base.md#getl2ammwrapperaddress)

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

#### Inherited from

[Base](Base.md).[getL2BridgeAddress](Base.md#getl2bridgeaddress)

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

#### Inherited from

[Base](Base.md).[getL2CanonicalBridgeAddress](Base.md#getl2canonicalbridgeaddress)

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

#### Inherited from

[Base](Base.md).[getL2CanonicalTokenAddress](Base.md#getl2canonicaltokenaddress)

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

#### Inherited from

[Base](Base.md).[getL2HopBridgeTokenAddress](Base.md#getl2hopbridgetokenaddress)

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

#### Inherited from

[Base](Base.md).[getL2SaddleLpTokenAddress](Base.md#getl2saddlelptokenaddress)

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

#### Inherited from

[Base](Base.md).[getL2SaddleSwapAddress](Base.md#getl2saddleswapaddress)

___

### <a id="getproviderrpcurl" name="getproviderrpcurl"></a> getProviderRpcUrl

▸ **getProviderRpcUrl**(`provider`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `provider` | `any` |

#### Returns

`string`

#### Inherited from

[Base](Base.md).[getProviderRpcUrl](Base.md#getproviderrpcurl)

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

#### Inherited from

[Base](Base.md).[getRelayerFee](Base.md#getrelayerfee)

___

### <a id="gets3configdata" name="gets3configdata"></a> getS3ConfigData

▸ **getS3ConfigData**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Inherited from

[Base](Base.md).[getS3ConfigData](Base.md#gets3configdata)

___

### <a id="getsigneraddress" name="getsigneraddress"></a> getSignerAddress

▸ **getSignerAddress**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

Ethers signer address.

**`Desc`**

Returns the connected signer address.

**`Example`**

```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
const address = await hop.getSignerAddress()
console.log(address)
```

#### Inherited from

[Base](Base.md).[getSignerAddress](Base.md#getsigneraddress)

___

### <a id="getsignerorprovider" name="getsignerorprovider"></a> getSignerOrProvider

▸ **getSignerOrProvider**(`chain`, `signer?`): `Promise`<`Provider` \| `Signer`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) | Chain name or model |
| `signer` | [`TProvider`](../modules.md#tprovider) | Ethers signer or provider |

#### Returns

`Promise`<`Provider` \| `Signer`\>

Ethers signer or provider

**`Desc`**

Returns the connected signer if it's connected to the specified
chain id, otherwise it returns a regular provider for the specified chain.

#### Inherited from

[Base](Base.md).[getSignerOrProvider](Base.md#getsignerorprovider)

___

### <a id="getsupportedassets" name="getsupportedassets"></a> getSupportedAssets

▸ **getSupportedAssets**(): `any`

#### Returns

`any`

#### Inherited from

[Base](Base.md).[getSupportedAssets](Base.md#getsupportedassets)

___

### <a id="getsupportedassetsforchain" name="getsupportedassetsforchain"></a> getSupportedAssetsForChain

▸ **getSupportedAssetsForChain**(`chain`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`any`

#### Inherited from

[Base](Base.md).[getSupportedAssetsForChain](Base.md#getsupportedassetsforchain)

___

### <a id="getsupportedchains" name="getsupportedchains"></a> getSupportedChains

▸ **getSupportedChains**(): `string`[]

#### Returns

`string`[]

#### Inherited from

[Base](Base.md).[getSupportedChains](Base.md#getsupportedchains)

___

### <a id="getsupportedtokens" name="getsupportedtokens"></a> getSupportedTokens

▸ **getSupportedTokens**(): `string`[]

#### Returns

`string`[]

#### Inherited from

[Base](Base.md).[getSupportedTokens](Base.md#getsupportedtokens)

___

### <a id="gettokenbalancesforaccount" name="gettokenbalancesforaccount"></a> getTokenBalancesForAccount

▸ **getTokenBalancesForAccount**(`accountAddress`): `Promise`<`Balance`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `accountAddress` | `string` |

#### Returns

`Promise`<`Balance`[]\>

#### Inherited from

[Base](Base.md).[getTokenBalancesForAccount](Base.md#gettokenbalancesforaccount)

___

### <a id="gettransferstatus" name="gettransferstatus"></a> getTransferStatus

▸ **getTransferStatus**(`transferIdOrTxHash`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transferIdOrTxHash` | `string` |

#### Returns

`Promise`<`any`\>

#### Inherited from

[Base](Base.md).[getTransferStatus](Base.md#gettransferstatus)

___

### <a id="gettransfertimes" name="gettransfertimes"></a> getTransferTimes

▸ **getTransferTimes**(`sourceChainSlug`, `destinationChainSlug`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sourceChainSlug` | `string` |
| `destinationChainSlug` | `string` |

#### Returns

`Promise`<`any`\>

#### Inherited from

[Base](Base.md).[getTransferTimes](Base.md#gettransfertimes)

___

### <a id="isvalidchain" name="isvalidchain"></a> isValidChain

▸ **isValidChain**(`chain`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | `string` |

#### Returns

`boolean`

#### Inherited from

[Base](Base.md).[isValidChain](Base.md#isvalidchain)

___

### <a id="isvalidnetwork" name="isvalidnetwork"></a> isValidNetwork

▸ **isValidNetwork**(`network`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `network` | `string` |

#### Returns

`boolean`

#### Inherited from

[Base](Base.md).[isValidNetwork](Base.md#isvalidnetwork)

___

### <a id="resolvednslink" name="resolvednslink"></a> resolveDnslink

▸ **resolveDnslink**(`dnslinkDomain`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `dnslinkDomain` | `string` |

#### Returns

`Promise`<`string`\>

#### Inherited from

[Base](Base.md).[resolveDnslink](Base.md#resolvednslink)

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

#### Inherited from

[Base](Base.md).[sendTransaction](Base.md#sendtransaction)

___

### <a id="setavailableliqudityjsonurl" name="setavailableliqudityjsonurl"></a> setAvailableLiqudityJsonUrl

▸ **setAvailableLiqudityJsonUrl**(`url`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Base](Base.md).[setAvailableLiqudityJsonUrl](Base.md#setavailableliqudityjsonurl)

___

### <a id="setbaseconfigurl" name="setbaseconfigurl"></a> setBaseConfigUrl

▸ **setBaseConfigUrl**(`url`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Base](Base.md).[setBaseConfigUrl](Base.md#setbaseconfigurl)

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

#### Inherited from

[Base](Base.md).[setChainProvider](Base.md#setchainprovider)

___

### <a id="setchainproviderurls" name="setchainproviderurls"></a> setChainProviderUrls

▸ **setChainProviderUrls**(`chainProviders`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainProviders` | `Record`<`string`, `string`\> |

#### Returns

`void`

#### Inherited from

[Base](Base.md).[setChainProviderUrls](Base.md#setchainproviderurls)

___

### <a id="setchainproviders" name="setchainproviders"></a> setChainProviders

▸ **setChainProviders**(`chainProviders`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainProviders` | `ChainProviders` |

#### Returns

`void`

#### Inherited from

[Base](Base.md).[setChainProviders](Base.md#setchainproviders)

___

### <a id="setconfigaddresses" name="setconfigaddresses"></a> setConfigAddresses

▸ **setConfigAddresses**(`addresses`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `addresses` | `Addresses` |

#### Returns

`void`

#### Inherited from

[Base](Base.md).[setConfigAddresses](Base.md#setconfigaddresses)

___

### <a id="setconfigfilefetchenabled" name="setconfigfilefetchenabled"></a> setConfigFileFetchEnabled

▸ **setConfigFileFetchEnabled**(`enabled`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `enabled` | `boolean` |

#### Returns

`void`

#### Inherited from

[Base](Base.md).[setConfigFileFetchEnabled](Base.md#setconfigfilefetchenabled)

___

### <a id="setcoreconfigjsonurl" name="setcoreconfigjsonurl"></a> setCoreConfigJsonUrl

▸ **setCoreConfigJsonUrl**(`url`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |

#### Returns

`Promise`<`any`\>

#### Inherited from

[Base](Base.md).[setCoreConfigJsonUrl](Base.md#setcoreconfigjsonurl)

___

### <a id="setgaspricemultiplier" name="setgaspricemultiplier"></a> setGasPriceMultiplier

▸ **setGasPriceMultiplier**(`gasPriceMultiplier`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `gasPriceMultiplier` | `number` |

#### Returns

`number`

#### Inherited from

[Base](Base.md).[setGasPriceMultiplier](Base.md#setgaspricemultiplier)

___

### <a id="setpricefeedapikeys" name="setpricefeedapikeys"></a> setPriceFeedApiKeys

▸ **setPriceFeedApiKeys**(`apiKeys?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `apiKeys` | `ApiKeys` |

#### Returns

`void`

___

### <a id="tochainmodel" name="tochainmodel"></a> toChainModel

▸ **toChainModel**(`chain`): [`Chain`](Chain.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) | Chain name or model. |

#### Returns

[`Chain`](Chain.md)

Chain model with connected provider.

**`Desc`**

Returns a Chain model instance with connected provider.

#### Inherited from

[Base](Base.md).[toChainModel](Base.md#tochainmodel)

___

### <a id="totokenmodel" name="totokenmodel"></a> toTokenModel

▸ **toTokenModel**(`token`): [`TokenModel`](TokenModel.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) | Token name or model. |

#### Returns

[`TokenModel`](TokenModel.md)

Token model.

**`Desc`**

Returns a Token instance.

#### Inherited from

[Base](Base.md).[toTokenModel](Base.md#totokenmodel)

___

### <a id="txoverrides" name="txoverrides"></a> txOverrides

▸ **txOverrides**(`sourceChain`, `destinationChain?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sourceChain` | [`TChain`](../modules.md#tchain) |
| `destinationChain?` | [`TChain`](../modules.md#tchain) |

#### Returns

`Promise`<`any`\>

#### Inherited from

[Base](Base.md).[txOverrides](Base.md#txoverrides)

___

### <a id="watch" name="watch"></a> watch

▸ **watch**(`txHash`, `token`, `sourceChain`, `destinationChain`, `isCanonicalTransfer?`, `options?`): `any`

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `txHash` | `string` | `undefined` | Source transaction hash. |
| `token` | [`TToken`](../modules.md#ttoken) | `undefined` | Token name or model. |
| `sourceChain` | [`TChain`](../modules.md#tchain) | `undefined` | Source chain name or model. |
| `destinationChain` | [`TChain`](../modules.md#tchain) | `undefined` | Destination chain name or model. |
| `isCanonicalTransfer` | `boolean` | `false` | - |
| `options` | `WatchOptions` | `{}` | - |

#### Returns

`any`

**`Desc`**

Watches for Hop transaction events.

**`Example`**

```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
hop
  .watch(tx.hash, 'USDC', Chain.Ethereum, Chain.Gnosis)
  .on('receipt', ({receipt, chain}) => {
    console.log(chain.Name, receipt)
  })
```

___

### <a id="watchbridge" name="watchbridge"></a> watchBridge

▸ **watchBridge**(`txHash`, `token`, `sourceChain`, `destinationChain`, `options?`): `EventEmitter`<`string` \| `symbol`, `any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txHash` | `string` |
| `token` | [`TToken`](../modules.md#ttoken) |
| `sourceChain` | [`TChain`](../modules.md#tchain) |
| `destinationChain` | [`TChain`](../modules.md#tchain) |
| `options` | `WatchOptions` |

#### Returns

`EventEmitter`<`string` \| `symbol`, `any`\>
