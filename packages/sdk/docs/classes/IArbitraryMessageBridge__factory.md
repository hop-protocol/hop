# Class: IArbitraryMessageBridge\_\_factory

## Table of contents

### Constructors

- [constructor](IArbitraryMessageBridge__factory.md#constructor)

### Properties

- [abi](IArbitraryMessageBridge__factory.md#abi)

### Methods

- [connect](IArbitraryMessageBridge__factory.md#connect)
- [createInterface](IArbitraryMessageBridge__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new IArbitraryMessageBridge__factory**(): [`IArbitraryMessageBridge__factory`](IArbitraryMessageBridge__factory.md)

#### Returns

[`IArbitraryMessageBridge__factory`](IArbitraryMessageBridge__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: \{ `inputs`: \{ `internalType`: `string` = "bytes32"; `name`: `string` = "\_messageId"; `type`: `string` = "bytes32" }[] ; `name`: `string` = "failedMessageDataHash"; `outputs`: \{ `internalType`: `string` = "bytes32"; `name`: `string` = ""; `type`: `string` = "bytes32" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" }[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`IArbitraryMessageBridge`](../interfaces/IArbitraryMessageBridge.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`IArbitraryMessageBridge`](../interfaces/IArbitraryMessageBridge.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `IArbitraryMessageBridgeInterface`

#### Returns

`IArbitraryMessageBridgeInterface`
