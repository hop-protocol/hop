# Class: MessengerWrapper\_\_factory

## Table of contents

### Constructors

- [constructor](MessengerWrapper__factory.md#constructor)

### Properties

- [abi](MessengerWrapper__factory.md#abi)

### Methods

- [connect](MessengerWrapper__factory.md#connect)
- [createInterface](MessengerWrapper__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new MessengerWrapper__factory**(): [`MessengerWrapper__factory`](MessengerWrapper__factory.md)

#### Returns

[`MessengerWrapper__factory`](MessengerWrapper__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: \{ `inputs`: \{ `internalType`: `string` = "contract IL1Bridge"; `name`: `string` = "l1Bridge"; `type`: `string` = "address" }[] ; `name`: `string` = "canConfirmRoot"; `outputs`: \{ `internalType`: `string` = "bool"; `name`: `string` = ""; `type`: `string` = "bool" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" }[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`MessengerWrapper`](../interfaces/MessengerWrapper.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`MessengerWrapper`](../interfaces/MessengerWrapper.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `MessengerWrapperInterface`

#### Returns

`MessengerWrapperInterface`
