# Class: Mock\_L1\_CanonicalBridge\_\_factory

## Table of contents

### Constructors

- [constructor](Mock_L1_CanonicalBridge__factory.md#constructor)

### Properties

- [abi](Mock_L1_CanonicalBridge__factory.md#abi)

### Methods

- [connect](Mock_L1_CanonicalBridge__factory.md#connect)
- [createInterface](Mock_L1_CanonicalBridge__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new Mock_L1_CanonicalBridge__factory**(): [`Mock_L1_CanonicalBridge__factory`](Mock_L1_CanonicalBridge__factory.md)

#### Returns

[`Mock_L1_CanonicalBridge__factory`](Mock_L1_CanonicalBridge__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `inputs`: \{ `internalType`: `string` = "contract IERC20"; `name`: `string` = "\_canonicalToken"; `type`: `string` = "address" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `inputs`: `never`[] = []; `name`: `string` = "canonicalToken"; `outputs`: \{ `internalType`: `string` = "contract IERC20"; `name`: `string` = ""; `type`: `string` = "address" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" } \| \{ `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "\_target"; `type`: `string` = "address" }[] ; `name`: `string` = "sendMessage"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`Mock_L1_CanonicalBridge`](../interfaces/Mock_L1_CanonicalBridge.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`Mock_L1_CanonicalBridge`](../interfaces/Mock_L1_CanonicalBridge.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `Mock_L1_CanonicalBridgeInterface`

#### Returns

`Mock_L1_CanonicalBridgeInterface`
