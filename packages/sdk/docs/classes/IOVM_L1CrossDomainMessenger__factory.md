# Class: IOVM\_L1CrossDomainMessenger\_\_factory

## Table of contents

### Constructors

- [constructor](IOVM_L1CrossDomainMessenger__factory.md#constructor)

### Properties

- [abi](IOVM_L1CrossDomainMessenger__factory.md#abi)

### Methods

- [connect](IOVM_L1CrossDomainMessenger__factory.md#connect)
- [createInterface](IOVM_L1CrossDomainMessenger__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new IOVM_L1CrossDomainMessenger__factory**(): [`IOVM_L1CrossDomainMessenger__factory`](IOVM_L1CrossDomainMessenger__factory.md)

#### Returns

[`IOVM_L1CrossDomainMessenger__factory`](IOVM_L1CrossDomainMessenger__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = false; `internalType`: `string` = "bytes32"; `name`: `string` = "msgHash"; `type`: `string` = "bytes32" }[] ; `name`: `string` = "RelayedMessage"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "\_depositor"; `type`: `string` = "address" }[] ; `name`: `string` = "deposit"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" } \| \{ `anonymous?`: `undefined` = false; `inputs`: `never`[] = []; `name`: `string` = "xDomainMessageSender"; `outputs`: \{ `internalType`: `string` = "address"; `name`: `string` = ""; `type`: `string` = "address" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`IOVM_L1CrossDomainMessenger`](../interfaces/IOVM_L1CrossDomainMessenger.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`IOVM_L1CrossDomainMessenger`](../interfaces/IOVM_L1CrossDomainMessenger.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `IOVM_L1CrossDomainMessengerInterface`

#### Returns

`IOVM_L1CrossDomainMessengerInterface`
