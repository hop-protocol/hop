# Class: PriceFeedFromS3

## Table of contents

### Constructors

- [constructor](PriceFeedFromS3.md#constructor)

### Properties

- [priceFeed](PriceFeedFromS3.md#pricefeed)

### Methods

- [getPriceByTokenSymbol](PriceFeedFromS3.md#getpricebytokensymbol)
- [setApiKeys](PriceFeedFromS3.md#setapikeys)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new PriceFeedFromS3**(`apiKeysMap?`): [`PriceFeedFromS3`](PriceFeedFromS3.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `apiKeysMap` | [`PriceFeedApiKeys`](../modules.md#pricefeedapikeys) |

#### Returns

[`PriceFeedFromS3`](PriceFeedFromS3.md)

## Properties

### <a id="pricefeed" name="pricefeed"></a> priceFeed

• **priceFeed**: [`PriceFeed`](PriceFeed.md)

## Methods

### <a id="getpricebytokensymbol" name="getpricebytokensymbol"></a> getPriceByTokenSymbol

▸ **getPriceByTokenSymbol**(`tokenSymbol`): `Promise`\<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenSymbol` | `string` |

#### Returns

`Promise`\<`number`\>

___

### <a id="setapikeys" name="setapikeys"></a> setApiKeys

▸ **setApiKeys**(`apiKeysMap?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `apiKeysMap` | [`PriceFeedApiKeys`](../modules.md#pricefeedapikeys) |

#### Returns

`void`
