# Class: Multicall

## Table of contents

### Constructors

- [constructor](Multicall.md#constructor)

### Properties

- [accountAddress](Multicall.md#accountaddress)
- [network](Multicall.md#network)
- [priceFeed](Multicall.md#pricefeed)

### Methods

- [getBalances](Multicall.md#getbalances)
- [getBalancesForChain](Multicall.md#getbalancesforchain)
- [getChains](Multicall.md#getchains)
- [getMulticallAddressForChain](Multicall.md#getmulticalladdressforchain)
- [getProvider](Multicall.md#getprovider)
- [getTokenAddressesForChain](Multicall.md#gettokenaddressesforchain)
- [multicall](Multicall.md#multicall)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new Multicall**(`config`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `Config` |

## Properties

### <a id="accountaddress" name="accountaddress"></a> accountAddress

• **accountAddress**: `string`

___

### <a id="network" name="network"></a> network

• **network**: `string`

___

### <a id="pricefeed" name="pricefeed"></a> priceFeed

• **priceFeed**: `PriceFeedFromS3`

## Methods

### <a id="getbalances" name="getbalances"></a> getBalances

▸ **getBalances**(): `Promise`<`Balance`[]\>

#### Returns

`Promise`<`Balance`[]\>

___

### <a id="getbalancesforchain" name="getbalancesforchain"></a> getBalancesForChain

▸ **getBalancesForChain**(`chainSlug`, `opts?`): `Promise`<`Balance`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainSlug` | `string` |
| `opts?` | [`GetMulticallBalanceOptions`](../modules.md#getmulticallbalanceoptions)[] |

#### Returns

`Promise`<`Balance`[]\>

___

### <a id="getchains" name="getchains"></a> getChains

▸ **getChains**(): `string`[]

#### Returns

`string`[]

___

### <a id="getmulticalladdressforchain" name="getmulticalladdressforchain"></a> getMulticallAddressForChain

▸ **getMulticallAddressForChain**(`chainSlug`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainSlug` | `string` |

#### Returns

`string`

___

### <a id="getprovider" name="getprovider"></a> getProvider

▸ **getProvider**(`chainSlug`): `Provider`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainSlug` | `string` |

#### Returns

`Provider`

___

### <a id="gettokenaddressesforchain" name="gettokenaddressesforchain"></a> getTokenAddressesForChain

▸ **getTokenAddressesForChain**(`chainSlug`): `TokenAddress`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainSlug` | `string` |

#### Returns

`TokenAddress`[]

___

### <a id="multicall" name="multicall"></a> multicall

▸ **multicall**(`chainSlug`, `options`): `Promise`<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainSlug` | `string` |
| `options` | `any`[] |

#### Returns

`Promise`<`any`[]\>
