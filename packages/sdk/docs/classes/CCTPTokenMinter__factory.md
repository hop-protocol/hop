# Class: CCTPTokenMinter\_\_factory

## Table of contents

### Constructors

- [constructor](CCTPTokenMinter__factory.md#constructor)

### Properties

- [abi](CCTPTokenMinter__factory.md#abi)

### Methods

- [connect](CCTPTokenMinter__factory.md#connect)
- [createInterface](CCTPTokenMinter__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new CCTPTokenMinter__factory**(): [`CCTPTokenMinter__factory`](CCTPTokenMinter__factory.md)

#### Returns

[`CCTPTokenMinter__factory`](CCTPTokenMinter__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "\_tokenController"; `type`: `string` = "address" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = false; `internalType`: `string` = "address"; `name`: `string` = "localTokenMessenger"; `type`: `string` = "address" }[] ; `name`: `string` = "LocalTokenMessengerAdded"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = ""; `type`: `string` = "address" }[] ; `name`: `string` = "burnLimitsPerMessage"; `outputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`CCTPTokenMinter`](../interfaces/CCTPTokenMinter.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`CCTPTokenMinter`](../interfaces/CCTPTokenMinter.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `CCTPTokenMinterInterface`

#### Returns

`CCTPTokenMinterInterface`
