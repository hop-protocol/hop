# Class: IFlashLoanReceiver\_\_factory

## Table of contents

### Constructors

- [constructor](IFlashLoanReceiver__factory.md#constructor)

### Properties

- [abi](IFlashLoanReceiver__factory.md#abi)

### Methods

- [connect](IFlashLoanReceiver__factory.md#connect)
- [createInterface](IFlashLoanReceiver__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new IFlashLoanReceiver__factory**(): [`IFlashLoanReceiver__factory`](IFlashLoanReceiver__factory.md)

#### Returns

[`IFlashLoanReceiver__factory`](IFlashLoanReceiver__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: \{ `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "pool"; `type`: `string` = "address" }[] ; `name`: `string` = "executeOperation"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" }[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`IFlashLoanReceiver`](../interfaces/IFlashLoanReceiver.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`IFlashLoanReceiver`](../interfaces/IFlashLoanReceiver.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `IFlashLoanReceiverInterface`

#### Returns

`IFlashLoanReceiverInterface`
