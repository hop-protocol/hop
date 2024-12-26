# Class: CCTPMessageTransmitter\_\_factory

## Table of contents

### Constructors

- [constructor](CCTPMessageTransmitter__factory.md#constructor)

### Properties

- [abi](CCTPMessageTransmitter__factory.md#abi)

### Methods

- [connect](CCTPMessageTransmitter__factory.md#connect)
- [createInterface](CCTPMessageTransmitter__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new CCTPMessageTransmitter__factory**(): [`CCTPMessageTransmitter__factory`](CCTPMessageTransmitter__factory.md)

#### Returns

[`CCTPMessageTransmitter__factory`](CCTPMessageTransmitter__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "uint32"; `name`: `string` = "\_localDomain"; `type`: `string` = "uint32" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "address"; `name`: `string` = "attester"; `type`: `string` = "address" }[] ; `name`: `string` = "AttesterDisabled"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = "index"; `type`: `string` = "uint256" }[] ; `name`: `string` = "getEnabledAttester"; `outputs`: \{ `internalType`: `string` = "address"; `name`: `string` = ""; `type`: `string` = "address" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`CCTPMessageTransmitter`](../interfaces/CCTPMessageTransmitter.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`CCTPMessageTransmitter`](../interfaces/CCTPMessageTransmitter.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `CCTPMessageTransmitterInterface`

#### Returns

`CCTPMessageTransmitterInterface`
