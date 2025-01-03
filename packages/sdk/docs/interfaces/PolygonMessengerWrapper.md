# Interface: PolygonMessengerWrapper

## Hierarchy

- `BaseContract`

  ↳ **`PolygonMessengerWrapper`**

## Table of contents

### Properties

- [callStatic](PolygonMessengerWrapper.md#callstatic)
- [estimateGas](PolygonMessengerWrapper.md#estimategas)
- [filters](PolygonMessengerWrapper.md#filters)
- [functions](PolygonMessengerWrapper.md#functions)
- [interface](PolygonMessengerWrapper.md#interface)
- [off](PolygonMessengerWrapper.md#off)
- [on](PolygonMessengerWrapper.md#on)
- [once](PolygonMessengerWrapper.md#once)
- [populateTransaction](PolygonMessengerWrapper.md#populatetransaction)
- [removeListener](PolygonMessengerWrapper.md#removelistener)

### Methods

- [SEND\_MESSAGE\_EVENT\_SIG](PolygonMessengerWrapper.md#send_message_event_sig)
- [attach](PolygonMessengerWrapper.md#attach)
- [canConfirmRoot](PolygonMessengerWrapper.md#canconfirmroot)
- [checkpointManager](PolygonMessengerWrapper.md#checkpointmanager)
- [confirmRoots](PolygonMessengerWrapper.md#confirmroots)
- [connect](PolygonMessengerWrapper.md#connect)
- [deployed](PolygonMessengerWrapper.md#deployed)
- [fxChildTunnel](PolygonMessengerWrapper.md#fxchildtunnel)
- [fxRoot](PolygonMessengerWrapper.md#fxroot)
- [isRootConfirmation](PolygonMessengerWrapper.md#isrootconfirmation)
- [l1BridgeAddress](PolygonMessengerWrapper.md#l1bridgeaddress)
- [l2ChainId](PolygonMessengerWrapper.md#l2chainid)
- [listeners](PolygonMessengerWrapper.md#listeners)
- [processedExits](PolygonMessengerWrapper.md#processedexits)
- [queryFilter](PolygonMessengerWrapper.md#queryfilter)
- [receiveMessage](PolygonMessengerWrapper.md#receivemessage)
- [removeAllListeners](PolygonMessengerWrapper.md#removealllisteners)
- [sendCrossDomainMessage](PolygonMessengerWrapper.md#sendcrossdomainmessage)
- [setFxChildTunnel](PolygonMessengerWrapper.md#setfxchildtunnel)
- [verifySender](PolygonMessengerWrapper.md#verifysender)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `SEND_MESSAGE_EVENT_SIG` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `canConfirmRoot` | (`l1Bridge`: `PromiseOrValue`\<`string`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `challengePeriod`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `checkpointManager` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `confirmRoots` | (`rootHashes`: `PromiseOrValue`\<`BytesLike`\>[], `destinationChainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `totalAmounts`: `PromiseOrValue`\<`BigNumberish`\>[], `rootCommittedAts`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `fxChildTunnel` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `fxRoot` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `isRootConfirmation` | (`overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `l1BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `l2ChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `processedExits` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `receiveMessage` | (`inputData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `sendCrossDomainMessage` | (`_calldata`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setFxChildTunnel` | (`_fxChildTunnel`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `verifySender` | (`l1BridgeCaller`: `PromiseOrValue`\<`string`\>, `arg1`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `SEND_MESSAGE_EVENT_SIG` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `canConfirmRoot` | (`l1Bridge`: `PromiseOrValue`\<`string`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `challengePeriod`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `checkpointManager` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `confirmRoots` | (`rootHashes`: `PromiseOrValue`\<`BytesLike`\>[], `destinationChainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `totalAmounts`: `PromiseOrValue`\<`BigNumberish`\>[], `rootCommittedAts`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `fxChildTunnel` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `fxRoot` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `isRootConfirmation` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l1BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l2ChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `processedExits` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `receiveMessage` | (`inputData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `sendCrossDomainMessage` | (`_calldata`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setFxChildTunnel` | (`_fxChildTunnel`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `verifySender` | (`l1BridgeCaller`: `PromiseOrValue`\<`string`\>, `arg1`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |

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
| `SEND_MESSAGE_EVENT_SIG` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `canConfirmRoot` | (`l1Bridge`: `PromiseOrValue`\<`string`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `challengePeriod`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `checkpointManager` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `confirmRoots` | (`rootHashes`: `PromiseOrValue`\<`BytesLike`\>[], `destinationChainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `totalAmounts`: `PromiseOrValue`\<`BigNumberish`\>[], `rootCommittedAts`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `fxChildTunnel` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `fxRoot` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `isRootConfirmation` | (`overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `l1BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `l2ChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `processedExits` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `receiveMessage` | (`inputData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `sendCrossDomainMessage` | (`_calldata`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setFxChildTunnel` | (`_fxChildTunnel`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `verifySender` | (`l1BridgeCaller`: `PromiseOrValue`\<`string`\>, `arg1`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`void`]\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `PolygonMessengerWrapperInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`PolygonMessengerWrapper`](PolygonMessengerWrapper.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`PolygonMessengerWrapper`](PolygonMessengerWrapper.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`PolygonMessengerWrapper`](PolygonMessengerWrapper.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `SEND_MESSAGE_EVENT_SIG` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `canConfirmRoot` | (`l1Bridge`: `PromiseOrValue`\<`string`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `challengePeriod`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `checkpointManager` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `confirmRoots` | (`rootHashes`: `PromiseOrValue`\<`BytesLike`\>[], `destinationChainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `totalAmounts`: `PromiseOrValue`\<`BigNumberish`\>[], `rootCommittedAts`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `fxChildTunnel` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `fxRoot` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `isRootConfirmation` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `l1BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `l2ChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `processedExits` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `receiveMessage` | (`inputData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `sendCrossDomainMessage` | (`_calldata`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setFxChildTunnel` | (`_fxChildTunnel`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `verifySender` | (`l1BridgeCaller`: `PromiseOrValue`\<`string`\>, `arg1`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`PolygonMessengerWrapper`](PolygonMessengerWrapper.md)\>

#### Overrides

BaseContract.removeListener

## Methods

### <a id="send_message_event_sig" name="send_message_event_sig"></a> SEND\_MESSAGE\_EVENT\_SIG

▸ **SEND_MESSAGE_EVENT_SIG**(`overrides?`): `Promise`\<`string`\>

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

### <a id="checkpointmanager" name="checkpointmanager"></a> checkpointManager

▸ **checkpointManager**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

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

### <a id="deployed" name="deployed"></a> deployed

▸ **deployed**(): `Promise`\<[`PolygonMessengerWrapper`](PolygonMessengerWrapper.md)\>

#### Returns

`Promise`\<[`PolygonMessengerWrapper`](PolygonMessengerWrapper.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="fxchildtunnel" name="fxchildtunnel"></a> fxChildTunnel

▸ **fxChildTunnel**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="fxroot" name="fxroot"></a> fxRoot

▸ **fxRoot**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

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

### <a id="processedexits" name="processedexits"></a> processedExits

▸ **processedExits**(`arg0`, `overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

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

### <a id="receivemessage" name="receivemessage"></a> receiveMessage

▸ **receiveMessage**(`inputData`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputData` | `PromiseOrValue`\<`BytesLike`\> |
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

### <a id="setfxchildtunnel" name="setfxchildtunnel"></a> setFxChildTunnel

▸ **setFxChildTunnel**(`_fxChildTunnel`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_fxChildTunnel` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="verifysender" name="verifysender"></a> verifySender

▸ **verifySender**(`l1BridgeCaller`, `arg1`, `overrides?`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `l1BridgeCaller` | `PromiseOrValue`\<`string`\> |
| `arg1` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`void`\>
