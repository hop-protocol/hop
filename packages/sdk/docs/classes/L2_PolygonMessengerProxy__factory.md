# Class: L2\_PolygonMessengerProxy\_\_factory

## Table of contents

### Constructors

- [constructor](L2_PolygonMessengerProxy__factory.md#constructor)

### Properties

- [abi](L2_PolygonMessengerProxy__factory.md#abi)

### Methods

- [connect](L2_PolygonMessengerProxy__factory.md#connect)
- [createInterface](L2_PolygonMessengerProxy__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new L2_PolygonMessengerProxy__factory**(): [`L2_PolygonMessengerProxy__factory`](L2_PolygonMessengerProxy__factory.md)

#### Returns

[`L2_PolygonMessengerProxy__factory`](L2_PolygonMessengerProxy__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "\_fxChild"; `type`: `string` = "address" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = false; `internalType`: `string` = "bytes"; `name`: `string` = "message"; `type`: `string` = "bytes" }[] ; `name`: `string` = "MessageSent"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: `never`[] = []; `name`: `string` = "DEAD\_ADDRESS"; `outputs`: \{ `internalType`: `string` = "address"; `name`: `string` = ""; `type`: `string` = "address" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = "stateId"; `type`: `string` = "uint256" }[] ; `name`: `string` = "processMessageFromRoot"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`L2_PolygonMessengerProxy`](../interfaces/L2_PolygonMessengerProxy.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`L2_PolygonMessengerProxy`](../interfaces/L2_PolygonMessengerProxy.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `L2_PolygonMessengerProxyInterface`

#### Returns

`L2_PolygonMessengerProxyInterface`
