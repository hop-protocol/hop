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
- [watch](hop.md#watch)

## Constructors

### constructor

\+ **new Hop**(`signer?`: *Signer*): [*Hop*](hop.md)

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

Name | Type | Description |
:------ | :------ | :------ |
`signer?` | *Signer* | Ethers `Signer` for signing transactions.   |

**Returns:** [*Hop*](hop.md)

## Properties

### signer

• **signer**: *Signer*

## Accessors

### version

• get **version**(): *string*

**`desc`** Returns the SDK version.

**`example`** 
```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
console.log(hop.version)
```

**Returns:** *string*

## Methods

### bridge

▸ **bridge**(`tokenSymbol`: *string*, `sourceChain?`: [*Chain*](chain.md), `destinationChain?`: [*Chain*](chain.md)): [*HopBridge*](hopbridge.md)

**`desc`** Returns a bridge set instance.

**`example`** 
```js
import { Hop, Token } from '@hop-protocol/sdk'

const hop = new Hop()
const bridge = hop.bridge(Token.USDC)
```

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`tokenSymbol` | *string* | Token symbol of token of bridge to use.   |
`sourceChain?` | [*Chain*](chain.md) | Source chain model.   |
`destinationChain?` | [*Chain*](chain.md) | Destination chain model.   |

**Returns:** [*HopBridge*](hopbridge.md)

___

### connect

▸ **connect**(`signer`: *Signer*): [*Hop*](hop.md)

**`desc`** Returns hop instance with signer connected. Used for adding or changing signer.

**`example`** 
```js
import { Hop } from '@hop-protocol/sdk'
import { Wallet } from 'ethers'

const signer = new Wallet(privateKey)
let hop = new Hop()
// ...
hop = hop.connect(signer)
```

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`signer` | *Signer* | Ethers `Signer` for signing transactions.   |

**Returns:** [*Hop*](hop.md)

___

### getSignerAddress

▸ **getSignerAddress**(): *Promise*<string\>

**`desc`** Returns the connected signer address.

**`example`** 
```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
const address = await hop.getSignerAddress()
console.log(address)
```

**Returns:** *Promise*<string\>

___

### watch

▸ **watch**(`txHash`: *string*, `token`: *string*, `sourceChain`: [*Chain*](chain.md), `destinationChain`: [*Chain*](chain.md)): *EventEmitter*<string \| symbol, any\>

#### Parameters:

Name | Type |
:------ | :------ |
`txHash` | *string* |
`token` | *string* |
`sourceChain` | [*Chain*](chain.md) |
`destinationChain` | [*Chain*](chain.md) |

**Returns:** *EventEmitter*<string \| symbol, any\>
