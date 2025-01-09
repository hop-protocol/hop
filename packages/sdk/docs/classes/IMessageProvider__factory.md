# Class: IMessageProvider\_\_factory

## Table of contents

### Constructors

- [constructor](IMessageProvider__factory.md#constructor)

### Properties

- [abi](IMessageProvider__factory.md#abi)

### Methods

- [connect](IMessageProvider__factory.md#connect)
- [createInterface](IMessageProvider__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new IMessageProvider__factory**(): [`IMessageProvider__factory`](IMessageProvider__factory.md)

#### Returns

[`IMessageProvider__factory`](IMessageProvider__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: \{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "uint256"; `name`: `string` = "messageNum"; `type`: `string` = "uint256" }[] ; `name`: `string` = "InboxMessageDelivered"; `type`: `string` = "event" }[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`IMessageProvider`](../interfaces/IMessageProvider.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`IMessageProvider`](../interfaces/IMessageProvider.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `IMessageProviderInterface`

#### Returns

`IMessageProviderInterface`
