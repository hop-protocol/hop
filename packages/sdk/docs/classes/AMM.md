# Class: AMM

Class representing AMM contract
 AMM

## Hierarchy

- [`Base`](Base.md)

  ↳ **`AMM`**

## Table of contents

### Constructors

- [constructor](AMM.md#constructor)

### Properties

- [addresses](AMM.md#addresses)
- [baseConfigUrl](AMM.md#baseconfigurl)
- [baseExplorerUrl](AMM.md#baseexplorerurl)
- [blocklist](AMM.md#blocklist)
- [bonders](AMM.md#bonders)
- [bridgeDeprecated](AMM.md#bridgedeprecated)
- [calculateSwap](AMM.md#calculateswap)
- [chain](AMM.md#chain)
- [chainProviders](AMM.md#chainproviders)
- [chains](AMM.md#chains)
- [configFileFetchEnabled](AMM.md#configfilefetchenabled)
- [customAvailableLiquidityJsonUrl](AMM.md#customavailableliquidityjsonurl)
- [customCoreConfigJsonUrl](AMM.md#customcoreconfigjsonurl)
- [debugTimeLogsCache](AMM.md#debugtimelogscache)
- [debugTimeLogsCacheEnabled](AMM.md#debugtimelogscacheenabled)
- [debugTimeLogsEnabled](AMM.md#debugtimelogsenabled)
- [destinationFeeGasPriceMultiplier](AMM.md#destinationfeegaspricemultiplier)
- [fees](AMM.md#fees)
- [gasPriceMultiplier](AMM.md#gaspricemultiplier)
- [getContract](AMM.md#getcontract)
- [getGasPrice](AMM.md#getgasprice)
- [network](AMM.md#network)
- [relayerFeeEnabled](AMM.md#relayerfeeenabled)
- [relayerFeeWei](AMM.md#relayerfeewei)
- [signer](AMM.md#signer)
- [tokenSymbol](AMM.md#tokensymbol)

### Accessors

- [availableLiqudityJsonUrl](AMM.md#availableliqudityjsonurl)
- [configChains](AMM.md#configchains)
- [coreConfigJsonUrl](AMM.md#coreconfigjsonurl)
- [defaultDeadlineSeconds](AMM.md#defaultdeadlineseconds)
- [supportedChains](AMM.md#supportedchains)
- [supportedNetworks](AMM.md#supportednetworks)

### Methods

- [\_getBonderAddress](AMM.md#_getbonderaddress)
- [\_getMessengerWrapperAddress](AMM.md#_getmessengerwrapperaddress)
- [addLiquidity](AMM.md#addliquidity)
- [calcYield](AMM.md#calcyield)
- [calculateAddLiquidityMinimum](AMM.md#calculateaddliquidityminimum)
- [calculateAmountsForLpToken](AMM.md#calculateamountsforlptoken)
- [calculateFromHToken](AMM.md#calculatefromhtoken)
- [calculateRemoveLiquidityMinimum](AMM.md#calculateremoveliquidityminimum)
- [calculateRemoveLiquidityMinimumLpTokens](AMM.md#calculateremoveliquidityminimumlptokens)
- [calculateRemoveLiquidityOneToken](AMM.md#calculateremoveliquidityonetoken)
- [calculateToHToken](AMM.md#calculatetohtoken)
- [calculateTotalAmountForLpToken](AMM.md#calculatetotalamountforlptoken)
- [checkBlocklist](AMM.md#checkblocklist)
- [connect](AMM.md#connect)
- [debugTimeLog](AMM.md#debugtimelog)
- [estimateGas](AMM.md#estimategas)
- [estimateOptimismL1FeeFromData](AMM.md#estimateoptimisml1feefromdata)
- [fetchBonderAvailableLiquidityData](AMM.md#fetchbonderavailableliquiditydata)
- [fetchBonderAvailableLiquidityDataWithIpfsFallback](AMM.md#fetchbonderavailableliquiditydatawithipfsfallback)
- [fetchConfigFromS3](AMM.md#fetchconfigfroms3)
- [fetchCoreConfigData](AMM.md#fetchcoreconfigdata)
- [fetchCoreConfigDataWithIpfsFallback](AMM.md#fetchcoreconfigdatawithipfsfallback)
- [fetchIpfsBonderAvailableLiquidityData](AMM.md#fetchipfsbonderavailableliquiditydata)
- [fetchIpfsCoreConfigData](AMM.md#fetchipfscoreconfigdata)
- [geConfigChains](AMM.md#geconfigchains)
- [getApr](AMM.md#getapr)
- [getApy](AMM.md#getapy)
- [getArbChainAddress](AMM.md#getarbchainaddress)
- [getAvailableRoutes](AMM.md#getavailableroutes)
- [getBumpedGasPrice](AMM.md#getbumpedgasprice)
- [getCanonicalTokenAddress](AMM.md#getcanonicaltokenaddress)
- [getChainId](AMM.md#getchainid)
- [getChainProvider](AMM.md#getchainprovider)
- [getChainProviderUrls](AMM.md#getchainproviderurls)
- [getChainProviders](AMM.md#getchainproviders)
- [getConfigAddresses](AMM.md#getconfigaddresses)
- [getDailyVolume](AMM.md#getdailyvolume)
- [getDebugTimeLogs](AMM.md#getdebugtimelogs)
- [getDestinationFeeGasPriceMultiplier](AMM.md#getdestinationfeegaspricemultiplier)
- [getExplorerUrl](AMM.md#getexplorerurl)
- [getExplorerUrlForAccount](AMM.md#getexplorerurlforaccount)
- [getExplorerUrlForTransactionHash](AMM.md#getexplorerurlfortransactionhash)
- [getExplorerUrlForTransferId](AMM.md#getexplorerurlfortransferid)
- [getFeeBps](AMM.md#getfeebps)
- [getHopTokenAddress](AMM.md#gethoptokenaddress)
- [getIpfsBaseConfigUrl](AMM.md#getipfsbaseconfigurl)
- [getIsBridgeDeprecated](AMM.md#getisbridgedeprecated)
- [getL1AmbBridgeAddress](AMM.md#getl1ambbridgeaddress)
- [getL1BridgeAddress](AMM.md#getl1bridgeaddress)
- [getL1CanonicalBridgeAddress](AMM.md#getl1canonicalbridgeaddress)
- [getL1CanonicalTokenAddress](AMM.md#getl1canonicaltokenaddress)
- [getL1PosErc20PredicateAddress](AMM.md#getl1poserc20predicateaddress)
- [getL1PosRootChainManagerAddress](AMM.md#getl1posrootchainmanageraddress)
- [getL2AmbBridgeAddress](AMM.md#getl2ambbridgeaddress)
- [getL2AmmWrapperAddress](AMM.md#getl2ammwrapperaddress)
- [getL2BridgeAddress](AMM.md#getl2bridgeaddress)
- [getL2CanonicalBridgeAddress](AMM.md#getl2canonicalbridgeaddress)
- [getL2CanonicalTokenAddress](AMM.md#getl2canonicaltokenaddress)
- [getL2HopBridgeTokenAddress](AMM.md#getl2hopbridgetokenaddress)
- [getL2SaddleLpTokenAddress](AMM.md#getl2saddlelptokenaddress)
- [getL2SaddleSwapAddress](AMM.md#getl2saddleswapaddress)
- [getPriceImpact](AMM.md#getpriceimpact)
- [getProviderRpcUrl](AMM.md#getproviderrpcurl)
- [getRelayerFee](AMM.md#getrelayerfee)
- [getRemoveLiquidityPriceImpact](AMM.md#getremoveliquiditypriceimpact)
- [getReserves](AMM.md#getreserves)
- [getReservesTotal](AMM.md#getreservestotal)
- [getS3ConfigData](AMM.md#gets3configdata)
- [getSaddleSwap](AMM.md#getsaddleswap)
- [getSignerAddress](AMM.md#getsigneraddress)
- [getSignerOrProvider](AMM.md#getsignerorprovider)
- [getSupportedAssets](AMM.md#getsupportedassets)
- [getSupportedAssetsForChain](AMM.md#getsupportedassetsforchain)
- [getSupportedChains](AMM.md#getsupportedchains)
- [getSupportedTokens](AMM.md#getsupportedtokens)
- [getSwapFee](AMM.md#getswapfee)
- [getTokenBalancesForAccount](AMM.md#gettokenbalancesforaccount)
- [getTransferStatus](AMM.md#gettransferstatus)
- [getTransferTimes](AMM.md#gettransfertimes)
- [getVirtualPrice](AMM.md#getvirtualprice)
- [getYieldData](AMM.md#getyielddata)
- [getYieldStatsForDay](AMM.md#getyieldstatsforday)
- [isHighPriceImpact](AMM.md#ishighpriceimpact)
- [isValidChain](AMM.md#isvalidchain)
- [isValidNetwork](AMM.md#isvalidnetwork)
- [populateAddLiquidityTx](AMM.md#populateaddliquiditytx)
- [populateRemoveLiquidityTx](AMM.md#populateremoveliquiditytx)
- [removeLiquidity](AMM.md#removeliquidity)
- [removeLiquidityImbalance](AMM.md#removeliquidityimbalance)
- [removeLiquidityOneToken](AMM.md#removeliquidityonetoken)
- [resolveDnslink](AMM.md#resolvednslink)
- [sendTransaction](AMM.md#sendtransaction)
- [setAvailableLiqudityJsonUrl](AMM.md#setavailableliqudityjsonurl)
- [setBaseConfigUrl](AMM.md#setbaseconfigurl)
- [setChainProvider](AMM.md#setchainprovider)
- [setChainProviderUrls](AMM.md#setchainproviderurls)
- [setChainProviders](AMM.md#setchainproviders)
- [setConfigAddresses](AMM.md#setconfigaddresses)
- [setConfigFileFetchEnabled](AMM.md#setconfigfilefetchenabled)
- [setCoreConfigJsonUrl](AMM.md#setcoreconfigjsonurl)
- [setGasPriceMultiplier](AMM.md#setgaspricemultiplier)
- [toChainModel](AMM.md#tochainmodel)
- [toTokenModel](AMM.md#totokenmodel)
- [txOverrides](AMM.md#txoverrides)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new AMM**(`networkOrOptionsObject`, `tokenSymbol?`, `chain?`, `signer?`, `chainProviders?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `networkOrOptionsObject` | `string` \| `AmmConstructorOptions` | L1 network name (e.g. 'mainnet', 'goerli') |
| `tokenSymbol?` | `string` | Token model |
| `chain?` | [`TChain`](../modules.md#tchain) | Chain model |
| `signer?` | [`TProvider`](../modules.md#tprovider) | Ethers `Signer` for signing transactions. |
| `chainProviders?` | `ChainProviders` | - |

**`Desc`**

Instantiates AMM instance.
Returns a new Hop AMM SDK instance.

**`Returns`**

Hop AMM instance

**`Example`**

```js
import { AMM, Chain } from '@hop-protocol/sdk'

const amm = new AMM('mainnet', 'USDC', Chain.Gnosis)
```

#### Overrides

[Base](Base.md).[constructor](Base.md#constructor)

## Properties

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

### <a id="calculateswap" name="calculateswap"></a> calculateSwap

• **calculateSwap**: (...`args`: [fromIndex: TokenIndex, toIndex: TokenIndex, amount: BigNumberish]) => `Promise`<`any`\>

#### Type declaration

▸ (`...args`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [fromIndex: TokenIndex, toIndex: TokenIndex, amount: BigNumberish] |

##### Returns

`Promise`<`any`\>

___

### <a id="chain" name="chain"></a> chain

• **chain**: [`Chain`](Chain.md)

Chain model

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

### <a id="tokensymbol" name="tokensymbol"></a> tokenSymbol

• **tokenSymbol**: `string`

Token class instance

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

### <a id="defaultdeadlineseconds" name="defaultdeadlineseconds"></a> defaultDeadlineSeconds

• `get` **defaultDeadlineSeconds**(): `number`

#### Returns

`number`

Deadline in seconds

**`Desc`**

The default deadline to use in seconds.

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

### <a id="addliquidity" name="addliquidity"></a> addLiquidity

▸ **addLiquidity**(`amount0Desired`, `amount1Desired`, `minToMint?`, `deadline?`): `Promise`<`TransactionResponse`\>

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `amount0Desired` | `BigNumberish` | `undefined` | Amount of token #0 in smallest unit |
| `amount1Desired` | `BigNumberish` | `undefined` | Amount of token #1 in smallest unit |
| `minToMint` | `BigNumberish` | `0` | Minimum amount of LP token to mint in order for transaction to be successful. |
| `deadline` | `BigNumberish` | `undefined` | Order deadline in seconds |

#### Returns

`Promise`<`TransactionResponse`\>

Ethers transaction object.

**`Desc`**

Sends transaction to add liquidity to AMM.

**`Example`**

```js
import { AMM } from '@hop-protocol/sdk'

const amm = new AMM(...)
const tx = await amm.addLiquidity('1000000000000000000', '1000000000000000000', '0')
console.log(tx.hash)
```

___

### <a id="calcyield" name="calcyield"></a> calcYield

▸ **calcYield**(`feesEarned`, `principal`, `days`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `feesEarned` | `number` |
| `principal` | `number` |
| `days` | `number` |

#### Returns

`any`

___

### <a id="calculateaddliquidityminimum" name="calculateaddliquidityminimum"></a> calculateAddLiquidityMinimum

▸ **calculateAddLiquidityMinimum**(`amount0`, `amount1`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount0` | `BigNumberish` |
| `amount1` | `BigNumberish` |

#### Returns

`Promise`<`BigNumber`\>

___

### <a id="calculateamountsforlptoken" name="calculateamountsforlptoken"></a> calculateAmountsForLpToken

▸ **calculateAmountsForLpToken**(`lpTokenAmount`): `Promise`<`BigNumber`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `lpTokenAmount` | `BigNumberish` |

#### Returns

`Promise`<`BigNumber`[]\>

___

### <a id="calculatefromhtoken" name="calculatefromhtoken"></a> calculateFromHToken

▸ **calculateFromHToken**(`amount`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |

#### Returns

`Promise`<`BigNumber`\>

___

### <a id="calculateremoveliquidityminimum" name="calculateremoveliquidityminimum"></a> calculateRemoveLiquidityMinimum

▸ **calculateRemoveLiquidityMinimum**(`lpTokenAmount`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `lpTokenAmount` | `BigNumberish` |

#### Returns

`Promise`<`any`\>

___

### <a id="calculateremoveliquidityminimumlptokens" name="calculateremoveliquidityminimumlptokens"></a> calculateRemoveLiquidityMinimumLpTokens

▸ **calculateRemoveLiquidityMinimumLpTokens**(`amount0`, `amount1`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount0` | `BigNumberish` |
| `amount1` | `BigNumberish` |

#### Returns

`Promise`<`BigNumber`\>

___

### <a id="calculateremoveliquidityonetoken" name="calculateremoveliquidityonetoken"></a> calculateRemoveLiquidityOneToken

▸ **calculateRemoveLiquidityOneToken**(`tokenAmount`, `tokenIndex`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenAmount` | `BigNumberish` |
| `tokenIndex` | `number` |

#### Returns

`Promise`<`any`\>

___

### <a id="calculatetohtoken" name="calculatetohtoken"></a> calculateToHToken

▸ **calculateToHToken**(`amount`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |

#### Returns

`Promise`<`BigNumber`\>

___

### <a id="calculatetotalamountforlptoken" name="calculatetotalamountforlptoken"></a> calculateTotalAmountForLpToken

▸ **calculateTotalAmountForLpToken**(`lpTokenAmount`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `lpTokenAmount` | `BigNumberish` |

#### Returns

`Promise`<`BigNumber`\>

___

### <a id="checkblocklist" name="checkblocklist"></a> checkBlocklist

▸ **checkBlocklist**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

[Base](Base.md).[checkBlocklist](Base.md#checkblocklist)

___

### <a id="connect" name="connect"></a> connect

▸ **connect**(`signer`): [`AMM`](AMM.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | [`TProvider`](../modules.md#tprovider) | Ethers `Signer` for signing transactions. |

#### Returns

[`AMM`](AMM.md)

Hop AMM instance with connected signer.

**`Desc`**

Returns hop AMM instance with signer connected. Used for adding or changing signer.

**`Example`**

```js
import { AMM } from '@hop-protocol/sdk'

const signer = new Wallet(privateKey)
let amm = new AMM(...)
// ...
amm = amm.connect(signer)
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

### <a id="getapr" name="getapr"></a> getApr

▸ **getApr**(`days?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `days` | `number` | `1` |

#### Returns

`Promise`<`any`\>

___

### <a id="getapy" name="getapy"></a> getApy

▸ **getApy**(`days?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `days` | `number` | `1` |

#### Returns

`Promise`<`any`\>

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

### <a id="getcanonicaltokenaddress" name="getcanonicaltokenaddress"></a> getCanonicalTokenAddress

▸ **getCanonicalTokenAddress**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

address

**`Desc`**

Returns the address of the L2 canonical token.

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

### <a id="getdailyvolume" name="getdailyvolume"></a> getDailyVolume

▸ **getDailyVolume**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

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

### <a id="gethoptokenaddress" name="gethoptokenaddress"></a> getHopTokenAddress

▸ **getHopTokenAddress**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

address

**`Desc`**

Returns the address of the L2 hop token.

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

### <a id="getpriceimpact" name="getpriceimpact"></a> getPriceImpact

▸ **getPriceImpact**(`amount0`, `amount1`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount0` | `BigNumberish` |
| `amount1` | `BigNumberish` |

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

### <a id="getremoveliquiditypriceimpact" name="getremoveliquiditypriceimpact"></a> getRemoveLiquidityPriceImpact

▸ **getRemoveLiquidityPriceImpact**(`amount0`, `amount1`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount0` | `BigNumberish` |
| `amount1` | `BigNumberish` |

#### Returns

`Promise`<`BigNumber`\>

___

### <a id="getreserves" name="getreserves"></a> getReserves

▸ **getReserves**(): `Promise`<`BigNumber`[]\>

#### Returns

`Promise`<`BigNumber`[]\>

___

### <a id="getreservestotal" name="getreservestotal"></a> getReservesTotal

▸ **getReservesTotal**(): `Promise`<`BigNumber`\>

#### Returns

`Promise`<`BigNumber`\>

___

### <a id="gets3configdata" name="gets3configdata"></a> getS3ConfigData

▸ **getS3ConfigData**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Inherited from

[Base](Base.md).[getS3ConfigData](Base.md#gets3configdata)

___

### <a id="getsaddleswap" name="getsaddleswap"></a> getSaddleSwap

▸ **getSaddleSwap**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

Ethers contract instance.

**`Desc`**

Returns the Saddle swap contract instance for the specified chain.

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

### <a id="getswapfee" name="getswapfee"></a> getSwapFee

▸ **getSwapFee**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

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

### <a id="getvirtualprice" name="getvirtualprice"></a> getVirtualPrice

▸ **getVirtualPrice**(): `Promise`<`BigNumber`\>

#### Returns

`Promise`<`BigNumber`\>

___

### <a id="getyielddata" name="getyielddata"></a> getYieldData

▸ **getYieldData**(`days?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `days` | `number` | `1` |

#### Returns

`Promise`<`any`\>

___

### <a id="getyieldstatsforday" name="getyieldstatsforday"></a> getYieldStatsForDay

▸ **getYieldStatsForDay**(`unixTimestamp`, `days?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `unixTimestamp` | `number` | `undefined` |
| `days` | `number` | `1` |

#### Returns

`Promise`<`any`\>

___

### <a id="ishighpriceimpact" name="ishighpriceimpact"></a> isHighPriceImpact

▸ **isHighPriceImpact**(`priceImpact`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `priceImpact` | `BigNumber` |

#### Returns

`boolean`

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

### <a id="populateaddliquiditytx" name="populateaddliquiditytx"></a> populateAddLiquidityTx

▸ **populateAddLiquidityTx**(`amount0Desired`, `amount1Desired`, `minToMint?`, `deadline?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `amount0Desired` | `BigNumberish` | `undefined` |
| `amount1Desired` | `BigNumberish` | `undefined` |
| `minToMint` | `BigNumberish` | `0` |
| `deadline` | `BigNumberish` | `undefined` |

#### Returns

`Promise`<`any`\>

___

### <a id="populateremoveliquiditytx" name="populateremoveliquiditytx"></a> populateRemoveLiquidityTx

▸ **populateRemoveLiquidityTx**(`liquidityTokenAmount`, `amount0Min?`, `amount1Min?`, `deadline?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `liquidityTokenAmount` | `BigNumberish` | `undefined` |
| `amount0Min` | `BigNumberish` | `0` |
| `amount1Min` | `BigNumberish` | `0` |
| `deadline` | `BigNumberish` | `undefined` |

#### Returns

`Promise`<`any`\>

___

### <a id="removeliquidity" name="removeliquidity"></a> removeLiquidity

▸ **removeLiquidity**(`liquidityTokenAmount`, `amount0Min?`, `amount1Min?`, `deadline?`): `Promise`<`TransactionResponse`\>

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `liquidityTokenAmount` | `BigNumberish` | `undefined` | Amount of LP tokens to burn. |
| `amount0Min` | `BigNumberish` | `0` | Minimum amount of token #0 to receive in order for transaction to be successful. |
| `amount1Min` | `BigNumberish` | `0` | Minimum amount of token #1 to receive in order for transaction to be successful. transaction to be successful. |
| `deadline` | `BigNumberish` | `undefined` | Order deadline in seconds |

#### Returns

`Promise`<`TransactionResponse`\>

Ethers transaction object.

**`Desc`**

Sends transaction to remove liquidity from AMM.

**`Example`**

```js
import { AMM } from '@hop-protocol/sdk'

const amm = new AMM(...)
const tx = await amm.removeLiquidity('1000000000000000000', '0', '0')
console.log(tx.hash)
```

___

### <a id="removeliquidityimbalance" name="removeliquidityimbalance"></a> removeLiquidityImbalance

▸ **removeLiquidityImbalance**(`amount0`, `amount1`, `maxBurnAmount?`, `deadline?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount0` | `BigNumberish` |
| `amount1` | `BigNumberish` |
| `maxBurnAmount` | `BigNumberish` |
| `deadline` | `BigNumberish` |

#### Returns

`Promise`<`any`\>

___

### <a id="removeliquidityonetoken" name="removeliquidityonetoken"></a> removeLiquidityOneToken

▸ **removeLiquidityOneToken**(`lpAmount`, `tokenIndex`, `amountMin?`, `deadline?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `lpAmount` | `BigNumberish` |
| `tokenIndex` | `number` |
| `amountMin` | `BigNumberish` |
| `deadline` | `BigNumberish` |

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
