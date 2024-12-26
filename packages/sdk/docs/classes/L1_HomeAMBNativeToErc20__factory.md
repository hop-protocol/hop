# Class: L1\_HomeAMBNativeToErc20\_\_factory

## Table of contents

### Constructors

- [constructor](L1_HomeAMBNativeToErc20__factory.md#constructor)

### Properties

- [abi](L1_HomeAMBNativeToErc20__factory.md#abi)

### Methods

- [connect](L1_HomeAMBNativeToErc20__factory.md#connect)
- [createInterface](L1_HomeAMBNativeToErc20__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new L1_HomeAMBNativeToErc20__factory**(): [`L1_HomeAMBNativeToErc20__factory`](L1_HomeAMBNativeToErc20__factory.md)

#### Returns

[`L1_HomeAMBNativeToErc20__factory`](L1_HomeAMBNativeToErc20__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous?`: `undefined` = false; `constant`: `boolean` = true; `inputs`: \{ `name`: `string` = "\_day"; `type`: `string` = "uint256" }[] ; `name`: `string` = "totalSpentPerDay"; `outputs`: \{ `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `payable`: `boolean` = false; `stateMutability`: `string` = "view"; `type`: `string` = "function" } \| \{ `anonymous?`: `undefined` = false; `constant?`: `undefined` = true; `inputs?`: `undefined` ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `payable`: `boolean` = true; `stateMutability`: `string` = "payable"; `type`: `string` = "fallback" } \| \{ `anonymous`: `boolean` = false; `constant?`: `undefined` = true; `inputs`: \{ `indexed`: `boolean` = false; `name`: `string` = "feeAmount"; `type`: `string` = "uint256" }[] ; `name`: `string` = "FeeDistributed"; `outputs?`: `undefined` ; `payable?`: `undefined` = false; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`L1_HomeAMBNativeToErc20`](../interfaces/L1_HomeAMBNativeToErc20.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`L1_HomeAMBNativeToErc20`](../interfaces/L1_HomeAMBNativeToErc20.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `L1_HomeAMBNativeToErc20Interface`

#### Returns

`L1_HomeAMBNativeToErc20Interface`
