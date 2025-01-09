# Class: ICheckpointManager\_\_factory

## Table of contents

### Constructors

- [constructor](ICheckpointManager__factory.md#constructor)

### Properties

- [abi](ICheckpointManager__factory.md#abi)

### Methods

- [connect](ICheckpointManager__factory.md#connect)
- [createInterface](ICheckpointManager__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new ICheckpointManager__factory**(): [`ICheckpointManager__factory`](ICheckpointManager__factory.md)

#### Returns

[`ICheckpointManager__factory`](ICheckpointManager__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: \{ `inputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `name`: `string` = "headerBlocks"; `outputs`: \{ `internalType`: `string` = "bytes32"; `name`: `string` = "root"; `type`: `string` = "bytes32" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" }[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`ICheckpointManager`](../interfaces/ICheckpointManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`ICheckpointManager`](../interfaces/ICheckpointManager.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `ICheckpointManagerInterface`

#### Returns

`ICheckpointManagerInterface`
