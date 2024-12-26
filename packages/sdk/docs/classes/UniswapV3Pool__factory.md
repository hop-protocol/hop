# Class: UniswapV3Pool\_\_factory

## Table of contents

### Constructors

- [constructor](UniswapV3Pool__factory.md#constructor)

### Properties

- [abi](UniswapV3Pool__factory.md#abi)

### Methods

- [connect](UniswapV3Pool__factory.md#connect)
- [createInterface](UniswapV3Pool__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new UniswapV3Pool__factory**(): [`UniswapV3Pool__factory`](UniswapV3Pool__factory.md)

#### Returns

[`UniswapV3Pool__factory`](UniswapV3Pool__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "address"; `name`: `string` = "owner"; `type`: `string` = "address" }[] ; `name`: `string` = "Burn"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "int24"; `name`: `string` = "tickLower"; `type`: `string` = "int24" }[] ; `name`: `string` = "burn"; `outputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = "amount0"; `type`: `string` = "uint256" }[] ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`UniswapV3Pool`](../interfaces/UniswapV3Pool.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`UniswapV3Pool`](../interfaces/UniswapV3Pool.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `UniswapV3PoolInterface`

#### Returns

`UniswapV3PoolInterface`
