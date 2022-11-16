# Class: AMM

Class representing AMM contract

**`Namespace`**

AMM

## Hierarchy

- [`Base`](Base.md)

  ↳ **`AMM`**

## Table of contents

### Constructors

- [constructor](AMM.md#constructor)

### Properties

- [addresses](AMM.md#addresses)
- [baseExplorerUrl](AMM.md#baseexplorerurl)
- [bonders](AMM.md#bonders)
- [chain](AMM.md#chain)
- [chainProviders](AMM.md#chainproviders)
- [chains](AMM.md#chains)
- [destinationFeeGasPriceMultiplier](AMM.md#destinationfeegaspricemultiplier)
- [fees](AMM.md#fees)
- [gasPriceMultiplier](AMM.md#gaspricemultiplier)
- [getContract](AMM.md#getcontract)
- [network](AMM.md#network)
- [relayerFeeEnabled](AMM.md#relayerfeeenabled)
- [signer](AMM.md#signer)
- [tokenSymbol](AMM.md#tokensymbol)

### Accessors

- [configChains](AMM.md#configchains)
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
- [connect](AMM.md#connect)
- [estimateOptimismL1FeeFromData](AMM.md#estimateoptimisml1feefromdata)
- [fetchConfigFromS3](AMM.md#fetchconfigfroms3)
- [geConfigChains](AMM.md#geconfigchains)
- [getApr](AMM.md#getapr)
- [getApy](AMM.md#getapy)
- [getArbChainAddress](AMM.md#getarbchainaddress)
- [getBumpedGasPrice](AMM.md#getbumpedgasprice)
- [getCanonicalTokenAddress](AMM.md#getcanonicaltokenaddress)
- [getChainId](AMM.md#getchainid)
- [getChainProvider](AMM.md#getchainprovider)
- [getChainProviderUrls](AMM.md#getchainproviderurls)
- [getChainProviders](AMM.md#getchainproviders)
- [getConfigAddresses](AMM.md#getconfigaddresses)
- [getDailyVolume](AMM.md#getdailyvolume)
- [getDestinationFeeGasPriceMultiplier](AMM.md#getdestinationfeegaspricemultiplier)
- [getExplorerUrl](AMM.md#getexplorerurl)
- [getExplorerUrlForAccount](AMM.md#getexplorerurlforaccount)
- [getExplorerUrlForTransactionHash](AMM.md#getexplorerurlfortransactionhash)
- [getExplorerUrlForTransferId](AMM.md#getexplorerurlfortransferid)
- [getFeeBps](AMM.md#getfeebps)
- [getHopTokenAddress](AMM.md#gethoptokenaddress)
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
- [getSwapFee](AMM.md#getswapfee)
- [getTransferStatus](AMM.md#gettransferstatus)
- [getVirtualPrice](AMM.md#getvirtualprice)
- [getWaitConfirmations](AMM.md#getwaitconfirmations)
- [getYieldData](AMM.md#getyielddata)
- [getYieldStatsForDay](AMM.md#getyieldstatsforday)
- [init](AMM.md#init)
- [isHighPriceImpact](AMM.md#ishighpriceimpact)
- [isValidChain](AMM.md#isvalidchain)
- [isValidNetwork](AMM.md#isvalidnetwork)
- [populateAddLiquidityTx](AMM.md#populateaddliquiditytx)
- [populateRemoveLiquidityTx](AMM.md#populateremoveliquiditytx)
- [removeLiquidity](AMM.md#removeliquidity)
- [removeLiquidityImbalance](AMM.md#removeliquidityimbalance)
- [removeLiquidityOneToken](AMM.md#removeliquidityonetoken)
- [sendTransaction](AMM.md#sendtransaction)
- [setChainProvider](AMM.md#setchainprovider)
- [setChainProviderUrls](AMM.md#setchainproviderurls)
- [setChainProviders](AMM.md#setchainproviders)
- [setConfigAddresses](AMM.md#setconfigaddresses)
- [setGasPriceMultiplier](AMM.md#setgaspricemultiplier)
- [toChainModel](AMM.md#tochainmodel)
- [toTokenModel](AMM.md#totokenmodel)
- [txOverrides](AMM.md#txoverrides)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new AMM**(`network`, `tokenSymbol`, `chain?`, `signer?`, `chainProviders?`)

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

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `network` | `string` | L1 network name (e.g. 'mainnet', 'kovan', 'goerli') |
| `tokenSymbol` | `string` | - |
| `chain?` | [`TChain`](../modules.md#tchain) | Chain model |
| `signer?` | [`TProvider`](../modules.md#tprovider) | Ethers `Signer` for signing transactions. |
| `chainProviders?` | `ChainProviders` | - |

#### Overrides

[Base](Base.md).[constructor](Base.md#constructor)

## Properties

### <a id="addresses" name="addresses"></a> addresses

• **addresses**: `Record`<`string`, `any`\>

#### Inherited from

[Base](Base.md).[addresses](Base.md#addresses)

___

### <a id="baseexplorerurl" name="baseexplorerurl"></a> baseExplorerUrl

• **baseExplorerUrl**: `string` = `'https://explorer.hop.exchange'`

#### Inherited from

[Base](Base.md).[baseExplorerUrl](Base.md#baseexplorerurl)

___

### <a id="bonders" name="bonders"></a> bonders

• **bonders**: `Record`<`string`, `any`\>

#### Inherited from

[Base](Base.md).[bonders](Base.md#bonders)

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

___

### <a id="tokensymbol" name="tokensymbol"></a> tokenSymbol

• **tokenSymbol**: `string`

Token class instance

## Accessors

### <a id="configchains" name="configchains"></a> configChains

• `get` **configChains**(): `string`[]

#### Returns

`string`[]

#### Inherited from

Base.configChains

___

### <a id="defaultdeadlineseconds" name="defaultdeadlineseconds"></a> defaultDeadlineSeconds

• `get` **defaultDeadlineSeconds**(): `number`

**`Desc`**

The default deadline to use in seconds.

#### Returns

`number`

Deadline in seconds

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

**`Desc`**

Sends transaction to add liquidity to AMM.

**`Example`**

```js
import { AMM } from '@hop-protocol/sdk'

const amm = new AMM(...)
const tx = await amm.addLiquidity('1000000000000000000', '1000000000000000000', '0')
console.log(tx.hash)
```

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

___

### <a id="calcyield" name="calcyield"></a> calcYield

▸ **calcYield**(`feesEarned`, `principal`, `days`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `feesEarned` | `number` |
| `principal` | `number` |
| `days` | `number` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `apr` | `number` |
| `apy` | `number` |

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

▸ **calculateAmountsForLpToken**(`lpTokenAmount`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `lpTokenAmount` | `BigNumberish` |

#### Returns

`Promise`<`any`\>

___

### <a id="calculatefromhtoken" name="calculatefromhtoken"></a> calculateFromHToken

▸ **calculateFromHToken**(`amount`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |

#### Returns

`Promise`<`any`\>

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

▸ **calculateRemoveLiquidityMinimumLpTokens**(`amount0`, `amount1`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount0` | `BigNumberish` |
| `amount1` | `BigNumberish` |

#### Returns

`Promise`<`any`\>

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

▸ **calculateToHToken**(`amount`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |

#### Returns

`Promise`<`any`\>

___

### <a id="calculatetotalamountforlptoken" name="calculatetotalamountforlptoken"></a> calculateTotalAmountForLpToken

▸ **calculateTotalAmountForLpToken**(`lpTokenAmount`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `lpTokenAmount` | `BigNumberish` |

#### Returns

`Promise`<`any`\>

___

### <a id="connect" name="connect"></a> connect

▸ **connect**(`signer`): [`AMM`](AMM.md)

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

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | [`TProvider`](../modules.md#tprovider) | Ethers `Signer` for signing transactions. |

#### Returns

[`AMM`](AMM.md)

Hop AMM instance with connected signer.

___

### <a id="estimateoptimisml1feefromdata" name="estimateoptimisml1feefromdata"></a> estimateOptimismL1FeeFromData

▸ **estimateOptimismL1FeeFromData**(`gasLimit`, `data?`, `to?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `gasLimit` | `BigNumberish` | `undefined` |
| `data` | `string` | `'0x'` |
| `to` | `string` | `constants.AddressZero` |

#### Returns

`Promise`<`any`\>

#### Inherited from

[Base](Base.md).[estimateOptimismL1FeeFromData](Base.md#estimateoptimisml1feefromdata)

___

### <a id="fetchconfigfroms3" name="fetchconfigfroms3"></a> fetchConfigFromS3

▸ **fetchConfigFromS3**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Inherited from

[Base](Base.md).[fetchConfigFromS3](Base.md#fetchconfigfroms3)

___

### <a id="geconfigchains" name="geconfigchains"></a> geConfigChains

▸ **geConfigChains**(): `string`[]

#### Returns

`string`[]

#### Inherited from

[Base](Base.md).[geConfigChains](Base.md#geconfigchains)

___

### <a id="getapr" name="getapr"></a> getApr

▸ **getApr**(`days?`): `Promise`<`number`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `days` | `number` | `1` |

#### Returns

`Promise`<`number`\>

___

### <a id="getapy" name="getapy"></a> getApy

▸ **getApy**(`days?`): `Promise`<`number`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `days` | `number` | `1` |

#### Returns

`Promise`<`number`\>

___

### <a id="getarbchainaddress" name="getarbchainaddress"></a> getArbChainAddress

▸ **getArbChainAddress**(`token`, `chain`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`any`

#### Inherited from

[Base](Base.md).[getArbChainAddress](Base.md#getarbchainaddress)

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

| Name | Type |
| :------ | :------ |
| `signer` | [`TProvider`](../modules.md#tprovider) |
| `percent` | `number` |

#### Returns

`Promise`<`BigNumber`\>

Bumped as price as BigNumber

#### Inherited from

[Base](Base.md).[getBumpedGasPrice](Base.md#getbumpedgasprice)

___

### <a id="getcanonicaltokenaddress" name="getcanonicaltokenaddress"></a> getCanonicalTokenAddress

▸ **getCanonicalTokenAddress**(): `Promise`<`any`\>

**`Desc`**

Returns the address of the L2 canonical token.

#### Returns

`Promise`<`any`\>

address

___

### <a id="getchainid" name="getchainid"></a> getChainId

▸ **getChainId**(`chain`): `number`

**`Desc`**

Returns Chain ID for specified Chain model.

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`Chain`](Chain.md) |

#### Returns

`number`

- Chain ID.

#### Inherited from

[Base](Base.md).[getChainId](Base.md#getchainid)

___

### <a id="getchainprovider" name="getchainprovider"></a> getChainProvider

▸ **getChainProvider**(`chain`): `Provider`

**`Desc`**

Returns Ethers provider for specified Chain model.

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | `string` \| [`Chain`](Chain.md) |

#### Returns

`Provider`

- Ethers provider.

#### Inherited from

[Base](Base.md).[getChainProvider](Base.md#getchainprovider)

___

### <a id="getchainproviderurls" name="getchainproviderurls"></a> getChainProviderUrls

▸ **getChainProviderUrls**(): `Record`<`string`, `string`\>

#### Returns

`Record`<`string`, `string`\>

#### Inherited from

[Base](Base.md).[getChainProviderUrls](Base.md#getchainproviderurls)

___

### <a id="getchainproviders" name="getchainproviders"></a> getChainProviders

▸ **getChainProviders**(): `Record`<`string`, `Provider`\>

#### Returns

`Record`<`string`, `Provider`\>

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

▸ **getDailyVolume**(): `Promise`<{ `volume`: `any` ; `volumeFormatted`: `any`  }\>

#### Returns

`Promise`<{ `volume`: `any` ; `volumeFormatted`: `any`  }\>

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

▸ **getHopTokenAddress**(): `Promise`<`any`\>

**`Desc`**

Returns the address of the L2 hop token.

#### Returns

`Promise`<`any`\>

address

___

### <a id="getl1ambbridgeaddress" name="getl1ambbridgeaddress"></a> getL1AmbBridgeAddress

▸ **getL1AmbBridgeAddress**(`token`, `chain`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`any`

#### Inherited from

[Base](Base.md).[getL1AmbBridgeAddress](Base.md#getl1ambbridgeaddress)

___

### <a id="getl1bridgeaddress" name="getl1bridgeaddress"></a> getL1BridgeAddress

▸ **getL1BridgeAddress**(`token`, `chain`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`any`

#### Inherited from

[Base](Base.md).[getL1BridgeAddress](Base.md#getl1bridgeaddress)

___

### <a id="getl1canonicalbridgeaddress" name="getl1canonicalbridgeaddress"></a> getL1CanonicalBridgeAddress

▸ **getL1CanonicalBridgeAddress**(`token`, `chain`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`any`

#### Inherited from

[Base](Base.md).[getL1CanonicalBridgeAddress](Base.md#getl1canonicalbridgeaddress)

___

### <a id="getl1canonicaltokenaddress" name="getl1canonicaltokenaddress"></a> getL1CanonicalTokenAddress

▸ **getL1CanonicalTokenAddress**(`token`, `chain`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`any`

#### Inherited from

[Base](Base.md).[getL1CanonicalTokenAddress](Base.md#getl1canonicaltokenaddress)

___

### <a id="getl1poserc20predicateaddress" name="getl1poserc20predicateaddress"></a> getL1PosErc20PredicateAddress

▸ **getL1PosErc20PredicateAddress**(`token`, `chain`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`any`

#### Inherited from

[Base](Base.md).[getL1PosErc20PredicateAddress](Base.md#getl1poserc20predicateaddress)

___

### <a id="getl1posrootchainmanageraddress" name="getl1posrootchainmanageraddress"></a> getL1PosRootChainManagerAddress

▸ **getL1PosRootChainManagerAddress**(`token`, `chain`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`any`

#### Inherited from

[Base](Base.md).[getL1PosRootChainManagerAddress](Base.md#getl1posrootchainmanageraddress)

___

### <a id="getl2ambbridgeaddress" name="getl2ambbridgeaddress"></a> getL2AmbBridgeAddress

▸ **getL2AmbBridgeAddress**(`token`, `chain`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`any`

#### Inherited from

[Base](Base.md).[getL2AmbBridgeAddress](Base.md#getl2ambbridgeaddress)

___

### <a id="getl2ammwrapperaddress" name="getl2ammwrapperaddress"></a> getL2AmmWrapperAddress

▸ **getL2AmmWrapperAddress**(`token`, `chain`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`any`

#### Inherited from

[Base](Base.md).[getL2AmmWrapperAddress](Base.md#getl2ammwrapperaddress)

___

### <a id="getl2bridgeaddress" name="getl2bridgeaddress"></a> getL2BridgeAddress

▸ **getL2BridgeAddress**(`token`, `chain`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`any`

#### Inherited from

[Base](Base.md).[getL2BridgeAddress](Base.md#getl2bridgeaddress)

___

### <a id="getl2canonicalbridgeaddress" name="getl2canonicalbridgeaddress"></a> getL2CanonicalBridgeAddress

▸ **getL2CanonicalBridgeAddress**(`token`, `chain`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`any`

#### Inherited from

[Base](Base.md).[getL2CanonicalBridgeAddress](Base.md#getl2canonicalbridgeaddress)

___

### <a id="getl2canonicaltokenaddress" name="getl2canonicaltokenaddress"></a> getL2CanonicalTokenAddress

▸ **getL2CanonicalTokenAddress**(`token`, `chain`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`any`

#### Inherited from

[Base](Base.md).[getL2CanonicalTokenAddress](Base.md#getl2canonicaltokenaddress)

___

### <a id="getl2hopbridgetokenaddress" name="getl2hopbridgetokenaddress"></a> getL2HopBridgeTokenAddress

▸ **getL2HopBridgeTokenAddress**(`token`, `chain`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`any`

#### Inherited from

[Base](Base.md).[getL2HopBridgeTokenAddress](Base.md#getl2hopbridgetokenaddress)

___

### <a id="getl2saddlelptokenaddress" name="getl2saddlelptokenaddress"></a> getL2SaddleLpTokenAddress

▸ **getL2SaddleLpTokenAddress**(`token`, `chain`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`any`

#### Inherited from

[Base](Base.md).[getL2SaddleLpTokenAddress](Base.md#getl2saddlelptokenaddress)

___

### <a id="getl2saddleswapaddress" name="getl2saddleswapaddress"></a> getL2SaddleSwapAddress

▸ **getL2SaddleSwapAddress**(`token`, `chain`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`any`

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

▸ **getProviderRpcUrl**(`provider`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `provider` | `any` |

#### Returns

`any`

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

▸ **getReserves**(): `Promise`<[`any`, `any`]\>

#### Returns

`Promise`<[`any`, `any`]\>

___

### <a id="getreservestotal" name="getreservestotal"></a> getReservesTotal

▸ **getReservesTotal**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

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

**`Desc`**

Returns the Saddle swap contract instance for the specified chain.

#### Returns

`Promise`<`any`\>

Ethers contract instance.

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

#### Inherited from

[Base](Base.md).[getSignerAddress](Base.md#getsigneraddress)

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

### <a id="getswapfee" name="getswapfee"></a> getSwapFee

▸ **getSwapFee**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

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

### <a id="getvirtualprice" name="getvirtualprice"></a> getVirtualPrice

▸ **getVirtualPrice**(): `Promise`<`any`\>

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

#### Inherited from

[Base](Base.md).[getWaitConfirmations](Base.md#getwaitconfirmations)

___

### <a id="getyielddata" name="getyielddata"></a> getYieldData

▸ **getYieldData**(`days?`): `Promise`<{ `apr`: `number` ; `apy`: `number` ; `volume`: `any` = totalVolume; `volumeFormatted`: `any` = totalVolumeFormatted }\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `days` | `number` | `1` |

#### Returns

`Promise`<{ `apr`: `number` ; `apy`: `number` ; `volume`: `any` = totalVolume; `volumeFormatted`: `any` = totalVolumeFormatted }\>

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

### <a id="init" name="init"></a> init

▸ **init**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

[Base](Base.md).[init](Base.md#init)

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

**`Desc`**

Sends transaction to remove liquidity from AMM.

**`Example`**

```js
import { AMM } from '@hop-protocol/sdk'

const amm = new AMM(...)
const tx = await amm.removeLiquidity('1000000000000000000', '0', '0')
console.log(tx.hash)
```

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

### <a id="sendtransaction" name="sendtransaction"></a> sendTransaction

▸ **sendTransaction**(`transactionRequest`, `chain`): `Promise`<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionRequest` | `TransactionRequest` |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`Promise`<`TransactionResponse`\>

#### Inherited from

[Base](Base.md).[sendTransaction](Base.md#sendtransaction)

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

**`Desc`**

Returns a Chain model instance with connected provider.

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

[`Chain`](Chain.md)

- Chain model with connected provider.

#### Inherited from

[Base](Base.md).[toChainModel](Base.md#tochainmodel)

___

### <a id="totokenmodel" name="totokenmodel"></a> toTokenModel

▸ **toTokenModel**(`token`): [`TokenModel`](TokenModel.md)

**`Desc`**

Returns a Token instance.

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |

#### Returns

[`TokenModel`](TokenModel.md)

- Token model.

#### Inherited from

[Base](Base.md).[toTokenModel](Base.md#totokenmodel)

___

### <a id="txoverrides" name="txoverrides"></a> txOverrides

▸ **txOverrides**(`chain`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`Chain`](Chain.md) |

#### Returns

`Promise`<`any`\>

#### Inherited from

[Base](Base.md).[txOverrides](Base.md#txoverrides)
