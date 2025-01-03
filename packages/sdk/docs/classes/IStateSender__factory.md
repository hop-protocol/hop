# Class: IStateSender\_\_factory

## Table of contents

### Constructors

- [constructor](IStateSender__factory.md#constructor)

### Properties

- [abi](IStateSender__factory.md#abi)

### Methods

- [connect](IStateSender__factory.md#connect)
- [createInterface](IStateSender__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new IStateSender__factory**(): [`IStateSender__factory`](IStateSender__factory.md)

#### Returns

[`IStateSender__factory`](IStateSender__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: \{ `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "receiver"; `type`: `string` = "address" }[] ; `name`: `string` = "syncState"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" }[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`IStateSender`](../interfaces/IStateSender.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`IStateSender`](../interfaces/IStateSender.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `IStateSenderInterface`

#### Returns

`IStateSenderInterface`
