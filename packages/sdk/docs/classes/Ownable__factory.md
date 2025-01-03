# Class: Ownable\_\_factory

## Table of contents

### Constructors

- [constructor](Ownable__factory.md#constructor)

### Properties

- [abi](Ownable__factory.md#abi)

### Methods

- [connect](Ownable__factory.md#connect)
- [createInterface](Ownable__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new Ownable__factory**(): [`Ownable__factory`](Ownable__factory.md)

#### Returns

[`Ownable__factory`](Ownable__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "address"; `name`: `string` = "previousOwner"; `type`: `string` = "address" }[] ; `name`: `string` = "OwnershipTransferred"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: `never`[] = []; `name`: `string` = "owner"; `outputs`: \{ `internalType`: `string` = "address"; `name`: `string` = ""; `type`: `string` = "address" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "newOwner"; `type`: `string` = "address" }[] ; `name`: `string` = "transferOwnership"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`Ownable`](../interfaces/Ownable.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`Ownable`](../interfaces/Ownable.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `OwnableInterface`

#### Returns

`OwnableInterface`
