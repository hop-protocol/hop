# Namespace: utils

## Table of contents

### Functions

- [getBlockNumberFromDate](utils.md#getblocknumberfromdate)
- [getChainSlugFromName](utils.md#getchainslugfromname)
- [getProviderFromUrl](utils.md#getproviderfromurl)
- [getProviderWithFallbacks](utils.md#getproviderwithfallbacks)
- [getUrlFromProvider](utils.md#geturlfromprovider)
- [promiseTimeout](utils.md#promisetimeout)
- [rateLimitRetry](utils.md#ratelimitretry)
- [serializeQueryParams](utils.md#serializequeryparams)
- [shiftBNDecimals](utils.md#shiftbndecimals)
- [wait](utils.md#wait)

## Functions

### <a id="getblocknumberfromdate" name="getblocknumberfromdate"></a> getBlockNumberFromDate

▸ **getBlockNumberFromDate**(`chain`, `timestamp`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | [`Chain`](../classes/Chain.md) |
| `timestamp` | `number` |

#### Returns

`Promise`<`number`\>

___

### <a id="getchainslugfromname" name="getchainslugfromname"></a> getChainSlugFromName

▸ **getChainSlugFromName**(`name`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`string`

___

### <a id="getproviderfromurl" name="getproviderfromurl"></a> getProviderFromUrl

▸ **getProviderFromUrl**(`rpcUrl`): `providers.Provider`

#### Parameters

| Name | Type |
| :------ | :------ |
| `rpcUrl` | `string` \| `string`[] |

#### Returns

`providers.Provider`

___

### <a id="getproviderwithfallbacks" name="getproviderwithfallbacks"></a> getProviderWithFallbacks

▸ **getProviderWithFallbacks**(`rpcUrls`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `rpcUrls` | `string`[] |

#### Returns

`any`

___

### <a id="geturlfromprovider" name="geturlfromprovider"></a> getUrlFromProvider

▸ **getUrlFromProvider**(`provider`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `provider` | `any` |

#### Returns

`any`

___

### <a id="promisetimeout" name="promisetimeout"></a> promiseTimeout

▸ **promiseTimeout**<`T`\>(`promise`, `timeout`): `Promise`<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `promise` | `Promise`<`T`\> |
| `timeout` | `number` |

#### Returns

`Promise`<`T`\>

___

### <a id="ratelimitretry" name="ratelimitretry"></a> rateLimitRetry

▸ **rateLimitRetry**<`FN`\>(`fn`): (...`args`: `Parameters`<`FN`\>) => `Promise`<`Awaited`<`ReturnType`<`FN`\>\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `FN` | extends (...`args`: `any`[]) => `Promise`<`any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | `FN` |

#### Returns

`fn`

▸ (...`args`): `Promise`<`Awaited`<`ReturnType`<`FN`\>\>\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `Parameters`<`FN`\> |

##### Returns

`Promise`<`Awaited`<`ReturnType`<`FN`\>\>\>

___

### <a id="serializequeryparams" name="serializequeryparams"></a> serializeQueryParams

▸ **serializeQueryParams**(`params`, `options?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `any` |
| `options` | `Partial`<`IOptions`\> |

#### Returns

`string`

___

### <a id="shiftbndecimals" name="shiftbndecimals"></a> shiftBNDecimals

▸ **shiftBNDecimals**(`bn`, `shiftAmount`): `BigNumber`

#### Parameters

| Name | Type |
| :------ | :------ |
| `bn` | `BigNumber` |
| `shiftAmount` | `number` |

#### Returns

`BigNumber`

___

### <a id="wait" name="wait"></a> wait

▸ **wait**(`timeoutMs`): `Promise`<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `timeoutMs` | `number` |

#### Returns

`Promise`<`unknown`\>
