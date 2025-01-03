# Interface: XDaiMessengerWrapper

## Hierarchy

- `BaseContract`

  ↳ **`XDaiMessengerWrapper`**

## Table of contents

### Properties

- [callStatic](XDaiMessengerWrapper.md#callstatic)
- [estimateGas](XDaiMessengerWrapper.md#estimategas)
- [filters](XDaiMessengerWrapper.md#filters)
- [functions](XDaiMessengerWrapper.md#functions)
- [interface](XDaiMessengerWrapper.md#interface)
- [off](XDaiMessengerWrapper.md#off)
- [on](XDaiMessengerWrapper.md#on)
- [once](XDaiMessengerWrapper.md#once)
- [populateTransaction](XDaiMessengerWrapper.md#populatetransaction)
- [removeListener](XDaiMessengerWrapper.md#removelistener)

### Methods

- [ambBridge](XDaiMessengerWrapper.md#ambbridge)
- [attach](XDaiMessengerWrapper.md#attach)
- [canConfirmRoot](XDaiMessengerWrapper.md#canconfirmroot)
- [confirmRoots](XDaiMessengerWrapper.md#confirmroots)
- [connect](XDaiMessengerWrapper.md#connect)
- [defaultGasLimit](XDaiMessengerWrapper.md#defaultgaslimit)
- [deployed](XDaiMessengerWrapper.md#deployed)
- [isRootConfirmation](XDaiMessengerWrapper.md#isrootconfirmation)
- [l1BridgeAddress](XDaiMessengerWrapper.md#l1bridgeaddress)
- [l1MessengerAddress](XDaiMessengerWrapper.md#l1messengeraddress)
- [l2BridgeAddress](XDaiMessengerWrapper.md#l2bridgeaddress)
- [l2ChainId](XDaiMessengerWrapper.md#l2chainid)
- [listeners](XDaiMessengerWrapper.md#listeners)
- [queryFilter](XDaiMessengerWrapper.md#queryfilter)
- [removeAllListeners](XDaiMessengerWrapper.md#removealllisteners)
- [sendCrossDomainMessage](XDaiMessengerWrapper.md#sendcrossdomainmessage)
- [verifySender](XDaiMessengerWrapper.md#verifysender)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ambBridge` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `canConfirmRoot` | (`l1Bridge`: `PromiseOrValue`\<`string`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `challengePeriod`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `confirmRoots` | (`rootHashes`: `PromiseOrValue`\<`BytesLike`\>[], `destinationChainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `totalAmounts`: `PromiseOrValue`\<`BigNumberish`\>[], `rootCommittedAts`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `defaultGasLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `isRootConfirmation` | (`overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `l1BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `l1MessengerAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `l2BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `l2ChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `sendCrossDomainMessage` | (`_calldata`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `verifySender` | (`l1BridgeCaller`: `PromiseOrValue`\<`string`\>, `arg1`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ambBridge` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `canConfirmRoot` | (`l1Bridge`: `PromiseOrValue`\<`string`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `challengePeriod`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `confirmRoots` | (`rootHashes`: `PromiseOrValue`\<`BytesLike`\>[], `destinationChainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `totalAmounts`: `PromiseOrValue`\<`BigNumberish`\>[], `rootCommittedAts`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `defaultGasLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `isRootConfirmation` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l1BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l1MessengerAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l2BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l2ChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `sendCrossDomainMessage` | (`_calldata`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `verifySender` | (`l1BridgeCaller`: `PromiseOrValue`\<`string`\>, `arg1`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

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
| `ambBridge` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `canConfirmRoot` | (`l1Bridge`: `PromiseOrValue`\<`string`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `challengePeriod`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `confirmRoots` | (`rootHashes`: `PromiseOrValue`\<`BytesLike`\>[], `destinationChainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `totalAmounts`: `PromiseOrValue`\<`BigNumberish`\>[], `rootCommittedAts`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `defaultGasLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `isRootConfirmation` | (`overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `l1BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `l1MessengerAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `l2BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `l2ChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `sendCrossDomainMessage` | (`_calldata`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `verifySender` | (`l1BridgeCaller`: `PromiseOrValue`\<`string`\>, `arg1`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `XDaiMessengerWrapperInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`XDaiMessengerWrapper`](XDaiMessengerWrapper.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`XDaiMessengerWrapper`](XDaiMessengerWrapper.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`XDaiMessengerWrapper`](XDaiMessengerWrapper.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ambBridge` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `canConfirmRoot` | (`l1Bridge`: `PromiseOrValue`\<`string`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `challengePeriod`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `confirmRoots` | (`rootHashes`: `PromiseOrValue`\<`BytesLike`\>[], `destinationChainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `totalAmounts`: `PromiseOrValue`\<`BigNumberish`\>[], `rootCommittedAts`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `defaultGasLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `isRootConfirmation` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `l1BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `l1MessengerAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `l2BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `l2ChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `sendCrossDomainMessage` | (`_calldata`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `verifySender` | (`l1BridgeCaller`: `PromiseOrValue`\<`string`\>, `arg1`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`XDaiMessengerWrapper`](XDaiMessengerWrapper.md)\>

#### Overrides

BaseContract.removeListener

## Methods

### <a id="ambbridge" name="ambbridge"></a> ambBridge

▸ **ambBridge**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

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

### <a id="canconfirmroot" name="canconfirmroot"></a> canConfirmRoot

▸ **canConfirmRoot**(`l1Bridge`, `rootHash`, `totalAmount`, `challengePeriod`, `overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `l1Bridge` | `PromiseOrValue`\<`string`\> |
| `rootHash` | `PromiseOrValue`\<`BytesLike`\> |
| `totalAmount` | `PromiseOrValue`\<`BigNumberish`\> |
| `challengePeriod` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="confirmroots" name="confirmroots"></a> confirmRoots

▸ **confirmRoots**(`rootHashes`, `destinationChainIds`, `totalAmounts`, `rootCommittedAts`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootHashes` | `PromiseOrValue`\<`BytesLike`\>[] |
| `destinationChainIds` | `PromiseOrValue`\<`BigNumberish`\>[] |
| `totalAmounts` | `PromiseOrValue`\<`BigNumberish`\>[] |
| `rootCommittedAts` | `PromiseOrValue`\<`BigNumberish`\>[] |
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

### <a id="defaultgaslimit" name="defaultgaslimit"></a> defaultGasLimit

▸ **defaultGasLimit**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="deployed" name="deployed"></a> deployed

▸ **deployed**(): `Promise`\<[`XDaiMessengerWrapper`](XDaiMessengerWrapper.md)\>

#### Returns

`Promise`\<[`XDaiMessengerWrapper`](XDaiMessengerWrapper.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="isrootconfirmation" name="isrootconfirmation"></a> isRootConfirmation

▸ **isRootConfirmation**(`overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="l1bridgeaddress" name="l1bridgeaddress"></a> l1BridgeAddress

▸ **l1BridgeAddress**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="l1messengeraddress" name="l1messengeraddress"></a> l1MessengerAddress

▸ **l1MessengerAddress**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="l2bridgeaddress" name="l2bridgeaddress"></a> l2BridgeAddress

▸ **l2BridgeAddress**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="l2chainid" name="l2chainid"></a> l2ChainId

▸ **l2ChainId**(`overrides?`): `Promise`\<`BigNumber`\>

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

### <a id="sendcrossdomainmessage" name="sendcrossdomainmessage"></a> sendCrossDomainMessage

▸ **sendCrossDomainMessage**(`_calldata`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_calldata` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="verifysender" name="verifysender"></a> verifySender

▸ **verifySender**(`l1BridgeCaller`, `arg1`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `l1BridgeCaller` | `PromiseOrValue`\<`string`\> |
| `arg1` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>
