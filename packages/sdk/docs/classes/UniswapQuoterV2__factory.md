# Class: UniswapQuoterV2\_\_factory

## Table of contents

### Constructors

- [constructor](UniswapQuoterV2__factory.md#constructor)

### Properties

- [abi](UniswapQuoterV2__factory.md#abi)

### Methods

- [connect](UniswapQuoterV2__factory.md#connect)
- [createInterface](UniswapQuoterV2__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new UniswapQuoterV2__factory**(): [`UniswapQuoterV2__factory`](UniswapQuoterV2__factory.md)

#### Returns

[`UniswapQuoterV2__factory`](UniswapQuoterV2__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: \{ `inputs`: \{ `internalType`: `string` = "bytes"; `name`: `string` = "path"; `type`: `string` = "bytes" }[] ; `name`: `string` = "quoteExactInput"; `outputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = "amountOut"; `type`: `string` = "uint256" }[] ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" }[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`UniswapQuoterV2`](../interfaces/UniswapQuoterV2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`UniswapQuoterV2`](../interfaces/UniswapQuoterV2.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `UniswapQuoterV2Interface`

#### Returns

`UniswapQuoterV2Interface`
