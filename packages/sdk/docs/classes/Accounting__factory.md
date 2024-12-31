# Class: Accounting\_\_factory

## Table of contents

### Constructors

- [constructor](Accounting__factory.md#constructor)

### Properties

- [abi](Accounting__factory.md#abi)

### Methods

- [connect](Accounting__factory.md#connect)
- [createInterface](Accounting__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new Accounting__factory**(): [`Accounting__factory`](Accounting__factory.md)

#### Returns

[`Accounting__factory`](Accounting__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address[]"; `name`: `string` = "bonders"; `type`: `string` = "address[]" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "address"; `name`: `string` = "newBonder"; `type`: `string` = "address" }[] ; `name`: `string` = "BonderAdded"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "bonder"; `type`: `string` = "address" }[] ; `name`: `string` = "getCredit"; `outputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`Accounting`](../interfaces/Accounting.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`Accounting`](../interfaces/Accounting.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `AccountingInterface`

#### Returns

`AccountingInterface`
