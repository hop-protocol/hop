# Interface: StakingRewardsFactory

## Hierarchy

- `BaseContract`

  ↳ **`StakingRewardsFactory`**

## Table of contents

### Properties

- [callStatic](StakingRewardsFactory.md#callstatic)
- [estimateGas](StakingRewardsFactory.md#estimategas)
- [filters](StakingRewardsFactory.md#filters)
- [functions](StakingRewardsFactory.md#functions)
- [interface](StakingRewardsFactory.md#interface)
- [off](StakingRewardsFactory.md#off)
- [on](StakingRewardsFactory.md#on)
- [once](StakingRewardsFactory.md#once)
- [populateTransaction](StakingRewardsFactory.md#populatetransaction)
- [removeListener](StakingRewardsFactory.md#removelistener)

### Methods

- [attach](StakingRewardsFactory.md#attach)
- [connect](StakingRewardsFactory.md#connect)
- [deploy](StakingRewardsFactory.md#deploy)
- [deployed](StakingRewardsFactory.md#deployed)
- [isOwner](StakingRewardsFactory.md#isowner)
- [listeners](StakingRewardsFactory.md#listeners)
- [notifyRewardAmount](StakingRewardsFactory.md#notifyrewardamount)
- [notifyRewardAmounts](StakingRewardsFactory.md#notifyrewardamounts)
- [owner](StakingRewardsFactory.md#owner)
- [queryFilter](StakingRewardsFactory.md#queryfilter)
- [removeAllListeners](StakingRewardsFactory.md#removealllisteners)
- [renounceOwnership](StakingRewardsFactory.md#renounceownership)
- [rewardsToken](StakingRewardsFactory.md#rewardstoken)
- [stakingRewardsGenesis](StakingRewardsFactory.md#stakingrewardsgenesis)
- [stakingRewardsInfoByStakingToken](StakingRewardsFactory.md#stakingrewardsinfobystakingtoken)
- [stakingTokens](StakingRewardsFactory.md#stakingtokens)
- [transferOwnership](StakingRewardsFactory.md#transferownership)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `deploy` | (`stakingToken`: `PromiseOrValue`\<`string`\>, `rewardAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `isOwner` | (`overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `notifyRewardAmount` | (`stakingToken`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `notifyRewardAmounts` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `renounceOwnership` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `rewardsToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `stakingRewardsGenesis` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `stakingRewardsInfoByStakingToken` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`, `BigNumber`] & \{ `rewardAmount`: `BigNumber` ; `stakingRewards`: `string`  }\> |
| `stakingTokens` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `deploy` | (`stakingToken`: `PromiseOrValue`\<`string`\>, `rewardAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `isOwner` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `notifyRewardAmount` | (`stakingToken`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `notifyRewardAmounts` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `renounceOwnership` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `rewardsToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `stakingRewardsGenesis` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `stakingRewardsInfoByStakingToken` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `stakingTokens` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `OwnershipTransferred` | (`previousOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>, `newOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `OwnershipTransferredEventFilter` |
| `OwnershipTransferred(address,address)` | (`previousOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>, `newOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `OwnershipTransferredEventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `deploy` | (`stakingToken`: `PromiseOrValue`\<`string`\>, `rewardAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `isOwner` | (`overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `notifyRewardAmount` | (`stakingToken`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `notifyRewardAmounts` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `renounceOwnership` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `rewardsToken` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `stakingRewardsGenesis` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `stakingRewardsInfoByStakingToken` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`, `BigNumber`] & \{ `rewardAmount`: `BigNumber` ; `stakingRewards`: `string`  }\> |
| `stakingTokens` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `StakingRewardsFactoryInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`StakingRewardsFactory`](StakingRewardsFactory.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`StakingRewardsFactory`](StakingRewardsFactory.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`StakingRewardsFactory`](StakingRewardsFactory.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `deploy` | (`stakingToken`: `PromiseOrValue`\<`string`\>, `rewardAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `isOwner` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `notifyRewardAmount` | (`stakingToken`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `notifyRewardAmounts` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `renounceOwnership` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `rewardsToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `stakingRewardsGenesis` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `stakingRewardsInfoByStakingToken` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `stakingTokens` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`StakingRewardsFactory`](StakingRewardsFactory.md)\>

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

### <a id="deploy" name="deploy"></a> deploy

▸ **deploy**(`stakingToken`, `rewardAmount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stakingToken` | `PromiseOrValue`\<`string`\> |
| `rewardAmount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="deployed" name="deployed"></a> deployed

▸ **deployed**(): `Promise`\<[`StakingRewardsFactory`](StakingRewardsFactory.md)\>

#### Returns

`Promise`\<[`StakingRewardsFactory`](StakingRewardsFactory.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="isowner" name="isowner"></a> isOwner

▸ **isOwner**(`overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

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

▸ **notifyRewardAmount**(`stakingToken`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stakingToken` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="notifyrewardamounts" name="notifyrewardamounts"></a> notifyRewardAmounts

▸ **notifyRewardAmounts**(`overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="owner" name="owner"></a> owner

▸ **owner**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

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

### <a id="renounceownership" name="renounceownership"></a> renounceOwnership

▸ **renounceOwnership**(`overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

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

### <a id="stakingrewardsgenesis" name="stakingrewardsgenesis"></a> stakingRewardsGenesis

▸ **stakingRewardsGenesis**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="stakingrewardsinfobystakingtoken" name="stakingrewardsinfobystakingtoken"></a> stakingRewardsInfoByStakingToken

▸ **stakingRewardsInfoByStakingToken**(`arg0`, `overrides?`): `Promise`\<[`string`, `BigNumber`] & \{ `rewardAmount`: `BigNumber` ; `stakingRewards`: `string`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<[`string`, `BigNumber`] & \{ `rewardAmount`: `BigNumber` ; `stakingRewards`: `string`  }\>

___

### <a id="stakingtokens" name="stakingtokens"></a> stakingTokens

▸ **stakingTokens**(`arg0`, `overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="transferownership" name="transferownership"></a> transferOwnership

▸ **transferOwnership**(`newOwner`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `newOwner` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>
