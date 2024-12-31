# Class: IWETH\_\_factory

## Table of contents

### Constructors

- [constructor](IWETH__factory.md#constructor)

### Properties

- [abi](IWETH__factory.md#abi)

### Methods

- [connect](IWETH__factory.md#connect)
- [createInterface](IWETH__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new IWETH__factory**(): [`IWETH__factory`](IWETH__factory.md)

#### Returns

[`IWETH__factory`](IWETH__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: \{ `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "to"; `type`: `string` = "address" }[] ; `name`: `string` = "transfer"; `outputs`: \{ `internalType`: `string` = "bool"; `name`: `string` = ""; `type`: `string` = "bool" }[] ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" }[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`IWETH`](../interfaces/IWETH.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`IWETH`](../interfaces/IWETH.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `IWETHInterface`

#### Returns

`IWETHInterface`
