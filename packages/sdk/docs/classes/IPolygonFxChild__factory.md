# Class: IPolygonFxChild\_\_factory

## Table of contents

### Constructors

- [constructor](IPolygonFxChild__factory.md#constructor)

### Properties

- [abi](IPolygonFxChild__factory.md#abi)

### Methods

- [connect](IPolygonFxChild__factory.md#connect)
- [createInterface](IPolygonFxChild__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new IPolygonFxChild__factory**(): [`IPolygonFxChild__factory`](IPolygonFxChild__factory.md)

#### Returns

[`IPolygonFxChild__factory`](IPolygonFxChild__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: \{ `inputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = "stateId"; `type`: `string` = "uint256" }[] ; `name`: `string` = "onStateReceive"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" }[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`IPolygonFxChild`](../interfaces/IPolygonFxChild.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`IPolygonFxChild`](../interfaces/IPolygonFxChild.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `IPolygonFxChildInterface`

#### Returns

`IPolygonFxChildInterface`
