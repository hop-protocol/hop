# Class: FxBaseChildTunnel\_\_factory

## Table of contents

### Constructors

- [constructor](FxBaseChildTunnel__factory.md#constructor)

### Properties

- [abi](FxBaseChildTunnel__factory.md#abi)

### Methods

- [connect](FxBaseChildTunnel__factory.md#connect)
- [createInterface](FxBaseChildTunnel__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new FxBaseChildTunnel__factory**(): [`FxBaseChildTunnel__factory`](FxBaseChildTunnel__factory.md)

#### Returns

[`FxBaseChildTunnel__factory`](FxBaseChildTunnel__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = false; `internalType`: `string` = "bytes"; `name`: `string` = "message"; `type`: `string` = "bytes" }[] ; `name`: `string` = "MessageSent"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: `never`[] = []; `name`: `string` = "fxChild"; `outputs`: \{ `internalType`: `string` = "address"; `name`: `string` = ""; `type`: `string` = "address" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = "stateId"; `type`: `string` = "uint256" }[] ; `name`: `string` = "processMessageFromRoot"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`FxBaseChildTunnel`](../interfaces/FxBaseChildTunnel.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`FxBaseChildTunnel`](../interfaces/FxBaseChildTunnel.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `FxBaseChildTunnelInterface`

#### Returns

`FxBaseChildTunnelInterface`
