# Class: Mock\_L2\_Messenger\_\_factory

## Table of contents

### Constructors

- [constructor](Mock_L2_Messenger__factory.md#constructor)

### Properties

- [abi](Mock_L2_Messenger__factory.md#abi)

### Methods

- [connect](Mock_L2_Messenger__factory.md#connect)
- [createInterface](Mock_L2_Messenger__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new Mock_L2_Messenger__factory**(): [`Mock_L2_Messenger__factory`](Mock_L2_Messenger__factory.md)

#### Returns

[`Mock_L2_Messenger__factory`](Mock_L2_Messenger__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `inputs`: \{ `internalType`: `string` = "contract IERC20"; `name`: `string` = "\_canonicalToken"; `type`: `string` = "address" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "\_target"; `type`: `string` = "address" }[] ; `name`: `string` = "requireToPassMessage"; `outputs`: \{ `internalType`: `string` = "bytes32"; `name`: `string` = ""; `type`: `string` = "bytes32" }[] ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`Mock_L2_Messenger`](../interfaces/Mock_L2_Messenger.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`Mock_L2_Messenger`](../interfaces/Mock_L2_Messenger.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `Mock_L2_MessengerInterface`

#### Returns

`Mock_L2_MessengerInterface`
