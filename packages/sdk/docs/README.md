<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Classes](#classes)
  - [Class: AMM](#class-amm)
    - [Hierarchy](#hierarchy)
    - [Table of contents](#table-of-contents)
    - [Constructors](#constructors)
    - [Properties](#properties)
    - [Accessors](#accessors)
    - [Methods](#methods)
  - [Class: CanonicalBridge](#class-canonicalbridge)
    - [Hierarchy](#hierarchy-1)
    - [Table of contents](#table-of-contents-1)
    - [Constructors](#constructors-1)
    - [Properties](#properties-1)
    - [Accessors](#accessors-1)
    - [Methods](#methods-1)
  - [Class: Chain](#class-chain)
    - [Table of contents](#table-of-contents-2)
    - [Constructors](#constructors-2)
    - [Properties](#properties-2)
    - [Accessors](#accessors-2)
    - [Methods](#methods-2)
  - [Class: Hop](#class-hop)
    - [Hierarchy](#hierarchy-2)
    - [Table of contents](#table-of-contents-3)
    - [Constructors](#constructors-3)
    - [Properties](#properties-3)
    - [Accessors](#accessors-3)
    - [Methods](#methods-3)
  - [Class: HopBridge](#class-hopbridge)
    - [Hierarchy](#hierarchy-3)
    - [Table of contents](#table-of-contents-4)
    - [Constructors](#constructors-4)
    - [Properties](#properties-4)
    - [Accessors](#accessors-4)
    - [Methods](#methods-4)
  - [Class: Route](#class-route)
    - [Table of contents](#table-of-contents-5)
    - [Constructors](#constructors-5)
    - [Properties](#properties-5)
  - [Class: Token](#class-token)
    - [Hierarchy](#hierarchy-4)
    - [Table of contents](#table-of-contents-6)
    - [Constructors](#constructors-6)
    - [Properties](#properties-6)
    - [Accessors](#accessors-5)
    - [Methods](#methods-5)
  - [Class: TokenAmount](#class-tokenamount)
    - [Table of contents](#table-of-contents-7)
    - [Constructors](#constructors-7)
    - [Properties](#properties-7)
  - [Class: Transfer](#class-transfer)
    - [Table of contents](#table-of-contents-8)
    - [Constructors](#constructors-8)
    - [Properties](#properties-8)
- [@hop-protocol/sdk](#hop-protocolsdk)
  - [Table of contents](#table-of-contents-9)
    - [Namespaces](#namespaces)
    - [Classes](#classes-1)
    - [Type aliases](#type-aliases)
  - [Type aliases](#type-aliases-1)
    - [TAmount](#tamount)
    - [TChain](#tchain)
    - [TProvider](#tprovider)
    - [TToken](#ttoken)
- [Modules](#modules)
  - [Namespace: utils](#namespace-utils)
    - [Table of contents](#table-of-contents-10)
    - [Functions](#functions)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<a name="readmemd"></a>

# Classes

<a name="classesammmd"></a>

## Class: AMM

Class reprensenting AMM contract

**`namespace`** AMM

### Hierarchy

- `Base`

  ↳ **`AMM`**

### Table of contents

#### Constructors

- [constructor](#constructor)

#### Properties

- [chain](#chain)
- [getContract](#getcontract)
- [network](#network)
- [signer](#signer)
- [tokenSymbol](#tokensymbol)

#### Accessors

- [defaultDeadlineSeconds](#defaultdeadlineseconds)
- [supportedChains](#supportedchains)
- [supportedNetworks](#supportednetworks)

#### Methods

- [addLiquidity](#addliquidity)
- [calculateFromHToken](#calculatefromhtoken)
- [calculateToHToken](#calculatetohtoken)
- [connect](#connect)
- [getArbChainAddress](#getarbchainaddress)
- [getBonderAddress](#getbonderaddress)
- [getBonderAddresses](#getbonderaddresses)
- [getBumpedGasPrice](#getbumpedgasprice)
- [getCanonicalTokenAddress](#getcanonicaltokenaddress)
- [getChainId](#getchainid)
- [getChainProvider](#getchainprovider)
- [getConfigAddresses](#getconfigaddresses)
- [getHopTokenAddress](#gethoptokenaddress)
- [getL1AmbBridgeAddress](#getl1ambbridgeaddress)
- [getL1BridgeAddress](#getl1bridgeaddress)
- [getL1CanonicalBridgeAddress](#getl1canonicalbridgeaddress)
- [getL1CanonicalTokenAddress](#getl1canonicaltokenaddress)
- [getL1PosErc20PredicateAddress](#getl1poserc20predicateaddress)
- [getL1PosRootChainManagerAddress](#getl1posrootchainmanageraddress)
- [getL2AmbBridgeAddress](#getl2ambbridgeaddress)
- [getL2AmmWrapperAddress](#getl2ammwrapperaddress)
- [getL2BridgeAddress](#getl2bridgeaddress)
- [getL2CanonicalBridgeAddress](#getl2canonicalbridgeaddress)
- [getL2CanonicalTokenAddress](#getl2canonicaltokenaddress)
- [getL2HopBridgeTokenAddress](#getl2hopbridgetokenaddress)
- [getL2SaddleLpTokenAddress](#getl2saddlelptokenaddress)
- [getL2SaddleSwapAddress](#getl2saddleswapaddress)
- [getSaddleSwap](#getsaddleswap)
- [getSignerAddress](#getsigneraddress)
- [getSignerOrProvider](#getsignerorprovider)
- [isValidChain](#isvalidchain)
- [isValidNetwork](#isvalidnetwork)
- [removeLiquidity](#removeliquidity)
- [setConfigAddresses](#setconfigaddresses)
- [toChainModel](#tochainmodel)
- [toTokenModel](#totokenmodel)
- [txOverrides](#txoverrides)

### Constructors

#### constructor

• **new AMM**(`network`, `tokenSymbol`, `chain?`, `signer?`)

**`desc`** Instantiates AMM instance.
Returns a new Hop AMM SDK instance.

**`example`**

```js
import { AMM, Token, Chain } from '@hop-protocol/sdk'

const amm = new AMM('mainnet', Token.USDC, Chain.xDai)
```

##### Parameters

| Name          | Type                      | Description                                         |
| :------------ | :------------------------ | :-------------------------------------------------- |
| `network`     | `string`                  | L1 network name (e.g. 'mainnet', 'kovan', 'goerli') |
| `tokenSymbol` | `string`                  | -                                                   |
| `chain?`      | [`TChain`](#tchain)       | Chain model                                         |
| `signer?`     | [`TProvider`](#tprovider) | Ethers `Signer` for signing transactions.           |

##### Overrides

Base.constructor

### Properties

#### chain

• **chain**: [`Chain`](#classeschainmd)

Chain model

---

#### getContract

• **getContract**: (`address`: `string`, `abi`: `any`[], `provider`: [`TProvider`](#tprovider)) => `Promise`<`Contract`\>

##### Type declaration

▸ (`address`, `abi`, `provider`): `Promise`<`Contract`\>

###### Parameters

| Name       | Type                      |
| :--------- | :------------------------ |
| `address`  | `string`                  |
| `abi`      | `any`[]                   |
| `provider` | [`TProvider`](#tprovider) |

###### Returns

`Promise`<`Contract`\>

##### Inherited from

Base.getContract

---

#### network

• **network**: `string`

Network name

##### Inherited from

Base.network

---

#### signer

• **signer**: [`TProvider`](#tprovider)

Ethers signer or provider

##### Inherited from

Base.signer

---

#### tokenSymbol

• **tokenSymbol**: `string`

Token class instance

### Accessors

#### defaultDeadlineSeconds

• `get` **defaultDeadlineSeconds**(): `number`

**`readonly`**

**`desc`** The default deadline to use in seconds.

##### Returns

`number`

Deadline in seconds

---

#### supportedChains

• `get` **supportedChains**(): `string`[]

##### Returns

`string`[]

---

#### supportedNetworks

• `get` **supportedNetworks**(): `string`[]

##### Returns

`string`[]

### Methods

#### addLiquidity

▸ **addLiquidity**(`amount0Desired`, `amount1Desired`, `minToMint?`, `deadline?`): `Promise`<`any`\>

**`desc`** Sends transaction to add liquidity to AMM.

**`example`**

```js
import { AMM } from '@hop-protocol/sdk'

const amm = new AMM(...)
const tx = await amm.addLiquidity('1000000000000000000', '1000000000000000000', '0')
console.log(tx.hash)
```

##### Parameters

| Name             | Type           | Default value | Description                                                                   |
| :--------------- | :------------- | :------------ | :---------------------------------------------------------------------------- |
| `amount0Desired` | `BigNumberish` | `undefined`   | Amount of token #0 in smallest unit                                           |
| `amount1Desired` | `BigNumberish` | `undefined`   | Amount of token #1 in smallest unit                                           |
| `minToMint`      | `BigNumberish` | `0`           | Minimum amount of LP token to mint in order for transaction to be successful. |
| `deadline`       | `number`       | `undefined`   | Order deadline in seconds                                                     |

##### Returns

`Promise`<`any`\>

Ethers transaction object.

---

#### calculateFromHToken

▸ **calculateFromHToken**(`amount`): `Promise`<`any`\>

##### Parameters

| Name     | Type           |
| :------- | :------------- |
| `amount` | `BigNumberish` |

##### Returns

`Promise`<`any`\>

---

#### calculateToHToken

▸ **calculateToHToken**(`amount`): `Promise`<`any`\>

##### Parameters

| Name     | Type           |
| :------- | :------------- |
| `amount` | `BigNumberish` |

##### Returns

`Promise`<`any`\>

---

#### connect

▸ **connect**(`signer`): [`AMM`](#classesammmd)

**`desc`** Returns hop AMM instance with signer connected. Used for adding or changing signer.

**`example`**

```js
import { AMM } from '@hop-protocol/sdk'

const signer = new Wallet(privateKey)
let amm = new AMM(...)
// ...
amm = amm.connect(signer)
```

##### Parameters

| Name     | Type                      | Description                               |
| :------- | :------------------------ | :---------------------------------------- |
| `signer` | [`TProvider`](#tprovider) | Ethers `Signer` for signing transactions. |

##### Returns

[`AMM`](#classesammmd)

Hop AMM instance with connected signer.

---

#### getArbChainAddress

▸ **getArbChainAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getArbChainAddress

---

#### getBonderAddress

▸ **getBonderAddress**(): `string`

##### Returns

`string`

##### Inherited from

Base.getBonderAddress

---

#### getBonderAddresses

▸ **getBonderAddresses**(): `string`[]

##### Returns

`string`[]

##### Inherited from

Base.getBonderAddresses

---

#### getBumpedGasPrice

▸ **getBumpedGasPrice**(`signer`, `percent`): `Promise`<`BigNumber`\>

**`desc`** Calculates current gas price plus increased percentage amount.

**`example`**

```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
const bumpedGasPrice = await hop.getBumpedGasPrice(signer, 1.2)
console.log(bumpedGasPrice.toNumber())
```

##### Parameters

| Name      | Type                      |
| :-------- | :------------------------ |
| `signer`  | [`TProvider`](#tprovider) |
| `percent` | `number`                  |

##### Returns

`Promise`<`BigNumber`\>

Bumped as price as BigNumber

##### Inherited from

Base.getBumpedGasPrice

---

#### getCanonicalTokenAddress

▸ **getCanonicalTokenAddress**(): `Promise`<`any`\>

**`desc`** Returns the address of the L2 canonical token.

##### Returns

`Promise`<`any`\>

address

---

#### getChainId

▸ **getChainId**(`chain`): `number`

**`desc`** Returns Chain ID for specified Chain model.

##### Parameters

| Name    | Type                       |
| :------ | :------------------------- |
| `chain` | [`Chain`](#classeschainmd) |

##### Returns

`number`

- Chain ID.

##### Inherited from

Base.getChainId

---

#### getChainProvider

▸ **getChainProvider**(`chain`): `Provider`

**`desc`** Returns Ethers provider for specified Chain model.

##### Parameters

| Name    | Type                       |
| :------ | :------------------------- |
| `chain` | [`Chain`](#classeschainmd) |

##### Returns

`Provider`

- Ethers provider.

##### Inherited from

Base.getChainProvider

---

#### getConfigAddresses

▸ **getConfigAddresses**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getConfigAddresses

---

#### getHopTokenAddress

▸ **getHopTokenAddress**(): `Promise`<`any`\>

**`desc`** Returns the address of the L2 hop token.

##### Returns

`Promise`<`any`\>

address

---

#### getL1AmbBridgeAddress

▸ **getL1AmbBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1AmbBridgeAddress

---

#### getL1BridgeAddress

▸ **getL1BridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1BridgeAddress

---

#### getL1CanonicalBridgeAddress

▸ **getL1CanonicalBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1CanonicalBridgeAddress

---

#### getL1CanonicalTokenAddress

▸ **getL1CanonicalTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1CanonicalTokenAddress

---

#### getL1PosErc20PredicateAddress

▸ **getL1PosErc20PredicateAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1PosErc20PredicateAddress

---

#### getL1PosRootChainManagerAddress

▸ **getL1PosRootChainManagerAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1PosRootChainManagerAddress

---

#### getL2AmbBridgeAddress

▸ **getL2AmbBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2AmbBridgeAddress

---

#### getL2AmmWrapperAddress

▸ **getL2AmmWrapperAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2AmmWrapperAddress

---

#### getL2BridgeAddress

▸ **getL2BridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2BridgeAddress

---

#### getL2CanonicalBridgeAddress

▸ **getL2CanonicalBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2CanonicalBridgeAddress

---

#### getL2CanonicalTokenAddress

▸ **getL2CanonicalTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2CanonicalTokenAddress

---

#### getL2HopBridgeTokenAddress

▸ **getL2HopBridgeTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2HopBridgeTokenAddress

---

#### getL2SaddleLpTokenAddress

▸ **getL2SaddleLpTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2SaddleLpTokenAddress

---

#### getL2SaddleSwapAddress

▸ **getL2SaddleSwapAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2SaddleSwapAddress

---

#### getSaddleSwap

▸ **getSaddleSwap**(): `Promise`<`Contract`\>

**`desc`** Returns the Saddle swap contract instance for the specified chain.

##### Returns

`Promise`<`Contract`\>

Ethers contract instance.

---

#### getSignerAddress

▸ **getSignerAddress**(): `Promise`<`string`\>

**`desc`** Returns the connected signer address.

**`example`**

```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
const address = await hop.getSignerAddress()
console.log(address)
```

##### Returns

`Promise`<`string`\>

Ethers signer address.

##### Inherited from

Base.getSignerAddress

---

#### getSignerOrProvider

▸ **getSignerOrProvider**(`chain`, `signer?`): `Promise`<`Signer` \| `Provider`\>

**`desc`** Returns the connected signer if it's connected to the specified
chain id, otherwise it returns a regular provider for the specified chain.

##### Parameters

| Name     | Type                      | Description               |
| :------- | :------------------------ | :------------------------ |
| `chain`  | [`TChain`](#tchain)       | Chain name or model       |
| `signer` | [`TProvider`](#tprovider) | Ethers signer or provider |

##### Returns

`Promise`<`Signer` \| `Provider`\>

Ethers signer or provider

##### Inherited from

Base.getSignerOrProvider

---

#### isValidChain

▸ **isValidChain**(`chain`): `boolean`

##### Parameters

| Name    | Type     |
| :------ | :------- |
| `chain` | `string` |

##### Returns

`boolean`

##### Inherited from

Base.isValidChain

---

#### isValidNetwork

▸ **isValidNetwork**(`network`): `boolean`

##### Parameters

| Name      | Type     |
| :-------- | :------- |
| `network` | `string` |

##### Returns

`boolean`

##### Inherited from

Base.isValidNetwork

---

#### removeLiquidity

▸ **removeLiquidity**(`liqudityTokenAmount`, `amount0Min?`, `amount1Min?`, `deadline?`): `Promise`<`any`\>

**`desc`** Sends transaction to remove liquidity from AMM.

**`example`**

```js
import { AMM } from '@hop-protocol/sdk'

const amm = new AMM(...)
const tx = await amm.removeLiquidity('1000000000000000000', '0', '0')
console.log(tx.hash)
```

##### Parameters

| Name                  | Type           | Default value | Description                                                                                                    |
| :-------------------- | :------------- | :------------ | :------------------------------------------------------------------------------------------------------------- |
| `liqudityTokenAmount` | `BigNumberish` | `undefined`   | Amount of LP tokens to burn.                                                                                   |
| `amount0Min`          | `BigNumberish` | `0`           | Minimum amount of token #0 to receive in order for transaction to be successful.                               |
| `amount1Min`          | `BigNumberish` | `0`           | Minimum amount of token #1 to receive in order for transaction to be successful. transaction to be successful. |
| `deadline`            | `number`       | `undefined`   | Order deadline in seconds                                                                                      |

##### Returns

`Promise`<`any`\>

Ethers transaction object.

---

#### setConfigAddresses

▸ **setConfigAddresses**(`addresses`): `void`

##### Parameters

| Name        | Type        |
| :---------- | :---------- |
| `addresses` | `Addresses` |

##### Returns

`void`

##### Inherited from

Base.setConfigAddresses

---

#### toChainModel

▸ **toChainModel**(`chain`): [`Chain`](#classeschainmd)

**`desc`** Returns a Chain model instance with connected provider.

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `chain` | [`TChain`](#tchain) |

##### Returns

[`Chain`](#classeschainmd)

- Chain model with connected provider.

##### Inherited from

Base.toChainModel

---

#### toTokenModel

▸ **toTokenModel**(`token`): `Token`

**`desc`** Returns a Token instance.

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |

##### Returns

`Token`

- Token model.

##### Inherited from

Base.toTokenModel

---

#### txOverrides

▸ **txOverrides**(`chain`): `any`

##### Parameters

| Name    | Type                       |
| :------ | :------------------------- |
| `chain` | [`Chain`](#classeschainmd) |

##### Returns

`any`

##### Inherited from

Base.txOverrides

<a name="classescanonicalbridgemd"></a>

## Class: CanonicalBridge

Class reprensenting Canonical Token Bridge.

**`namespace`** CanonicalBridge

### Hierarchy

- `Base`

  ↳ **`CanonicalBridge`**

### Table of contents

#### Constructors

- [constructor](#constructor)

#### Properties

- [chain](#chain)
- [getContract](#getcontract)
- [network](#network)
- [signer](#signer)
- [tokenSymbol](#tokensymbol)

#### Accessors

- [address](#address)
- [supportedChains](#supportedchains)
- [supportedNetworks](#supportednetworks)

#### Methods

- [approveDeposit](#approvedeposit)
- [approveWithdraw](#approvewithdraw)
- [connect](#connect)
- [deposit](#deposit)
- [exit](#exit)
- [getAmbBridge](#getambbridge)
- [getArbChainAddress](#getarbchainaddress)
- [getBonderAddress](#getbonderaddress)
- [getBonderAddresses](#getbonderaddresses)
- [getBumpedGasPrice](#getbumpedgasprice)
- [getCanonicalToken](#getcanonicaltoken)
- [getChainId](#getchainid)
- [getChainProvider](#getchainprovider)
- [getConfigAddresses](#getconfigaddresses)
- [getDepositApprovalAddress](#getdepositapprovaladdress)
- [getL1AmbBridgeAddress](#getl1ambbridgeaddress)
- [getL1BridgeAddress](#getl1bridgeaddress)
- [getL1CanonicalBridge](#getl1canonicalbridge)
- [getL1CanonicalBridgeAddress](#getl1canonicalbridgeaddress)
- [getL1CanonicalTokenAddress](#getl1canonicaltokenaddress)
- [getL1PosErc20PredicateAddress](#getl1poserc20predicateaddress)
- [getL1PosRootChainManagerAddress](#getl1posrootchainmanageraddress)
- [getL1Token](#getl1token)
- [getL2AmbBridgeAddress](#getl2ambbridgeaddress)
- [getL2AmmWrapperAddress](#getl2ammwrapperaddress)
- [getL2BridgeAddress](#getl2bridgeaddress)
- [getL2CanonicalBridge](#getl2canonicalbridge)
- [getL2CanonicalBridgeAddress](#getl2canonicalbridgeaddress)
- [getL2CanonicalTokenAddress](#getl2canonicaltokenaddress)
- [getL2HopBridgeTokenAddress](#getl2hopbridgetokenaddress)
- [getL2HopToken](#getl2hoptoken)
- [getL2SaddleLpTokenAddress](#getl2saddlelptokenaddress)
- [getL2SaddleSwapAddress](#getl2saddleswapaddress)
- [getSignerAddress](#getsigneraddress)
- [getSignerOrProvider](#getsignerorprovider)
- [getWithdrawApprovalAddress](#getwithdrawapprovaladdress)
- [isValidChain](#isvalidchain)
- [isValidNetwork](#isvalidnetwork)
- [setConfigAddresses](#setconfigaddresses)
- [toCanonicalToken](#tocanonicaltoken)
- [toChainModel](#tochainmodel)
- [toHopToken](#tohoptoken)
- [toTokenModel](#totokenmodel)
- [txOverrides](#txoverrides)
- [withdraw](#withdraw)

### Constructors

#### constructor

• **new CanonicalBridge**(`network`, `signer`, `token`, `chain`)

**`desc`** Instantiates Canonical Token Bridge.
Returns a new Canonical Token Bridge instance.

**`example`**

```js
import { CanonicalHop, Chain, Token } from '@hop-protocol/sdk'
import { Wallet } from 'ethers'

const signer = new Wallet(privateKey)
const bridge = new CanonicalBridge('kovan', signer, Token.USDC, Chain.Optimism)
```

##### Parameters

| Name      | Type                      | Description                                         |
| :-------- | :------------------------ | :-------------------------------------------------- |
| `network` | `string`                  | L1 network name (e.g. 'mainnet', 'kovan', 'goerli') |
| `signer`  | [`TProvider`](#tprovider) | Ethers `Signer` for signing transactions.           |
| `token`   | [`TToken`](#ttoken)       | Token symbol or model                               |
| `chain`   | [`TChain`](#tchain)       | Chain model                                         |

##### Overrides

Base.constructor

### Properties

#### chain

• **chain**: [`Chain`](#classeschainmd)

Chain model

---

#### getContract

• **getContract**: (`address`: `string`, `abi`: `any`[], `provider`: [`TProvider`](#tprovider)) => `Promise`<`Contract`\>

##### Type declaration

▸ (`address`, `abi`, `provider`): `Promise`<`Contract`\>

###### Parameters

| Name       | Type                      |
| :--------- | :------------------------ |
| `address`  | `string`                  |
| `abi`      | `any`[]                   |
| `provider` | [`TProvider`](#tprovider) |

###### Returns

`Promise`<`Contract`\>

##### Inherited from

Base.getContract

---

#### network

• **network**: `string`

Network name

##### Inherited from

Base.network

---

#### signer

• **signer**: [`TProvider`](#tprovider)

Ethers signer or provider

##### Inherited from

Base.signer

---

#### tokenSymbol

• **tokenSymbol**: `string`

Token class instance

### Accessors

#### address

• `get` **address**(): `any`

**`desc`** Return address of L1 canonical token bridge.

##### Returns

`any`

L1 canonical token bridge address

---

#### supportedChains

• `get` **supportedChains**(): `string`[]

##### Returns

`string`[]

---

#### supportedNetworks

• `get` **supportedNetworks**(): `string`[]

##### Returns

`string`[]

### Methods

#### approveDeposit

▸ **approveDeposit**(`amount`, `chain?`): `Promise`<`any`\>

**`desc`** Sends transaction to approve tokens for canonical token bridge deposit.
Will only send approval transaction if necessary.

##### Parameters

| Name     | Type                | Description              |
| :------- | :------------------ | :----------------------- |
| `amount` | `BigNumberish`      | Token amount to approve. |
| `chain?` | [`TChain`](#tchain) | Chain model.             |

##### Returns

`Promise`<`any`\>

Ethers transaction object.

---

#### approveWithdraw

▸ **approveWithdraw**(`amount`): `Promise`<`any`\>

**`desc`** Sends transaction to approve tokens for canonical token bridge withdrawal.
Will only send approval transaction if necessary.

##### Parameters

| Name     | Type           | Description              |
| :------- | :------------- | :----------------------- |
| `amount` | `BigNumberish` | Token amount to approve. |

##### Returns

`Promise`<`any`\>

Ethers transaction object.

---

#### connect

▸ **connect**(`signer`): [`CanonicalBridge`](#classescanonicalbridgemd)

**`desc`** Returns canonical bridge instance with signer connected. Used for adding or changing signer.

##### Parameters

| Name     | Type                      | Description                               |
| :------- | :------------------------ | :---------------------------------------- |
| `signer` | [`TProvider`](#tprovider) | Ethers `Signer` for signing transactions. |

##### Returns

[`CanonicalBridge`](#classescanonicalbridgemd)

New CanonicalBridge SDK instance with connected signer.

---

#### deposit

▸ **deposit**(`amount`, `chain?`): `Promise`<`any`\>

**`desc`** Sends transaction to canonical token bridge to deposit tokens into L2.

##### Parameters

| Name     | Type                | Description              |
| :------- | :------------------ | :----------------------- |
| `amount` | `BigNumberish`      | Token amount to deposit. |
| `chain?` | [`TChain`](#tchain) | Chain model.             |

##### Returns

`Promise`<`any`\>

Ethers transaction object.

---

#### exit

▸ **exit**(`txHash`, `chain`): `Promise`<`any`\>

**`desc`** Sends transaction to finalize withdrawal.
This call is necessary on Polygon to finalize L2 withdrawal into L1 on
certain chains. Will only send transaction if necessary.

##### Parameters

| Name     | Type                | Description                                |
| :------- | :------------------ | :----------------------------------------- |
| `txHash` | `string`            | Transaction hash proving token burn on L2. |
| `chain`  | [`TChain`](#tchain) | Chain model.                               |

##### Returns

`Promise`<`any`\>

Ethers transaction object.

---

#### getAmbBridge

▸ **getAmbBridge**(`chain?`): `Promise`<`Contract`\>

##### Parameters

| Name     | Type                |
| :------- | :------------------ |
| `chain?` | [`TChain`](#tchain) |

##### Returns

`Promise`<`Contract`\>

---

#### getArbChainAddress

▸ **getArbChainAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getArbChainAddress

---

#### getBonderAddress

▸ **getBonderAddress**(): `string`

##### Returns

`string`

##### Inherited from

Base.getBonderAddress

---

#### getBonderAddresses

▸ **getBonderAddresses**(): `string`[]

##### Returns

`string`[]

##### Inherited from

Base.getBonderAddresses

---

#### getBumpedGasPrice

▸ **getBumpedGasPrice**(`signer`, `percent`): `Promise`<`BigNumber`\>

**`desc`** Calculates current gas price plus increased percentage amount.

**`example`**

```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
const bumpedGasPrice = await hop.getBumpedGasPrice(signer, 1.2)
console.log(bumpedGasPrice.toNumber())
```

##### Parameters

| Name      | Type                      |
| :-------- | :------------------------ |
| `signer`  | [`TProvider`](#tprovider) |
| `percent` | `number`                  |

##### Returns

`Promise`<`BigNumber`\>

Bumped as price as BigNumber

##### Inherited from

Base.getBumpedGasPrice

---

#### getCanonicalToken

▸ **getCanonicalToken**(`chain`): [`Token`](#classestokenmd)

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `chain` | [`TChain`](#tchain) |

##### Returns

[`Token`](#classestokenmd)

---

#### getChainId

▸ **getChainId**(`chain`): `number`

**`desc`** Returns Chain ID for specified Chain model.

##### Parameters

| Name    | Type                       |
| :------ | :------------------------- |
| `chain` | [`Chain`](#classeschainmd) |

##### Returns

`number`

- Chain ID.

##### Inherited from

Base.getChainId

---

#### getChainProvider

▸ **getChainProvider**(`chain`): `Provider`

**`desc`** Returns Ethers provider for specified Chain model.

##### Parameters

| Name    | Type                       |
| :------ | :------------------------- |
| `chain` | [`Chain`](#classeschainmd) |

##### Returns

`Provider`

- Ethers provider.

##### Inherited from

Base.getChainProvider

---

#### getConfigAddresses

▸ **getConfigAddresses**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getConfigAddresses

---

#### getDepositApprovalAddress

▸ **getDepositApprovalAddress**(`chain?`): `string`

##### Parameters

| Name     | Type                |
| :------- | :------------------ |
| `chain?` | [`TChain`](#tchain) |

##### Returns

`string`

---

#### getL1AmbBridgeAddress

▸ **getL1AmbBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1AmbBridgeAddress

---

#### getL1BridgeAddress

▸ **getL1BridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1BridgeAddress

---

#### getL1CanonicalBridge

▸ **getL1CanonicalBridge**(): `Promise`<`Contract`\>

##### Returns

`Promise`<`Contract`\>

---

#### getL1CanonicalBridgeAddress

▸ **getL1CanonicalBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1CanonicalBridgeAddress

---

#### getL1CanonicalTokenAddress

▸ **getL1CanonicalTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1CanonicalTokenAddress

---

#### getL1PosErc20PredicateAddress

▸ **getL1PosErc20PredicateAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1PosErc20PredicateAddress

---

#### getL1PosRootChainManagerAddress

▸ **getL1PosRootChainManagerAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1PosRootChainManagerAddress

---

#### getL1Token

▸ **getL1Token**(): [`Token`](#classestokenmd)

##### Returns

[`Token`](#classestokenmd)

---

#### getL2AmbBridgeAddress

▸ **getL2AmbBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2AmbBridgeAddress

---

#### getL2AmmWrapperAddress

▸ **getL2AmmWrapperAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2AmmWrapperAddress

---

#### getL2BridgeAddress

▸ **getL2BridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2BridgeAddress

---

#### getL2CanonicalBridge

▸ **getL2CanonicalBridge**(): `Promise`<`Contract`\>

##### Returns

`Promise`<`Contract`\>

---

#### getL2CanonicalBridgeAddress

▸ **getL2CanonicalBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2CanonicalBridgeAddress

---

#### getL2CanonicalTokenAddress

▸ **getL2CanonicalTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2CanonicalTokenAddress

---

#### getL2HopBridgeTokenAddress

▸ **getL2HopBridgeTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2HopBridgeTokenAddress

---

#### getL2HopToken

▸ **getL2HopToken**(`chain`): [`Token`](#classestokenmd)

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `chain` | [`TChain`](#tchain) |

##### Returns

[`Token`](#classestokenmd)

---

#### getL2SaddleLpTokenAddress

▸ **getL2SaddleLpTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2SaddleLpTokenAddress

---

#### getL2SaddleSwapAddress

▸ **getL2SaddleSwapAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2SaddleSwapAddress

---

#### getSignerAddress

▸ **getSignerAddress**(): `Promise`<`string`\>

**`desc`** Returns the connected signer address.

**`example`**

```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
const address = await hop.getSignerAddress()
console.log(address)
```

##### Returns

`Promise`<`string`\>

Ethers signer address.

##### Inherited from

Base.getSignerAddress

---

#### getSignerOrProvider

▸ **getSignerOrProvider**(`chain`, `signer?`): `Promise`<`Signer` \| `Provider`\>

**`desc`** Returns the connected signer if it's connected to the specified
chain id, otherwise it returns a regular provider for the specified chain.

##### Parameters

| Name     | Type                      | Description               |
| :------- | :------------------------ | :------------------------ |
| `chain`  | [`TChain`](#tchain)       | Chain name or model       |
| `signer` | [`TProvider`](#tprovider) | Ethers signer or provider |

##### Returns

`Promise`<`Signer` \| `Provider`\>

Ethers signer or provider

##### Inherited from

Base.getSignerOrProvider

---

#### getWithdrawApprovalAddress

▸ **getWithdrawApprovalAddress**(`chain?`): `string`

##### Parameters

| Name     | Type                |
| :------- | :------------------ |
| `chain?` | [`TChain`](#tchain) |

##### Returns

`string`

---

#### isValidChain

▸ **isValidChain**(`chain`): `boolean`

##### Parameters

| Name    | Type     |
| :------ | :------- |
| `chain` | `string` |

##### Returns

`boolean`

##### Inherited from

Base.isValidChain

---

#### isValidNetwork

▸ **isValidNetwork**(`network`): `boolean`

##### Parameters

| Name      | Type     |
| :-------- | :------- |
| `network` | `string` |

##### Returns

`boolean`

##### Inherited from

Base.isValidNetwork

---

#### setConfigAddresses

▸ **setConfigAddresses**(`addresses`): `void`

##### Parameters

| Name        | Type        |
| :---------- | :---------- |
| `addresses` | `Addresses` |

##### Returns

`void`

##### Inherited from

Base.setConfigAddresses

---

#### toCanonicalToken

▸ **toCanonicalToken**(`token`, `network`, `chain`): [`Token`](#classestokenmd)

##### Parameters

| Name      | Type                |
| :-------- | :------------------ |
| `token`   | [`TToken`](#ttoken) |
| `network` | `string`            |
| `chain`   | [`TChain`](#tchain) |

##### Returns

[`Token`](#classestokenmd)

---

#### toChainModel

▸ **toChainModel**(`chain`): [`Chain`](#classeschainmd)

**`desc`** Returns a Chain model instance with connected provider.

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `chain` | [`TChain`](#tchain) |

##### Returns

[`Chain`](#classeschainmd)

- Chain model with connected provider.

##### Inherited from

Base.toChainModel

---

#### toHopToken

▸ **toHopToken**(`token`, `network`, `chain`): [`Token`](#classestokenmd)

##### Parameters

| Name      | Type                |
| :-------- | :------------------ |
| `token`   | [`TToken`](#ttoken) |
| `network` | `string`            |
| `chain`   | [`TChain`](#tchain) |

##### Returns

[`Token`](#classestokenmd)

---

#### toTokenModel

▸ **toTokenModel**(`token`): `Token`

**`desc`** Returns a Token instance.

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |

##### Returns

`Token`

- Token model.

##### Inherited from

Base.toTokenModel

---

#### txOverrides

▸ **txOverrides**(`chain`): `any`

##### Parameters

| Name    | Type                       |
| :------ | :------------------------- |
| `chain` | [`Chain`](#classeschainmd) |

##### Returns

`any`

##### Inherited from

Base.txOverrides

---

#### withdraw

▸ **withdraw**(`amount`, `chain?`): `Promise`<`any`\>

**`desc`** Sends transaction to L2 canonical token bridge to withdraw tokens into L1.

##### Parameters

| Name     | Type                | Description               |
| :------- | :------------------ | :------------------------ |
| `amount` | `BigNumberish`      | Token amount to withdraw. |
| `chain?` | [`TChain`](#tchain) | Chain model.              |

##### Returns

`Promise`<`any`\>

Ethers transaction object.

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
- [Ethereum](#ethereum)
- [Optimism](#optimism)
- [Polygon](#polygon)
- [xDai](#xdai)

#### Accessors

- [rpcUrl](#rpcurl)

#### Methods

- [equals](#equals)
- [fromSlug](#fromslug)

### Constructors

#### constructor

• **new Chain**(`name`, `chainId?`, `provider?`)

##### Parameters

| Name        | Type                 |
| :---------- | :------------------- |
| `name`      | `string`             |
| `chainId?`  | `string` \| `number` |
| `provider?` | `Provider`           |

### Properties

#### chainId

• **chainId**: `number`

---

#### isL1

• **isL1**: `boolean` = `false`

---

#### name

• **name**: `string` = `''`

---

#### provider

• **provider**: `Provider` = `null`

---

#### slug

• **slug**: `string` = `''`

---

#### Arbitrum

▪ `Static` **Arbitrum**: [`Chain`](#classeschainmd)

---

#### Ethereum

▪ `Static` **Ethereum**: [`Chain`](#classeschainmd)

---

#### Optimism

▪ `Static` **Optimism**: [`Chain`](#classeschainmd)

---

#### Polygon

▪ `Static` **Polygon**: [`Chain`](#classeschainmd)

---

#### xDai

▪ `Static` **xDai**: [`Chain`](#classeschainmd)

### Accessors

#### rpcUrl

• `get` **rpcUrl**(): `any`

##### Returns

`any`

### Methods

#### equals

▸ **equals**(`other`): `boolean`

##### Parameters

| Name    | Type                       |
| :------ | :------------------------- |
| `other` | [`Chain`](#classeschainmd) |

##### Returns

`boolean`

---

#### fromSlug

▸ `Static` **fromSlug**(`slug`): [`Chain`](#classeschainmd)

##### Parameters

| Name   | Type     |
| :----- | :------- |
| `slug` | `string` |

##### Returns

[`Chain`](#classeschainmd)

<a name="classeshopmd"></a>

## Class: Hop

Class reprensenting Hop

**`namespace`** Hop

### Hierarchy

- `Base`

  ↳ **`Hop`**

### Table of contents

#### Constructors

- [constructor](#constructor)

#### Properties

- [Chain](#chain)
- [Event](#event)
- [Token](#token)
- [getContract](#getcontract)
- [network](#network)
- [signer](#signer)
- [Chain](#chain)
- [Event](#event)
- [Token](#token)

#### Accessors

- [supportedChains](#supportedchains)
- [supportedNetworks](#supportednetworks)
- [version](#version)

#### Methods

- [bridge](#bridge)
- [canonicalBridge](#canonicalbridge)
- [connect](#connect)
- [getArbChainAddress](#getarbchainaddress)
- [getBonderAddress](#getbonderaddress)
- [getBonderAddresses](#getbonderaddresses)
- [getBumpedGasPrice](#getbumpedgasprice)
- [getChainId](#getchainid)
- [getChainProvider](#getchainprovider)
- [getConfigAddresses](#getconfigaddresses)
- [getL1AmbBridgeAddress](#getl1ambbridgeaddress)
- [getL1BridgeAddress](#getl1bridgeaddress)
- [getL1CanonicalBridgeAddress](#getl1canonicalbridgeaddress)
- [getL1CanonicalTokenAddress](#getl1canonicaltokenaddress)
- [getL1PosErc20PredicateAddress](#getl1poserc20predicateaddress)
- [getL1PosRootChainManagerAddress](#getl1posrootchainmanageraddress)
- [getL2AmbBridgeAddress](#getl2ambbridgeaddress)
- [getL2AmmWrapperAddress](#getl2ammwrapperaddress)
- [getL2BridgeAddress](#getl2bridgeaddress)
- [getL2CanonicalBridgeAddress](#getl2canonicalbridgeaddress)
- [getL2CanonicalTokenAddress](#getl2canonicaltokenaddress)
- [getL2HopBridgeTokenAddress](#getl2hopbridgetokenaddress)
- [getL2SaddleLpTokenAddress](#getl2saddlelptokenaddress)
- [getL2SaddleSwapAddress](#getl2saddleswapaddress)
- [getSignerAddress](#getsigneraddress)
- [getSignerOrProvider](#getsignerorprovider)
- [isValidChain](#isvalidchain)
- [isValidNetwork](#isvalidnetwork)
- [setConfigAddresses](#setconfigaddresses)
- [toChainModel](#tochainmodel)
- [toTokenModel](#totokenmodel)
- [txOverrides](#txoverrides)
- [watch](#watch)
- [watchBridge](#watchbridge)
- [watchCanonical](#watchcanonical)

### Constructors

#### constructor

• **new Hop**(`network?`, `signer?`)

**`desc`** Instantiates Hop SDK.
Returns a new Hop SDK instance.

**`example`**

```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop('mainnet')
```

**`example`**

```js
import { Hop } from '@hop-protocol/sdk'
import { Wallet } from 'ethers'

const signer = new Wallet(privateKey)
const hop = new Hop('mainnet', signer)
```

##### Parameters

| Name      | Type                      | Description                                         |
| :-------- | :------------------------ | :-------------------------------------------------- |
| `network` | `string`                  | L1 network name (e.g. 'mainnet', 'kovan', 'goerli') |
| `signer?` | [`TProvider`](#tprovider) | Ethers `Signer` for signing transactions.           |

##### Overrides

Base.constructor

### Properties

#### Chain

• **Chain**: typeof [`Chain`](#classeschainmd)

Chain class

---

#### Event

• **Event**: typeof `Event`

Event enum

---

#### Token

• **Token**: typeof `Token`

Token class

---

#### getContract

• **getContract**: (`address`: `string`, `abi`: `any`[], `provider`: [`TProvider`](#tprovider)) => `Promise`<`Contract`\>

##### Type declaration

▸ (`address`, `abi`, `provider`): `Promise`<`Contract`\>

###### Parameters

| Name       | Type                      |
| :--------- | :------------------------ |
| `address`  | `string`                  |
| `abi`      | `any`[]                   |
| `provider` | [`TProvider`](#tprovider) |

###### Returns

`Promise`<`Contract`\>

##### Inherited from

Base.getContract

---

#### network

• **network**: `string`

Network name

##### Inherited from

Base.network

---

#### signer

• **signer**: [`TProvider`](#tprovider)

Ethers signer or provider

##### Inherited from

Base.signer

---

#### Chain

▪ `Static` **Chain**: typeof [`Chain`](#classeschainmd)

Chain class

---

#### Event

▪ `Static` **Event**: typeof `Event`

Event enum

---

#### Token

▪ `Static` **Token**: typeof `Token`

Token class

### Accessors

#### supportedChains

• `get` **supportedChains**(): `string`[]

##### Returns

`string`[]

---

#### supportedNetworks

• `get` **supportedNetworks**(): `string`[]

##### Returns

`string`[]

---

#### version

• `get` **version**(): `string`

**`desc`** Returns the SDK version.

**`example`**

```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
console.log(hop.version)
```

##### Returns

`string`

version string

### Methods

#### bridge

▸ **bridge**(`token`): [`HopBridge`](#classeshopbridgemd)

**`desc`** Returns a bridge set instance.

**`example`**

```js
import { Hop, Token } from '@hop-protocol/sdk'

const hop = new Hop()
const bridge = hop.bridge(Token.USDC)
```

##### Parameters

| Name    | Type                | Description                                      |
| :------ | :------------------ | :----------------------------------------------- |
| `token` | [`TToken`](#ttoken) | Token model or symbol of token of bridge to use. |

##### Returns

[`HopBridge`](#classeshopbridgemd)

A HopBridge instance.

---

#### canonicalBridge

▸ **canonicalBridge**(`token`, `chain?`): [`CanonicalBridge`](#classescanonicalbridgemd)

**`desc`** Returns a canonical bridge sdk instance.

**`example`**

```js
import { Hop, Token } from '@hop-protocol/sdk'

const hop = new Hop()
const bridge = hop.canonicalBridge(Token.USDC)
```

##### Parameters

| Name     | Type                | Description                                                |
| :------- | :------------------ | :--------------------------------------------------------- |
| `token`  | [`TToken`](#ttoken) | Token model or symbol of token of canonical bridge to use. |
| `chain?` | [`TChain`](#tchain) | Chain model.                                               |

##### Returns

[`CanonicalBridge`](#classescanonicalbridgemd)

A CanonicalBridge instance.

---

#### connect

▸ **connect**(`signer`): [`Hop`](#classeshopmd)

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

##### Parameters

| Name     | Type                      | Description                               |
| :------- | :------------------------ | :---------------------------------------- |
| `signer` | [`TProvider`](#tprovider) | Ethers `Signer` for signing transactions. |

##### Returns

[`Hop`](#classeshopmd)

A new Hop SDK instance with connected Ethers Signer.

---

#### getArbChainAddress

▸ **getArbChainAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getArbChainAddress

---

#### getBonderAddress

▸ **getBonderAddress**(): `string`

##### Returns

`string`

##### Inherited from

Base.getBonderAddress

---

#### getBonderAddresses

▸ **getBonderAddresses**(): `string`[]

##### Returns

`string`[]

##### Inherited from

Base.getBonderAddresses

---

#### getBumpedGasPrice

▸ **getBumpedGasPrice**(`signer`, `percent`): `Promise`<`BigNumber`\>

**`desc`** Calculates current gas price plus increased percentage amount.

**`example`**

```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
const bumpedGasPrice = await hop.getBumpedGasPrice(signer, 1.2)
console.log(bumpedGasPrice.toNumber())
```

##### Parameters

| Name      | Type                      |
| :-------- | :------------------------ |
| `signer`  | [`TProvider`](#tprovider) |
| `percent` | `number`                  |

##### Returns

`Promise`<`BigNumber`\>

Bumped as price as BigNumber

##### Inherited from

Base.getBumpedGasPrice

---

#### getChainId

▸ **getChainId**(`chain`): `number`

**`desc`** Returns Chain ID for specified Chain model.

##### Parameters

| Name    | Type                       |
| :------ | :------------------------- |
| `chain` | [`Chain`](#classeschainmd) |

##### Returns

`number`

- Chain ID.

##### Inherited from

Base.getChainId

---

#### getChainProvider

▸ **getChainProvider**(`chain`): `Provider`

**`desc`** Returns Ethers provider for specified Chain model.

##### Parameters

| Name    | Type                       |
| :------ | :------------------------- |
| `chain` | [`Chain`](#classeschainmd) |

##### Returns

`Provider`

- Ethers provider.

##### Inherited from

Base.getChainProvider

---

#### getConfigAddresses

▸ **getConfigAddresses**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getConfigAddresses

---

#### getL1AmbBridgeAddress

▸ **getL1AmbBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1AmbBridgeAddress

---

#### getL1BridgeAddress

▸ **getL1BridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1BridgeAddress

---

#### getL1CanonicalBridgeAddress

▸ **getL1CanonicalBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1CanonicalBridgeAddress

---

#### getL1CanonicalTokenAddress

▸ **getL1CanonicalTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1CanonicalTokenAddress

---

#### getL1PosErc20PredicateAddress

▸ **getL1PosErc20PredicateAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1PosErc20PredicateAddress

---

#### getL1PosRootChainManagerAddress

▸ **getL1PosRootChainManagerAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1PosRootChainManagerAddress

---

#### getL2AmbBridgeAddress

▸ **getL2AmbBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2AmbBridgeAddress

---

#### getL2AmmWrapperAddress

▸ **getL2AmmWrapperAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2AmmWrapperAddress

---

#### getL2BridgeAddress

▸ **getL2BridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2BridgeAddress

---

#### getL2CanonicalBridgeAddress

▸ **getL2CanonicalBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2CanonicalBridgeAddress

---

#### getL2CanonicalTokenAddress

▸ **getL2CanonicalTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2CanonicalTokenAddress

---

#### getL2HopBridgeTokenAddress

▸ **getL2HopBridgeTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2HopBridgeTokenAddress

---

#### getL2SaddleLpTokenAddress

▸ **getL2SaddleLpTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2SaddleLpTokenAddress

---

#### getL2SaddleSwapAddress

▸ **getL2SaddleSwapAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2SaddleSwapAddress

---

#### getSignerAddress

▸ **getSignerAddress**(): `Promise`<`string`\>

**`desc`** Returns the connected signer address.

**`example`**

```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
const address = await hop.getSignerAddress()
console.log(address)
```

##### Returns

`Promise`<`string`\>

Ethers signer address.

##### Overrides

Base.getSignerAddress

---

#### getSignerOrProvider

▸ **getSignerOrProvider**(`chain`, `signer?`): `Promise`<`Signer` \| `Provider`\>

**`desc`** Returns the connected signer if it's connected to the specified
chain id, otherwise it returns a regular provider for the specified chain.

##### Parameters

| Name     | Type                      | Description               |
| :------- | :------------------------ | :------------------------ |
| `chain`  | [`TChain`](#tchain)       | Chain name or model       |
| `signer` | [`TProvider`](#tprovider) | Ethers signer or provider |

##### Returns

`Promise`<`Signer` \| `Provider`\>

Ethers signer or provider

##### Inherited from

Base.getSignerOrProvider

---

#### isValidChain

▸ **isValidChain**(`chain`): `boolean`

##### Parameters

| Name    | Type     |
| :------ | :------- |
| `chain` | `string` |

##### Returns

`boolean`

##### Inherited from

Base.isValidChain

---

#### isValidNetwork

▸ **isValidNetwork**(`network`): `boolean`

##### Parameters

| Name      | Type     |
| :-------- | :------- |
| `network` | `string` |

##### Returns

`boolean`

##### Inherited from

Base.isValidNetwork

---

#### setConfigAddresses

▸ **setConfigAddresses**(`addresses`): `void`

##### Parameters

| Name        | Type        |
| :---------- | :---------- |
| `addresses` | `Addresses` |

##### Returns

`void`

##### Inherited from

Base.setConfigAddresses

---

#### toChainModel

▸ **toChainModel**(`chain`): [`Chain`](#classeschainmd)

**`desc`** Returns a Chain model instance with connected provider.

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `chain` | [`TChain`](#tchain) |

##### Returns

[`Chain`](#classeschainmd)

- Chain model with connected provider.

##### Inherited from

Base.toChainModel

---

#### toTokenModel

▸ **toTokenModel**(`token`): `Token`

**`desc`** Returns a Token instance.

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |

##### Returns

`Token`

- Token model.

##### Inherited from

Base.toTokenModel

---

#### txOverrides

▸ **txOverrides**(`chain`): `any`

##### Parameters

| Name    | Type                       |
| :------ | :------------------------- |
| `chain` | [`Chain`](#classeschainmd) |

##### Returns

`any`

##### Inherited from

Base.txOverrides

---

#### watch

▸ **watch**(`txHash`, `token`, `sourceChain`, `destinationChain`, `isCanonicalTransfer?`, `options?`): `any`

**`desc`** Watches for Hop transaction events.

**`example`**

```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
hop
  .watch(tx.hash, Token.USDC, Chain.Ethereum, Chain.xDai)
  .on('receipt', ({ receipt, chain }) => {
    console.log(chain.Name, receipt)
  })
```

##### Parameters

| Name                  | Type                | Default value | Description                      |
| :-------------------- | :------------------ | :------------ | :------------------------------- |
| `txHash`              | `string`            | `undefined`   | Source transaction hash.         |
| `token`               | [`TToken`](#ttoken) | `undefined`   | Token name or model.             |
| `sourceChain`         | [`TChain`](#tchain) | `undefined`   | Source chain name or model.      |
| `destinationChain`    | [`TChain`](#tchain) | `undefined`   | Destination chain name or model. |
| `isCanonicalTransfer` | `boolean`           | `false`       | -                                |
| `options`             | `WatchOptions`      | `{}`          | -                                |

##### Returns

`any`

---

#### watchBridge

▸ **watchBridge**(`txHash`, `token`, `sourceChain`, `destinationChain`, `options?`): `any`

##### Parameters

| Name               | Type                |
| :----------------- | :------------------ |
| `txHash`           | `string`            |
| `token`            | [`TToken`](#ttoken) |
| `sourceChain`      | [`TChain`](#tchain) |
| `destinationChain` | [`TChain`](#tchain) |
| `options`          | `WatchOptions`      |

##### Returns

`any`

---

#### watchCanonical

▸ **watchCanonical**(`txHash`, `token`, `sourceChain`, `destinationChain`): `any`

##### Parameters

| Name               | Type                |
| :----------------- | :------------------ |
| `txHash`           | `string`            |
| `token`            | [`TToken`](#ttoken) |
| `sourceChain`      | [`TChain`](#tchain) |
| `destinationChain` | [`TChain`](#tchain) |

##### Returns

`any`

<a name="classeshopbridgemd"></a>

## Class: HopBridge

Class reprensenting Hop bridge.

**`namespace`** HopBridge

### Hierarchy

- `Base`

  ↳ **`HopBridge`**

### Table of contents

#### Constructors

- [constructor](#constructor)

#### Properties

- [defaultDeadlineMinutes](#defaultdeadlineminutes)
- [destinationChain](#destinationchain)
- [getContract](#getcontract)
- [network](#network)
- [signer](#signer)
- [sourceChain](#sourcechain)

#### Accessors

- [defaultDeadlineSeconds](#defaultdeadlineseconds)
- [supportedChains](#supportedchains)
- [supportedNetworks](#supportednetworks)

#### Methods

- [addLiquidity](#addliquidity)
- [approveAndSend](#approveandsend)
- [connect](#connect)
- [execSaddleSwap](#execsaddleswap)
- [getAmbBridge](#getambbridge)
- [getAmm](#getamm)
- [getAmmData](#getammdata)
- [getAmmWrapper](#getammwrapper)
- [getAmountOut](#getamountout)
- [getArbChainAddress](#getarbchainaddress)
- [getAvailableLiquidity](#getavailableliquidity)
- [getBonderAddress](#getbonderaddress)
- [getBonderAddresses](#getbonderaddresses)
- [getBonderFee](#getbonderfee)
- [getBridgeContract](#getbridgecontract)
- [getBumpedGasPrice](#getbumpedgasprice)
- [getCanonicalToken](#getcanonicaltoken)
- [getChainId](#getchainid)
- [getChainProvider](#getchainprovider)
- [getConfigAddresses](#getconfigaddresses)
- [getCredit](#getcredit)
- [getDebit](#getdebit)
- [getL1AmbBridgeAddress](#getl1ambbridgeaddress)
- [getL1Bridge](#getl1bridge)
- [getL1BridgeAddress](#getl1bridgeaddress)
- [getL1CanonicalBridgeAddress](#getl1canonicalbridgeaddress)
- [getL1CanonicalTokenAddress](#getl1canonicaltokenaddress)
- [getL1PosErc20PredicateAddress](#getl1poserc20predicateaddress)
- [getL1PosRootChainManagerAddress](#getl1posrootchainmanageraddress)
- [getL1Token](#getl1token)
- [getL1TransactionFee](#getl1transactionfee)
- [getL2AmbBridgeAddress](#getl2ambbridgeaddress)
- [getL2AmmWrapperAddress](#getl2ammwrapperaddress)
- [getL2Bridge](#getl2bridge)
- [getL2BridgeAddress](#getl2bridgeaddress)
- [getL2CanonicalBridgeAddress](#getl2canonicalbridgeaddress)
- [getL2CanonicalTokenAddress](#getl2canonicaltokenaddress)
- [getL2HopBridgeTokenAddress](#getl2hopbridgetokenaddress)
- [getL2HopToken](#getl2hoptoken)
- [getL2SaddleLpTokenAddress](#getl2saddlelptokenaddress)
- [getL2SaddleSwapAddress](#getl2saddleswapaddress)
- [getLpFees](#getlpfees)
- [getMinBonderFee](#getminbonderfee)
- [getRequiredLiquidity](#getrequiredliquidity)
- [getSaddleLpToken](#getsaddlelptoken)
- [getSaddleSwapReserves](#getsaddleswapreserves)
- [getSendApprovalAddress](#getsendapprovaladdress)
- [getSendData](#getsenddata)
- [getSignerAddress](#getsigneraddress)
- [getSignerOrProvider](#getsignerorprovider)
- [getTokenImage](#gettokenimage)
- [getTokenSymbol](#gettokensymbol)
- [isValidChain](#isvalidchain)
- [isValidNetwork](#isvalidnetwork)
- [removeLiquidity](#removeliquidity)
- [send](#send)
- [sendHToken](#sendhtoken)
- [setConfigAddresses](#setconfigaddresses)
- [toCanonicalToken](#tocanonicaltoken)
- [toChainModel](#tochainmodel)
- [toHopToken](#tohoptoken)
- [toTokenModel](#totokenmodel)
- [txOverrides](#txoverrides)

### Constructors

#### constructor

• **new HopBridge**(`network`, `signer`, `token`)

**`desc`** Instantiates Hop Bridge.
Returns a new Hop Bridge instance.

**`example`**

```js
import { HopBridge, Chain, Token } from '@hop-protocol/sdk'
import { Wallet } from 'ethers'

const signer = new Wallet(privateKey)
const bridge = new HopBridge(
  'kovan',
  signer,
  Token.USDC,
  Chain.Optimism,
  Chain.xDai
)
```

##### Parameters

| Name      | Type                      | Description                                         |
| :-------- | :------------------------ | :-------------------------------------------------- |
| `network` | `string`                  | L1 network name (e.g. 'mainnet', 'kovan', 'goerli') |
| `signer`  | [`TProvider`](#tprovider) | Ethers `Signer` for signing transactions.           |
| `token`   | [`TToken`](#ttoken)       | Token symbol or model                               |

##### Overrides

Base.constructor

### Properties

#### defaultDeadlineMinutes

• **defaultDeadlineMinutes**: `number` = `30`

Default deadline for transfers

---

#### destinationChain

• **destinationChain**: [`Chain`](#classeschainmd)

Destination Chain model

---

#### getContract

• **getContract**: (`address`: `string`, `abi`: `any`[], `provider`: [`TProvider`](#tprovider)) => `Promise`<`Contract`\>

##### Type declaration

▸ (`address`, `abi`, `provider`): `Promise`<`Contract`\>

###### Parameters

| Name       | Type                      |
| :--------- | :------------------------ |
| `address`  | `string`                  |
| `abi`      | `any`[]                   |
| `provider` | [`TProvider`](#tprovider) |

###### Returns

`Promise`<`Contract`\>

##### Inherited from

Base.getContract

---

#### network

• **network**: `string`

Network name

##### Inherited from

Base.network

---

#### signer

• **signer**: [`TProvider`](#tprovider)

Ethers signer or provider

##### Inherited from

Base.signer

---

#### sourceChain

• **sourceChain**: [`Chain`](#classeschainmd)

Source Chain model

### Accessors

#### defaultDeadlineSeconds

• `get` **defaultDeadlineSeconds**(): `number`

**`readonly`**

**`desc`** The default deadline to use in seconds.

##### Returns

`number`

Deadline in seconds

---

#### supportedChains

• `get` **supportedChains**(): `string`[]

##### Returns

`string`[]

---

#### supportedNetworks

• `get` **supportedNetworks**(): `string`[]

##### Returns

`string`[]

### Methods

#### addLiquidity

▸ **addLiquidity**(`amount0Desired`, `amount1Desired`, `chain?`, `options?`): `Promise`<`any`\>

**`desc`** Sends transaction to add liquidity to AMM.

##### Parameters

| Name             | Type                              | Description                                       |
| :--------------- | :-------------------------------- | :------------------------------------------------ |
| `amount0Desired` | `BigNumberish`                    | Amount of token #0 in smallest unit               |
| `amount1Desired` | `BigNumberish`                    | Amount of token #1 in smallest unit               |
| `chain?`         | [`TChain`](#tchain)               | Chain model of desired chain to add liquidity to. |
| `options`        | `Partial`<`AddLiquidityOptions`\> | Method options.                                   |

##### Returns

`Promise`<`any`\>

Ethers transaction object.

---

#### approveAndSend

▸ **approveAndSend**(`tokenAmount`, `sourceChain?`, `destinationChain?`, `options?`): `Promise`<`any`\>

**`desc`** Approve and send tokens to another chain. This will make an approval
transaction if not enough allowance.

**`example`**

```js
import { Hop, Token } from '@hop-protocol/sdk'

const hop = new Hop()
const bridge = hop.connect(signer).bridge(Token.USDC)
\ // send 1 USDC token from Optimism -> xDai
const tx = await bridge.send('1000000000000000000', Chain.Optimism, Chain.xDai)
console.log(tx.hash)
```

##### Parameters

| Name                | Type                      | Description                                        |
| :------------------ | :------------------------ | :------------------------------------------------- |
| `tokenAmount`       | `BigNumberish`            | Token amount to send denominated in smallest unit. |
| `sourceChain?`      | [`TChain`](#tchain)       | Source chain model.                                |
| `destinationChain?` | [`TChain`](#tchain)       | Destination chain model.                           |
| `options?`          | `Partial`<`SendOptions`\> | -                                                  |

##### Returns

`Promise`<`any`\>

Ethers Transaction object.

---

#### connect

▸ **connect**(`signer`): [`HopBridge`](#classeshopbridgemd)

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

##### Parameters

| Name     | Type     | Description                               |
| :------- | :------- | :---------------------------------------- |
| `signer` | `Signer` | Ethers `Signer` for signing transactions. |

##### Returns

[`HopBridge`](#classeshopbridgemd)

New HopBridge SDK instance with connected signer.

---

#### execSaddleSwap

▸ **execSaddleSwap**(`sourceChain`, `toHop`, `amount`, `minAmountOut`, `deadline`): `Promise`<`any`\>

**`desc`** Sends transaction to execute swap on Saddle contract.

##### Parameters

| Name           | Type                | Description                                                                    |
| :------------- | :------------------ | :----------------------------------------------------------------------------- |
| `sourceChain`  | [`TChain`](#tchain) | Source chain model.                                                            |
| `toHop`        | `boolean`           | Converts to Hop token only if set to true.                                     |
| `amount`       | `BigNumberish`      | Amount of token to swap.                                                       |
| `minAmountOut` | `BigNumberish`      | Minimum amount of tokens to receive in order for transaction to be successful. |
| `deadline`     | `number`            | Transaction deadline in seconds.                                               |

##### Returns

`Promise`<`any`\>

Ethers transaction object.

---

#### getAmbBridge

▸ **getAmbBridge**(`chain`): `Promise`<`Contract`\>

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `chain` | [`TChain`](#tchain) |

##### Returns

`Promise`<`Contract`\>

---

#### getAmm

▸ **getAmm**(`chain`): [`AMM`](#classesammmd)

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `chain` | [`TChain`](#tchain) |

##### Returns

[`AMM`](#classesammmd)

---

#### getAmmData

▸ **getAmmData**(`chain`, `amountIn`, `isToHToken`, `slippageTolerance`): `Promise`<`Object`\>

##### Parameters

| Name                | Type                |
| :------------------ | :------------------ |
| `chain`             | [`TChain`](#tchain) |
| `amountIn`          | `BigNumberish`      |
| `isToHToken`        | `boolean`           |
| `slippageTolerance` | `number`            |

##### Returns

`Promise`<`Object`\>

---

#### getAmmWrapper

▸ **getAmmWrapper**(`chain`, `signer?`): `Promise`<`Contract`\>

**`desc`** Returns Hop Bridge AMM wrapper Ethers contract instance.

##### Parameters

| Name     | Type                      | Description   |
| :------- | :------------------------ | :------------ |
| `chain`  | [`TChain`](#tchain)       | Chain model.  |
| `signer` | [`TProvider`](#tprovider) | Ethers signer |

##### Returns

`Promise`<`Contract`\>

Ethers contract instance.

---

#### getAmountOut

▸ **getAmountOut**(`tokenAmountIn`, `sourceChain?`, `destinationChain?`): `Promise`<`BigNumber`\>

**`desc`** Estimate token amount out.

**`example`**

```js
import { Hop, Chain Token } from '@hop-protocol/sdk'

const hop = new Hop()
const bridge = hop.connect(signer).bridge(Token.USDC)
const amountOut = await bridge.getAmountOut('1000000000000000000', Chain.Optimism, Chain.xDai)
console.log(amountOut)
```

##### Parameters

| Name                | Type                | Description              |
| :------------------ | :------------------ | :----------------------- |
| `tokenAmountIn`     | `BigNumberish`      | Token amount input.      |
| `sourceChain?`      | [`TChain`](#tchain) | Source chain model.      |
| `destinationChain?` | [`TChain`](#tchain) | Destination chain model. |

##### Returns

`Promise`<`BigNumber`\>

Amount as BigNumber.

---

#### getArbChainAddress

▸ **getArbChainAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getArbChainAddress

---

#### getAvailableLiquidity

▸ **getAvailableLiquidity**(`destinationChain`, `bonder?`): `Promise`<`BigNumber`\>

**`desc`** Returns available liquidity for Hop bridge at specified chain.

##### Parameters

| Name               | Type                | Description              |
| :----------------- | :------------------ | :----------------------- |
| `destinationChain` | [`TChain`](#tchain) | Destination chain model. |
| `bonder`           | `string`            | -                        |

##### Returns

`Promise`<`BigNumber`\>

Available liquidity as BigNumber.

---

#### getBonderAddress

▸ **getBonderAddress**(): `string`

##### Returns

`string`

##### Inherited from

Base.getBonderAddress

---

#### getBonderAddresses

▸ **getBonderAddresses**(): `string`[]

##### Returns

`string`[]

##### Inherited from

Base.getBonderAddresses

---

#### getBonderFee

▸ **getBonderFee**(`amountIn`, `sourceChain`, `destinationChain`): `Promise`<`BigNumber`\>

##### Parameters

| Name               | Type                |
| :----------------- | :------------------ |
| `amountIn`         | `BigNumberish`      |
| `sourceChain`      | [`TChain`](#tchain) |
| `destinationChain` | [`TChain`](#tchain) |

##### Returns

`Promise`<`BigNumber`\>

---

#### getBridgeContract

▸ **getBridgeContract**(`chain`): `Promise`<`Contract`\>

**`desc`** Returns bridge contract instance for specified chain.

##### Parameters

| Name    | Type                | Description  |
| :------ | :------------------ | :----------- |
| `chain` | [`TChain`](#tchain) | chain model. |

##### Returns

`Promise`<`Contract`\>

Ethers contract instance.

---

#### getBumpedGasPrice

▸ **getBumpedGasPrice**(`signer`, `percent`): `Promise`<`BigNumber`\>

**`desc`** Calculates current gas price plus increased percentage amount.

**`example`**

```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
const bumpedGasPrice = await hop.getBumpedGasPrice(signer, 1.2)
console.log(bumpedGasPrice.toNumber())
```

##### Parameters

| Name      | Type                      |
| :-------- | :------------------------ |
| `signer`  | [`TProvider`](#tprovider) |
| `percent` | `number`                  |

##### Returns

`Promise`<`BigNumber`\>

Bumped as price as BigNumber

##### Inherited from

Base.getBumpedGasPrice

---

#### getCanonicalToken

▸ **getCanonicalToken**(`chain`): [`Token`](#classestokenmd)

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `chain` | [`TChain`](#tchain) |

##### Returns

[`Token`](#classestokenmd)

---

#### getChainId

▸ **getChainId**(`chain`): `number`

**`desc`** Returns Chain ID for specified Chain model.

##### Parameters

| Name    | Type                       |
| :------ | :------------------------- |
| `chain` | [`Chain`](#classeschainmd) |

##### Returns

`number`

- Chain ID.

##### Inherited from

Base.getChainId

---

#### getChainProvider

▸ **getChainProvider**(`chain`): `Provider`

**`desc`** Returns Ethers provider for specified Chain model.

##### Parameters

| Name    | Type                       |
| :------ | :------------------------- |
| `chain` | [`Chain`](#classeschainmd) |

##### Returns

`Provider`

- Ethers provider.

##### Inherited from

Base.getChainProvider

---

#### getConfigAddresses

▸ **getConfigAddresses**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getConfigAddresses

---

#### getCredit

▸ **getCredit**(`chain`, `bonder?`): `Promise`<`BigNumber`\>

**`desc`** Returns total credit that bonder holds on Hop bridge at specified chain.

##### Parameters

| Name     | Type                | Description  |
| :------- | :------------------ | :----------- |
| `chain`  | [`TChain`](#tchain) | Chain model. |
| `bonder` | `string`            | -            |

##### Returns

`Promise`<`BigNumber`\>

Total credit as BigNumber.

---

#### getDebit

▸ **getDebit**(`chain`, `bonder?`): `Promise`<`BigNumber`\>

**`desc`** Returns total debit that bonder holds on Hop bridge at specified chain.

##### Parameters

| Name     | Type                | Description  |
| :------- | :------------------ | :----------- |
| `chain`  | [`TChain`](#tchain) | Chain model. |
| `bonder` | `string`            | -            |

##### Returns

`Promise`<`BigNumber`\>

Total debit as BigNumber.

---

#### getL1AmbBridgeAddress

▸ **getL1AmbBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1AmbBridgeAddress

---

#### getL1Bridge

▸ **getL1Bridge**(`signer?`): `Promise`<`Contract`\>

**`desc`** Returns Hop L1 Bridge Ethers contract instance.

##### Parameters

| Name     | Type                      | Description   |
| :------- | :------------------------ | :------------ |
| `signer` | [`TProvider`](#tprovider) | Ethers signer |

##### Returns

`Promise`<`Contract`\>

Ethers contract instance.

---

#### getL1BridgeAddress

▸ **getL1BridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1BridgeAddress

---

#### getL1CanonicalBridgeAddress

▸ **getL1CanonicalBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1CanonicalBridgeAddress

---

#### getL1CanonicalTokenAddress

▸ **getL1CanonicalTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1CanonicalTokenAddress

---

#### getL1PosErc20PredicateAddress

▸ **getL1PosErc20PredicateAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1PosErc20PredicateAddress

---

#### getL1PosRootChainManagerAddress

▸ **getL1PosRootChainManagerAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1PosRootChainManagerAddress

---

#### getL1Token

▸ **getL1Token**(): [`Token`](#classestokenmd)

##### Returns

[`Token`](#classestokenmd)

---

#### getL1TransactionFee

▸ **getL1TransactionFee**(`sourceChain`, `destinationChain`): `Promise`<`BigNumber`\>

##### Parameters

| Name               | Type                |
| :----------------- | :------------------ |
| `sourceChain`      | [`TChain`](#tchain) |
| `destinationChain` | [`TChain`](#tchain) |

##### Returns

`Promise`<`BigNumber`\>

---

#### getL2AmbBridgeAddress

▸ **getL2AmbBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2AmbBridgeAddress

---

#### getL2AmmWrapperAddress

▸ **getL2AmmWrapperAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2AmmWrapperAddress

---

#### getL2Bridge

▸ **getL2Bridge**(`chain`, `signer?`): `Promise`<`Contract`\>

**`desc`** Returns Hop L2 Bridge Ethers contract instance.

##### Parameters

| Name     | Type                      | Description   |
| :------- | :------------------------ | :------------ |
| `chain`  | [`TChain`](#tchain)       | Chain model.  |
| `signer` | [`TProvider`](#tprovider) | Ethers signer |

##### Returns

`Promise`<`Contract`\>

Ethers contract instance.

---

#### getL2BridgeAddress

▸ **getL2BridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2BridgeAddress

---

#### getL2CanonicalBridgeAddress

▸ **getL2CanonicalBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2CanonicalBridgeAddress

---

#### getL2CanonicalTokenAddress

▸ **getL2CanonicalTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2CanonicalTokenAddress

---

#### getL2HopBridgeTokenAddress

▸ **getL2HopBridgeTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2HopBridgeTokenAddress

---

#### getL2HopToken

▸ **getL2HopToken**(`chain`): [`Token`](#classestokenmd)

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `chain` | [`TChain`](#tchain) |

##### Returns

[`Token`](#classestokenmd)

---

#### getL2SaddleLpTokenAddress

▸ **getL2SaddleLpTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2SaddleLpTokenAddress

---

#### getL2SaddleSwapAddress

▸ **getL2SaddleSwapAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2SaddleSwapAddress

---

#### getLpFees

▸ **getLpFees**(`amountIn`, `sourceChain`, `destinationChain`): `Promise`<`BigNumber`\>

##### Parameters

| Name               | Type                |
| :----------------- | :------------------ |
| `amountIn`         | `BigNumberish`      |
| `sourceChain`      | [`TChain`](#tchain) |
| `destinationChain` | [`TChain`](#tchain) |

##### Returns

`Promise`<`BigNumber`\>

---

#### getMinBonderFee

▸ **getMinBonderFee**(`amountIn`, `sourceChain`, `destinationChain`): `Promise`<`any`\>

**`desc`** Returns the suggested bonder fee.

##### Parameters

| Name               | Type                | Description              |
| :----------------- | :------------------ | :----------------------- |
| `amountIn`         | `BigNumberish`      | Token amount input.      |
| `sourceChain`      | [`TChain`](#tchain) | Source chain model.      |
| `destinationChain` | [`TChain`](#tchain) | Destination chain model. |

##### Returns

`Promise`<`any`\>

Bonder fee as BigNumber.

---

#### getRequiredLiquidity

▸ **getRequiredLiquidity**(`tokenAmountIn`, `sourceChain?`): `Promise`<`BigNumber`\>

**`desc`** Estimate the bonder liquidity needed at the destination.

**`example`**

```js
import { Hop, Chain Token } from '@hop-protocol/sdk'

const hop = new Hop()
const bridge = hop.connect(signer).bridge(Token.USDC)
const requiredLiquidity = await bridge.getRequiredLiquidity('1000000000000000000', Chain.Optimism, Chain.xDai)
console.log(requiredLiquidity)
```

##### Parameters

| Name            | Type                | Description         |
| :-------------- | :------------------ | :------------------ |
| `tokenAmountIn` | `BigNumberish`      | Token amount input. |
| `sourceChain?`  | [`TChain`](#tchain) | Source chain model. |

##### Returns

`Promise`<`BigNumber`\>

Amount as BigNumber.

---

#### getSaddleLpToken

▸ **getSaddleLpToken**(`chain`, `signer?`): `Promise`<[`Token`](#classestokenmd)\>

**`desc`** Returns Hop Bridge Saddle Swap LP Token Ethers contract instance.

##### Parameters

| Name     | Type                      | Description   |
| :------- | :------------------------ | :------------ |
| `chain`  | [`TChain`](#tchain)       | Chain model.  |
| `signer` | [`TProvider`](#tprovider) | Ethers signer |

##### Returns

`Promise`<[`Token`](#classestokenmd)\>

Ethers contract instance.

---

#### getSaddleSwapReserves

▸ **getSaddleSwapReserves**(`chain`): `Promise`<[`any`, `any`]\>

**`desc`** Returns Hop Bridge Saddle reserve amounts.

##### Parameters

| Name    | Type                | Description  |
| :------ | :------------------ | :----------- |
| `chain` | [`TChain`](#tchain) | Chain model. |

##### Returns

`Promise`<[`any`, `any`]\>

Array containing reserve amounts for canonical token
and hTokens.

---

#### getSendApprovalAddress

▸ **getSendApprovalAddress**(`sourceChain`, `destinationChain`, `isHTokenTransfer?`): `Promise`<`any`\>

##### Parameters

| Name               | Type                | Default value |
| :----------------- | :------------------ | :------------ |
| `sourceChain`      | [`TChain`](#tchain) | `undefined`   |
| `destinationChain` | [`TChain`](#tchain) | `undefined`   |
| `isHTokenTransfer` | `boolean`           | `false`       |

##### Returns

`Promise`<`any`\>

---

#### getSendData

▸ **getSendData**(`amountIn`, `sourceChain?`, `destinationChain?`): `Promise`<`Object`\>

##### Parameters

| Name                | Type                |
| :------------------ | :------------------ |
| `amountIn`          | `BigNumberish`      |
| `sourceChain?`      | [`TChain`](#tchain) |
| `destinationChain?` | [`TChain`](#tchain) |

##### Returns

`Promise`<`Object`\>

---

#### getSignerAddress

▸ **getSignerAddress**(): `Promise`<`string`\>

**`desc`** Returns the connected signer address.

##### Returns

`Promise`<`string`\>

Ethers signer address

##### Overrides

Base.getSignerAddress

---

#### getSignerOrProvider

▸ **getSignerOrProvider**(`chain`, `signer?`): `Promise`<`Signer` \| `Provider`\>

**`desc`** Returns the connected signer if it's connected to the specified
chain id, otherwise it returns a regular provider for the specified chain.

##### Parameters

| Name     | Type                      | Description               |
| :------- | :------------------------ | :------------------------ |
| `chain`  | [`TChain`](#tchain)       | Chain name or model       |
| `signer` | [`TProvider`](#tprovider) | Ethers signer or provider |

##### Returns

`Promise`<`Signer` \| `Provider`\>

Ethers signer or provider

##### Inherited from

Base.getSignerOrProvider

---

#### getTokenImage

▸ **getTokenImage**(): `string`

##### Returns

`string`

---

#### getTokenSymbol

▸ **getTokenSymbol**(): `string`

##### Returns

`string`

---

#### isValidChain

▸ **isValidChain**(`chain`): `boolean`

##### Parameters

| Name    | Type     |
| :------ | :------- |
| `chain` | `string` |

##### Returns

`boolean`

##### Inherited from

Base.isValidChain

---

#### isValidNetwork

▸ **isValidNetwork**(`network`): `boolean`

##### Parameters

| Name      | Type     |
| :-------- | :------- |
| `network` | `string` |

##### Returns

`boolean`

##### Inherited from

Base.isValidNetwork

---

#### removeLiquidity

▸ **removeLiquidity**(`liqudityTokenAmount`, `chain?`, `options?`): `Promise`<`any`\>

**`desc`** Sends transaction to remove liquidity from AMM.

##### Parameters

| Name                  | Type                                 | Description                                       |
| :-------------------- | :----------------------------------- | :------------------------------------------------ |
| `liqudityTokenAmount` | `BigNumberish`                       | Amount of LP tokens to burn.                      |
| `chain?`              | [`TChain`](#tchain)                  | Chain model of desired chain to add liquidity to. |
| `options`             | `Partial`<`RemoveLiquidityOptions`\> | Method options.                                   |

##### Returns

`Promise`<`any`\>

Ethers transaction object.

---

#### send

▸ **send**(`tokenAmount`, `sourceChain?`, `destinationChain?`, `options?`): `Promise`<`any`\>

**`desc`** Send tokens to another chain.

**`example`**

```js
import { Hop, Chain, Token } from '@hop-protocol/sdk'

const hop = new Hop()
const bridge = hop.connect(signer).bridge(Token.USDC)
\ // send 1 USDC token from Optimism -> xDai
const tx = await bridge.send('1000000000000000000', Chain.Optimism, Chain.xDai)
console.log(tx.hash)
```

##### Parameters

| Name                | Type                      | Description                                        |
| :------------------ | :------------------------ | :------------------------------------------------- |
| `tokenAmount`       | `BigNumberish`            | Token amount to send denominated in smallest unit. |
| `sourceChain?`      | [`TChain`](#tchain)       | Source chain model.                                |
| `destinationChain?` | [`TChain`](#tchain)       | Destination chain model.                           |
| `options?`          | `Partial`<`SendOptions`\> | -                                                  |

##### Returns

`Promise`<`any`\>

Ethers Transaction object.

---

#### sendHToken

▸ **sendHToken**(`tokenAmount`, `sourceChain`, `destinationChain`, `options?`): `Promise`<`any`\>

##### Parameters

| Name               | Type                      |
| :----------------- | :------------------------ |
| `tokenAmount`      | `BigNumberish`            |
| `sourceChain`      | [`TChain`](#tchain)       |
| `destinationChain` | [`TChain`](#tchain)       |
| `options?`         | `Partial`<`SendOptions`\> |

##### Returns

`Promise`<`any`\>

---

#### setConfigAddresses

▸ **setConfigAddresses**(`addresses`): `void`

##### Parameters

| Name        | Type        |
| :---------- | :---------- |
| `addresses` | `Addresses` |

##### Returns

`void`

##### Inherited from

Base.setConfigAddresses

---

#### toCanonicalToken

▸ **toCanonicalToken**(`token`, `network`, `chain`): [`Token`](#classestokenmd)

##### Parameters

| Name      | Type                |
| :-------- | :------------------ |
| `token`   | [`TToken`](#ttoken) |
| `network` | `string`            |
| `chain`   | [`TChain`](#tchain) |

##### Returns

[`Token`](#classestokenmd)

---

#### toChainModel

▸ **toChainModel**(`chain`): [`Chain`](#classeschainmd)

**`desc`** Returns a Chain model instance with connected provider.

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `chain` | [`TChain`](#tchain) |

##### Returns

[`Chain`](#classeschainmd)

- Chain model with connected provider.

##### Inherited from

Base.toChainModel

---

#### toHopToken

▸ **toHopToken**(`token`, `network`, `chain`): [`Token`](#classestokenmd)

##### Parameters

| Name      | Type                |
| :-------- | :------------------ |
| `token`   | [`TToken`](#ttoken) |
| `network` | `string`            |
| `chain`   | [`TChain`](#tchain) |

##### Returns

[`Token`](#classestokenmd)

---

#### toTokenModel

▸ **toTokenModel**(`token`): `Token`

**`desc`** Returns a Token instance.

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |

##### Returns

`Token`

- Token model.

##### Inherited from

Base.toTokenModel

---

#### txOverrides

▸ **txOverrides**(`chain`): `any`

##### Parameters

| Name    | Type                       |
| :------ | :------------------------- |
| `chain` | [`Chain`](#classeschainmd) |

##### Returns

`any`

##### Inherited from

Base.txOverrides

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

• **new Route**(`source`, `destination`)

##### Parameters

| Name          | Type                       |
| :------------ | :------------------------- |
| `source`      | [`Chain`](#classeschainmd) |
| `destination` | [`Chain`](#classeschainmd) |

### Properties

#### destination

• `Readonly` **destination**: [`Chain`](#classeschainmd)

---

#### source

• `Readonly` **source**: [`Chain`](#classeschainmd)

<a name="classestokenmd"></a>

## Class: Token

Class reprensenting ERC20 Token

**`namespace`** Token

### Hierarchy

- `Base`

  ↳ **`Token`**

### Table of contents

#### Constructors

- [constructor](#constructor)

#### Properties

- [address](#address)
- [chain](#chain)
- [contract](#contract)
- [decimals](#decimals)
- [getContract](#getcontract)
- [image](#image)
- [name](#name)
- [network](#network)
- [signer](#signer)
- [symbol](#symbol)

#### Accessors

- [chainId](#chainid)
- [supportedChains](#supportedchains)
- [supportedNetworks](#supportednetworks)

#### Methods

- [allowance](#allowance)
- [approve](#approve)
- [balanceOf](#balanceof)
- [connect](#connect)
- [eq](#eq)
- [getArbChainAddress](#getarbchainaddress)
- [getBonderAddress](#getbonderaddress)
- [getBonderAddresses](#getbonderaddresses)
- [getBumpedGasPrice](#getbumpedgasprice)
- [getChainId](#getchainid)
- [getChainProvider](#getchainprovider)
- [getConfigAddresses](#getconfigaddresses)
- [getErc20](#geterc20)
- [getL1AmbBridgeAddress](#getl1ambbridgeaddress)
- [getL1BridgeAddress](#getl1bridgeaddress)
- [getL1CanonicalBridgeAddress](#getl1canonicalbridgeaddress)
- [getL1CanonicalTokenAddress](#getl1canonicaltokenaddress)
- [getL1PosErc20PredicateAddress](#getl1poserc20predicateaddress)
- [getL1PosRootChainManagerAddress](#getl1posrootchainmanageraddress)
- [getL2AmbBridgeAddress](#getl2ambbridgeaddress)
- [getL2AmmWrapperAddress](#getl2ammwrapperaddress)
- [getL2BridgeAddress](#getl2bridgeaddress)
- [getL2CanonicalBridgeAddress](#getl2canonicalbridgeaddress)
- [getL2CanonicalTokenAddress](#getl2canonicaltokenaddress)
- [getL2HopBridgeTokenAddress](#getl2hopbridgetokenaddress)
- [getL2SaddleLpTokenAddress](#getl2saddlelptokenaddress)
- [getL2SaddleSwapAddress](#getl2saddleswapaddress)
- [getSignerAddress](#getsigneraddress)
- [getSignerOrProvider](#getsignerorprovider)
- [isValidChain](#isvalidchain)
- [isValidNetwork](#isvalidnetwork)
- [overrides](#overrides)
- [setConfigAddresses](#setconfigaddresses)
- [toChainModel](#tochainmodel)
- [toTokenModel](#totokenmodel)
- [transfer](#transfer)
- [txOverrides](#txoverrides)

### Constructors

#### constructor

• **new Token**(`network`, `chain`, `address`, `decimals`, `symbol`, `name`, `image`, `signer?`)

**`desc`** Instantiates Token class.

##### Parameters

| Name       | Type                   | Description                                         |
| :--------- | :--------------------- | :-------------------------------------------------- |
| `network`  | `string`               | L1 network name (e.g. 'mainnet', 'kovan', 'goerli') |
| `chain`    | [`TChain`](#tchain)    | -                                                   |
| `address`  | `string`               | Token address.                                      |
| `decimals` | `number`               | Token decimals.                                     |
| `symbol`   | `string`               | Token symbol.                                       |
| `name`     | `string`               | Token name.                                         |
| `image`    | `string`               | -                                                   |
| `signer?`  | `Signer` \| `Provider` | Ethers signer.                                      |

##### Overrides

Base.constructor

### Properties

#### address

• `Readonly` **address**: `string`

---

#### chain

• `Readonly` **chain**: [`Chain`](#classeschainmd)

---

#### contract

• `Readonly` **contract**: `Contract`

---

#### decimals

• `Readonly` **decimals**: `number`

---

#### getContract

• **getContract**: (`address`: `string`, `abi`: `any`[], `provider`: [`TProvider`](#tprovider)) => `Promise`<`Contract`\>

##### Type declaration

▸ (`address`, `abi`, `provider`): `Promise`<`Contract`\>

###### Parameters

| Name       | Type                      |
| :--------- | :------------------------ |
| `address`  | `string`                  |
| `abi`      | `any`[]                   |
| `provider` | [`TProvider`](#tprovider) |

###### Returns

`Promise`<`Contract`\>

##### Inherited from

Base.getContract

---

#### image

• `Readonly` **image**: `string`

---

#### name

• `Readonly` **name**: `string`

---

#### network

• **network**: `string`

Network name

##### Inherited from

Base.network

---

#### signer

• **signer**: [`TProvider`](#tprovider)

Ethers signer or provider

##### Inherited from

Base.signer

---

#### symbol

• `Readonly` **symbol**: `string`

### Accessors

#### chainId

• `get` **chainId**(): `number`

##### Returns

`number`

---

#### supportedChains

• `get` **supportedChains**(): `string`[]

##### Returns

`string`[]

---

#### supportedNetworks

• `get` **supportedNetworks**(): `string`[]

##### Returns

`string`[]

### Methods

#### allowance

▸ **allowance**(`spender`): `Promise`<`any`\>

**`desc`** Returns token allowance.

**`example`**

```js
import { Hop, Chain, Token } from '@hop-protocol/sdk'

const bridge = hop.bridge(Token.USDC).connect(signer)
const spender = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
const allowance = bridge.allowance(Chain.xDai, spender)
```

##### Parameters

| Name      | Type     | Description      |
| :-------- | :------- | :--------------- |
| `spender` | `string` | spender address. |

##### Returns

`Promise`<`any`\>

Ethers Transaction object.

---

#### approve

▸ **approve**(`spender`, `amount?`): `Promise`<`any`\>

**`desc`** Approve address to spend tokens if not enough allowance .

**`example`**

```js
import { Hop, Chain, Token } from '@hop-protocol/sdk'

const bridge = hop.bridge(Token.USDC).connect(signer)
const spender = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
const amount = '1000000000000000000'
const tx = await bridge.approve(Chain.xDai, spender, amount)
```

##### Parameters

| Name      | Type           | Description              |
| :-------- | :------------- | :----------------------- |
| `spender` | `string`       | spender address.         |
| `amount`  | `BigNumberish` | amount allowed to spend. |

##### Returns

`Promise`<`any`\>

Ethers Transaction object.

---

#### balanceOf

▸ **balanceOf**(`address?`): `Promise`<`BigNumber`\>

**`desc`** Returns token balance of signer.

**`example`**

```js
import { Hop, Chain, Token } from '@hop-protocol/sdk'

const bridge = hop.bridge(Token.USDC).connect(signer)
const spender = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
const allowance = bridge.allowance(Chain.xDai, spender)
```

##### Parameters

| Name       | Type     |
| :--------- | :------- |
| `address?` | `string` |

##### Returns

`Promise`<`BigNumber`\>

Ethers Transaction object.

---

#### connect

▸ **connect**(`signer`): [`Token`](#classestokenmd)

**`desc`** Returns a token instance with signer connected. Used for adding or changing signer.

##### Parameters

| Name     | Type                   | Description                               |
| :------- | :--------------------- | :---------------------------------------- |
| `signer` | `Signer` \| `Provider` | Ethers `Signer` for signing transactions. |

##### Returns

[`Token`](#classestokenmd)

New Token SDK instance with connected signer.

---

#### eq

▸ **eq**(`token`): `boolean`

##### Parameters

| Name    | Type                       |
| :------ | :------------------------- |
| `token` | [`Token`](#classestokenmd) |

##### Returns

`boolean`

---

#### getArbChainAddress

▸ **getArbChainAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getArbChainAddress

---

#### getBonderAddress

▸ **getBonderAddress**(): `string`

##### Returns

`string`

##### Inherited from

Base.getBonderAddress

---

#### getBonderAddresses

▸ **getBonderAddresses**(): `string`[]

##### Returns

`string`[]

##### Inherited from

Base.getBonderAddresses

---

#### getBumpedGasPrice

▸ **getBumpedGasPrice**(`signer`, `percent`): `Promise`<`BigNumber`\>

**`desc`** Calculates current gas price plus increased percentage amount.

**`example`**

```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
const bumpedGasPrice = await hop.getBumpedGasPrice(signer, 1.2)
console.log(bumpedGasPrice.toNumber())
```

##### Parameters

| Name      | Type                      |
| :-------- | :------------------------ |
| `signer`  | [`TProvider`](#tprovider) |
| `percent` | `number`                  |

##### Returns

`Promise`<`BigNumber`\>

Bumped as price as BigNumber

##### Inherited from

Base.getBumpedGasPrice

---

#### getChainId

▸ **getChainId**(`chain`): `number`

**`desc`** Returns Chain ID for specified Chain model.

##### Parameters

| Name    | Type                       |
| :------ | :------------------------- |
| `chain` | [`Chain`](#classeschainmd) |

##### Returns

`number`

- Chain ID.

##### Inherited from

Base.getChainId

---

#### getChainProvider

▸ **getChainProvider**(`chain`): `Provider`

**`desc`** Returns Ethers provider for specified Chain model.

##### Parameters

| Name    | Type                       |
| :------ | :------------------------- |
| `chain` | [`Chain`](#classeschainmd) |

##### Returns

`Provider`

- Ethers provider.

##### Inherited from

Base.getChainProvider

---

#### getConfigAddresses

▸ **getConfigAddresses**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getConfigAddresses

---

#### getErc20

▸ **getErc20**(): `Promise`<`Contract`\>

**`desc`** Returns a token Ethers contract instance.

##### Returns

`Promise`<`Contract`\>

Ethers contract instance.

---

#### getL1AmbBridgeAddress

▸ **getL1AmbBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1AmbBridgeAddress

---

#### getL1BridgeAddress

▸ **getL1BridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1BridgeAddress

---

#### getL1CanonicalBridgeAddress

▸ **getL1CanonicalBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1CanonicalBridgeAddress

---

#### getL1CanonicalTokenAddress

▸ **getL1CanonicalTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1CanonicalTokenAddress

---

#### getL1PosErc20PredicateAddress

▸ **getL1PosErc20PredicateAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1PosErc20PredicateAddress

---

#### getL1PosRootChainManagerAddress

▸ **getL1PosRootChainManagerAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL1PosRootChainManagerAddress

---

#### getL2AmbBridgeAddress

▸ **getL2AmbBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2AmbBridgeAddress

---

#### getL2AmmWrapperAddress

▸ **getL2AmmWrapperAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2AmmWrapperAddress

---

#### getL2BridgeAddress

▸ **getL2BridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2BridgeAddress

---

#### getL2CanonicalBridgeAddress

▸ **getL2CanonicalBridgeAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2CanonicalBridgeAddress

---

#### getL2CanonicalTokenAddress

▸ **getL2CanonicalTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2CanonicalTokenAddress

---

#### getL2HopBridgeTokenAddress

▸ **getL2HopBridgeTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2HopBridgeTokenAddress

---

#### getL2SaddleLpTokenAddress

▸ **getL2SaddleLpTokenAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2SaddleLpTokenAddress

---

#### getL2SaddleSwapAddress

▸ **getL2SaddleSwapAddress**(`token`, `chain`): `any`

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |
| `chain` | [`TChain`](#tchain) |

##### Returns

`any`

##### Inherited from

Base.getL2SaddleSwapAddress

---

#### getSignerAddress

▸ **getSignerAddress**(): `Promise`<`string`\>

**`desc`** Returns the connected signer address.

**`example`**

```js
import { Hop } from '@hop-protocol/sdk'

const hop = new Hop()
const address = await hop.getSignerAddress()
console.log(address)
```

##### Returns

`Promise`<`string`\>

Ethers signer address.

##### Inherited from

Base.getSignerAddress

---

#### getSignerOrProvider

▸ **getSignerOrProvider**(`chain`, `signer?`): `Promise`<`Signer` \| `Provider`\>

**`desc`** Returns the connected signer if it's connected to the specified
chain id, otherwise it returns a regular provider for the specified chain.

##### Parameters

| Name     | Type                      | Description               |
| :------- | :------------------------ | :------------------------ |
| `chain`  | [`TChain`](#tchain)       | Chain name or model       |
| `signer` | [`TProvider`](#tprovider) | Ethers signer or provider |

##### Returns

`Promise`<`Signer` \| `Provider`\>

Ethers signer or provider

##### Inherited from

Base.getSignerOrProvider

---

#### isValidChain

▸ **isValidChain**(`chain`): `boolean`

##### Parameters

| Name    | Type     |
| :------ | :------- |
| `chain` | `string` |

##### Returns

`boolean`

##### Inherited from

Base.isValidChain

---

#### isValidNetwork

▸ **isValidNetwork**(`network`): `boolean`

##### Parameters

| Name      | Type     |
| :-------- | :------- |
| `network` | `string` |

##### Returns

`boolean`

##### Inherited from

Base.isValidNetwork

---

#### overrides

▸ **overrides**(): `any`

##### Returns

`any`

---

#### setConfigAddresses

▸ **setConfigAddresses**(`addresses`): `void`

##### Parameters

| Name        | Type        |
| :---------- | :---------- |
| `addresses` | `Addresses` |

##### Returns

`void`

##### Inherited from

Base.setConfigAddresses

---

#### toChainModel

▸ **toChainModel**(`chain`): [`Chain`](#classeschainmd)

**`desc`** Returns a Chain model instance with connected provider.

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `chain` | [`TChain`](#tchain) |

##### Returns

[`Chain`](#classeschainmd)

- Chain model with connected provider.

##### Inherited from

Base.toChainModel

---

#### toTokenModel

▸ **toTokenModel**(`token`): `Token`

**`desc`** Returns a Token instance.

##### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`TToken`](#ttoken) |

##### Returns

`Token`

- Token model.

##### Inherited from

Base.toTokenModel

---

#### transfer

▸ **transfer**(`recipient`, `amount`): `Promise`<`any`\>

**`desc`** ERC20 token transfer

**`example`**

```js
import { Hop, Token } from '@hop-protocol/sdk'

const bridge = hop.bridge(Token.USDC).connect(signer)
const recipient = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
const amount = '1000000000000000000'
const tx = await bridge.erc20Transfer(spender, amount)
```

##### Parameters

| Name        | Type           | Description        |
| :---------- | :------------- | :----------------- |
| `recipient` | `string`       | recipient address. |
| `amount`    | `BigNumberish` | Token amount.      |

##### Returns

`Promise`<`any`\>

Ethers Transaction object.

---

#### txOverrides

▸ **txOverrides**(`chain`): `any`

##### Parameters

| Name    | Type                       |
| :------ | :------------------------- |
| `chain` | [`Chain`](#classeschainmd) |

##### Returns

`any`

##### Inherited from

Base.txOverrides

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

• **new TokenAmount**(`token`, `amount`)

##### Parameters

| Name     | Type     |
| :------- | :------- |
| `token`  | `Token`  |
| `amount` | `string` |

### Properties

#### amount

• `Readonly` **amount**: `string`

---

#### token

• `Readonly` **token**: `Token`

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

• **new Transfer**(`route`, `tokenAmount`)

##### Parameters

| Name          | Type                                   |
| :------------ | :------------------------------------- |
| `route`       | [`Route`](#classesroutemd)             |
| `tokenAmount` | [`TokenAmount`](#classestokenamountmd) |

### Properties

#### route

• `Readonly` **route**: [`Route`](#classesroutemd)

---

#### tokenAmount

• `Readonly` **tokenAmount**: [`TokenAmount`](#classestokenamountmd)

<a name="modulesmd"></a>

# @hop-protocol/sdk

## Table of contents

### Namespaces

- [utils](#modulesutilsmd)

### Classes

- [AMM](#classesammmd)
- [CanonicalBridge](#classescanonicalbridgemd)
- [Chain](#classeschainmd)
- [Hop](#classeshopmd)
- [HopBridge](#classeshopbridgemd)
- [Route](#classesroutemd)
- [Token](#classestokenmd)
- [TokenAmount](#classestokenamountmd)
- [Transfer](#classestransfermd)

### Type aliases

- [TAmount](#tamount)
- [TChain](#tchain)
- [TProvider](#tprovider)
- [TToken](#ttoken)

## Type aliases

### TAmount

Ƭ **TAmount**: `BigNumberish`

Amount-ish type alias

---

### TChain

Ƭ **TChain**: [`Chain`](#classeschainmd) \| `string`

Chain-ish type

---

### TProvider

Ƭ **TProvider**: `Signer` \| `providers.Provider`

Signer-ish type

---

### TToken

Ƭ **TToken**: `Token` \| `string`

Token-ish type

# Modules

<a name="modulesutilsmd"></a>

## Namespace: utils

### Table of contents

#### Functions

- [serializeQueryParams](#serializequeryparams)
- [wait](#wait)

### Functions

#### serializeQueryParams

▸ `Const` **serializeQueryParams**(`params`, `options?`): `string`

##### Parameters

| Name      | Type                   |
| :-------- | :--------------------- |
| `params`  | `any`                  |
| `options` | `Partial`<`IOptions`\> |

##### Returns

`string`

---

#### wait

▸ `Const` **wait**(`timeoutMs`): `Promise`<`unknown`\>

##### Parameters

| Name        | Type     |
| :---------- | :------- |
| `timeoutMs` | `number` |

##### Returns

`Promise`<`unknown`\>
