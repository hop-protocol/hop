# Class: IBridge\_\_factory

## Table of contents

### Constructors

- [constructor](IBridge__factory.md#constructor)

### Properties

- [abi](IBridge__factory.md#abi)

### Methods

- [connect](IBridge__factory.md#connect)
- [createInterface](IBridge__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new IBridge__factory**(): [`IBridge__factory`](IBridge__factory.md)

#### Returns

[`IBridge__factory`](IBridge__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "uint256"; `name`: `string` = "messageIndex"; `type`: `string` = "uint256" }[] ; `name`: `string` = "MessageDelivered"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "inbox"; `type`: `string` = "address" }[] ; `name`: `string` = "allowedInboxes"; `outputs`: \{ `internalType`: `string` = "bool"; `name`: `string` = ""; `type`: `string` = "bool" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`IBridge`](../interfaces/IBridge.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`IBridge`](../interfaces/IBridge.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `IBridgeInterface`

#### Returns

`IBridgeInterface`
