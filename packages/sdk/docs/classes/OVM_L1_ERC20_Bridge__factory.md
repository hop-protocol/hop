# Class: OVM\_L1\_ERC20\_Bridge\_\_factory

## Table of contents

### Constructors

- [constructor](OVM_L1_ERC20_Bridge__factory.md#constructor)

### Properties

- [abi](OVM_L1_ERC20_Bridge__factory.md#abi)

### Methods

- [connect](OVM_L1_ERC20_Bridge__factory.md#connect)
- [createInterface](OVM_L1_ERC20_Bridge__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new OVM_L1_ERC20_Bridge__factory**(): [`OVM_L1_ERC20_Bridge__factory`](OVM_L1_ERC20_Bridge__factory.md)

#### Returns

[`OVM_L1_ERC20_Bridge__factory`](OVM_L1_ERC20_Bridge__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "\_messenger"; `type`: `string` = "address" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "address"; `name`: `string` = "\_sender"; `type`: `string` = "address" }[] ; `name`: `string` = "Deposit"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "\_l1TokenAddress"; `type`: `string` = "address" }[] ; `name`: `string` = "deposit"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" } \| \{ `anonymous?`: `undefined` = false; `inputs`: `never`[] = []; `name`: `string` = "messenger"; `outputs`: \{ `internalType`: `string` = "contract iAbs\_BaseCrossDomainMessenger"; `name`: `string` = ""; `type`: `string` = "address" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`OVM_L1_ERC20_Bridge`](../interfaces/OVM_L1_ERC20_Bridge.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`OVM_L1_ERC20_Bridge`](../interfaces/OVM_L1_ERC20_Bridge.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `OVM_L1_ERC20_BridgeInterface`

#### Returns

`OVM_L1_ERC20_BridgeInterface`
