# Class: ArbERC20\_\_factory

## Table of contents

### Constructors

- [constructor](ArbERC20__factory.md#constructor)

### Properties

- [abi](ArbERC20__factory.md#abi)

### Methods

- [connect](ArbERC20__factory.md#connect)
- [createInterface](ArbERC20__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new ArbERC20__factory**(): [`ArbERC20__factory`](ArbERC20__factory.md)

#### Returns

[`ArbERC20__factory`](ArbERC20__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: \{ `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "account"; `type`: `string` = "address" }[] ; `name`: `string` = "withdraw"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" }[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`ArbERC20`](../interfaces/ArbERC20.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`ArbERC20`](../interfaces/ArbERC20.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `ArbERC20Interface`

#### Returns

`ArbERC20Interface`
