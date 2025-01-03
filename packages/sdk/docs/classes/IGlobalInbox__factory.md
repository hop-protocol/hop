# Class: IGlobalInbox\_\_factory

## Table of contents

### Constructors

- [constructor](IGlobalInbox__factory.md#constructor)

### Properties

- [abi](IGlobalInbox__factory.md#abi)

### Methods

- [connect](IGlobalInbox__factory.md#connect)
- [createInterface](IGlobalInbox__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new IGlobalInbox__factory**(): [`IGlobalInbox__factory`](IGlobalInbox__factory.md)

#### Returns

[`IGlobalInbox__factory`](IGlobalInbox__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "address"; `name`: `string` = "sender"; `type`: `string` = "address" }[] ; `name`: `string` = "BuddyContractDeployed"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "account"; `type`: `string` = "address" }[] ; `name`: `string` = "getInbox"; `outputs`: \{ `internalType`: `string` = "bytes32"; `name`: `string` = ""; `type`: `string` = "bytes32" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`IGlobalInbox`](../interfaces/IGlobalInbox.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`IGlobalInbox`](../interfaces/IGlobalInbox.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `IGlobalInboxInterface`

#### Returns

`IGlobalInboxInterface`
