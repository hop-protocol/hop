# Interface: GovernorAlpha

## Hierarchy

- `BaseContract`

  ↳ **`GovernorAlpha`**

## Table of contents

### Properties

- [callStatic](GovernorAlpha-1.md#callstatic)
- [estimateGas](GovernorAlpha-1.md#estimategas)
- [filters](GovernorAlpha-1.md#filters)
- [functions](GovernorAlpha-1.md#functions)
- [interface](GovernorAlpha-1.md#interface)
- [off](GovernorAlpha-1.md#off)
- [on](GovernorAlpha-1.md#on)
- [once](GovernorAlpha-1.md#once)
- [populateTransaction](GovernorAlpha-1.md#populatetransaction)
- [removeListener](GovernorAlpha-1.md#removelistener)

### Methods

- [BALLOT\_TYPEHASH](GovernorAlpha-1.md#ballot_typehash)
- [DOMAIN\_TYPEHASH](GovernorAlpha-1.md#domain_typehash)
- [attach](GovernorAlpha-1.md#attach)
- [cancel](GovernorAlpha-1.md#cancel)
- [castVote](GovernorAlpha-1.md#castvote)
- [castVoteBySig](GovernorAlpha-1.md#castvotebysig)
- [connect](GovernorAlpha-1.md#connect)
- [deployed](GovernorAlpha-1.md#deployed)
- [execute](GovernorAlpha-1.md#execute)
- [getActions](GovernorAlpha-1.md#getactions)
- [getReceipt](GovernorAlpha-1.md#getreceipt)
- [hop](GovernorAlpha-1.md#hop)
- [latestProposalIds](GovernorAlpha-1.md#latestproposalids)
- [listeners](GovernorAlpha-1.md#listeners)
- [name](GovernorAlpha-1.md#name)
- [proposalCount](GovernorAlpha-1.md#proposalcount)
- [proposalMaxOperations](GovernorAlpha-1.md#proposalmaxoperations)
- [proposalThreshold](GovernorAlpha-1.md#proposalthreshold)
- [proposals](GovernorAlpha-1.md#proposals)
- [propose](GovernorAlpha-1.md#propose)
- [queryFilter](GovernorAlpha-1.md#queryfilter)
- [queue](GovernorAlpha-1.md#queue)
- [quorumVotes](GovernorAlpha-1.md#quorumvotes)
- [removeAllListeners](GovernorAlpha-1.md#removealllisteners)
- [state](GovernorAlpha-1.md#state)
- [timelock](GovernorAlpha-1.md#timelock)
- [votingDelay](GovernorAlpha-1.md#votingdelay)
- [votingPeriod](GovernorAlpha-1.md#votingperiod)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `BALLOT_TYPEHASH` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `DOMAIN_TYPEHASH` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `cancel` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `castVote` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `support`: `PromiseOrValue`\<`boolean`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `castVoteBySig` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `support`: `PromiseOrValue`\<`boolean`\>, `v`: `PromiseOrValue`\<`BigNumberish`\>, `r`: `PromiseOrValue`\<`BytesLike`\>, `s`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `execute` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `getActions` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`[], `BigNumber`[], `string`[], `string`[]] & \{ `calldatas`: `string`[] ; `signatures`: `string`[] ; `targets`: `string`[] ; `values`: `BigNumber`[]  }\> |
| `getReceipt` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `voter`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`ReceiptStructOutput`](../modules/GovernorAlpha.md#receiptstructoutput)\> |
| `hop` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `latestProposalIds` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `name` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `proposalCount` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `proposalMaxOperations` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `proposalThreshold` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `proposals` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `string`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `boolean`, `boolean`] & \{ `againstVotes`: `BigNumber` ; `canceled`: `boolean` ; `endBlock`: `BigNumber` ; `eta`: `BigNumber` ; `executed`: `boolean` ; `forVotes`: `BigNumber` ; `id`: `BigNumber` ; `proposer`: `string` ; `startBlock`: `BigNumber`  }\> |
| `propose` | (`targets`: `PromiseOrValue`\<`string`\>[], `values`: `PromiseOrValue`\<`BigNumberish`\>[], `signatures`: `PromiseOrValue`\<`string`\>[], `calldatas`: `PromiseOrValue`\<`BytesLike`\>[], `description`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `queue` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `quorumVotes` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `state` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`number`\> |
| `timelock` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `votingDelay` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `votingPeriod` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `BALLOT_TYPEHASH` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `DOMAIN_TYPEHASH` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `cancel` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `castVote` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `support`: `PromiseOrValue`\<`boolean`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `castVoteBySig` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `support`: `PromiseOrValue`\<`boolean`\>, `v`: `PromiseOrValue`\<`BigNumberish`\>, `r`: `PromiseOrValue`\<`BytesLike`\>, `s`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `execute` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `getActions` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getReceipt` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `voter`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `hop` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `latestProposalIds` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `name` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `proposalCount` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `proposalMaxOperations` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `proposalThreshold` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `proposals` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `propose` | (`targets`: `PromiseOrValue`\<`string`\>[], `values`: `PromiseOrValue`\<`BigNumberish`\>[], `signatures`: `PromiseOrValue`\<`string`\>[], `calldatas`: `PromiseOrValue`\<`BytesLike`\>[], `description`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `queue` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `quorumVotes` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `state` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `timelock` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `votingDelay` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `votingPeriod` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ProposalCanceled` | (`id?`: ``null``) => `ProposalCanceledEventFilter` |
| `ProposalCanceled(uint256)` | (`id?`: ``null``) => `ProposalCanceledEventFilter` |
| `ProposalCreated` | (`id?`: ``null``, `proposer?`: ``null``, `targets?`: ``null``, `values?`: ``null``, `signatures?`: ``null``, `calldatas?`: ``null``, `startBlock?`: ``null``, `endBlock?`: ``null``, `description?`: ``null``) => `ProposalCreatedEventFilter` |
| `ProposalCreated(uint256,address,address[],uint256[],string[],bytes[],uint256,uint256,string)` | (`id?`: ``null``, `proposer?`: ``null``, `targets?`: ``null``, `values?`: ``null``, `signatures?`: ``null``, `calldatas?`: ``null``, `startBlock?`: ``null``, `endBlock?`: ``null``, `description?`: ``null``) => `ProposalCreatedEventFilter` |
| `ProposalExecuted` | (`id?`: ``null``) => `ProposalExecutedEventFilter` |
| `ProposalExecuted(uint256)` | (`id?`: ``null``) => `ProposalExecutedEventFilter` |
| `ProposalQueued` | (`id?`: ``null``, `eta?`: ``null``) => `ProposalQueuedEventFilter` |
| `ProposalQueued(uint256,uint256)` | (`id?`: ``null``, `eta?`: ``null``) => `ProposalQueuedEventFilter` |
| `VoteCast` | (`voter?`: ``null``, `proposalId?`: ``null``, `support?`: ``null``, `votes?`: ``null``) => `VoteCastEventFilter` |
| `VoteCast(address,uint256,bool,uint256)` | (`voter?`: ``null``, `proposalId?`: ``null``, `support?`: ``null``, `votes?`: ``null``) => `VoteCastEventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `BALLOT_TYPEHASH` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `DOMAIN_TYPEHASH` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `cancel` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `castVote` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `support`: `PromiseOrValue`\<`boolean`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `castVoteBySig` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `support`: `PromiseOrValue`\<`boolean`\>, `v`: `PromiseOrValue`\<`BigNumberish`\>, `r`: `PromiseOrValue`\<`BytesLike`\>, `s`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `execute` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `getActions` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`[], `BigNumber`[], `string`[], `string`[]] & \{ `calldatas`: `string`[] ; `signatures`: `string`[] ; `targets`: `string`[] ; `values`: `BigNumber`[]  }\> |
| `getReceipt` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `voter`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[[`ReceiptStructOutput`](../modules/GovernorAlpha.md#receiptstructoutput)]\> |
| `hop` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `latestProposalIds` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `name` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `proposalCount` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `proposalMaxOperations` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `proposalThreshold` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `proposals` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `string`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `boolean`, `boolean`] & \{ `againstVotes`: `BigNumber` ; `canceled`: `boolean` ; `endBlock`: `BigNumber` ; `eta`: `BigNumber` ; `executed`: `boolean` ; `forVotes`: `BigNumber` ; `id`: `BigNumber` ; `proposer`: `string` ; `startBlock`: `BigNumber`  }\> |
| `propose` | (`targets`: `PromiseOrValue`\<`string`\>[], `values`: `PromiseOrValue`\<`BigNumberish`\>[], `signatures`: `PromiseOrValue`\<`string`\>[], `calldatas`: `PromiseOrValue`\<`BytesLike`\>[], `description`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `queue` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `quorumVotes` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `state` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`number`]\> |
| `timelock` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `votingDelay` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `votingPeriod` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `GovernorAlphaInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`GovernorAlpha`](GovernorAlpha-1.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`GovernorAlpha`](GovernorAlpha-1.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`GovernorAlpha`](GovernorAlpha-1.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `BALLOT_TYPEHASH` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `DOMAIN_TYPEHASH` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `cancel` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `castVote` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `support`: `PromiseOrValue`\<`boolean`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `castVoteBySig` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `support`: `PromiseOrValue`\<`boolean`\>, `v`: `PromiseOrValue`\<`BigNumberish`\>, `r`: `PromiseOrValue`\<`BytesLike`\>, `s`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `execute` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `getActions` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getReceipt` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `voter`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `hop` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `latestProposalIds` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `name` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `proposalCount` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `proposalMaxOperations` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `proposalThreshold` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `proposals` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `propose` | (`targets`: `PromiseOrValue`\<`string`\>[], `values`: `PromiseOrValue`\<`BigNumberish`\>[], `signatures`: `PromiseOrValue`\<`string`\>[], `calldatas`: `PromiseOrValue`\<`BytesLike`\>[], `description`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `queue` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `quorumVotes` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `state` | (`proposalId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `timelock` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `votingDelay` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `votingPeriod` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`GovernorAlpha`](GovernorAlpha-1.md)\>

#### Overrides

BaseContract.removeListener

## Methods

### <a id="ballot_typehash" name="ballot_typehash"></a> BALLOT\_TYPEHASH

▸ **BALLOT_TYPEHASH**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="domain_typehash" name="domain_typehash"></a> DOMAIN\_TYPEHASH

▸ **DOMAIN_TYPEHASH**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="attach" name="attach"></a> attach

▸ **attach**(`addressOrName`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `addressOrName` | `string` |

#### Returns

`this`

#### Overrides

BaseContract.attach

___

### <a id="cancel" name="cancel"></a> cancel

▸ **cancel**(`proposalId`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `proposalId` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="castvote" name="castvote"></a> castVote

▸ **castVote**(`proposalId`, `support`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `proposalId` | `PromiseOrValue`\<`BigNumberish`\> |
| `support` | `PromiseOrValue`\<`boolean`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="castvotebysig" name="castvotebysig"></a> castVoteBySig

▸ **castVoteBySig**(`proposalId`, `support`, `v`, `r`, `s`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `proposalId` | `PromiseOrValue`\<`BigNumberish`\> |
| `support` | `PromiseOrValue`\<`boolean`\> |
| `v` | `PromiseOrValue`\<`BigNumberish`\> |
| `r` | `PromiseOrValue`\<`BytesLike`\> |
| `s` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="connect" name="connect"></a> connect

▸ **connect**(`signerOrProvider`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `signerOrProvider` | `string` \| `Provider` \| `Signer` |

#### Returns

`this`

#### Overrides

BaseContract.connect

___

### <a id="deployed" name="deployed"></a> deployed

▸ **deployed**(): `Promise`\<[`GovernorAlpha`](GovernorAlpha-1.md)\>

#### Returns

`Promise`\<[`GovernorAlpha`](GovernorAlpha-1.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="execute" name="execute"></a> execute

▸ **execute**(`proposalId`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `proposalId` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="getactions" name="getactions"></a> getActions

▸ **getActions**(`proposalId`, `overrides?`): `Promise`\<[`string`[], `BigNumber`[], `string`[], `string`[]] & \{ `calldatas`: `string`[] ; `signatures`: `string`[] ; `targets`: `string`[] ; `values`: `BigNumber`[]  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `proposalId` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<[`string`[], `BigNumber`[], `string`[], `string`[]] & \{ `calldatas`: `string`[] ; `signatures`: `string`[] ; `targets`: `string`[] ; `values`: `BigNumber`[]  }\>

___

### <a id="getreceipt" name="getreceipt"></a> getReceipt

▸ **getReceipt**(`proposalId`, `voter`, `overrides?`): `Promise`\<[`ReceiptStructOutput`](../modules/GovernorAlpha.md#receiptstructoutput)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `proposalId` | `PromiseOrValue`\<`BigNumberish`\> |
| `voter` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<[`ReceiptStructOutput`](../modules/GovernorAlpha.md#receiptstructoutput)\>

___

### <a id="hop" name="hop"></a> hop

▸ **hop**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="latestproposalids" name="latestproposalids"></a> latestProposalIds

▸ **latestProposalIds**(`arg0`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="listeners" name="listeners"></a> listeners

▸ **listeners**\<`TEvent`\>(`eventFilter?`): `TypedListener`\<`TEvent`\>[]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEvent` | extends `TypedEvent`\<`any`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventFilter?` | `TypedEventFilter`\<`TEvent`\> |

#### Returns

`TypedListener`\<`TEvent`\>[]

#### Overrides

BaseContract.listeners

▸ **listeners**(`eventName?`): `Listener`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName?` | `string` |

#### Returns

`Listener`[]

#### Overrides

BaseContract.listeners

___

### <a id="name" name="name"></a> name

▸ **name**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="proposalcount" name="proposalcount"></a> proposalCount

▸ **proposalCount**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="proposalmaxoperations" name="proposalmaxoperations"></a> proposalMaxOperations

▸ **proposalMaxOperations**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="proposalthreshold" name="proposalthreshold"></a> proposalThreshold

▸ **proposalThreshold**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="proposals" name="proposals"></a> proposals

▸ **proposals**(`arg0`, `overrides?`): `Promise`\<[`BigNumber`, `string`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `boolean`, `boolean`] & \{ `againstVotes`: `BigNumber` ; `canceled`: `boolean` ; `endBlock`: `BigNumber` ; `eta`: `BigNumber` ; `executed`: `boolean` ; `forVotes`: `BigNumber` ; `id`: `BigNumber` ; `proposer`: `string` ; `startBlock`: `BigNumber`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<[`BigNumber`, `string`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `boolean`, `boolean`] & \{ `againstVotes`: `BigNumber` ; `canceled`: `boolean` ; `endBlock`: `BigNumber` ; `eta`: `BigNumber` ; `executed`: `boolean` ; `forVotes`: `BigNumber` ; `id`: `BigNumber` ; `proposer`: `string` ; `startBlock`: `BigNumber`  }\>

___

### <a id="propose" name="propose"></a> propose

▸ **propose**(`targets`, `values`, `signatures`, `calldatas`, `description`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `targets` | `PromiseOrValue`\<`string`\>[] |
| `values` | `PromiseOrValue`\<`BigNumberish`\>[] |
| `signatures` | `PromiseOrValue`\<`string`\>[] |
| `calldatas` | `PromiseOrValue`\<`BytesLike`\>[] |
| `description` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="queryfilter" name="queryfilter"></a> queryFilter

▸ **queryFilter**\<`TEvent`\>(`event`, `fromBlockOrBlockhash?`, `toBlock?`): `Promise`\<`TEvent`[]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEvent` | extends `TypedEvent`\<`any`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `TypedEventFilter`\<`TEvent`\> |
| `fromBlockOrBlockhash?` | `string` \| `number` |
| `toBlock?` | `string` \| `number` |

#### Returns

`Promise`\<`TEvent`[]\>

#### Overrides

BaseContract.queryFilter

___

### <a id="queue" name="queue"></a> queue

▸ **queue**(`proposalId`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `proposalId` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="quorumvotes" name="quorumvotes"></a> quorumVotes

▸ **quorumVotes**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="removealllisteners" name="removealllisteners"></a> removeAllListeners

▸ **removeAllListeners**\<`TEvent`\>(`eventFilter`): `this`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEvent` | extends `TypedEvent`\<`any`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventFilter` | `TypedEventFilter`\<`TEvent`\> |

#### Returns

`this`

#### Overrides

BaseContract.removeAllListeners

▸ **removeAllListeners**(`eventName?`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName?` | `string` |

#### Returns

`this`

#### Overrides

BaseContract.removeAllListeners

___

### <a id="state" name="state"></a> state

▸ **state**(`proposalId`, `overrides?`): `Promise`\<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `proposalId` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`number`\>

___

### <a id="timelock" name="timelock"></a> timelock

▸ **timelock**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="votingdelay" name="votingdelay"></a> votingDelay

▸ **votingDelay**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="votingperiod" name="votingperiod"></a> votingPeriod

▸ **votingPeriod**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>
