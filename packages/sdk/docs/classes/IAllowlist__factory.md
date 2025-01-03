# Class: IAllowlist\_\_factory

## Table of contents

### Constructors

- [constructor](IAllowlist__factory.md#constructor)

### Properties

- [abi](IAllowlist__factory.md#abi)

### Methods

- [connect](IAllowlist__factory.md#connect)
- [createInterface](IAllowlist__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new IAllowlist__factory**(): [`IAllowlist__factory`](IAllowlist__factory.md)

#### Returns

[`IAllowlist__factory`](IAllowlist__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: \{ `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "poolAddress"; `type`: `string` = "address" }[] ; `name`: `string` = "getPoolAccountLimit"; `outputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" }[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`IAllowlist`](../interfaces/IAllowlist.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`IAllowlist`](../interfaces/IAllowlist.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `IAllowlistInterface`

#### Returns

`IAllowlistInterface`
