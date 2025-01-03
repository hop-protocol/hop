# Class: I\_L2\_PolygonMessengerProxy\_\_factory

## Table of contents

### Constructors

- [constructor](I_L2_PolygonMessengerProxy__factory.md#constructor)

### Properties

- [abi](I_L2_PolygonMessengerProxy__factory.md#abi)

### Methods

- [connect](I_L2_PolygonMessengerProxy__factory.md#connect)
- [createInterface](I_L2_PolygonMessengerProxy__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new I_L2_PolygonMessengerProxy__factory**(): [`I_L2_PolygonMessengerProxy__factory`](I_L2_PolygonMessengerProxy__factory.md)

#### Returns

[`I_L2_PolygonMessengerProxy__factory`](I_L2_PolygonMessengerProxy__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `inputs`: \{ `internalType`: `string` = "bytes"; `name`: `string` = "message"; `type`: `string` = "bytes" }[] ; `name`: `string` = "processMessageFromRoot"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" } \| \{ `inputs`: `never`[] = []; `name`: `string` = "xDomainMessageSender"; `outputs`: \{ `internalType`: `string` = "address"; `name`: `string` = ""; `type`: `string` = "address" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`I_L2_PolygonMessengerProxy`](../interfaces/I_L2_PolygonMessengerProxy.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`I_L2_PolygonMessengerProxy`](../interfaces/I_L2_PolygonMessengerProxy.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `I_L2_PolygonMessengerProxyInterface`

#### Returns

`I_L2_PolygonMessengerProxyInterface`
