# Class: IAbs\_BaseCrossDomainMessenger\_\_factory

## Table of contents

### Constructors

- [constructor](IAbs_BaseCrossDomainMessenger__factory.md#constructor)

### Properties

- [abi](IAbs_BaseCrossDomainMessenger__factory.md#abi)

### Methods

- [connect](IAbs_BaseCrossDomainMessenger__factory.md#connect)
- [createInterface](IAbs_BaseCrossDomainMessenger__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new IAbs_BaseCrossDomainMessenger__factory**(): [`IAbs_BaseCrossDomainMessenger__factory`](IAbs_BaseCrossDomainMessenger__factory.md)

#### Returns

[`IAbs_BaseCrossDomainMessenger__factory`](IAbs_BaseCrossDomainMessenger__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = false; `internalType`: `string` = "bytes32"; `name`: `string` = "msgHash"; `type`: `string` = "bytes32" }[] ; `name`: `string` = "RelayedMessage"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "\_target"; `type`: `string` = "address" }[] ; `name`: `string` = "sendMessage"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" } \| \{ `anonymous?`: `undefined` = false; `inputs`: `never`[] = []; `name`: `string` = "xDomainMessageSender"; `outputs`: \{ `internalType`: `string` = "address"; `name`: `string` = ""; `type`: `string` = "address" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`IAbs_BaseCrossDomainMessenger`](../interfaces/IAbs_BaseCrossDomainMessenger.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`IAbs_BaseCrossDomainMessenger`](../interfaces/IAbs_BaseCrossDomainMessenger.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `IAbs_BaseCrossDomainMessengerInterface`

#### Returns

`IAbs_BaseCrossDomainMessengerInterface`
