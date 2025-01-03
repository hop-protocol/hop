# Class: L1\_PolygonMessenger\_\_factory

## Table of contents

### Constructors

- [constructor](L1_PolygonMessenger__factory.md#constructor)

### Properties

- [abi](L1_PolygonMessenger__factory.md#abi)

### Methods

- [connect](L1_PolygonMessenger__factory.md#connect)
- [createInterface](L1_PolygonMessenger__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new L1_PolygonMessenger__factory**(): [`L1_PolygonMessenger__factory`](L1_PolygonMessenger__factory.md)

#### Returns

[`L1_PolygonMessenger__factory`](L1_PolygonMessenger__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "\_l1BridgeAddress"; `type`: `string` = "address" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "bytes32"; `name`: `string` = "role"; `type`: `string` = "bytes32" }[] ; `name`: `string` = "RoleAdminChanged"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "bytes32"; `name`: `string` = "role"; `type`: `string` = "bytes32" }[] ; `name`: `string` = "getRoleAdmin"; `outputs`: \{ `internalType`: `string` = "bytes32"; `name`: `string` = ""; `type`: `string` = "bytes32" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`L1_PolygonMessenger`](../interfaces/L1_PolygonMessenger.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`L1_PolygonMessenger`](../interfaces/L1_PolygonMessenger.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `L1_PolygonMessengerInterface`

#### Returns

`L1_PolygonMessengerInterface`
