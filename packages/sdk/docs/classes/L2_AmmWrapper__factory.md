# Class: L2\_AmmWrapper\_\_factory

## Table of contents

### Constructors

- [constructor](L2_AmmWrapper__factory.md#constructor)

### Properties

- [abi](L2_AmmWrapper__factory.md#abi)

### Methods

- [connect](L2_AmmWrapper__factory.md#connect)
- [createInterface](L2_AmmWrapper__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new L2_AmmWrapper__factory**(): [`L2_AmmWrapper__factory`](L2_AmmWrapper__factory.md)

#### Returns

[`L2_AmmWrapper__factory`](L2_AmmWrapper__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `inputs`: \{ `internalType`: `string` = "contract L2\_Bridge"; `name`: `string` = "\_bridge"; `type`: `string` = "address" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "recipient"; `type`: `string` = "address" }[] ; `name`: `string` = "attemptSwap"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" } \| \{ `inputs`: `never`[] = []; `name`: `string` = "bridge"; `outputs`: \{ `internalType`: `string` = "contract L2\_Bridge"; `name`: `string` = ""; `type`: `string` = "address" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`L2_AmmWrapper`](../interfaces/L2_AmmWrapper.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`L2_AmmWrapper`](../interfaces/L2_AmmWrapper.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `L2_AmmWrapperInterface`

#### Returns

`L2_AmmWrapperInterface`
