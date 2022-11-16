# Class: RelayerFee

## Table of contents

### Constructors

- [constructor](RelayerFee.md#constructor)

### Properties

- [relayerFee](RelayerFee.md#relayerfee)

### Methods

- [getRelayCost](RelayerFee.md#getrelaycost)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new RelayerFee**(`network`, `token`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `network` | `string` |
| `token` | `string` |

## Properties

### <a id="relayerfee" name="relayerfee"></a> relayerFee

• **relayerFee**: `Object` = `{}`

#### Index signature

▪ [chain: `string`]: `RelayChain`

## Methods

### <a id="getrelaycost" name="getrelaycost"></a> getRelayCost

▸ **getRelayCost**(`chainSlug`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainSlug` | `string` |

#### Returns

`Promise`<`BigNumber`\>
