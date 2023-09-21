# Class: HopBridge

Class representing Hop bridge.
 HopBridge

## Hierarchy

- [`Base`](Base.md)

  ↳ **`HopBridge`**

## Table of contents

### Constructors

- [constructor](HopBridge.md#constructor)

### Properties

- [addresses](HopBridge.md#addresses)
- [baseConfigUrl](HopBridge.md#baseconfigurl)
- [baseExplorerUrl](HopBridge.md#baseexplorerurl)
- [blocklist](HopBridge.md#blocklist)
- [bonders](HopBridge.md#bonders)
- [chainProviders](HopBridge.md#chainproviders)
- [chains](HopBridge.md#chains)
- [configFileFetchEnabled](HopBridge.md#configfilefetchenabled)
- [customAvailableLiquidityJsonUrl](HopBridge.md#customavailableliquidityjsonurl)
- [customCoreConfigJsonUrl](HopBridge.md#customcoreconfigjsonurl)
- [defaultDeadlineMinutes](HopBridge.md#defaultdeadlineminutes)
- [destinationChain](HopBridge.md#destinationchain)
- [destinationFeeGasPriceMultiplier](HopBridge.md#destinationfeegaspricemultiplier)
- [doesUseAmm](HopBridge.md#doesuseamm)
- [fees](HopBridge.md#fees)
- [gasPriceMultiplier](HopBridge.md#gaspricemultiplier)
- [getContract](HopBridge.md#getcontract)
- [network](HopBridge.md#network)
- [priceFeed](HopBridge.md#pricefeed)
- [priceFeedApiKeys](HopBridge.md#pricefeedapikeys)
- [relayerFeeEnabled](HopBridge.md#relayerfeeenabled)
- [signer](HopBridge.md#signer)
- [sourceChain](HopBridge.md#sourcechain)

### Accessors

- [availableLiqudityJsonUrl](HopBridge.md#availableliqudityjsonurl)
- [configChains](HopBridge.md#configchains)
- [coreConfigJsonUrl](HopBridge.md#coreconfigjsonurl)
- [defaultDeadlineSeconds](HopBridge.md#defaultdeadlineseconds)
- [supportedChains](HopBridge.md#supportedchains)
- [supportedLpChains](HopBridge.md#supportedlpchains)
- [supportedNetworks](HopBridge.md#supportednetworks)

### Methods

- [\_getBonderAddress](HopBridge.md#_getbonderaddress)
- [\_getMessengerWrapperAddress](HopBridge.md#_getmessengerwrapperaddress)
- [addLiquidity](HopBridge.md#addliquidity)
- [calcAmountOutMin](HopBridge.md#calcamountoutmin)
- [calculateWithdrawOneToken](HopBridge.md#calculatewithdrawonetoken)
- [challengePeriod](HopBridge.md#challengeperiod)
- [checkBlocklist](HopBridge.md#checkblocklist)
- [connect](HopBridge.md#connect)
- [estimateBondWithdrawalGasLimit](HopBridge.md#estimatebondwithdrawalgaslimit)
- [estimateOptimismL1FeeFromData](HopBridge.md#estimateoptimisml1feefromdata)
- [estimateSendGasLimit](HopBridge.md#estimatesendgaslimit)
- [estimateSendHTokensGasLimit](HopBridge.md#estimatesendhtokensgaslimit)
- [execSaddleSwap](HopBridge.md#execsaddleswap)
- [fetchBonderAvailableLiquidityData](HopBridge.md#fetchbonderavailableliquiditydata)
- [fetchBonderAvailableLiquidityDataWithIpfsFallback](HopBridge.md#fetchbonderavailableliquiditydatawithipfsfallback)
- [fetchConfigFromS3](HopBridge.md#fetchconfigfroms3)
- [fetchCoreConfigData](HopBridge.md#fetchcoreconfigdata)
- [fetchCoreConfigDataWithIpfsFallback](HopBridge.md#fetchcoreconfigdatawithipfsfallback)
- [fetchIpfsBonderAvailableLiquidityData](HopBridge.md#fetchipfsbonderavailableliquiditydata)
- [fetchIpfsCoreConfigData](HopBridge.md#fetchipfscoreconfigdata)
- [formatUnits](HopBridge.md#formatunits)
- [geConfigChains](HopBridge.md#geconfigchains)
- [getAccountLpBalance](HopBridge.md#getaccountlpbalance)
- [getAccountLpCanonicalBalance](HopBridge.md#getaccountlpcanonicalbalance)
- [getAccountLpCanonicalBalanceUsd](HopBridge.md#getaccountlpcanonicalbalanceusd)
- [getAmbBridge](HopBridge.md#getambbridge)
- [getAmm](HopBridge.md#getamm)
- [getAmmData](HopBridge.md#getammdata)
- [getAmmWrapper](HopBridge.md#getammwrapper)
- [getAmountOut](HopBridge.md#getamountout)
- [getArbChainAddress](HopBridge.md#getarbchainaddress)
- [getAvailableLiquidity](HopBridge.md#getavailableliquidity)
- [getAvailableRoutes](HopBridge.md#getavailableroutes)
- [getBonderAddress](HopBridge.md#getbonderaddress)
- [getBonderAvailableLiquidityData](HopBridge.md#getbonderavailableliquiditydata)
- [getBonderFeeAbsolute](HopBridge.md#getbonderfeeabsolute)
- [getBridgeContract](HopBridge.md#getbridgecontract)
- [getBumpedGasPrice](HopBridge.md#getbumpedgasprice)
- [getCanonicalToken](HopBridge.md#getcanonicaltoken)
- [getChainId](HopBridge.md#getchainid)
- [getChainNativeToken](HopBridge.md#getchainnativetoken)
- [getChainProvider](HopBridge.md#getchainprovider)
- [getChainProviderUrls](HopBridge.md#getchainproviderurls)
- [getChainProviders](HopBridge.md#getchainproviders)
- [getConfigAddresses](HopBridge.md#getconfigaddresses)
- [getCredit](HopBridge.md#getcredit)
- [getDebit](HopBridge.md#getdebit)
- [getDestinationFeeGasPriceMultiplier](HopBridge.md#getdestinationfeegaspricemultiplier)
- [getDestinationTransactionFee](HopBridge.md#getdestinationtransactionfee)
- [getDestinationTransactionFeeData](HopBridge.md#getdestinationtransactionfeedata)
- [getEthBalance](HopBridge.md#getethbalance)
- [getExplorerUrl](HopBridge.md#getexplorerurl)
- [getExplorerUrlForAccount](HopBridge.md#getexplorerurlforaccount)
- [getExplorerUrlForTransactionHash](HopBridge.md#getexplorerurlfortransactionhash)
- [getExplorerUrlForTransferId](HopBridge.md#getexplorerurlfortransferid)
- [getFeeBps](HopBridge.md#getfeebps)
- [getFrontendAvailableLiquidity](HopBridge.md#getfrontendavailableliquidity)
- [getIpfsBaseConfigUrl](HopBridge.md#getipfsbaseconfigurl)
- [getL1AmbBridgeAddress](HopBridge.md#getl1ambbridgeaddress)
- [getL1Bridge](HopBridge.md#getl1bridge)
- [getL1BridgeAddress](HopBridge.md#getl1bridgeaddress)
- [getL1BridgeWrapperAddress](HopBridge.md#getl1bridgewrapperaddress)
- [getL1BridgeWrapperOrL1Bridge](HopBridge.md#getl1bridgewrapperorl1bridge)
- [getL1CanonicalBridgeAddress](HopBridge.md#getl1canonicalbridgeaddress)
- [getL1CanonicalTokenAddress](HopBridge.md#getl1canonicaltokenaddress)
- [getL1PosErc20PredicateAddress](HopBridge.md#getl1poserc20predicateaddress)
- [getL1PosRootChainManagerAddress](HopBridge.md#getl1posrootchainmanageraddress)
- [getL1Token](HopBridge.md#getl1token)
- [getL2AmbBridgeAddress](HopBridge.md#getl2ambbridgeaddress)
- [getL2AmmWrapperAddress](HopBridge.md#getl2ammwrapperaddress)
- [getL2Bridge](HopBridge.md#getl2bridge)
- [getL2BridgeAddress](HopBridge.md#getl2bridgeaddress)
- [getL2CanonicalBridgeAddress](HopBridge.md#getl2canonicalbridgeaddress)
- [getL2CanonicalTokenAddress](HopBridge.md#getl2canonicaltokenaddress)
- [getL2HopBridgeTokenAddress](HopBridge.md#getl2hopbridgetokenaddress)
- [getL2HopToken](HopBridge.md#getl2hoptoken)
- [getL2SaddleLpTokenAddress](HopBridge.md#getl2saddlelptokenaddress)
- [getL2SaddleSwapAddress](HopBridge.md#getl2saddleswapaddress)
- [getLpFees](HopBridge.md#getlpfees)
- [getMessengerWrapperAddress](HopBridge.md#getmessengerwrapperaddress)
- [getOptimismL1Fee](HopBridge.md#getoptimisml1fee)
- [getProviderRpcUrl](HopBridge.md#getproviderrpcurl)
- [getRelayerFee](HopBridge.md#getrelayerfee)
- [getRequiredLiquidity](HopBridge.md#getrequiredliquidity)
- [getReservesTotal](HopBridge.md#getreservestotal)
- [getS3ConfigData](HopBridge.md#gets3configdata)
- [getSaddleLpToken](HopBridge.md#getsaddlelptoken)
- [getSaddleSwapReserves](HopBridge.md#getsaddleswapreserves)
- [getSendApprovalAddress](HopBridge.md#getsendapprovaladdress)
- [getSendData](HopBridge.md#getsenddata)
- [getSendDataAmountOutMins](HopBridge.md#getsenddataamountoutmins)
- [getSendEstimatedGasCost](HopBridge.md#getsendestimatedgascost)
- [getSignerAddress](HopBridge.md#getsigneraddress)
- [getSignerOrProvider](HopBridge.md#getsignerorprovider)
- [getSupportedAssets](HopBridge.md#getsupportedassets)
- [getSupportedAssetsForChain](HopBridge.md#getsupportedassetsforchain)
- [getSupportedChains](HopBridge.md#getsupportedchains)
- [getSupportedLpChains](HopBridge.md#getsupportedlpchains)
- [getSupportedTokens](HopBridge.md#getsupportedtokens)
- [getTimeSlot](HopBridge.md#gettimeslot)
- [getTokenBalance](HopBridge.md#gettokenbalance)
- [getTokenDecimals](HopBridge.md#gettokendecimals)
- [getTokenImage](HopBridge.md#gettokenimage)
- [getTokenSymbol](HopBridge.md#gettokensymbol)
- [getTotalDebit](HopBridge.md#gettotaldebit)
- [getTotalFee](HopBridge.md#gettotalfee)
- [getTransferStatus](HopBridge.md#gettransferstatus)
- [getTvl](HopBridge.md#gettvl)
- [getTvlUsd](HopBridge.md#gettvlusd)
- [getUnbondedTransferRootAmount](HopBridge.md#getunbondedtransferrootamount)
- [getVaultBalance](HopBridge.md#getvaultbalance)
- [getWaitConfirmations](HopBridge.md#getwaitconfirmations)
- [getWithdrawProof](HopBridge.md#getwithdrawproof)
- [isDestinationChainPaused](HopBridge.md#isdestinationchainpaused)
- [isNativeToken](HopBridge.md#isnativetoken)
- [isSupportedAsset](HopBridge.md#issupportedasset)
- [isValidChain](HopBridge.md#isvalidchain)
- [isValidNetwork](HopBridge.md#isvalidnetwork)
- [needsApproval](HopBridge.md#needsapproval)
- [needsHTokenApproval](HopBridge.md#needshtokenapproval)
- [parseUnits](HopBridge.md#parseunits)
- [populateBondWithdrawalTx](HopBridge.md#populatebondwithdrawaltx)
- [populateSendApprovalTx](HopBridge.md#populatesendapprovaltx)
- [populateSendHTokensTx](HopBridge.md#populatesendhtokenstx)
- [populateSendTx](HopBridge.md#populatesendtx)
- [populateWithdrawTransferTx](HopBridge.md#populatewithdrawtransfertx)
- [populateWithdrawTx](HopBridge.md#populatewithdrawtx)
- [removeLiquidity](HopBridge.md#removeliquidity)
- [removeLiquidityImbalance](HopBridge.md#removeliquidityimbalance)
- [removeLiquidityOneToken](HopBridge.md#removeliquidityonetoken)
- [resolveDnslink](HopBridge.md#resolvednslink)
- [send](HopBridge.md#send)
- [sendApproval](HopBridge.md#sendapproval)
- [sendHToken](HopBridge.md#sendhtoken)
- [sendTransaction](HopBridge.md#sendtransaction)
- [setAvailableLiqudityJsonUrl](HopBridge.md#setavailableliqudityjsonurl)
- [setBaseConfigUrl](HopBridge.md#setbaseconfigurl)
- [setChainProvider](HopBridge.md#setchainprovider)
- [setChainProviderUrls](HopBridge.md#setchainproviderurls)
- [setChainProviders](HopBridge.md#setchainproviders)
- [setConfigAddresses](HopBridge.md#setconfigaddresses)
- [setConfigFileFetchEnabled](HopBridge.md#setconfigfilefetchenabled)
- [setCoreConfigJsonUrl](HopBridge.md#setcoreconfigjsonurl)
- [setGasPriceMultiplier](HopBridge.md#setgaspricemultiplier)
- [setPriceFeedApiKeys](HopBridge.md#setpricefeedapikeys)
- [shouldAttemptSwap](HopBridge.md#shouldattemptswap)
- [timeSlotSize](HopBridge.md#timeslotsize)
- [timeSlotToAmountBonded](HopBridge.md#timeslottoamountbonded)
- [toCanonicalToken](HopBridge.md#tocanonicaltoken)
- [toChainModel](HopBridge.md#tochainmodel)
- [toHopToken](HopBridge.md#tohoptoken)
- [toTokenModel](HopBridge.md#totokenmodel)
- [txOverrides](HopBridge.md#txoverrides)
- [willTransferFail](HopBridge.md#willtransferfail)
- [withdraw](HopBridge.md#withdraw)
- [withdrawTransfer](HopBridge.md#withdrawtransfer)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new HopBridge**(`networkOrOptionsObject`, `signer?`, `token?`, `chainProviders?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `networkOrOptionsObject` | `string` \| `HopBridgeConstructorOptions` | L1 network name (e.g. 'mainnet', 'kovan', 'goerli') |
| `signer?` | [`TProvider`](../modules.md#tprovider) | Ethers `Signer` for signing transactions. |
| `token?` | [`TToken`](../modules.md#ttoken) | Token symbol or model |
| `chainProviders?` | `ChainProviders` | - |

**`Desc`**

Instantiates Hop Bridge.
Returns a new Hop Bridge instance.

**`Example`**

```js
import { HopBridge, Chain, Token } from '@hop-protocol/sdk'
import { Wallet } from 'ethers'

const signer = new Wallet(privateKey)
const bridge = new HopBridge('kovan', signer, Token.USDC, Chain.Optimism, Chain.Gnosis)
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

### <a id="defaultdeadlineminutes" name="defaultdeadlineminutes"></a> defaultDeadlineMinutes

• **defaultDeadlineMinutes**: `number`

Default deadline for transfers

___

### <a id="destinationchain" name="destinationchain"></a> destinationChain

• **destinationChain**: [`Chain`](Chain.md)

Destination Chain model

___

### <a id="destinationfeegaspricemultiplier" name="destinationfeegaspricemultiplier"></a> destinationFeeGasPriceMultiplier

• **destinationFeeGasPriceMultiplier**: `number` = `1`

#### Inherited from

[Base](Base.md).[destinationFeeGasPriceMultiplier](Base.md#destinationfeegaspricemultiplier)

___

### <a id="doesuseamm" name="doesuseamm"></a> doesUseAmm

• **doesUseAmm**: `boolean`

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

### <a id="pricefeed" name="pricefeed"></a> priceFeed

• **priceFeed**: `PriceFeedFromS3`

___

### <a id="pricefeedapikeys" name="pricefeedapikeys"></a> priceFeedApiKeys

• **priceFeedApiKeys**: `ApiKeys` = `null`

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

### <a id="sourcechain" name="sourcechain"></a> sourceChain

• **sourceChain**: [`Chain`](Chain.md)

Source Chain model

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

#### Overrides

Base.supportedChains

___

### <a id="supportedlpchains" name="supportedlpchains"></a> supportedLpChains

• `get` **supportedLpChains**(): `string`[]

#### Returns

`string`[]

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

▸ **addLiquidity**(`amount0Desired`, `amount1Desired`, `chain?`, `options?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `amount0Desired` | `BigNumberish` | Amount of token #0 in smallest unit |
| `amount1Desired` | `BigNumberish` | Amount of token #1 in smallest unit |
| `chain?` | [`TChain`](../modules.md#tchain) | Chain model of desired chain to add liquidity to. |
| `options` | `Partial`<`AddLiquidityOptions`\> | Method options. |

#### Returns

`Promise`<`any`\>

Ethers transaction object.

**`Desc`**

Sends transaction to add liquidity to AMM.

___

### <a id="calcamountoutmin" name="calcamountoutmin"></a> calcAmountOutMin

▸ **calcAmountOutMin**(`amountOut`, `slippageTolerance`): `BigNumber`

#### Parameters

| Name | Type |
| :------ | :------ |
| `amountOut` | `BigNumberish` |
| `slippageTolerance` | `number` |

#### Returns

`BigNumber`

___

### <a id="calculatewithdrawonetoken" name="calculatewithdrawonetoken"></a> calculateWithdrawOneToken

▸ **calculateWithdrawOneToken**(`tokenAmount`, `tokenIndex`, `chain?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenAmount` | `BigNumberish` |
| `tokenIndex` | `number` |
| `chain?` | [`TChain`](../modules.md#tchain) |

#### Returns

`Promise`<`any`\>

___

### <a id="challengeperiod" name="challengeperiod"></a> challengePeriod

▸ `Readonly` **challengePeriod**(): `Promise`<`BigNumber`\>

#### Returns

`Promise`<`BigNumber`\>

The challenge period for the bridge as BigNumber.

**`Desc`**

The challenge period.

___

### <a id="checkblocklist" name="checkblocklist"></a> checkBlocklist

▸ **checkBlocklist**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

[Base](Base.md).[checkBlocklist](Base.md#checkblocklist)

___

### <a id="connect" name="connect"></a> connect

▸ **connect**(`signer`): [`HopBridge`](HopBridge.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | `Signer` | Ethers `Signer` for signing transactions. |

#### Returns

[`HopBridge`](HopBridge.md)

New HopBridge SDK instance with connected signer.

**`Desc`**

Returns hop bridge instance with signer connected. Used for adding or changing signer.

**`Example`**

```js
import { Hop, Token } from '@hop-protocol/sdk'
import { Wallet } from 'ethers'

const signer = new Wallet(privateKey)
let hop = new Hop()
// ...
const bridge = hop.bridge(Token.USDC).connect(signer)
```

___

### <a id="estimatebondwithdrawalgaslimit" name="estimatebondwithdrawalgaslimit"></a> estimateBondWithdrawalGasLimit

▸ **estimateBondWithdrawalGasLimit**(`sourceChain`, `destinationChain`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sourceChain` | [`TChain`](../modules.md#tchain) |
| `destinationChain` | [`TChain`](../modules.md#tchain) |

#### Returns

`Promise`<`any`\>

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

### <a id="estimatesendgaslimit" name="estimatesendgaslimit"></a> estimateSendGasLimit

▸ **estimateSendGasLimit**(`tokenAmount`, `sourceChain`, `destinationChain`, `options?`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenAmount` | `BigNumberish` |
| `sourceChain` | [`TChain`](../modules.md#tchain) |
| `destinationChain` | [`TChain`](../modules.md#tchain) |
| `options` | `Partial`<`SendOptions`\> |

#### Returns

`Promise`<`BigNumber`\>

___

### <a id="estimatesendhtokensgaslimit" name="estimatesendhtokensgaslimit"></a> estimateSendHTokensGasLimit

▸ **estimateSendHTokensGasLimit**(`tokenAmount`, `sourceChain`, `destinationChain`, `options?`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenAmount` | `BigNumberish` |
| `sourceChain` | [`TChain`](../modules.md#tchain) |
| `destinationChain` | [`TChain`](../modules.md#tchain) |
| `options` | `Partial`<`SendOptions`\> |

#### Returns

`Promise`<`BigNumber`\>

___

### <a id="execsaddleswap" name="execsaddleswap"></a> execSaddleSwap

▸ **execSaddleSwap**(`sourceChain`, `toHop`, `amount`, `minAmountOut`, `deadline`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sourceChain` | [`TChain`](../modules.md#tchain) | Source chain model. |
| `toHop` | `boolean` | Converts to Hop token only if set to true. |
| `amount` | `BigNumberish` | Amount of token to swap. |
| `minAmountOut` | `BigNumberish` | Minimum amount of tokens to receive in order for transaction to be successful. |
| `deadline` | `BigNumberish` | Transaction deadline in seconds. |

#### Returns

`Promise`<`any`\>

Ethers transaction object.

**`Desc`**

Sends transaction to execute swap on Saddle contract.

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

### <a id="formatunits" name="formatunits"></a> formatUnits

▸ **formatUnits**(`value`, `decimals?`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `BigNumberish` |
| `decimals?` | `number` |

#### Returns

`number`

___

### <a id="geconfigchains" name="geconfigchains"></a> geConfigChains

▸ **geConfigChains**(): `string`[]

#### Returns

`string`[]

#### Inherited from

[Base](Base.md).[geConfigChains](Base.md#geconfigchains)

___

### <a id="getaccountlpbalance" name="getaccountlpbalance"></a> getAccountLpBalance

▸ **getAccountLpBalance**(`chain`, `account?`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) |
| `account?` | `string` |

#### Returns

`Promise`<`BigNumber`\>

___

### <a id="getaccountlpcanonicalbalance" name="getaccountlpcanonicalbalance"></a> getAccountLpCanonicalBalance

▸ **getAccountLpCanonicalBalance**(`chain`, `account?`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) |
| `account?` | `string` |

#### Returns

`Promise`<`BigNumber`\>

___

### <a id="getaccountlpcanonicalbalanceusd" name="getaccountlpcanonicalbalanceusd"></a> getAccountLpCanonicalBalanceUsd

▸ **getAccountLpCanonicalBalanceUsd**(`chain`, `account?`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) |
| `account?` | `string` |

#### Returns

`Promise`<`number`\>

___

### <a id="getambbridge" name="getambbridge"></a> getAmbBridge

▸ **getAmbBridge**(`chain`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`Promise`<`any`\>

___

### <a id="getamm" name="getamm"></a> getAmm

▸ **getAmm**(`chain`): [`AMM`](AMM.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

[`AMM`](AMM.md)

___

### <a id="getammdata" name="getammdata"></a> getAmmData

▸ **getAmmData**(`chain`, `amountIn`, `isToHToken`, `slippageTolerance`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) |
| `amountIn` | `BigNumberish` |
| `isToHToken` | `boolean` |
| `slippageTolerance` | `number` |

#### Returns

`Promise`<`any`\>

___

### <a id="getammwrapper" name="getammwrapper"></a> getAmmWrapper

▸ **getAmmWrapper**(`chain`, `signer?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) | Chain model. |
| `signer` | [`TProvider`](../modules.md#tprovider) | Ethers signer |

#### Returns

`Promise`<`any`\>

Ethers contract instance.

**`Desc`**

Returns Hop Bridge AMM wrapper Ethers contract instance.

___

### <a id="getamountout" name="getamountout"></a> getAmountOut

▸ **getAmountOut**(`tokenAmountIn`, `sourceChain?`, `destinationChain?`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tokenAmountIn` | `BigNumberish` | Token amount input. |
| `sourceChain?` | [`TChain`](../modules.md#tchain) | Source chain model. |
| `destinationChain?` | [`TChain`](../modules.md#tchain) | Destination chain model. |

#### Returns

`Promise`<`BigNumber`\>

Amount as BigNumber.

**`Desc`**

Estimate token amount out.

**`Example`**

```js
import { Hop, Chain } from '@hop-protocol/sdk'

const hop = new Hop()
const bridge = hop.connect(signer).bridge('USDC')
const amountOut = await bridge.getAmountOut('1000000000000000000', Chain.Optimism, Chain.Gnosis)
console.log(amountOut)
```

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

### <a id="getavailableliquidity" name="getavailableliquidity"></a> getAvailableLiquidity

▸ **getAvailableLiquidity**(`destinationChain`, `bonder`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `destinationChain` | [`TChain`](../modules.md#tchain) |
| `bonder` | `string` |

#### Returns

`Promise`<`BigNumber`\>

___

### <a id="getavailableroutes" name="getavailableroutes"></a> getAvailableRoutes

▸ **getAvailableRoutes**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Inherited from

[Base](Base.md).[getAvailableRoutes](Base.md#getavailableroutes)

___

### <a id="getbonderaddress" name="getbonderaddress"></a> getBonderAddress

▸ **getBonderAddress**(`sourceChain`, `destinationChain`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sourceChain` | [`TChain`](../modules.md#tchain) |
| `destinationChain` | [`TChain`](../modules.md#tchain) |

#### Returns

`Promise`<`string`\>

___

### <a id="getbonderavailableliquiditydata" name="getbonderavailableliquiditydata"></a> getBonderAvailableLiquidityData

▸ **getBonderAvailableLiquidityData**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

___

### <a id="getbonderfeeabsolute" name="getbonderfeeabsolute"></a> getBonderFeeAbsolute

▸ **getBonderFeeAbsolute**(`sourceChain`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sourceChain` | [`TChain`](../modules.md#tchain) |

#### Returns

`Promise`<`BigNumber`\>

___

### <a id="getbridgecontract" name="getbridgecontract"></a> getBridgeContract

▸ **getBridgeContract**(`chain`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) | chain model. |

#### Returns

`Promise`<`any`\>

Ethers contract instance.

**`Desc`**

Returns bridge contract instance for specified chain.

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

### <a id="getcanonicaltoken" name="getcanonicaltoken"></a> getCanonicalToken

▸ **getCanonicalToken**(`chain`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`any`

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

### <a id="getchainnativetoken" name="getchainnativetoken"></a> getChainNativeToken

▸ **getChainNativeToken**(`chain`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`any`

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

### <a id="getcredit" name="getcredit"></a> getCredit

▸ **getCredit**(`sourceChain`, `bonder`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sourceChain` | [`TChain`](../modules.md#tchain) | Chain model. |
| `bonder` | `string` | - |

#### Returns

`Promise`<`BigNumber`\>

Total credit as BigNumber.

**`Desc`**

Returns total credit that bonder holds on Hop bridge at specified chain.

___

### <a id="getdebit" name="getdebit"></a> getDebit

▸ **getDebit**(`sourceChain`, `bonder`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sourceChain` | [`TChain`](../modules.md#tchain) | Chain model. |
| `bonder` | `string` | - |

#### Returns

`Promise`<`BigNumber`\>

Total debit as BigNumber.

**`Desc`**

Returns total debit that bonder holds on Hop bridge at specified chain.

___

### <a id="getdestinationfeegaspricemultiplier" name="getdestinationfeegaspricemultiplier"></a> getDestinationFeeGasPriceMultiplier

▸ **getDestinationFeeGasPriceMultiplier**(): `number`

#### Returns

`number`

#### Inherited from

[Base](Base.md).[getDestinationFeeGasPriceMultiplier](Base.md#getdestinationfeegaspricemultiplier)

___

### <a id="getdestinationtransactionfee" name="getdestinationtransactionfee"></a> getDestinationTransactionFee

▸ **getDestinationTransactionFee**(`sourceChain`, `destinationChain`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sourceChain` | [`TChain`](../modules.md#tchain) |
| `destinationChain` | [`TChain`](../modules.md#tchain) |

#### Returns

`Promise`<`BigNumber`\>

___

### <a id="getdestinationtransactionfeedata" name="getdestinationtransactionfeedata"></a> getDestinationTransactionFeeData

▸ **getDestinationTransactionFeeData**(`sourceChain`, `destinationChain`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sourceChain` | [`TChain`](../modules.md#tchain) |
| `destinationChain` | [`TChain`](../modules.md#tchain) |

#### Returns

`Promise`<`any`\>

___

### <a id="getethbalance" name="getethbalance"></a> getEthBalance

▸ **getEthBalance**(`chain?`, `address?`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) |
| `address?` | `string` |

#### Returns

`Promise`<`BigNumber`\>

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

### <a id="getfrontendavailableliquidity" name="getfrontendavailableliquidity"></a> getFrontendAvailableLiquidity

▸ **getFrontendAvailableLiquidity**(`sourceChain`, `destinationChain`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sourceChain` | [`TChain`](../modules.md#tchain) | Source chain model. |
| `destinationChain` | [`TChain`](../modules.md#tchain) | Destination chain model. |

#### Returns

`Promise`<`BigNumber`\>

Available liquidity as BigNumber.

**`Desc`**

Returns available liquidity for Hop bridge at specified chain.

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

### <a id="getl1bridge" name="getl1bridge"></a> getL1Bridge

▸ **getL1Bridge**(`signer?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | [`TProvider`](../modules.md#tprovider) | Ethers signer |

#### Returns

`Promise`<`any`\>

Ethers contract instance.

**`Desc`**

Returns Hop L1 Bridge Ethers contract instance.

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

### <a id="getl1bridgewrapperorl1bridge" name="getl1bridgewrapperorl1bridge"></a> getL1BridgeWrapperOrL1Bridge

▸ **getL1BridgeWrapperOrL1Bridge**(`sourceChain`, `destinationChain?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sourceChain` | [`TChain`](../modules.md#tchain) |
| `destinationChain?` | [`TChain`](../modules.md#tchain) |

#### Returns

`Promise`<`any`\>

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

### <a id="getl1token" name="getl1token"></a> getL1Token

▸ **getL1Token**(): `any`

#### Returns

`any`

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

### <a id="getl2bridge" name="getl2bridge"></a> getL2Bridge

▸ **getL2Bridge**(`chain`, `signer?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) | Chain model. |
| `signer` | [`TProvider`](../modules.md#tprovider) | Ethers signer |

#### Returns

`Promise`<`any`\>

Ethers contract instance.

**`Desc`**

Returns Hop L2 Bridge Ethers contract instance.

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

### <a id="getl2hoptoken" name="getl2hoptoken"></a> getL2HopToken

▸ **getL2HopToken**(`chain`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`any`

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

### <a id="getlpfees" name="getlpfees"></a> getLpFees

▸ **getLpFees**(`amountIn`, `sourceChain`, `destinationChain`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amountIn` | `BigNumberish` |
| `sourceChain` | [`TChain`](../modules.md#tchain) |
| `destinationChain` | [`TChain`](../modules.md#tchain) |

#### Returns

`Promise`<`BigNumber`\>

___

### <a id="getmessengerwrapperaddress" name="getmessengerwrapperaddress"></a> getMessengerWrapperAddress

▸ **getMessengerWrapperAddress**(`destinationChain`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `destinationChain` | [`TChain`](../modules.md#tchain) |

#### Returns

`Promise`<`string`\>

___

### <a id="getoptimisml1fee" name="getoptimisml1fee"></a> getOptimismL1Fee

▸ **getOptimismL1Fee**(`sourceChain`, `destinationChain`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sourceChain` | [`TChain`](../modules.md#tchain) |
| `destinationChain` | [`TChain`](../modules.md#tchain) |

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

### <a id="getrequiredliquidity" name="getrequiredliquidity"></a> getRequiredLiquidity

▸ **getRequiredLiquidity**(`tokenAmountIn`, `sourceChain`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tokenAmountIn` | `BigNumberish` | Token amount input. |
| `sourceChain` | [`TChain`](../modules.md#tchain) | Source chain model. |

#### Returns

`Promise`<`BigNumber`\>

Amount as BigNumber.

**`Desc`**

Estimate the bonder liquidity needed at the destination.

**`Example`**

```js
import { Hop, Chain } from '@hop-protocol/sdk'

const hop = new Hop()
const bridge = hop.connect(signer).bridge('USDC')
const requiredLiquidity = await bridge.getRequiredLiquidity('1000000000000000000', Chain.Optimism, Chain.Gnosis)
console.log(requiredLiquidity)
```

___

### <a id="getreservestotal" name="getreservestotal"></a> getReservesTotal

▸ **getReservesTotal**(`chain?`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) |

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

### <a id="getsaddlelptoken" name="getsaddlelptoken"></a> getSaddleLpToken

▸ **getSaddleLpToken**(`chain`, `signer?`): [`Token`](Token.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) | Chain model. |
| `signer` | [`TProvider`](../modules.md#tprovider) | Ethers signer |

#### Returns

[`Token`](Token.md)

Ethers contract instance.

**`Desc`**

Returns Hop Bridge Saddle Swap LP Token Ethers contract instance.

___

### <a id="getsaddleswapreserves" name="getsaddleswapreserves"></a> getSaddleSwapReserves

▸ **getSaddleSwapReserves**(`chain?`): `Promise`<`BigNumber`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) | Chain model. |

#### Returns

`Promise`<`BigNumber`[]\>

Array containing reserve amounts for canonical token
and hTokens.

**`Desc`**

Returns Hop Bridge Saddle reserve amounts.

___

### <a id="getsendapprovaladdress" name="getsendapprovaladdress"></a> getSendApprovalAddress

▸ **getSendApprovalAddress**(`sourceChain`, `isHTokenTransfer?`, `destinationChain?`): `string`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `sourceChain` | [`TChain`](../modules.md#tchain) | `undefined` |
| `isHTokenTransfer` | `boolean` | `false` |
| `destinationChain?` | [`TChain`](../modules.md#tchain) | `undefined` |

#### Returns

`string`

___

### <a id="getsenddata" name="getsenddata"></a> getSendData

▸ **getSendData**(`amountIn`, `sourceChain`, `destinationChain`, `isHTokenSend?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `amountIn` | `BigNumberish` | `undefined` |
| `sourceChain` | [`TChain`](../modules.md#tchain) | `undefined` |
| `destinationChain` | [`TChain`](../modules.md#tchain) | `undefined` |
| `isHTokenSend` | `boolean` | `false` |

#### Returns

`Promise`<`any`\>

___

### <a id="getsenddataamountoutmins" name="getsenddataamountoutmins"></a> getSendDataAmountOutMins

▸ **getSendDataAmountOutMins**(`getSendDataResponse`, `slippageTolerance`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `getSendDataResponse` | `any` |
| `slippageTolerance` | `number` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `amount` | `any` |
| `amountOutMin` | `BigNumber` |
| `deadline` | `number` |
| `destinationAmountOutMin` | `BigNumber` |
| `destinationDeadline` | `number` |

___

### <a id="getsendestimatedgascost" name="getsendestimatedgascost"></a> getSendEstimatedGasCost

▸ **getSendEstimatedGasCost**(`tokenAmount`, `sourceChain`, `destinationChain`, `options?`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenAmount` | `BigNumberish` |
| `sourceChain` | [`TChain`](../modules.md#tchain) |
| `destinationChain` | [`TChain`](../modules.md#tchain) |
| `options` | `Partial`<`SendOptions`\> |

#### Returns

`Promise`<`BigNumber`\>

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

### <a id="getsupportedlpchains" name="getsupportedlpchains"></a> getSupportedLpChains

▸ **getSupportedLpChains**(): `string`[]

#### Returns

`string`[]

___

### <a id="getsupportedtokens" name="getsupportedtokens"></a> getSupportedTokens

▸ **getSupportedTokens**(): `string`[]

#### Returns

`string`[]

#### Inherited from

[Base](Base.md).[getSupportedTokens](Base.md#getsupportedtokens)

___

### <a id="gettimeslot" name="gettimeslot"></a> getTimeSlot

▸ `Readonly` **getTimeSlot**(`time`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `time` | `BigNumberish` | Unix timestamp (in seconds) to get the time slot. |

#### Returns

`Promise`<`BigNumber`\>

Time slot for the given time as BigNumber.

**`Desc`**

The time slot for the current time.

___

### <a id="gettokenbalance" name="gettokenbalance"></a> getTokenBalance

▸ **getTokenBalance**(`chain`, `address?`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) |
| `address?` | `string` |

#### Returns

`Promise`<`BigNumber`\>

___

### <a id="gettokendecimals" name="gettokendecimals"></a> getTokenDecimals

▸ **getTokenDecimals**(): `number`

#### Returns

`number`

___

### <a id="gettokenimage" name="gettokenimage"></a> getTokenImage

▸ **getTokenImage**(): `string`

#### Returns

`string`

___

### <a id="gettokensymbol" name="gettokensymbol"></a> getTokenSymbol

▸ **getTokenSymbol**(): `string`

#### Returns

`string`

___

### <a id="gettotaldebit" name="gettotaldebit"></a> getTotalDebit

▸ **getTotalDebit**(`sourceChain`, `bonder`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sourceChain` | [`TChain`](../modules.md#tchain) | Chain model. |
| `bonder` | `string` | - |

#### Returns

`Promise`<`BigNumber`\>

Total debit as BigNumber.

**`Desc`**

Returns total debit, including sliding window debit, that bonder holds on Hop bridge at specified chain.

___

### <a id="gettotalfee" name="gettotalfee"></a> getTotalFee

▸ **getTotalFee**(`amountIn`, `sourceChain`, `destinationChain`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amountIn` | `BigNumberish` |
| `sourceChain` | [`TChain`](../modules.md#tchain) |
| `destinationChain` | [`TChain`](../modules.md#tchain) |

#### Returns

`Promise`<`BigNumber`\>

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

### <a id="gettvl" name="gettvl"></a> getTvl

▸ **getTvl**(`chain?`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`Promise`<`BigNumber`\>

___

### <a id="gettvlusd" name="gettvlusd"></a> getTvlUsd

▸ **getTvlUsd**(`chain?`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

`Promise`<`number`\>

___

### <a id="getunbondedtransferrootamount" name="getunbondedtransferrootamount"></a> getUnbondedTransferRootAmount

▸ **getUnbondedTransferRootAmount**(`sourceChain`, `destinationChain`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sourceChain` | [`TChain`](../modules.md#tchain) |
| `destinationChain` | [`TChain`](../modules.md#tchain) |

#### Returns

`Promise`<`BigNumber`\>

___

### <a id="getvaultbalance" name="getvaultbalance"></a> getVaultBalance

▸ **getVaultBalance**(`destinationChain`, `bonder`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `destinationChain` | [`TChain`](../modules.md#tchain) |
| `bonder` | `string` |

#### Returns

`Promise`<`BigNumber`\>

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

### <a id="getwithdrawproof" name="getwithdrawproof"></a> getWithdrawProof

▸ **getWithdrawProof**(`sourceChain`, `destinationChain`, `transferIdOrTransactionHash`): `Promise`<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sourceChain` | [`TChain`](../modules.md#tchain) |
| `destinationChain` | [`TChain`](../modules.md#tchain) |
| `transferIdOrTransactionHash` | `string` |

#### Returns

`Promise`<`string`[]\>

___

### <a id="isdestinationchainpaused" name="isdestinationchainpaused"></a> isDestinationChainPaused

▸ **isDestinationChainPaused**(`destinationChain`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `destinationChain` | [`TChain`](../modules.md#tchain) |

#### Returns

`Promise`<`boolean`\>

___

### <a id="isnativetoken" name="isnativetoken"></a> isNativeToken

▸ **isNativeToken**(`chain?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain?` | [`TChain`](../modules.md#tchain) |

#### Returns

`boolean`

___

### <a id="issupportedasset" name="issupportedasset"></a> isSupportedAsset

▸ **isSupportedAsset**(`chain`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) |

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

### <a id="needsapproval" name="needsapproval"></a> needsApproval

▸ **needsApproval**(`amount`, `sourceChain`, `address?`, `destinationChain?`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |
| `sourceChain` | [`TChain`](../modules.md#tchain) |
| `address?` | `string` |
| `destinationChain?` | [`TChain`](../modules.md#tchain) |

#### Returns

`Promise`<`boolean`\>

___

### <a id="needshtokenapproval" name="needshtokenapproval"></a> needsHTokenApproval

▸ **needsHTokenApproval**(`amount`, `sourceChain`, `address?`, `destinationChain?`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |
| `sourceChain` | [`TChain`](../modules.md#tchain) |
| `address?` | `string` |
| `destinationChain?` | [`TChain`](../modules.md#tchain) |

#### Returns

`Promise`<`boolean`\>

___

### <a id="parseunits" name="parseunits"></a> parseUnits

▸ **parseUnits**(`value`, `decimals?`): `BigNumber`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `BigNumberish` |
| `decimals?` | `number` |

#### Returns

`BigNumber`

___

### <a id="populatebondwithdrawaltx" name="populatebondwithdrawaltx"></a> populateBondWithdrawalTx

▸ **populateBondWithdrawalTx**(`sourceChain`, `destinationChain`, `recipient?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sourceChain` | [`TChain`](../modules.md#tchain) |
| `destinationChain` | [`TChain`](../modules.md#tchain) |
| `recipient?` | `string` |

#### Returns

`Promise`<`any`\>

___

### <a id="populatesendapprovaltx" name="populatesendapprovaltx"></a> populateSendApprovalTx

▸ **populateSendApprovalTx**(`tokenAmount`, `sourceChain`, `isHTokenTransfer?`, `destinationChain?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `tokenAmount` | `BigNumberish` | `undefined` |
| `sourceChain` | [`TChain`](../modules.md#tchain) | `undefined` |
| `isHTokenTransfer` | `boolean` | `false` |
| `destinationChain?` | [`TChain`](../modules.md#tchain) | `undefined` |

#### Returns

`Promise`<`any`\>

___

### <a id="populatesendhtokenstx" name="populatesendhtokenstx"></a> populateSendHTokensTx

▸ **populateSendHTokensTx**(`tokenAmount`, `sourceChain`, `destinationChain`, `options?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenAmount` | `BigNumberish` |
| `sourceChain` | [`TChain`](../modules.md#tchain) |
| `destinationChain` | [`TChain`](../modules.md#tchain) |
| `options` | `Partial`<`SendOptions`\> |

#### Returns

`Promise`<`any`\>

___

### <a id="populatesendtx" name="populatesendtx"></a> populateSendTx

▸ **populateSendTx**(`tokenAmount`, `sourceChain?`, `destinationChain?`, `options?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenAmount` | `BigNumberish` |
| `sourceChain?` | [`TChain`](../modules.md#tchain) |
| `destinationChain?` | [`TChain`](../modules.md#tchain) |
| `options` | `Partial`<`SendOptions`\> |

#### Returns

`Promise`<`any`\>

___

### <a id="populatewithdrawtransfertx" name="populatewithdrawtransfertx"></a> populateWithdrawTransferTx

▸ **populateWithdrawTransferTx**(`sourceChain`, `destinationChain`, `transferIdOrTransactionHash`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sourceChain` | [`TChain`](../modules.md#tchain) |
| `destinationChain` | [`TChain`](../modules.md#tchain) |
| `transferIdOrTransactionHash` | `string` |

#### Returns

`Promise`<`any`\>

___

### <a id="populatewithdrawtx" name="populatewithdrawtx"></a> populateWithdrawTx

▸ **populateWithdrawTx**(`chain`, `recipient`, `amount`, `transferNonce`, `bonderFee`, `amountOutMin`, `deadline`, `transferRootHash`, `rootTotalAmount`, `transferIdTreeIndex`, `siblings`, `totalLeaves`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) |
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

#### Returns

`Promise`<`any`\>

___

### <a id="removeliquidity" name="removeliquidity"></a> removeLiquidity

▸ **removeLiquidity**(`liquidityTokenAmount`, `chain?`, `options?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `liquidityTokenAmount` | `BigNumberish` | Amount of LP tokens to burn. |
| `chain?` | [`TChain`](../modules.md#tchain) | Chain model of desired chain to add liquidity to. |
| `options` | `Partial`<`RemoveLiquidityOptions`\> | Method options. |

#### Returns

`Promise`<`any`\>

Ethers transaction object.

**`Desc`**

Sends transaction to remove liquidity from AMM.

___

### <a id="removeliquidityimbalance" name="removeliquidityimbalance"></a> removeLiquidityImbalance

▸ **removeLiquidityImbalance**(`token0Amount`, `token1Amount`, `chain?`, `options?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `token0Amount` | `BigNumberish` |
| `token1Amount` | `BigNumberish` |
| `chain?` | [`TChain`](../modules.md#tchain) |
| `options` | `Partial`<`RemoveLiquidityImbalanceOptions`\> |

#### Returns

`Promise`<`any`\>

___

### <a id="removeliquidityonetoken" name="removeliquidityonetoken"></a> removeLiquidityOneToken

▸ **removeLiquidityOneToken**(`lpTokenAmount`, `tokenIndex`, `chain?`, `options?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `lpTokenAmount` | `BigNumberish` |
| `tokenIndex` | `number` |
| `chain?` | [`TChain`](../modules.md#tchain) |
| `options` | `Partial`<`RemoveLiquidityOneTokenOptions`\> |

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

### <a id="send" name="send"></a> send

▸ **send**(`tokenAmount`, `sourceChain?`, `destinationChain?`, `options?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tokenAmount` | `BigNumberish` | Token amount to send denominated in smallest unit. |
| `sourceChain?` | [`TChain`](../modules.md#tchain) | Source chain model. |
| `destinationChain?` | [`TChain`](../modules.md#tchain) | Destination chain model. |
| `options` | `Partial`<`SendOptions`\> | - |

#### Returns

`Promise`<`any`\>

Ethers Transaction object.

**`Desc`**

Send tokens to another chain.

**`Example`**

```js
import { Hop, Chain, Token } from '@hop-protocol/sdk'

const hop = new Hop()
const bridge = hop.connect(signer).bridge(Token.USDC)
// send 1 USDC token from Optimism -> Gnosis
const tx = await bridge.send('1000000000000000000', Chain.Optimism, Chain.Gnosis)
console.log(tx.hash)
```

___

### <a id="sendapproval" name="sendapproval"></a> sendApproval

▸ **sendApproval**(`tokenAmount`, `sourceChain`, `destinationChain`, `isHTokenTransfer?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `tokenAmount` | `BigNumberish` | `undefined` |
| `sourceChain` | [`TChain`](../modules.md#tchain) | `undefined` |
| `destinationChain` | [`TChain`](../modules.md#tchain) | `undefined` |
| `isHTokenTransfer` | `boolean` | `false` |

#### Returns

`Promise`<`any`\>

___

### <a id="sendhtoken" name="sendhtoken"></a> sendHToken

▸ **sendHToken**(`tokenAmount`, `sourceChain`, `destinationChain`, `options?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenAmount` | `BigNumberish` |
| `sourceChain` | [`TChain`](../modules.md#tchain) |
| `destinationChain` | [`TChain`](../modules.md#tchain) |
| `options` | `Partial`<`SendOptions`\> |

#### Returns

`Promise`<`any`\>

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

### <a id="shouldattemptswap" name="shouldattemptswap"></a> shouldAttemptSwap

▸ **shouldAttemptSwap**(`amountOutMin`, `deadline`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `amountOutMin` | `BigNumber` |
| `deadline` | `BigNumberish` |

#### Returns

`boolean`

___

### <a id="timeslotsize" name="timeslotsize"></a> timeSlotSize

▸ `Readonly` **timeSlotSize**(): `Promise`<`BigNumber`\>

#### Returns

`Promise`<`BigNumber`\>

The size of the time slots for the bridge as BigNumber.

**`Desc`**

The size of the time slots.

___

### <a id="timeslottoamountbonded" name="timeslottoamountbonded"></a> timeSlotToAmountBonded

▸ `Readonly` **timeSlotToAmountBonded**(`timeSlot`, `bonder`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `timeSlot` | `BigNumberish` | Time slot to get. |
| `bonder` | `string` | Address of the bonder to check. |

#### Returns

`Promise`<`BigNumber`\>

Amount bonded for the bonder for the given time slot as BigNumber.

**`Desc`**

The amount bonded for a time slot for a bonder.

___

### <a id="tocanonicaltoken" name="tocanonicaltoken"></a> toCanonicalToken

▸ **toCanonicalToken**(`token`, `network`, `chain`): [`Token`](Token.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `network` | `string` |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

[`Token`](Token.md)

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

### <a id="tohoptoken" name="tohoptoken"></a> toHopToken

▸ **toHopToken**(`token`, `network`, `chain`): [`Token`](Token.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`TToken`](../modules.md#ttoken) |
| `network` | `string` |
| `chain` | [`TChain`](../modules.md#tchain) |

#### Returns

[`Token`](Token.md)

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
| `sourceChain` | [`Chain`](Chain.md) |
| `destinationChain?` | [`Chain`](Chain.md) |

#### Returns

`Promise`<`any`\>

#### Inherited from

[Base](Base.md).[txOverrides](Base.md#txoverrides)

___

### <a id="willtransferfail" name="willtransferfail"></a> willTransferFail

▸ **willTransferFail**(`sourceChain`, `destinationChain`, `recipient`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sourceChain` | [`TChain`](../modules.md#tchain) |
| `destinationChain` | [`TChain`](../modules.md#tchain) |
| `recipient` | `string` |

#### Returns

`Promise`<`any`\>

___

### <a id="withdraw" name="withdraw"></a> withdraw

▸ **withdraw**(`chain`, `recipient`, `amount`, `transferNonce`, `bonderFee`, `amountOutMin`, `deadline`, `transferRootHash`, `rootTotalAmount`, `transferIdTreeIndex`, `siblings`, `totalLeaves`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`TChain`](../modules.md#tchain) |
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

#### Returns

`Promise`<`any`\>

___

### <a id="withdrawtransfer" name="withdrawtransfer"></a> withdrawTransfer

▸ **withdrawTransfer**(`sourceChain`, `destinationChain`, `transferIdOrTransactionHash`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sourceChain` | [`TChain`](../modules.md#tchain) |
| `destinationChain` | [`TChain`](../modules.md#tchain) |
| `transferIdOrTransactionHash` | `string` |

#### Returns

`Promise`<`any`\>
