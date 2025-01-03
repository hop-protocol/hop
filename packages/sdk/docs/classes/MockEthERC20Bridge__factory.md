# Class: MockEthERC20Bridge\_\_factory

## Table of contents

### Constructors

- [constructor](MockEthERC20Bridge__factory.md#constructor)

### Properties

- [abi](MockEthERC20Bridge__factory.md#abi)

### Methods

- [connect](MockEthERC20Bridge__factory.md#connect)
- [createInterface](MockEthERC20Bridge__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new MockEthERC20Bridge__factory**(): [`MockEthERC20Bridge__factory`](MockEthERC20Bridge__factory.md)

#### Returns

[`MockEthERC20Bridge__factory`](MockEthERC20Bridge__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: \{ `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "erc20"; `type`: `string` = "address" }[] ; `name`: `string` = "depositAsERC20"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" }[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`MockEthERC20Bridge`](../interfaces/MockEthERC20Bridge.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`MockEthERC20Bridge`](../interfaces/MockEthERC20Bridge.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `MockEthERC20BridgeInterface`

#### Returns

`MockEthERC20BridgeInterface`
