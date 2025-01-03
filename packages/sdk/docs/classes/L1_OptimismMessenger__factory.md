# Class: L1\_OptimismMessenger\_\_factory

## Table of contents

### Constructors

- [constructor](L1_OptimismMessenger__factory.md#constructor)

### Properties

- [abi](L1_OptimismMessenger__factory.md#abi)

### Methods

- [connect](L1_OptimismMessenger__factory.md#connect)
- [createInterface](L1_OptimismMessenger__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new L1_OptimismMessenger__factory**(): [`L1_OptimismMessenger__factory`](L1_OptimismMessenger__factory.md)

#### Returns

[`L1_OptimismMessenger__factory`](L1_OptimismMessenger__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = false; `internalType`: `string` = "bytes32"; `name`: `string` = "msgHash"; `type`: `string` = "bytes32" }[] ; `name`: `string` = "RelayedMessage"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "\_depositor"; `type`: `string` = "address" }[] ; `name`: `string` = "deposit"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" } \| \{ `anonymous?`: `undefined` = false; `inputs`: `never`[] = []; `name`: `string` = "xDomainMessageSender"; `outputs`: \{ `internalType`: `string` = "address"; `name`: `string` = ""; `type`: `string` = "address" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`L1_OptimismMessenger`](../interfaces/L1_OptimismMessenger.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`L1_OptimismMessenger`](../interfaces/L1_OptimismMessenger.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `L1_OptimismMessengerInterface`

#### Returns

`L1_OptimismMessengerInterface`
