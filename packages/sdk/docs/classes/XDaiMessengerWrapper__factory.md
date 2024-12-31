# Class: XDaiMessengerWrapper\_\_factory

## Table of contents

### Constructors

- [constructor](XDaiMessengerWrapper__factory.md#constructor)

### Properties

- [abi](XDaiMessengerWrapper__factory.md#abi)

### Methods

- [connect](XDaiMessengerWrapper__factory.md#connect)
- [createInterface](XDaiMessengerWrapper__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new XDaiMessengerWrapper__factory**(): [`XDaiMessengerWrapper__factory`](XDaiMessengerWrapper__factory.md)

#### Returns

[`XDaiMessengerWrapper__factory`](XDaiMessengerWrapper__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "\_l1BridgeAddress"; `type`: `string` = "address" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `inputs`: \{ `internalType`: `string` = "contract IL1Bridge"; `name`: `string` = "l1Bridge"; `type`: `string` = "address" }[] ; `name`: `string` = "canConfirmRoot"; `outputs`: \{ `internalType`: `string` = "bool"; `name`: `string` = ""; `type`: `string` = "bool" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`XDaiMessengerWrapper`](../interfaces/XDaiMessengerWrapper.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`XDaiMessengerWrapper`](../interfaces/XDaiMessengerWrapper.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `XDaiMessengerWrapperInterface`

#### Returns

`XDaiMessengerWrapperInterface`
