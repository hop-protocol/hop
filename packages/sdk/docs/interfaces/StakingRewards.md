# Interface: StakingRewards

## Hierarchy

- `BaseContract`

  ↳ **`StakingRewards`**

## Table of contents

### Properties

- [callStatic](StakingRewards.md#callstatic)
- [estimateGas](StakingRewards.md#estimategas)
- [filters](StakingRewards.md#filters)
- [functions](StakingRewards.md#functions)
- [interface](StakingRewards.md#interface)
- [off](StakingRewards.md#off)
- [on](StakingRewards.md#on)
- [once](StakingRewards.md#once)
- [populateTransaction](StakingRewards.md#populatetransaction)
- [removeListener](StakingRewards.md#removelistener)

### Methods

- [attach](StakingRewards.md#attach)
- [balanceOf](StakingRewards.md#balanceof)
- [connect](StakingRewards.md#connect)
- [deployed](StakingRewards.md#deployed)
- [earned](StakingRewards.md#earned)
- [exit](StakingRewards.md#exit)
- [getReward](StakingRewards.md#getreward)
- [getRewardForDuration](StakingRewards.md#getrewardforduration)
- [lastTimeRewardApplicable](StakingRewards.md#lasttimerewardapplicable)
- [lastUpdateTime](StakingRewards.md#lastupdatetime)
- [listeners](StakingRewards.md#listeners)
- [notifyRewardAmount](StakingRewards.md#notifyrewardamount)
- [periodFinish](StakingRewards.md#periodfinish)
- [queryFilter](StakingRewards.md#queryfilter)
- [removeAllListeners](StakingRewards.md#removealllisteners)
- [rewardPerToken](StakingRewards.md#rewardpertoken)
- [rewardPerTokenStored](StakingRewards.md#rewardpertokenstored)
- [rewardRate](StakingRewards.md#rewardrate)
- [rewards](StakingRewards.md#rewards)
- [rewardsDistribution](StakingRewards.md#rewardsdistribution)
- [rewardsDuration](StakingRewards.md#rewardsduration)
- [rewardsToken](StakingRewards.md#rewardstoken)
- [stake](StakingRewards.md#stake)
- [stakeWithPermit](StakingRewards.md#stakewithpermit)
- [stakingToken](StakingRewards.md#stakingtoken)
- [totalSupply](StakingRewards.md#totalsupply)
- [userRewardPerTokenPaid](StakingRewards.md#userrewardpertokenpaid)
- [withdraw](StakingRewards.md#withdraw)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `balanceOf` | (`account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `earned` | (`account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `exit` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `getReward` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `getRewardForDuration` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `lastTimeRewardApplicable` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `lastUpdateTime` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `notifyRewardAmount` | (`reward`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `periodFinish` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `rewardPerToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `rewardPerTokenStored` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `rewardRate` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `rewards` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `rewardsDistribution` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `rewardsDuration` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `rewardsToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `stake` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `stakeWithPermit` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `v`: `PromiseOrValue`\<`BigNumberish`\>, `r`: `PromiseOrValue`\<`BytesLike`\>, `s`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `stakingToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `totalSupply` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `userRewardPerTokenPaid` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `withdraw` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `balanceOf` | (`account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `earned` | (`account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `exit` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `getReward` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `getRewardForDuration` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `lastTimeRewardApplicable` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `lastUpdateTime` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `notifyRewardAmount` | (`reward`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `periodFinish` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `rewardPerToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `rewardPerTokenStored` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `rewardRate` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `rewards` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `rewardsDistribution` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `rewardsDuration` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `rewardsToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `stake` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `stakeWithPermit` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `v`: `PromiseOrValue`\<`BigNumberish`\>, `r`: `PromiseOrValue`\<`BytesLike`\>, `s`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `stakingToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `totalSupply` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `userRewardPerTokenPaid` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `withdraw` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `RewardAdded` | (`reward?`: ``null``) => `RewardAddedEventFilter` |
| `RewardAdded(uint256)` | (`reward?`: ``null``) => `RewardAddedEventFilter` |
| `RewardPaid` | (`user?`: ``null`` \| `PromiseOrValue`\<`string`\>, `reward?`: ``null``) => `RewardPaidEventFilter` |
| `RewardPaid(address,uint256)` | (`user?`: ``null`` \| `PromiseOrValue`\<`string`\>, `reward?`: ``null``) => `RewardPaidEventFilter` |
| `Staked` | (`user?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``) => `StakedEventFilter` |
| `Staked(address,uint256)` | (`user?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``) => `StakedEventFilter` |
| `Withdrawn` | (`user?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``) => `WithdrawnEventFilter` |
| `Withdrawn(address,uint256)` | (`user?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``) => `WithdrawnEventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `balanceOf` | (`account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `earned` | (`account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `exit` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `getReward` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `getRewardForDuration` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `lastTimeRewardApplicable` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `lastUpdateTime` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `notifyRewardAmount` | (`reward`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `periodFinish` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `rewardPerToken` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `rewardPerTokenStored` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `rewardRate` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `rewards` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `rewardsDistribution` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `rewardsDuration` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `rewardsToken` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `stake` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `stakeWithPermit` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `v`: `PromiseOrValue`\<`BigNumberish`\>, `r`: `PromiseOrValue`\<`BytesLike`\>, `s`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `stakingToken` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `totalSupply` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `userRewardPerTokenPaid` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `withdraw` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `StakingRewardsInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`StakingRewards`](StakingRewards.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`StakingRewards`](StakingRewards.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`StakingRewards`](StakingRewards.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `balanceOf` | (`account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `earned` | (`account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `exit` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `getReward` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `getRewardForDuration` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `lastTimeRewardApplicable` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `lastUpdateTime` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `notifyRewardAmount` | (`reward`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `periodFinish` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `rewardPerToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `rewardPerTokenStored` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `rewardRate` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `rewards` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `rewardsDistribution` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `rewardsDuration` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `rewardsToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `stake` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `stakeWithPermit` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `deadline`: `PromiseOrValue`\<`BigNumberish`\>, `v`: `PromiseOrValue`\<`BigNumberish`\>, `r`: `PromiseOrValue`\<`BytesLike`\>, `s`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `stakingToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `totalSupply` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `userRewardPerTokenPaid` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `withdraw` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`StakingRewards`](StakingRewards.md)\>

#### Overrides

BaseContract.removeListener

## Methods

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

### <a id="balanceof" name="balanceof"></a> balanceOf

▸ **balanceOf**(`account`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `account` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

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

▸ **deployed**(): `Promise`\<[`StakingRewards`](StakingRewards.md)\>

#### Returns

`Promise`\<[`StakingRewards`](StakingRewards.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="earned" name="earned"></a> earned

▸ **earned**(`account`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `account` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="exit" name="exit"></a> exit

▸ **exit**(`overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="getreward" name="getreward"></a> getReward

▸ **getReward**(`overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="getrewardforduration" name="getrewardforduration"></a> getRewardForDuration

▸ **getRewardForDuration**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="lasttimerewardapplicable" name="lasttimerewardapplicable"></a> lastTimeRewardApplicable

▸ **lastTimeRewardApplicable**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="lastupdatetime" name="lastupdatetime"></a> lastUpdateTime

▸ **lastUpdateTime**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
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

### <a id="notifyrewardamount" name="notifyrewardamount"></a> notifyRewardAmount

▸ **notifyRewardAmount**(`reward`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `reward` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="periodfinish" name="periodfinish"></a> periodFinish

▸ **periodFinish**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

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

### <a id="rewardpertoken" name="rewardpertoken"></a> rewardPerToken

▸ **rewardPerToken**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="rewardpertokenstored" name="rewardpertokenstored"></a> rewardPerTokenStored

▸ **rewardPerTokenStored**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="rewardrate" name="rewardrate"></a> rewardRate

▸ **rewardRate**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="rewards" name="rewards"></a> rewards

▸ **rewards**(`arg0`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="rewardsdistribution" name="rewardsdistribution"></a> rewardsDistribution

▸ **rewardsDistribution**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="rewardsduration" name="rewardsduration"></a> rewardsDuration

▸ **rewardsDuration**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="rewardstoken" name="rewardstoken"></a> rewardsToken

▸ **rewardsToken**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="stake" name="stake"></a> stake

▸ **stake**(`amount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="stakewithpermit" name="stakewithpermit"></a> stakeWithPermit

▸ **stakeWithPermit**(`amount`, `deadline`, `v`, `r`, `s`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `deadline` | `PromiseOrValue`\<`BigNumberish`\> |
| `v` | `PromiseOrValue`\<`BigNumberish`\> |
| `r` | `PromiseOrValue`\<`BytesLike`\> |
| `s` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="stakingtoken" name="stakingtoken"></a> stakingToken

▸ **stakingToken**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="totalsupply" name="totalsupply"></a> totalSupply

▸ **totalSupply**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="userrewardpertokenpaid" name="userrewardpertokenpaid"></a> userRewardPerTokenPaid

▸ **userRewardPerTokenPaid**(`arg0`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="withdraw" name="withdraw"></a> withdraw

▸ **withdraw**(`amount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>
