# Class: MockFxChild\_\_factory

## Table of contents

### Constructors

- [constructor](MockFxChild__factory.md#constructor)

### Properties

- [abi](MockFxChild__factory.md#abi)

### Methods

- [connect](MockFxChild__factory.md#connect)
- [createInterface](MockFxChild__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new MockFxChild__factory**(): [`MockFxChild__factory`](MockFxChild__factory.md)

#### Returns

[`MockFxChild__factory`](MockFxChild__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = false; `internalType`: `string` = "address"; `name`: `string` = "rootMessageSender"; `type`: `string` = "address" }[] ; `name`: `string` = "NewFxMessage"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: `never`[] = []; `name`: `string` = "fxRoot"; `outputs`: \{ `internalType`: `string` = "address"; `name`: `string` = ""; `type`: `string` = "address" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = "stateId"; `type`: `string` = "uint256" }[] ; `name`: `string` = "onStateReceive"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`MockFxChild`](../interfaces/MockFxChild.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`MockFxChild`](../interfaces/MockFxChild.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `MockFxChildInterface`

#### Returns

`MockFxChildInterface`
