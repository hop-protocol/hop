# Interface: OptimismMessengerWrapper

## Hierarchy

- `BaseContract`

  ↳ **`OptimismMessengerWrapper`**

## Table of contents

### Properties

- [callStatic](OptimismMessengerWrapper.md#callstatic)
- [estimateGas](OptimismMessengerWrapper.md#estimategas)
- [filters](OptimismMessengerWrapper.md#filters)
- [functions](OptimismMessengerWrapper.md#functions)
- [interface](OptimismMessengerWrapper.md#interface)
- [off](OptimismMessengerWrapper.md#off)
- [on](OptimismMessengerWrapper.md#on)
- [once](OptimismMessengerWrapper.md#once)
- [populateTransaction](OptimismMessengerWrapper.md#populatetransaction)
- [removeListener](OptimismMessengerWrapper.md#removelistener)

### Methods

- [attach](OptimismMessengerWrapper.md#attach)
- [canConfirmRoot](OptimismMessengerWrapper.md#canconfirmroot)
- [confirmRoots](OptimismMessengerWrapper.md#confirmroots)
- [connect](OptimismMessengerWrapper.md#connect)
- [defaultL2GasLimit](OptimismMessengerWrapper.md#defaultl2gaslimit)
- [deployed](OptimismMessengerWrapper.md#deployed)
- [isRootConfirmation](OptimismMessengerWrapper.md#isrootconfirmation)
- [l1BridgeAddress](OptimismMessengerWrapper.md#l1bridgeaddress)
- [l1MessengerAddress](OptimismMessengerWrapper.md#l1messengeraddress)
- [l2BridgeAddress](OptimismMessengerWrapper.md#l2bridgeaddress)
- [l2ChainId](OptimismMessengerWrapper.md#l2chainid)
- [l2GasLimitForSignature](OptimismMessengerWrapper.md#l2gaslimitforsignature)
- [listeners](OptimismMessengerWrapper.md#listeners)
- [owner](OptimismMessengerWrapper.md#owner)
- [queryFilter](OptimismMessengerWrapper.md#queryfilter)
- [removeAllListeners](OptimismMessengerWrapper.md#removealllisteners)
- [renounceOwnership](OptimismMessengerWrapper.md#renounceownership)
- [sendCrossDomainMessage](OptimismMessengerWrapper.md#sendcrossdomainmessage)
- [setDefaultL2GasLimit](OptimismMessengerWrapper.md#setdefaultl2gaslimit)
- [setL2GasLimitForSignature](OptimismMessengerWrapper.md#setl2gaslimitforsignature)
- [transferOwnership](OptimismMessengerWrapper.md#transferownership)
- [verifySender](OptimismMessengerWrapper.md#verifysender)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `canConfirmRoot` | (`l1Bridge`: `PromiseOrValue`\<`string`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `challengePeriod`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `confirmRoots` | (`rootHashes`: `PromiseOrValue`\<`BytesLike`\>[], `destinationChainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `totalAmounts`: `PromiseOrValue`\<`BigNumberish`\>[], `rootCommittedAts`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `defaultL2GasLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `isRootConfirmation` | (`overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `l1BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `l1MessengerAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `l2BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `l2ChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l2GasLimitForSignature` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `renounceOwnership` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `sendCrossDomainMessage` | (`_calldata`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setDefaultL2GasLimit` | (`_l2GasLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setL2GasLimitForSignature` | (`_l2GasLimit`: `PromiseOrValue`\<`BigNumberish`\>, `signature`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `verifySender` | (`l1BridgeCaller`: `PromiseOrValue`\<`string`\>, `arg1`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `canConfirmRoot` | (`l1Bridge`: `PromiseOrValue`\<`string`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `challengePeriod`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `confirmRoots` | (`rootHashes`: `PromiseOrValue`\<`BytesLike`\>[], `destinationChainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `totalAmounts`: `PromiseOrValue`\<`BigNumberish`\>[], `rootCommittedAts`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `defaultL2GasLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `isRootConfirmation` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l1BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l1MessengerAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l2BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l2ChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l2GasLimitForSignature` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `renounceOwnership` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `sendCrossDomainMessage` | (`_calldata`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setDefaultL2GasLimit` | (`_l2GasLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setL2GasLimitForSignature` | (`_l2GasLimit`: `PromiseOrValue`\<`BigNumberish`\>, `signature`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `verifySender` | (`l1BridgeCaller`: `PromiseOrValue`\<`string`\>, `arg1`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `OwnershipTransferred` | (`previousOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>, `newOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `OwnershipTransferredEventFilter` |
| `OwnershipTransferred(address,address)` | (`previousOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>, `newOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `OwnershipTransferredEventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `canConfirmRoot` | (`l1Bridge`: `PromiseOrValue`\<`string`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `challengePeriod`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `confirmRoots` | (`rootHashes`: `PromiseOrValue`\<`BytesLike`\>[], `destinationChainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `totalAmounts`: `PromiseOrValue`\<`BigNumberish`\>[], `rootCommittedAts`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `defaultL2GasLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `isRootConfirmation` | (`overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `l1BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `l1MessengerAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `l2BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `l2ChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `l2GasLimitForSignature` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `renounceOwnership` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `sendCrossDomainMessage` | (`_calldata`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setDefaultL2GasLimit` | (`_l2GasLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setL2GasLimitForSignature` | (`_l2GasLimit`: `PromiseOrValue`\<`BigNumberish`\>, `signature`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `verifySender` | (`l1BridgeCaller`: `PromiseOrValue`\<`string`\>, `arg1`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `OptimismMessengerWrapperInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`OptimismMessengerWrapper`](OptimismMessengerWrapper.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`OptimismMessengerWrapper`](OptimismMessengerWrapper.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`OptimismMessengerWrapper`](OptimismMessengerWrapper.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `canConfirmRoot` | (`l1Bridge`: `PromiseOrValue`\<`string`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `challengePeriod`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `confirmRoots` | (`rootHashes`: `PromiseOrValue`\<`BytesLike`\>[], `destinationChainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `totalAmounts`: `PromiseOrValue`\<`BigNumberish`\>[], `rootCommittedAts`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `defaultL2GasLimit` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `isRootConfirmation` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `l1BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `l1MessengerAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `l2BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `l2ChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `l2GasLimitForSignature` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `renounceOwnership` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `sendCrossDomainMessage` | (`_calldata`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setDefaultL2GasLimit` | (`_l2GasLimit`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setL2GasLimitForSignature` | (`_l2GasLimit`: `PromiseOrValue`\<`BigNumberish`\>, `signature`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `verifySender` | (`l1BridgeCaller`: `PromiseOrValue`\<`string`\>, `arg1`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`OptimismMessengerWrapper`](OptimismMessengerWrapper.md)\>

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

### <a id="defaultl2gaslimit" name="defaultl2gaslimit"></a> defaultL2GasLimit

▸ **defaultL2GasLimit**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="deployed" name="deployed"></a> deployed

▸ **deployed**(): `Promise`\<[`OptimismMessengerWrapper`](OptimismMessengerWrapper.md)\>

#### Returns

`Promise`\<[`OptimismMessengerWrapper`](OptimismMessengerWrapper.md)\>

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

### <a id="l2gaslimitforsignature" name="l2gaslimitforsignature"></a> l2GasLimitForSignature

▸ **l2GasLimitForSignature**(`arg0`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`BytesLike`\> |
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

### <a id="owner" name="owner"></a> owner

▸ **owner**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

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

### <a id="renounceownership" name="renounceownership"></a> renounceOwnership

▸ **renounceOwnership**(`overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

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

### <a id="setdefaultl2gaslimit" name="setdefaultl2gaslimit"></a> setDefaultL2GasLimit

▸ **setDefaultL2GasLimit**(`_l2GasLimit`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_l2GasLimit` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setl2gaslimitforsignature" name="setl2gaslimitforsignature"></a> setL2GasLimitForSignature

▸ **setL2GasLimitForSignature**(`_l2GasLimit`, `signature`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_l2GasLimit` | `PromiseOrValue`\<`BigNumberish`\> |
| `signature` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="transferownership" name="transferownership"></a> transferOwnership

▸ **transferOwnership**(`newOwner`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `newOwner` | `PromiseOrValue`\<`string`\> |
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
