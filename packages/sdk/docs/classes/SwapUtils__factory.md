# Class: SwapUtils\_\_factory

## Table of contents

### Constructors

- [constructor](SwapUtils__factory.md#constructor)

### Properties

- [abi](SwapUtils__factory.md#abi)

### Methods

- [connect](SwapUtils__factory.md#connect)
- [createInterface](SwapUtils__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new SwapUtils__factory**(): [`SwapUtils__factory`](SwapUtils__factory.md)

#### Returns

[`SwapUtils__factory`](SwapUtils__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "address"; `name`: `string` = "provider"; `type`: `string` = "address" }[] ; `name`: `string` = "AddLiquidity"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: `never`[] = []; `name`: `string` = "A\_PRECISION"; `outputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`SwapUtils`](../interfaces/SwapUtils.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`SwapUtils`](../interfaces/SwapUtils.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `SwapUtilsInterface`

#### Returns

`SwapUtilsInterface`
