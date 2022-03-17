<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Classes](#classes)
  - [Class: AMM](#class-amm)
    - [Hierarchy](#hierarchy)
    - [Table of contents](#table-of-contents)
    - [Constructors](#constructors)
    - [Properties](#properties)
    - [Accessors](#accessors)
    - [Methods](#methods)
  - [Class: CanonicalBridge](#class-canonicalbridge)
    - [Hierarchy](#hierarchy-1)
    - [Table of contents](#table-of-contents-1)
    - [Constructors](#constructors-1)
    - [Properties](#properties-1)
    - [Accessors](#accessors-1)
    - [Methods](#methods-1)
  - [Class: Chain](#class-chain)
    - [Table of contents](#table-of-contents-2)
    - [Constructors](#constructors-2)
    - [Properties](#properties-2)
    - [Accessors](#accessors-2)
    - [Methods](#methods-2)
  - [Class: Hop](#class-hop)
    - [Hierarchy](#hierarchy-2)
    - [Table of contents](#table-of-contents-3)
    - [Constructors](#constructors-3)
    - [Properties](#properties-3)
    - [Accessors](#accessors-3)
    - [Methods](#methods-3)
  - [Class: HopBridge](#class-hopbridge)
    - [Hierarchy](#hierarchy-3)
    - [Table of contents](#table-of-contents-4)
    - [Constructors](#constructors-4)
    - [Properties](#properties-4)
    - [Accessors](#accessors-4)
    - [Methods](#methods-4)
  - [Class: Route](#class-route)
    - [Table of contents](#table-of-contents-5)
    - [Constructors](#constructors-5)
    - [Properties](#properties-5)
  - [Class: Token](#class-token)
    - [Hierarchy](#hierarchy-4)
    - [Table of contents](#table-of-contents-6)
    - [Constructors](#constructors-6)
    - [Properties](#properties-6)
    - [Accessors](#accessors-5)
    - [Methods](#methods-5)
  - [Class: TokenAmount](#class-tokenamount)
    - [Table of contents](#table-of-contents-7)
    - [Constructors](#constructors-7)
    - [Properties](#properties-7)
  - [Class: TokenModel](#class-tokenmodel)
    - [Table of contents](#table-of-contents-8)
    - [Constructors](#constructors-8)
    - [Properties](#properties-8)
    - [Accessors](#accessors-6)
    - [Methods](#methods-6)
- [Enums](#enums)
  - [Enumeration: CanonicalToken](#enumeration-canonicaltoken)
    - [Table of contents](#table-of-contents-9)
    - [Enumeration members](#enumeration-members)
  - [Enumeration: ChainId](#enumeration-chainid)
    - [Table of contents](#table-of-contents-10)
    - [Enumeration members](#enumeration-members-1)
  - [Enumeration: ChainSlug](#enumeration-chainslug)
    - [Table of contents](#table-of-contents-11)
    - [Enumeration members](#enumeration-members-2)
  - [Enumeration: HToken](#enumeration-htoken)
    - [Table of contents](#table-of-contents-12)
    - [Enumeration members](#enumeration-members-3)
  - [Enumeration: NetworkSlug](#enumeration-networkslug)
    - [Table of contents](#table-of-contents-13)
    - [Enumeration members](#enumeration-members-4)
  - [Enumeration: Slug](#enumeration-slug)
    - [Table of contents](#table-of-contents-14)
    - [Enumeration members](#enumeration-members-5)
  - [Enumeration: WrappedToken](#enumeration-wrappedtoken)
    - [Table of contents](#table-of-contents-15)
    - [Enumeration members](#enumeration-members-6)
- [@hop-protocol/sdk](#hop-protocolsdk)
  - [Table of contents](#table-of-contents-16)
    - [Namespaces](#namespaces)
    - [Enumerations](#enumerations)
    - [Classes](#classes-1)
    - [Type aliases](#type-aliases)
  - [Type aliases](#type-aliases-1)
    - [<a id="tamount" name="tamount"></a> TAmount](#a-idtamount-nametamounta-tamount)
    - [<a id="tchain" name="tchain"></a> TChain](#a-idtchain-nametchaina-tchain)
    - [<a id="tprovider" name="tprovider"></a> TProvider](#a-idtprovider-nametprovidera-tprovider)
    - [<a id="ttime" name="ttime"></a> TTime](#a-idttime-namettimea-ttime)
    - [<a id="ttimeslot" name="ttimeslot"></a> TTimeSlot](#a-idttimeslot-namettimeslota-ttimeslot)
    - [<a id="ttoken" name="ttoken"></a> TToken](#a-idttoken-namettokena-ttoken)
    - [<a id="tokensymbol" name="tokensymbol"></a> TokenSymbol](#a-idtokensymbol-nametokensymbola-tokensymbol)
- [Modules](#modules)
  - [Namespace: eventTopics](#namespace-eventtopics)
    - [Table of contents](#table-of-contents-17)
    - [Variables](#variables)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


<a name="readmemd"></a>


# Classes


<a name="classesammmd"></a>

## Class: AMM

Class reprensenting AMM contract

**`namespace`** AMM

### Hierarchy

- `Base`

  ↳ **`AMM`**

### Table of contents

#### Constructors

- [constructor](#constructor)

#### Properties

- [chain](#chain)
- [chainProviders](#chainproviders)
- [destinationFeeGasPriceMultiplier](#destinationfeegaspricemultiplier)
- [fees](#fees)
- [gasPriceMultiplier](#gaspricemultiplier)
- [getContract](#getcontract)
- [network](#network)
- [signer](#signer)
- [tokenSymbol](#tokensymbol)

#### Accessors

- [defaultDeadlineSeconds](#defaultdeadlineseconds)
- [supportedChains](#supportedchains)
- [supportedNetworks](#supportednetworks)

#### Methods

- [\_getBonderAddress](#_getbonderaddress)
- [addLiquidity](#addliquidity)
- [calculateAddLiquidityMinimum](#calculateaddliquidityminimum)
- [calculateAmountsForLpToken](#calculateamountsforlptoken)
- [calculateFromHToken](#calculatefromhtoken)
- [calculateRemoveLiquidityMinimum](#calculateremoveliquidityminimum)
- [calculateRemoveLiquidityMinimumLpTokens](#calculateremoveliquidityminimumlptokens)
- [calculateRemoveLiquidityOneToken](#calculateremoveliquidityonetoken)
- [calculateToHToken](#calculatetohtoken)
- [calculateTotalAmountForLpToken](#calculatetotalamountforlptoken)
- [connect](#connect)
- [estimateOptimismL1FeeFromData](#estimateoptimisml1feefromdata)
- [getApr](#getapr)
- [getArbChainAddress](#getarbchainaddress)
- [getBumpedGasPrice](#getbumpedgasprice)
- [getCanonicalTokenAddress](#getcanonicaltokenaddress)
- [getChainId](#getchainid)
- [getChainProvider](#getchainprovider)
- [getChainProviderUrls](#getchainproviderurls)
- [getChainProviders](#getchainproviders)
- [getConfigAddresses](#getconfigaddresses)
- [getFeeBps](#getfeebps)
- [getHopTokenAddress](#gethoptokenaddress)
- [getL1AmbBridgeAddress](#getl1ambbridgeaddress)
- [getL1BridgeAddress](#getl1bridgeaddress)
- [getL1CanonicalBridgeAddress](#getl1canonicalbridgeaddress)
- [getL1CanonicalTokenAddress](#getl1canonicaltokenaddress)
- [getL1PosErc20PredicateAddress](#getl1poserc20predicateaddress)
- [getL1PosRootChainManagerAddress](#getl1posrootchainmanageraddress)
- [getL2AmbBridgeAddress](#getl2ambbridgeaddress)
- [getL2AmmWrapperAddress](#getl2ammwrapperaddress)
- [getL2BridgeAddress](#getl2bridgeaddress)
- [getL2CanonicalBridgeAddress](#getl2canonicalbridgeaddress)
- [getL2CanonicalTokenAddress](#getl2canonicaltokenaddress)
- [getL2HopBridgeTokenAddress](#getl2hopbridgetokenaddress)
- [getL2SaddleLpTokenAddress](#getl2saddlelptokenaddress)
- [getL2SaddleSwapAddress](#getl2saddleswapaddress)
- [getPriceImpact](#getpriceimpact)
- [getRemoveLiquidityPriceImpact](#getremoveliquiditypriceimpact)
- [getReserves](#getreserves)
- [getReservesTotal](#getreservestotal)
- [getS3ConfigData](#gets3configdata)
- [getSaddleSwap](#getsaddleswap)
- [getSignerAddress](#getsigneraddress)
- [getSignerOrProvider](#getsignerorprovider)
- [getSupportedAssets](#getsupportedassets)
- [getSupportedAssetsForChain](#getsupportedassetsforchain)
- [getSwapFee](#getswapfee)
- [getVirtualPrice](#getvirtualprice)
- [init](#init)
- [isHighPriceImpact](#ishighpriceimpact)
- [isValidChain](#isvalidchain)
- [isValidNetwork](#isvalidnetwork)
- [populateAddLiquidityTx](#populateaddliquiditytx)
- [populateRemoveLiquidityTx](#populateremoveliquiditytx)
- [removeLiquidity](#removeliquidity)
- [removeLiquidityImbalance](#removeliquidityimbalance)
- [removeLiquidityOneToken](#removeliquidityonetoken)
- [setChainProvider](#setchainprovider)
- [setChainProviderUrls](#setchainproviderurls)
- [setChainProviders](#setchainproviders)
- [setConfigAddresses](#setconfigaddresses)
- [setGasPriceMultiplier](#setgaspricemultiplier)
- [toChainModel](#tochainmodel)
- [toTokenModel](#totokenmodel)
- [txOverrides](#txoverrides)

### Constructors

#### <a id="constructor" name="constructor"></a> constructor

• **new AMM**(`network`, `tokenSymbol`, `chain?`, `signer?`, `chainProviders?`)

**`desc`** Instantiates AMM instance.
Returns a new Hop AMM SDK instance.

**`example`**
```js
import { AMM, Chain } from '@hop-protocol/sdk'

const amm = new AMM('mainnet', 'USDC', Chain.Gnosis)
```

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `network` | `string` | L1 network name (e.g. 'mainnet', 'kovan', 'goerli') |
| `tokenSymbol` | `string` | - |
| `chain?` | [`TChain`](#tchain) | Chain model |
| `signer?` | [`TProvider`](#tprovider) | Ethers `Signer` for signing transactions. |
| `chainProviders?` | `ChainProviders` | - |

##### Overrides

Base.constructor

### Properties

#### <a id="chain" name="chain"></a> chain

• **chain**: [`Chain`](#classeschainmd)

Chain model

___

#### <a id="chainproviders" name="chainproviders"></a> chainProviders

• **chainProviders**: `ChainProviders` = `{}`

##### Inherited from

Base.chainProviders

___

#### <a id="destinationfeegaspricemultiplier" name="destinationfeegaspricemultiplier"></a> destinationFeeGasPriceMultiplier

• **destinationFeeGasPriceMultiplier**: `number` = `1`

##### Inherited from

Base.destinationFeeGasPriceMultiplier

___

#### <a id="fees" name="fees"></a> fees

• **fees**: `Object`

##### Index signature

▪ [token: `string`]: `Record`<`string`, `number`\>

##### Inherited from

Base.fees

___

#### <a id="gaspricemultiplier" name="gaspricemultiplier"></a> gasPriceMultiplier

• **gasPriceMultiplier**: `number` = `0`

##### Inherited from

Base.gasPriceMultiplier

___

#### <a id="getcontract" name="getcontract"></a> getContract

• **getContract**: (`factory`: `Factory`, `address`: `string`, `provider`: [`TProvider`](#tprovider)) => `Promise`<`any`\> = `getContract`

##### Type declaration

▸ (`factory`, `address`, `provider`): `Promise`<`any`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `factory` | `Factory` |
| `address` | `string` |
| `provider` | [`TProvider`](#tprovider) |

###### Returns

`Promise`<`any`\>

##### Inherited from

Base.getContract

___

#### <a id="network" name="network"></a> network

• **network**: `string`

Network name

##### Inherited from

Base.network

___

#### <a id="signer" name="signer"></a> signer

• **signer**: [`TProvider`](#tprovider)

Ethers signer or provider

##### Inherited from

Base.signer

___

#### <a id="tokensymbol" name="tokensymbol"></a> tokenSymbol

• **tokenSymbol**: `string`

Token class instance

### Accessors

#### <a id="defaultdeadlineseconds" name="defaultdeadlineseconds"></a> defaultDeadlineSeconds

• `get` **defaultDeadlineSeconds**(): `number`

**`readonly`**

**`desc`** The default deadline to use in seconds.

##### Returns

`number`

Deadline in seconds

___

#### <a id="supportedchains" name="supportedchains"></a> supportedChains

• `get` **supportedChains**(): `string`[]

##### Returns

`string`[]

##### Inherited from

Base.supportedChains

___

#### <a id="supportednetworks" name="supportednetworks"></a> supportedNetworks

• `get` **supportedNetworks**(): `string`[]

##### Returns

`string`[]

##### Inherited from

Base.supportedNetworks

### Methods

#### <a id="_getbonderaddress" name="_getbonderaddress"></a> \_getBonderAddress

▸ `Protected` **_getBonderAddress**(`token`, `sourceChain`, `destinationChain`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `sourceChain` | [`TChain`](#tchain) |
| `destinationChain` | [`TChain`](#tchain) |

##### Returns

`string`

##### Inherited from

Base.\_getBonderAddress

___

#### <a id="addliquidity" name="addliquidity"></a> addLiquidity

▸ **addLiquidity**(`amount0Desired`, `amount1Desired`, `minToMint?`, `deadline?`): `Promise`<`TransactionResponse`\>

**`desc`** Sends transaction to add liquidity to AMM.

**`example`**
```js
import { AMM } from '@hop-protocol/sdk'

const amm = new AMM(...)
const tx = await amm.addLiquidity('1000000000000000000', '1000000000000000000', '0')
console.log(tx.hash)
```

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `amount0Desired` | `BigNumberish` | `undefined` | Amount of token #0 in smallest unit |
| `amount1Desired` | `BigNumberish` | `undefined` | Amount of token #1 in smallest unit |
| `minToMint` | `BigNumberish` | `0` | Minimum amount of LP token to mint in order for transaction to be successful. |
| `deadline` | `BigNumberish` | `undefined` | Order deadline in seconds |

##### Returns

`Promise`<`TransactionResponse`\>

Ethers transaction object.

___

#### <a id="calculateaddliquidityminimum" name="calculateaddliquidityminimum"></a> calculateAddLiquidityMinimum

▸ **calculateAddLiquidityMinimum**(`amount0`, `amount1`): `Promise`<`BigNumber`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `amount0` | `BigNumberish` |
| `amount1` | `BigNumberish` |

##### Returns

`Promise`<`BigNumber`\>

___

#### <a id="calculateamountsforlptoken" name="calculateamountsforlptoken"></a> calculateAmountsForLpToken

▸ **calculateAmountsForLpToken**(`lpTokenAmount`): `Promise`<`BigNumber`[]\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `lpTokenAmount` | `BigNumberish` |

##### Returns

`Promise`<`BigNumber`[]\>

___

#### <a id="calculatefromhtoken" name="calculatefromhtoken"></a> calculateFromHToken

▸ **calculateFromHToken**(`amount`): `Promise`<`BigNumber`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |

##### Returns

`Promise`<`BigNumber`\>

___

#### <a id="calculateremoveliquidityminimum" name="calculateremoveliquidityminimum"></a> calculateRemoveLiquidityMinimum

▸ **calculateRemoveLiquidityMinimum**(`lpTokenAmount`): `Promise`<`BigNumber`[]\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `lpTokenAmount` | `BigNumberish` |

##### Returns

`Promise`<`BigNumber`[]\>

___

#### <a id="calculateremoveliquidityminimumlptokens" name="calculateremoveliquidityminimumlptokens"></a> calculateRemoveLiquidityMinimumLpTokens

▸ **calculateRemoveLiquidityMinimumLpTokens**(`amount0`, `amount1`): `Promise`<`BigNumber`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `amount0` | `BigNumberish` |
| `amount1` | `BigNumberish` |

##### Returns

`Promise`<`BigNumber`\>

___

#### <a id="calculateremoveliquidityonetoken" name="calculateremoveliquidityonetoken"></a> calculateRemoveLiquidityOneToken

▸ **calculateRemoveLiquidityOneToken**(`tokenAmount`, `tokenIndex`): `Promise`<`BigNumber`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `tokenAmount` | `BigNumberish` |
| `tokenIndex` | `number` |

##### Returns

`Promise`<`BigNumber`\>

___

#### <a id="calculatetohtoken" name="calculatetohtoken"></a> calculateToHToken

▸ **calculateToHToken**(`amount`): `Promise`<`BigNumber`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |

##### Returns

`Promise`<`BigNumber`\>

___

#### <a id="calculatetotalamountforlptoken" name="calculatetotalamountforlptoken"></a> calculateTotalAmountForLpToken

▸ **calculateTotalAmountForLpToken**(`lpTokenAmount`): `Promise`<`BigNumber`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `lpTokenAmount` | `BigNumberish` |

##### Returns

`Promise`<`BigNumber`\>

___

#### <a id="connect" name="connect"></a> connect

▸ **connect**(`signer`): [`AMM`](#classesammmd)

**`desc`** Returns hop AMM instance with signer connected. Used for adding or changing signer.

**`example`**
```js
import { AMM } from '@hop-protocol/sdk'

const signer = new Wallet(privateKey)
let amm = new AMM(...)
// ...
amm = amm.connect(signer)
```

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | [`TProvider`](#tprovider) | Ethers `Signer` for signing transactions. |

##### Returns

[`AMM`](#classesammmd)

Hop AMM instance with connected signer.

___

#### <a id="estimateoptimisml1feefromdata" name="estimateoptimisml1feefromdata"></a> estimateOptimismL1FeeFromData

▸ **estimateOptimismL1FeeFromData**(`gasLimit`, `data?`, `to?`): `Promise`<`any`\>

##### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `gasLimit` | `BigNumberish` | `undefined` |
| `data` | `string` | `'0x'` |
| `to` | `string` | `constants.AddressZero` |

##### Returns

`Promise`<`any`\>

##### Inherited from

Base.estimateOptimismL1FeeFromData

___

#### <a id="getapr" name="getapr"></a> getApr

▸ **getApr**(): `Promise`<`number`\>

##### Returns

`Promise`<`number`\>

___

#### <a id="getarbchainaddress" name="getarbchainaddress"></a> getArbChainAddress

▸ **getArbChainAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getArbChainAddress

___

#### <a id="getbumpedgasprice" name="getbumpedgasprice"></a> getBumpedGasPrice

▸ **getBumpedGasPrice**(`signer`, `percent`): `Promise`<`BigNumber`\>

**`desc`** Calculates current gas price plus increased percentage amount.

**`example`**
```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
const bumpedGasPrice = await hop.getBumpedGasPrice(signer, 1.20)
console.log(bumpedGasPrice.toNumber())
```

##### Parameters

| Name | Type |
| :------ | :------ |
| `signer` | [`TProvider`](#tprovider) |
| `percent` | `number` |

##### Returns

`Promise`<`BigNumber`\>

Bumped as price as BigNumber

##### Inherited from

Base.getBumpedGasPrice

___

#### <a id="getcanonicaltokenaddress" name="getcanonicaltokenaddress"></a> getCanonicalTokenAddress

▸ **getCanonicalTokenAddress**(): `Promise`<`any`\>

**`desc`** Returns the address of the L2 canonical token.

##### Returns

`Promise`<`any`\>

address

___

#### <a id="getchainid" name="getchainid"></a> getChainId

▸ **getChainId**(`chain`): `number`

**`desc`** Returns Chain ID for specified Chain model.

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`Chain`](#classeschainmd) |

##### Returns

`number`

- Chain ID.

##### Inherited from

Base.getChainId

___

#### <a id="getchainprovider" name="getchainprovider"></a> getChainProvider

▸ **getChainProvider**(`chain`): `Provider`

**`desc`** Returns Ethers provider for specified Chain model.

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | `string` \| [`Chain`](#classeschainmd) |

##### Returns

`Provider`

- Ethers provider.

##### Inherited from

Base.getChainProvider

___

#### <a id="getchainproviderurls" name="getchainproviderurls"></a> getChainProviderUrls

▸ **getChainProviderUrls**(): `Record`<`string`, `string`\>

##### Returns

`Record`<`string`, `string`\>

##### Inherited from

Base.getChainProviderUrls

___

#### <a id="getchainproviders" name="getchainproviders"></a> getChainProviders

▸ **getChainProviders**(): `Record`<`string`, `Provider`\>

##### Returns

`Record`<`string`, `Provider`\>

##### Inherited from

Base.getChainProviders

___

#### <a id="getconfigaddresses" name="getconfigaddresses"></a> getConfigAddresses

▸ **getConfigAddresses**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getConfigAddresses

___

#### <a id="getfeebps" name="getfeebps"></a> getFeeBps

▸ **getFeeBps**(`token`, `destinationChain`): `number`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `destinationChain` | [`TChain`](#tchain) |

##### Returns

`number`

##### Inherited from

Base.getFeeBps

___

#### <a id="gethoptokenaddress" name="gethoptokenaddress"></a> getHopTokenAddress

▸ **getHopTokenAddress**(): `Promise`<`any`\>

**`desc`** Returns the address of the L2 hop token.

##### Returns

`Promise`<`any`\>

address

___

#### <a id="getl1ambbridgeaddress" name="getl1ambbridgeaddress"></a> getL1AmbBridgeAddress

▸ **getL1AmbBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1AmbBridgeAddress

___

#### <a id="getl1bridgeaddress" name="getl1bridgeaddress"></a> getL1BridgeAddress

▸ **getL1BridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1BridgeAddress

___

#### <a id="getl1canonicalbridgeaddress" name="getl1canonicalbridgeaddress"></a> getL1CanonicalBridgeAddress

▸ **getL1CanonicalBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1CanonicalBridgeAddress

___

#### <a id="getl1canonicaltokenaddress" name="getl1canonicaltokenaddress"></a> getL1CanonicalTokenAddress

▸ **getL1CanonicalTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1CanonicalTokenAddress

___

#### <a id="getl1poserc20predicateaddress" name="getl1poserc20predicateaddress"></a> getL1PosErc20PredicateAddress

▸ **getL1PosErc20PredicateAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1PosErc20PredicateAddress

___

#### <a id="getl1posrootchainmanageraddress" name="getl1posrootchainmanageraddress"></a> getL1PosRootChainManagerAddress

▸ **getL1PosRootChainManagerAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1PosRootChainManagerAddress

___

#### <a id="getl2ambbridgeaddress" name="getl2ambbridgeaddress"></a> getL2AmbBridgeAddress

▸ **getL2AmbBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2AmbBridgeAddress

___

#### <a id="getl2ammwrapperaddress" name="getl2ammwrapperaddress"></a> getL2AmmWrapperAddress

▸ **getL2AmmWrapperAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2AmmWrapperAddress

___

#### <a id="getl2bridgeaddress" name="getl2bridgeaddress"></a> getL2BridgeAddress

▸ **getL2BridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2BridgeAddress

___

#### <a id="getl2canonicalbridgeaddress" name="getl2canonicalbridgeaddress"></a> getL2CanonicalBridgeAddress

▸ **getL2CanonicalBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2CanonicalBridgeAddress

___

#### <a id="getl2canonicaltokenaddress" name="getl2canonicaltokenaddress"></a> getL2CanonicalTokenAddress

▸ **getL2CanonicalTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2CanonicalTokenAddress

___

#### <a id="getl2hopbridgetokenaddress" name="getl2hopbridgetokenaddress"></a> getL2HopBridgeTokenAddress

▸ **getL2HopBridgeTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2HopBridgeTokenAddress

___

#### <a id="getl2saddlelptokenaddress" name="getl2saddlelptokenaddress"></a> getL2SaddleLpTokenAddress

▸ **getL2SaddleLpTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2SaddleLpTokenAddress

___

#### <a id="getl2saddleswapaddress" name="getl2saddleswapaddress"></a> getL2SaddleSwapAddress

▸ **getL2SaddleSwapAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2SaddleSwapAddress

___

#### <a id="getpriceimpact" name="getpriceimpact"></a> getPriceImpact

▸ **getPriceImpact**(`amount0`, `amount1`): `Promise`<`BigNumber`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `amount0` | `BigNumberish` |
| `amount1` | `BigNumberish` |

##### Returns

`Promise`<`BigNumber`\>

___

#### <a id="getremoveliquiditypriceimpact" name="getremoveliquiditypriceimpact"></a> getRemoveLiquidityPriceImpact

▸ **getRemoveLiquidityPriceImpact**(`amount0`, `amount1`): `Promise`<`BigNumber`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `amount0` | `BigNumberish` |
| `amount1` | `BigNumberish` |

##### Returns

`Promise`<`BigNumber`\>

___

#### <a id="getreserves" name="getreserves"></a> getReserves

▸ **getReserves**(): `Promise`<[`BigNumber`, `BigNumber`]\>

##### Returns

`Promise`<[`BigNumber`, `BigNumber`]\>

___

#### <a id="getreservestotal" name="getreservestotal"></a> getReservesTotal

▸ **getReservesTotal**(): `Promise`<`BigNumber`\>

##### Returns

`Promise`<`BigNumber`\>

___

#### <a id="gets3configdata" name="gets3configdata"></a> getS3ConfigData

▸ **getS3ConfigData**(): `Promise`<`any`\>

##### Returns

`Promise`<`any`\>

##### Inherited from

Base.getS3ConfigData

___

#### <a id="getsaddleswap" name="getsaddleswap"></a> getSaddleSwap

▸ **getSaddleSwap**(): `Promise`<`Swap`\>

**`desc`** Returns the Saddle swap contract instance for the specified chain.

##### Returns

`Promise`<`Swap`\>

Ethers contract instance.

___

#### <a id="getsigneraddress" name="getsigneraddress"></a> getSignerAddress

▸ **getSignerAddress**(): `Promise`<`string`\>

**`desc`** Returns the connected signer address.

**`example`**
```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
const address = await hop.getSignerAddress()
console.log(address)
```

##### Returns

`Promise`<`string`\>

Ethers signer address.

##### Inherited from

Base.getSignerAddress

___

#### <a id="getsignerorprovider" name="getsignerorprovider"></a> getSignerOrProvider

▸ **getSignerOrProvider**(`chain`, `signer?`): `Promise`<`Signer` \| `Provider`\>

**`desc`** Returns the connected signer if it's connected to the specified
chain id, otherwise it returns a regular provider for the specified chain.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chain` | [`TChain`](#tchain) | Chain name or model |
| `signer` | [`TProvider`](#tprovider) | Ethers signer or provider |

##### Returns

`Promise`<`Signer` \| `Provider`\>

Ethers signer or provider

##### Inherited from

Base.getSignerOrProvider

___

#### <a id="getsupportedassets" name="getsupportedassets"></a> getSupportedAssets

▸ **getSupportedAssets**(): `any`

##### Returns

`any`

##### Inherited from

Base.getSupportedAssets

___

#### <a id="getsupportedassetsforchain" name="getsupportedassetsforchain"></a> getSupportedAssetsForChain

▸ **getSupportedAssetsForChain**(`chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getSupportedAssetsForChain

___

#### <a id="getswapfee" name="getswapfee"></a> getSwapFee

▸ **getSwapFee**(): `Promise`<`number`\>

##### Returns

`Promise`<`number`\>

___

#### <a id="getvirtualprice" name="getvirtualprice"></a> getVirtualPrice

▸ **getVirtualPrice**(): `Promise`<`BigNumber`\>

##### Returns

`Promise`<`BigNumber`\>

___

#### <a id="init" name="init"></a> init

▸ **init**(): `Promise`<`void`\>

##### Returns

`Promise`<`void`\>

##### Inherited from

Base.init

___

#### <a id="ishighpriceimpact" name="ishighpriceimpact"></a> isHighPriceImpact

▸ **isHighPriceImpact**(`priceImpact`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `priceImpact` | `BigNumber` |

##### Returns

`boolean`

___

#### <a id="isvalidchain" name="isvalidchain"></a> isValidChain

▸ **isValidChain**(`chain`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | `string` |

##### Returns

`boolean`

##### Inherited from

Base.isValidChain

___

#### <a id="isvalidnetwork" name="isvalidnetwork"></a> isValidNetwork

▸ **isValidNetwork**(`network`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `network` | `string` |

##### Returns

`boolean`

##### Inherited from

Base.isValidNetwork

___

#### <a id="populateaddliquiditytx" name="populateaddliquiditytx"></a> populateAddLiquidityTx

▸ **populateAddLiquidityTx**(`amount0Desired`, `amount1Desired`, `minToMint?`, `deadline?`): `Promise`<`any`\>

##### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `amount0Desired` | `BigNumberish` | `undefined` |
| `amount1Desired` | `BigNumberish` | `undefined` |
| `minToMint` | `BigNumberish` | `0` |
| `deadline` | `BigNumberish` | `undefined` |

##### Returns

`Promise`<`any`\>

___

#### <a id="populateremoveliquiditytx" name="populateremoveliquiditytx"></a> populateRemoveLiquidityTx

▸ **populateRemoveLiquidityTx**(`liqudityTokenAmount`, `amount0Min?`, `amount1Min?`, `deadline?`): `Promise`<`any`\>

##### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `liqudityTokenAmount` | `BigNumberish` | `undefined` |
| `amount0Min` | `BigNumberish` | `0` |
| `amount1Min` | `BigNumberish` | `0` |
| `deadline` | `BigNumberish` | `undefined` |

##### Returns

`Promise`<`any`\>

___

#### <a id="removeliquidity" name="removeliquidity"></a> removeLiquidity

▸ **removeLiquidity**(`liquidityTokenAmount`, `amount0Min?`, `amount1Min?`, `deadline?`): `Promise`<`TransactionResponse`\>

**`desc`** Sends transaction to remove liquidity from AMM.

**`example`**
```js
import { AMM } from '@hop-protocol/sdk'

const amm = new AMM(...)
const tx = await amm.removeLiquidity('1000000000000000000', '0', '0')
console.log(tx.hash)
```

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `liquidityTokenAmount` | `BigNumberish` | `undefined` | - |
| `amount0Min` | `BigNumberish` | `0` | Minimum amount of token #0 to receive in order for transaction to be successful. |
| `amount1Min` | `BigNumberish` | `0` | Minimum amount of token #1 to receive in order for transaction to be successful. transaction to be successful. |
| `deadline` | `BigNumberish` | `undefined` | Order deadline in seconds |

##### Returns

`Promise`<`TransactionResponse`\>

Ethers transaction object.

___

#### <a id="removeliquidityimbalance" name="removeliquidityimbalance"></a> removeLiquidityImbalance

▸ **removeLiquidityImbalance**(`amount0`, `amount1`, `maxBurnAmount?`, `deadline?`): `Promise`<`ContractTransaction`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `amount0` | `BigNumberish` |
| `amount1` | `BigNumberish` |
| `maxBurnAmount` | `BigNumberish` |
| `deadline` | `BigNumberish` |

##### Returns

`Promise`<`ContractTransaction`\>

___

#### <a id="removeliquidityonetoken" name="removeliquidityonetoken"></a> removeLiquidityOneToken

▸ **removeLiquidityOneToken**(`lpAmount`, `tokenIndex`, `amountMin?`, `deadline?`): `Promise`<`ContractTransaction`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `lpAmount` | `BigNumberish` |
| `tokenIndex` | `number` |
| `amountMin` | `BigNumberish` |
| `deadline` | `BigNumberish` |

##### Returns

`Promise`<`ContractTransaction`\>

___

#### <a id="setchainprovider" name="setchainprovider"></a> setChainProvider

▸ **setChainProvider**(`chain`, `provider`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](#tchain) |
| `provider` | `Provider` |

##### Returns

`void`

##### Inherited from

Base.setChainProvider

___

#### <a id="setchainproviderurls" name="setchainproviderurls"></a> setChainProviderUrls

▸ **setChainProviderUrls**(`chainProviders`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `chainProviders` | `Record`<`string`, `string`\> |

##### Returns

`void`

##### Inherited from

Base.setChainProviderUrls

___

#### <a id="setchainproviders" name="setchainproviders"></a> setChainProviders

▸ **setChainProviders**(`chainProviders`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `chainProviders` | `ChainProviders` |

##### Returns

`void`

##### Inherited from

Base.setChainProviders

___

#### <a id="setconfigaddresses" name="setconfigaddresses"></a> setConfigAddresses

▸ **setConfigAddresses**(`addresses`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `addresses` | `Addresses` |

##### Returns

`void`

##### Inherited from

Base.setConfigAddresses

___

#### <a id="setgaspricemultiplier" name="setgaspricemultiplier"></a> setGasPriceMultiplier

▸ **setGasPriceMultiplier**(`gasPriceMultiplier`): `number`

##### Parameters

| Name | Type |
| :------ | :------ |
| `gasPriceMultiplier` | `number` |

##### Returns

`number`

##### Inherited from

Base.setGasPriceMultiplier

___

#### <a id="tochainmodel" name="tochainmodel"></a> toChainModel

▸ **toChainModel**(`chain`): [`Chain`](#classeschainmd)

**`desc`** Returns a Chain model instance with connected provider.

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](#tchain) |

##### Returns

[`Chain`](#classeschainmd)

- Chain model with connected provider.

##### Inherited from

Base.toChainModel

___

#### <a id="totokenmodel" name="totokenmodel"></a> toTokenModel

▸ **toTokenModel**(`token`): [`TokenModel`](#classestokenmodelmd)

**`desc`** Returns a Token instance.

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |

##### Returns

[`TokenModel`](#classestokenmodelmd)

- Token model.

##### Inherited from

Base.toTokenModel

___

#### <a id="txoverrides" name="txoverrides"></a> txOverrides

▸ **txOverrides**(`chain`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`Chain`](#classeschainmd) |

##### Returns

`Promise`<`any`\>

##### Inherited from

Base.txOverrides


<a name="classescanonicalbridgemd"></a>

## Class: CanonicalBridge

Class reprensenting Canonical Token Bridge.

**`namespace`** CanonicalBridge

### Hierarchy

- `Base`

  ↳ **`CanonicalBridge`**

### Table of contents

#### Constructors

- [constructor](#constructor)

#### Properties

- [chain](#chain)
- [chainProviders](#chainproviders)
- [destinationFeeGasPriceMultiplier](#destinationfeegaspricemultiplier)
- [fees](#fees)
- [gasPriceMultiplier](#gaspricemultiplier)
- [getContract](#getcontract)
- [network](#network)
- [signer](#signer)
- [tokenSymbol](#tokensymbol)

#### Accessors

- [address](#address)
- [supportedChains](#supportedchains)
- [supportedNetworks](#supportednetworks)

#### Methods

- [\_getBonderAddress](#_getbonderaddress)
- [approveDeposit](#approvedeposit)
- [approveWithdraw](#approvewithdraw)
- [connect](#connect)
- [deposit](#deposit)
- [estimateOptimismL1FeeFromData](#estimateoptimisml1feefromdata)
- [exit](#exit)
- [getAmbBridge](#getambbridge)
- [getArbChainAddress](#getarbchainaddress)
- [getBumpedGasPrice](#getbumpedgasprice)
- [getCanonicalToken](#getcanonicaltoken)
- [getChainId](#getchainid)
- [getChainProvider](#getchainprovider)
- [getChainProviderUrls](#getchainproviderurls)
- [getChainProviders](#getchainproviders)
- [getConfigAddresses](#getconfigaddresses)
- [getDepositApprovalAddress](#getdepositapprovaladdress)
- [getFeeBps](#getfeebps)
- [getL1AmbBridgeAddress](#getl1ambbridgeaddress)
- [getL1BridgeAddress](#getl1bridgeaddress)
- [getL1CanonicalBridge](#getl1canonicalbridge)
- [getL1CanonicalBridgeAddress](#getl1canonicalbridgeaddress)
- [getL1CanonicalTokenAddress](#getl1canonicaltokenaddress)
- [getL1PosErc20PredicateAddress](#getl1poserc20predicateaddress)
- [getL1PosRootChainManagerAddress](#getl1posrootchainmanageraddress)
- [getL1Token](#getl1token)
- [getL2AmbBridgeAddress](#getl2ambbridgeaddress)
- [getL2AmmWrapperAddress](#getl2ammwrapperaddress)
- [getL2BridgeAddress](#getl2bridgeaddress)
- [getL2CanonicalBridge](#getl2canonicalbridge)
- [getL2CanonicalBridgeAddress](#getl2canonicalbridgeaddress)
- [getL2CanonicalTokenAddress](#getl2canonicaltokenaddress)
- [getL2HopBridgeTokenAddress](#getl2hopbridgetokenaddress)
- [getL2HopToken](#getl2hoptoken)
- [getL2SaddleLpTokenAddress](#getl2saddlelptokenaddress)
- [getL2SaddleSwapAddress](#getl2saddleswapaddress)
- [getS3ConfigData](#gets3configdata)
- [getSignerAddress](#getsigneraddress)
- [getSignerOrProvider](#getsignerorprovider)
- [getSupportedAssets](#getsupportedassets)
- [getSupportedAssetsForChain](#getsupportedassetsforchain)
- [getWithdrawApprovalAddress](#getwithdrawapprovaladdress)
- [init](#init)
- [isValidChain](#isvalidchain)
- [isValidNetwork](#isvalidnetwork)
- [setChainProvider](#setchainprovider)
- [setChainProviderUrls](#setchainproviderurls)
- [setChainProviders](#setchainproviders)
- [setConfigAddresses](#setconfigaddresses)
- [setGasPriceMultiplier](#setgaspricemultiplier)
- [toCanonicalToken](#tocanonicaltoken)
- [toChainModel](#tochainmodel)
- [toHopToken](#tohoptoken)
- [toTokenModel](#totokenmodel)
- [txOverrides](#txoverrides)
- [withdraw](#withdraw)

### Constructors

#### <a id="constructor" name="constructor"></a> constructor

• **new CanonicalBridge**(`network`, `signer`, `token`, `chain`, `chainProviders?`)

**`desc`** Instantiates Canonical Token Bridge.
Returns a new Canonical Token Bridge instance.

**`example`**
```js
import { CanonicalHop, Chain } from '@hop-protocol/sdk'
import { Wallet } from 'ethers'

const signer = new Wallet(privateKey)
const bridge = new CanonicalBridge('kovan', signer, 'USDC', Chain.Optimism)
```

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `network` | `string` | L1 network name (e.g. 'mainnet', 'kovan', 'goerli') |
| `signer` | [`TProvider`](#tprovider) | Ethers `Signer` for signing transactions. |
| `token` | [`TToken`](#ttoken) | Token symbol or model |
| `chain` | [`TChain`](#tchain) | Chain model |
| `chainProviders?` | `ChainProviders` | - |

##### Overrides

Base.constructor

### Properties

#### <a id="chain" name="chain"></a> chain

• **chain**: [`Chain`](#classeschainmd)

Chain model

___

#### <a id="chainproviders" name="chainproviders"></a> chainProviders

• **chainProviders**: `ChainProviders` = `{}`

##### Inherited from

Base.chainProviders

___

#### <a id="destinationfeegaspricemultiplier" name="destinationfeegaspricemultiplier"></a> destinationFeeGasPriceMultiplier

• **destinationFeeGasPriceMultiplier**: `number` = `1`

##### Inherited from

Base.destinationFeeGasPriceMultiplier

___

#### <a id="fees" name="fees"></a> fees

• **fees**: `Object`

##### Index signature

▪ [token: `string`]: `Record`<`string`, `number`\>

##### Inherited from

Base.fees

___

#### <a id="gaspricemultiplier" name="gaspricemultiplier"></a> gasPriceMultiplier

• **gasPriceMultiplier**: `number` = `0`

##### Inherited from

Base.gasPriceMultiplier

___

#### <a id="getcontract" name="getcontract"></a> getContract

• **getContract**: (`factory`: `Factory`, `address`: `string`, `provider`: [`TProvider`](#tprovider)) => `Promise`<`any`\> = `getContract`

##### Type declaration

▸ (`factory`, `address`, `provider`): `Promise`<`any`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `factory` | `Factory` |
| `address` | `string` |
| `provider` | [`TProvider`](#tprovider) |

###### Returns

`Promise`<`any`\>

##### Inherited from

Base.getContract

___

#### <a id="network" name="network"></a> network

• **network**: `string`

Network name

##### Inherited from

Base.network

___

#### <a id="signer" name="signer"></a> signer

• **signer**: [`TProvider`](#tprovider)

Ethers signer or provider

##### Inherited from

Base.signer

___

#### <a id="tokensymbol" name="tokensymbol"></a> tokenSymbol

• **tokenSymbol**: `string`

Token class instance

### Accessors

#### <a id="address" name="address"></a> address

• `get` **address**(): `any`

**`desc`** Return address of L1 canonical token bridge.

##### Returns

`any`

L1 canonical token bridge address

___

#### <a id="supportedchains" name="supportedchains"></a> supportedChains

• `get` **supportedChains**(): `string`[]

##### Returns

`string`[]

##### Inherited from

Base.supportedChains

___

#### <a id="supportednetworks" name="supportednetworks"></a> supportedNetworks

• `get` **supportedNetworks**(): `string`[]

##### Returns

`string`[]

##### Inherited from

Base.supportedNetworks

### Methods

#### <a id="_getbonderaddress" name="_getbonderaddress"></a> \_getBonderAddress

▸ `Protected` **_getBonderAddress**(`token`, `sourceChain`, `destinationChain`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `sourceChain` | [`TChain`](#tchain) |
| `destinationChain` | [`TChain`](#tchain) |

##### Returns

`string`

##### Inherited from

Base.\_getBonderAddress

___

#### <a id="approvedeposit" name="approvedeposit"></a> approveDeposit

▸ **approveDeposit**(`amount`, `chain?`): `Promise`<`TransactionResponse`\>

**`desc`** Sends transaction to approve tokens for canonical token bridge deposit.
Will only send approval transaction if necessary.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `amount` | `BigNumberish` | Token amount to approve. |
| `chain?` | [`TChain`](#tchain) | Chain model. |

##### Returns

`Promise`<`TransactionResponse`\>

Ethers transaction object.

___

#### <a id="approvewithdraw" name="approvewithdraw"></a> approveWithdraw

▸ **approveWithdraw**(`amount`): `Promise`<`TransactionResponse`\>

**`desc`** Sends transaction to approve tokens for canonical token bridge withdrawal.
Will only send approval transaction if necessary.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `amount` | `BigNumberish` | Token amount to approve. |

##### Returns

`Promise`<`TransactionResponse`\>

Ethers transaction object.

___

#### <a id="connect" name="connect"></a> connect

▸ **connect**(`signer`): [`CanonicalBridge`](#classescanonicalbridgemd)

**`desc`** Returns canonical bridge instance with signer connected. Used for adding or changing signer.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | [`TProvider`](#tprovider) | Ethers `Signer` for signing transactions. |

##### Returns

[`CanonicalBridge`](#classescanonicalbridgemd)

New CanonicalBridge SDK instance with connected signer.

___

#### <a id="deposit" name="deposit"></a> deposit

▸ **deposit**(`amount`, `chain?`): `Promise`<`any`\>

**`desc`** Sends transaction to canonical token bridge to deposit tokens into L2.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `amount` | `BigNumberish` | Token amount to deposit. |
| `chain?` | [`TChain`](#tchain) | Chain model. |

##### Returns

`Promise`<`any`\>

Ethers transaction object.

___

#### <a id="estimateoptimisml1feefromdata" name="estimateoptimisml1feefromdata"></a> estimateOptimismL1FeeFromData

▸ **estimateOptimismL1FeeFromData**(`gasLimit`, `data?`, `to?`): `Promise`<`any`\>

##### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `gasLimit` | `BigNumberish` | `undefined` |
| `data` | `string` | `'0x'` |
| `to` | `string` | `constants.AddressZero` |

##### Returns

`Promise`<`any`\>

##### Inherited from

Base.estimateOptimismL1FeeFromData

___

#### <a id="exit" name="exit"></a> exit

▸ **exit**(`txHash`, `chain`): `Promise`<`TransactionResponse`\>

**`desc`** Sends transaction to finalize withdrawal.
This call is necessary on Polygon to finalize L2 withdrawal into L1 on
certain chains. Will only send transaction if necessary.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `txHash` | `string` | Transaction hash proving token burn on L2. |
| `chain` | [`TChain`](#tchain) | Chain model. |

##### Returns

`Promise`<`TransactionResponse`\>

Ethers transaction object.

___

#### <a id="getambbridge" name="getambbridge"></a> getAmbBridge

▸ **getAmbBridge**(`chain?`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain?` | [`TChain`](#tchain) |

##### Returns

`Promise`<`any`\>

___

#### <a id="getarbchainaddress" name="getarbchainaddress"></a> getArbChainAddress

▸ **getArbChainAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getArbChainAddress

___

#### <a id="getbumpedgasprice" name="getbumpedgasprice"></a> getBumpedGasPrice

▸ **getBumpedGasPrice**(`signer`, `percent`): `Promise`<`BigNumber`\>

**`desc`** Calculates current gas price plus increased percentage amount.

**`example`**
```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
const bumpedGasPrice = await hop.getBumpedGasPrice(signer, 1.20)
console.log(bumpedGasPrice.toNumber())
```

##### Parameters

| Name | Type |
| :------ | :------ |
| `signer` | [`TProvider`](#tprovider) |
| `percent` | `number` |

##### Returns

`Promise`<`BigNumber`\>

Bumped as price as BigNumber

##### Inherited from

Base.getBumpedGasPrice

___

#### <a id="getcanonicaltoken" name="getcanonicaltoken"></a> getCanonicalToken

▸ **getCanonicalToken**(`chain`): [`Token`](#classestokenmd)

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](#tchain) |

##### Returns

[`Token`](#classestokenmd)

___

#### <a id="getchainid" name="getchainid"></a> getChainId

▸ **getChainId**(`chain`): `number`

**`desc`** Returns Chain ID for specified Chain model.

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`Chain`](#classeschainmd) |

##### Returns

`number`

- Chain ID.

##### Inherited from

Base.getChainId

___

#### <a id="getchainprovider" name="getchainprovider"></a> getChainProvider

▸ **getChainProvider**(`chain`): `Provider`

**`desc`** Returns Ethers provider for specified Chain model.

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | `string` \| [`Chain`](#classeschainmd) |

##### Returns

`Provider`

- Ethers provider.

##### Inherited from

Base.getChainProvider

___

#### <a id="getchainproviderurls" name="getchainproviderurls"></a> getChainProviderUrls

▸ **getChainProviderUrls**(): `Record`<`string`, `string`\>

##### Returns

`Record`<`string`, `string`\>

##### Inherited from

Base.getChainProviderUrls

___

#### <a id="getchainproviders" name="getchainproviders"></a> getChainProviders

▸ **getChainProviders**(): `Record`<`string`, `Provider`\>

##### Returns

`Record`<`string`, `Provider`\>

##### Inherited from

Base.getChainProviders

___

#### <a id="getconfigaddresses" name="getconfigaddresses"></a> getConfigAddresses

▸ **getConfigAddresses**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getConfigAddresses

___

#### <a id="getdepositapprovaladdress" name="getdepositapprovaladdress"></a> getDepositApprovalAddress

▸ **getDepositApprovalAddress**(`chain?`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain?` | [`TChain`](#tchain) |

##### Returns

`string`

___

#### <a id="getfeebps" name="getfeebps"></a> getFeeBps

▸ **getFeeBps**(`token`, `destinationChain`): `number`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `destinationChain` | [`TChain`](#tchain) |

##### Returns

`number`

##### Inherited from

Base.getFeeBps

___

#### <a id="getl1ambbridgeaddress" name="getl1ambbridgeaddress"></a> getL1AmbBridgeAddress

▸ **getL1AmbBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1AmbBridgeAddress

___

#### <a id="getl1bridgeaddress" name="getl1bridgeaddress"></a> getL1BridgeAddress

▸ **getL1BridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1BridgeAddress

___

#### <a id="getl1canonicalbridge" name="getl1canonicalbridge"></a> getL1CanonicalBridge

▸ **getL1CanonicalBridge**(): `Promise`<`any`\>

##### Returns

`Promise`<`any`\>

___

#### <a id="getl1canonicalbridgeaddress" name="getl1canonicalbridgeaddress"></a> getL1CanonicalBridgeAddress

▸ **getL1CanonicalBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1CanonicalBridgeAddress

___

#### <a id="getl1canonicaltokenaddress" name="getl1canonicaltokenaddress"></a> getL1CanonicalTokenAddress

▸ **getL1CanonicalTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1CanonicalTokenAddress

___

#### <a id="getl1poserc20predicateaddress" name="getl1poserc20predicateaddress"></a> getL1PosErc20PredicateAddress

▸ **getL1PosErc20PredicateAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1PosErc20PredicateAddress

___

#### <a id="getl1posrootchainmanageraddress" name="getl1posrootchainmanageraddress"></a> getL1PosRootChainManagerAddress

▸ **getL1PosRootChainManagerAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1PosRootChainManagerAddress

___

#### <a id="getl1token" name="getl1token"></a> getL1Token

▸ **getL1Token**(): [`Token`](#classestokenmd)

##### Returns

[`Token`](#classestokenmd)

___

#### <a id="getl2ambbridgeaddress" name="getl2ambbridgeaddress"></a> getL2AmbBridgeAddress

▸ **getL2AmbBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2AmbBridgeAddress

___

#### <a id="getl2ammwrapperaddress" name="getl2ammwrapperaddress"></a> getL2AmmWrapperAddress

▸ **getL2AmmWrapperAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2AmmWrapperAddress

___

#### <a id="getl2bridgeaddress" name="getl2bridgeaddress"></a> getL2BridgeAddress

▸ **getL2BridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2BridgeAddress

___

#### <a id="getl2canonicalbridge" name="getl2canonicalbridge"></a> getL2CanonicalBridge

▸ **getL2CanonicalBridge**(): `Promise`<`any`\>

##### Returns

`Promise`<`any`\>

___

#### <a id="getl2canonicalbridgeaddress" name="getl2canonicalbridgeaddress"></a> getL2CanonicalBridgeAddress

▸ **getL2CanonicalBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2CanonicalBridgeAddress

___

#### <a id="getl2canonicaltokenaddress" name="getl2canonicaltokenaddress"></a> getL2CanonicalTokenAddress

▸ **getL2CanonicalTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2CanonicalTokenAddress

___

#### <a id="getl2hopbridgetokenaddress" name="getl2hopbridgetokenaddress"></a> getL2HopBridgeTokenAddress

▸ **getL2HopBridgeTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2HopBridgeTokenAddress

___

#### <a id="getl2hoptoken" name="getl2hoptoken"></a> getL2HopToken

▸ **getL2HopToken**(`chain`): [`Token`](#classestokenmd)

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](#tchain) |

##### Returns

[`Token`](#classestokenmd)

___

#### <a id="getl2saddlelptokenaddress" name="getl2saddlelptokenaddress"></a> getL2SaddleLpTokenAddress

▸ **getL2SaddleLpTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2SaddleLpTokenAddress

___

#### <a id="getl2saddleswapaddress" name="getl2saddleswapaddress"></a> getL2SaddleSwapAddress

▸ **getL2SaddleSwapAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2SaddleSwapAddress

___

#### <a id="gets3configdata" name="gets3configdata"></a> getS3ConfigData

▸ **getS3ConfigData**(): `Promise`<`any`\>

##### Returns

`Promise`<`any`\>

##### Inherited from

Base.getS3ConfigData

___

#### <a id="getsigneraddress" name="getsigneraddress"></a> getSignerAddress

▸ **getSignerAddress**(): `Promise`<`string`\>

**`desc`** Returns the connected signer address.

**`example`**
```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
const address = await hop.getSignerAddress()
console.log(address)
```

##### Returns

`Promise`<`string`\>

Ethers signer address.

##### Inherited from

Base.getSignerAddress

___

#### <a id="getsignerorprovider" name="getsignerorprovider"></a> getSignerOrProvider

▸ **getSignerOrProvider**(`chain`, `signer?`): `Promise`<`Signer` \| `Provider`\>

**`desc`** Returns the connected signer if it's connected to the specified
chain id, otherwise it returns a regular provider for the specified chain.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chain` | [`TChain`](#tchain) | Chain name or model |
| `signer` | [`TProvider`](#tprovider) | Ethers signer or provider |

##### Returns

`Promise`<`Signer` \| `Provider`\>

Ethers signer or provider

##### Inherited from

Base.getSignerOrProvider

___

#### <a id="getsupportedassets" name="getsupportedassets"></a> getSupportedAssets

▸ **getSupportedAssets**(): `any`

##### Returns

`any`

##### Inherited from

Base.getSupportedAssets

___

#### <a id="getsupportedassetsforchain" name="getsupportedassetsforchain"></a> getSupportedAssetsForChain

▸ **getSupportedAssetsForChain**(`chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getSupportedAssetsForChain

___

#### <a id="getwithdrawapprovaladdress" name="getwithdrawapprovaladdress"></a> getWithdrawApprovalAddress

▸ **getWithdrawApprovalAddress**(`chain?`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain?` | [`TChain`](#tchain) |

##### Returns

`string`

___

#### <a id="init" name="init"></a> init

▸ **init**(): `Promise`<`void`\>

##### Returns

`Promise`<`void`\>

##### Inherited from

Base.init

___

#### <a id="isvalidchain" name="isvalidchain"></a> isValidChain

▸ **isValidChain**(`chain`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | `string` |

##### Returns

`boolean`

##### Inherited from

Base.isValidChain

___

#### <a id="isvalidnetwork" name="isvalidnetwork"></a> isValidNetwork

▸ **isValidNetwork**(`network`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `network` | `string` |

##### Returns

`boolean`

##### Inherited from

Base.isValidNetwork

___

#### <a id="setchainprovider" name="setchainprovider"></a> setChainProvider

▸ **setChainProvider**(`chain`, `provider`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](#tchain) |
| `provider` | `Provider` |

##### Returns

`void`

##### Inherited from

Base.setChainProvider

___

#### <a id="setchainproviderurls" name="setchainproviderurls"></a> setChainProviderUrls

▸ **setChainProviderUrls**(`chainProviders`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `chainProviders` | `Record`<`string`, `string`\> |

##### Returns

`void`

##### Inherited from

Base.setChainProviderUrls

___

#### <a id="setchainproviders" name="setchainproviders"></a> setChainProviders

▸ **setChainProviders**(`chainProviders`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `chainProviders` | `ChainProviders` |

##### Returns

`void`

##### Inherited from

Base.setChainProviders

___

#### <a id="setconfigaddresses" name="setconfigaddresses"></a> setConfigAddresses

▸ **setConfigAddresses**(`addresses`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `addresses` | `Addresses` |

##### Returns

`void`

##### Inherited from

Base.setConfigAddresses

___

#### <a id="setgaspricemultiplier" name="setgaspricemultiplier"></a> setGasPriceMultiplier

▸ **setGasPriceMultiplier**(`gasPriceMultiplier`): `number`

##### Parameters

| Name | Type |
| :------ | :------ |
| `gasPriceMultiplier` | `number` |

##### Returns

`number`

##### Inherited from

Base.setGasPriceMultiplier

___

#### <a id="tocanonicaltoken" name="tocanonicaltoken"></a> toCanonicalToken

▸ **toCanonicalToken**(`token`, `network`, `chain`): [`Token`](#classestokenmd)

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `network` | `string` |
| `chain` | [`TChain`](#tchain) |

##### Returns

[`Token`](#classestokenmd)

___

#### <a id="tochainmodel" name="tochainmodel"></a> toChainModel

▸ **toChainModel**(`chain`): [`Chain`](#classeschainmd)

**`desc`** Returns a Chain model instance with connected provider.

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](#tchain) |

##### Returns

[`Chain`](#classeschainmd)

- Chain model with connected provider.

##### Inherited from

Base.toChainModel

___

#### <a id="tohoptoken" name="tohoptoken"></a> toHopToken

▸ **toHopToken**(`token`, `network`, `chain`): [`Token`](#classestokenmd)

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `network` | `string` |
| `chain` | [`TChain`](#tchain) |

##### Returns

[`Token`](#classestokenmd)

___

#### <a id="totokenmodel" name="totokenmodel"></a> toTokenModel

▸ **toTokenModel**(`token`): [`TokenModel`](#classestokenmodelmd)

**`desc`** Returns a Token instance.

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |

##### Returns

[`TokenModel`](#classestokenmodelmd)

- Token model.

##### Inherited from

Base.toTokenModel

___

#### <a id="txoverrides" name="txoverrides"></a> txOverrides

▸ **txOverrides**(`chain`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`Chain`](#classeschainmd) |

##### Returns

`Promise`<`any`\>

##### Inherited from

Base.txOverrides

___

#### <a id="withdraw" name="withdraw"></a> withdraw

▸ **withdraw**(`amount`, `chain?`): `Promise`<`any`\>

**`desc`** Sends transaction to L2 canonical token bridge to withdraw tokens into L1.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `amount` | `BigNumberish` | Token amount to withdraw. |
| `chain?` | [`TChain`](#tchain) | Chain model. |

##### Returns

`Promise`<`any`\>

Ethers transaction object.


<a name="classeschainmd"></a>

## Class: Chain

### Table of contents

#### Constructors

- [constructor](#constructor)

#### Properties

- [chainId](#chainid)
- [isL1](#isl1)
- [name](#name)
- [nativeTokenSymbol](#nativetokensymbol)
- [provider](#provider)
- [slug](#slug)
- [Arbitrum](#arbitrum)
- [Ethereum](#ethereum)
- [Gnosis](#gnosis)
- [Optimism](#optimism)
- [Polygon](#polygon)

#### Accessors

- [rpcUrl](#rpcurl)

#### Methods

- [equals](#equals)
- [fromSlug](#fromslug)

### Constructors

#### <a id="constructor" name="constructor"></a> constructor

• **new Chain**(`name`, `chainId?`, `provider?`)

##### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `chainId?` | `string` \| `number` |
| `provider?` | `Provider` |

### Properties

#### <a id="chainid" name="chainid"></a> chainId

• **chainId**: `number`

___

#### <a id="isl1" name="isl1"></a> isL1

• **isL1**: `boolean` = `false`

___

#### <a id="name" name="name"></a> name

• **name**: `string` = `''`

___

#### <a id="nativetokensymbol" name="nativetokensymbol"></a> nativeTokenSymbol

• **nativeTokenSymbol**: `string`

___

#### <a id="provider" name="provider"></a> provider

• **provider**: `Provider` = `null`

___

#### <a id="slug" name="slug"></a> slug

• **slug**: `string` = `''`

___

#### <a id="arbitrum" name="arbitrum"></a> Arbitrum

▪ `Static` **Arbitrum**: [`Chain`](#classeschainmd)

___

#### <a id="ethereum" name="ethereum"></a> Ethereum

▪ `Static` **Ethereum**: [`Chain`](#classeschainmd)

___

#### <a id="gnosis" name="gnosis"></a> Gnosis

▪ `Static` **Gnosis**: [`Chain`](#classeschainmd)

___

#### <a id="optimism" name="optimism"></a> Optimism

▪ `Static` **Optimism**: [`Chain`](#classeschainmd)

___

#### <a id="polygon" name="polygon"></a> Polygon

▪ `Static` **Polygon**: [`Chain`](#classeschainmd)

### Accessors

#### <a id="rpcurl" name="rpcurl"></a> rpcUrl

• `get` **rpcUrl**(): `any`

##### Returns

`any`

### Methods

#### <a id="equals" name="equals"></a> equals

▸ **equals**(`other`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `other` | [`Chain`](#classeschainmd) |

##### Returns

`boolean`

___

#### <a id="fromslug" name="fromslug"></a> fromSlug

▸ `Static` **fromSlug**(`slug`): [`Chain`](#classeschainmd)

##### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |

##### Returns

[`Chain`](#classeschainmd)


<a name="classeshopmd"></a>

## Class: Hop

Class reprensenting Hop

**`namespace`** Hop

### Hierarchy

- `Base`

  ↳ **`Hop`**

### Table of contents

#### Constructors

- [constructor](#constructor)

#### Properties

- [Chain](#chain)
- [Event](#event)
- [Token](#token)
- [chainProviders](#chainproviders)
- [destinationFeeGasPriceMultiplier](#destinationfeegaspricemultiplier)
- [fees](#fees)
- [gasPriceMultiplier](#gaspricemultiplier)
- [getContract](#getcontract)
- [network](#network)
- [signer](#signer)
- [Chain](#chain)
- [Event](#event)
- [Token](#token)

#### Accessors

- [supportedChains](#supportedchains)
- [supportedNetworks](#supportednetworks)
- [version](#version)

#### Methods

- [\_getBonderAddress](#_getbonderaddress)
- [bridge](#bridge)
- [canonicalBridge](#canonicalbridge)
- [connect](#connect)
- [estimateOptimismL1FeeFromData](#estimateoptimisml1feefromdata)
- [getArbChainAddress](#getarbchainaddress)
- [getBumpedGasPrice](#getbumpedgasprice)
- [getChainId](#getchainid)
- [getChainProvider](#getchainprovider)
- [getChainProviderUrls](#getchainproviderurls)
- [getChainProviders](#getchainproviders)
- [getConfigAddresses](#getconfigaddresses)
- [getFeeBps](#getfeebps)
- [getL1AmbBridgeAddress](#getl1ambbridgeaddress)
- [getL1BridgeAddress](#getl1bridgeaddress)
- [getL1CanonicalBridgeAddress](#getl1canonicalbridgeaddress)
- [getL1CanonicalTokenAddress](#getl1canonicaltokenaddress)
- [getL1PosErc20PredicateAddress](#getl1poserc20predicateaddress)
- [getL1PosRootChainManagerAddress](#getl1posrootchainmanageraddress)
- [getL2AmbBridgeAddress](#getl2ambbridgeaddress)
- [getL2AmmWrapperAddress](#getl2ammwrapperaddress)
- [getL2BridgeAddress](#getl2bridgeaddress)
- [getL2CanonicalBridgeAddress](#getl2canonicalbridgeaddress)
- [getL2CanonicalTokenAddress](#getl2canonicaltokenaddress)
- [getL2HopBridgeTokenAddress](#getl2hopbridgetokenaddress)
- [getL2SaddleLpTokenAddress](#getl2saddlelptokenaddress)
- [getL2SaddleSwapAddress](#getl2saddleswapaddress)
- [getS3ConfigData](#gets3configdata)
- [getSignerAddress](#getsigneraddress)
- [getSignerOrProvider](#getsignerorprovider)
- [getSupportedAssets](#getsupportedassets)
- [getSupportedAssetsForChain](#getsupportedassetsforchain)
- [init](#init)
- [isValidChain](#isvalidchain)
- [isValidNetwork](#isvalidnetwork)
- [setChainProvider](#setchainprovider)
- [setChainProviderUrls](#setchainproviderurls)
- [setChainProviders](#setchainproviders)
- [setConfigAddresses](#setconfigaddresses)
- [setGasPriceMultiplier](#setgaspricemultiplier)
- [toChainModel](#tochainmodel)
- [toTokenModel](#totokenmodel)
- [txOverrides](#txoverrides)
- [watch](#watch)
- [watchBridge](#watchbridge)
- [watchCanonical](#watchcanonical)

### Constructors

#### <a id="constructor" name="constructor"></a> constructor

• **new Hop**(`network`, `signer?`, `chainProviders?`)

**`desc`** Instantiates Hop SDK.
Returns a new Hop SDK instance.

**`example`**
```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop('mainnet')
```

**`example`**
```js
import { Hop } from '@hop-protocol/sdk'
import { Wallet } from 'ethers'

const signer = new Wallet(privateKey)
const hop = new Hop('mainnet', signer)
```

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `network` | `string` | L1 network name (e.g. 'mainnet', 'kovan', 'goerli') |
| `signer?` | [`TProvider`](#tprovider) | Ethers `Signer` for signing transactions. |
| `chainProviders?` | `ChainProviders` | - |

##### Overrides

Base.constructor

### Properties

#### <a id="chain" name="chain"></a> Chain

• **Chain**: typeof [`Chain`](#classeschainmd) = `Chain`

Chain class

___

#### <a id="event" name="event"></a> Event

• **Event**: typeof `Event` = `Event`

Event enum

___

#### <a id="token" name="token"></a> Token

• **Token**: typeof [`TokenModel`](#classestokenmodelmd) = `Token`

Token class

___

#### <a id="chainproviders" name="chainproviders"></a> chainProviders

• **chainProviders**: `ChainProviders` = `{}`

##### Inherited from

Base.chainProviders

___

#### <a id="destinationfeegaspricemultiplier" name="destinationfeegaspricemultiplier"></a> destinationFeeGasPriceMultiplier

• **destinationFeeGasPriceMultiplier**: `number` = `1`

##### Inherited from

Base.destinationFeeGasPriceMultiplier

___

#### <a id="fees" name="fees"></a> fees

• **fees**: `Object`

##### Index signature

▪ [token: `string`]: `Record`<`string`, `number`\>

##### Inherited from

Base.fees

___

#### <a id="gaspricemultiplier" name="gaspricemultiplier"></a> gasPriceMultiplier

• **gasPriceMultiplier**: `number` = `0`

##### Inherited from

Base.gasPriceMultiplier

___

#### <a id="getcontract" name="getcontract"></a> getContract

• **getContract**: (`factory`: `Factory`, `address`: `string`, `provider`: [`TProvider`](#tprovider)) => `Promise`<`any`\> = `getContract`

##### Type declaration

▸ (`factory`, `address`, `provider`): `Promise`<`any`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `factory` | `Factory` |
| `address` | `string` |
| `provider` | [`TProvider`](#tprovider) |

###### Returns

`Promise`<`any`\>

##### Inherited from

Base.getContract

___

#### <a id="network" name="network"></a> network

• **network**: `string`

Network name

##### Inherited from

Base.network

___

#### <a id="signer" name="signer"></a> signer

• **signer**: [`TProvider`](#tprovider)

Ethers signer or provider

##### Inherited from

Base.signer

___

#### <a id="chain" name="chain"></a> Chain

▪ `Static` **Chain**: typeof [`Chain`](#classeschainmd) = `Chain`

Chain class

___

#### <a id="event" name="event"></a> Event

▪ `Static` **Event**: typeof `Event` = `Event`

Event enum

___

#### <a id="token" name="token"></a> Token

▪ `Static` **Token**: typeof [`TokenModel`](#classestokenmodelmd) = `Token`

Token class

### Accessors

#### <a id="supportedchains" name="supportedchains"></a> supportedChains

• `get` **supportedChains**(): `string`[]

##### Returns

`string`[]

##### Inherited from

Base.supportedChains

___

#### <a id="supportednetworks" name="supportednetworks"></a> supportedNetworks

• `get` **supportedNetworks**(): `string`[]

##### Returns

`string`[]

##### Inherited from

Base.supportedNetworks

___

#### <a id="version" name="version"></a> version

• `get` **version**(): `string`

**`desc`** Returns the SDK version.

**`example`**
```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
console.log(hop.version)
```

##### Returns

`string`

version string

### Methods

#### <a id="_getbonderaddress" name="_getbonderaddress"></a> \_getBonderAddress

▸ `Protected` **_getBonderAddress**(`token`, `sourceChain`, `destinationChain`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `sourceChain` | [`TChain`](#tchain) |
| `destinationChain` | [`TChain`](#tchain) |

##### Returns

`string`

##### Inherited from

Base.\_getBonderAddress

___

#### <a id="bridge" name="bridge"></a> bridge

▸ **bridge**(`token`): [`HopBridge`](#classeshopbridgemd)

**`desc`** Returns a bridge set instance.

**`example`**
```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
const bridge = hop.bridge('USDC')
```

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `token` | [`TToken`](#ttoken) | Token model or symbol of token of bridge to use. |

##### Returns

[`HopBridge`](#classeshopbridgemd)

A HopBridge instance.

___

#### <a id="canonicalbridge" name="canonicalbridge"></a> canonicalBridge

▸ **canonicalBridge**(`token`, `chain?`): [`CanonicalBridge`](#classescanonicalbridgemd)

**`desc`** Returns a canonical bridge sdk instance.

**`example`**
```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
const bridge = hop.canonicalBridge('USDC')
```

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `token` | [`TToken`](#ttoken) | Token model or symbol of token of canonical bridge to use. |
| `chain?` | [`TChain`](#tchain) | Chain model. |

##### Returns

[`CanonicalBridge`](#classescanonicalbridgemd)

A CanonicalBridge instance.

___

#### <a id="connect" name="connect"></a> connect

▸ **connect**(`signer`): [`Hop`](#classeshopmd)

**`desc`** Returns hop instance with signer connected. Used for adding or changing signer.

**`example`**
```js
import { Hop } from '@hop-protocol/sdk'
import { Wallet } from 'ethers'

const signer = new Wallet(privateKey)
let hop = new Hop()
// ...
hop = hop.connect(signer)
```

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | [`TProvider`](#tprovider) | Ethers `Signer` for signing transactions. |

##### Returns

[`Hop`](#classeshopmd)

A new Hop SDK instance with connected Ethers Signer.

___

#### <a id="estimateoptimisml1feefromdata" name="estimateoptimisml1feefromdata"></a> estimateOptimismL1FeeFromData

▸ **estimateOptimismL1FeeFromData**(`gasLimit`, `data?`, `to?`): `Promise`<`any`\>

##### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `gasLimit` | `BigNumberish` | `undefined` |
| `data` | `string` | `'0x'` |
| `to` | `string` | `constants.AddressZero` |

##### Returns

`Promise`<`any`\>

##### Inherited from

Base.estimateOptimismL1FeeFromData

___

#### <a id="getarbchainaddress" name="getarbchainaddress"></a> getArbChainAddress

▸ **getArbChainAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getArbChainAddress

___

#### <a id="getbumpedgasprice" name="getbumpedgasprice"></a> getBumpedGasPrice

▸ **getBumpedGasPrice**(`signer`, `percent`): `Promise`<`BigNumber`\>

**`desc`** Calculates current gas price plus increased percentage amount.

**`example`**
```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
const bumpedGasPrice = await hop.getBumpedGasPrice(signer, 1.20)
console.log(bumpedGasPrice.toNumber())
```

##### Parameters

| Name | Type |
| :------ | :------ |
| `signer` | [`TProvider`](#tprovider) |
| `percent` | `number` |

##### Returns

`Promise`<`BigNumber`\>

Bumped as price as BigNumber

##### Inherited from

Base.getBumpedGasPrice

___

#### <a id="getchainid" name="getchainid"></a> getChainId

▸ **getChainId**(`chain`): `number`

**`desc`** Returns Chain ID for specified Chain model.

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`Chain`](#classeschainmd) |

##### Returns

`number`

- Chain ID.

##### Inherited from

Base.getChainId

___

#### <a id="getchainprovider" name="getchainprovider"></a> getChainProvider

▸ **getChainProvider**(`chain`): `Provider`

**`desc`** Returns Ethers provider for specified Chain model.

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | `string` \| [`Chain`](#classeschainmd) |

##### Returns

`Provider`

- Ethers provider.

##### Inherited from

Base.getChainProvider

___

#### <a id="getchainproviderurls" name="getchainproviderurls"></a> getChainProviderUrls

▸ **getChainProviderUrls**(): `Record`<`string`, `string`\>

##### Returns

`Record`<`string`, `string`\>

##### Inherited from

Base.getChainProviderUrls

___

#### <a id="getchainproviders" name="getchainproviders"></a> getChainProviders

▸ **getChainProviders**(): `Record`<`string`, `Provider`\>

##### Returns

`Record`<`string`, `Provider`\>

##### Inherited from

Base.getChainProviders

___

#### <a id="getconfigaddresses" name="getconfigaddresses"></a> getConfigAddresses

▸ **getConfigAddresses**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getConfigAddresses

___

#### <a id="getfeebps" name="getfeebps"></a> getFeeBps

▸ **getFeeBps**(`token`, `destinationChain`): `number`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `destinationChain` | [`TChain`](#tchain) |

##### Returns

`number`

##### Inherited from

Base.getFeeBps

___

#### <a id="getl1ambbridgeaddress" name="getl1ambbridgeaddress"></a> getL1AmbBridgeAddress

▸ **getL1AmbBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1AmbBridgeAddress

___

#### <a id="getl1bridgeaddress" name="getl1bridgeaddress"></a> getL1BridgeAddress

▸ **getL1BridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1BridgeAddress

___

#### <a id="getl1canonicalbridgeaddress" name="getl1canonicalbridgeaddress"></a> getL1CanonicalBridgeAddress

▸ **getL1CanonicalBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1CanonicalBridgeAddress

___

#### <a id="getl1canonicaltokenaddress" name="getl1canonicaltokenaddress"></a> getL1CanonicalTokenAddress

▸ **getL1CanonicalTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1CanonicalTokenAddress

___

#### <a id="getl1poserc20predicateaddress" name="getl1poserc20predicateaddress"></a> getL1PosErc20PredicateAddress

▸ **getL1PosErc20PredicateAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1PosErc20PredicateAddress

___

#### <a id="getl1posrootchainmanageraddress" name="getl1posrootchainmanageraddress"></a> getL1PosRootChainManagerAddress

▸ **getL1PosRootChainManagerAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1PosRootChainManagerAddress

___

#### <a id="getl2ambbridgeaddress" name="getl2ambbridgeaddress"></a> getL2AmbBridgeAddress

▸ **getL2AmbBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2AmbBridgeAddress

___

#### <a id="getl2ammwrapperaddress" name="getl2ammwrapperaddress"></a> getL2AmmWrapperAddress

▸ **getL2AmmWrapperAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2AmmWrapperAddress

___

#### <a id="getl2bridgeaddress" name="getl2bridgeaddress"></a> getL2BridgeAddress

▸ **getL2BridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2BridgeAddress

___

#### <a id="getl2canonicalbridgeaddress" name="getl2canonicalbridgeaddress"></a> getL2CanonicalBridgeAddress

▸ **getL2CanonicalBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2CanonicalBridgeAddress

___

#### <a id="getl2canonicaltokenaddress" name="getl2canonicaltokenaddress"></a> getL2CanonicalTokenAddress

▸ **getL2CanonicalTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2CanonicalTokenAddress

___

#### <a id="getl2hopbridgetokenaddress" name="getl2hopbridgetokenaddress"></a> getL2HopBridgeTokenAddress

▸ **getL2HopBridgeTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2HopBridgeTokenAddress

___

#### <a id="getl2saddlelptokenaddress" name="getl2saddlelptokenaddress"></a> getL2SaddleLpTokenAddress

▸ **getL2SaddleLpTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2SaddleLpTokenAddress

___

#### <a id="getl2saddleswapaddress" name="getl2saddleswapaddress"></a> getL2SaddleSwapAddress

▸ **getL2SaddleSwapAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2SaddleSwapAddress

___

#### <a id="gets3configdata" name="gets3configdata"></a> getS3ConfigData

▸ **getS3ConfigData**(): `Promise`<`any`\>

##### Returns

`Promise`<`any`\>

##### Inherited from

Base.getS3ConfigData

___

#### <a id="getsigneraddress" name="getsigneraddress"></a> getSignerAddress

▸ **getSignerAddress**(): `Promise`<`string`\>

**`desc`** Returns the connected signer address.

**`example`**
```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
const address = await hop.getSignerAddress()
console.log(address)
```

##### Returns

`Promise`<`string`\>

Ethers signer address.

##### Inherited from

Base.getSignerAddress

___

#### <a id="getsignerorprovider" name="getsignerorprovider"></a> getSignerOrProvider

▸ **getSignerOrProvider**(`chain`, `signer?`): `Promise`<`Signer` \| `Provider`\>

**`desc`** Returns the connected signer if it's connected to the specified
chain id, otherwise it returns a regular provider for the specified chain.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chain` | [`TChain`](#tchain) | Chain name or model |
| `signer` | [`TProvider`](#tprovider) | Ethers signer or provider |

##### Returns

`Promise`<`Signer` \| `Provider`\>

Ethers signer or provider

##### Inherited from

Base.getSignerOrProvider

___

#### <a id="getsupportedassets" name="getsupportedassets"></a> getSupportedAssets

▸ **getSupportedAssets**(): `any`

##### Returns

`any`

##### Inherited from

Base.getSupportedAssets

___

#### <a id="getsupportedassetsforchain" name="getsupportedassetsforchain"></a> getSupportedAssetsForChain

▸ **getSupportedAssetsForChain**(`chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getSupportedAssetsForChain

___

#### <a id="init" name="init"></a> init

▸ **init**(): `Promise`<`void`\>

##### Returns

`Promise`<`void`\>

##### Inherited from

Base.init

___

#### <a id="isvalidchain" name="isvalidchain"></a> isValidChain

▸ **isValidChain**(`chain`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | `string` |

##### Returns

`boolean`

##### Inherited from

Base.isValidChain

___

#### <a id="isvalidnetwork" name="isvalidnetwork"></a> isValidNetwork

▸ **isValidNetwork**(`network`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `network` | `string` |

##### Returns

`boolean`

##### Inherited from

Base.isValidNetwork

___

#### <a id="setchainprovider" name="setchainprovider"></a> setChainProvider

▸ **setChainProvider**(`chain`, `provider`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](#tchain) |
| `provider` | `Provider` |

##### Returns

`void`

##### Inherited from

Base.setChainProvider

___

#### <a id="setchainproviderurls" name="setchainproviderurls"></a> setChainProviderUrls

▸ **setChainProviderUrls**(`chainProviders`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `chainProviders` | `Record`<`string`, `string`\> |

##### Returns

`void`

##### Inherited from

Base.setChainProviderUrls

___

#### <a id="setchainproviders" name="setchainproviders"></a> setChainProviders

▸ **setChainProviders**(`chainProviders`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `chainProviders` | `ChainProviders` |

##### Returns

`void`

##### Inherited from

Base.setChainProviders

___

#### <a id="setconfigaddresses" name="setconfigaddresses"></a> setConfigAddresses

▸ **setConfigAddresses**(`addresses`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `addresses` | `Addresses` |

##### Returns

`void`

##### Inherited from

Base.setConfigAddresses

___

#### <a id="setgaspricemultiplier" name="setgaspricemultiplier"></a> setGasPriceMultiplier

▸ **setGasPriceMultiplier**(`gasPriceMultiplier`): `number`

##### Parameters

| Name | Type |
| :------ | :------ |
| `gasPriceMultiplier` | `number` |

##### Returns

`number`

##### Inherited from

Base.setGasPriceMultiplier

___

#### <a id="tochainmodel" name="tochainmodel"></a> toChainModel

▸ **toChainModel**(`chain`): [`Chain`](#classeschainmd)

**`desc`** Returns a Chain model instance with connected provider.

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](#tchain) |

##### Returns

[`Chain`](#classeschainmd)

- Chain model with connected provider.

##### Inherited from

Base.toChainModel

___

#### <a id="totokenmodel" name="totokenmodel"></a> toTokenModel

▸ **toTokenModel**(`token`): [`TokenModel`](#classestokenmodelmd)

**`desc`** Returns a Token instance.

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |

##### Returns

[`TokenModel`](#classestokenmodelmd)

- Token model.

##### Inherited from

Base.toTokenModel

___

#### <a id="txoverrides" name="txoverrides"></a> txOverrides

▸ **txOverrides**(`chain`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`Chain`](#classeschainmd) |

##### Returns

`Promise`<`any`\>

##### Inherited from

Base.txOverrides

___

#### <a id="watch" name="watch"></a> watch

▸ **watch**(`txHash`, `token`, `sourceChain`, `destinationChain`, `isCanonicalTransfer?`, `options?`): `EventEmitter`<`string` \| `symbol`, `any`\> \| `Error`

**`desc`** Watches for Hop transaction events.

**`example`**
```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
hop
  .watch(tx.hash, 'USDC', Chain.Ethereum, Chain.Gnosis)
  .on('receipt', ({receipt, chain}) => {
    console.log(chain.Name, receipt)
  })
```

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `txHash` | `string` | `undefined` | Source transaction hash. |
| `token` | [`TToken`](#ttoken) | `undefined` | Token name or model. |
| `sourceChain` | [`TChain`](#tchain) | `undefined` | Source chain name or model. |
| `destinationChain` | [`TChain`](#tchain) | `undefined` | Destination chain name or model. |
| `isCanonicalTransfer` | `boolean` | `false` | - |
| `options` | `WatchOptions` | `{}` | - |

##### Returns

`EventEmitter`<`string` \| `symbol`, `any`\> \| `Error`

___

#### <a id="watchbridge" name="watchbridge"></a> watchBridge

▸ **watchBridge**(`txHash`, `token`, `sourceChain`, `destinationChain`, `options?`): `EventEmitter`<`string` \| `symbol`, `any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `txHash` | `string` |
| `token` | [`TToken`](#ttoken) |
| `sourceChain` | [`TChain`](#tchain) |
| `destinationChain` | [`TChain`](#tchain) |
| `options` | `WatchOptions` |

##### Returns

`EventEmitter`<`string` \| `symbol`, `any`\>

___

#### <a id="watchcanonical" name="watchcanonical"></a> watchCanonical

▸ **watchCanonical**(`txHash`, `token`, `sourceChain`, `destinationChain`): `EventEmitter`<`string` \| `symbol`, `any`\> \| `Error`

##### Parameters

| Name | Type |
| :------ | :------ |
| `txHash` | `string` |
| `token` | [`TToken`](#ttoken) |
| `sourceChain` | [`TChain`](#tchain) |
| `destinationChain` | [`TChain`](#tchain) |

##### Returns

`EventEmitter`<`string` \| `symbol`, `any`\> \| `Error`


<a name="classeshopbridgemd"></a>

## Class: HopBridge

Class representing Hop bridge.

**`namespace`** HopBridge

### Hierarchy

- `Base`

  ↳ **`HopBridge`**

### Table of contents

#### Constructors

- [constructor](#constructor)

#### Properties

- [chainProviders](#chainproviders)
- [defaultDeadlineMinutes](#defaultdeadlineminutes)
- [destinationChain](#destinationchain)
- [destinationFeeGasPriceMultiplier](#destinationfeegaspricemultiplier)
- [fees](#fees)
- [gasPriceMultiplier](#gaspricemultiplier)
- [getContract](#getcontract)
- [network](#network)
- [priceFeed](#pricefeed)
- [signer](#signer)
- [sourceChain](#sourcechain)

#### Accessors

- [defaultDeadlineSeconds](#defaultdeadlineseconds)
- [supportedChains](#supportedchains)
- [supportedNetworks](#supportednetworks)

#### Methods

- [\_getBonderAddress](#_getbonderaddress)
- [addLiquidity](#addliquidity)
- [calculateWithdrawOneToken](#calculatewithdrawonetoken)
- [challengePeriod](#challengeperiod)
- [connect](#connect)
- [estimateBondWithdrawalGasLimit](#estimatebondwithdrawalgaslimit)
- [estimateOptimismL1FeeFromData](#estimateoptimisml1feefromdata)
- [estimateSendGasLimit](#estimatesendgaslimit)
- [estimateSendHTokensGasLimit](#estimatesendhtokensgaslimit)
- [execSaddleSwap](#execsaddleswap)
- [getAmbBridge](#getambbridge)
- [getAmm](#getamm)
- [getAmmData](#getammdata)
- [getAmmWrapper](#getammwrapper)
- [getAmountOut](#getamountout)
- [getArbChainAddress](#getarbchainaddress)
- [getAvailableLiquidity](#getavailableliquidity)
- [getBonderAddress](#getbonderaddress)
- [getBonderAvailableLiquidityData](#getbonderavailableliquiditydata)
- [getBridgeContract](#getbridgecontract)
- [getBumpedGasPrice](#getbumpedgasprice)
- [getCanonicalToken](#getcanonicaltoken)
- [getChainId](#getchainid)
- [getChainNativeToken](#getchainnativetoken)
- [getChainProvider](#getchainprovider)
- [getChainProviderUrls](#getchainproviderurls)
- [getChainProviders](#getchainproviders)
- [getConfigAddresses](#getconfigaddresses)
- [getCredit](#getcredit)
- [getDebit](#getdebit)
- [getDestinationTransactionFee](#getdestinationtransactionfee)
- [getEthBalance](#getethbalance)
- [getFeeBps](#getfeebps)
- [getFrontendAvailableLiquidity](#getfrontendavailableliquidity)
- [getL1AmbBridgeAddress](#getl1ambbridgeaddress)
- [getL1Bridge](#getl1bridge)
- [getL1BridgeAddress](#getl1bridgeaddress)
- [getL1CanonicalBridgeAddress](#getl1canonicalbridgeaddress)
- [getL1CanonicalTokenAddress](#getl1canonicaltokenaddress)
- [getL1PosErc20PredicateAddress](#getl1poserc20predicateaddress)
- [getL1PosRootChainManagerAddress](#getl1posrootchainmanageraddress)
- [getL1Token](#getl1token)
- [getL2AmbBridgeAddress](#getl2ambbridgeaddress)
- [getL2AmmWrapperAddress](#getl2ammwrapperaddress)
- [getL2Bridge](#getl2bridge)
- [getL2BridgeAddress](#getl2bridgeaddress)
- [getL2CanonicalBridgeAddress](#getl2canonicalbridgeaddress)
- [getL2CanonicalTokenAddress](#getl2canonicaltokenaddress)
- [getL2HopBridgeTokenAddress](#getl2hopbridgetokenaddress)
- [getL2HopToken](#getl2hoptoken)
- [getL2SaddleLpTokenAddress](#getl2saddlelptokenaddress)
- [getL2SaddleSwapAddress](#getl2saddleswapaddress)
- [getLpFees](#getlpfees)
- [getOptimismL1Fee](#getoptimisml1fee)
- [getRequiredLiquidity](#getrequiredliquidity)
- [getReservesTotal](#getreservestotal)
- [getS3ConfigData](#gets3configdata)
- [getSaddleLpToken](#getsaddlelptoken)
- [getSaddleSwapReserves](#getsaddleswapreserves)
- [getSendApprovalAddress](#getsendapprovaladdress)
- [getSendData](#getsenddata)
- [getSendEstimatedGasCost](#getsendestimatedgascost)
- [getSignerAddress](#getsigneraddress)
- [getSignerOrProvider](#getsignerorprovider)
- [getSupportedAssets](#getsupportedassets)
- [getSupportedAssetsForChain](#getsupportedassetsforchain)
- [getTimeSlot](#gettimeslot)
- [getTokenImage](#gettokenimage)
- [getTokenSymbol](#gettokensymbol)
- [getTotalDebit](#gettotaldebit)
- [getTotalFee](#gettotalfee)
- [getUnbondedTransferRootAmount](#getunbondedtransferrootamount)
- [getVaultBalance](#getvaultbalance)
- [init](#init)
- [isNativeToken](#isnativetoken)
- [isSupportedAsset](#issupportedasset)
- [isValidChain](#isvalidchain)
- [isValidNetwork](#isvalidnetwork)
- [populateBondWithdrawalTx](#populatebondwithdrawaltx)
- [populateSendApprovalTx](#populatesendapprovaltx)
- [populateSendHTokensTx](#populatesendhtokenstx)
- [populateSendTx](#populatesendtx)
- [removeLiquidity](#removeliquidity)
- [removeLiquidityImbalance](#removeliquidityimbalance)
- [removeLiquidityOneToken](#removeliquidityonetoken)
- [send](#send)
- [sendApproval](#sendapproval)
- [sendHToken](#sendhtoken)
- [setChainProvider](#setchainprovider)
- [setChainProviderUrls](#setchainproviderurls)
- [setChainProviders](#setchainproviders)
- [setConfigAddresses](#setconfigaddresses)
- [setGasPriceMultiplier](#setgaspricemultiplier)
- [shouldAttemptSwap](#shouldattemptswap)
- [timeSlotSize](#timeslotsize)
- [timeSlotToAmountBonded](#timeslottoamountbonded)
- [toCanonicalToken](#tocanonicaltoken)
- [toChainModel](#tochainmodel)
- [toHopToken](#tohoptoken)
- [toTokenModel](#totokenmodel)
- [txOverrides](#txoverrides)
- [withdraw](#withdraw)

### Constructors

#### <a id="constructor" name="constructor"></a> constructor

• **new HopBridge**(`network`, `signer`, `token`, `chainProviders?`)

**`desc`** Instantiates Hop Bridge.
Returns a new Hop Bridge instance.

**`example`**
```js
import { HopBridge, Chain, Token } from '@hop-protocol/sdk'
import { Wallet } from 'ethers'

const signer = new Wallet(privateKey)
const bridge = new HopBridge('kovan', signer, Token.USDC, Chain.Optimism, Chain.Gnosis)
```

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `network` | `string` | L1 network name (e.g. 'mainnet', 'kovan', 'goerli') |
| `signer` | [`TProvider`](#tprovider) | Ethers `Signer` for signing transactions. |
| `token` | [`TToken`](#ttoken) | Token symbol or model |
| `chainProviders?` | `ChainProviders` | - |

##### Overrides

Base.constructor

### Properties

#### <a id="chainproviders" name="chainproviders"></a> chainProviders

• **chainProviders**: `ChainProviders` = `{}`

##### Inherited from

Base.chainProviders

___

#### <a id="defaultdeadlineminutes" name="defaultdeadlineminutes"></a> defaultDeadlineMinutes

• **defaultDeadlineMinutes**: `number`

Default deadline for transfers

___

#### <a id="destinationchain" name="destinationchain"></a> destinationChain

• **destinationChain**: [`Chain`](#classeschainmd)

Destination Chain model

___

#### <a id="destinationfeegaspricemultiplier" name="destinationfeegaspricemultiplier"></a> destinationFeeGasPriceMultiplier

• **destinationFeeGasPriceMultiplier**: `number` = `1`

##### Inherited from

Base.destinationFeeGasPriceMultiplier

___

#### <a id="fees" name="fees"></a> fees

• **fees**: `Object`

##### Index signature

▪ [token: `string`]: `Record`<`string`, `number`\>

##### Inherited from

Base.fees

___

#### <a id="gaspricemultiplier" name="gaspricemultiplier"></a> gasPriceMultiplier

• **gasPriceMultiplier**: `number` = `0`

##### Inherited from

Base.gasPriceMultiplier

___

#### <a id="getcontract" name="getcontract"></a> getContract

• **getContract**: (`factory`: `Factory`, `address`: `string`, `provider`: [`TProvider`](#tprovider)) => `Promise`<`any`\> = `getContract`

##### Type declaration

▸ (`factory`, `address`, `provider`): `Promise`<`any`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `factory` | `Factory` |
| `address` | `string` |
| `provider` | [`TProvider`](#tprovider) |

###### Returns

`Promise`<`any`\>

##### Inherited from

Base.getContract

___

#### <a id="network" name="network"></a> network

• **network**: `string`

Network name

##### Inherited from

Base.network

___

#### <a id="pricefeed" name="pricefeed"></a> priceFeed

• `Readonly` **priceFeed**: `PriceFeed`

___

#### <a id="signer" name="signer"></a> signer

• **signer**: [`TProvider`](#tprovider)

Ethers signer or provider

##### Inherited from

Base.signer

___

#### <a id="sourcechain" name="sourcechain"></a> sourceChain

• **sourceChain**: [`Chain`](#classeschainmd)

Source Chain model

### Accessors

#### <a id="defaultdeadlineseconds" name="defaultdeadlineseconds"></a> defaultDeadlineSeconds

• `get` **defaultDeadlineSeconds**(): `number`

**`readonly`**

**`desc`** The default deadline to use in seconds.

##### Returns

`number`

Deadline in seconds

___

#### <a id="supportedchains" name="supportedchains"></a> supportedChains

• `get` **supportedChains**(): `string`[]

##### Returns

`string`[]

##### Inherited from

Base.supportedChains

___

#### <a id="supportednetworks" name="supportednetworks"></a> supportedNetworks

• `get` **supportedNetworks**(): `string`[]

##### Returns

`string`[]

##### Inherited from

Base.supportedNetworks

### Methods

#### <a id="_getbonderaddress" name="_getbonderaddress"></a> \_getBonderAddress

▸ `Protected` **_getBonderAddress**(`token`, `sourceChain`, `destinationChain`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `sourceChain` | [`TChain`](#tchain) |
| `destinationChain` | [`TChain`](#tchain) |

##### Returns

`string`

##### Inherited from

Base.\_getBonderAddress

___

#### <a id="addliquidity" name="addliquidity"></a> addLiquidity

▸ **addLiquidity**(`amount0Desired`, `amount1Desired`, `chain?`, `options?`): `Promise`<`TransactionResponse`\>

**`desc`** Sends transaction to add liquidity to AMM.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `amount0Desired` | `BigNumberish` | Amount of token #0 in smallest unit |
| `amount1Desired` | `BigNumberish` | Amount of token #1 in smallest unit |
| `chain?` | [`TChain`](#tchain) | Chain model of desired chain to add liquidity to. |
| `options` | `Partial`<`AddLiquidityOptions`\> | Method options. |

##### Returns

`Promise`<`TransactionResponse`\>

Ethers transaction object.

___

#### <a id="calculatewithdrawonetoken" name="calculatewithdrawonetoken"></a> calculateWithdrawOneToken

▸ **calculateWithdrawOneToken**(`tokenAmount`, `tokenIndex`, `chain?`): `Promise`<`BigNumber`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `tokenAmount` | `BigNumberish` |
| `tokenIndex` | `number` |
| `chain?` | [`TChain`](#tchain) |

##### Returns

`Promise`<`BigNumber`\>

___

#### <a id="challengeperiod" name="challengeperiod"></a> challengePeriod

▸ **challengePeriod**(): `Promise`<`BigNumber`\>

**`readonly`**

**`desc`** The challenge period.

##### Returns

`Promise`<`BigNumber`\>

The challenge period for the bridge as BigNumber.

___

#### <a id="connect" name="connect"></a> connect

▸ **connect**(`signer`): [`HopBridge`](#classeshopbridgemd)

**`desc`** Returns hop bridge instance with signer connected. Used for adding or changing signer.

**`example`**
```js
import { Hop, Token } from '@hop-protocol/sdk'
import { Wallet } from 'ethers'

const signer = new Wallet(privateKey)
let hop = new Hop()
// ...
const bridge = hop.bridge(Token.USDC).connect(signer)
```

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` | Ethers `Signer` for signing transactions. |

##### Returns

[`HopBridge`](#classeshopbridgemd)

New HopBridge SDK instance with connected signer.

___

#### <a id="estimatebondwithdrawalgaslimit" name="estimatebondwithdrawalgaslimit"></a> estimateBondWithdrawalGasLimit

▸ **estimateBondWithdrawalGasLimit**(`sourceChain`, `destinationChain`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `sourceChain` | [`TChain`](#tchain) |
| `destinationChain` | [`TChain`](#tchain) |

##### Returns

`Promise`<`any`\>

___

#### <a id="estimateoptimisml1feefromdata" name="estimateoptimisml1feefromdata"></a> estimateOptimismL1FeeFromData

▸ **estimateOptimismL1FeeFromData**(`gasLimit`, `data?`, `to?`): `Promise`<`any`\>

##### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `gasLimit` | `BigNumberish` | `undefined` |
| `data` | `string` | `'0x'` |
| `to` | `string` | `constants.AddressZero` |

##### Returns

`Promise`<`any`\>

##### Inherited from

Base.estimateOptimismL1FeeFromData

___

#### <a id="estimatesendgaslimit" name="estimatesendgaslimit"></a> estimateSendGasLimit

▸ **estimateSendGasLimit**(`tokenAmount`, `sourceChain`, `destinationChain`, `options?`): `Promise`<`BigNumber`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `tokenAmount` | `BigNumberish` |
| `sourceChain` | [`TChain`](#tchain) |
| `destinationChain` | [`TChain`](#tchain) |
| `options` | `Partial`<`SendOptions`\> |

##### Returns

`Promise`<`BigNumber`\>

___

#### <a id="estimatesendhtokensgaslimit" name="estimatesendhtokensgaslimit"></a> estimateSendHTokensGasLimit

▸ **estimateSendHTokensGasLimit**(`tokenAmount`, `sourceChain`, `destinationChain`, `options?`): `Promise`<`BigNumber`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `tokenAmount` | `BigNumberish` |
| `sourceChain` | [`TChain`](#tchain) |
| `destinationChain` | [`TChain`](#tchain) |
| `options` | `Partial`<`SendOptions`\> |

##### Returns

`Promise`<`BigNumber`\>

___

#### <a id="execsaddleswap" name="execsaddleswap"></a> execSaddleSwap

▸ **execSaddleSwap**(`sourceChain`, `toHop`, `amount`, `minAmountOut`, `deadline`): `Promise`<`ContractTransaction`\>

**`desc`** Sends transaction to execute swap on Saddle contract.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sourceChain` | [`TChain`](#tchain) | Source chain model. |
| `toHop` | `boolean` | Converts to Hop token only if set to true. |
| `amount` | `BigNumberish` | Amount of token to swap. |
| `minAmountOut` | `BigNumberish` | Minimum amount of tokens to receive in order for transaction to be successful. |
| `deadline` | `BigNumberish` | Transaction deadline in seconds. |

##### Returns

`Promise`<`ContractTransaction`\>

Ethers transaction object.

___

#### <a id="getambbridge" name="getambbridge"></a> getAmbBridge

▸ **getAmbBridge**(`chain`): `Promise`<`L1HomeAMBNativeToErc20`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](#tchain) |

##### Returns

`Promise`<`L1HomeAMBNativeToErc20`\>

___

#### <a id="getamm" name="getamm"></a> getAmm

▸ **getAmm**(`chain`): [`AMM`](#classesammmd)

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](#tchain) |

##### Returns

[`AMM`](#classesammmd)

___

#### <a id="getammdata" name="getammdata"></a> getAmmData

▸ **getAmmData**(`chain`, `amountIn`, `isToHToken`, `slippageTolerance`): `Promise`<{ `amountOutMin`: `BigNumber` ; `lpFeeAmount`: `BigNumber` ; `priceImpact`: `number` ; `rate`: `number`  }\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](#tchain) |
| `amountIn` | `BigNumberish` |
| `isToHToken` | `boolean` |
| `slippageTolerance` | `number` |

##### Returns

`Promise`<{ `amountOutMin`: `BigNumber` ; `lpFeeAmount`: `BigNumber` ; `priceImpact`: `number` ; `rate`: `number`  }\>

___

#### <a id="getammwrapper" name="getammwrapper"></a> getAmmWrapper

▸ **getAmmWrapper**(`chain`, `signer?`): `Promise`<`L2AmmWrapper`\>

**`desc`** Returns Hop Bridge AMM wrapper Ethers contract instance.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chain` | [`TChain`](#tchain) | Chain model. |
| `signer` | [`TProvider`](#tprovider) | Ethers signer |

##### Returns

`Promise`<`L2AmmWrapper`\>

Ethers contract instance.

___

#### <a id="getamountout" name="getamountout"></a> getAmountOut

▸ **getAmountOut**(`tokenAmountIn`, `sourceChain?`, `destinationChain?`): `Promise`<`BigNumber`\>

**`desc`** Estimate token amount out.

**`example`**
```js
import { Hop, Chain } from '@hop-protocol/sdk'

const hop = new Hop()
const bridge = hop.connect(signer).bridge('USDC')
const amountOut = await bridge.getAmountOut('1000000000000000000', Chain.Optimism, Chain.Gnosis)
console.log(amountOut)
```

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tokenAmountIn` | `BigNumberish` | Token amount input. |
| `sourceChain?` | [`TChain`](#tchain) | Source chain model. |
| `destinationChain?` | [`TChain`](#tchain) | Destination chain model. |

##### Returns

`Promise`<`BigNumber`\>

Amount as BigNumber.

___

#### <a id="getarbchainaddress" name="getarbchainaddress"></a> getArbChainAddress

▸ **getArbChainAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getArbChainAddress

___

#### <a id="getavailableliquidity" name="getavailableliquidity"></a> getAvailableLiquidity

▸ **getAvailableLiquidity**(`destinationChain`, `bonder`): `Promise`<`BigNumber`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `destinationChain` | [`TChain`](#tchain) |
| `bonder` | `string` |

##### Returns

`Promise`<`BigNumber`\>

___

#### <a id="getbonderaddress" name="getbonderaddress"></a> getBonderAddress

▸ **getBonderAddress**(`sourceChain`, `destinationChain`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `sourceChain` | [`TChain`](#tchain) |
| `destinationChain` | [`TChain`](#tchain) |

##### Returns

`string`

___

#### <a id="getbonderavailableliquiditydata" name="getbonderavailableliquiditydata"></a> getBonderAvailableLiquidityData

▸ **getBonderAvailableLiquidityData**(): `Promise`<`any`\>

##### Returns

`Promise`<`any`\>

___

#### <a id="getbridgecontract" name="getbridgecontract"></a> getBridgeContract

▸ **getBridgeContract**(`chain`): `Promise`<`Contract`\>

**`desc`** Returns bridge contract instance for specified chain.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chain` | [`TChain`](#tchain) | chain model. |

##### Returns

`Promise`<`Contract`\>

Ethers contract instance.

___

#### <a id="getbumpedgasprice" name="getbumpedgasprice"></a> getBumpedGasPrice

▸ **getBumpedGasPrice**(`signer`, `percent`): `Promise`<`BigNumber`\>

**`desc`** Calculates current gas price plus increased percentage amount.

**`example`**
```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
const bumpedGasPrice = await hop.getBumpedGasPrice(signer, 1.20)
console.log(bumpedGasPrice.toNumber())
```

##### Parameters

| Name | Type |
| :------ | :------ |
| `signer` | [`TProvider`](#tprovider) |
| `percent` | `number` |

##### Returns

`Promise`<`BigNumber`\>

Bumped as price as BigNumber

##### Inherited from

Base.getBumpedGasPrice

___

#### <a id="getcanonicaltoken" name="getcanonicaltoken"></a> getCanonicalToken

▸ **getCanonicalToken**(`chain`): [`Token`](#classestokenmd)

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](#tchain) |

##### Returns

[`Token`](#classestokenmd)

___

#### <a id="getchainid" name="getchainid"></a> getChainId

▸ **getChainId**(`chain`): `number`

**`desc`** Returns Chain ID for specified Chain model.

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`Chain`](#classeschainmd) |

##### Returns

`number`

- Chain ID.

##### Inherited from

Base.getChainId

___

#### <a id="getchainnativetoken" name="getchainnativetoken"></a> getChainNativeToken

▸ **getChainNativeToken**(`chain`): [`TokenModel`](#classestokenmodelmd)

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](#tchain) |

##### Returns

[`TokenModel`](#classestokenmodelmd)

___

#### <a id="getchainprovider" name="getchainprovider"></a> getChainProvider

▸ **getChainProvider**(`chain`): `Provider`

**`desc`** Returns Ethers provider for specified Chain model.

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | `string` \| [`Chain`](#classeschainmd) |

##### Returns

`Provider`

- Ethers provider.

##### Inherited from

Base.getChainProvider

___

#### <a id="getchainproviderurls" name="getchainproviderurls"></a> getChainProviderUrls

▸ **getChainProviderUrls**(): `Record`<`string`, `string`\>

##### Returns

`Record`<`string`, `string`\>

##### Inherited from

Base.getChainProviderUrls

___

#### <a id="getchainproviders" name="getchainproviders"></a> getChainProviders

▸ **getChainProviders**(): `Record`<`string`, `Provider`\>

##### Returns

`Record`<`string`, `Provider`\>

##### Inherited from

Base.getChainProviders

___

#### <a id="getconfigaddresses" name="getconfigaddresses"></a> getConfigAddresses

▸ **getConfigAddresses**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getConfigAddresses

___

#### <a id="getcredit" name="getcredit"></a> getCredit

▸ **getCredit**(`sourceChain`, `bonder`): `Promise`<`BigNumber`\>

**`desc`** Returns total credit that bonder holds on Hop bridge at specified chain.

##### Parameters

| Name | Type |
| :------ | :------ |
| `sourceChain` | [`TChain`](#tchain) |
| `bonder` | `string` |

##### Returns

`Promise`<`BigNumber`\>

Total credit as BigNumber.

___

#### <a id="getdebit" name="getdebit"></a> getDebit

▸ **getDebit**(`sourceChain`, `bonder`): `Promise`<`BigNumber`\>

**`desc`** Returns total debit that bonder holds on Hop bridge at specified chain.

##### Parameters

| Name | Type |
| :------ | :------ |
| `sourceChain` | [`TChain`](#tchain) |
| `bonder` | `string` |

##### Returns

`Promise`<`BigNumber`\>

Total debit as BigNumber.

___

#### <a id="getdestinationtransactionfee" name="getdestinationtransactionfee"></a> getDestinationTransactionFee

▸ **getDestinationTransactionFee**(`sourceChain`, `destinationChain`): `Promise`<`BigNumber`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `sourceChain` | [`TChain`](#tchain) |
| `destinationChain` | [`TChain`](#tchain) |

##### Returns

`Promise`<`BigNumber`\>

___

#### <a id="getethbalance" name="getethbalance"></a> getEthBalance

▸ **getEthBalance**(`chain?`, `address?`): `Promise`<`BigNumber`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](#tchain) |
| `address?` | `string` |

##### Returns

`Promise`<`BigNumber`\>

___

#### <a id="getfeebps" name="getfeebps"></a> getFeeBps

▸ **getFeeBps**(`token`, `destinationChain`): `number`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `destinationChain` | [`TChain`](#tchain) |

##### Returns

`number`

##### Inherited from

Base.getFeeBps

___

#### <a id="getfrontendavailableliquidity" name="getfrontendavailableliquidity"></a> getFrontendAvailableLiquidity

▸ **getFrontendAvailableLiquidity**(`sourceChain`, `destinationChain`): `Promise`<`BigNumber`\>

**`desc`** Returns available liquidity for Hop bridge at specified chain.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sourceChain` | [`TChain`](#tchain) | Source chain model. |
| `destinationChain` | [`TChain`](#tchain) | Destination chain model. |

##### Returns

`Promise`<`BigNumber`\>

Available liquidity as BigNumber.

___

#### <a id="getl1ambbridgeaddress" name="getl1ambbridgeaddress"></a> getL1AmbBridgeAddress

▸ **getL1AmbBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1AmbBridgeAddress

___

#### <a id="getl1bridge" name="getl1bridge"></a> getL1Bridge

▸ **getL1Bridge**(`signer?`): `Promise`<`L1ERC20Bridge`\>

**`desc`** Returns Hop L1 Bridge Ethers contract instance.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | [`TProvider`](#tprovider) | Ethers signer |

##### Returns

`Promise`<`L1ERC20Bridge`\>

Ethers contract instance.

___

#### <a id="getl1bridgeaddress" name="getl1bridgeaddress"></a> getL1BridgeAddress

▸ **getL1BridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1BridgeAddress

___

#### <a id="getl1canonicalbridgeaddress" name="getl1canonicalbridgeaddress"></a> getL1CanonicalBridgeAddress

▸ **getL1CanonicalBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1CanonicalBridgeAddress

___

#### <a id="getl1canonicaltokenaddress" name="getl1canonicaltokenaddress"></a> getL1CanonicalTokenAddress

▸ **getL1CanonicalTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1CanonicalTokenAddress

___

#### <a id="getl1poserc20predicateaddress" name="getl1poserc20predicateaddress"></a> getL1PosErc20PredicateAddress

▸ **getL1PosErc20PredicateAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1PosErc20PredicateAddress

___

#### <a id="getl1posrootchainmanageraddress" name="getl1posrootchainmanageraddress"></a> getL1PosRootChainManagerAddress

▸ **getL1PosRootChainManagerAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1PosRootChainManagerAddress

___

#### <a id="getl1token" name="getl1token"></a> getL1Token

▸ **getL1Token**(): [`Token`](#classestokenmd)

##### Returns

[`Token`](#classestokenmd)

___

#### <a id="getl2ambbridgeaddress" name="getl2ambbridgeaddress"></a> getL2AmbBridgeAddress

▸ **getL2AmbBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2AmbBridgeAddress

___

#### <a id="getl2ammwrapperaddress" name="getl2ammwrapperaddress"></a> getL2AmmWrapperAddress

▸ **getL2AmmWrapperAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2AmmWrapperAddress

___

#### <a id="getl2bridge" name="getl2bridge"></a> getL2Bridge

▸ **getL2Bridge**(`chain`, `signer?`): `Promise`<`L2Bridge`\>

**`desc`** Returns Hop L2 Bridge Ethers contract instance.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chain` | [`TChain`](#tchain) | Chain model. |
| `signer` | [`TProvider`](#tprovider) | Ethers signer |

##### Returns

`Promise`<`L2Bridge`\>

Ethers contract instance.

___

#### <a id="getl2bridgeaddress" name="getl2bridgeaddress"></a> getL2BridgeAddress

▸ **getL2BridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2BridgeAddress

___

#### <a id="getl2canonicalbridgeaddress" name="getl2canonicalbridgeaddress"></a> getL2CanonicalBridgeAddress

▸ **getL2CanonicalBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2CanonicalBridgeAddress

___

#### <a id="getl2canonicaltokenaddress" name="getl2canonicaltokenaddress"></a> getL2CanonicalTokenAddress

▸ **getL2CanonicalTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2CanonicalTokenAddress

___

#### <a id="getl2hopbridgetokenaddress" name="getl2hopbridgetokenaddress"></a> getL2HopBridgeTokenAddress

▸ **getL2HopBridgeTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2HopBridgeTokenAddress

___

#### <a id="getl2hoptoken" name="getl2hoptoken"></a> getL2HopToken

▸ **getL2HopToken**(`chain`): [`Token`](#classestokenmd)

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](#tchain) |

##### Returns

[`Token`](#classestokenmd)

___

#### <a id="getl2saddlelptokenaddress" name="getl2saddlelptokenaddress"></a> getL2SaddleLpTokenAddress

▸ **getL2SaddleLpTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2SaddleLpTokenAddress

___

#### <a id="getl2saddleswapaddress" name="getl2saddleswapaddress"></a> getL2SaddleSwapAddress

▸ **getL2SaddleSwapAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2SaddleSwapAddress

___

#### <a id="getlpfees" name="getlpfees"></a> getLpFees

▸ **getLpFees**(`amountIn`, `sourceChain`, `destinationChain`): `Promise`<`BigNumber`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `amountIn` | `BigNumberish` |
| `sourceChain` | [`TChain`](#tchain) |
| `destinationChain` | [`TChain`](#tchain) |

##### Returns

`Promise`<`BigNumber`\>

___

#### <a id="getoptimisml1fee" name="getoptimisml1fee"></a> getOptimismL1Fee

▸ **getOptimismL1Fee**(`sourceChain`, `destinationChain`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `sourceChain` | [`TChain`](#tchain) |
| `destinationChain` | [`TChain`](#tchain) |

##### Returns

`Promise`<`any`\>

___

#### <a id="getrequiredliquidity" name="getrequiredliquidity"></a> getRequiredLiquidity

▸ **getRequiredLiquidity**(`tokenAmountIn`, `sourceChain`): `Promise`<`BigNumber`\>

**`desc`** Estimate the bonder liquidity needed at the destination.

**`example`**
```js
import { Hop, Chain } from '@hop-protocol/sdk'

const hop = new Hop()
const bridge = hop.connect(signer).bridge('USDC')
const requiredLiquidity = await bridge.getRequiredLiquidity('1000000000000000000', Chain.Optimism, Chain.Gnosis)
console.log(requiredLiquidity)
```

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tokenAmountIn` | `BigNumberish` | Token amount input. |
| `sourceChain` | [`TChain`](#tchain) | Source chain model. |

##### Returns

`Promise`<`BigNumber`\>

Amount as BigNumber.

___

#### <a id="getreservestotal" name="getreservestotal"></a> getReservesTotal

▸ **getReservesTotal**(`chain?`): `Promise`<`BigNumber`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](#tchain) |

##### Returns

`Promise`<`BigNumber`\>

___

#### <a id="gets3configdata" name="gets3configdata"></a> getS3ConfigData

▸ **getS3ConfigData**(): `Promise`<`any`\>

##### Returns

`Promise`<`any`\>

##### Inherited from

Base.getS3ConfigData

___

#### <a id="getsaddlelptoken" name="getsaddlelptoken"></a> getSaddleLpToken

▸ **getSaddleLpToken**(`chain`, `signer?`): [`Token`](#classestokenmd)

**`desc`** Returns Hop Bridge Saddle Swap LP Token Ethers contract instance.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chain` | [`TChain`](#tchain) | Chain model. |
| `signer` | [`TProvider`](#tprovider) | Ethers signer |

##### Returns

[`Token`](#classestokenmd)

Ethers contract instance.

___

#### <a id="getsaddleswapreserves" name="getsaddleswapreserves"></a> getSaddleSwapReserves

▸ **getSaddleSwapReserves**(`chain?`): `Promise`<[`BigNumber`, `BigNumber`]\>

**`desc`** Returns Hop Bridge Saddle reserve amounts.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chain` | [`TChain`](#tchain) | Chain model. |

##### Returns

`Promise`<[`BigNumber`, `BigNumber`]\>

Array containing reserve amounts for canonical token
and hTokens.

___

#### <a id="getsendapprovaladdress" name="getsendapprovaladdress"></a> getSendApprovalAddress

▸ **getSendApprovalAddress**(`sourceChain`, `isHTokenTransfer?`): `any`

##### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `sourceChain` | [`TChain`](#tchain) | `undefined` |
| `isHTokenTransfer` | `boolean` | `false` |

##### Returns

`any`

___

#### <a id="getsenddata" name="getsenddata"></a> getSendData

▸ **getSendData**(`amountIn`, `sourceChain`, `destinationChain`, `isHTokenSend?`): `Promise`<{ `adjustedBonderFee`: `BigNumber` ; `adjustedDestinationTxFee`: `BigNumber` ; `amountOut`: `BigNumber` ; `estimatedReceived`: `BigNumber` ; `lpFees`: `BigNumber` ; `priceImpact`: `number` ; `rate`: `number` ; `requiredLiquidity`: `BigNumber` = hTokenAmount; `totalFee`: `BigNumber`  }\>

##### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `amountIn` | `BigNumberish` | `undefined` |
| `sourceChain` | [`TChain`](#tchain) | `undefined` |
| `destinationChain` | [`TChain`](#tchain) | `undefined` |
| `isHTokenSend` | `boolean` | `false` |

##### Returns

`Promise`<{ `adjustedBonderFee`: `BigNumber` ; `adjustedDestinationTxFee`: `BigNumber` ; `amountOut`: `BigNumber` ; `estimatedReceived`: `BigNumber` ; `lpFees`: `BigNumber` ; `priceImpact`: `number` ; `rate`: `number` ; `requiredLiquidity`: `BigNumber` = hTokenAmount; `totalFee`: `BigNumber`  }\>

___

#### <a id="getsendestimatedgascost" name="getsendestimatedgascost"></a> getSendEstimatedGasCost

▸ **getSendEstimatedGasCost**(`tokenAmount`, `sourceChain`, `destinationChain`, `options?`): `Promise`<`BigNumber`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `tokenAmount` | `BigNumberish` |
| `sourceChain` | [`TChain`](#tchain) |
| `destinationChain` | [`TChain`](#tchain) |
| `options` | `Partial`<`SendOptions`\> |

##### Returns

`Promise`<`BigNumber`\>

___

#### <a id="getsigneraddress" name="getsigneraddress"></a> getSignerAddress

▸ **getSignerAddress**(): `Promise`<`string`\>

**`desc`** Returns the connected signer address.

**`example`**
```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
const address = await hop.getSignerAddress()
console.log(address)
```

##### Returns

`Promise`<`string`\>

Ethers signer address.

##### Inherited from

Base.getSignerAddress

___

#### <a id="getsignerorprovider" name="getsignerorprovider"></a> getSignerOrProvider

▸ **getSignerOrProvider**(`chain`, `signer?`): `Promise`<`Signer` \| `Provider`\>

**`desc`** Returns the connected signer if it's connected to the specified
chain id, otherwise it returns a regular provider for the specified chain.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chain` | [`TChain`](#tchain) | Chain name or model |
| `signer` | [`TProvider`](#tprovider) | Ethers signer or provider |

##### Returns

`Promise`<`Signer` \| `Provider`\>

Ethers signer or provider

##### Inherited from

Base.getSignerOrProvider

___

#### <a id="getsupportedassets" name="getsupportedassets"></a> getSupportedAssets

▸ **getSupportedAssets**(): `any`

##### Returns

`any`

##### Inherited from

Base.getSupportedAssets

___

#### <a id="getsupportedassetsforchain" name="getsupportedassetsforchain"></a> getSupportedAssetsForChain

▸ **getSupportedAssetsForChain**(`chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getSupportedAssetsForChain

___

#### <a id="gettimeslot" name="gettimeslot"></a> getTimeSlot

▸ **getTimeSlot**(`time`): `Promise`<`BigNumber`\>

**`readonly`**

**`desc`** The time slot for the current time.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `time` | `BigNumberish` | Unix timestamp (in seconds) to get the time slot. |

##### Returns

`Promise`<`BigNumber`\>

Time slot for the given time as BigNumber.

___

#### <a id="gettokenimage" name="gettokenimage"></a> getTokenImage

▸ **getTokenImage**(): `string`

##### Returns

`string`

___

#### <a id="gettokensymbol" name="gettokensymbol"></a> getTokenSymbol

▸ **getTokenSymbol**(): `string`

##### Returns

`string`

___

#### <a id="gettotaldebit" name="gettotaldebit"></a> getTotalDebit

▸ **getTotalDebit**(`sourceChain`, `bonder`): `Promise`<`BigNumber`\>

**`desc`** Returns total debit, including sliding window debit, that bonder holds on Hop bridge at specified chain.

##### Parameters

| Name | Type |
| :------ | :------ |
| `sourceChain` | [`TChain`](#tchain) |
| `bonder` | `string` |

##### Returns

`Promise`<`BigNumber`\>

Total debit as BigNumber.

___

#### <a id="gettotalfee" name="gettotalfee"></a> getTotalFee

▸ **getTotalFee**(`amountIn`, `sourceChain`, `destinationChain`): `Promise`<`BigNumber`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `amountIn` | `BigNumberish` |
| `sourceChain` | [`TChain`](#tchain) |
| `destinationChain` | [`TChain`](#tchain) |

##### Returns

`Promise`<`BigNumber`\>

___

#### <a id="getunbondedtransferrootamount" name="getunbondedtransferrootamount"></a> getUnbondedTransferRootAmount

▸ **getUnbondedTransferRootAmount**(`sourceChain`, `destinationChain`): `Promise`<`BigNumber`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `sourceChain` | [`TChain`](#tchain) |
| `destinationChain` | [`TChain`](#tchain) |

##### Returns

`Promise`<`BigNumber`\>

___

#### <a id="getvaultbalance" name="getvaultbalance"></a> getVaultBalance

▸ **getVaultBalance**(`destinationChain`, `bonder`): `Promise`<`BigNumber`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `destinationChain` | [`TChain`](#tchain) |
| `bonder` | `string` |

##### Returns

`Promise`<`BigNumber`\>

___

#### <a id="init" name="init"></a> init

▸ **init**(): `Promise`<`void`\>

##### Returns

`Promise`<`void`\>

##### Inherited from

Base.init

___

#### <a id="isnativetoken" name="isnativetoken"></a> isNativeToken

▸ **isNativeToken**(`chain?`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain?` | [`TChain`](#tchain) |

##### Returns

`boolean`

___

#### <a id="issupportedasset" name="issupportedasset"></a> isSupportedAsset

▸ **isSupportedAsset**(`chain`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](#tchain) |

##### Returns

`boolean`

___

#### <a id="isvalidchain" name="isvalidchain"></a> isValidChain

▸ **isValidChain**(`chain`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | `string` |

##### Returns

`boolean`

##### Inherited from

Base.isValidChain

___

#### <a id="isvalidnetwork" name="isvalidnetwork"></a> isValidNetwork

▸ **isValidNetwork**(`network`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `network` | `string` |

##### Returns

`boolean`

##### Inherited from

Base.isValidNetwork

___

#### <a id="populatebondwithdrawaltx" name="populatebondwithdrawaltx"></a> populateBondWithdrawalTx

▸ **populateBondWithdrawalTx**(`sourceChain`, `destinationChain`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `sourceChain` | [`TChain`](#tchain) |
| `destinationChain` | [`TChain`](#tchain) |

##### Returns

`Promise`<`any`\>

___

#### <a id="populatesendapprovaltx" name="populatesendapprovaltx"></a> populateSendApprovalTx

▸ **populateSendApprovalTx**(`tokenAmount`, `sourceChain`, `isHTokenTransfer?`): `Promise`<`any`\>

##### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `tokenAmount` | `BigNumberish` | `undefined` |
| `sourceChain` | [`TChain`](#tchain) | `undefined` |
| `isHTokenTransfer` | `boolean` | `false` |

##### Returns

`Promise`<`any`\>

___

#### <a id="populatesendhtokenstx" name="populatesendhtokenstx"></a> populateSendHTokensTx

▸ **populateSendHTokensTx**(`tokenAmount`, `sourceChain`, `destinationChain`, `options?`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `tokenAmount` | `BigNumberish` |
| `sourceChain` | [`TChain`](#tchain) |
| `destinationChain` | [`TChain`](#tchain) |
| `options` | `Partial`<`SendOptions`\> |

##### Returns

`Promise`<`any`\>

___

#### <a id="populatesendtx" name="populatesendtx"></a> populateSendTx

▸ **populateSendTx**(`tokenAmount`, `sourceChain?`, `destinationChain?`, `options?`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `tokenAmount` | `BigNumberish` |
| `sourceChain?` | [`TChain`](#tchain) |
| `destinationChain?` | [`TChain`](#tchain) |
| `options` | `Partial`<`SendOptions`\> |

##### Returns

`Promise`<`any`\>

___

#### <a id="removeliquidity" name="removeliquidity"></a> removeLiquidity

▸ **removeLiquidity**(`liquidityTokenAmount`, `chain?`, `options?`): `Promise`<`TransactionResponse`\>

**`desc`** Sends transaction to remove liquidity from AMM.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `liquidityTokenAmount` | `BigNumberish` | Amount of LP tokens to burn. |
| `chain?` | [`TChain`](#tchain) | Chain model of desired chain to add liquidity to. |
| `options` | `Partial`<`RemoveLiquidityOptions`\> | Method options. |

##### Returns

`Promise`<`TransactionResponse`\>

Ethers transaction object.

___

#### <a id="removeliquidityimbalance" name="removeliquidityimbalance"></a> removeLiquidityImbalance

▸ **removeLiquidityImbalance**(`token0Amount`, `token1Amount`, `chain?`, `options?`): `Promise`<`ContractTransaction`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `token0Amount` | `BigNumberish` |
| `token1Amount` | `BigNumberish` |
| `chain?` | [`TChain`](#tchain) |
| `options` | `Partial`<`RemoveLiquidityImbalanceOptions`\> |

##### Returns

`Promise`<`ContractTransaction`\>

___

#### <a id="removeliquidityonetoken" name="removeliquidityonetoken"></a> removeLiquidityOneToken

▸ **removeLiquidityOneToken**(`lpTokenAmount`, `tokenIndex`, `chain?`, `options?`): `Promise`<`ContractTransaction`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `lpTokenAmount` | `BigNumberish` |
| `tokenIndex` | `number` |
| `chain?` | [`TChain`](#tchain) |
| `options` | `Partial`<`RemoveLiquidityOneTokenOptions`\> |

##### Returns

`Promise`<`ContractTransaction`\>

___

#### <a id="send" name="send"></a> send

▸ **send**(`tokenAmount`, `sourceChain?`, `destinationChain?`, `options?`): `Promise`<`TransactionResponse`\>

**`desc`** Send tokens to another chain.

**`example`**
```js
import { Hop, Chain, Token } from '@hop-protocol/sdk'

const hop = new Hop()
const bridge = hop.connect(signer).bridge(Token.USDC)
\// send 1 USDC token from Optimism -> Gnosis
const tx = await bridge.send('1000000000000000000', Chain.Optimism, Chain.Gnosis)
console.log(tx.hash)
```

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tokenAmount` | `BigNumberish` | Token amount to send denominated in smallest unit. |
| `sourceChain?` | [`TChain`](#tchain) | Source chain model. |
| `destinationChain?` | [`TChain`](#tchain) | Destination chain model. |
| `options` | `Partial`<`SendOptions`\> | - |

##### Returns

`Promise`<`TransactionResponse`\>

Ethers Transaction object.

___

#### <a id="sendapproval" name="sendapproval"></a> sendApproval

▸ **sendApproval**(`tokenAmount`, `sourceChain`, `destinationChain`, `isHTokenTransfer?`): `Promise`<`TransactionResponse`\>

##### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `tokenAmount` | `BigNumberish` | `undefined` |
| `sourceChain` | [`TChain`](#tchain) | `undefined` |
| `destinationChain` | [`TChain`](#tchain) | `undefined` |
| `isHTokenTransfer` | `boolean` | `false` |

##### Returns

`Promise`<`TransactionResponse`\>

___

#### <a id="sendhtoken" name="sendhtoken"></a> sendHToken

▸ **sendHToken**(`tokenAmount`, `sourceChain`, `destinationChain`, `options?`): `Promise`<`TransactionResponse`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `tokenAmount` | `BigNumberish` |
| `sourceChain` | [`TChain`](#tchain) |
| `destinationChain` | [`TChain`](#tchain) |
| `options` | `Partial`<`SendOptions`\> |

##### Returns

`Promise`<`TransactionResponse`\>

___

#### <a id="setchainprovider" name="setchainprovider"></a> setChainProvider

▸ **setChainProvider**(`chain`, `provider`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](#tchain) |
| `provider` | `Provider` |

##### Returns

`void`

##### Inherited from

Base.setChainProvider

___

#### <a id="setchainproviderurls" name="setchainproviderurls"></a> setChainProviderUrls

▸ **setChainProviderUrls**(`chainProviders`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `chainProviders` | `Record`<`string`, `string`\> |

##### Returns

`void`

##### Inherited from

Base.setChainProviderUrls

___

#### <a id="setchainproviders" name="setchainproviders"></a> setChainProviders

▸ **setChainProviders**(`chainProviders`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `chainProviders` | `ChainProviders` |

##### Returns

`void`

##### Inherited from

Base.setChainProviders

___

#### <a id="setconfigaddresses" name="setconfigaddresses"></a> setConfigAddresses

▸ **setConfigAddresses**(`addresses`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `addresses` | `Addresses` |

##### Returns

`void`

##### Inherited from

Base.setConfigAddresses

___

#### <a id="setgaspricemultiplier" name="setgaspricemultiplier"></a> setGasPriceMultiplier

▸ **setGasPriceMultiplier**(`gasPriceMultiplier`): `number`

##### Parameters

| Name | Type |
| :------ | :------ |
| `gasPriceMultiplier` | `number` |

##### Returns

`number`

##### Inherited from

Base.setGasPriceMultiplier

___

#### <a id="shouldattemptswap" name="shouldattemptswap"></a> shouldAttemptSwap

▸ **shouldAttemptSwap**(`amountOutMin`, `deadline`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `amountOutMin` | `BigNumber` |
| `deadline` | `BigNumberish` |

##### Returns

`boolean`

___

#### <a id="timeslotsize" name="timeslotsize"></a> timeSlotSize

▸ **timeSlotSize**(): `Promise`<`BigNumber`\>

**`readonly`**

**`desc`** The size of the time slots.

##### Returns

`Promise`<`BigNumber`\>

The size of the time slots for the bridge as BigNumber.

___

#### <a id="timeslottoamountbonded" name="timeslottoamountbonded"></a> timeSlotToAmountBonded

▸ **timeSlotToAmountBonded**(`timeSlot`, `bonder`): `Promise`<`BigNumber`\>

**`readonly`**

**`desc`** The amount bonded for a time slot for a bonder.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `timeSlot` | `BigNumberish` | Time slot to get. |
| `bonder` | `string` | Address of the bonder to check. |

##### Returns

`Promise`<`BigNumber`\>

Amount bonded for the bonder for the given time slot as BigNumber.

___

#### <a id="tocanonicaltoken" name="tocanonicaltoken"></a> toCanonicalToken

▸ **toCanonicalToken**(`token`, `network`, `chain`): [`Token`](#classestokenmd)

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `network` | `string` |
| `chain` | [`TChain`](#tchain) |

##### Returns

[`Token`](#classestokenmd)

___

#### <a id="tochainmodel" name="tochainmodel"></a> toChainModel

▸ **toChainModel**(`chain`): [`Chain`](#classeschainmd)

**`desc`** Returns a Chain model instance with connected provider.

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](#tchain) |

##### Returns

[`Chain`](#classeschainmd)

- Chain model with connected provider.

##### Inherited from

Base.toChainModel

___

#### <a id="tohoptoken" name="tohoptoken"></a> toHopToken

▸ **toHopToken**(`token`, `network`, `chain`): [`Token`](#classestokenmd)

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `network` | `string` |
| `chain` | [`TChain`](#tchain) |

##### Returns

[`Token`](#classestokenmd)

___

#### <a id="totokenmodel" name="totokenmodel"></a> toTokenModel

▸ **toTokenModel**(`token`): [`TokenModel`](#classestokenmodelmd)

**`desc`** Returns a Token instance.

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |

##### Returns

[`TokenModel`](#classestokenmodelmd)

- Token model.

##### Inherited from

Base.toTokenModel

___

#### <a id="txoverrides" name="txoverrides"></a> txOverrides

▸ **txOverrides**(`chain`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`Chain`](#classeschainmd) |

##### Returns

`Promise`<`any`\>

##### Inherited from

Base.txOverrides

___

#### <a id="withdraw" name="withdraw"></a> withdraw

▸ **withdraw**(`chain`, `recipient`, `amount`, `transferNonce`, `bonderFee`, `amountOutMin`, `deadline`, `transferRootHash`, `rootTotalAmount`, `transferIdTreeIndex`, `siblings`, `totalLeaves`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`Chain`](#classeschainmd) |
| `recipient` | `string` |
| `amount` | `BigNumberish` |
| `transferNonce` | `string` |
| `bonderFee` | `BigNumberish` |
| `amountOutMin` | `BigNumberish` |
| `deadline` | `number` |
| `transferRootHash` | `string` |
| `rootTotalAmount` | `BigNumberish` |
| `transferIdTreeIndex` | `number` |
| `siblings` | `string`[] |
| `totalLeaves` | `number` |

##### Returns

`Promise`<`any`\>


<a name="classesroutemd"></a>

## Class: Route

### Table of contents

#### Constructors

- [constructor](#constructor)

#### Properties

- [destination](#destination)
- [source](#source)

### Constructors

#### <a id="constructor" name="constructor"></a> constructor

• **new Route**(`source`, `destination`)

##### Parameters

| Name | Type |
| :------ | :------ |
| `source` | [`Chain`](#classeschainmd) |
| `destination` | [`Chain`](#classeschainmd) |

### Properties

#### <a id="destination" name="destination"></a> destination

• `Readonly` **destination**: [`Chain`](#classeschainmd)

___

#### <a id="source" name="source"></a> source

• `Readonly` **source**: [`Chain`](#classeschainmd)


<a name="classestokenmd"></a>

## Class: Token

Class reprensenting ERC20 Token

**`namespace`** Token

### Hierarchy

- `Base`

  ↳ **`Token`**

### Table of contents

#### Constructors

- [constructor](#constructor)

#### Properties

- [\_symbol](#_symbol)
- [address](#address)
- [chain](#chain)
- [chainProviders](#chainproviders)
- [contract](#contract)
- [decimals](#decimals)
- [destinationFeeGasPriceMultiplier](#destinationfeegaspricemultiplier)
- [fees](#fees)
- [gasPriceMultiplier](#gaspricemultiplier)
- [getContract](#getcontract)
- [image](#image)
- [name](#name)
- [network](#network)
- [signer](#signer)

#### Accessors

- [chainId](#chainid)
- [isNativeToken](#isnativetoken)
- [nativeTokenSymbol](#nativetokensymbol)
- [supportedChains](#supportedchains)
- [supportedNetworks](#supportednetworks)
- [symbol](#symbol)

#### Methods

- [\_getBonderAddress](#_getbonderaddress)
- [allowance](#allowance)
- [approve](#approve)
- [balanceOf](#balanceof)
- [connect](#connect)
- [eq](#eq)
- [estimateOptimismL1FeeFromData](#estimateoptimisml1feefromdata)
- [getArbChainAddress](#getarbchainaddress)
- [getBumpedGasPrice](#getbumpedgasprice)
- [getChainId](#getchainid)
- [getChainProvider](#getchainprovider)
- [getChainProviderUrls](#getchainproviderurls)
- [getChainProviders](#getchainproviders)
- [getConfigAddresses](#getconfigaddresses)
- [getErc20](#geterc20)
- [getFeeBps](#getfeebps)
- [getL1AmbBridgeAddress](#getl1ambbridgeaddress)
- [getL1BridgeAddress](#getl1bridgeaddress)
- [getL1CanonicalBridgeAddress](#getl1canonicalbridgeaddress)
- [getL1CanonicalTokenAddress](#getl1canonicaltokenaddress)
- [getL1PosErc20PredicateAddress](#getl1poserc20predicateaddress)
- [getL1PosRootChainManagerAddress](#getl1posrootchainmanageraddress)
- [getL2AmbBridgeAddress](#getl2ambbridgeaddress)
- [getL2AmmWrapperAddress](#getl2ammwrapperaddress)
- [getL2BridgeAddress](#getl2bridgeaddress)
- [getL2CanonicalBridgeAddress](#getl2canonicalbridgeaddress)
- [getL2CanonicalTokenAddress](#getl2canonicaltokenaddress)
- [getL2HopBridgeTokenAddress](#getl2hopbridgetokenaddress)
- [getL2SaddleLpTokenAddress](#getl2saddlelptokenaddress)
- [getL2SaddleSwapAddress](#getl2saddleswapaddress)
- [getNativeTokenBalance](#getnativetokenbalance)
- [getS3ConfigData](#gets3configdata)
- [getSignerAddress](#getsigneraddress)
- [getSignerOrProvider](#getsignerorprovider)
- [getSupportedAssets](#getsupportedassets)
- [getSupportedAssetsForChain](#getsupportedassetsforchain)
- [getWethContract](#getwethcontract)
- [getWrapTokenEstimatedGas](#getwraptokenestimatedgas)
- [getWrappedToken](#getwrappedtoken)
- [init](#init)
- [isValidChain](#isvalidchain)
- [isValidNetwork](#isvalidnetwork)
- [overrides](#overrides)
- [populateApproveTx](#populateapprovetx)
- [setChainProvider](#setchainprovider)
- [setChainProviderUrls](#setchainproviderurls)
- [setChainProviders](#setchainproviders)
- [setConfigAddresses](#setconfigaddresses)
- [setGasPriceMultiplier](#setgaspricemultiplier)
- [toChainModel](#tochainmodel)
- [toJSON](#tojson)
- [toTokenModel](#totokenmodel)
- [totalSupply](#totalsupply)
- [transfer](#transfer)
- [txOverrides](#txoverrides)
- [unwrapToken](#unwraptoken)
- [wrapToken](#wraptoken)
- [fromJSON](#fromjson)

### Constructors

#### <a id="constructor" name="constructor"></a> constructor

• **new Token**(`network`, `chain`, `address`, `decimals`, `symbol`, `name`, `image`, `signer?`, `chainProviders?`)

**`desc`** Instantiates Token class.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `network` | `string` | L1 network name (e.g. 'mainnet', 'kovan', 'goerli') |
| `chain` | [`TChain`](#tchain) | - |
| `address` | `string` | Token address. |
| `decimals` | `number` | Token decimals. |
| `symbol` | `string` | Token symbol. |
| `name` | `string` | Token name. |
| `image` | `string` | - |
| `signer?` | `Signer` \| `Provider` | Ethers signer. |
| `chainProviders?` | `ChainProviders` | - |

##### Overrides

Base.constructor

### Properties

#### <a id="_symbol" name="_symbol"></a> \_symbol

• **\_symbol**: `string`

___

#### <a id="address" name="address"></a> address

• `Readonly` **address**: `string`

___

#### <a id="chain" name="chain"></a> chain

• `Readonly` **chain**: [`Chain`](#classeschainmd)

___

#### <a id="chainproviders" name="chainproviders"></a> chainProviders

• **chainProviders**: `ChainProviders` = `{}`

##### Inherited from

Base.chainProviders

___

#### <a id="contract" name="contract"></a> contract

• `Readonly` **contract**: `Contract`

___

#### <a id="decimals" name="decimals"></a> decimals

• `Readonly` **decimals**: `number`

___

#### <a id="destinationfeegaspricemultiplier" name="destinationfeegaspricemultiplier"></a> destinationFeeGasPriceMultiplier

• **destinationFeeGasPriceMultiplier**: `number` = `1`

##### Inherited from

Base.destinationFeeGasPriceMultiplier

___

#### <a id="fees" name="fees"></a> fees

• **fees**: `Object`

##### Index signature

▪ [token: `string`]: `Record`<`string`, `number`\>

##### Inherited from

Base.fees

___

#### <a id="gaspricemultiplier" name="gaspricemultiplier"></a> gasPriceMultiplier

• **gasPriceMultiplier**: `number` = `0`

##### Inherited from

Base.gasPriceMultiplier

___

#### <a id="getcontract" name="getcontract"></a> getContract

• **getContract**: (`factory`: `Factory`, `address`: `string`, `provider`: [`TProvider`](#tprovider)) => `Promise`<`any`\> = `getContract`

##### Type declaration

▸ (`factory`, `address`, `provider`): `Promise`<`any`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `factory` | `Factory` |
| `address` | `string` |
| `provider` | [`TProvider`](#tprovider) |

###### Returns

`Promise`<`any`\>

##### Inherited from

Base.getContract

___

#### <a id="image" name="image"></a> image

• `Readonly` **image**: `string`

___

#### <a id="name" name="name"></a> name

• `Readonly` **name**: `string`

___

#### <a id="network" name="network"></a> network

• **network**: `string`

Network name

##### Inherited from

Base.network

___

#### <a id="signer" name="signer"></a> signer

• **signer**: [`TProvider`](#tprovider)

Ethers signer or provider

##### Inherited from

Base.signer

### Accessors

#### <a id="chainid" name="chainid"></a> chainId

• `get` **chainId**(): `void`

##### Returns

`void`

___

#### <a id="isnativetoken" name="isnativetoken"></a> isNativeToken

• `get` **isNativeToken**(): `boolean`

##### Returns

`boolean`

___

#### <a id="nativetokensymbol" name="nativetokensymbol"></a> nativeTokenSymbol

• `get` **nativeTokenSymbol**(): `string`

##### Returns

`string`

___

#### <a id="supportedchains" name="supportedchains"></a> supportedChains

• `get` **supportedChains**(): `string`[]

##### Returns

`string`[]

##### Inherited from

Base.supportedChains

___

#### <a id="supportednetworks" name="supportednetworks"></a> supportedNetworks

• `get` **supportedNetworks**(): `string`[]

##### Returns

`string`[]

##### Inherited from

Base.supportedNetworks

___

#### <a id="symbol" name="symbol"></a> symbol

• `get` **symbol**(): `string`

##### Returns

`string`

### Methods

#### <a id="_getbonderaddress" name="_getbonderaddress"></a> \_getBonderAddress

▸ `Protected` **_getBonderAddress**(`token`, `sourceChain`, `destinationChain`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `sourceChain` | [`TChain`](#tchain) |
| `destinationChain` | [`TChain`](#tchain) |

##### Returns

`string`

##### Inherited from

Base.\_getBonderAddress

___

#### <a id="allowance" name="allowance"></a> allowance

▸ **allowance**(`spender`, `address?`): `Promise`<`BigNumber`\>

**`desc`** Returns token allowance.

**`example`**
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

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `spender` | `string` | spender address. |
| `address?` | `string` | - |

##### Returns

`Promise`<`BigNumber`\>

Ethers Transaction object.

___

#### <a id="approve" name="approve"></a> approve

▸ **approve**(`spender`, `amount?`): `Promise`<`TransactionResponse`\>

**`desc`** Approve address to spend tokens if not enough allowance .

**`example`**
```js
import { Hop, Chain } from '@hop-protocol/sdk'

const bridge = hop.bridge('USDC').connect(signer)
const spender = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
const amount = '1000000000000000000'
const tx = await bridge.approve(Chain.Gnosis, spender, amount)
```

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `spender` | `string` | `undefined` | spender address. |
| `amount` | `BigNumberish` | `ethers.constants.MaxUint256` | amount allowed to spend. |

##### Returns

`Promise`<`TransactionResponse`\>

Ethers Transaction object.

___

#### <a id="balanceof" name="balanceof"></a> balanceOf

▸ **balanceOf**(`address?`): `Promise`<`BigNumber`\>

**`desc`** Returns token balance of signer.

**`example`**
```js
import { Hop, Chain } from '@hop-protocol/sdk'

const bridge = hop.bridge('USDC').connect(signer)
const spender = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
const allowance = bridge.allowance(Chain.Gnosis, spender)
```

##### Parameters

| Name | Type |
| :------ | :------ |
| `address?` | `string` |

##### Returns

`Promise`<`BigNumber`\>

Ethers Transaction object.

___

#### <a id="connect" name="connect"></a> connect

▸ **connect**(`signer`): [`Token`](#classestokenmd)

**`desc`** Returns a token instance with signer connected. Used for adding or changing signer.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` \| `Provider` | Ethers `Signer` for signing transactions. |

##### Returns

[`Token`](#classestokenmd)

New Token SDK instance with connected signer.

___

#### <a id="eq" name="eq"></a> eq

▸ **eq**(`token`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`Token`](#classestokenmd) |

##### Returns

`boolean`

___

#### <a id="estimateoptimisml1feefromdata" name="estimateoptimisml1feefromdata"></a> estimateOptimismL1FeeFromData

▸ **estimateOptimismL1FeeFromData**(`gasLimit`, `data?`, `to?`): `Promise`<`any`\>

##### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `gasLimit` | `BigNumberish` | `undefined` |
| `data` | `string` | `'0x'` |
| `to` | `string` | `constants.AddressZero` |

##### Returns

`Promise`<`any`\>

##### Inherited from

Base.estimateOptimismL1FeeFromData

___

#### <a id="getarbchainaddress" name="getarbchainaddress"></a> getArbChainAddress

▸ **getArbChainAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getArbChainAddress

___

#### <a id="getbumpedgasprice" name="getbumpedgasprice"></a> getBumpedGasPrice

▸ **getBumpedGasPrice**(`signer`, `percent`): `Promise`<`BigNumber`\>

**`desc`** Calculates current gas price plus increased percentage amount.

**`example`**
```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
const bumpedGasPrice = await hop.getBumpedGasPrice(signer, 1.20)
console.log(bumpedGasPrice.toNumber())
```

##### Parameters

| Name | Type |
| :------ | :------ |
| `signer` | [`TProvider`](#tprovider) |
| `percent` | `number` |

##### Returns

`Promise`<`BigNumber`\>

Bumped as price as BigNumber

##### Inherited from

Base.getBumpedGasPrice

___

#### <a id="getchainid" name="getchainid"></a> getChainId

▸ **getChainId**(`chain`): `number`

**`desc`** Returns Chain ID for specified Chain model.

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`Chain`](#classeschainmd) |

##### Returns

`number`

- Chain ID.

##### Inherited from

Base.getChainId

___

#### <a id="getchainprovider" name="getchainprovider"></a> getChainProvider

▸ **getChainProvider**(`chain`): `Provider`

**`desc`** Returns Ethers provider for specified Chain model.

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | `string` \| [`Chain`](#classeschainmd) |

##### Returns

`Provider`

- Ethers provider.

##### Inherited from

Base.getChainProvider

___

#### <a id="getchainproviderurls" name="getchainproviderurls"></a> getChainProviderUrls

▸ **getChainProviderUrls**(): `Record`<`string`, `string`\>

##### Returns

`Record`<`string`, `string`\>

##### Inherited from

Base.getChainProviderUrls

___

#### <a id="getchainproviders" name="getchainproviders"></a> getChainProviders

▸ **getChainProviders**(): `Record`<`string`, `Provider`\>

##### Returns

`Record`<`string`, `Provider`\>

##### Inherited from

Base.getChainProviders

___

#### <a id="getconfigaddresses" name="getconfigaddresses"></a> getConfigAddresses

▸ **getConfigAddresses**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getConfigAddresses

___

#### <a id="geterc20" name="geterc20"></a> getErc20

▸ **getErc20**(): `Promise`<`WETH9` \| `ERC20`\>

**`desc`** Returns a token Ethers contract instance.

##### Returns

`Promise`<`WETH9` \| `ERC20`\>

Ethers contract instance.

___

#### <a id="getfeebps" name="getfeebps"></a> getFeeBps

▸ **getFeeBps**(`token`, `destinationChain`): `number`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `destinationChain` | [`TChain`](#tchain) |

##### Returns

`number`

##### Inherited from

Base.getFeeBps

___

#### <a id="getl1ambbridgeaddress" name="getl1ambbridgeaddress"></a> getL1AmbBridgeAddress

▸ **getL1AmbBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1AmbBridgeAddress

___

#### <a id="getl1bridgeaddress" name="getl1bridgeaddress"></a> getL1BridgeAddress

▸ **getL1BridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1BridgeAddress

___

#### <a id="getl1canonicalbridgeaddress" name="getl1canonicalbridgeaddress"></a> getL1CanonicalBridgeAddress

▸ **getL1CanonicalBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1CanonicalBridgeAddress

___

#### <a id="getl1canonicaltokenaddress" name="getl1canonicaltokenaddress"></a> getL1CanonicalTokenAddress

▸ **getL1CanonicalTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1CanonicalTokenAddress

___

#### <a id="getl1poserc20predicateaddress" name="getl1poserc20predicateaddress"></a> getL1PosErc20PredicateAddress

▸ **getL1PosErc20PredicateAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1PosErc20PredicateAddress

___

#### <a id="getl1posrootchainmanageraddress" name="getl1posrootchainmanageraddress"></a> getL1PosRootChainManagerAddress

▸ **getL1PosRootChainManagerAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1PosRootChainManagerAddress

___

#### <a id="getl2ambbridgeaddress" name="getl2ambbridgeaddress"></a> getL2AmbBridgeAddress

▸ **getL2AmbBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2AmbBridgeAddress

___

#### <a id="getl2ammwrapperaddress" name="getl2ammwrapperaddress"></a> getL2AmmWrapperAddress

▸ **getL2AmmWrapperAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2AmmWrapperAddress

___

#### <a id="getl2bridgeaddress" name="getl2bridgeaddress"></a> getL2BridgeAddress

▸ **getL2BridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2BridgeAddress

___

#### <a id="getl2canonicalbridgeaddress" name="getl2canonicalbridgeaddress"></a> getL2CanonicalBridgeAddress

▸ **getL2CanonicalBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2CanonicalBridgeAddress

___

#### <a id="getl2canonicaltokenaddress" name="getl2canonicaltokenaddress"></a> getL2CanonicalTokenAddress

▸ **getL2CanonicalTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2CanonicalTokenAddress

___

#### <a id="getl2hopbridgetokenaddress" name="getl2hopbridgetokenaddress"></a> getL2HopBridgeTokenAddress

▸ **getL2HopBridgeTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2HopBridgeTokenAddress

___

#### <a id="getl2saddlelptokenaddress" name="getl2saddlelptokenaddress"></a> getL2SaddleLpTokenAddress

▸ **getL2SaddleLpTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2SaddleLpTokenAddress

___

#### <a id="getl2saddleswapaddress" name="getl2saddleswapaddress"></a> getL2SaddleSwapAddress

▸ **getL2SaddleSwapAddress**(`token`, `chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2SaddleSwapAddress

___

#### <a id="getnativetokenbalance" name="getnativetokenbalance"></a> getNativeTokenBalance

▸ **getNativeTokenBalance**(`address?`): `Promise`<`BigNumber`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `address?` | `string` |

##### Returns

`Promise`<`BigNumber`\>

___

#### <a id="gets3configdata" name="gets3configdata"></a> getS3ConfigData

▸ **getS3ConfigData**(): `Promise`<`any`\>

##### Returns

`Promise`<`any`\>

##### Inherited from

Base.getS3ConfigData

___

#### <a id="getsigneraddress" name="getsigneraddress"></a> getSignerAddress

▸ **getSignerAddress**(): `Promise`<`string`\>

**`desc`** Returns the connected signer address.

**`example`**
```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
const address = await hop.getSignerAddress()
console.log(address)
```

##### Returns

`Promise`<`string`\>

Ethers signer address.

##### Inherited from

Base.getSignerAddress

___

#### <a id="getsignerorprovider" name="getsignerorprovider"></a> getSignerOrProvider

▸ **getSignerOrProvider**(`chain`, `signer?`): `Promise`<`Signer` \| `Provider`\>

**`desc`** Returns the connected signer if it's connected to the specified
chain id, otherwise it returns a regular provider for the specified chain.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chain` | [`TChain`](#tchain) | Chain name or model |
| `signer` | [`TProvider`](#tprovider) | Ethers signer or provider |

##### Returns

`Promise`<`Signer` \| `Provider`\>

Ethers signer or provider

##### Inherited from

Base.getSignerOrProvider

___

#### <a id="getsupportedassets" name="getsupportedassets"></a> getSupportedAssets

▸ **getSupportedAssets**(): `any`

##### Returns

`any`

##### Inherited from

Base.getSupportedAssets

___

#### <a id="getsupportedassetsforchain" name="getsupportedassetsforchain"></a> getSupportedAssetsForChain

▸ **getSupportedAssetsForChain**(`chain`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getSupportedAssetsForChain

___

#### <a id="getwethcontract" name="getwethcontract"></a> getWethContract

▸ **getWethContract**(): `Promise`<`WETH9`\>

##### Returns

`Promise`<`WETH9`\>

___

#### <a id="getwraptokenestimatedgas" name="getwraptokenestimatedgas"></a> getWrapTokenEstimatedGas

▸ **getWrapTokenEstimatedGas**(`chain`): `Promise`<{}\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](#tchain) |

##### Returns

`Promise`<{}\>

___

#### <a id="getwrappedtoken" name="getwrappedtoken"></a> getWrappedToken

▸ **getWrappedToken**(): [`Token`](#classestokenmd)

##### Returns

[`Token`](#classestokenmd)

___

#### <a id="init" name="init"></a> init

▸ **init**(): `Promise`<`void`\>

##### Returns

`Promise`<`void`\>

##### Inherited from

Base.init

___

#### <a id="isvalidchain" name="isvalidchain"></a> isValidChain

▸ **isValidChain**(`chain`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | `string` |

##### Returns

`boolean`

##### Inherited from

Base.isValidChain

___

#### <a id="isvalidnetwork" name="isvalidnetwork"></a> isValidNetwork

▸ **isValidNetwork**(`network`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `network` | `string` |

##### Returns

`boolean`

##### Inherited from

Base.isValidNetwork

___

#### <a id="overrides" name="overrides"></a> overrides

▸ **overrides**(): `Promise`<`any`\>

##### Returns

`Promise`<`any`\>

___

#### <a id="populateapprovetx" name="populateapprovetx"></a> populateApproveTx

▸ **populateApproveTx**(`spender`, `amount?`): `Promise`<`any`\>

##### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `spender` | `string` | `undefined` |
| `amount` | `BigNumberish` | `ethers.constants.MaxUint256` |

##### Returns

`Promise`<`any`\>

___

#### <a id="setchainprovider" name="setchainprovider"></a> setChainProvider

▸ **setChainProvider**(`chain`, `provider`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](#tchain) |
| `provider` | `Provider` |

##### Returns

`void`

##### Inherited from

Base.setChainProvider

___

#### <a id="setchainproviderurls" name="setchainproviderurls"></a> setChainProviderUrls

▸ **setChainProviderUrls**(`chainProviders`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `chainProviders` | `Record`<`string`, `string`\> |

##### Returns

`void`

##### Inherited from

Base.setChainProviderUrls

___

#### <a id="setchainproviders" name="setchainproviders"></a> setChainProviders

▸ **setChainProviders**(`chainProviders`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `chainProviders` | `ChainProviders` |

##### Returns

`void`

##### Inherited from

Base.setChainProviders

___

#### <a id="setconfigaddresses" name="setconfigaddresses"></a> setConfigAddresses

▸ **setConfigAddresses**(`addresses`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `addresses` | `Addresses` |

##### Returns

`void`

##### Inherited from

Base.setConfigAddresses

___

#### <a id="setgaspricemultiplier" name="setgaspricemultiplier"></a> setGasPriceMultiplier

▸ **setGasPriceMultiplier**(`gasPriceMultiplier`): `number`

##### Parameters

| Name | Type |
| :------ | :------ |
| `gasPriceMultiplier` | `number` |

##### Returns

`number`

##### Inherited from

Base.setGasPriceMultiplier

___

#### <a id="tochainmodel" name="tochainmodel"></a> toChainModel

▸ **toChainModel**(`chain`): [`Chain`](#classeschainmd)

**`desc`** Returns a Chain model instance with connected provider.

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](#tchain) |

##### Returns

[`Chain`](#classeschainmd)

- Chain model with connected provider.

##### Inherited from

Base.toChainModel

___

#### <a id="tojson" name="tojson"></a> toJSON

▸ **toJSON**(): `Object`

##### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `chain` | [`Chain`](#classeschainmd) |
| `decimals` | `number` |
| `image` | `string` |
| `name` | `string` |
| `symbol` | `string` |

___

#### <a id="totokenmodel" name="totokenmodel"></a> toTokenModel

▸ **toTokenModel**(`token`): [`TokenModel`](#classestokenmodelmd)

**`desc`** Returns a Token instance.

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](#ttoken) |

##### Returns

[`TokenModel`](#classestokenmodelmd)

- Token model.

##### Inherited from

Base.toTokenModel

___

#### <a id="totalsupply" name="totalsupply"></a> totalSupply

▸ **totalSupply**(): `Promise`<`BigNumber`\>

##### Returns

`Promise`<`BigNumber`\>

___

#### <a id="transfer" name="transfer"></a> transfer

▸ **transfer**(`recipient`, `amount`): `Promise`<`TransactionResponse`\>

**`desc`** ERC20 token transfer

**`example`**
```js
import { Hop } from '@hop-protocol/sdk'

const bridge = hop.bridge('USDC').connect(signer)
const recipient = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
const amount = '1000000000000000000'
const tx = await bridge.erc20Transfer(spender, amount)
```

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `recipient` | `string` | recipient address. |
| `amount` | `BigNumberish` | Token amount. |

##### Returns

`Promise`<`TransactionResponse`\>

Ethers Transaction object.

___

#### <a id="txoverrides" name="txoverrides"></a> txOverrides

▸ **txOverrides**(`chain`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`Chain`](#classeschainmd) |

##### Returns

`Promise`<`any`\>

##### Inherited from

Base.txOverrides

___

#### <a id="unwraptoken" name="unwraptoken"></a> unwrapToken

▸ **unwrapToken**(`amount`): `Promise`<`ContractTransaction`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |

##### Returns

`Promise`<`ContractTransaction`\>

___

#### <a id="wraptoken" name="wraptoken"></a> wrapToken

▸ **wrapToken**(`amount`, `estimateGasOnly?`): `Promise`<`BigNumber` \| `ContractTransaction`\>

##### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `amount` | `BigNumberish` | `undefined` |
| `estimateGasOnly` | `boolean` | `false` |

##### Returns

`Promise`<`BigNumber` \| `ContractTransaction`\>

___

#### <a id="fromjson" name="fromjson"></a> fromJSON

▸ `Static` **fromJSON**(`json`): [`Token`](#classestokenmd)

##### Parameters

| Name | Type |
| :------ | :------ |
| `json` | `any` |

##### Returns

[`Token`](#classestokenmd)


<a name="classestokenamountmd"></a>

## Class: TokenAmount

### Table of contents

#### Constructors

- [constructor](#constructor)

#### Properties

- [amount](#amount)
- [token](#token)

### Constructors

#### <a id="constructor" name="constructor"></a> constructor

• **new TokenAmount**(`token`, `amount`)

##### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TokenModel`](#classestokenmodelmd) |
| `amount` | `string` |

### Properties

#### <a id="amount" name="amount"></a> amount

• `Readonly` **amount**: `string`

___

#### <a id="token" name="token"></a> token

• `Readonly` **token**: [`TokenModel`](#classestokenmodelmd)


<a name="classestokenmodelmd"></a>

## Class: TokenModel

### Table of contents

#### Constructors

- [constructor](#constructor)

#### Properties

- [address](#address)
- [chainId](#chainid)
- [decimals](#decimals)
- [name](#name)
- [symbol](#symbol)
- [DAI](#dai)
- [ETH](#eth)
- [MATIC](#matic)
- [USDC](#usdc)
- [USDT](#usdt)
- [WBTC](#wbtc)
- [WETH](#weth)
- [WMATIC](#wmatic)
- [WXDAI](#wxdai)
- [XDAI](#xdai)
- [sBTC](#sbtc)
- [sETH](#seth)

#### Accessors

- [canonicalSymbol](#canonicalsymbol)

#### Methods

- [getCanonicalSymbol](#getcanonicalsymbol)

### Constructors

#### <a id="constructor" name="constructor"></a> constructor

• **new TokenModel**(`chainId`, `address`, `decimals`, `symbol`, `name`)

##### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `string` \| `number` |
| `address` | `string` |
| `decimals` | `number` |
| `symbol` | `string` |
| `name` | `string` |

### Properties

#### <a id="address" name="address"></a> address

• `Readonly` **address**: `string`

___

#### <a id="chainid" name="chainid"></a> chainId

• `Readonly` **chainId**: `number`

___

#### <a id="decimals" name="decimals"></a> decimals

• `Readonly` **decimals**: `number`

___

#### <a id="name" name="name"></a> name

• `Readonly` **name**: `string`

___

#### <a id="symbol" name="symbol"></a> symbol

• `Readonly` **symbol**: `string`

___

#### <a id="dai" name="dai"></a> DAI

▪ `Static` **DAI**: `string` = `'DAI'`

___

#### <a id="eth" name="eth"></a> ETH

▪ `Static` **ETH**: `string` = `'ETH'`

___

#### <a id="matic" name="matic"></a> MATIC

▪ `Static` **MATIC**: `string` = `'MATIC'`

___

#### <a id="usdc" name="usdc"></a> USDC

▪ `Static` **USDC**: `string` = `'USDC'`

___

#### <a id="usdt" name="usdt"></a> USDT

▪ `Static` **USDT**: `string` = `'USDT'`

___

#### <a id="wbtc" name="wbtc"></a> WBTC

▪ `Static` **WBTC**: `string` = `'WBTC'`

___

#### <a id="weth" name="weth"></a> WETH

▪ `Static` **WETH**: `string` = `'WETH'`

___

#### <a id="wmatic" name="wmatic"></a> WMATIC

▪ `Static` **WMATIC**: `string` = `'WMATIC'`

___

#### <a id="wxdai" name="wxdai"></a> WXDAI

▪ `Static` **WXDAI**: `string` = `'WXDAI'`

___

#### <a id="xdai" name="xdai"></a> XDAI

▪ `Static` **XDAI**: `string` = `'XDAI'`

___

#### <a id="sbtc" name="sbtc"></a> sBTC

▪ `Static` **sBTC**: `string` = `'sBTC'`

___

#### <a id="seth" name="seth"></a> sETH

▪ `Static` **sETH**: `string` = `'sETH'`

### Accessors

#### <a id="canonicalsymbol" name="canonicalsymbol"></a> canonicalSymbol

• `get` **canonicalSymbol**(): `string`

##### Returns

`string`

### Methods

#### <a id="getcanonicalsymbol" name="getcanonicalsymbol"></a> getCanonicalSymbol

▸ `Static` **getCanonicalSymbol**(`tokenSymbol`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `tokenSymbol` | `string` |

##### Returns

`string`

# Enums


<a name="enumscanonicaltokenmd"></a>

## Enumeration: CanonicalToken

### Table of contents

#### Enumeration members

- [DAI](#dai)
- [ETH](#eth)
- [MATIC](#matic)
- [USDC](#usdc)
- [USDT](#usdt)
- [WBTC](#wbtc)
- [XDAI](#xdai)
- [sBTC](#sbtc)
- [sETH](#seth)

### Enumeration members

#### <a id="dai" name="dai"></a> DAI

• **DAI** = `"DAI"`

___

#### <a id="eth" name="eth"></a> ETH

• **ETH** = `"ETH"`

___

#### <a id="matic" name="matic"></a> MATIC

• **MATIC** = `"MATIC"`

___

#### <a id="usdc" name="usdc"></a> USDC

• **USDC** = `"USDC"`

___

#### <a id="usdt" name="usdt"></a> USDT

• **USDT** = `"USDT"`

___

#### <a id="wbtc" name="wbtc"></a> WBTC

• **WBTC** = `"WBTC"`

___

#### <a id="xdai" name="xdai"></a> XDAI

• **XDAI** = `"XDAI"`

___

#### <a id="sbtc" name="sbtc"></a> sBTC

• **sBTC** = `"sBTC"`

___

#### <a id="seth" name="seth"></a> sETH

• **sETH** = `"sETH"`


<a name="enumschainidmd"></a>

## Enumeration: ChainId

### Table of contents

#### Enumeration members

- [Arbitrum](#arbitrum)
- [Ethereum](#ethereum)
- [Gnosis](#gnosis)
- [Optimism](#optimism)
- [Polygon](#polygon)

### Enumeration members

#### <a id="arbitrum" name="arbitrum"></a> Arbitrum

• **Arbitrum** = `42161`

___

#### <a id="ethereum" name="ethereum"></a> Ethereum

• **Ethereum** = `1`

___

#### <a id="gnosis" name="gnosis"></a> Gnosis

• **Gnosis** = `100`

___

#### <a id="optimism" name="optimism"></a> Optimism

• **Optimism** = `10`

___

#### <a id="polygon" name="polygon"></a> Polygon

• **Polygon** = `137`


<a name="enumschainslugmd"></a>

## Enumeration: ChainSlug

### Table of contents

#### Enumeration members

- [Arbitrum](#arbitrum)
- [Ethereum](#ethereum)
- [Gnosis](#gnosis)
- [Optimism](#optimism)
- [Polygon](#polygon)

### Enumeration members

#### <a id="arbitrum" name="arbitrum"></a> Arbitrum

• **Arbitrum** = `"arbitrum"`

___

#### <a id="ethereum" name="ethereum"></a> Ethereum

• **Ethereum** = `"ethereum"`

___

#### <a id="gnosis" name="gnosis"></a> Gnosis

• **Gnosis** = `"gnosis"`

___

#### <a id="optimism" name="optimism"></a> Optimism

• **Optimism** = `"optimism"`

___

#### <a id="polygon" name="polygon"></a> Polygon

• **Polygon** = `"polygon"`


<a name="enumshtokenmd"></a>

## Enumeration: HToken

### Table of contents

#### Enumeration members

- [hDAI](#hdai)
- [hETH](#heth)
- [hMATIC](#hmatic)
- [hUSDC](#husdc)
- [hUSDT](#husdt)

### Enumeration members

#### <a id="hdai" name="hdai"></a> hDAI

• **hDAI** = `"hDAI"`

___

#### <a id="heth" name="heth"></a> hETH

• **hETH** = `"hETH"`

___

#### <a id="hmatic" name="hmatic"></a> hMATIC

• **hMATIC** = `"hMATIC"`

___

#### <a id="husdc" name="husdc"></a> hUSDC

• **hUSDC** = `"hUSDC"`

___

#### <a id="husdt" name="husdt"></a> hUSDT

• **hUSDT** = `"hUSDT"`


<a name="enumsnetworkslugmd"></a>

## Enumeration: NetworkSlug

### Table of contents

#### Enumeration members

- [Goerli](#goerli)
- [Kovan](#kovan)
- [Mainnet](#mainnet)
- [Staging](#staging)

### Enumeration members

#### <a id="goerli" name="goerli"></a> Goerli

• **Goerli** = `"goerli"`

___

#### <a id="kovan" name="kovan"></a> Kovan

• **Kovan** = `"kovan"`

___

#### <a id="mainnet" name="mainnet"></a> Mainnet

• **Mainnet** = `"mainnet"`

___

#### <a id="staging" name="staging"></a> Staging

• **Staging** = `"staging"`


<a name="enumsslugmd"></a>

## Enumeration: Slug

### Table of contents

#### Enumeration members

- [arbitrum](#arbitrum)
- [ethereum](#ethereum)
- [gnosis](#gnosis)
- [goerli](#goerli)
- [kovan](#kovan)
- [mainnet](#mainnet)
- [optimism](#optimism)
- [polygon](#polygon)
- [staging](#staging)

### Enumeration members

#### <a id="arbitrum" name="arbitrum"></a> arbitrum

• **arbitrum** = `"arbitrum"`

___

#### <a id="ethereum" name="ethereum"></a> ethereum

• **ethereum** = `"ethereum"`

___

#### <a id="gnosis" name="gnosis"></a> gnosis

• **gnosis** = `"gnosis"`

___

#### <a id="goerli" name="goerli"></a> goerli

• **goerli** = `"goerli"`

___

#### <a id="kovan" name="kovan"></a> kovan

• **kovan** = `"kovan"`

___

#### <a id="mainnet" name="mainnet"></a> mainnet

• **mainnet** = `"mainnet"`

___

#### <a id="optimism" name="optimism"></a> optimism

• **optimism** = `"optimism"`

___

#### <a id="polygon" name="polygon"></a> polygon

• **polygon** = `"polygon"`

___

#### <a id="staging" name="staging"></a> staging

• **staging** = `"staging"`


<a name="enumswrappedtokenmd"></a>

## Enumeration: WrappedToken

### Table of contents

#### Enumeration members

- [WETH](#weth)
- [WMATIC](#wmatic)
- [WXDAI](#wxdai)

### Enumeration members

#### <a id="weth" name="weth"></a> WETH

• **WETH** = `"WETH"`

___

#### <a id="wmatic" name="wmatic"></a> WMATIC

• **WMATIC** = `"WMATIC"`

___

#### <a id="wxdai" name="wxdai"></a> WXDAI

• **WXDAI** = `"WXDAI"`


<a name="modulesmd"></a>

# @hop-protocol/sdk

## Table of contents

### Namespaces

- [eventTopics](#moduleseventtopicsmd)

### Enumerations

- [CanonicalToken](#enumscanonicaltokenmd)
- [ChainId](#enumschainidmd)
- [ChainSlug](#enumschainslugmd)
- [HToken](#enumshtokenmd)
- [NetworkSlug](#enumsnetworkslugmd)
- [Slug](#enumsslugmd)
- [WrappedToken](#enumswrappedtokenmd)

### Classes

- [AMM](#classesammmd)
- [CanonicalBridge](#classescanonicalbridgemd)
- [Chain](#classeschainmd)
- [Hop](#classeshopmd)
- [HopBridge](#classeshopbridgemd)
- [Route](#classesroutemd)
- [Token](#classestokenmd)
- [TokenAmount](#classestokenamountmd)
- [TokenModel](#classestokenmodelmd)

### Type aliases

- [TAmount](#tamount)
- [TChain](#tchain)
- [TProvider](#tprovider)
- [TTime](#ttime)
- [TTimeSlot](#ttimeslot)
- [TToken](#ttoken)
- [TokenSymbol](#tokensymbol)

## Type aliases

### <a id="tamount" name="tamount"></a> TAmount

Ƭ **TAmount**: `BigNumberish`

Amount-ish type alias

___

### <a id="tchain" name="tchain"></a> TChain

Ƭ **TChain**: [`Chain`](#classeschainmd) \| [`ChainSlug`](#enumschainslugmd) \| `string`

Chain-ish type

___

### <a id="tprovider" name="tprovider"></a> TProvider

Ƭ **TProvider**: `Signer` \| `providers.Provider`

Signer-ish type

___

### <a id="ttime" name="ttime"></a> TTime

Ƭ **TTime**: `BigNumberish`

Time-ish type alias

___

### <a id="ttimeslot" name="ttimeslot"></a> TTimeSlot

Ƭ **TTimeSlot**: `BigNumberish`

TimeSlot-ish type alias

___

### <a id="ttoken" name="ttoken"></a> TToken

Ƭ **TToken**: [`TokenModel`](#classestokenmodelmd) \| [`TokenSymbol`](#tokensymbol) \| `string`

Token-ish type

___

### <a id="tokensymbol" name="tokensymbol"></a> TokenSymbol

Ƭ **TokenSymbol**: [`CanonicalToken`](#enumscanonicaltokenmd) \| [`WrappedToken`](#enumswrappedtokenmd) \| [`HToken`](#enumshtokenmd) \| `string`

# Modules


<a name="moduleseventtopicsmd"></a>

## Namespace: eventTopics

### Table of contents

#### Variables

- [tokenTransferTopic](#tokentransfertopic)
- [tokensBridgedTopic](#tokensbridgedtopic)
- [transferFromL1CompletedTopic](#transferfroml1completedtopic)
- [transferSentToL2Topic](#transfersenttol2topic)
- [transferSentTopic](#transfersenttopic)

### Variables

#### <a id="tokentransfertopic" name="tokentransfertopic"></a> tokenTransferTopic

• **tokenTransferTopic**: ``"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"``

___

#### <a id="tokensbridgedtopic" name="tokensbridgedtopic"></a> tokensBridgedTopic

• **tokensBridgedTopic**: ``"0x9afd47907e25028cdaca89d193518c302bbb128617d5a992c5abd45815526593"``

___

#### <a id="transferfroml1completedtopic" name="transferfroml1completedtopic"></a> transferFromL1CompletedTopic

• **transferFromL1CompletedTopic**: ``"0x320958176930804eb66c2343c7343fc0367dc16249590c0f195783bee199d094"``

___

#### <a id="transfersenttol2topic" name="transfersenttol2topic"></a> transferSentToL2Topic

• **transferSentToL2Topic**: ``"0x0a0607688c86ec1775abcdbab7b33a3a35a6c9cde677c9be880150c231cc6b0b"``

___

#### <a id="transfersenttopic" name="transfersenttopic"></a> transferSentTopic

• **transferSentTopic**: ``"0xe35dddd4ea75d7e9b3fe93af4f4e40e778c3da4074c9d93e7c6536f1e803c1eb"``
