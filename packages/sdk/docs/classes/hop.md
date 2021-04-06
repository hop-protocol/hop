[@hop-protocol/sdk](../README.md) / [Exports](../modules.md) / Hop

# Class: Hop

Class reprensenting Hop

**`namespace`** Hop

## Table of contents

### Constructors

- [constructor](hop.md#constructor)

### Properties

- [signer](hop.md#signer)

### Accessors

- [version](hop.md#version)

### Methods

- [bridge](hop.md#bridge)
- [connect](hop.md#connect)
- [getSignerAddress](hop.md#getsigneraddress)

## Constructors

### constructor

\+ **new Hop**(`signer?`: _Signer_): [_Hop_](hop.md)

**`desc`** Instantiates Hop SDK.
Returns a new Hop SDK instance.

**`example`**

```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop(signer)
```

**`example`**

```js
import { Hop } from '@hop-protocol/sdk'
import { Wallet } from 'ethers'

const signer = new Wallet(privateKey)
const hop = new Hop(signer)
```

#### Parameters:

| Name      | Type     | Description                               |
| :-------- | :------- | :---------------------------------------- |
| `signer?` | _Signer_ | Ethers `Signer` for signing transactions. |

**Returns:** [_Hop_](hop.md)

Defined in: [Hop.ts:356](https://github.com/hop-exchange/hop/blob/7eb35e3/packages/sdk/src/Hop.ts#L356)

## Properties

### signer

• **signer**: _Signer_

Defined in: [Hop.ts:356](https://github.com/hop-exchange/hop/blob/7eb35e3/packages/sdk/src/Hop.ts#L356)

## Accessors

### version

• get **version**(): _string_

**Returns:** _string_

Defined in: [Hop.ts:395](https://github.com/hop-exchange/hop/blob/7eb35e3/packages/sdk/src/Hop.ts#L395)

## Methods

### bridge

▸ **bridge**(`tokenSymbol`: _string_, `sourceChain?`: [_Chain_](chain.md), `destinationChain?`: [_Chain_](chain.md)): _HopBridge_

#### Parameters:

| Name                | Type                |
| :------------------ | :------------------ |
| `tokenSymbol`       | _string_            |
| `sourceChain?`      | [_Chain_](chain.md) |
| `destinationChain?` | [_Chain_](chain.md) |

**Returns:** _HopBridge_

Defined in: [Hop.ts:382](https://github.com/hop-exchange/hop/blob/7eb35e3/packages/sdk/src/Hop.ts#L382)

---

### connect

▸ **connect**(`signer`: _Signer_): [_Hop_](hop.md)

#### Parameters:

| Name     | Type     |
| :------- | :------- |
| `signer` | _Signer_ |

**Returns:** [_Hop_](hop.md)

Defined in: [Hop.ts:386](https://github.com/hop-exchange/hop/blob/7eb35e3/packages/sdk/src/Hop.ts#L386)

---

### getSignerAddress

▸ **getSignerAddress**(): _Promise_<string\>

**Returns:** _Promise_<string\>

Defined in: [Hop.ts:391](https://github.com/hop-exchange/hop/blob/7eb35e3/packages/sdk/src/Hop.ts#L391)
