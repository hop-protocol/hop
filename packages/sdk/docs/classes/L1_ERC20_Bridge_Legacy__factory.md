# Class: L1\_ERC20\_Bridge\_Legacy\_\_factory

## Table of contents

### Constructors

- [constructor](L1_ERC20_Bridge_Legacy__factory.md#constructor)

### Properties

- [abi](L1_ERC20_Bridge_Legacy__factory.md#abi)

### Methods

- [connect](L1_ERC20_Bridge_Legacy__factory.md#connect)
- [createInterface](L1_ERC20_Bridge_Legacy__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new L1_ERC20_Bridge_Legacy__factory**(): [`L1_ERC20_Bridge_Legacy__factory`](L1_ERC20_Bridge_Legacy__factory.md)

#### Returns

[`L1_ERC20_Bridge_Legacy__factory`](L1_ERC20_Bridge_Legacy__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "contract IERC20"; `name`: `string` = "\_l1CanonicalToken"; `type`: `string` = "address" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "address"; `name`: `string` = "newBonder"; `type`: `string` = "address" }[] ; `name`: `string` = "BonderAdded"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `name`: `string` = "chainBalance"; `outputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "bytes32"; `name`: `string` = "rootHash"; `type`: `string` = "bytes32" }[] ; `name`: `string` = "getTransferRoot"; `outputs`: \{ `components`: \{ `internalType`: `string` = "uint256"; `name`: `string` = "total"; `type`: `string` = "uint256" }[] ; `internalType`: `string` = "struct Bridge.TransferRoot"; `name`: `string` = ""; `type`: `string` = "tuple" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`L1_ERC20_Bridge_Legacy`](../interfaces/L1_ERC20_Bridge_Legacy.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`L1_ERC20_Bridge_Legacy`](../interfaces/L1_ERC20_Bridge_Legacy.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `L1_ERC20_Bridge_LegacyInterface`

#### Returns

`L1_ERC20_Bridge_LegacyInterface`
