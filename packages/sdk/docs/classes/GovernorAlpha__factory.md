# Class: GovernorAlpha\_\_factory

## Table of contents

### Constructors

- [constructor](GovernorAlpha__factory.md#constructor)

### Properties

- [abi](GovernorAlpha__factory.md#abi)

### Methods

- [connect](GovernorAlpha__factory.md#connect)
- [createInterface](GovernorAlpha__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new GovernorAlpha__factory**(): [`GovernorAlpha__factory`](GovernorAlpha__factory.md)

#### Returns

[`GovernorAlpha__factory`](GovernorAlpha__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous?`: `undefined` = false; `constant?`: `undefined` = true; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "timelock\_"; `type`: `string` = "address" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `payable`: `boolean` = false; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `anonymous`: `boolean` = false; `constant?`: `undefined` = true; `inputs`: \{ `indexed`: `boolean` = false; `internalType`: `string` = "uint256"; `name`: `string` = "id"; `type`: `string` = "uint256" }[] ; `name`: `string` = "ProposalCanceled"; `outputs?`: `undefined` ; `payable?`: `undefined` = false; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `constant`: `boolean` = true; `inputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = "proposalId"; `type`: `string` = "uint256" }[] ; `name`: `string` = "getActions"; `outputs`: \{ `internalType`: `string` = "address[]"; `name`: `string` = "targets"; `type`: `string` = "address[]" }[] ; `payable`: `boolean` = false; `stateMutability`: `string` = "view"; `type`: `string` = "function" } \| \{ `anonymous?`: `undefined` = false; `constant`: `boolean` = true; `inputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = "proposalId"; `type`: `string` = "uint256" }[] ; `name`: `string` = "getReceipt"; `outputs`: \{ `components`: \{ `internalType`: `string` = "bool"; `name`: `string` = "hasVoted"; `type`: `string` = "bool" }[] ; `internalType`: `string` = "struct GovernorAlpha.Receipt"; `name`: `string` = ""; `type`: `string` = "tuple" }[] ; `payable`: `boolean` = false; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`GovernorAlpha`](../interfaces/GovernorAlpha-1.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`GovernorAlpha`](../interfaces/GovernorAlpha-1.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `GovernorAlphaInterface`

#### Returns

`GovernorAlphaInterface`
