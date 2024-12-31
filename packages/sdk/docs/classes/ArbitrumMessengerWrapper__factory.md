# Class: ArbitrumMessengerWrapper\_\_factory

## Table of contents

### Constructors

- [constructor](ArbitrumMessengerWrapper__factory.md#constructor)

### Properties

- [abi](ArbitrumMessengerWrapper__factory.md#abi)

### Methods

- [connect](ArbitrumMessengerWrapper__factory.md#connect)
- [createInterface](ArbitrumMessengerWrapper__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new ArbitrumMessengerWrapper__factory**(): [`ArbitrumMessengerWrapper__factory`](ArbitrumMessengerWrapper__factory.md)

#### Returns

[`ArbitrumMessengerWrapper__factory`](ArbitrumMessengerWrapper__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "\_l1BridgeAddress"; `type`: `string` = "address" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "address"; `name`: `string` = "previousOwner"; `type`: `string` = "address" }[] ; `name`: `string` = "OwnershipTransferred"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "contract IL1Bridge"; `name`: `string` = "l1Bridge"; `type`: `string` = "address" }[] ; `name`: `string` = "canConfirmRoot"; `outputs`: \{ `internalType`: `string` = "bool"; `name`: `string` = ""; `type`: `string` = "bool" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" } \| \{ `anonymous?`: `undefined` = false; `inputs?`: `undefined` ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `stateMutability`: `string` = "payable"; `type`: `string` = "receive" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`ArbitrumMessengerWrapper`](../interfaces/ArbitrumMessengerWrapper.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`ArbitrumMessengerWrapper`](../interfaces/ArbitrumMessengerWrapper.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `ArbitrumMessengerWrapperInterface`

#### Returns

`ArbitrumMessengerWrapperInterface`
