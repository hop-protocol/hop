# Class: IStateReceiver\_\_factory

## Table of contents

### Constructors

- [constructor](IStateReceiver__factory.md#constructor)

### Properties

- [abi](IStateReceiver__factory.md#abi)

### Methods

- [connect](IStateReceiver__factory.md#connect)
- [createInterface](IStateReceiver__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new IStateReceiver__factory**(): [`IStateReceiver__factory`](IStateReceiver__factory.md)

#### Returns

[`IStateReceiver__factory`](IStateReceiver__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: \{ `inputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = "stateId"; `type`: `string` = "uint256" }[] ; `name`: `string` = "onStateReceive"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" }[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`IStateReceiver`](../interfaces/IStateReceiver.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`IStateReceiver`](../interfaces/IStateReceiver.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `IStateReceiverInterface`

#### Returns

`IStateReceiverInterface`
