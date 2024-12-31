# Class: L2\_xDaiToken\_\_factory

## Table of contents

### Constructors

- [constructor](L2_xDaiToken__factory.md#constructor)

### Properties

- [abi](L2_xDaiToken__factory.md#abi)

### Methods

- [connect](L2_xDaiToken__factory.md#connect)
- [createInterface](L2_xDaiToken__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new L2_xDaiToken__factory**(): [`L2_xDaiToken__factory`](L2_xDaiToken__factory.md)

#### Returns

[`L2_xDaiToken__factory`](L2_xDaiToken__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous?`: `undefined` = false; `constant`: `boolean` = false; `inputs`: \{ `name`: `string` = "\_spender"; `type`: `string` = "address" }[] ; `name`: `string` = "approve"; `outputs`: \{ `name`: `string` = ""; `type`: `string` = "bool" }[] ; `payable`: `boolean` = false; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" } \| \{ `anonymous?`: `undefined` = false; `constant?`: `undefined` = true; `inputs`: \{ `name`: `string` = "\_name"; `type`: `string` = "string" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `payable`: `boolean` = false; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `anonymous`: `boolean` = false; `constant?`: `undefined` = true; `inputs`: \{ `indexed`: `boolean` = false; `name`: `string` = "from"; `type`: `string` = "address" }[] ; `name`: `string` = "ContractFallbackCallFailed"; `outputs?`: `undefined` ; `payable?`: `undefined` = false; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`L2_xDaiToken`](../interfaces/L2_xDaiToken.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`L2_xDaiToken`](../interfaces/L2_xDaiToken.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `L2_xDaiTokenInterface`

#### Returns

`L2_xDaiTokenInterface`
