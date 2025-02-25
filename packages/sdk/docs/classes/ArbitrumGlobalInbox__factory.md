# Class: ArbitrumGlobalInbox\_\_factory

## Table of contents

### Constructors

- [constructor](ArbitrumGlobalInbox__factory.md#constructor)

### Properties

- [abi](ArbitrumGlobalInbox__factory.md#abi)

### Methods

- [connect](ArbitrumGlobalInbox__factory.md#connect)
- [createInterface](ArbitrumGlobalInbox__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new ArbitrumGlobalInbox__factory**(): [`ArbitrumGlobalInbox__factory`](ArbitrumGlobalInbox__factory.md)

#### Returns

[`ArbitrumGlobalInbox__factory`](ArbitrumGlobalInbox__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous`: `boolean` = false; `constant?`: `undefined` = true; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "address"; `name`: `string` = "sender"; `type`: `string` = "address" }[] ; `name`: `string` = "BuddyContractDeployed"; `outputs?`: `undefined` ; `payable?`: `undefined` = false; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `constant`: `boolean` = true; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "\_tokenContract"; `type`: `string` = "address" }[] ; `name`: `string` = "getERC20Balance"; `outputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `payable`: `boolean` = false; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`ArbitrumGlobalInbox`](../interfaces/ArbitrumGlobalInbox.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`ArbitrumGlobalInbox`](../interfaces/ArbitrumGlobalInbox.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `ArbitrumGlobalInboxInterface`

#### Returns

`ArbitrumGlobalInboxInterface`
