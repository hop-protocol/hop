# Class: I\_L1\_PolygonMessenger\_\_factory

## Table of contents

### Constructors

- [constructor](I_L1_PolygonMessenger__factory.md#constructor)

### Properties

- [abi](I_L1_PolygonMessenger__factory.md#abi)

### Methods

- [connect](I_L1_PolygonMessenger__factory.md#connect)
- [createInterface](I_L1_PolygonMessenger__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new I_L1_PolygonMessenger__factory**(): [`I_L1_PolygonMessenger__factory`](I_L1_PolygonMessenger__factory.md)

#### Returns

[`I_L1_PolygonMessenger__factory`](I_L1_PolygonMessenger__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: \{ `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "receiver"; `type`: `string` = "address" }[] ; `name`: `string` = "syncState"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" }[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`I_L1_PolygonMessenger`](../interfaces/I_L1_PolygonMessenger.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`I_L1_PolygonMessenger`](../interfaces/I_L1_PolygonMessenger.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `I_L1_PolygonMessengerInterface`

#### Returns

`I_L1_PolygonMessengerInterface`
