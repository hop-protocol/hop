# Interface: Multicall3

## Hierarchy

- `BaseContract`

  ↳ **`Multicall3`**

## Table of contents

### Properties

- [callStatic](Multicall3-1.md#callstatic)
- [estimateGas](Multicall3-1.md#estimategas)
- [filters](Multicall3-1.md#filters)
- [functions](Multicall3-1.md#functions)
- [interface](Multicall3-1.md#interface)
- [off](Multicall3-1.md#off)
- [on](Multicall3-1.md#on)
- [once](Multicall3-1.md#once)
- [populateTransaction](Multicall3-1.md#populatetransaction)
- [removeListener](Multicall3-1.md#removelistener)

### Methods

- [aggregate](Multicall3-1.md#aggregate)
- [aggregate3](Multicall3-1.md#aggregate3)
- [aggregate3Value](Multicall3-1.md#aggregate3value)
- [attach](Multicall3-1.md#attach)
- [blockAndAggregate](Multicall3-1.md#blockandaggregate)
- [connect](Multicall3-1.md#connect)
- [deployed](Multicall3-1.md#deployed)
- [getBasefee](Multicall3-1.md#getbasefee)
- [getBlockHash](Multicall3-1.md#getblockhash)
- [getBlockNumber](Multicall3-1.md#getblocknumber)
- [getChainId](Multicall3-1.md#getchainid)
- [getCurrentBlockCoinbase](Multicall3-1.md#getcurrentblockcoinbase)
- [getCurrentBlockDifficulty](Multicall3-1.md#getcurrentblockdifficulty)
- [getCurrentBlockGasLimit](Multicall3-1.md#getcurrentblockgaslimit)
- [getCurrentBlockTimestamp](Multicall3-1.md#getcurrentblocktimestamp)
- [getEthBalance](Multicall3-1.md#getethbalance)
- [getLastBlockHash](Multicall3-1.md#getlastblockhash)
- [listeners](Multicall3-1.md#listeners)
- [queryFilter](Multicall3-1.md#queryfilter)
- [removeAllListeners](Multicall3-1.md#removealllisteners)
- [tryAggregate](Multicall3-1.md#tryaggregate)
- [tryBlockAndAggregate](Multicall3-1.md#tryblockandaggregate)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `aggregate` | (`calls`: [`CallStruct`](../modules/Multicall3.md#callstruct)[], `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `string`[]] & \{ `blockNumber`: `BigNumber` ; `returnData`: `string`[]  }\> |
| `aggregate3` | (`calls`: [`Call3Struct`](../modules/Multicall3.md#call3struct)[], `overrides?`: `CallOverrides`) => `Promise`\<[`ResultStructOutput`](../modules/Multicall3.md#resultstructoutput)[]\> |
| `aggregate3Value` | (`calls`: [`Call3ValueStruct`](../modules/Multicall3.md#call3valuestruct)[], `overrides?`: `CallOverrides`) => `Promise`\<[`ResultStructOutput`](../modules/Multicall3.md#resultstructoutput)[]\> |
| `blockAndAggregate` | (`calls`: [`CallStruct`](../modules/Multicall3.md#callstruct)[], `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `string`, [`ResultStructOutput`](../modules/Multicall3.md#resultstructoutput)[]] & \{ `blockHash`: `string` ; `blockNumber`: `BigNumber` ; `returnData`: [`ResultStructOutput`](../modules/Multicall3.md#resultstructoutput)[]  }\> |
| `getBasefee` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getBlockHash` | (`blockNumber`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `getBlockNumber` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getCurrentBlockCoinbase` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `getCurrentBlockDifficulty` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getCurrentBlockGasLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getCurrentBlockTimestamp` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getEthBalance` | (`addr`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getLastBlockHash` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `tryAggregate` | (`requireSuccess`: `PromiseOrValue`\<`boolean`\>, `calls`: [`CallStruct`](../modules/Multicall3.md#callstruct)[], `overrides?`: `CallOverrides`) => `Promise`\<[`ResultStructOutput`](../modules/Multicall3.md#resultstructoutput)[]\> |
| `tryBlockAndAggregate` | (`requireSuccess`: `PromiseOrValue`\<`boolean`\>, `calls`: [`CallStruct`](../modules/Multicall3.md#callstruct)[], `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `string`, [`ResultStructOutput`](../modules/Multicall3.md#resultstructoutput)[]] & \{ `blockHash`: `string` ; `blockNumber`: `BigNumber` ; `returnData`: [`ResultStructOutput`](../modules/Multicall3.md#resultstructoutput)[]  }\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `aggregate` | (`calls`: [`CallStruct`](../modules/Multicall3.md#callstruct)[], `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `aggregate3` | (`calls`: [`Call3Struct`](../modules/Multicall3.md#call3struct)[], `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `aggregate3Value` | (`calls`: [`Call3ValueStruct`](../modules/Multicall3.md#call3valuestruct)[], `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `blockAndAggregate` | (`calls`: [`CallStruct`](../modules/Multicall3.md#callstruct)[], `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `getBasefee` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getBlockHash` | (`blockNumber`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getBlockNumber` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getCurrentBlockCoinbase` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getCurrentBlockDifficulty` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getCurrentBlockGasLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getCurrentBlockTimestamp` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getEthBalance` | (`addr`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getLastBlockHash` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `tryAggregate` | (`requireSuccess`: `PromiseOrValue`\<`boolean`\>, `calls`: [`CallStruct`](../modules/Multicall3.md#callstruct)[], `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `tryBlockAndAggregate` | (`requireSuccess`: `PromiseOrValue`\<`boolean`\>, `calls`: [`CallStruct`](../modules/Multicall3.md#callstruct)[], `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

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
| `aggregate` | (`calls`: [`CallStruct`](../modules/Multicall3.md#callstruct)[], `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `aggregate3` | (`calls`: [`Call3Struct`](../modules/Multicall3.md#call3struct)[], `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `aggregate3Value` | (`calls`: [`Call3ValueStruct`](../modules/Multicall3.md#call3valuestruct)[], `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `blockAndAggregate` | (`calls`: [`CallStruct`](../modules/Multicall3.md#callstruct)[], `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `getBasefee` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`] & \{ `basefee`: `BigNumber`  }\> |
| `getBlockHash` | (`blockNumber`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`] & \{ `blockHash`: `string`  }\> |
| `getBlockNumber` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`] & \{ `blockNumber`: `BigNumber`  }\> |
| `getChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`] & \{ `chainid`: `BigNumber`  }\> |
| `getCurrentBlockCoinbase` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`] & \{ `coinbase`: `string`  }\> |
| `getCurrentBlockDifficulty` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`] & \{ `difficulty`: `BigNumber`  }\> |
| `getCurrentBlockGasLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`] & \{ `gaslimit`: `BigNumber`  }\> |
| `getCurrentBlockTimestamp` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`] & \{ `timestamp`: `BigNumber`  }\> |
| `getEthBalance` | (`addr`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`] & \{ `balance`: `BigNumber`  }\> |
| `getLastBlockHash` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`] & \{ `blockHash`: `string`  }\> |
| `tryAggregate` | (`requireSuccess`: `PromiseOrValue`\<`boolean`\>, `calls`: [`CallStruct`](../modules/Multicall3.md#callstruct)[], `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `tryBlockAndAggregate` | (`requireSuccess`: `PromiseOrValue`\<`boolean`\>, `calls`: [`CallStruct`](../modules/Multicall3.md#callstruct)[], `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `Multicall3Interface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`Multicall3`](Multicall3-1.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`Multicall3`](Multicall3-1.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`Multicall3`](Multicall3-1.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `aggregate` | (`calls`: [`CallStruct`](../modules/Multicall3.md#callstruct)[], `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `aggregate3` | (`calls`: [`Call3Struct`](../modules/Multicall3.md#call3struct)[], `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `aggregate3Value` | (`calls`: [`Call3ValueStruct`](../modules/Multicall3.md#call3valuestruct)[], `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `blockAndAggregate` | (`calls`: [`CallStruct`](../modules/Multicall3.md#callstruct)[], `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `getBasefee` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getBlockHash` | (`blockNumber`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getBlockNumber` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getCurrentBlockCoinbase` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getCurrentBlockDifficulty` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getCurrentBlockGasLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getCurrentBlockTimestamp` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getEthBalance` | (`addr`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getLastBlockHash` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `tryAggregate` | (`requireSuccess`: `PromiseOrValue`\<`boolean`\>, `calls`: [`CallStruct`](../modules/Multicall3.md#callstruct)[], `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `tryBlockAndAggregate` | (`requireSuccess`: `PromiseOrValue`\<`boolean`\>, `calls`: [`CallStruct`](../modules/Multicall3.md#callstruct)[], `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`Multicall3`](Multicall3-1.md)\>

#### Overrides

BaseContract.removeListener

## Methods

### <a id="aggregate" name="aggregate"></a> aggregate

▸ **aggregate**(`calls`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `calls` | [`CallStruct`](../modules/Multicall3.md#callstruct)[] |
| `overrides?` | `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="aggregate3" name="aggregate3"></a> aggregate3

▸ **aggregate3**(`calls`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `calls` | [`Call3Struct`](../modules/Multicall3.md#call3struct)[] |
| `overrides?` | `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="aggregate3value" name="aggregate3value"></a> aggregate3Value

▸ **aggregate3Value**(`calls`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `calls` | [`Call3ValueStruct`](../modules/Multicall3.md#call3valuestruct)[] |
| `overrides?` | `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

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

### <a id="blockandaggregate" name="blockandaggregate"></a> blockAndAggregate

▸ **blockAndAggregate**(`calls`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `calls` | [`CallStruct`](../modules/Multicall3.md#callstruct)[] |
| `overrides?` | `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

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

▸ **deployed**(): `Promise`\<[`Multicall3`](Multicall3-1.md)\>

#### Returns

`Promise`\<[`Multicall3`](Multicall3-1.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="getbasefee" name="getbasefee"></a> getBasefee

▸ **getBasefee**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getblockhash" name="getblockhash"></a> getBlockHash

▸ **getBlockHash**(`blockNumber`, `overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockNumber` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="getblocknumber" name="getblocknumber"></a> getBlockNumber

▸ **getBlockNumber**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getchainid" name="getchainid"></a> getChainId

▸ **getChainId**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getcurrentblockcoinbase" name="getcurrentblockcoinbase"></a> getCurrentBlockCoinbase

▸ **getCurrentBlockCoinbase**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="getcurrentblockdifficulty" name="getcurrentblockdifficulty"></a> getCurrentBlockDifficulty

▸ **getCurrentBlockDifficulty**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getcurrentblockgaslimit" name="getcurrentblockgaslimit"></a> getCurrentBlockGasLimit

▸ **getCurrentBlockGasLimit**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getcurrentblocktimestamp" name="getcurrentblocktimestamp"></a> getCurrentBlockTimestamp

▸ **getCurrentBlockTimestamp**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getethbalance" name="getethbalance"></a> getEthBalance

▸ **getEthBalance**(`addr`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `addr` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getlastblockhash" name="getlastblockhash"></a> getLastBlockHash

▸ **getLastBlockHash**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

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

### <a id="tryaggregate" name="tryaggregate"></a> tryAggregate

▸ **tryAggregate**(`requireSuccess`, `calls`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `requireSuccess` | `PromiseOrValue`\<`boolean`\> |
| `calls` | [`CallStruct`](../modules/Multicall3.md#callstruct)[] |
| `overrides?` | `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="tryblockandaggregate" name="tryblockandaggregate"></a> tryBlockAndAggregate

▸ **tryBlockAndAggregate**(`requireSuccess`, `calls`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `requireSuccess` | `PromiseOrValue`\<`boolean`\> |
| `calls` | [`CallStruct`](../modules/Multicall3.md#callstruct)[] |
| `overrides?` | `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>
