# Class: HopBridge

Class reprensenting Hop bridge.

**`namespace`** HopBridge

## Table of contents

### Constructors

- [constructor](hopbridge.md#constructor)

### Properties

- [defaultDeadlineMinutes](hopbridge.md#defaultdeadlineminutes)
- [destinationChain](hopbridge.md#destinationchain)
- [signer](hopbridge.md#signer)
- [sourceChain](hopbridge.md#sourcechain)
- [token](hopbridge.md#token)

### Accessors

- [defaultDeadlineSeconds](hopbridge.md#defaultdeadlineseconds)

### Methods

- [\_calcAmountOut](hopbridge.md#_calcamountout)
- [connect](hopbridge.md#connect)
- [getBonderFee](hopbridge.md#getbonderfee)
- [getErc20](hopbridge.md#geterc20)
- [getL1Bridge](hopbridge.md#getl1bridge)
- [getL2Bridge](hopbridge.md#getl2bridge)
- [getSignerAddress](hopbridge.md#getsigneraddress)
- [getUniswapExchange](hopbridge.md#getuniswapexchange)
- [getUniswapRouter](hopbridge.md#getuniswaprouter)
- [getUniswapWrapper](hopbridge.md#getuniswapwrapper)
- [send](hopbridge.md#send)

## Constructors

### constructor

\+ **new HopBridge**(`signer`: *Signer*, `token`: *string* \| [*Token*](token.md), `sourceChain?`: [*Chain*](chain.md), `destinationChain?`: [*Chain*](chain.md)): [*HopBridge*](hopbridge.md)

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

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`signer` | *Signer* | Ethers `Signer` for signing transactions.   |
`token` | *string* \| [*Token*](token.md) | Token symbol or model   |
`sourceChain?` | [*Chain*](chain.md) | Source chain model   |
`destinationChain?` | [*Chain*](chain.md) | Destination chain model   |

**Returns:** [*HopBridge*](hopbridge.md)

## Properties

### defaultDeadlineMinutes

• **defaultDeadlineMinutes**: *number*= 30

Default deadline for transfers

___

### destinationChain

• **destinationChain**: [*Chain*](chain.md)

Destination Chain model

___

### signer

• **signer**: *Signer*

Ethers Signer

___

### sourceChain

• **sourceChain**: [*Chain*](chain.md)

Source Chain model

___

### token

• **token**: [*Token*](token.md)

Token model

## Accessors

### defaultDeadlineSeconds

• get **defaultDeadlineSeconds**(): *number*

**Returns:** *number*

## Methods

### \_calcAmountOut

▸ **_calcAmountOut**(`amount`: *string*, `isAmountIn`: *boolean*, `sourceChain`: [*Chain*](chain.md), `destinationChain`: [*Chain*](chain.md)): *Promise*<BigNumber\>

#### Parameters:

Name | Type |
:------ | :------ |
`amount` | *string* |
`isAmountIn` | *boolean* |
`sourceChain` | [*Chain*](chain.md) |
`destinationChain` | [*Chain*](chain.md) |

**Returns:** *Promise*<BigNumber\>

___

### connect

▸ **connect**(`signer`: *Signer*): [*HopBridge*](hopbridge.md)

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

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`signer` | *Signer* | Ethers `Signer` for signing transactions.   |

**Returns:** [*HopBridge*](hopbridge.md)

___

### getBonderFee

▸ **getBonderFee**(`amountIn`: *string*, `sourceChain`: [*Chain*](chain.md), `destinationChain`: [*Chain*](chain.md)): *Promise*<any\>

#### Parameters:

Name | Type |
:------ | :------ |
`amountIn` | *string* |
`sourceChain` | [*Chain*](chain.md) |
`destinationChain` | [*Chain*](chain.md) |

**Returns:** *Promise*<any\>

___

### getErc20

▸ **getErc20**(`chain`: [*Chain*](chain.md)): *Contract*

#### Parameters:

Name | Type |
:------ | :------ |
`chain` | [*Chain*](chain.md) |

**Returns:** *Contract*

___

### getL1Bridge

▸ **getL1Bridge**(`signer?`: *Signer*): *Contract*

#### Parameters:

Name | Type |
:------ | :------ |
`signer` | *Signer* |

**Returns:** *Contract*

___

### getL2Bridge

▸ **getL2Bridge**(`chain`: [*Chain*](chain.md), `signer?`: *Signer*): *Contract*

#### Parameters:

Name | Type |
:------ | :------ |
`chain` | [*Chain*](chain.md) |
`signer` | *Signer* |

**Returns:** *Contract*

___

### getSignerAddress

▸ **getSignerAddress**(): *Promise*<string\>

**Returns:** *Promise*<string\>

___

### getUniswapExchange

▸ **getUniswapExchange**(`chain`: [*Chain*](chain.md), `signer?`: *Signer*): *Contract*

#### Parameters:

Name | Type |
:------ | :------ |
`chain` | [*Chain*](chain.md) |
`signer` | *Signer* |

**Returns:** *Contract*

___

### getUniswapRouter

▸ **getUniswapRouter**(`chain`: [*Chain*](chain.md), `signer?`: *Signer*): *Contract*

#### Parameters:

Name | Type |
:------ | :------ |
`chain` | [*Chain*](chain.md) |
`signer` | *Signer* |

**Returns:** *Contract*

___

### getUniswapWrapper

▸ **getUniswapWrapper**(`chain`: [*Chain*](chain.md), `signer?`: *Signer*): *Contract*

#### Parameters:

Name | Type |
:------ | :------ |
`chain` | [*Chain*](chain.md) |
`signer` | *Signer* |

**Returns:** *Contract*

___

### send

▸ **send**(`tokenAmount`: *string* \| *BigNumber*, `sourceChain?`: [*Chain*](chain.md), `destinationChain?`: [*Chain*](chain.md)): *Promise*<any\>

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

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`tokenAmount` | *string* \| *BigNumber* | Token amount to send denominated in smallest unit.   |
`sourceChain?` | [*Chain*](chain.md) | Source chain model.   |
`destinationChain?` | [*Chain*](chain.md) | Destination chain model.   |

**Returns:** *Promise*<any\>
