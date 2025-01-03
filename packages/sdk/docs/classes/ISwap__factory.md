# Class: ISwap\_\_factory

## Table of contents

### Constructors

- [constructor](ISwap__factory.md#constructor)

### Properties

- [abi](ISwap__factory.md#abi)

### Methods

- [connect](ISwap__factory.md#connect)
- [createInterface](ISwap__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new ISwap__factory**(): [`ISwap__factory`](ISwap__factory.md)

#### Returns

[`ISwap__factory`](ISwap__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: \{ `inputs`: \{ `internalType`: `string` = "uint256[]"; `name`: `string` = "amounts"; `type`: `string` = "uint256[]" }[] ; `name`: `string` = "addLiquidity"; `outputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" }[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`ISwap`](../interfaces/ISwap.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`ISwap`](../interfaces/ISwap.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `ISwapInterface`

#### Returns

`ISwapInterface`
