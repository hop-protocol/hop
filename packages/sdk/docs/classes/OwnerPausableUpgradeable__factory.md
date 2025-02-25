# Class: OwnerPausableUpgradeable\_\_factory

## Table of contents

### Constructors

- [constructor](OwnerPausableUpgradeable__factory.md#constructor)

### Properties

- [abi](OwnerPausableUpgradeable__factory.md#abi)

### Methods

- [connect](OwnerPausableUpgradeable__factory.md#connect)
- [createInterface](OwnerPausableUpgradeable__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new OwnerPausableUpgradeable__factory**(): [`OwnerPausableUpgradeable__factory`](OwnerPausableUpgradeable__factory.md)

#### Returns

[`OwnerPausableUpgradeable__factory`](OwnerPausableUpgradeable__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "address"; `name`: `string` = "previousOwner"; `type`: `string` = "address" }[] ; `name`: `string` = "OwnershipTransferred"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: `never`[] = []; `name`: `string` = "owner"; `outputs`: \{ `internalType`: `string` = "address"; `name`: `string` = ""; `type`: `string` = "address" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "newOwner"; `type`: `string` = "address" }[] ; `name`: `string` = "transferOwnership"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`OwnerPausableUpgradeable`](../interfaces/OwnerPausableUpgradeable.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`OwnerPausableUpgradeable`](../interfaces/OwnerPausableUpgradeable.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `OwnerPausableUpgradeableInterface`

#### Returns

`OwnerPausableUpgradeableInterface`
