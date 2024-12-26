# Class: IEthERC20Bridge\_\_factory

## Table of contents

### Constructors

- [constructor](IEthERC20Bridge__factory.md#constructor)

### Properties

- [abi](IEthERC20Bridge__factory.md#abi)

### Methods

- [connect](IEthERC20Bridge__factory.md#connect)
- [createInterface](IEthERC20Bridge__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new IEthERC20Bridge__factory**(): [`IEthERC20Bridge__factory`](IEthERC20Bridge__factory.md)

#### Returns

[`IEthERC20Bridge__factory`](IEthERC20Bridge__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: \{ `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "erc20"; `type`: `string` = "address" }[] ; `name`: `string` = "depositAsERC20"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" }[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`IEthERC20Bridge`](../interfaces/IEthERC20Bridge.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`IEthERC20Bridge`](../interfaces/IEthERC20Bridge.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `IEthERC20BridgeInterface`

#### Returns

`IEthERC20BridgeInterface`
