# Class: L1\_PolygonPosRootChainManager\_\_factory

## Table of contents

### Constructors

- [constructor](L1_PolygonPosRootChainManager__factory.md#constructor)

### Properties

- [abi](L1_PolygonPosRootChainManager__factory.md#abi)

### Methods

- [connect](L1_PolygonPosRootChainManager__factory.md#connect)
- [createInterface](L1_PolygonPosRootChainManager__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new L1_PolygonPosRootChainManager__factory**(): [`L1_PolygonPosRootChainManager__factory`](L1_PolygonPosRootChainManager__factory.md)

#### Returns

[`L1_PolygonPosRootChainManager__factory`](L1_PolygonPosRootChainManager__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = false; `internalType`: `string` = "address"; `name`: `string` = "userAddress"; `type`: `string` = "address" }[] ; `name`: `string` = "MetaTransactionExecuted"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = ""; `type`: `string` = "address" }[] ; `name`: `string` = "childToRootToken"; `outputs`: \{ `internalType`: `string` = "address"; `name`: `string` = ""; `type`: `string` = "address" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" } \| \{ `anonymous?`: `undefined` = false; `inputs?`: `undefined` ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `stateMutability`: `string` = "payable"; `type`: `string` = "receive" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`L1_PolygonPosRootChainManager`](../interfaces/L1_PolygonPosRootChainManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`L1_PolygonPosRootChainManager`](../interfaces/L1_PolygonPosRootChainManager.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `L1_PolygonPosRootChainManagerInterface`

#### Returns

`L1_PolygonPosRootChainManagerInterface`
