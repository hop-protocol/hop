# Interface: L1\_ArbitrumMessenger

## Hierarchy

- `BaseContract`

  ↳ **`L1_ArbitrumMessenger`**

## Table of contents

### Properties

- [callStatic](L1_ArbitrumMessenger.md#callstatic)
- [estimateGas](L1_ArbitrumMessenger.md#estimategas)
- [filters](L1_ArbitrumMessenger.md#filters)
- [functions](L1_ArbitrumMessenger.md#functions)
- [interface](L1_ArbitrumMessenger.md#interface)
- [off](L1_ArbitrumMessenger.md#off)
- [on](L1_ArbitrumMessenger.md#on)
- [once](L1_ArbitrumMessenger.md#once)
- [populateTransaction](L1_ArbitrumMessenger.md#populatetransaction)
- [removeListener](L1_ArbitrumMessenger.md#removelistener)

### Methods

- [attach](L1_ArbitrumMessenger.md#attach)
- [bridge](L1_ArbitrumMessenger.md#bridge)
- [connect](L1_ArbitrumMessenger.md#connect)
- [createRetryableTicket](L1_ArbitrumMessenger.md#createretryableticket)
- [deployed](L1_ArbitrumMessenger.md#deployed)
- [depositEth](L1_ArbitrumMessenger.md#depositeth)
- [depositEthRetryable](L1_ArbitrumMessenger.md#depositethretryable)
- [listeners](L1_ArbitrumMessenger.md#listeners)
- [queryFilter](L1_ArbitrumMessenger.md#queryfilter)
- [removeAllListeners](L1_ArbitrumMessenger.md#removealllisteners)
- [sendContractTransaction](L1_ArbitrumMessenger.md#sendcontracttransaction)
- [sendL1FundedContractTransaction](L1_ArbitrumMessenger.md#sendl1fundedcontracttransaction)
- [sendL1FundedUnsignedTransaction](L1_ArbitrumMessenger.md#sendl1fundedunsignedtransaction)
- [sendL2Message](L1_ArbitrumMessenger.md#sendl2message)
- [sendUnsignedTransaction](L1_ArbitrumMessenger.md#sendunsignedtransaction)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bridge` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `createRetryableTicket` | (`destAddr`: `PromiseOrValue`\<`string`\>, `arbTxCallValue`: `PromiseOrValue`\<`BigNumberish`\>, `maxSubmissionCost`: `PromiseOrValue`\<`BigNumberish`\>, `submissionRefundAddress`: `PromiseOrValue`\<`string`\>, `valueRefundAddress`: `PromiseOrValue`\<`string`\>, `maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `depositEth` | (`destAddr`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `depositEthRetryable` | (`destAddr`: `PromiseOrValue`\<`string`\>, `maxSubmissionCost`: `PromiseOrValue`\<`BigNumberish`\>, `maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `maxGasPrice`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `sendContractTransaction` | (`maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `destAddr`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `sendL1FundedContractTransaction` | (`maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `destAddr`: `PromiseOrValue`\<`string`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `sendL1FundedUnsignedTransaction` | (`maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `nonce`: `PromiseOrValue`\<`BigNumberish`\>, `destAddr`: `PromiseOrValue`\<`string`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `sendL2Message` | (`messageData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `sendUnsignedTransaction` | (`maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `nonce`: `PromiseOrValue`\<`BigNumberish`\>, `destAddr`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bridge` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `createRetryableTicket` | (`destAddr`: `PromiseOrValue`\<`string`\>, `arbTxCallValue`: `PromiseOrValue`\<`BigNumberish`\>, `maxSubmissionCost`: `PromiseOrValue`\<`BigNumberish`\>, `submissionRefundAddress`: `PromiseOrValue`\<`string`\>, `valueRefundAddress`: `PromiseOrValue`\<`string`\>, `maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `depositEth` | (`destAddr`: `PromiseOrValue`\<`string`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `depositEthRetryable` | (`destAddr`: `PromiseOrValue`\<`string`\>, `maxSubmissionCost`: `PromiseOrValue`\<`BigNumberish`\>, `maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `maxGasPrice`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `sendContractTransaction` | (`maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `destAddr`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `sendL1FundedContractTransaction` | (`maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `destAddr`: `PromiseOrValue`\<`string`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `sendL1FundedUnsignedTransaction` | (`maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `nonce`: `PromiseOrValue`\<`BigNumberish`\>, `destAddr`: `PromiseOrValue`\<`string`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `sendL2Message` | (`messageData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `sendUnsignedTransaction` | (`maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `nonce`: `PromiseOrValue`\<`BigNumberish`\>, `destAddr`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `InboxMessageDelivered` | (`messageNum?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `data?`: ``null``) => `InboxMessageDeliveredEventFilter` |
| `InboxMessageDelivered(uint256,bytes)` | (`messageNum?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `data?`: ``null``) => `InboxMessageDeliveredEventFilter` |
| `InboxMessageDeliveredFromOrigin` | (`messageNum?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>) => `InboxMessageDeliveredFromOriginEventFilter` |
| `InboxMessageDeliveredFromOrigin(uint256)` | (`messageNum?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>) => `InboxMessageDeliveredFromOriginEventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bridge` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `createRetryableTicket` | (`destAddr`: `PromiseOrValue`\<`string`\>, `arbTxCallValue`: `PromiseOrValue`\<`BigNumberish`\>, `maxSubmissionCost`: `PromiseOrValue`\<`BigNumberish`\>, `submissionRefundAddress`: `PromiseOrValue`\<`string`\>, `valueRefundAddress`: `PromiseOrValue`\<`string`\>, `maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `depositEth` | (`destAddr`: `PromiseOrValue`\<`string`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `depositEthRetryable` | (`destAddr`: `PromiseOrValue`\<`string`\>, `maxSubmissionCost`: `PromiseOrValue`\<`BigNumberish`\>, `maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `maxGasPrice`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `sendContractTransaction` | (`maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `destAddr`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `sendL1FundedContractTransaction` | (`maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `destAddr`: `PromiseOrValue`\<`string`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `sendL1FundedUnsignedTransaction` | (`maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `nonce`: `PromiseOrValue`\<`BigNumberish`\>, `destAddr`: `PromiseOrValue`\<`string`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `sendL2Message` | (`messageData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `sendUnsignedTransaction` | (`maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `nonce`: `PromiseOrValue`\<`BigNumberish`\>, `destAddr`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `L1_ArbitrumMessengerInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`L1_ArbitrumMessenger`](L1_ArbitrumMessenger.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`L1_ArbitrumMessenger`](L1_ArbitrumMessenger.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`L1_ArbitrumMessenger`](L1_ArbitrumMessenger.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bridge` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `createRetryableTicket` | (`destAddr`: `PromiseOrValue`\<`string`\>, `arbTxCallValue`: `PromiseOrValue`\<`BigNumberish`\>, `maxSubmissionCost`: `PromiseOrValue`\<`BigNumberish`\>, `submissionRefundAddress`: `PromiseOrValue`\<`string`\>, `valueRefundAddress`: `PromiseOrValue`\<`string`\>, `maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `depositEth` | (`destAddr`: `PromiseOrValue`\<`string`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `depositEthRetryable` | (`destAddr`: `PromiseOrValue`\<`string`\>, `maxSubmissionCost`: `PromiseOrValue`\<`BigNumberish`\>, `maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `maxGasPrice`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `sendContractTransaction` | (`maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `destAddr`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `sendL1FundedContractTransaction` | (`maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `destAddr`: `PromiseOrValue`\<`string`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `sendL1FundedUnsignedTransaction` | (`maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `nonce`: `PromiseOrValue`\<`BigNumberish`\>, `destAddr`: `PromiseOrValue`\<`string`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `sendL2Message` | (`messageData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `sendUnsignedTransaction` | (`maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `nonce`: `PromiseOrValue`\<`BigNumberish`\>, `destAddr`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`L1_ArbitrumMessenger`](L1_ArbitrumMessenger.md)\>

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

### <a id="bridge" name="bridge"></a> bridge

▸ **bridge**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

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

### <a id="createretryableticket" name="createretryableticket"></a> createRetryableTicket

▸ **createRetryableTicket**(`destAddr`, `arbTxCallValue`, `maxSubmissionCost`, `submissionRefundAddress`, `valueRefundAddress`, `maxGas`, `gasPriceBid`, `data`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `destAddr` | `PromiseOrValue`\<`string`\> |
| `arbTxCallValue` | `PromiseOrValue`\<`BigNumberish`\> |
| `maxSubmissionCost` | `PromiseOrValue`\<`BigNumberish`\> |
| `submissionRefundAddress` | `PromiseOrValue`\<`string`\> |
| `valueRefundAddress` | `PromiseOrValue`\<`string`\> |
| `maxGas` | `PromiseOrValue`\<`BigNumberish`\> |
| `gasPriceBid` | `PromiseOrValue`\<`BigNumberish`\> |
| `data` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="deployed" name="deployed"></a> deployed

▸ **deployed**(): `Promise`\<[`L1_ArbitrumMessenger`](L1_ArbitrumMessenger.md)\>

#### Returns

`Promise`\<[`L1_ArbitrumMessenger`](L1_ArbitrumMessenger.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="depositeth" name="depositeth"></a> depositEth

▸ **depositEth**(`destAddr`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `destAddr` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="depositethretryable" name="depositethretryable"></a> depositEthRetryable

▸ **depositEthRetryable**(`destAddr`, `maxSubmissionCost`, `maxGas`, `maxGasPrice`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `destAddr` | `PromiseOrValue`\<`string`\> |
| `maxSubmissionCost` | `PromiseOrValue`\<`BigNumberish`\> |
| `maxGas` | `PromiseOrValue`\<`BigNumberish`\> |
| `maxGasPrice` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

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

### <a id="sendcontracttransaction" name="sendcontracttransaction"></a> sendContractTransaction

▸ **sendContractTransaction**(`maxGas`, `gasPriceBid`, `destAddr`, `amount`, `data`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `maxGas` | `PromiseOrValue`\<`BigNumberish`\> |
| `gasPriceBid` | `PromiseOrValue`\<`BigNumberish`\> |
| `destAddr` | `PromiseOrValue`\<`string`\> |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `data` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="sendl1fundedcontracttransaction" name="sendl1fundedcontracttransaction"></a> sendL1FundedContractTransaction

▸ **sendL1FundedContractTransaction**(`maxGas`, `gasPriceBid`, `destAddr`, `data`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `maxGas` | `PromiseOrValue`\<`BigNumberish`\> |
| `gasPriceBid` | `PromiseOrValue`\<`BigNumberish`\> |
| `destAddr` | `PromiseOrValue`\<`string`\> |
| `data` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="sendl1fundedunsignedtransaction" name="sendl1fundedunsignedtransaction"></a> sendL1FundedUnsignedTransaction

▸ **sendL1FundedUnsignedTransaction**(`maxGas`, `gasPriceBid`, `nonce`, `destAddr`, `data`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `maxGas` | `PromiseOrValue`\<`BigNumberish`\> |
| `gasPriceBid` | `PromiseOrValue`\<`BigNumberish`\> |
| `nonce` | `PromiseOrValue`\<`BigNumberish`\> |
| `destAddr` | `PromiseOrValue`\<`string`\> |
| `data` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="sendl2message" name="sendl2message"></a> sendL2Message

▸ **sendL2Message**(`messageData`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `messageData` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="sendunsignedtransaction" name="sendunsignedtransaction"></a> sendUnsignedTransaction

▸ **sendUnsignedTransaction**(`maxGas`, `gasPriceBid`, `nonce`, `destAddr`, `amount`, `data`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `maxGas` | `PromiseOrValue`\<`BigNumberish`\> |
| `gasPriceBid` | `PromiseOrValue`\<`BigNumberish`\> |
| `nonce` | `PromiseOrValue`\<`BigNumberish`\> |
| `destAddr` | `PromiseOrValue`\<`string`\> |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `data` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>
