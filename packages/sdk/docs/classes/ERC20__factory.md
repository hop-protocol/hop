# Class: ERC20\_\_factory

## Table of contents

### Constructors

- [constructor](ERC20__factory.md#constructor)

### Properties

- [abi](ERC20__factory.md#abi)

### Methods

- [connect](ERC20__factory.md#connect)
- [createInterface](ERC20__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new ERC20__factory**(): [`ERC20__factory`](ERC20__factory.md)

#### Returns

[`ERC20__factory`](ERC20__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "string"; `name`: `string` = "name\_"; `type`: `string` = "string" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "address"; `name`: `string` = "owner"; `type`: `string` = "address" }[] ; `name`: `string` = "Approval"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "owner"; `type`: `string` = "address" }[] ; `name`: `string` = "allowance"; `outputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`ERC20`](../interfaces/ERC20.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`ERC20`](../interfaces/ERC20.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `ERC20Interface`

#### Returns

`ERC20Interface`
