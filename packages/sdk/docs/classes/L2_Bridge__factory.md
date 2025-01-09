# Class: L2\_Bridge\_\_factory

## Table of contents

### Constructors

- [constructor](L2_Bridge__factory.md#constructor)

### Properties

- [abi](L2_Bridge__factory.md#abi)

### Methods

- [connect](L2_Bridge__factory.md#connect)
- [createInterface](L2_Bridge__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new L2_Bridge__factory**(): [`L2_Bridge__factory`](L2_Bridge__factory.md)

#### Returns

[`L2_Bridge__factory`](L2_Bridge__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "\_l1Governance"; `type`: `string` = "address" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "address"; `name`: `string` = "newBonder"; `type`: `string` = "address" }[] ; `name`: `string` = "BonderAdded"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `name`: `string` = "activeChainIds"; `outputs`: \{ `internalType`: `string` = "bool"; `name`: `string` = ""; `type`: `string` = "bool" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "bytes32"; `name`: `string` = "rootHash"; `type`: `string` = "bytes32" }[] ; `name`: `string` = "getTransferRoot"; `outputs`: \{ `components`: \{ `internalType`: `string` = "uint256"; `name`: `string` = "total"; `type`: `string` = "uint256" }[] ; `internalType`: `string` = "struct Bridge.TransferRoot"; `name`: `string` = ""; `type`: `string` = "tuple" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`L2_Bridge`](../interfaces/L2_Bridge.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`L2_Bridge`](../interfaces/L2_Bridge.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `L2_BridgeInterface`

#### Returns

`L2_BridgeInterface`
