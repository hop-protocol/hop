# Class: Mock\_L1\_ETH\_Bridge\_\_factory

## Table of contents

### Constructors

- [constructor](Mock_L1_ETH_Bridge__factory.md#constructor)

### Properties

- [abi](Mock_L1_ETH_Bridge__factory.md#abi)

### Methods

- [connect](Mock_L1_ETH_Bridge__factory.md#connect)
- [createInterface](Mock_L1_ETH_Bridge__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new Mock_L1_ETH_Bridge__factory**(): [`Mock_L1_ETH_Bridge__factory`](Mock_L1_ETH_Bridge__factory.md)

#### Returns

[`Mock_L1_ETH_Bridge__factory`](Mock_L1_ETH_Bridge__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address[]"; `name`: `string` = "\_bonders"; `type`: `string` = "address[]" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "address"; `name`: `string` = "newBonder"; `type`: `string` = "address" }[] ; `name`: `string` = "BonderAdded"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `name`: `string` = "chainBalance"; `outputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "bytes32"; `name`: `string` = "rootHash"; `type`: `string` = "bytes32" }[] ; `name`: `string` = "getTransferRoot"; `outputs`: \{ `components`: \{ `internalType`: `string` = "uint256"; `name`: `string` = "total"; `type`: `string` = "uint256" }[] ; `internalType`: `string` = "struct Bridge.TransferRoot"; `name`: `string` = ""; `type`: `string` = "tuple" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`Mock_L1_ETH_Bridge`](../interfaces/Mock_L1_ETH_Bridge.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`Mock_L1_ETH_Bridge`](../interfaces/Mock_L1_ETH_Bridge.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `Mock_L1_ETH_BridgeInterface`

#### Returns

`Mock_L1_ETH_BridgeInterface`
