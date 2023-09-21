# Class: Token

Class reprensenting ERC20 Token
 Token

## Hierarchy

- [`Base`](Base.md)

  ↳ **`Token`**

## Table of contents

### Constructors

- [constructor](Token.md#constructor)

### Properties

- [\_symbol](Token.md#_symbol)
- [address](Token.md#address)
- [addresses](Token.md#addresses)
- [baseConfigUrl](Token.md#baseconfigurl)
- [baseExplorerUrl](Token.md#baseexplorerurl)
- [blocklist](Token.md#blocklist)
- [bonders](Token.md#bonders)
- [chain](Token.md#chain)
- [chainProviders](Token.md#chainproviders)
- [chains](Token.md#chains)
- [configFileFetchEnabled](Token.md#configfilefetchenabled)
- [contract](Token.md#contract)
- [customAvailableLiquidityJsonUrl](Token.md#customavailableliquidityjsonurl)
- [customCoreConfigJsonUrl](Token.md#customcoreconfigjsonurl)
- [decimals](Token.md#decimals)
- [destinationFeeGasPriceMultiplier](Token.md#destinationfeegaspricemultiplier)
- [fees](Token.md#fees)
- [gasPriceMultiplier](Token.md#gaspricemultiplier)
- [getContract](Token.md#getcontract)
- [image](Token.md#image)
- [name](Token.md#name)
- [network](Token.md#network)
- [relayerFeeEnabled](Token.md#relayerfeeenabled)
- [signer](Token.md#signer)

### Accessors

- [availableLiqudityJsonUrl](Token.md#availableliqudityjsonurl)
- [chainId](Token.md#chainid)
- [configChains](Token.md#configchains)
- [coreConfigJsonUrl](Token.md#coreconfigjsonurl)
- [imageUrl](Token.md#imageurl)
- [isNativeToken](Token.md#isnativetoken)
- [nativeTokenSymbol](Token.md#nativetokensymbol)
- [supportedChains](Token.md#supportedchains)
- [supportedNetworks](Token.md#supportednetworks)
- [symbol](Token.md#symbol)

### Methods

- [\_getBonderAddress](Token.md#_getbonderaddress)
- [\_getMessengerWrapperAddress](Token.md#_getmessengerwrapperaddress)
- [allowance](Token.md#allowance)
- [approve](Token.md#approve)
- [balanceOf](Token.md#balanceof)
- [checkBlocklist](Token.md#checkblocklist)
- [connect](Token.md#connect)
- [eq](Token.md#eq)
- [estimateOptimismL1FeeFromData](Token.md#estimateoptimisml1feefromdata)
- [fetchBonderAvailableLiquidityData](Token.md#fetchbonderavailableliquiditydata)
- [fetchBonderAvailableLiquidityDataWithIpfsFallback](Token.md#fetchbonderavailableliquiditydatawithipfsfallback)
- [fetchConfigFromS3](Token.md#fetchconfigfroms3)
- [fetchCoreConfigData](Token.md#fetchcoreconfigdata)
- [fetchCoreConfigDataWithIpfsFallback](Token.md#fetchcoreconfigdatawithipfsfallback)
- [fetchIpfsBonderAvailableLiquidityData](Token.md#fetchipfsbonderavailableliquiditydata)
- [fetchIpfsCoreConfigData](Token.md#fetchipfscoreconfigdata)
- [geConfigChains](Token.md#geconfigchains)
- [getArbChainAddress](Token.md#getarbchainaddress)
- [getAvailableRoutes](Token.md#getavailableroutes)
- [getBumpedGasPrice](Token.md#getbumpedgasprice)
- [getChainId](Token.md#getchainid)
- [getChainProvider](Token.md#getchainprovider)
- [getChainProviderUrls](Token.md#getchainproviderurls)
- [getChainProviders](Token.md#getchainproviders)
- [getConfigAddresses](Token.md#getconfigaddresses)
- [getDestinationFeeGasPriceMultiplier](Token.md#getdestinationfeegaspricemultiplier)
- [getErc20](Token.md#geterc20)
- [getExplorerUrl](Token.md#getexplorerurl)
- [getExplorerUrlForAccount](Token.md#getexplorerurlforaccount)
- [getExplorerUrlForTransactionHash](Token.md#getexplorerurlfortransactionhash)
- [getExplorerUrlForTransferId](Token.md#getexplorerurlfortransferid)
- [getFeeBps](Token.md#getfeebps)
- [getImageUrl](Token.md#getimageurl)
- [getIpfsBaseConfigUrl](Token.md#getipfsbaseconfigurl)
- [getL1AmbBridgeAddress](Token.md#getl1ambbridgeaddress)
- [getL1BridgeAddress](Token.md#getl1bridgeaddress)
- [getL1BridgeWrapperAddress](Token.md#getl1bridgewrapperaddress)
- [getL1CanonicalBridgeAddress](Token.md#getl1canonicalbridgeaddress)
- [getL1CanonicalTokenAddress](Token.md#getl1canonicaltokenaddress)
- [getL1PosErc20PredicateAddress](Token.md#getl1poserc20predicateaddress)
- [getL1PosRootChainManagerAddress](Token.md#getl1posrootchainmanageraddress)
- [getL2AmbBridgeAddress](Token.md#getl2ambbridgeaddress)
- [getL2AmmWrapperAddress](Token.md#getl2ammwrapperaddress)
- [getL2BridgeAddress](Token.md#getl2bridgeaddress)
- [getL2CanonicalBridgeAddress](Token.md#getl2canonicalbridgeaddress)
- [getL2CanonicalTokenAddress](Token.md#getl2canonicaltokenaddress)
- [getL2HopBridgeTokenAddress](Token.md#getl2hopbridgetokenaddress)
- [getL2SaddleLpTokenAddress](Token.md#getl2saddlelptokenaddress)
- [getL2SaddleSwapAddress](Token.md#getl2saddleswapaddress)
- [getNativeTokenBalance](Token.md#getnativetokenbalance)
- [getProviderRpcUrl](Token.md#getproviderrpcurl)
- [getRelayerFee](Token.md#getrelayerfee)
- [getS3ConfigData](Token.md#gets3configdata)
- [getSignerAddress](Token.md#getsigneraddress)
- [getSignerOrProvider](Token.md#getsignerorprovider)
- [getSupportedAssets](Token.md#getsupportedassets)
- [getSupportedAssetsForChain](Token.md#getsupportedassetsforchain)
- [getSupportedChains](Token.md#getsupportedchains)
- [getSupportedTokens](Token.md#getsupportedtokens)
- [getTransferStatus](Token.md#gettransferstatus)
- [getWaitConfirmations](Token.md#getwaitconfirmations)
- [getWethContract](Token.md#getwethcontract)
- [getWrapTokenEstimatedGas](Token.md#getwraptokenestimatedgas)
- [getWrappedToken](Token.md#getwrappedtoken)
- [isValidChain](Token.md#isvalidchain)
- [isValidNetwork](Token.md#isvalidnetwork)
- [needsApproval](Token.md#needsapproval)
- [overrides](Token.md#overrides)
- [populateApproveTx](Token.md#populateapprovetx)
- [populateUnwrapTokenTx](Token.md#populateunwraptokentx)
- [populateWrapTokenTx](Token.md#populatewraptokentx)
- [resolveDnslink](Token.md#resolvednslink)
- [sendTransaction](Token.md#sendtransaction)
- [setAvailableLiqudityJsonUrl](Token.md#setavailableliqudityjsonurl)
- [setBaseConfigUrl](Token.md#setbaseconfigurl)
- [setChainProvider](Token.md#setchainprovider)
- [setChainProviderUrls](Token.md#setchainproviderurls)
- [setChainProviders](Token.md#setchainproviders)
- [setConfigAddresses](Token.md#setconfigaddresses)
- [setConfigFileFetchEnabled](Token.md#setconfigfilefetchenabled)
- [setCoreConfigJsonUrl](Token.md#setcoreconfigjsonurl)
- [setGasPriceMultiplier](Token.md#setgaspricemultiplier)
- [toChainModel](Token.md#tochainmodel)
- [toJSON](Token.md#tojson)
- [toTokenModel](Token.md#totokenmodel)
- [totalSupply](Token.md#totalsupply)
- [transfer](Token.md#transfer)
- [txOverrides](Token.md#txoverrides)
- [unwrapToken](Token.md#unwraptoken)
- [wrapToken](Token.md#wraptoken)
- [fromJSON](Token.md#fromjson)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new Token**(`networkOrOptionsObject`, `chain?`, `address?`, `decimals?`, `symbol?`, `name?`, `image?`, `signer?`, `chainProviders?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `networkOrOptionsObject` | `string` \| `TokenConstructorOptions` | L1 network name (e.g. 'mainnet', 'kovan', 'goerli') |
| `chain?` | [`TChain`](../modules.md#tchain) | Chain |
| `address?` | `string` | Token address. |
| `decimals?` | `number` | Token decimals. |
| `symbol?` | `string` | Token symbol. |
| `name?` | `string` | Token name. |
| `image?` | `string` | - |
| `signer?` | `Provider` \| `Signer` | Ethers signer. |
| `chainProviders?` | `ChainProviders` | - |

**`Desc`**

Instantiates Token class.

#### Overrides

[Base](Base.md).[constructor](Base.md#constructor)

## Properties

### <a id="_symbol" name="_symbol"></a> \_symbol

• **\_symbol**: `string`

___

### <a id="address" name="address"></a> address

• `Readonly` **address**: `string`

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

### <a id="chain" name="chain"></a> chain

• `Readonly` **chain**: [`Chain`](Chain.md)

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

### <a id="contract" name="contract"></a> contract

• `Readonly` **contract**: `Contract`

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

### <a id="decimals" name="decimals"></a> decimals

• `Readonly` **decimals**: `number`

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

### <a id="image" name="image"></a> image

• `Readonly` **image**: `string`

___

### <a id="name" name="name"></a> name

• `Readonly` **name**: `string`

___

### <a id="network" name="network"></a> network

• **network**: `string`

Network name

#### Inherited from

[Base](Base.md).[network](Base.md#network)

___

### <a id="relayerfeeenabled" name="relayerfeeenabled"></a> relayerFeeEnabled

• **relayerFeeEnabled**: `Record`<`string`, `boolean`\>

#### Inherited from

[Base](Base.md).[relayerFeeEnabled](Base.md#relayerfeeenabled)

___

### <a id="signer" name="signer"></a> signer

• **signer**: [`TProvider`](../modules.md#tprovider)

Ethers signer or provider

#### Inherited from

[Base](Base.md).[signer](Base.md#signer)

## Accessors

### <a id="availableliqudityjsonurl" name="availableliqudityjsonurl"></a> availableLiqudityJsonUrl

• `get` **availableLiqudityJsonUrl**(): `string`

#### Returns

`string`

#### Inherited from

Base.availableLiqudityJsonUrl

___

### <a id="chainid" name="chainid"></a> chainId

• `get` **chainId**(): `number`

#### Returns

`number`

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

### <a id="imageurl" name="imageurl"></a> imageUrl

• `get` **imageUrl**(): `string`

#### Returns

`string`

___

### <a id="isnativetoken" name="isnativetoken"></a> isNativeToken

• `get` **isNativeToken**(): `boolean`

#### Returns

`boolean`

___

### <a id="nativetokensymbol" name="nativetokensymbol"></a> nativeTokenSymbol

• `get` **nativeTokenSymbol**(): `string`

#### Returns

`string`

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

### <a id="symbol" name="symbol"></a> symbol

• `get` **symbol**(): `string`

#### Returns

`string`

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

### <a id="allowance" name="allowance"></a> allowance

▸ **allowance**(`spender`, `address?`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `spender` | `string` | spender address. |
| `address?` | `string` | - |

#### Returns

`Promise`<`BigNumber`\>

Ethers Transaction object.

**`Desc`**

Returns token allowance.

**`Example`**

```js
import { Hop, Chain } from '@hop-protocol/sdk'

const hop = new Hop('mainnet')
const bridge = hop.bridge('USDC')
const token = bridge.getCanonicalToken(Chain.Polygon)
const spender = await bridge.getSendApprovalAddress(Chain.Polygon)
const account = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
const allowance = await token.allowance(spender, account)
console.log(allowance)
```

___

### <a id="approve" name="approve"></a> approve

▸ **approve**(`spender`, `amount?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `spender` | `string` | `undefined` | spender address. |
| `amount` | `BigNumberish` | `ethers.constants.MaxUint256` | amount allowed to spend. |

#### Returns

`Promise`<`any`\>

Ethers Transaction object.

**`Desc`**

Approve address to spend tokens if not enough allowance .

**`Example`**

```js
import { Hop, Chain } from '@hop-protocol/sdk'

const bridge = hop.bridge('USDC').connect(signer)
const spender = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
const amount = '1000000000000000000'
const tx = await bridge.approve(Chain.Gnosis, spender, amount)
```

___

### <a id="balanceof" name="balanceof"></a> balanceOf

▸ **balanceOf**(`address?`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address?` | `string` | account address. |

#### Returns

`Promise`<`BigNumber`\>

Ethers Transaction object.

**`Desc`**

Returns token balance of signer.

**`Example`**

```js
import { Hop, Chain } from '@hop-protocol/sdk'

const bridge = hop.bridge('USDC').connect(signer)
const spender = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
const allowance = bridge.allowance(Chain.Gnosis, spender)
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

▸ **connect**(`signer`): [`Token`](Token.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Provider` \| `Signer` | Ethers `Signer` for signing transactions. |

#### Returns

[`Token`](Token.md)

New Token SDK instance with connected signer.

**`Desc`**

Returns a token instance with signer connected. Used for adding or changing signer.

___

### <a id="eq" name="eq"></a> eq

▸ **eq**(`token`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`Token`](Token.md) |

#### Returns

`boolean`

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

### <a id="getdestinationfeegaspricemultiplier" name="getdestinationfeegaspricemultiplier"></a> getDestinationFeeGasPriceMultiplier

▸ **getDestinationFeeGasPriceMultiplier**(): `number`

#### Returns

`number`

#### Inherited from

[Base](Base.md).[getDestinationFeeGasPriceMultiplier](Base.md#getdestinationfeegaspricemultiplier)

___

### <a id="geterc20" name="geterc20"></a> getErc20

▸ **getErc20**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

Ethers contract instance.

**`Desc`**

Returns a token Ethers contract instance.

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

### <a id="getimageurl" name="getimageurl"></a> getImageUrl

▸ **getImageUrl**(): `string`

#### Returns

`string`

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

#### Inherited from

[Base](Base.md).[getL1BridgeWrapperAddress](Base.md#getl1bridgewrapperaddress)

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

### <a id="getnativetokenbalance" name="getnativetokenbalance"></a> getNativeTokenBalance

▸ **getNativeTokenBalance**(`address?`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address?` | `string` |

#### Returns

`Promise`<`BigNumber`\>

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

### <a id="gettransferstatus" name="gettransferstatus"></a> getTransferStatus

▸ **getTransferStatus**(`transferIdOrTxHash`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transferIdOrTxHash` | `String` |

#### Returns

`Promise`<`any`\>

#### Inherited from

[Base](Base.md).[getTransferStatus](Base.md#gettransferstatus)

___

### <a id="getwaitconfirmations" name="getwaitconfirmations"></a> getWaitConfirmations

▸ **getWaitConfirmations**(`chain`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`number`

#### Inherited from

[Base](Base.md).[getWaitConfirmations](Base.md#getwaitconfirmations)

___

### <a id="getwethcontract" name="getwethcontract"></a> getWethContract

▸ **getWethContract**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

___

### <a id="getwraptokenestimatedgas" name="getwraptokenestimatedgas"></a> getWrapTokenEstimatedGas

▸ **getWrapTokenEstimatedGas**(`chain`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`Promise`<`any`\>

___

### <a id="getwrappedtoken" name="getwrappedtoken"></a> getWrappedToken

▸ **getWrappedToken**(): [`Token`](Token.md)

#### Returns

[`Token`](Token.md)

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

### <a id="needsapproval" name="needsapproval"></a> needsApproval

▸ **needsApproval**(`spender`, `amount`, `address?`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `spender` | `string` |
| `amount` | `BigNumberish` |
| `address?` | `string` |

#### Returns

`Promise`<`boolean`\>

___

### <a id="overrides" name="overrides"></a> overrides

▸ **overrides**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

___

### <a id="populateapprovetx" name="populateapprovetx"></a> populateApproveTx

▸ **populateApproveTx**(`spender`, `amount?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `spender` | `string` | `undefined` |
| `amount` | `BigNumberish` | `ethers.constants.MaxUint256` |

#### Returns

`Promise`<`any`\>

___

### <a id="populateunwraptokentx" name="populateunwraptokentx"></a> populateUnwrapTokenTx

▸ **populateUnwrapTokenTx**(`amount`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |

#### Returns

`Promise`<`any`\>

___

### <a id="populatewraptokentx" name="populatewraptokentx"></a> populateWrapTokenTx

▸ **populateWrapTokenTx**(`amount`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |

#### Returns

`Promise`<`any`\>

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

### <a id="tojson" name="tojson"></a> toJSON

▸ **toJSON**(): `any`

#### Returns

`any`

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

### <a id="totalsupply" name="totalsupply"></a> totalSupply

▸ **totalSupply**(): `Promise`<`BigNumber`\>

#### Returns

`Promise`<`BigNumber`\>

___

### <a id="transfer" name="transfer"></a> transfer

▸ **transfer**(`recipient`, `amount`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `recipient` | `string` | recipient address. |
| `amount` | `BigNumberish` | Token amount. |

#### Returns

`Promise`<`any`\>

Ethers Transaction object.

**`Desc`**

ERC20 token transfer

**`Example`**

```js
import { Hop } from '@hop-protocol/sdk'

const bridge = hop.bridge('USDC').connect(signer)
const recipient = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
const amount = '1000000000000000000'
const tx = await bridge.erc20Transfer(spender, amount)
```

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

#### Inherited from

[Base](Base.md).[txOverrides](Base.md#txoverrides)

___

### <a id="unwraptoken" name="unwraptoken"></a> unwrapToken

▸ **unwrapToken**(`amount`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |

#### Returns

`Promise`<`any`\>

___

### <a id="wraptoken" name="wraptoken"></a> wrapToken

▸ **wrapToken**(`amount`, `estimateGasOnly?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `amount` | `BigNumberish` | `undefined` |
| `estimateGasOnly` | `boolean` | `false` |

#### Returns

`Promise`<`any`\>

___

### <a id="fromjson" name="fromjson"></a> fromJSON

▸ `Static` **fromJSON**(`json`): [`Token`](Token.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | `any` |

#### Returns

[`Token`](Token.md)
