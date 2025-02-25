# Class: IFxMessageProcessor\_\_factory

## Table of contents

### Constructors

- [constructor](IFxMessageProcessor__factory.md#constructor)

### Properties

- [abi](IFxMessageProcessor__factory.md#abi)

### Methods

- [connect](IFxMessageProcessor__factory.md#connect)
- [createInterface](IFxMessageProcessor__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new IFxMessageProcessor__factory**(): [`IFxMessageProcessor__factory`](IFxMessageProcessor__factory.md)

#### Returns

[`IFxMessageProcessor__factory`](IFxMessageProcessor__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: \{ `inputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = "stateId"; `type`: `string` = "uint256" }[] ; `name`: `string` = "processMessageFromRoot"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" }[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`IFxMessageProcessor`](../interfaces/IFxMessageProcessor.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`IFxMessageProcessor`](../interfaces/IFxMessageProcessor.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `IFxMessageProcessorInterface`

#### Returns

`IFxMessageProcessorInterface`
