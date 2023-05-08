# Class: Chain

## Table of contents

### Constructors

- [constructor](Chain.md#constructor)

### Properties

- [chainId](Chain.md#chainid)
- [isL1](Chain.md#isl1)
- [name](Chain.md#name)
- [nativeTokenSymbol](Chain.md#nativetokensymbol)
- [provider](Chain.md#provider)
- [slug](Chain.md#slug)
- [Arbitrum](Chain.md#arbitrum)
- [Base](Chain.md#base)
- [Ethereum](Chain.md#ethereum)
- [Gnosis](Chain.md#gnosis)
- [Linea](Chain.md#linea)
- [Nova](Chain.md#nova)
- [Optimism](Chain.md#optimism)
- [Polygon](Chain.md#polygon)
- [ScrollZk](Chain.md#scrollzk)
- [ZkSync](Chain.md#zksync)

### Accessors

- [rpcUrl](Chain.md#rpcurl)

### Methods

- [equals](Chain.md#equals)
- [fromSlug](Chain.md#fromslug)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new Chain**(`name`, `chainId?`, `provider?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `chainId?` | `number` |
| `provider?` | `Provider` |

## Properties

### <a id="chainid" name="chainid"></a> chainId

• **chainId**: `number`

___

### <a id="isl1" name="isl1"></a> isL1

• **isL1**: `boolean` = `false`

___

### <a id="name" name="name"></a> name

• **name**: `string` = `''`

___

### <a id="nativetokensymbol" name="nativetokensymbol"></a> nativeTokenSymbol

• **nativeTokenSymbol**: `string`

___

### <a id="provider" name="provider"></a> provider

• **provider**: `Provider` = `null`

___

### <a id="slug" name="slug"></a> slug

• **slug**: `string` = `''`

___

### <a id="arbitrum" name="arbitrum"></a> Arbitrum

▪ `Static` **Arbitrum**: [`Chain`](Chain.md)

___

### <a id="base" name="base"></a> Base

▪ `Static` **Base**: [`Chain`](Chain.md)

___

### <a id="ethereum" name="ethereum"></a> Ethereum

▪ `Static` **Ethereum**: [`Chain`](Chain.md)

___

### <a id="gnosis" name="gnosis"></a> Gnosis

▪ `Static` **Gnosis**: [`Chain`](Chain.md)

___

### <a id="linea" name="linea"></a> Linea

▪ `Static` **Linea**: [`Chain`](Chain.md)

___

### <a id="nova" name="nova"></a> Nova

▪ `Static` **Nova**: [`Chain`](Chain.md)

___

### <a id="optimism" name="optimism"></a> Optimism

▪ `Static` **Optimism**: [`Chain`](Chain.md)

___

### <a id="polygon" name="polygon"></a> Polygon

▪ `Static` **Polygon**: [`Chain`](Chain.md)

___

### <a id="scrollzk" name="scrollzk"></a> ScrollZk

▪ `Static` **ScrollZk**: [`Chain`](Chain.md)

___

### <a id="zksync" name="zksync"></a> ZkSync

▪ `Static` **ZkSync**: [`Chain`](Chain.md)

## Accessors

### <a id="rpcurl" name="rpcurl"></a> rpcUrl

• `get` **rpcUrl**(): `any`

#### Returns

`any`

## Methods

### <a id="equals" name="equals"></a> equals

▸ **equals**(`other`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | [`Chain`](Chain.md) |

#### Returns

`boolean`

___

### <a id="fromslug" name="fromslug"></a> fromSlug

▸ `Static` **fromSlug**(`slug`): [`Chain`](Chain.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |

#### Returns

[`Chain`](Chain.md)
