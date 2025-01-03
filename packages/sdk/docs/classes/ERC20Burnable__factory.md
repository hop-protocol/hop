# Class: ERC20Burnable\_\_factory

## Table of contents

### Constructors

- [constructor](ERC20Burnable__factory.md#constructor)

### Properties

- [abi](ERC20Burnable__factory.md#abi)

### Methods

- [connect](ERC20Burnable__factory.md#connect)
- [createInterface](ERC20Burnable__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new ERC20Burnable__factory**(): [`ERC20Burnable__factory`](ERC20Burnable__factory.md)

#### Returns

[`ERC20Burnable__factory`](ERC20Burnable__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "address"; `name`: `string` = "owner"; `type`: `string` = "address" }[] ; `name`: `string` = "Approval"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "owner"; `type`: `string` = "address" }[] ; `name`: `string` = "allowance"; `outputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`ERC20Burnable`](../interfaces/ERC20Burnable.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`ERC20Burnable`](../interfaces/ERC20Burnable.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `ERC20BurnableInterface`

#### Returns

`ERC20BurnableInterface`
