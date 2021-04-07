<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Classes](#classes)
  - [Class: Chain](#class-chain)
    - [Table of contents](#table-of-contents)
    - [Constructors](#constructors)
    - [Properties](#properties)
    - [Methods](#methods)
  - [Class: Hop](#class-hop)
    - [Table of contents](#table-of-contents-1)
    - [Constructors](#constructors-1)
    - [Properties](#properties-1)
    - [Accessors](#accessors)
    - [Methods](#methods-1)
  - [Class: HopBridge](#class-hopbridge)
    - [Table of contents](#table-of-contents-2)
    - [Constructors](#constructors-2)
    - [Properties](#properties-2)
    - [Accessors](#accessors-1)
    - [Methods](#methods-2)
  - [Class: Route](#class-route)
    - [Table of contents](#table-of-contents-3)
    - [Constructors](#constructors-3)
    - [Properties](#properties-3)
  - [Class: Token](#class-token)
    - [Table of contents](#table-of-contents-4)
    - [Constructors](#constructors-4)
    - [Properties](#properties-4)
  - [Class: TokenAmount](#class-tokenamount)
    - [Table of contents](#table-of-contents-5)
    - [Constructors](#constructors-5)
    - [Properties](#properties-5)
  - [Class: Transfer](#class-transfer)
    - [Table of contents](#table-of-contents-6)
    - [Constructors](#constructors-6)
    - [Properties](#properties-6)
- [@hop-protocol/sdk](#hop-protocolsdk)
  - [Table of contents](#table-of-contents-7)
    - [Namespaces](#namespaces)
    - [Classes](#classes-1)
- [Modules](#modules)
  - [Namespace: utils](#namespace-utils)
    - [Table of contents](#table-of-contents-8)
    - [Functions](#functions)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


<a name="readmemd"></a>


# Classes


<a name="classeschainmd"></a>

## Class: Chain

### Table of contents

#### Constructors

- [constructor](#constructor)

#### Properties

- [chainId](#chainid)
- [isL1](#isl1)
- [name](#name)
- [provider](#provider)
- [slug](#slug)
- [Arbitrum](#arbitrum)
- [Kovan](#kovan)
- [Optimism](#optimism)
- [xDai](#xdai)

#### Methods

- [equals](#equals)

### Constructors

#### constructor

\+ **new Chain**(`chainId`: *string* \| *number*, `name`: *string*, `provider`: *Provider*): [*Chain*](#classeschainmd)

##### Parameters:

Name | Type |
:------ | :------ |
`chainId` | *string* \| *number* |
`name` | *string* |
`provider` | *Provider* |

**Returns:** [*Chain*](#classeschainmd)

### Properties

#### chainId

• `Readonly` **chainId**: *number*

___

#### isL1

• `Readonly` **isL1**: *boolean*= false

___

#### name

• `Readonly` **name**: *string*= ''

___

#### provider

• `Readonly` **provider**: *Provider*= null

___

#### slug

• `Readonly` **slug**: *string*= ''

___

#### Arbitrum

▪ `Static` **Arbitrum**: [*Chain*](#classeschainmd)

___

#### Kovan

▪ `Static` **Kovan**: [*Chain*](#classeschainmd)

___

#### Optimism

▪ `Static` **Optimism**: [*Chain*](#classeschainmd)

___

#### xDai

▪ `Static` **xDai**: [*Chain*](#classeschainmd)

### Methods

#### equals

▸ **equals**(`otherChain`: [*Chain*](#classeschainmd)): *boolean*

##### Parameters:

Name | Type |
:------ | :------ |
`otherChain` | [*Chain*](#classeschainmd) |

**Returns:** *boolean*


<a name="classeshopmd"></a>

## Class: Hop

Class reprensenting Hop

**`namespace`** Hop

### Table of contents

#### Constructors

- [constructor](#constructor)

#### Properties

- [signer](#signer)

#### Accessors

- [version](#version)

#### Methods

- [bridge](#bridge)
- [connect](#connect)
- [getSignerAddress](#getsigneraddress)
- [watch](#watch)

### Constructors

#### constructor

\+ **new Hop**(`signer?`: *Signer*): [*Hop*](#classeshopmd)

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

##### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`signer?` | *Signer* | Ethers `Signer` for signing transactions.   |

**Returns:** [*Hop*](#classeshopmd)

### Properties

#### signer

• **signer**: *Signer*

### Accessors

#### version

• get **version**(): *string*

**`desc`** Returns the SDK version.

**`example`** 
```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
console.log(hop.version)
```

**Returns:** *string*

### Methods

#### bridge

▸ **bridge**(`tokenSymbol`: *string*, `sourceChain?`: [*Chain*](#classeschainmd), `destinationChain?`: [*Chain*](#classeschainmd)): [*HopBridge*](#classeshopbridgemd)

**`desc`** Returns a bridge set instance.

**`example`** 
```js
import { Hop, Token } from '@hop-protocol/sdk'

const hop = new Hop()
const bridge = hop.bridge(Token.USDC)
```

##### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`tokenSymbol` | *string* | Token symbol of token of bridge to use.   |
`sourceChain?` | [*Chain*](#classeschainmd) | Source chain model.   |
`destinationChain?` | [*Chain*](#classeschainmd) | Destination chain model.   |

**Returns:** [*HopBridge*](#classeshopbridgemd)

___

#### connect

▸ **connect**(`signer`: *Signer*): [*Hop*](#classeshopmd)

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

##### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`signer` | *Signer* | Ethers `Signer` for signing transactions.   |

**Returns:** [*Hop*](#classeshopmd)

___

#### getSignerAddress

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

#### watch

▸ **watch**(`txHash`: *string*, `token`: *string*, `sourceChain`: [*Chain*](#classeschainmd), `destinationChain`: [*Chain*](#classeschainmd)): *EventEmitter*<string \| symbol, any\>

##### Parameters:

Name | Type |
:------ | :------ |
`txHash` | *string* |
`token` | *string* |
`sourceChain` | [*Chain*](#classeschainmd) |
`destinationChain` | [*Chain*](#classeschainmd) |

**Returns:** *EventEmitter*<string \| symbol, any\>


<a name="classeshopbridgemd"></a>

## Class: HopBridge

Class reprensenting Hop bridge.

**`namespace`** HopBridge

### Table of contents

#### Constructors

- [constructor](#constructor)

#### Properties

- [defaultDeadlineMinutes](#defaultdeadlineminutes)
- [destinationChain](#destinationchain)
- [signer](#signer)
- [sourceChain](#sourcechain)
- [token](#token)

#### Accessors

- [defaultDeadlineSeconds](#defaultdeadlineseconds)

#### Methods

- [\_calcAmountOut](#_calcamountout)
- [connect](#connect)
- [getBonderFee](#getbonderfee)
- [getErc20](#geterc20)
- [getL1Bridge](#getl1bridge)
- [getL2Bridge](#getl2bridge)
- [getSignerAddress](#getsigneraddress)
- [getUniswapExchange](#getuniswapexchange)
- [getUniswapRouter](#getuniswaprouter)
- [getUniswapWrapper](#getuniswapwrapper)
- [send](#send)

### Constructors

#### constructor

\+ **new HopBridge**(`signer`: *Signer*, `token`: *string* \| [*Token*](#classestokenmd), `sourceChain?`: [*Chain*](#classeschainmd), `destinationChain?`: [*Chain*](#classeschainmd)): [*HopBridge*](#classeshopbridgemd)

**`desc`** Instantiates Hop Bridge.
Returns a new Hop Bridge instance.

**`example`** 
```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop(signer)
```

**`example`** 
```js
import { Hop, Token, Chain } from '@hop-protocol/sdk'
import { Wallet } from 'ethers'

const signer = new Wallet(privateKey)
const bridge = new HopBridge(signer, Token.USDC, Chain.Optimism, Chain.xDai)
```

##### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`signer` | *Signer* | Ethers `Signer` for signing transactions.   |
`token` | *string* \| [*Token*](#classestokenmd) | Token symbol or model   |
`sourceChain?` | [*Chain*](#classeschainmd) | Source chain model   |
`destinationChain?` | [*Chain*](#classeschainmd) | Destination chain model   |

**Returns:** [*HopBridge*](#classeshopbridgemd)

### Properties

#### defaultDeadlineMinutes

• **defaultDeadlineMinutes**: *number*= 30

Default deadline for transfers

___

#### destinationChain

• **destinationChain**: [*Chain*](#classeschainmd)

Destination Chain model

___

#### signer

• **signer**: *Signer*

Ethers Signer

___

#### sourceChain

• **sourceChain**: [*Chain*](#classeschainmd)

Source Chain model

___

#### token

• **token**: [*Token*](#classestokenmd)

Token model

### Accessors

#### defaultDeadlineSeconds

• get **defaultDeadlineSeconds**(): *number*

**Returns:** *number*

### Methods

#### \_calcAmountOut

▸ **_calcAmountOut**(`amount`: *string*, `isAmountIn`: *boolean*, `sourceChain`: [*Chain*](#classeschainmd), `destinationChain`: [*Chain*](#classeschainmd)): *Promise*<BigNumber\>

##### Parameters:

Name | Type |
:------ | :------ |
`amount` | *string* |
`isAmountIn` | *boolean* |
`sourceChain` | [*Chain*](#classeschainmd) |
`destinationChain` | [*Chain*](#classeschainmd) |

**Returns:** *Promise*<BigNumber\>

___

#### connect

▸ **connect**(`signer`: *Signer*): [*HopBridge*](#classeshopbridgemd)

**`desc`** Returns hop bridge instance with signer connected. Used for adding or changing signer.

**`example`** 
```js
import { Hop, Token } from '@hop-protocol/sdk'
import { Wallet } from 'ethers'

const signer = new Wallet(privateKey)
let hop = new Hop()
// ...
const bridge = hop.bridge(Token.USDC).connect(signer)
```

##### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`signer` | *Signer* | Ethers `Signer` for signing transactions.   |

**Returns:** [*HopBridge*](#classeshopbridgemd)

___

#### getBonderFee

▸ **getBonderFee**(`amountIn`: *string*, `sourceChain`: [*Chain*](#classeschainmd), `destinationChain`: [*Chain*](#classeschainmd)): *Promise*<any\>

##### Parameters:

Name | Type |
:------ | :------ |
`amountIn` | *string* |
`sourceChain` | [*Chain*](#classeschainmd) |
`destinationChain` | [*Chain*](#classeschainmd) |

**Returns:** *Promise*<any\>

___

#### getErc20

▸ **getErc20**(`chain`: [*Chain*](#classeschainmd)): *Contract*

##### Parameters:

Name | Type |
:------ | :------ |
`chain` | [*Chain*](#classeschainmd) |

**Returns:** *Contract*

___

#### getL1Bridge

▸ **getL1Bridge**(`signer?`: *Signer*): *Contract*

##### Parameters:

Name | Type |
:------ | :------ |
`signer` | *Signer* |

**Returns:** *Contract*

___

#### getL2Bridge

▸ **getL2Bridge**(`chain`: [*Chain*](#classeschainmd), `signer?`: *Signer*): *Contract*

##### Parameters:

Name | Type |
:------ | :------ |
`chain` | [*Chain*](#classeschainmd) |
`signer` | *Signer* |

**Returns:** *Contract*

___

#### getSignerAddress

▸ **getSignerAddress**(): *Promise*<string\>

**Returns:** *Promise*<string\>

___

#### getUniswapExchange

▸ **getUniswapExchange**(`chain`: [*Chain*](#classeschainmd), `signer?`: *Signer*): *Contract*

##### Parameters:

Name | Type |
:------ | :------ |
`chain` | [*Chain*](#classeschainmd) |
`signer` | *Signer* |

**Returns:** *Contract*

___

#### getUniswapRouter

▸ **getUniswapRouter**(`chain`: [*Chain*](#classeschainmd), `signer?`: *Signer*): *Contract*

##### Parameters:

Name | Type |
:------ | :------ |
`chain` | [*Chain*](#classeschainmd) |
`signer` | *Signer* |

**Returns:** *Contract*

___

#### getUniswapWrapper

▸ **getUniswapWrapper**(`chain`: [*Chain*](#classeschainmd), `signer?`: *Signer*): *Contract*

##### Parameters:

Name | Type |
:------ | :------ |
`chain` | [*Chain*](#classeschainmd) |
`signer` | *Signer* |

**Returns:** *Contract*

___

#### send

▸ **send**(`tokenAmount`: *string* \| *BigNumber*, `sourceChain?`: [*Chain*](#classeschainmd), `destinationChain?`: [*Chain*](#classeschainmd)): *Promise*<any\>

**`desc`** Send tokens to another chain.

**`example`** 
```js
import { Hop, Token } from '@hop-protocol/sdk'

const hop = new Hop()
const bridge = hop.connect(signer).bridge(Token.USDC)
\// send 1 USDC token from Optimism -> xDai
const tx = await bridge.send('1000000000000000000', Chain.Optimism, Chain.xDai)
console.log(tx.hash)
```

##### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`tokenAmount` | *string* \| *BigNumber* | Token amount to send denominated in smallest unit.   |
`sourceChain?` | [*Chain*](#classeschainmd) | Source chain model.   |
`destinationChain?` | [*Chain*](#classeschainmd) | Destination chain model.   |

**Returns:** *Promise*<any\>


<a name="classesroutemd"></a>

## Class: Route

### Table of contents

#### Constructors

- [constructor](#constructor)

#### Properties

- [destination](#destination)
- [source](#source)

### Constructors

#### constructor

\+ **new Route**(`source`: [*Chain*](#classeschainmd), `destination`: [*Chain*](#classeschainmd)): [*Route*](#classesroutemd)

##### Parameters:

Name | Type |
:------ | :------ |
`source` | [*Chain*](#classeschainmd) |
`destination` | [*Chain*](#classeschainmd) |

**Returns:** [*Route*](#classesroutemd)

### Properties

#### destination

• `Readonly` **destination**: [*Chain*](#classeschainmd)

___

#### source

• `Readonly` **source**: [*Chain*](#classeschainmd)


<a name="classestokenmd"></a>

## Class: Token

### Table of contents

#### Constructors

- [constructor](#constructor)

#### Properties

- [address](#address)
- [chainId](#chainid)
- [decimals](#decimals)
- [name](#name)
- [symbol](#symbol)
- [DAI](#dai)
- [USDC](#usdc)

### Constructors

#### constructor

\+ **new Token**(`chainId`: *string* \| *number*, `address`: *string*, `decimals`: *number*, `symbol`: *string*, `name`: *string*): [*Token*](#classestokenmd)

##### Parameters:

Name | Type |
:------ | :------ |
`chainId` | *string* \| *number* |
`address` | *string* |
`decimals` | *number* |
`symbol` | *string* |
`name` | *string* |

**Returns:** [*Token*](#classestokenmd)

### Properties

#### address

• `Readonly` **address**: *string*

___

#### chainId

• `Readonly` **chainId**: *number*

___

#### decimals

• `Readonly` **decimals**: *number*= 18

___

#### name

• `Readonly` **name**: *string*= ''

___

#### symbol

• `Readonly` **symbol**: *string*= ''

___

#### DAI

▪ `Static` **DAI**: *string*= 'DAI'

___

#### USDC

▪ `Static` **USDC**: *string*= 'USDC'


<a name="classestokenamountmd"></a>

## Class: TokenAmount

### Table of contents

#### Constructors

- [constructor](#constructor)

#### Properties

- [amount](#amount)
- [token](#token)

### Constructors

#### constructor

\+ **new TokenAmount**(`token`: [*Token*](#classestokenmd), `amount`: *string*): [*TokenAmount*](#classestokenamountmd)

##### Parameters:

Name | Type |
:------ | :------ |
`token` | [*Token*](#classestokenmd) |
`amount` | *string* |

**Returns:** [*TokenAmount*](#classestokenamountmd)

### Properties

#### amount

• `Readonly` **amount**: *string*

___

#### token

• `Readonly` **token**: [*Token*](#classestokenmd)


<a name="classestransfermd"></a>

## Class: Transfer

### Table of contents

#### Constructors

- [constructor](#constructor)

#### Properties

- [route](#route)
- [tokenAmount](#tokenamount)

### Constructors

#### constructor

\+ **new Transfer**(`route`: [*Route*](#classesroutemd), `tokenAmount`: [*TokenAmount*](#classestokenamountmd)): [*Transfer*](#classestransfermd)

##### Parameters:

Name | Type |
:------ | :------ |
`route` | [*Route*](#classesroutemd) |
`tokenAmount` | [*TokenAmount*](#classestokenamountmd) |

**Returns:** [*Transfer*](#classestransfermd)

### Properties

#### route

• `Readonly` **route**: [*Route*](#classesroutemd)

___

#### tokenAmount

• `Readonly` **tokenAmount**: [*TokenAmount*](#classestokenamountmd)


<a name="modulesmd"></a>

# @hop-protocol/sdk

## Table of contents

### Namespaces

- [utils](#modulesutilsmd)

### Classes

- [Chain](#classeschainmd)
- [Hop](#classeshopmd)
- [HopBridge](#classeshopbridgemd)
- [Route](#classesroutemd)
- [Token](#classestokenmd)
- [TokenAmount](#classestokenamountmd)
- [Transfer](#classestransfermd)

# Modules


<a name="modulesutilsmd"></a>

## Namespace: utils

### Table of contents

#### Functions

- [wait](#wait)

### Functions

#### wait

▸ `Const`**wait**(`t`: *number*): *Promise*<unknown\>

##### Parameters:

Name | Type |
:------ | :------ |
`t` | *number* |

**Returns:** *Promise*<unknown\>
