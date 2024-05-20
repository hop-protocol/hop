# Class: TokenModel

## Table of contents

### Constructors

- [constructor](TokenModel.md#constructor)

### Properties

- [address](TokenModel.md#address)
- [chainId](TokenModel.md#chainid)
- [decimals](TokenModel.md#decimals)
- [name](TokenModel.md#name)
- [symbol](TokenModel.md#symbol)
- [DAI](TokenModel.md#dai)
- [ETH](TokenModel.md#eth)
- [HOP](TokenModel.md#hop)
- [MAGIC](TokenModel.md#magic)
- [MATIC](TokenModel.md#matic)
- [OP](TokenModel.md#op)
- [SNX](TokenModel.md#snx)
- [UNI](TokenModel.md#uni)
- [USDC](TokenModel.md#usdc)
- [USDT](TokenModel.md#usdt)
- [WBTC](TokenModel.md#wbtc)
- [WETH](TokenModel.md#weth)
- [WMATIC](TokenModel.md#wmatic)
- [WXDAI](TokenModel.md#wxdai)
- [XDAI](TokenModel.md#xdai)
- [rETH](TokenModel.md#reth)
- [sBTC](TokenModel.md#sbtc)
- [sETH](TokenModel.md#seth)
- [sUSD](TokenModel.md#susd)

### Accessors

- [canonicalSymbol](TokenModel.md#canonicalsymbol)

### Methods

- [getCanonicalSymbol](TokenModel.md#getcanonicalsymbol)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new TokenModel**(`chainId`, `address`, `decimals`, `symbol`, `name`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `string` \| `number` |
| `address` | `string` |
| `decimals` | `number` |
| `symbol` | `string` |
| `name` | `string` |

## Properties

### <a id="address" name="address"></a> address

• `Readonly` **address**: `string`

___

### <a id="chainid" name="chainid"></a> chainId

• `Readonly` **chainId**: `number`

___

### <a id="decimals" name="decimals"></a> decimals

• `Readonly` **decimals**: `number`

___

### <a id="name" name="name"></a> name

• `Readonly` **name**: `string`

___

### <a id="symbol" name="symbol"></a> symbol

• `Readonly` **symbol**: `string`

___

### <a id="dai" name="dai"></a> DAI

▪ `Static` **DAI**: `string` = `'DAI'`

___

### <a id="eth" name="eth"></a> ETH

▪ `Static` **ETH**: `string` = `'ETH'`

___

### <a id="hop" name="hop"></a> HOP

▪ `Static` **HOP**: `string` = `'HOP'`

___

### <a id="magic" name="magic"></a> MAGIC

▪ `Static` **MAGIC**: `string` = `'MAGIC'`

___

### <a id="matic" name="matic"></a> MATIC

▪ `Static` **MATIC**: `string` = `'MATIC'`

___

### <a id="op" name="op"></a> OP

▪ `Static` **OP**: `string` = `'OP'`

___

### <a id="snx" name="snx"></a> SNX

▪ `Static` **SNX**: `string` = `'SNX'`

___

### <a id="uni" name="uni"></a> UNI

▪ `Static` **UNI**: `string` = `'UNI'`

___

### <a id="usdc" name="usdc"></a> USDC

▪ `Static` **USDC**: `string` = `'USDC'`

___

### <a id="usdt" name="usdt"></a> USDT

▪ `Static` **USDT**: `string` = `'USDT'`

___

### <a id="wbtc" name="wbtc"></a> WBTC

▪ `Static` **WBTC**: `string` = `'WBTC'`

___

### <a id="weth" name="weth"></a> WETH

▪ `Static` **WETH**: `string` = `'WETH'`

___

### <a id="wmatic" name="wmatic"></a> WMATIC

▪ `Static` **WMATIC**: `string` = `'WMATIC'`

___

### <a id="wxdai" name="wxdai"></a> WXDAI

▪ `Static` **WXDAI**: `string` = `'WXDAI'`

___

### <a id="xdai" name="xdai"></a> XDAI

▪ `Static` **XDAI**: `string` = `'XDAI'`

___

### <a id="reth" name="reth"></a> rETH

▪ `Static` **rETH**: `string` = `'rETH'`

___

### <a id="sbtc" name="sbtc"></a> sBTC

▪ `Static` **sBTC**: `string` = `'sBTC'`

___

### <a id="seth" name="seth"></a> sETH

▪ `Static` **sETH**: `string` = `'sETH'`

___

### <a id="susd" name="susd"></a> sUSD

▪ `Static` **sUSD**: `string` = `'sUSD'`

## Accessors

### <a id="canonicalsymbol" name="canonicalsymbol"></a> canonicalSymbol

• `get` **canonicalSymbol**(): `string`

#### Returns

`string`

## Methods

### <a id="getcanonicalsymbol" name="getcanonicalsymbol"></a> getCanonicalSymbol

▸ `Static` **getCanonicalSymbol**(`tokenSymbol`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenSymbol` | `string` |

#### Returns

`string`
