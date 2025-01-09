# Class: MockOVM\_CrossDomainMessenger\_\_factory

## Table of contents

### Constructors

- [constructor](MockOVM_CrossDomainMessenger__factory.md#constructor)

### Properties

- [abi](MockOVM_CrossDomainMessenger__factory.md#abi)

### Methods

- [connect](MockOVM_CrossDomainMessenger__factory.md#connect)
- [createInterface](MockOVM_CrossDomainMessenger__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new MockOVM_CrossDomainMessenger__factory**(): [`MockOVM_CrossDomainMessenger__factory`](MockOVM_CrossDomainMessenger__factory.md)

#### Returns

[`MockOVM_CrossDomainMessenger__factory`](MockOVM_CrossDomainMessenger__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `inputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = "\_delay"; `type`: `string` = "uint256" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `inputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `name`: `string` = "fullReceivedMessages"; `outputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = "timestamp"; `type`: `string` = "uint256" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" } \| \{ `inputs`: \{ `components`: \{ `internalType`: `string` = "uint256"; `name`: `string` = "timestamp"; `type`: `string` = "uint256" }[] ; `internalType`: `string` = "struct mockOVM\_CrossDomainMessenger.ReceivedMessage"; `name`: `string` = "\_message"; `type`: `string` = "tuple" }[] ; `name`: `string` = "receiveMessage"; `outputs`: `never`[] = []; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`MockOVM_CrossDomainMessenger`](../interfaces/MockOVM_CrossDomainMessenger-1.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`MockOVM_CrossDomainMessenger`](../interfaces/MockOVM_CrossDomainMessenger-1.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `MockOVM_CrossDomainMessengerInterface`

#### Returns

`MockOVM_CrossDomainMessengerInterface`
