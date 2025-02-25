# Class: IArbSys\_\_factory

## Table of contents

### Constructors

- [constructor](IArbSys__factory.md#constructor)

### Properties

- [abi](IArbSys__factory.md#abi)

### Methods

- [connect](IArbSys__factory.md#connect)
- [createInterface](IArbSys__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new IArbSys__factory**(): [`IArbSys__factory`](IArbSys__factory.md)

#### Returns

[`IArbSys__factory`](IArbSys__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "address"; `name`: `string` = "destAddr"; `type`: `string` = "address" }[] ; `name`: `string` = "ERC20Withdrawal"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "account"; `type`: `string` = "address" }[] ; `name`: `string` = "getTransactionCount"; `outputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`IArbSys`](../interfaces/IArbSys.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`IArbSys`](../interfaces/IArbSys.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `IArbSysInterface`

#### Returns

`IArbSysInterface`
