# Class: IRootChainManager\_\_factory

## Table of contents

### Constructors

- [constructor](IRootChainManager__factory.md#constructor)

### Properties

- [abi](IRootChainManager__factory.md#abi)

### Methods

- [connect](IRootChainManager__factory.md#connect)
- [createInterface](IRootChainManager__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new IRootChainManager__factory**(): [`IRootChainManager__factory`](IRootChainManager__factory.md)

#### Returns

[`IRootChainManager__factory`](IRootChainManager__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: \{ `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "user"; `type`: `string` = "address" }[] ; `name`: `string` = "depositFor"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" }[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`IRootChainManager`](../interfaces/IRootChainManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`IRootChainManager`](../interfaces/IRootChainManager.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `IRootChainManagerInterface`

#### Returns

`IRootChainManagerInterface`
