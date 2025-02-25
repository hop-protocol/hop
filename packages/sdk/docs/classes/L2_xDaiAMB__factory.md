# Class: L2\_xDaiAMB\_\_factory

## Table of contents

### Constructors

- [constructor](L2_xDaiAMB__factory.md#constructor)

### Properties

- [abi](L2_xDaiAMB__factory.md#abi)

### Methods

- [connect](L2_xDaiAMB__factory.md#connect)
- [createInterface](L2_xDaiAMB__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new L2_xDaiAMB__factory**(): [`L2_xDaiAMB__factory`](L2_xDaiAMB__factory.md)

#### Returns

[`L2_xDaiAMB__factory`](L2_xDaiAMB__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous?`: `undefined` = false; `constant`: `boolean` = true; `inputs`: \{ `name`: `string` = "\_message"; `type`: `string` = "bytes32" }[] ; `name`: `string` = "numMessagesSigned"; `outputs`: \{ `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `payable`: `boolean` = false; `stateMutability`: `string` = "view"; `type`: `string` = "function" } \| \{ `anonymous`: `boolean` = false; `constant?`: `undefined` = true; `inputs`: \{ `indexed`: `boolean` = true; `name`: `string` = "messageId"; `type`: `string` = "bytes32" }[] ; `name`: `string` = "UserRequestForSignature"; `outputs?`: `undefined` ; `payable?`: `undefined` = false; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`L2_xDaiAMB`](../interfaces/L2_xDaiAMB.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`L2_xDaiAMB`](../interfaces/L2_xDaiAMB.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `L2_xDaiAMBInterface`

#### Returns

`L2_xDaiAMBInterface`
