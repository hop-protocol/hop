# Interface: UniswapV3Pool

## Hierarchy

- `BaseContract`

  ↳ **`UniswapV3Pool`**

## Table of contents

### Properties

- [callStatic](UniswapV3Pool.md#callstatic)
- [estimateGas](UniswapV3Pool.md#estimategas)
- [filters](UniswapV3Pool.md#filters)
- [functions](UniswapV3Pool.md#functions)
- [interface](UniswapV3Pool.md#interface)
- [off](UniswapV3Pool.md#off)
- [on](UniswapV3Pool.md#on)
- [once](UniswapV3Pool.md#once)
- [populateTransaction](UniswapV3Pool.md#populatetransaction)
- [removeListener](UniswapV3Pool.md#removelistener)

### Methods

- [attach](UniswapV3Pool.md#attach)
- [burn](UniswapV3Pool.md#burn)
- [collect](UniswapV3Pool.md#collect)
- [collectProtocol](UniswapV3Pool.md#collectprotocol)
- [connect](UniswapV3Pool.md#connect)
- [deployed](UniswapV3Pool.md#deployed)
- [factory](UniswapV3Pool.md#factory)
- [fee](UniswapV3Pool.md#fee)
- [feeGrowthGlobal0X128](UniswapV3Pool.md#feegrowthglobal0x128)
- [feeGrowthGlobal1X128](UniswapV3Pool.md#feegrowthglobal1x128)
- [flash](UniswapV3Pool.md#flash)
- [increaseObservationCardinalityNext](UniswapV3Pool.md#increaseobservationcardinalitynext)
- [initialize](UniswapV3Pool.md#initialize)
- [liquidity](UniswapV3Pool.md#liquidity)
- [listeners](UniswapV3Pool.md#listeners)
- [maxLiquidityPerTick](UniswapV3Pool.md#maxliquiditypertick)
- [mint](UniswapV3Pool.md#mint)
- [observations](UniswapV3Pool.md#observations)
- [observe](UniswapV3Pool.md#observe)
- [positions](UniswapV3Pool.md#positions)
- [protocolFees](UniswapV3Pool.md#protocolfees)
- [queryFilter](UniswapV3Pool.md#queryfilter)
- [removeAllListeners](UniswapV3Pool.md#removealllisteners)
- [setFeeProtocol](UniswapV3Pool.md#setfeeprotocol)
- [slot0](UniswapV3Pool.md#slot0)
- [snapshotCumulativesInside](UniswapV3Pool.md#snapshotcumulativesinside)
- [swap](UniswapV3Pool.md#swap)
- [tickBitmap](UniswapV3Pool.md#tickbitmap)
- [tickSpacing](UniswapV3Pool.md#tickspacing)
- [ticks](UniswapV3Pool.md#ticks)
- [token0](UniswapV3Pool.md#token0)
- [token1](UniswapV3Pool.md#token1)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `burn` | (`tickLower`: `PromiseOrValue`\<`BigNumberish`\>, `tickUpper`: `PromiseOrValue`\<`BigNumberish`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `BigNumber`] & \{ `amount0`: `BigNumber` ; `amount1`: `BigNumber`  }\> |
| `collect` | (`recipient`: `PromiseOrValue`\<`string`\>, `tickLower`: `PromiseOrValue`\<`BigNumberish`\>, `tickUpper`: `PromiseOrValue`\<`BigNumberish`\>, `amount0Requested`: `PromiseOrValue`\<`BigNumberish`\>, `amount1Requested`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `BigNumber`] & \{ `amount0`: `BigNumber` ; `amount1`: `BigNumber`  }\> |
| `collectProtocol` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount0Requested`: `PromiseOrValue`\<`BigNumberish`\>, `amount1Requested`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `BigNumber`] & \{ `amount0`: `BigNumber` ; `amount1`: `BigNumber`  }\> |
| `factory` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `fee` | (`overrides?`: `CallOverrides`) => `Promise`\<`number`\> |
| `feeGrowthGlobal0X128` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `feeGrowthGlobal1X128` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `flash` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount0`: `PromiseOrValue`\<`BigNumberish`\>, `amount1`: `PromiseOrValue`\<`BigNumberish`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `increaseObservationCardinalityNext` | (`observationCardinalityNext`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `initialize` | (`sqrtPriceX96`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `liquidity` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `maxLiquidityPerTick` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `mint` | (`recipient`: `PromiseOrValue`\<`string`\>, `tickLower`: `PromiseOrValue`\<`BigNumberish`\>, `tickUpper`: `PromiseOrValue`\<`BigNumberish`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `BigNumber`] & \{ `amount0`: `BigNumber` ; `amount1`: `BigNumber`  }\> |
| `observations` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`number`, `BigNumber`, `BigNumber`, `boolean`] & \{ `blockTimestamp`: `number` ; `initialized`: `boolean` ; `secondsPerLiquidityCumulativeX128`: `BigNumber` ; `tickCumulative`: `BigNumber`  }\> |
| `observe` | (`secondsAgos`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`[], `BigNumber`[]] & \{ `secondsPerLiquidityCumulativeX128s`: `BigNumber`[] ; `tickCumulatives`: `BigNumber`[]  }\> |
| `positions` | (`key`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`] & \{ `_liquidity`: `BigNumber` ; `feeGrowthInside0LastX128`: `BigNumber` ; `feeGrowthInside1LastX128`: `BigNumber` ; `tokensOwed0`: `BigNumber` ; `tokensOwed1`: `BigNumber`  }\> |
| `protocolFees` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `BigNumber`] & \{ `token0`: `BigNumber` ; `token1`: `BigNumber`  }\> |
| `setFeeProtocol` | (`feeProtocol0`: `PromiseOrValue`\<`BigNumberish`\>, `feeProtocol1`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `slot0` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `number`, `number`, `number`, `number`, `number`, `boolean`] & \{ `feeProtocol`: `number` ; `observationCardinality`: `number` ; `observationCardinalityNext`: `number` ; `observationIndex`: `number` ; `sqrtPriceX96`: `BigNumber` ; `tick`: `number` ; `unlocked`: `boolean`  }\> |
| `snapshotCumulativesInside` | (`tickLower`: `PromiseOrValue`\<`BigNumberish`\>, `tickUpper`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `BigNumber`, `number`] & \{ `secondsInside`: `number` ; `secondsPerLiquidityInsideX128`: `BigNumber` ; `tickCumulativeInside`: `BigNumber`  }\> |
| `swap` | (`recipient`: `PromiseOrValue`\<`string`\>, `zeroForOne`: `PromiseOrValue`\<`boolean`\>, `amountSpecified`: `PromiseOrValue`\<`BigNumberish`\>, `sqrtPriceLimitX96`: `PromiseOrValue`\<`BigNumberish`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `BigNumber`] & \{ `amount0`: `BigNumber` ; `amount1`: `BigNumber`  }\> |
| `tickBitmap` | (`wordPosition`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `tickSpacing` | (`overrides?`: `CallOverrides`) => `Promise`\<`number`\> |
| `ticks` | (`tick`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `number`, `boolean`] & \{ `feeGrowthOutside0X128`: `BigNumber` ; `feeGrowthOutside1X128`: `BigNumber` ; `initialized`: `boolean` ; `liquidityGross`: `BigNumber` ; `liquidityNet`: `BigNumber` ; `secondsOutside`: `number` ; `secondsPerLiquidityOutsideX128`: `BigNumber` ; `tickCumulativeOutside`: `BigNumber`  }\> |
| `token0` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `token1` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `burn` | (`tickLower`: `PromiseOrValue`\<`BigNumberish`\>, `tickUpper`: `PromiseOrValue`\<`BigNumberish`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `collect` | (`recipient`: `PromiseOrValue`\<`string`\>, `tickLower`: `PromiseOrValue`\<`BigNumberish`\>, `tickUpper`: `PromiseOrValue`\<`BigNumberish`\>, `amount0Requested`: `PromiseOrValue`\<`BigNumberish`\>, `amount1Requested`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `collectProtocol` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount0Requested`: `PromiseOrValue`\<`BigNumberish`\>, `amount1Requested`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `factory` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `fee` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `feeGrowthGlobal0X128` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `feeGrowthGlobal1X128` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `flash` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount0`: `PromiseOrValue`\<`BigNumberish`\>, `amount1`: `PromiseOrValue`\<`BigNumberish`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `increaseObservationCardinalityNext` | (`observationCardinalityNext`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `initialize` | (`sqrtPriceX96`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `liquidity` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `maxLiquidityPerTick` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `mint` | (`recipient`: `PromiseOrValue`\<`string`\>, `tickLower`: `PromiseOrValue`\<`BigNumberish`\>, `tickUpper`: `PromiseOrValue`\<`BigNumberish`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `observations` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `observe` | (`secondsAgos`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `positions` | (`key`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `protocolFees` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `setFeeProtocol` | (`feeProtocol0`: `PromiseOrValue`\<`BigNumberish`\>, `feeProtocol1`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `slot0` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `snapshotCumulativesInside` | (`tickLower`: `PromiseOrValue`\<`BigNumberish`\>, `tickUpper`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `swap` | (`recipient`: `PromiseOrValue`\<`string`\>, `zeroForOne`: `PromiseOrValue`\<`boolean`\>, `amountSpecified`: `PromiseOrValue`\<`BigNumberish`\>, `sqrtPriceLimitX96`: `PromiseOrValue`\<`BigNumberish`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `tickBitmap` | (`wordPosition`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `tickSpacing` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `ticks` | (`tick`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `token0` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `token1` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Burn` | (`owner?`: ``null`` \| `PromiseOrValue`\<`string`\>, `tickLower?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `tickUpper?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `amount?`: ``null``, `amount0?`: ``null``, `amount1?`: ``null``) => `BurnEventFilter` |
| `Burn(address,int24,int24,uint128,uint256,uint256)` | (`owner?`: ``null`` \| `PromiseOrValue`\<`string`\>, `tickLower?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `tickUpper?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `amount?`: ``null``, `amount0?`: ``null``, `amount1?`: ``null``) => `BurnEventFilter` |
| `Collect` | (`owner?`: ``null`` \| `PromiseOrValue`\<`string`\>, `recipient?`: ``null``, `tickLower?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `tickUpper?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `amount0?`: ``null``, `amount1?`: ``null``) => `CollectEventFilter` |
| `Collect(address,address,int24,int24,uint128,uint128)` | (`owner?`: ``null`` \| `PromiseOrValue`\<`string`\>, `recipient?`: ``null``, `tickLower?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `tickUpper?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `amount0?`: ``null``, `amount1?`: ``null``) => `CollectEventFilter` |
| `CollectProtocol` | (`sender?`: ``null`` \| `PromiseOrValue`\<`string`\>, `recipient?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount0?`: ``null``, `amount1?`: ``null``) => `CollectProtocolEventFilter` |
| `CollectProtocol(address,address,uint128,uint128)` | (`sender?`: ``null`` \| `PromiseOrValue`\<`string`\>, `recipient?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount0?`: ``null``, `amount1?`: ``null``) => `CollectProtocolEventFilter` |
| `Flash` | (`sender?`: ``null`` \| `PromiseOrValue`\<`string`\>, `recipient?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount0?`: ``null``, `amount1?`: ``null``, `paid0?`: ``null``, `paid1?`: ``null``) => `FlashEventFilter` |
| `Flash(address,address,uint256,uint256,uint256,uint256)` | (`sender?`: ``null`` \| `PromiseOrValue`\<`string`\>, `recipient?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount0?`: ``null``, `amount1?`: ``null``, `paid0?`: ``null``, `paid1?`: ``null``) => `FlashEventFilter` |
| `IncreaseObservationCardinalityNext` | (`observationCardinalityNextOld?`: ``null``, `observationCardinalityNextNew?`: ``null``) => `IncreaseObservationCardinalityNextEventFilter` |
| `IncreaseObservationCardinalityNext(uint16,uint16)` | (`observationCardinalityNextOld?`: ``null``, `observationCardinalityNextNew?`: ``null``) => `IncreaseObservationCardinalityNextEventFilter` |
| `Initialize` | (`sqrtPriceX96?`: ``null``, `tick?`: ``null``) => `InitializeEventFilter` |
| `Initialize(uint160,int24)` | (`sqrtPriceX96?`: ``null``, `tick?`: ``null``) => `InitializeEventFilter` |
| `Mint` | (`sender?`: ``null``, `owner?`: ``null`` \| `PromiseOrValue`\<`string`\>, `tickLower?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `tickUpper?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `amount?`: ``null``, `amount0?`: ``null``, `amount1?`: ``null``) => `MintEventFilter` |
| `Mint(address,address,int24,int24,uint128,uint256,uint256)` | (`sender?`: ``null``, `owner?`: ``null`` \| `PromiseOrValue`\<`string`\>, `tickLower?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `tickUpper?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `amount?`: ``null``, `amount0?`: ``null``, `amount1?`: ``null``) => `MintEventFilter` |
| `SetFeeProtocol` | (`feeProtocol0Old?`: ``null``, `feeProtocol1Old?`: ``null``, `feeProtocol0New?`: ``null``, `feeProtocol1New?`: ``null``) => `SetFeeProtocolEventFilter` |
| `SetFeeProtocol(uint8,uint8,uint8,uint8)` | (`feeProtocol0Old?`: ``null``, `feeProtocol1Old?`: ``null``, `feeProtocol0New?`: ``null``, `feeProtocol1New?`: ``null``) => `SetFeeProtocolEventFilter` |
| `Swap` | (`sender?`: ``null`` \| `PromiseOrValue`\<`string`\>, `recipient?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount0?`: ``null``, `amount1?`: ``null``, `sqrtPriceX96?`: ``null``, `liquidity?`: ``null``, `tick?`: ``null``) => `SwapEventFilter` |
| `Swap(address,address,int256,int256,uint160,uint128,int24)` | (`sender?`: ``null`` \| `PromiseOrValue`\<`string`\>, `recipient?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount0?`: ``null``, `amount1?`: ``null``, `sqrtPriceX96?`: ``null``, `liquidity?`: ``null``, `tick?`: ``null``) => `SwapEventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `burn` | (`tickLower`: `PromiseOrValue`\<`BigNumberish`\>, `tickUpper`: `PromiseOrValue`\<`BigNumberish`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `collect` | (`recipient`: `PromiseOrValue`\<`string`\>, `tickLower`: `PromiseOrValue`\<`BigNumberish`\>, `tickUpper`: `PromiseOrValue`\<`BigNumberish`\>, `amount0Requested`: `PromiseOrValue`\<`BigNumberish`\>, `amount1Requested`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `collectProtocol` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount0Requested`: `PromiseOrValue`\<`BigNumberish`\>, `amount1Requested`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `factory` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `fee` | (`overrides?`: `CallOverrides`) => `Promise`\<[`number`]\> |
| `feeGrowthGlobal0X128` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `feeGrowthGlobal1X128` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `flash` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount0`: `PromiseOrValue`\<`BigNumberish`\>, `amount1`: `PromiseOrValue`\<`BigNumberish`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `increaseObservationCardinalityNext` | (`observationCardinalityNext`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `initialize` | (`sqrtPriceX96`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `liquidity` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `maxLiquidityPerTick` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `mint` | (`recipient`: `PromiseOrValue`\<`string`\>, `tickLower`: `PromiseOrValue`\<`BigNumberish`\>, `tickUpper`: `PromiseOrValue`\<`BigNumberish`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `observations` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`number`, `BigNumber`, `BigNumber`, `boolean`] & \{ `blockTimestamp`: `number` ; `initialized`: `boolean` ; `secondsPerLiquidityCumulativeX128`: `BigNumber` ; `tickCumulative`: `BigNumber`  }\> |
| `observe` | (`secondsAgos`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`[], `BigNumber`[]] & \{ `secondsPerLiquidityCumulativeX128s`: `BigNumber`[] ; `tickCumulatives`: `BigNumber`[]  }\> |
| `positions` | (`key`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`] & \{ `_liquidity`: `BigNumber` ; `feeGrowthInside0LastX128`: `BigNumber` ; `feeGrowthInside1LastX128`: `BigNumber` ; `tokensOwed0`: `BigNumber` ; `tokensOwed1`: `BigNumber`  }\> |
| `protocolFees` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `BigNumber`] & \{ `token0`: `BigNumber` ; `token1`: `BigNumber`  }\> |
| `setFeeProtocol` | (`feeProtocol0`: `PromiseOrValue`\<`BigNumberish`\>, `feeProtocol1`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `slot0` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `number`, `number`, `number`, `number`, `number`, `boolean`] & \{ `feeProtocol`: `number` ; `observationCardinality`: `number` ; `observationCardinalityNext`: `number` ; `observationIndex`: `number` ; `sqrtPriceX96`: `BigNumber` ; `tick`: `number` ; `unlocked`: `boolean`  }\> |
| `snapshotCumulativesInside` | (`tickLower`: `PromiseOrValue`\<`BigNumberish`\>, `tickUpper`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `BigNumber`, `number`] & \{ `secondsInside`: `number` ; `secondsPerLiquidityInsideX128`: `BigNumber` ; `tickCumulativeInside`: `BigNumber`  }\> |
| `swap` | (`recipient`: `PromiseOrValue`\<`string`\>, `zeroForOne`: `PromiseOrValue`\<`boolean`\>, `amountSpecified`: `PromiseOrValue`\<`BigNumberish`\>, `sqrtPriceLimitX96`: `PromiseOrValue`\<`BigNumberish`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `tickBitmap` | (`wordPosition`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `tickSpacing` | (`overrides?`: `CallOverrides`) => `Promise`\<[`number`]\> |
| `ticks` | (`tick`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `number`, `boolean`] & \{ `feeGrowthOutside0X128`: `BigNumber` ; `feeGrowthOutside1X128`: `BigNumber` ; `initialized`: `boolean` ; `liquidityGross`: `BigNumber` ; `liquidityNet`: `BigNumber` ; `secondsOutside`: `number` ; `secondsPerLiquidityOutsideX128`: `BigNumber` ; `tickCumulativeOutside`: `BigNumber`  }\> |
| `token0` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `token1` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `UniswapV3PoolInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`UniswapV3Pool`](UniswapV3Pool.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`UniswapV3Pool`](UniswapV3Pool.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`UniswapV3Pool`](UniswapV3Pool.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `burn` | (`tickLower`: `PromiseOrValue`\<`BigNumberish`\>, `tickUpper`: `PromiseOrValue`\<`BigNumberish`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `collect` | (`recipient`: `PromiseOrValue`\<`string`\>, `tickLower`: `PromiseOrValue`\<`BigNumberish`\>, `tickUpper`: `PromiseOrValue`\<`BigNumberish`\>, `amount0Requested`: `PromiseOrValue`\<`BigNumberish`\>, `amount1Requested`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `collectProtocol` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount0Requested`: `PromiseOrValue`\<`BigNumberish`\>, `amount1Requested`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `factory` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `fee` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `feeGrowthGlobal0X128` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `feeGrowthGlobal1X128` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `flash` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount0`: `PromiseOrValue`\<`BigNumberish`\>, `amount1`: `PromiseOrValue`\<`BigNumberish`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `increaseObservationCardinalityNext` | (`observationCardinalityNext`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `initialize` | (`sqrtPriceX96`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `liquidity` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `maxLiquidityPerTick` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `mint` | (`recipient`: `PromiseOrValue`\<`string`\>, `tickLower`: `PromiseOrValue`\<`BigNumberish`\>, `tickUpper`: `PromiseOrValue`\<`BigNumberish`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `observations` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `observe` | (`secondsAgos`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `positions` | (`key`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `protocolFees` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `setFeeProtocol` | (`feeProtocol0`: `PromiseOrValue`\<`BigNumberish`\>, `feeProtocol1`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `slot0` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `snapshotCumulativesInside` | (`tickLower`: `PromiseOrValue`\<`BigNumberish`\>, `tickUpper`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `swap` | (`recipient`: `PromiseOrValue`\<`string`\>, `zeroForOne`: `PromiseOrValue`\<`boolean`\>, `amountSpecified`: `PromiseOrValue`\<`BigNumberish`\>, `sqrtPriceLimitX96`: `PromiseOrValue`\<`BigNumberish`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `tickBitmap` | (`wordPosition`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `tickSpacing` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `ticks` | (`tick`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `token0` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `token1` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`UniswapV3Pool`](UniswapV3Pool.md)\>

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

### <a id="burn" name="burn"></a> burn

▸ **burn**(`tickLower`, `tickUpper`, `amount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tickLower` | `PromiseOrValue`\<`BigNumberish`\> |
| `tickUpper` | `PromiseOrValue`\<`BigNumberish`\> |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="collect" name="collect"></a> collect

▸ **collect**(`recipient`, `tickLower`, `tickUpper`, `amount0Requested`, `amount1Requested`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `recipient` | `PromiseOrValue`\<`string`\> |
| `tickLower` | `PromiseOrValue`\<`BigNumberish`\> |
| `tickUpper` | `PromiseOrValue`\<`BigNumberish`\> |
| `amount0Requested` | `PromiseOrValue`\<`BigNumberish`\> |
| `amount1Requested` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="collectprotocol" name="collectprotocol"></a> collectProtocol

▸ **collectProtocol**(`recipient`, `amount0Requested`, `amount1Requested`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `recipient` | `PromiseOrValue`\<`string`\> |
| `amount0Requested` | `PromiseOrValue`\<`BigNumberish`\> |
| `amount1Requested` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

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

▸ **deployed**(): `Promise`\<[`UniswapV3Pool`](UniswapV3Pool.md)\>

#### Returns

`Promise`\<[`UniswapV3Pool`](UniswapV3Pool.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="factory" name="factory"></a> factory

▸ **factory**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="fee" name="fee"></a> fee

▸ **fee**(`overrides?`): `Promise`\<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`number`\>

___

### <a id="feegrowthglobal0x128" name="feegrowthglobal0x128"></a> feeGrowthGlobal0X128

▸ **feeGrowthGlobal0X128**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="feegrowthglobal1x128" name="feegrowthglobal1x128"></a> feeGrowthGlobal1X128

▸ **feeGrowthGlobal1X128**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="flash" name="flash"></a> flash

▸ **flash**(`recipient`, `amount0`, `amount1`, `data`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `recipient` | `PromiseOrValue`\<`string`\> |
| `amount0` | `PromiseOrValue`\<`BigNumberish`\> |
| `amount1` | `PromiseOrValue`\<`BigNumberish`\> |
| `data` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="increaseobservationcardinalitynext" name="increaseobservationcardinalitynext"></a> increaseObservationCardinalityNext

▸ **increaseObservationCardinalityNext**(`observationCardinalityNext`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `observationCardinalityNext` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="initialize" name="initialize"></a> initialize

▸ **initialize**(`sqrtPriceX96`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sqrtPriceX96` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="liquidity" name="liquidity"></a> liquidity

▸ **liquidity**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

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

### <a id="maxliquiditypertick" name="maxliquiditypertick"></a> maxLiquidityPerTick

▸ **maxLiquidityPerTick**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="mint" name="mint"></a> mint

▸ **mint**(`recipient`, `tickLower`, `tickUpper`, `amount`, `data`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `recipient` | `PromiseOrValue`\<`string`\> |
| `tickLower` | `PromiseOrValue`\<`BigNumberish`\> |
| `tickUpper` | `PromiseOrValue`\<`BigNumberish`\> |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `data` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="observations" name="observations"></a> observations

▸ **observations**(`index`, `overrides?`): `Promise`\<[`number`, `BigNumber`, `BigNumber`, `boolean`] & \{ `blockTimestamp`: `number` ; `initialized`: `boolean` ; `secondsPerLiquidityCumulativeX128`: `BigNumber` ; `tickCumulative`: `BigNumber`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<[`number`, `BigNumber`, `BigNumber`, `boolean`] & \{ `blockTimestamp`: `number` ; `initialized`: `boolean` ; `secondsPerLiquidityCumulativeX128`: `BigNumber` ; `tickCumulative`: `BigNumber`  }\>

___

### <a id="observe" name="observe"></a> observe

▸ **observe**(`secondsAgos`, `overrides?`): `Promise`\<[`BigNumber`[], `BigNumber`[]] & \{ `secondsPerLiquidityCumulativeX128s`: `BigNumber`[] ; `tickCumulatives`: `BigNumber`[]  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `secondsAgos` | `PromiseOrValue`\<`BigNumberish`\>[] |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<[`BigNumber`[], `BigNumber`[]] & \{ `secondsPerLiquidityCumulativeX128s`: `BigNumber`[] ; `tickCumulatives`: `BigNumber`[]  }\>

___

### <a id="positions" name="positions"></a> positions

▸ **positions**(`key`, `overrides?`): `Promise`\<[`BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`] & \{ `_liquidity`: `BigNumber` ; `feeGrowthInside0LastX128`: `BigNumber` ; `feeGrowthInside1LastX128`: `BigNumber` ; `tokensOwed0`: `BigNumber` ; `tokensOwed1`: `BigNumber`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<[`BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`] & \{ `_liquidity`: `BigNumber` ; `feeGrowthInside0LastX128`: `BigNumber` ; `feeGrowthInside1LastX128`: `BigNumber` ; `tokensOwed0`: `BigNumber` ; `tokensOwed1`: `BigNumber`  }\>

___

### <a id="protocolfees" name="protocolfees"></a> protocolFees

▸ **protocolFees**(`overrides?`): `Promise`\<[`BigNumber`, `BigNumber`] & \{ `token0`: `BigNumber` ; `token1`: `BigNumber`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<[`BigNumber`, `BigNumber`] & \{ `token0`: `BigNumber` ; `token1`: `BigNumber`  }\>

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

___

### <a id="setfeeprotocol" name="setfeeprotocol"></a> setFeeProtocol

▸ **setFeeProtocol**(`feeProtocol0`, `feeProtocol1`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `feeProtocol0` | `PromiseOrValue`\<`BigNumberish`\> |
| `feeProtocol1` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="slot0" name="slot0"></a> slot0

▸ **slot0**(`overrides?`): `Promise`\<[`BigNumber`, `number`, `number`, `number`, `number`, `number`, `boolean`] & \{ `feeProtocol`: `number` ; `observationCardinality`: `number` ; `observationCardinalityNext`: `number` ; `observationIndex`: `number` ; `sqrtPriceX96`: `BigNumber` ; `tick`: `number` ; `unlocked`: `boolean`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<[`BigNumber`, `number`, `number`, `number`, `number`, `number`, `boolean`] & \{ `feeProtocol`: `number` ; `observationCardinality`: `number` ; `observationCardinalityNext`: `number` ; `observationIndex`: `number` ; `sqrtPriceX96`: `BigNumber` ; `tick`: `number` ; `unlocked`: `boolean`  }\>

___

### <a id="snapshotcumulativesinside" name="snapshotcumulativesinside"></a> snapshotCumulativesInside

▸ **snapshotCumulativesInside**(`tickLower`, `tickUpper`, `overrides?`): `Promise`\<[`BigNumber`, `BigNumber`, `number`] & \{ `secondsInside`: `number` ; `secondsPerLiquidityInsideX128`: `BigNumber` ; `tickCumulativeInside`: `BigNumber`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tickLower` | `PromiseOrValue`\<`BigNumberish`\> |
| `tickUpper` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<[`BigNumber`, `BigNumber`, `number`] & \{ `secondsInside`: `number` ; `secondsPerLiquidityInsideX128`: `BigNumber` ; `tickCumulativeInside`: `BigNumber`  }\>

___

### <a id="swap" name="swap"></a> swap

▸ **swap**(`recipient`, `zeroForOne`, `amountSpecified`, `sqrtPriceLimitX96`, `data`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `recipient` | `PromiseOrValue`\<`string`\> |
| `zeroForOne` | `PromiseOrValue`\<`boolean`\> |
| `amountSpecified` | `PromiseOrValue`\<`BigNumberish`\> |
| `sqrtPriceLimitX96` | `PromiseOrValue`\<`BigNumberish`\> |
| `data` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="tickbitmap" name="tickbitmap"></a> tickBitmap

▸ **tickBitmap**(`wordPosition`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `wordPosition` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="tickspacing" name="tickspacing"></a> tickSpacing

▸ **tickSpacing**(`overrides?`): `Promise`\<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`number`\>

___

### <a id="ticks" name="ticks"></a> ticks

▸ **ticks**(`tick`, `overrides?`): `Promise`\<[`BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `number`, `boolean`] & \{ `feeGrowthOutside0X128`: `BigNumber` ; `feeGrowthOutside1X128`: `BigNumber` ; `initialized`: `boolean` ; `liquidityGross`: `BigNumber` ; `liquidityNet`: `BigNumber` ; `secondsOutside`: `number` ; `secondsPerLiquidityOutsideX128`: `BigNumber` ; `tickCumulativeOutside`: `BigNumber`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tick` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<[`BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `BigNumber`, `number`, `boolean`] & \{ `feeGrowthOutside0X128`: `BigNumber` ; `feeGrowthOutside1X128`: `BigNumber` ; `initialized`: `boolean` ; `liquidityGross`: `BigNumber` ; `liquidityNet`: `BigNumber` ; `secondsOutside`: `number` ; `secondsPerLiquidityOutsideX128`: `BigNumber` ; `tickCumulativeOutside`: `BigNumber`  }\>

___

### <a id="token0" name="token0"></a> token0

▸ **token0**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="token1" name="token1"></a> token1

▸ **token1**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>
