# Class: OptimismMessengerWrapper\_\_factory

## Table of contents

### Constructors

- [constructor](OptimismMessengerWrapper__factory.md#constructor)

### Properties

- [abi](OptimismMessengerWrapper__factory.md#abi)

### Methods

- [connect](OptimismMessengerWrapper__factory.md#connect)
- [createInterface](OptimismMessengerWrapper__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new OptimismMessengerWrapper__factory**(): [`OptimismMessengerWrapper__factory`](OptimismMessengerWrapper__factory.md)

#### Returns

[`OptimismMessengerWrapper__factory`](OptimismMessengerWrapper__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "\_l1BridgeAddress"; `type`: `string` = "address" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "address"; `name`: `string` = "previousOwner"; `type`: `string` = "address" }[] ; `name`: `string` = "OwnershipTransferred"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "contract IL1Bridge"; `name`: `string` = "l1Bridge"; `type`: `string` = "address" }[] ; `name`: `string` = "canConfirmRoot"; `outputs`: \{ `internalType`: `string` = "bool"; `name`: `string` = ""; `type`: `string` = "bool" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`OptimismMessengerWrapper`](../interfaces/OptimismMessengerWrapper.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`OptimismMessengerWrapper`](../interfaces/OptimismMessengerWrapper.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `OptimismMessengerWrapperInterface`

#### Returns

`OptimismMessengerWrapperInterface`
