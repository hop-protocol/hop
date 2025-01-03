# Class: MockRootChainManager\_\_factory

## Table of contents

### Constructors

- [constructor](MockRootChainManager__factory.md#constructor)

### Properties

- [abi](MockRootChainManager__factory.md#abi)

### Methods

- [connect](MockRootChainManager__factory.md#connect)
- [createInterface](MockRootChainManager__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new MockRootChainManager__factory**(): [`MockRootChainManager__factory`](MockRootChainManager__factory.md)

#### Returns

[`MockRootChainManager__factory`](MockRootChainManager__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: \{ `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "user"; `type`: `string` = "address" }[] ; `name`: `string` = "depositFor"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" }[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`MockRootChainManager`](../interfaces/MockRootChainManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`MockRootChainManager`](../interfaces/MockRootChainManager.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `MockRootChainManagerInterface`

#### Returns

`MockRootChainManagerInterface`
