# Class: IERC20\_\_factory

## Table of contents

### Constructors

- [constructor](IERC20__factory.md#constructor)

### Properties

- [abi](IERC20__factory.md#abi)

### Methods

- [connect](IERC20__factory.md#connect)
- [createInterface](IERC20__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new IERC20__factory**(): [`IERC20__factory`](IERC20__factory.md)

#### Returns

[`IERC20__factory`](IERC20__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "address"; `name`: `string` = "owner"; `type`: `string` = "address" }[] ; `name`: `string` = "Approval"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "owner"; `type`: `string` = "address" }[] ; `name`: `string` = "allowance"; `outputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`IERC20`](../interfaces/IERC20.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`IERC20`](../interfaces/IERC20.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `IERC20Interface`

#### Returns

`IERC20Interface`
