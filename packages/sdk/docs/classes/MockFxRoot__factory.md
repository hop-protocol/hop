# Class: MockFxRoot\_\_factory

## Table of contents

### Constructors

- [constructor](MockFxRoot__factory.md#constructor)

### Properties

- [abi](MockFxRoot__factory.md#abi)

### Methods

- [connect](MockFxRoot__factory.md#connect)
- [createInterface](MockFxRoot__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new MockFxRoot__factory**(): [`MockFxRoot__factory`](MockFxRoot__factory.md)

#### Returns

[`MockFxRoot__factory`](MockFxRoot__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "\_stateSender"; `type`: `string` = "address" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `inputs`: `never`[] = []; `name`: `string` = "fxChild"; `outputs`: \{ `internalType`: `string` = "address"; `name`: `string` = ""; `type`: `string` = "address" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" } \| \{ `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "\_receiver"; `type`: `string` = "address" }[] ; `name`: `string` = "sendMessageToChild"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`MockFxRoot`](../interfaces/MockFxRoot.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`MockFxRoot`](../interfaces/MockFxRoot.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `MockFxRootInterface`

#### Returns

`MockFxRootInterface`
