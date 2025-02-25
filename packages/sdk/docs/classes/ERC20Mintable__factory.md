# Class: ERC20Mintable\_\_factory

## Table of contents

### Constructors

- [constructor](ERC20Mintable__factory.md#constructor)

### Properties

- [abi](ERC20Mintable__factory.md#abi)

### Methods

- [connect](ERC20Mintable__factory.md#connect)
- [createInterface](ERC20Mintable__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new ERC20Mintable__factory**(): [`ERC20Mintable__factory`](ERC20Mintable__factory.md)

#### Returns

[`ERC20Mintable__factory`](ERC20Mintable__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous?`: `undefined` = false; `constant`: `boolean` = false; `inputs`: \{ `name`: `string` = "spender"; `type`: `string` = "address" }[] ; `name`: `string` = "approve"; `outputs`: \{ `name`: `string` = ""; `type`: `string` = "bool" }[] ; `payable`: `boolean` = false; `signature`: `string` = "0x095ea7b3"; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" } \| \{ `anonymous?`: `undefined` = false; `constant?`: `undefined` = true; `inputs`: \{ `name`: `string` = "\_name"; `type`: `string` = "string" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `payable`: `boolean` = false; `signature`: `string` = "constructor"; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `anonymous`: `boolean` = false; `constant?`: `undefined` = true; `inputs`: \{ `indexed`: `boolean` = true; `name`: `string` = "account"; `type`: `string` = "address" }[] ; `name`: `string` = "MinterAdded"; `outputs?`: `undefined` ; `payable?`: `undefined` = false; `signature`: `string` = "0x6ae172837ea30b801fbfcdd4108aa1d5bf8ff775444fd70256b44e6bf3dfc3f6"; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`ERC20Mintable`](../interfaces/ERC20Mintable.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`ERC20Mintable`](../interfaces/ERC20Mintable.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `ERC20MintableInterface`

#### Returns

`ERC20MintableInterface`
