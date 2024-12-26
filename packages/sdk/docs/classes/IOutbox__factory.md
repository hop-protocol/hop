# Class: IOutbox\_\_factory

## Table of contents

### Constructors

- [constructor](IOutbox__factory.md#constructor)

### Properties

- [abi](IOutbox__factory.md#abi)

### Methods

- [connect](IOutbox__factory.md#connect)
- [createInterface](IOutbox__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new IOutbox__factory**(): [`IOutbox__factory`](IOutbox__factory.md)

#### Returns

[`IOutbox__factory`](IOutbox__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "uint256"; `name`: `string` = "batchNum"; `type`: `string` = "uint256" }[] ; `name`: `string` = "OutboxEntryCreated"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: `never`[] = []; `name`: `string` = "l2ToL1Block"; `outputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "bytes"; `name`: `string` = "sendsData"; `type`: `string` = "bytes" }[] ; `name`: `string` = "processOutgoingMessages"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`IOutbox`](../interfaces/IOutbox.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`IOutbox`](../interfaces/IOutbox.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `IOutboxInterface`

#### Returns

`IOutboxInterface`
