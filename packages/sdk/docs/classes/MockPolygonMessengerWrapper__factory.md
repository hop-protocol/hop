# Class: MockPolygonMessengerWrapper\_\_factory

## Table of contents

### Constructors

- [constructor](MockPolygonMessengerWrapper__factory.md#constructor)

### Properties

- [abi](MockPolygonMessengerWrapper__factory.md#abi)

### Methods

- [connect](MockPolygonMessengerWrapper__factory.md#connect)
- [createInterface](MockPolygonMessengerWrapper__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new MockPolygonMessengerWrapper__factory**(): [`MockPolygonMessengerWrapper__factory`](MockPolygonMessengerWrapper__factory.md)

#### Returns

[`MockPolygonMessengerWrapper__factory`](MockPolygonMessengerWrapper__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "\_l1BridgeAddress"; `type`: `string` = "address" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `inputs`: \{ `internalType`: `string` = "bytes32"; `name`: `string` = ""; `type`: `string` = "bytes32" }[] ; `name`: `string` = "processedExits"; `outputs`: \{ `internalType`: `string` = "bool"; `name`: `string` = ""; `type`: `string` = "bool" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`MockPolygonMessengerWrapper`](../interfaces/MockPolygonMessengerWrapper.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`MockPolygonMessengerWrapper`](../interfaces/MockPolygonMessengerWrapper.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `MockPolygonMessengerWrapperInterface`

#### Returns

`MockPolygonMessengerWrapperInterface`
