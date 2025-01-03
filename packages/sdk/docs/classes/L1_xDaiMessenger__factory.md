# Class: L1\_xDaiMessenger\_\_factory

## Table of contents

### Constructors

- [constructor](L1_xDaiMessenger__factory.md#constructor)

### Properties

- [abi](L1_xDaiMessenger__factory.md#abi)

### Methods

- [connect](L1_xDaiMessenger__factory.md#connect)
- [createInterface](L1_xDaiMessenger__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new L1_xDaiMessenger__factory**(): [`L1_xDaiMessenger__factory`](L1_xDaiMessenger__factory.md)

#### Returns

[`L1_xDaiMessenger__factory`](L1_xDaiMessenger__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: \{ `inputs`: \{ `internalType`: `string` = "bytes32"; `name`: `string` = "\_messageId"; `type`: `string` = "bytes32" }[] ; `name`: `string` = "failedMessageDataHash"; `outputs`: \{ `internalType`: `string` = "bytes32"; `name`: `string` = ""; `type`: `string` = "bytes32" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" }[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`L1_xDaiMessenger`](../interfaces/L1_xDaiMessenger.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`L1_xDaiMessenger`](../interfaces/L1_xDaiMessenger.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `L1_xDaiMessengerInterface`

#### Returns

`L1_xDaiMessengerInterface`
