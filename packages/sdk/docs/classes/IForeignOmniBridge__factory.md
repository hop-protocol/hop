# Class: IForeignOmniBridge\_\_factory

## Table of contents

### Constructors

- [constructor](IForeignOmniBridge__factory.md#constructor)

### Properties

- [abi](IForeignOmniBridge__factory.md#abi)

### Methods

- [connect](IForeignOmniBridge__factory.md#connect)
- [createInterface](IForeignOmniBridge__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new IForeignOmniBridge__factory**(): [`IForeignOmniBridge__factory`](IForeignOmniBridge__factory.md)

#### Returns

[`IForeignOmniBridge__factory`](IForeignOmniBridge__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: \{ `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "token"; `type`: `string` = "address" }[] ; `name`: `string` = "relayTokens"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" }[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`IForeignOmniBridge`](../interfaces/IForeignOmniBridge.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`IForeignOmniBridge`](../interfaces/IForeignOmniBridge.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `IForeignOmniBridgeInterface`

#### Returns

`IForeignOmniBridgeInterface`
