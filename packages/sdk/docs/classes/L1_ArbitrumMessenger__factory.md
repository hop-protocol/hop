# Class: L1\_ArbitrumMessenger\_\_factory

## Table of contents

### Constructors

- [constructor](L1_ArbitrumMessenger__factory.md#constructor)

### Properties

- [abi](L1_ArbitrumMessenger__factory.md#abi)

### Methods

- [connect](L1_ArbitrumMessenger__factory.md#connect)
- [createInterface](L1_ArbitrumMessenger__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new L1_ArbitrumMessenger__factory**(): [`L1_ArbitrumMessenger__factory`](L1_ArbitrumMessenger__factory.md)

#### Returns

[`L1_ArbitrumMessenger__factory`](L1_ArbitrumMessenger__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "uint256"; `name`: `string` = "messageNum"; `type`: `string` = "uint256" }[] ; `name`: `string` = "InboxMessageDelivered"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "destAddr"; `type`: `string` = "address" }[] ; `name`: `string` = "createRetryableTicket"; `outputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `stateMutability`: `string` = "payable"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`L1_ArbitrumMessenger`](../interfaces/L1_ArbitrumMessenger.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`L1_ArbitrumMessenger`](../interfaces/L1_ArbitrumMessenger.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `L1_ArbitrumMessengerInterface`

#### Returns

`L1_ArbitrumMessengerInterface`
