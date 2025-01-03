# Class: PausableUpgradeable\_\_factory

## Table of contents

### Constructors

- [constructor](PausableUpgradeable__factory.md#constructor)

### Properties

- [abi](PausableUpgradeable__factory.md#abi)

### Methods

- [connect](PausableUpgradeable__factory.md#connect)
- [createInterface](PausableUpgradeable__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new PausableUpgradeable__factory**(): [`PausableUpgradeable__factory`](PausableUpgradeable__factory.md)

#### Returns

[`PausableUpgradeable__factory`](PausableUpgradeable__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = false; `internalType`: `string` = "address"; `name`: `string` = "account"; `type`: `string` = "address" }[] ; `name`: `string` = "Paused"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: `never`[] = []; `name`: `string` = "paused"; `outputs`: \{ `internalType`: `string` = "bool"; `name`: `string` = ""; `type`: `string` = "bool" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`PausableUpgradeable`](../interfaces/PausableUpgradeable.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`PausableUpgradeable`](../interfaces/PausableUpgradeable.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `PausableUpgradeableInterface`

#### Returns

`PausableUpgradeableInterface`
