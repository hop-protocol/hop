# Interface: UniswapQuoterV2

## Hierarchy

- `BaseContract`

  ↳ **`UniswapQuoterV2`**

## Table of contents

### Properties

- [callStatic](UniswapQuoterV2.md#callstatic)
- [estimateGas](UniswapQuoterV2.md#estimategas)
- [filters](UniswapQuoterV2.md#filters)
- [functions](UniswapQuoterV2.md#functions)
- [interface](UniswapQuoterV2.md#interface)
- [off](UniswapQuoterV2.md#off)
- [on](UniswapQuoterV2.md#on)
- [once](UniswapQuoterV2.md#once)
- [populateTransaction](UniswapQuoterV2.md#populatetransaction)
- [removeListener](UniswapQuoterV2.md#removelistener)

### Methods

- [attach](UniswapQuoterV2.md#attach)
- [connect](UniswapQuoterV2.md#connect)
- [deployed](UniswapQuoterV2.md#deployed)
- [listeners](UniswapQuoterV2.md#listeners)
- [queryFilter](UniswapQuoterV2.md#queryfilter)
- [quoteExactInput](UniswapQuoterV2.md#quoteexactinput)
- [quoteExactInputSingle](UniswapQuoterV2.md#quoteexactinputsingle)
- [quoteExactOutput](UniswapQuoterV2.md#quoteexactoutput)
- [quoteExactOutputSingle](UniswapQuoterV2.md#quoteexactoutputsingle)
- [removeAllListeners](UniswapQuoterV2.md#removealllisteners)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `quoteExactInput` | (`path`: `PromiseOrValue`\<`BytesLike`\>, `amountIn`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `quoteExactInputSingle` | (`tokenIn`: `PromiseOrValue`\<`string`\>, `tokenOut`: `PromiseOrValue`\<`string`\>, `fee`: `PromiseOrValue`\<`BigNumberish`\>, `amountIn`: `PromiseOrValue`\<`BigNumberish`\>, `sqrtPriceLimitX96`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `quoteExactOutput` | (`path`: `PromiseOrValue`\<`BytesLike`\>, `amountOut`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `quoteExactOutputSingle` | (`tokenIn`: `PromiseOrValue`\<`string`\>, `tokenOut`: `PromiseOrValue`\<`string`\>, `fee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOut`: `PromiseOrValue`\<`BigNumberish`\>, `sqrtPriceLimitX96`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `quoteExactInput` | (`path`: `PromiseOrValue`\<`BytesLike`\>, `amountIn`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `quoteExactInputSingle` | (`tokenIn`: `PromiseOrValue`\<`string`\>, `tokenOut`: `PromiseOrValue`\<`string`\>, `fee`: `PromiseOrValue`\<`BigNumberish`\>, `amountIn`: `PromiseOrValue`\<`BigNumberish`\>, `sqrtPriceLimitX96`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `quoteExactOutput` | (`path`: `PromiseOrValue`\<`BytesLike`\>, `amountOut`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `quoteExactOutputSingle` | (`tokenIn`: `PromiseOrValue`\<`string`\>, `tokenOut`: `PromiseOrValue`\<`string`\>, `fee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOut`: `PromiseOrValue`\<`BigNumberish`\>, `sqrtPriceLimitX96`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `quoteExactInput` | (`path`: `PromiseOrValue`\<`BytesLike`\>, `amountIn`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `quoteExactInputSingle` | (`tokenIn`: `PromiseOrValue`\<`string`\>, `tokenOut`: `PromiseOrValue`\<`string`\>, `fee`: `PromiseOrValue`\<`BigNumberish`\>, `amountIn`: `PromiseOrValue`\<`BigNumberish`\>, `sqrtPriceLimitX96`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `quoteExactOutput` | (`path`: `PromiseOrValue`\<`BytesLike`\>, `amountOut`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `quoteExactOutputSingle` | (`tokenIn`: `PromiseOrValue`\<`string`\>, `tokenOut`: `PromiseOrValue`\<`string`\>, `fee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOut`: `PromiseOrValue`\<`BigNumberish`\>, `sqrtPriceLimitX96`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `UniswapQuoterV2Interface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`UniswapQuoterV2`](UniswapQuoterV2.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`UniswapQuoterV2`](UniswapQuoterV2.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`UniswapQuoterV2`](UniswapQuoterV2.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `quoteExactInput` | (`path`: `PromiseOrValue`\<`BytesLike`\>, `amountIn`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `quoteExactInputSingle` | (`tokenIn`: `PromiseOrValue`\<`string`\>, `tokenOut`: `PromiseOrValue`\<`string`\>, `fee`: `PromiseOrValue`\<`BigNumberish`\>, `amountIn`: `PromiseOrValue`\<`BigNumberish`\>, `sqrtPriceLimitX96`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `quoteExactOutput` | (`path`: `PromiseOrValue`\<`BytesLike`\>, `amountOut`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `quoteExactOutputSingle` | (`tokenIn`: `PromiseOrValue`\<`string`\>, `tokenOut`: `PromiseOrValue`\<`string`\>, `fee`: `PromiseOrValue`\<`BigNumberish`\>, `amountOut`: `PromiseOrValue`\<`BigNumberish`\>, `sqrtPriceLimitX96`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`UniswapQuoterV2`](UniswapQuoterV2.md)\>

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

### <a id="deployed" name="deployed"></a> deployed

▸ **deployed**(): `Promise`\<[`UniswapQuoterV2`](UniswapQuoterV2.md)\>

#### Returns

`Promise`\<[`UniswapQuoterV2`](UniswapQuoterV2.md)\>

#### Overrides

BaseContract.deployed

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

### <a id="quoteexactinput" name="quoteexactinput"></a> quoteExactInput

▸ **quoteExactInput**(`path`, `amountIn`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `PromiseOrValue`\<`BytesLike`\> |
| `amountIn` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="quoteexactinputsingle" name="quoteexactinputsingle"></a> quoteExactInputSingle

▸ **quoteExactInputSingle**(`tokenIn`, `tokenOut`, `fee`, `amountIn`, `sqrtPriceLimitX96`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenIn` | `PromiseOrValue`\<`string`\> |
| `tokenOut` | `PromiseOrValue`\<`string`\> |
| `fee` | `PromiseOrValue`\<`BigNumberish`\> |
| `amountIn` | `PromiseOrValue`\<`BigNumberish`\> |
| `sqrtPriceLimitX96` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="quoteexactoutput" name="quoteexactoutput"></a> quoteExactOutput

▸ **quoteExactOutput**(`path`, `amountOut`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `PromiseOrValue`\<`BytesLike`\> |
| `amountOut` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="quoteexactoutputsingle" name="quoteexactoutputsingle"></a> quoteExactOutputSingle

▸ **quoteExactOutputSingle**(`tokenIn`, `tokenOut`, `fee`, `amountOut`, `sqrtPriceLimitX96`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenIn` | `PromiseOrValue`\<`string`\> |
| `tokenOut` | `PromiseOrValue`\<`string`\> |
| `fee` | `PromiseOrValue`\<`BigNumberish`\> |
| `amountOut` | `PromiseOrValue`\<`BigNumberish`\> |
| `sqrtPriceLimitX96` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

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
