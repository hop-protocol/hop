# Class: Arbitrum\_L2\_ERC20\_Bridge\_\_factory

## Table of contents

### Constructors

- [constructor](Arbitrum_L2_ERC20_Bridge__factory.md#constructor)

### Properties

- [abi](Arbitrum_L2_ERC20_Bridge__factory.md#abi)

### Methods

- [connect](Arbitrum_L2_ERC20_Bridge__factory.md#connect)
- [createInterface](Arbitrum_L2_ERC20_Bridge__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new Arbitrum_L2_ERC20_Bridge__factory**(): [`Arbitrum_L2_ERC20_Bridge__factory`](Arbitrum_L2_ERC20_Bridge__factory.md)

#### Returns

[`Arbitrum_L2_ERC20_Bridge__factory`](Arbitrum_L2_ERC20_Bridge__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "\_l2Messenger"; `type`: `string` = "address" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `inputs`: `never`[] = []; `name`: `string` = "l1ERC20BridgeAddress"; `outputs`: \{ `internalType`: `string` = "address"; `name`: `string` = ""; `type`: `string` = "address" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" } \| \{ `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "\_l1TokenAddress"; `type`: `string` = "address" }[] ; `name`: `string` = "withdraw"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`Arbitrum_L2_ERC20_Bridge`](../interfaces/Arbitrum_L2_ERC20_Bridge.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`Arbitrum_L2_ERC20_Bridge`](../interfaces/Arbitrum_L2_ERC20_Bridge.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `Arbitrum_L2_ERC20_BridgeInterface`

#### Returns

`Arbitrum_L2_ERC20_BridgeInterface`
