# Class: L1\_OptimismTokenBridge\_\_factory

## Table of contents

### Constructors

- [constructor](L1_OptimismTokenBridge__factory.md#constructor)

### Properties

- [abi](L1_OptimismTokenBridge__factory.md#abi)

### Methods

- [connect](L1_OptimismTokenBridge__factory.md#connect)
- [createInterface](L1_OptimismTokenBridge__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new L1_OptimismTokenBridge__factory**(): [`L1_OptimismTokenBridge__factory`](L1_OptimismTokenBridge__factory.md)

#### Returns

[`L1_OptimismTokenBridge__factory`](L1_OptimismTokenBridge__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "\_L1ERC20Address"; `type`: `string` = "address" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "address"; `name`: `string` = "\_sender"; `type`: `string` = "address" }[] ; `name`: `string` = "Deposit"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "\_l1TokenAddress"; `type`: `string` = "address" }[] ; `name`: `string` = "deposit"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" } \| \{ `anonymous?`: `undefined` = false; `inputs`: `never`[] = []; `name`: `string` = "l1ERC20"; `outputs`: \{ `internalType`: `string` = "contract ERC20"; `name`: `string` = ""; `type`: `string` = "address" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`L1_OptimismTokenBridge`](../interfaces/L1_OptimismTokenBridge.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`L1_OptimismTokenBridge`](../interfaces/L1_OptimismTokenBridge.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `L1_OptimismTokenBridgeInterface`

#### Returns

`L1_OptimismTokenBridgeInterface`
