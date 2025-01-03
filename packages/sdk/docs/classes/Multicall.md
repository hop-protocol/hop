# Class: Multicall

## Table of contents

### Constructors

- [constructor](Multicall.md#constructor)

### Properties

- [accountAddress](Multicall.md#accountaddress)
- [chainProviders](Multicall.md#chainproviders)
- [network](Multicall.md#network)
- [priceFeed](Multicall.md#pricefeed)

### Methods

- [getBalancesForChain](Multicall.md#getbalancesforchain)
- [multicall](Multicall.md#multicall)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new Multicall**(`config`): [`Multicall`](Multicall.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `Config` |

#### Returns

[`Multicall`](Multicall.md)

## Properties

### <a id="accountaddress" name="accountaddress"></a> accountAddress

• `Optional` **accountAddress**: `string`

___

### <a id="chainproviders" name="chainproviders"></a> chainProviders

• **chainProviders**: `ChainProviders` = `{}`

___

### <a id="network" name="network"></a> network

• **network**: [`NetworkSlug`](../enums/NetworkSlug.md)

___

### <a id="pricefeed" name="pricefeed"></a> priceFeed

• **priceFeed**: `PriceFeedFromS3`

## Methods

### <a id="getbalancesforchain" name="getbalancesforchain"></a> getBalancesForChain

▸ **getBalancesForChain**(`chainSlug`, `multicallBalanceOpts`): `Promise`\<`MulticallBalance`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainSlug` | `string` |
| `multicallBalanceOpts` | `GetMulticallBalanceOptions`[] |

#### Returns

`Promise`\<`MulticallBalance`[]\>

___

### <a id="multicall" name="multicall"></a> multicall

▸ **multicall**(`chainSlug`, `options`): `Promise`\<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainSlug` | `string` |
| `options` | `MulticallOptions`[] |

#### Returns

`Promise`\<`any`[]\>
