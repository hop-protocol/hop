# Class: IMessengerWrapper\_\_factory

## Table of contents

### Constructors

- [constructor](IMessengerWrapper__factory.md#constructor)

### Properties

- [abi](IMessengerWrapper__factory.md#abi)

### Methods

- [connect](IMessengerWrapper__factory.md#connect)
- [createInterface](IMessengerWrapper__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new IMessengerWrapper__factory**(): [`IMessengerWrapper__factory`](IMessengerWrapper__factory.md)

#### Returns

[`IMessengerWrapper__factory`](IMessengerWrapper__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: \{ `inputs`: \{ `internalType`: `string` = "bytes32[]"; `name`: `string` = "rootHashes"; `type`: `string` = "bytes32[]" }[] ; `name`: `string` = "confirmRoots"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" }[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`IMessengerWrapper`](../interfaces/IMessengerWrapper.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`IMessengerWrapper`](../interfaces/IMessengerWrapper.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `IMessengerWrapperInterface`

#### Returns

`IMessengerWrapperInterface`
