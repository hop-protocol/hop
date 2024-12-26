# Class: OVM\_BaseCrossDomainMessenger\_\_factory

## Table of contents

### Constructors

- [constructor](OVM_BaseCrossDomainMessenger__factory.md#constructor)

### Properties

- [abi](OVM_BaseCrossDomainMessenger__factory.md#abi)

### Methods

- [connect](OVM_BaseCrossDomainMessenger__factory.md#connect)
- [createInterface](OVM_BaseCrossDomainMessenger__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new OVM_BaseCrossDomainMessenger__factory**(): [`OVM_BaseCrossDomainMessenger__factory`](OVM_BaseCrossDomainMessenger__factory.md)

#### Returns

[`OVM_BaseCrossDomainMessenger__factory`](OVM_BaseCrossDomainMessenger__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: \{ `inputs`: \{ `internalType`: `string` = "bytes32"; `name`: `string` = ""; `type`: `string` = "bytes32" }[] ; `name`: `string` = "relayedMessages"; `outputs`: \{ `internalType`: `string` = "bool"; `name`: `string` = ""; `type`: `string` = "bool" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" }[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`OVM_BaseCrossDomainMessenger`](../interfaces/OVM_BaseCrossDomainMessenger.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`OVM_BaseCrossDomainMessenger`](../interfaces/OVM_BaseCrossDomainMessenger.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `OVM_BaseCrossDomainMessengerInterface`

#### Returns

`OVM_BaseCrossDomainMessengerInterface`
