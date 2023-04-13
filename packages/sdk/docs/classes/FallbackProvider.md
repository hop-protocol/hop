# Class: FallbackProvider

## Implements

- `Provider`

## Table of contents

### Constructors

- [constructor](FallbackProvider.md#constructor)

### Properties

- [\_isProvider](FallbackProvider.md#_isprovider)

### Accessors

- [connection](FallbackProvider.md#connection)
- [providers](FallbackProvider.md#providers)

### Methods

- [addListener](FallbackProvider.md#addlistener)
- [call](FallbackProvider.md#call)
- [detectNetwork](FallbackProvider.md#detectnetwork)
- [emit](FallbackProvider.md#emit)
- [estimateGas](FallbackProvider.md#estimategas)
- [getAvatar](FallbackProvider.md#getavatar)
- [getBalance](FallbackProvider.md#getbalance)
- [getBlock](FallbackProvider.md#getblock)
- [getBlockNumber](FallbackProvider.md#getblocknumber)
- [getBlockWithTransactions](FallbackProvider.md#getblockwithtransactions)
- [getCode](FallbackProvider.md#getcode)
- [getFeeData](FallbackProvider.md#getfeedata)
- [getGasPrice](FallbackProvider.md#getgasprice)
- [getLogs](FallbackProvider.md#getlogs)
- [getNetwork](FallbackProvider.md#getnetwork)
- [getResolver](FallbackProvider.md#getresolver)
- [getStorageAt](FallbackProvider.md#getstorageat)
- [getTransaction](FallbackProvider.md#gettransaction)
- [getTransactionCount](FallbackProvider.md#gettransactioncount)
- [getTransactionReceipt](FallbackProvider.md#gettransactionreceipt)
- [listenerCount](FallbackProvider.md#listenercount)
- [listeners](FallbackProvider.md#listeners)
- [lookupAddress](FallbackProvider.md#lookupaddress)
- [off](FallbackProvider.md#off)
- [on](FallbackProvider.md#on)
- [once](FallbackProvider.md#once)
- [removeAllListeners](FallbackProvider.md#removealllisteners)
- [removeListener](FallbackProvider.md#removelistener)
- [resolveName](FallbackProvider.md#resolvename)
- [sendTransaction](FallbackProvider.md#sendtransaction)
- [tryProvider](FallbackProvider.md#tryprovider)
- [waitForTransaction](FallbackProvider.md#waitfortransaction)
- [fromUrls](FallbackProvider.md#fromurls)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new FallbackProvider**(`providers`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `providers` | `any`[] |

## Properties

### <a id="_isprovider" name="_isprovider"></a> \_isProvider

• **\_isProvider**: `boolean` = `true`

#### Implementation of

providers.Provider.\_isProvider

## Accessors

### <a id="connection" name="connection"></a> connection

• `get` **connection**(): `any`

#### Returns

`any`

___

### <a id="providers" name="providers"></a> providers

• `get` **providers**(): `any`[]

#### Returns

`any`[]

## Methods

### <a id="addlistener" name="addlistener"></a> addListener

▸ **addListener**(`eventName`, `listener`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` |
| `listener` | `any` |

#### Returns

`any`

#### Implementation of

providers.Provider.addListener

___

### <a id="call" name="call"></a> call

▸ **call**(`transaction`, `blockTag?`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transaction` | `Deferrable`<`TransactionRequest`\> |
| `blockTag?` | `BlockTag` \| `Promise`<`BlockTag`\> |

#### Returns

`Promise`<`string`\>

#### Implementation of

providers.Provider.call

___

### <a id="detectnetwork" name="detectnetwork"></a> detectNetwork

▸ **detectNetwork**(): `Promise`<`Network`\>

#### Returns

`Promise`<`Network`\>

___

### <a id="emit" name="emit"></a> emit

▸ **emit**(`eventName`, ...`args`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` |
| `...args` | `any`[] |

#### Returns

`boolean`

#### Implementation of

providers.Provider.emit

___

### <a id="estimategas" name="estimategas"></a> estimateGas

▸ **estimateGas**(`transaction`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transaction` | `Deferrable`<`TransactionRequest`\> |

#### Returns

`Promise`<`BigNumber`\>

#### Implementation of

providers.Provider.estimateGas

___

### <a id="getavatar" name="getavatar"></a> getAvatar

▸ **getAvatar**(`address`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<`string`\>

___

### <a id="getbalance" name="getbalance"></a> getBalance

▸ **getBalance**(`addressOrName`, `blockTag?`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `addressOrName` | `string` \| `Promise`<`string`\> |
| `blockTag?` | `BlockTag` \| `Promise`<`BlockTag`\> |

#### Returns

`Promise`<`BigNumber`\>

#### Implementation of

providers.Provider.getBalance

___

### <a id="getblock" name="getblock"></a> getBlock

▸ **getBlock**(`blockHashOrBlockTag`): `Promise`<`Block`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockHashOrBlockTag` | `BlockTag` \| `Promise`<`BlockTag`\> |

#### Returns

`Promise`<`Block`\>

#### Implementation of

providers.Provider.getBlock

___

### <a id="getblocknumber" name="getblocknumber"></a> getBlockNumber

▸ **getBlockNumber**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Implementation of

providers.Provider.getBlockNumber

___

### <a id="getblockwithtransactions" name="getblockwithtransactions"></a> getBlockWithTransactions

▸ **getBlockWithTransactions**(`blockHashOrBlockTag`): `Promise`<`BlockWithTransactions`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockHashOrBlockTag` | `BlockTag` \| `Promise`<`BlockTag`\> |

#### Returns

`Promise`<`BlockWithTransactions`\>

#### Implementation of

providers.Provider.getBlockWithTransactions

___

### <a id="getcode" name="getcode"></a> getCode

▸ **getCode**(`addressOrName`, `blockTag?`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `addressOrName` | `string` \| `Promise`<`string`\> |
| `blockTag?` | `BlockTag` \| `Promise`<`BlockTag`\> |

#### Returns

`Promise`<`string`\>

#### Implementation of

providers.Provider.getCode

___

### <a id="getfeedata" name="getfeedata"></a> getFeeData

▸ **getFeeData**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Implementation of

providers.Provider.getFeeData

___

### <a id="getgasprice" name="getgasprice"></a> getGasPrice

▸ **getGasPrice**(): `Promise`<`BigNumber`\>

#### Returns

`Promise`<`BigNumber`\>

#### Implementation of

providers.Provider.getGasPrice

___

### <a id="getlogs" name="getlogs"></a> getLogs

▸ **getLogs**(`filter`): `Promise`<`Log`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filter` | `Filter` \| `FilterByBlockHash` |

#### Returns

`Promise`<`Log`[]\>

#### Implementation of

providers.Provider.getLogs

___

### <a id="getnetwork" name="getnetwork"></a> getNetwork

▸ **getNetwork**(): `Promise`<`Network`\>

#### Returns

`Promise`<`Network`\>

#### Implementation of

providers.Provider.getNetwork

___

### <a id="getresolver" name="getresolver"></a> getResolver

▸ **getResolver**(`address`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<`string`\>

___

### <a id="getstorageat" name="getstorageat"></a> getStorageAt

▸ **getStorageAt**(`addressOrName`, `position`, `blockTag?`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `addressOrName` | `string` \| `Promise`<`string`\> |
| `position` | `BigNumberish` \| `Promise`<`BigNumberish`\> |
| `blockTag?` | `BlockTag` \| `Promise`<`BlockTag`\> |

#### Returns

`Promise`<`string`\>

#### Implementation of

providers.Provider.getStorageAt

___

### <a id="gettransaction" name="gettransaction"></a> getTransaction

▸ **getTransaction**(`transactionHash`): `Promise`<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionHash` | `string` |

#### Returns

`Promise`<`TransactionResponse`\>

#### Implementation of

providers.Provider.getTransaction

___

### <a id="gettransactioncount" name="gettransactioncount"></a> getTransactionCount

▸ **getTransactionCount**(`addressOrName`, `blockTag?`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `addressOrName` | `string` \| `Promise`<`string`\> |
| `blockTag?` | `BlockTag` \| `Promise`<`BlockTag`\> |

#### Returns

`Promise`<`number`\>

#### Implementation of

providers.Provider.getTransactionCount

___

### <a id="gettransactionreceipt" name="gettransactionreceipt"></a> getTransactionReceipt

▸ **getTransactionReceipt**(`transactionHash`): `Promise`<`TransactionReceipt`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionHash` | `string` |

#### Returns

`Promise`<`TransactionReceipt`\>

#### Implementation of

providers.Provider.getTransactionReceipt

___

### <a id="listenercount" name="listenercount"></a> listenerCount

▸ **listenerCount**(`eventName`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` |

#### Returns

`number`

#### Implementation of

providers.Provider.listenerCount

___

### <a id="listeners" name="listeners"></a> listeners

▸ **listeners**(`eventName`): `any`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` |

#### Returns

`any`[]

#### Implementation of

providers.Provider.listeners

___

### <a id="lookupaddress" name="lookupaddress"></a> lookupAddress

▸ **lookupAddress**(`address`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` \| `Promise`<`string`\> |

#### Returns

`Promise`<`string`\>

#### Implementation of

providers.Provider.lookupAddress

___

### <a id="off" name="off"></a> off

▸ **off**(`eventName`, `listener`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` |
| `listener` | `any` |

#### Returns

`any`

#### Implementation of

providers.Provider.off

___

### <a id="on" name="on"></a> on

▸ **on**(`eventName`, `listener`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` |
| `listener` | `any` |

#### Returns

`any`

#### Implementation of

providers.Provider.on

___

### <a id="once" name="once"></a> once

▸ **once**(`eventName`, `listener`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` |
| `listener` | `any` |

#### Returns

`any`

#### Implementation of

providers.Provider.once

___

### <a id="removealllisteners" name="removealllisteners"></a> removeAllListeners

▸ **removeAllListeners**(`eventName`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` |

#### Returns

`any`

#### Implementation of

providers.Provider.removeAllListeners

___

### <a id="removelistener" name="removelistener"></a> removeListener

▸ **removeListener**(`eventName`, `listener`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` |
| `listener` | `any` |

#### Returns

`any`

#### Implementation of

providers.Provider.removeListener

___

### <a id="resolvename" name="resolvename"></a> resolveName

▸ **resolveName**(`name`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` \| `Promise`<`string`\> |

#### Returns

`Promise`<`string`\>

#### Implementation of

providers.Provider.resolveName

___

### <a id="sendtransaction" name="sendtransaction"></a> sendTransaction

▸ **sendTransaction**(`signedTransaction`): `Promise`<`TransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `signedTransaction` | `string` \| `Promise`<`string`\> |

#### Returns

`Promise`<`TransactionResponse`\>

#### Implementation of

providers.Provider.sendTransaction

___

### <a id="tryprovider" name="tryprovider"></a> tryProvider

▸ **tryProvider**(`fn`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | `any` |

#### Returns

`Promise`<`any`\>

___

### <a id="waitfortransaction" name="waitfortransaction"></a> waitForTransaction

▸ **waitForTransaction**(`transactionHash`, `confirmations?`, `timeout?`): `Promise`<`TransactionReceipt`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionHash` | `string` |
| `confirmations?` | `number` |
| `timeout?` | `number` |

#### Returns

`Promise`<`TransactionReceipt`\>

#### Implementation of

providers.Provider.waitForTransaction

___

### <a id="fromurls" name="fromurls"></a> fromUrls

▸ `Static` **fromUrls**(`urls`): [`FallbackProvider`](FallbackProvider.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `urls` | `string`[] |

#### Returns

[`FallbackProvider`](FallbackProvider.md)
