# Class: OwnableUpgradeable\_\_factory

## Table of contents

### Constructors

- [constructor](OwnableUpgradeable__factory.md#constructor)

### Properties

- [abi](OwnableUpgradeable__factory.md#abi)

### Methods

- [connect](OwnableUpgradeable__factory.md#connect)
- [createInterface](OwnableUpgradeable__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new OwnableUpgradeable__factory**(): [`OwnableUpgradeable__factory`](OwnableUpgradeable__factory.md)

#### Returns

[`OwnableUpgradeable__factory`](OwnableUpgradeable__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "address"; `name`: `string` = "previousOwner"; `type`: `string` = "address" }[] ; `name`: `string` = "OwnershipTransferred"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: `never`[] = []; `name`: `string` = "owner"; `outputs`: \{ `internalType`: `string` = "address"; `name`: `string` = ""; `type`: `string` = "address" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "newOwner"; `type`: `string` = "address" }[] ; `name`: `string` = "transferOwnership"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`OwnableUpgradeable`](../interfaces/OwnableUpgradeable.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`OwnableUpgradeable`](../interfaces/OwnableUpgradeable.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `OwnableUpgradeableInterface`

#### Returns

`OwnableUpgradeableInterface`
