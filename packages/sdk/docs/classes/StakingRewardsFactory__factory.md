# Class: StakingRewardsFactory\_\_factory

## Table of contents

### Constructors

- [constructor](StakingRewardsFactory__factory.md#constructor)

### Properties

- [abi](StakingRewardsFactory__factory.md#abi)

### Methods

- [connect](StakingRewardsFactory__factory.md#connect)
- [createInterface](StakingRewardsFactory__factory.md#createinterface)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new StakingRewardsFactory__factory**(): [`StakingRewardsFactory__factory`](StakingRewardsFactory__factory.md)

#### Returns

[`StakingRewardsFactory__factory`](StakingRewardsFactory__factory.md)

## Properties

### <a id="abi" name="abi"></a> abi

▪ `Static` `Readonly` **abi**: (\{ `anonymous?`: `undefined` = false; `constant?`: `undefined` = true; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "\_rewardsToken"; `type`: `string` = "address" }[] ; `name?`: `undefined` = "getCredit"; `outputs?`: `undefined` ; `payable`: `boolean` = false; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `anonymous`: `boolean` = false; `constant?`: `undefined` = true; `inputs`: \{ `indexed`: `boolean` = true; `internalType`: `string` = "address"; `name`: `string` = "previousOwner"; `type`: `string` = "address" }[] ; `name`: `string` = "OwnershipTransferred"; `outputs?`: `undefined` ; `payable?`: `undefined` = false; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `constant`: `boolean` = true; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = ""; `type`: `string` = "address" }[] ; `name`: `string` = "stakingRewardsInfoByStakingToken"; `outputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "stakingRewards"; `type`: `string` = "address" }[] ; `payable`: `boolean` = false; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[] = `_abi`

## Methods

### <a id="connect" name="connect"></a> connect

▸ **connect**(`address`, `signerOrProvider`): [`StakingRewardsFactory`](../interfaces/StakingRewardsFactory.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signerOrProvider` | `Provider` \| `Signer` |

#### Returns

[`StakingRewardsFactory`](../interfaces/StakingRewardsFactory.md)

___

### <a id="createinterface" name="createinterface"></a> createInterface

▸ **createInterface**(): `StakingRewardsFactoryInterface`

#### Returns

`StakingRewardsFactoryInterface`
