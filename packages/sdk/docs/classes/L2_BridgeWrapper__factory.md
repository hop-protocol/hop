# Class: L2\_BridgeWrapper\_\_factory

## Table of contents

### Constructors

- [constructor](L2_BridgeWrapper__factory.md#constructor)

### Properties

- [abi](L2_BridgeWrapper__factory.md#abi)

### Methods

- [connect](L2_BridgeWrapper__factory.md#connect)
- [createInterface](L2_BridgeWrapper__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new L2_BridgeWrapper__factory**(): [`L2_BridgeWrapper__factory`](L2_BridgeWrapper__factory.md)

#### Returns

[`L2_BridgeWrapper__factory`](L2_BridgeWrapper__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "contract iOVM\_L2CrossDomainMessenger"; `name`: `string` = "\_messenger"; `type`: `string` = "address" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = false; `internalType`: `string` = "address"; `name`: `string` = "bonder"; `type`: `string` = "address" }[] ; `name`: `string` = "MultipleWithdrawalsSettled"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "bonder"; `type`: `string` = "address" }[] ; `name`: `string` = "getBondedWithdrawalAmount"; `outputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "bytes32"; `name`: `string` = "rootHash"; `type`: `string` = "bytes32" }[] ; `name`: `string` = "getTransferRoot"; `outputs`: \{ `components`: \{ `internalType`: `string` = "uint256"; `name`: `string` = "total"; `type`: `string` = "uint256" }[] ; `internalType`: `string` = "struct Bridge.TransferRoot"; `name`: `string` = ""; `type`: `string` = "tuple" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`L2_BridgeWrapper`](../interfaces/L2_BridgeWrapper.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`L2_BridgeWrapper`](../interfaces/L2_BridgeWrapper.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `L2_BridgeWrapperInterface`

#### Returns

`L2_BridgeWrapperInterface`
