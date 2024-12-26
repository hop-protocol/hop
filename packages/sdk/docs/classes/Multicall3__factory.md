# Class: Multicall3\_\_factory

## Table of contents

### Constructors

- [constructor](Multicall3__factory.md#constructor)

### Properties

- [abi](Multicall3__factory.md#abi)

### Methods

- [connect](Multicall3__factory.md#connect)
- [createInterface](Multicall3__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new Multicall3__factory**(): [`Multicall3__factory`](Multicall3__factory.md)

#### Returns

[`Multicall3__factory`](Multicall3__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: \{ `inputs`: (\{ `components?`: `undefined` ; `internalType`: `string` = "bool"; `name`: `string` = "requireSuccess"; `type`: `string` = "bool" } \| \{ `components`: \{ `internalType`: `string` = "address"; `name`: `string` = "target"; `type`: `string` = "address" }[] ; `internalType`: `string` = "struct Multicall3.Call[]"; `name`: `string` = "calls"; `type`: `string` = "tuple[]" })[] ; `name`: `string` = "tryBlockAndAggregate"; `outputs`: (\{ `components?`: `undefined` ; `internalType`: `string` = "uint256"; `name`: `string` = "blockNumber"; `type`: `string` = "uint256" } \| \{ `components`: \{ `internalType`: `string` = "bool"; `name`: `string` = "success"; `type`: `string` = "bool" }[] ; `internalType`: `string` = "struct Multicall3.Result[]"; `name`: `string` = "returnData"; `type`: `string` = "tuple[]" })[] ; `stateMutability`: `string` = "payable"; `type`: `string` = "function" }[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`Multicall3`](../interfaces/Multicall3-1.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`Multicall3`](../interfaces/Multicall3-1.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `Multicall3Interface`

#### Returns

`Multicall3Interface`
