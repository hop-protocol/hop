# Class: L1\_xDaiAMB\_\_factory

## Table of contents

### Constructors

- [constructor](L1_xDaiAMB__factory.md#constructor)

### Properties

- [abi](L1_xDaiAMB__factory.md#abi)

### Methods

- [connect](L1_xDaiAMB__factory.md#connect)
- [createInterface](L1_xDaiAMB__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new L1_xDaiAMB__factory**(): [`L1_xDaiAMB__factory`](L1_xDaiAMB__factory.md)

#### Returns

[`L1_xDaiAMB__factory`](L1_xDaiAMB__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous?`: `undefined` = false; `constant`: `boolean` = false; `inputs`: \{ `name`: `string` = "\_contract"; `type`: `string` = "address" }[] ; `name`: `string` = "\_sendMessage"; `outputs`: \{ `name`: `string` = ""; `type`: `string` = "bytes32" }[] ; `payable`: `boolean` = false; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" } \| \{ `anonymous`: `boolean` = false; `constant?`: `undefined` = true; `inputs`: \{ `indexed`: `boolean` = true; `name`: `string` = "messageId"; `type`: `string` = "bytes32" }[] ; `name`: `string` = "UserRequestForAffirmation"; `outputs?`: `undefined` ; `payable?`: `undefined` = false; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`L1_xDaiAMB`](../interfaces/L1_xDaiAMB.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`L1_xDaiAMB`](../interfaces/L1_xDaiAMB.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `L1_xDaiAMBInterface`

#### Returns

`L1_xDaiAMBInterface`
