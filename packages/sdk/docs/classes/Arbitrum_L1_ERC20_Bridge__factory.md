# Class: Arbitrum\_L1\_ERC20\_Bridge\_\_factory

## Table of contents

### Constructors

- [constructor](Arbitrum_L1_ERC20_Bridge__factory.md#constructor)

### Properties

- [abi](Arbitrum_L1_ERC20_Bridge__factory.md#abi)

### Methods

- [connect](Arbitrum_L1_ERC20_Bridge__factory.md#connect)
- [createInterface](Arbitrum_L1_ERC20_Bridge__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new Arbitrum_L1_ERC20_Bridge__factory**(): [`Arbitrum_L1_ERC20_Bridge__factory`](Arbitrum_L1_ERC20_Bridge__factory.md)

#### Returns

[`Arbitrum_L1_ERC20_Bridge__factory`](Arbitrum_L1_ERC20_Bridge__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "\_messenger"; `type`: `string` = "address" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "address"; `name`: `string` = "\_sender"; `type`: `string` = "address" }[] ; `name`: `string` = "Deposit"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "\_l1TokenAddress"; `type`: `string` = "address" }[] ; `name`: `string` = "deposit"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" } \| \{ `anonymous?`: `undefined` = false; `inputs`: `never`[] = []; `name`: `string` = "messenger"; `outputs`: \{ `internalType`: `string` = "contract IInbox"; `name`: `string` = ""; `type`: `string` = "address" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`Arbitrum_L1_ERC20_Bridge`](../interfaces/Arbitrum_L1_ERC20_Bridge.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`Arbitrum_L1_ERC20_Bridge`](../interfaces/Arbitrum_L1_ERC20_Bridge.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `Arbitrum_L1_ERC20_BridgeInterface`

#### Returns

`Arbitrum_L1_ERC20_BridgeInterface`
