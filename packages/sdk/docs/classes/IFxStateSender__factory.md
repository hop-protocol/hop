# Class: IFxStateSender\_\_factory

## Table of contents

### Constructors

- [constructor](IFxStateSender__factory.md#constructor)

### Properties

- [abi](IFxStateSender__factory.md#abi)

### Methods

- [connect](IFxStateSender__factory.md#connect)
- [createInterface](IFxStateSender__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new IFxStateSender__factory**(): [`IFxStateSender__factory`](IFxStateSender__factory.md)

#### Returns

[`IFxStateSender__factory`](IFxStateSender__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: \{ `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "\_receiver"; `type`: `string` = "address" }[] ; `name`: `string` = "sendMessageToChild"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" }[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`IFxStateSender`](../interfaces/IFxStateSender.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`IFxStateSender`](../interfaces/IFxStateSender.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `IFxStateSenderInterface`

#### Returns

`IFxStateSenderInterface`
