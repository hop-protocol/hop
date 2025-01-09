# Class: MockForeignOmniBridge\_\_factory

## Table of contents

### Constructors

- [constructor](MockForeignOmniBridge__factory.md#constructor)

### Properties

- [abi](MockForeignOmniBridge__factory.md#abi)

### Methods

- [connect](MockForeignOmniBridge__factory.md#connect)
- [createInterface](MockForeignOmniBridge__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new MockForeignOmniBridge__factory**(): [`MockForeignOmniBridge__factory`](MockForeignOmniBridge__factory.md)

#### Returns

[`MockForeignOmniBridge__factory`](MockForeignOmniBridge__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: \{ `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "token"; `type`: `string` = "address" }[] ; `name`: `string` = "relayTokens"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" }[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`MockForeignOmniBridge`](../interfaces/MockForeignOmniBridge.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`MockForeignOmniBridge`](../interfaces/MockForeignOmniBridge.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `MockForeignOmniBridgeInterface`

#### Returns

`MockForeignOmniBridgeInterface`
