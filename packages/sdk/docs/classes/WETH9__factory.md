# Class: WETH9\_\_factory

## Table of contents

### Constructors

- [constructor](WETH9__factory.md#constructor)

### Properties

- [abi](WETH9__factory.md#abi)

### Methods

- [connect](WETH9__factory.md#connect)
- [createInterface](WETH9__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new WETH9__factory**(): [`WETH9__factory`](WETH9__factory.md)

#### Returns

[`WETH9__factory`](WETH9__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous?`: `undefined` = false; `constant`: `boolean` = false; `inputs`: \{ `name`: `string` = "guy"; `type`: `string` = "address" }[] ; `name`: `string` = "approve"; `outputs`: \{ `name`: `string` = ""; `type`: `string` = "bool" }[] ; `payable`: `boolean` = false; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" } \| \{ `anonymous?`: `undefined` = false; `constant?`: `undefined` = true; `inputs?`: `undefined` ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `payable`: `boolean` = true; `stateMutability`: `string` = "payable"; `type`: `string` = "fallback" } \| \{ `anonymous`: `boolean` = false; `constant?`: `undefined` = true; `inputs`: \{ `indexed`: `boolean` = true; `name`: `string` = "src"; `type`: `string` = "address" }[] ; `name`: `string` = "Approval"; `outputs?`: `undefined` ; `payable?`: `undefined` = false; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`WETH9`](../interfaces/WETH9.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`WETH9`](../interfaces/WETH9.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `WETH9Interface`

#### Returns

`WETH9Interface`
