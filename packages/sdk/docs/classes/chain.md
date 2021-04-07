# Class: Chain

## Table of contents

### Constructors

- [constructor](chain.md#constructor)

### Properties

- [chainId](chain.md#chainid)
- [isL1](chain.md#isl1)
- [name](chain.md#name)
- [provider](chain.md#provider)
- [slug](chain.md#slug)
- [Arbitrum](chain.md#arbitrum)
- [Kovan](chain.md#kovan)
- [Optimism](chain.md#optimism)
- [xDai](chain.md#xdai)

### Methods

- [equals](chain.md#equals)

## Constructors

### constructor

\+ **new Chain**(`chainId`: *string* \| *number*, `name`: *string*, `provider`: *Provider*): [*Chain*](chain.md)

#### Parameters:

Name | Type |
:------ | :------ |
`chainId` | *string* \| *number* |
`name` | *string* |
`provider` | *Provider* |

**Returns:** [*Chain*](chain.md)

## Properties

### chainId

• `Readonly` **chainId**: *number*

___

### isL1

• `Readonly` **isL1**: *boolean*= false

___

### name

• `Readonly` **name**: *string*= ''

___

### provider

• `Readonly` **provider**: *Provider*= null

___

### slug

• `Readonly` **slug**: *string*= ''

___

### Arbitrum

▪ `Static` **Arbitrum**: [*Chain*](chain.md)

___

### Kovan

▪ `Static` **Kovan**: [*Chain*](chain.md)

___

### Optimism

▪ `Static` **Optimism**: [*Chain*](chain.md)

___

### xDai

▪ `Static` **xDai**: [*Chain*](chain.md)

## Methods

### equals

▸ **equals**(`otherChain`: [*Chain*](chain.md)): *boolean*

#### Parameters:

Name | Type |
:------ | :------ |
`otherChain` | [*Chain*](chain.md) |

**Returns:** *boolean*
