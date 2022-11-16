# Class: RetryProvider

## Hierarchy

- `StaticJsonRpcProvider`

  ↳ **`RetryProvider`**

## Implements

- `Provider`

## Table of contents

### Constructors

- [constructor](RetryProvider.md#constructor)

### Properties

- [call](RetryProvider.md#call)
- [estimateGas](RetryProvider.md#estimategas)
- [getAvatar](RetryProvider.md#getavatar)
- [getBalance](RetryProvider.md#getbalance)
- [getBlock](RetryProvider.md#getblock)
- [getBlockNumber](RetryProvider.md#getblocknumber)
- [getBlockWithTransactions](RetryProvider.md#getblockwithtransactions)
- [getCode](RetryProvider.md#getcode)
- [getGasPrice](RetryProvider.md#getgasprice)
- [getLogs](RetryProvider.md#getlogs)
- [getNetwork](RetryProvider.md#getnetwork)
- [getStorageAt](RetryProvider.md#getstorageat)
- [getTransaction](RetryProvider.md#gettransaction)
- [getTransactionCount](RetryProvider.md#gettransactioncount)
- [getTransactionReceipt](RetryProvider.md#gettransactionreceipt)
- [lookupAddress](RetryProvider.md#lookupaddress)
- [resolveName](RetryProvider.md#resolvename)
- [sendTransaction](RetryProvider.md#sendtransaction)

### Methods

- [perform](RetryProvider.md#perform)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new RetryProvider**(`url?`, `network?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `url?` | `string` \| `ConnectionInfo` |
| `network?` | `Networkish` |

#### Inherited from

providers.StaticJsonRpcProvider.constructor

## Properties

### <a id="call" name="call"></a> call

• **call**: (...`args`: [transaction: Deferrable<TransactionRequest\>, blockTag?: BlockTag \| Promise<BlockTag\>]) => `Promise`<`string`\>

#### Type declaration

▸ (...`args`): `Promise`<`string`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [transaction: Deferrable<TransactionRequest\>, blockTag?: BlockTag \| Promise<BlockTag\>] |

##### Returns

`Promise`<`string`\>

#### Implementation of

providers.Provider.call

#### Overrides

providers.StaticJsonRpcProvider.call

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: (...`args`: [transaction: Deferrable<TransactionRequest\>]) => `Promise`<`BigNumber`\>

#### Type declaration

▸ (...`args`): `Promise`<`BigNumber`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [transaction: Deferrable<TransactionRequest\>] |

##### Returns

`Promise`<`BigNumber`\>

#### Implementation of

providers.Provider.estimateGas

#### Overrides

providers.StaticJsonRpcProvider.estimateGas

___

### <a id="getavatar" name="getavatar"></a> getAvatar

• **getAvatar**: (...`args`: [nameOrAddress: string]) => `Promise`<`string`\>

#### Type declaration

▸ (...`args`): `Promise`<`string`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [nameOrAddress: string] |

##### Returns

`Promise`<`string`\>

#### Overrides

providers.StaticJsonRpcProvider.getAvatar

___

### <a id="getbalance" name="getbalance"></a> getBalance

• **getBalance**: (...`args`: [addressOrName: string \| Promise<string\>, blockTag?: BlockTag \| Promise<BlockTag\>]) => `Promise`<`BigNumber`\>

#### Type declaration

▸ (...`args`): `Promise`<`BigNumber`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [addressOrName: string \| Promise<string\>, blockTag?: BlockTag \| Promise<BlockTag\>] |

##### Returns

`Promise`<`BigNumber`\>

#### Implementation of

providers.Provider.getBalance

#### Overrides

providers.StaticJsonRpcProvider.getBalance

___

### <a id="getblock" name="getblock"></a> getBlock

• **getBlock**: (...`args`: [blockHashOrBlockTag: BlockTag \| Promise<BlockTag\>]) => `Promise`<`Block`\>

#### Type declaration

▸ (...`args`): `Promise`<`Block`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [blockHashOrBlockTag: BlockTag \| Promise<BlockTag\>] |

##### Returns

`Promise`<`Block`\>

#### Implementation of

providers.Provider.getBlock

#### Overrides

providers.StaticJsonRpcProvider.getBlock

___

### <a id="getblocknumber" name="getblocknumber"></a> getBlockNumber

• **getBlockNumber**: (...`args`: []) => `Promise`<`number`\>

#### Type declaration

▸ (...`args`): `Promise`<`number`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [] |

##### Returns

`Promise`<`number`\>

#### Implementation of

providers.Provider.getBlockNumber

#### Overrides

providers.StaticJsonRpcProvider.getBlockNumber

___

### <a id="getblockwithtransactions" name="getblockwithtransactions"></a> getBlockWithTransactions

• **getBlockWithTransactions**: (...`args`: [blockHashOrBlockTag: BlockTag \| Promise<BlockTag\>]) => `Promise`<`BlockWithTransactions`\>

#### Type declaration

▸ (...`args`): `Promise`<`BlockWithTransactions`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [blockHashOrBlockTag: BlockTag \| Promise<BlockTag\>] |

##### Returns

`Promise`<`BlockWithTransactions`\>

#### Implementation of

providers.Provider.getBlockWithTransactions

#### Overrides

providers.StaticJsonRpcProvider.getBlockWithTransactions

___

### <a id="getcode" name="getcode"></a> getCode

• **getCode**: (...`args`: [addressOrName: string \| Promise<string\>, blockTag?: BlockTag \| Promise<BlockTag\>]) => `Promise`<`string`\>

#### Type declaration

▸ (...`args`): `Promise`<`string`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [addressOrName: string \| Promise<string\>, blockTag?: BlockTag \| Promise<BlockTag\>] |

##### Returns

`Promise`<`string`\>

#### Implementation of

providers.Provider.getCode

#### Overrides

providers.StaticJsonRpcProvider.getCode

___

### <a id="getgasprice" name="getgasprice"></a> getGasPrice

• **getGasPrice**: (...`args`: []) => `Promise`<`BigNumber`\>

#### Type declaration

▸ (...`args`): `Promise`<`BigNumber`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [] |

##### Returns

`Promise`<`BigNumber`\>

#### Implementation of

providers.Provider.getGasPrice

#### Overrides

providers.StaticJsonRpcProvider.getGasPrice

___

### <a id="getlogs" name="getlogs"></a> getLogs

• **getLogs**: (...`args`: [filter: Filter \| FilterByBlockHash \| Promise<Filter \| FilterByBlockHash\>]) => `Promise`<`Log`[]\>

#### Type declaration

▸ (...`args`): `Promise`<`Log`[]\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [filter: Filter \| FilterByBlockHash \| Promise<Filter \| FilterByBlockHash\>] |

##### Returns

`Promise`<`Log`[]\>

#### Implementation of

providers.Provider.getLogs

#### Overrides

providers.StaticJsonRpcProvider.getLogs

___

### <a id="getnetwork" name="getnetwork"></a> getNetwork

• **getNetwork**: (...`args`: []) => `Promise`<`Network`\>

#### Type declaration

▸ (...`args`): `Promise`<`Network`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [] |

##### Returns

`Promise`<`Network`\>

#### Implementation of

providers.Provider.getNetwork

#### Overrides

providers.StaticJsonRpcProvider.getNetwork

___

### <a id="getstorageat" name="getstorageat"></a> getStorageAt

• **getStorageAt**: (...`args`: [addressOrName: string \| Promise<string\>, position: BigNumberish \| Promise<BigNumberish\>, blockTag?: BlockTag \| Promise<BlockTag\>]) => `Promise`<`string`\>

#### Type declaration

▸ (...`args`): `Promise`<`string`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [addressOrName: string \| Promise<string\>, position: BigNumberish \| Promise<BigNumberish\>, blockTag?: BlockTag \| Promise<BlockTag\>] |

##### Returns

`Promise`<`string`\>

#### Implementation of

providers.Provider.getStorageAt

#### Overrides

providers.StaticJsonRpcProvider.getStorageAt

___

### <a id="gettransaction" name="gettransaction"></a> getTransaction

• **getTransaction**: (...`args`: [transactionHash: string \| Promise<string\>]) => `Promise`<`TransactionResponse`\>

#### Type declaration

▸ (...`args`): `Promise`<`TransactionResponse`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [transactionHash: string \| Promise<string\>] |

##### Returns

`Promise`<`TransactionResponse`\>

#### Implementation of

providers.Provider.getTransaction

#### Overrides

providers.StaticJsonRpcProvider.getTransaction

___

### <a id="gettransactioncount" name="gettransactioncount"></a> getTransactionCount

• **getTransactionCount**: (...`args`: [addressOrName: string \| Promise<string\>, blockTag?: BlockTag \| Promise<BlockTag\>]) => `Promise`<`number`\>

#### Type declaration

▸ (...`args`): `Promise`<`number`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [addressOrName: string \| Promise<string\>, blockTag?: BlockTag \| Promise<BlockTag\>] |

##### Returns

`Promise`<`number`\>

#### Implementation of

providers.Provider.getTransactionCount

#### Overrides

providers.StaticJsonRpcProvider.getTransactionCount

___

### <a id="gettransactionreceipt" name="gettransactionreceipt"></a> getTransactionReceipt

• **getTransactionReceipt**: (...`args`: [transactionHash: string \| Promise<string\>]) => `Promise`<`TransactionReceipt`\>

#### Type declaration

▸ (...`args`): `Promise`<`TransactionReceipt`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [transactionHash: string \| Promise<string\>] |

##### Returns

`Promise`<`TransactionReceipt`\>

#### Implementation of

providers.Provider.getTransactionReceipt

#### Overrides

providers.StaticJsonRpcProvider.getTransactionReceipt

___

### <a id="lookupaddress" name="lookupaddress"></a> lookupAddress

• **lookupAddress**: (...`args`: [address: string \| Promise<string\>]) => `Promise`<`string`\>

#### Type declaration

▸ (...`args`): `Promise`<`string`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [address: string \| Promise<string\>] |

##### Returns

`Promise`<`string`\>

#### Implementation of

providers.Provider.lookupAddress

#### Overrides

providers.StaticJsonRpcProvider.lookupAddress

___

### <a id="resolvename" name="resolvename"></a> resolveName

• **resolveName**: (...`args`: [name: string \| Promise<string\>]) => `Promise`<`string`\>

#### Type declaration

▸ (...`args`): `Promise`<`string`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [name: string \| Promise<string\>] |

##### Returns

`Promise`<`string`\>

#### Implementation of

providers.Provider.resolveName

#### Overrides

providers.StaticJsonRpcProvider.resolveName

___

### <a id="sendtransaction" name="sendtransaction"></a> sendTransaction

• **sendTransaction**: (...`args`: [signedTransaction: string \| Promise<string\>]) => `Promise`<`TransactionResponse`\>

#### Type declaration

▸ (...`args`): `Promise`<`TransactionResponse`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [signedTransaction: string \| Promise<string\>] |

##### Returns

`Promise`<`TransactionResponse`\>

#### Implementation of

providers.Provider.sendTransaction

#### Overrides

providers.StaticJsonRpcProvider.sendTransaction

## Methods

### <a id="perform" name="perform"></a> perform

▸ **perform**(`method`, `params`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `string` |
| `params` | `any` |

#### Returns

`Promise`<`any`\>

#### Overrides

providers.StaticJsonRpcProvider.perform
