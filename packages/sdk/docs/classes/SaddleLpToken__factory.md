# Class: SaddleLpToken\_\_factory

## Table of contents

### Constructors

- [constructor](SaddleLpToken__factory.md#constructor)

### Properties

- [abi](SaddleLpToken__factory.md#abi)

### Methods

- [connect](SaddleLpToken__factory.md#connect)
- [createInterface](SaddleLpToken__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new SaddleLpToken__factory**(): [`SaddleLpToken__factory`](SaddleLpToken__factory.md)

#### Returns

[`SaddleLpToken__factory`](SaddleLpToken__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "string"; `name`: `string` = "name\_"; `type`: `string` = "string" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "address"; `name`: `string` = "owner"; `type`: `string` = "address" }[] ; `name`: `string` = "Approval"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "owner"; `type`: `string` = "address" }[] ; `name`: `string` = "allowance"; `outputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`SaddleLpToken`](../interfaces/SaddleLpToken.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`SaddleLpToken`](../interfaces/SaddleLpToken.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `SaddleLpTokenInterface`

#### Returns

`SaddleLpTokenInterface`
