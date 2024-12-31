# Class: StakingRewards\_\_factory

## Table of contents

### Constructors

- [constructor](StakingRewards__factory.md#constructor)

### Properties

- [abi](StakingRewards__factory.md#abi)

### Methods

- [connect](StakingRewards__factory.md#connect)
- [createInterface](StakingRewards__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new StakingRewards__factory**(): [`StakingRewards__factory`](StakingRewards__factory.md)

#### Returns

[`StakingRewards__factory`](StakingRewards__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous?`: `undefined` = false; `constant?`: `undefined` = true; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "\_rewardsDistribution"; `type`: `string` = "address" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `payable`: `boolean` = false; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `anonymous`: `boolean` = false; `constant?`: `undefined` = true; `inputs`: \{ `indexed`: `boolean` = false; `internalType`: `string` = "uint256"; `name`: `string` = "reward"; `type`: `string` = "uint256" }[] ; `name`: `string` = "RewardAdded"; `outputs?`: `undefined` ; `payable?`: `undefined` = false; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `constant`: `boolean` = true; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "account"; `type`: `string` = "address" }[] ; `name`: `string` = "balanceOf"; `outputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `payable`: `boolean` = false; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`StakingRewards`](../interfaces/StakingRewards.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`StakingRewards`](../interfaces/StakingRewards.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `StakingRewardsInterface`

#### Returns

`StakingRewardsInterface`
