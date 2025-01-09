# Class: Timelock\_\_factory

## Table of contents

### Constructors

- [constructor](Timelock__factory.md#constructor)

### Properties

- [abi](Timelock__factory.md#abi)

### Methods

- [connect](Timelock__factory.md#connect)
- [createInterface](Timelock__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new Timelock__factory**(): [`Timelock__factory`](Timelock__factory.md)

#### Returns

[`Timelock__factory`](Timelock__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous?`: `undefined` = false; `constant?`: `undefined` = true; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "admin\_"; `type`: `string` = "address" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `payable`: `boolean` = false; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `anonymous`: `boolean` = false; `constant?`: `undefined` = true; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "bytes32"; `name`: `string` = "txHash"; `type`: `string` = "bytes32" }[] ; `name`: `string` = "CancelTransaction"; `outputs?`: `undefined` ; `payable?`: `undefined` = false; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `constant?`: `undefined` = true; `inputs?`: `undefined` ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `payable`: `boolean` = true; `stateMutability`: `string` = "payable"; `type`: `string` = "fallback" } \| \{ `anonymous?`: `undefined` = false; `constant`: `boolean` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "target"; `type`: `string` = "address" }[] ; `name`: `string` = "executeTransaction"; `outputs`: \{ `internalType`: `string` = "bytes"; `name`: `string` = ""; `type`: `string` = "bytes" }[] ; `payable`: `boolean` = true; `stateMutability`: `string` = "payable"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`Timelock`](../interfaces/Timelock.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`Timelock`](../interfaces/Timelock.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `TimelockInterface`

#### Returns

`TimelockInterface`
