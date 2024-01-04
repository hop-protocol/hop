# Class: PriceFeed

## Table of contents

### Constructors

- [constructor](PriceFeed.md#constructor)

### Properties

- [aliases](PriceFeed.md#aliases)
- [apiKeys](PriceFeed.md#apikeys)
- [cacheTimeMs](PriceFeed.md#cachetimems)
- [services](PriceFeed.md#services)
- [timeoutMs](PriceFeed.md#timeoutms)

### Methods

- [\_getPriceByTokenSymbol](PriceFeed.md#_getpricebytokensymbol)
- [formatPrice](PriceFeed.md#formatprice)
- [getPriceByTokenSymbol](PriceFeed.md#getpricebytokensymbol)
- [prependService](PriceFeed.md#prependservice)
- [setApiKeys](PriceFeed.md#setapikeys)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new PriceFeed**(`apiKeysMap?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `apiKeysMap` | `ApiKeys` |

## Properties

### <a id="aliases" name="aliases"></a> aliases

• **aliases**: `Object`

#### Index signature

▪ [tokenSymbol: `string`]: `string`

___

### <a id="apikeys" name="apikeys"></a> apiKeys

• **apiKeys**: `ApiKeys` = `{}`

___

### <a id="cachetimems" name="cachetimems"></a> cacheTimeMs

• **cacheTimeMs**: `number`

___

### <a id="services" name="services"></a> services

• **services**: `Service`[] = `[]`

___

### <a id="timeoutms" name="timeoutms"></a> timeoutMs

• **timeoutMs**: `number`

## Methods

### <a id="_getpricebytokensymbol" name="_getpricebytokensymbol"></a> \_getPriceByTokenSymbol

▸ **_getPriceByTokenSymbol**(`tokenSymbol`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenSymbol` | `string` |

#### Returns

`Promise`<`number`\>

___

### <a id="formatprice" name="formatprice"></a> formatPrice

▸ **formatPrice**(`tokenSymbol`, `price`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenSymbol` | `string` |
| `price` | `number` |

#### Returns

`number`

___

### <a id="getpricebytokensymbol" name="getpricebytokensymbol"></a> getPriceByTokenSymbol

▸ **getPriceByTokenSymbol**(`tokenSymbol`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenSymbol` | `string` |

#### Returns

`Promise`<`any`\>

___

### <a id="prependservice" name="prependservice"></a> prependService

▸ **prependService**(`service`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `service` | `Service` |

#### Returns

`void`

___

### <a id="setapikeys" name="setapikeys"></a> setApiKeys

▸ **setApiKeys**(`apiKeysMap?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `apiKeysMap` | `ApiKeys` |

#### Returns

`void`
