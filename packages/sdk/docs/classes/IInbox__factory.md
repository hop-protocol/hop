# Class: IInbox\_\_factory

## Table of contents

### Constructors

- [constructor](IInbox__factory.md#constructor)

### Properties

- [abi](IInbox__factory.md#abi)

### Methods

- [connect](IInbox__factory.md#connect)
- [createInterface](IInbox__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new IInbox__factory**(): [`IInbox__factory`](IInbox__factory.md)

#### Returns

[`IInbox__factory`](IInbox__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "uint256"; `name`: `string` = "messageNum"; `type`: `string` = "uint256" }[] ; `name`: `string` = "InboxMessageDelivered"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "destAddr"; `type`: `string` = "address" }[] ; `name`: `string` = "createRetryableTicket"; `outputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `stateMutability`: `string` = "payable"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`IInbox`](../interfaces/IInbox.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`IInbox`](../interfaces/IInbox.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `IInboxInterface`

#### Returns

`IInboxInterface`
