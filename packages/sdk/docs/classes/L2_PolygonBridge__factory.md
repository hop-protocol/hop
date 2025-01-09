# Class: L2\_PolygonBridge\_\_factory

## Table of contents

### Constructors

- [constructor](L2_PolygonBridge__factory.md#constructor)

### Properties

- [abi](L2_PolygonBridge__factory.md#abi)

### Methods

- [connect](L2_PolygonBridge__factory.md#connect)
- [createInterface](L2_PolygonBridge__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new L2_PolygonBridge__factory**(): [`L2_PolygonBridge__factory`](L2_PolygonBridge__factory.md)

#### Returns

[`L2_PolygonBridge__factory`](L2_PolygonBridge__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "contract I\_L2\_PolygonMessengerProxy"; `name`: `string` = "\_messengerProxy"; `type`: `string` = "address" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "address"; `name`: `string` = "newBonder"; `type`: `string` = "address" }[] ; `name`: `string` = "BonderAdded"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `name`: `string` = "activeChainIds"; `outputs`: \{ `internalType`: `string` = "bool"; `name`: `string` = ""; `type`: `string` = "bool" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "bytes32"; `name`: `string` = "rootHash"; `type`: `string` = "bytes32" }[] ; `name`: `string` = "getTransferRoot"; `outputs`: \{ `components`: \{ `internalType`: `string` = "uint256"; `name`: `string` = "total"; `type`: `string` = "uint256" }[] ; `internalType`: `string` = "struct Bridge.TransferRoot"; `name`: `string` = ""; `type`: `string` = "tuple" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`L2_PolygonBridge`](../interfaces/L2_PolygonBridge.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`L2_PolygonBridge`](../interfaces/L2_PolygonBridge.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `L2_PolygonBridgeInterface`

#### Returns

`L2_PolygonBridgeInterface`
