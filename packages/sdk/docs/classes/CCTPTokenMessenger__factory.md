# Class: CCTPTokenMessenger\_\_factory

## Table of contents

### Constructors

- [constructor](CCTPTokenMessenger__factory.md#constructor)

### Properties

- [abi](CCTPTokenMessenger__factory.md#abi)

### Methods

- [connect](CCTPTokenMessenger__factory.md#connect)
- [createInterface](CCTPTokenMessenger__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new CCTPTokenMessenger__factory**(): [`CCTPTokenMessenger__factory`](CCTPTokenMessenger__factory.md)

#### Returns

[`CCTPTokenMessenger__factory`](CCTPTokenMessenger__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "\_messageTransmitter"; `type`: `string` = "address" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "uint64"; `name`: `string` = "nonce"; `type`: `string` = "uint64" }[] ; `name`: `string` = "DepositForBurn"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = "amount"; `type`: `string` = "uint256" }[] ; `name`: `string` = "depositForBurn"; `outputs`: \{ `internalType`: `string` = "uint64"; `name`: `string` = "\_nonce"; `type`: `string` = "uint64" }[] ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`CCTPTokenMessenger`](../interfaces/CCTPTokenMessenger.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`CCTPTokenMessenger`](../interfaces/CCTPTokenMessenger.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `CCTPTokenMessengerInterface`

#### Returns

`CCTPTokenMessengerInterface`
