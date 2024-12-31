# Class: MockMessenger\_\_factory

## Table of contents

### Constructors

- [constructor](MockMessenger__factory.md#constructor)

### Properties

- [abi](MockMessenger__factory.md#abi)

### Methods

- [connect](MockMessenger__factory.md#connect)
- [createInterface](MockMessenger__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new MockMessenger__factory**(): [`MockMessenger__factory`](MockMessenger__factory.md)

#### Returns

[`MockMessenger__factory`](MockMessenger__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `inputs`: \{ `internalType`: `string` = "contract IERC20"; `name`: `string` = "\_canonicalToken"; `type`: `string` = "address" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `inputs`: `never`[] = []; `name`: `string` = "canonicalToken"; `outputs`: \{ `internalType`: `string` = "contract IERC20"; `name`: `string` = ""; `type`: `string` = "address" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" } \| \{ `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "\_target"; `type`: `string` = "address" }[] ; `name`: `string` = "receiveMessage"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`MockMessenger`](../interfaces/MockMessenger.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`MockMessenger`](../interfaces/MockMessenger.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `MockMessengerInterface`

#### Returns

`MockMessengerInterface`
