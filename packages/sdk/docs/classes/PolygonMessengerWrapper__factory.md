# Class: PolygonMessengerWrapper\_\_factory

## Table of contents

### Constructors

- [constructor](PolygonMessengerWrapper__factory.md#constructor)

### Properties

- [abi](PolygonMessengerWrapper__factory.md#abi)

### Methods

- [connect](PolygonMessengerWrapper__factory.md#connect)
- [createInterface](PolygonMessengerWrapper__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new PolygonMessengerWrapper__factory**(): [`PolygonMessengerWrapper__factory`](PolygonMessengerWrapper__factory.md)

#### Returns

[`PolygonMessengerWrapper__factory`](PolygonMessengerWrapper__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "\_l1BridgeAddress"; `type`: `string` = "address" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `inputs`: \{ `internalType`: `string` = "contract IL1Bridge"; `name`: `string` = "l1Bridge"; `type`: `string` = "address" }[] ; `name`: `string` = "canConfirmRoot"; `outputs`: \{ `internalType`: `string` = "bool"; `name`: `string` = ""; `type`: `string` = "bool" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`PolygonMessengerWrapper`](../interfaces/PolygonMessengerWrapper.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`PolygonMessengerWrapper`](../interfaces/PolygonMessengerWrapper.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `PolygonMessengerWrapperInterface`

#### Returns

`PolygonMessengerWrapperInterface`
