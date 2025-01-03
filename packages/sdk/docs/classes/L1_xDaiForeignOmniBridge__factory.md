# Class: L1\_xDaiForeignOmniBridge\_\_factory

## Table of contents

### Constructors

- [constructor](L1_xDaiForeignOmniBridge__factory.md#constructor)

### Properties

- [abi](L1_xDaiForeignOmniBridge__factory.md#abi)

### Methods

- [connect](L1_xDaiForeignOmniBridge__factory.md#connect)
- [createInterface](L1_xDaiForeignOmniBridge__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new L1_xDaiForeignOmniBridge__factory**(): [`L1_xDaiForeignOmniBridge__factory`](L1_xDaiForeignOmniBridge__factory.md)

#### Returns

[`L1_xDaiForeignOmniBridge__factory`](L1_xDaiForeignOmniBridge__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous?`: `undefined` = false; `constant`: `boolean` = true; `inputs`: \{ `name`: `string` = "\_txHash"; `type`: `string` = "bytes32" }[] ; `name`: `string` = "relayedMessages"; `outputs`: \{ `name`: `string` = ""; `type`: `string` = "bool" }[] ; `payable`: `boolean` = false; `stateMutability`: `string` = "view"; `type`: `string` = "function" } \| \{ `anonymous`: `boolean` = false; `constant?`: `undefined` = true; `inputs`: \{ `indexed`: `boolean` = false; `name`: `string` = "to"; `type`: `string` = "address" }[] ; `name`: `string` = "PaidInterest"; `outputs?`: `undefined` ; `payable?`: `undefined` = false; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`L1_xDaiForeignOmniBridge`](../interfaces/L1_xDaiForeignOmniBridge.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`L1_xDaiForeignOmniBridge`](../interfaces/L1_xDaiForeignOmniBridge.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `L1_xDaiForeignOmniBridgeInterface`

#### Returns

`L1_xDaiForeignOmniBridgeInterface`
