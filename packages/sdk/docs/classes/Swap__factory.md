# Class: Swap\_\_factory

## Table of contents

### Constructors

- [constructor](Swap__factory.md#constructor)

### Properties

- [abi](Swap__factory.md#abi)

### Methods

- [connect](Swap__factory.md#connect)
- [createInterface](Swap__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new Swap__factory**(): [`Swap__factory`](Swap__factory.md)

#### Returns

[`Swap__factory`](Swap__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "address"; `name`: `string` = "provider"; `type`: `string` = "address" }[] ; `name`: `string` = "AddLiquidity"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "uint256[]"; `name`: `string` = "amounts"; `type`: `string` = "uint256[]" }[] ; `name`: `string` = "addLiquidity"; `outputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`Swap`](../interfaces/Swap.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`Swap`](../interfaces/Swap.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `SwapInterface`

#### Returns

`SwapInterface`
