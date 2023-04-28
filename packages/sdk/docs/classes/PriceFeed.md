# Class: PriceFeed

## Table of contents

### Constructors

- [constructor](PriceFeed.md#constructor)

### Properties

- [aliases](PriceFeed.md#aliases)
- [apiKeys](PriceFeed.md#apikeys)
- [cacheTimeMs](PriceFeed.md#cachetimems)
- [services](PriceFeed.md#services)

### Methods

- [\_getPriceByTokenSymbol](PriceFeed.md#_getpricebytokensymbol)
- [getPriceByTokenSymbol](PriceFeed.md#getpricebytokensymbol)
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

### <a id="getpricebytokensymbol" name="getpricebytokensymbol"></a> getPriceByTokenSymbol

▸ **getPriceByTokenSymbol**(`tokenSymbol`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenSymbol` | `string` |

#### Returns

`Promise`<`any`\>

___

### <a id="setapikeys" name="setapikeys"></a> setApiKeys

▸ **setApiKeys**(`apiKeysMap?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `apiKeysMap` | `ApiKeys` |

#### Returns

`void`
