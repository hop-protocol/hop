# Class: L1\_HopCCTPImplementation\_\_factory

## Table of contents

### Constructors

- [constructor](L1_HopCCTPImplementation__factory.md#constructor)

### Properties

- [abi](L1_HopCCTPImplementation__factory.md#abi)

### Methods

- [connect](L1_HopCCTPImplementation__factory.md#connect)
- [createInterface](L1_HopCCTPImplementation__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new L1_HopCCTPImplementation__factory**(): [`L1_HopCCTPImplementation__factory`](L1_HopCCTPImplementation__factory.md)

#### Returns

[`L1_HopCCTPImplementation__factory`](L1_HopCCTPImplementation__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "nativeTokenAddress"; `type`: `string` = "address" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "target"; `type`: `string` = "address" }[] ; `name`: `string` = "AddressEmptyCode"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "error" } \| \{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "uint64"; `name`: `string` = "cctpNonce"; `type`: `string` = "uint64" }[] ; `name`: `string` = "CCTPTransferSent"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `name`: `string` = "activeChainIds"; `outputs`: \{ `internalType`: `string` = "bool"; `name`: `string` = ""; `type`: `string` = "bool" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`L1_HopCCTPImplementation`](../interfaces/L1_HopCCTPImplementation.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`L1_HopCCTPImplementation`](../interfaces/L1_HopCCTPImplementation.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `L1_HopCCTPImplementationInterface`

#### Returns

`L1_HopCCTPImplementationInterface`
