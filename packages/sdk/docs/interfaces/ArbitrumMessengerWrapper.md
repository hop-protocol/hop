# Interface: ArbitrumMessengerWrapper

## Hierarchy

- `BaseContract`

  ↳ **`ArbitrumMessengerWrapper`**

## Table of contents

### Properties

- [callStatic](ArbitrumMessengerWrapper.md#callstatic)
- [estimateGas](ArbitrumMessengerWrapper.md#estimategas)
- [filters](ArbitrumMessengerWrapper.md#filters)
- [functions](ArbitrumMessengerWrapper.md#functions)
- [interface](ArbitrumMessengerWrapper.md#interface)
- [off](ArbitrumMessengerWrapper.md#off)
- [on](ArbitrumMessengerWrapper.md#on)
- [once](ArbitrumMessengerWrapper.md#once)
- [populateTransaction](ArbitrumMessengerWrapper.md#populatetransaction)
- [removeListener](ArbitrumMessengerWrapper.md#removelistener)

### Methods

- [attach](ArbitrumMessengerWrapper.md#attach)
- [canConfirmRoot](ArbitrumMessengerWrapper.md#canconfirmroot)
- [claimFunds](ArbitrumMessengerWrapper.md#claimfunds)
- [confirmRoots](ArbitrumMessengerWrapper.md#confirmroots)
- [connect](ArbitrumMessengerWrapper.md#connect)
- [deployed](ArbitrumMessengerWrapper.md#deployed)
- [isRootConfirmation](ArbitrumMessengerWrapper.md#isrootconfirmation)
- [l1BridgeAddress](ArbitrumMessengerWrapper.md#l1bridgeaddress)
- [l1MessengerAddress](ArbitrumMessengerWrapper.md#l1messengeraddress)
- [l2BridgeAddress](ArbitrumMessengerWrapper.md#l2bridgeaddress)
- [l2ChainId](ArbitrumMessengerWrapper.md#l2chainid)
- [listeners](ArbitrumMessengerWrapper.md#listeners)
- [owner](ArbitrumMessengerWrapper.md#owner)
- [queryFilter](ArbitrumMessengerWrapper.md#queryfilter)
- [removeAllListeners](ArbitrumMessengerWrapper.md#removealllisteners)
- [renounceOwnership](ArbitrumMessengerWrapper.md#renounceownership)
- [sendCrossDomainMessage](ArbitrumMessengerWrapper.md#sendcrossdomainmessage)
- [transferOwnership](ArbitrumMessengerWrapper.md#transferownership)
- [verifySender](ArbitrumMessengerWrapper.md#verifysender)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `canConfirmRoot` | (`l1Bridge`: `PromiseOrValue`\<`string`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `challengePeriod`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `claimFunds` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `confirmRoots` | (`rootHashes`: `PromiseOrValue`\<`BytesLike`\>[], `destinationChainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `totalAmounts`: `PromiseOrValue`\<`BigNumberish`\>[], `rootCommittedAts`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `isRootConfirmation` | (`overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `l1BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `l1MessengerAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `l2BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `l2ChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `renounceOwnership` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `sendCrossDomainMessage` | (`_calldata`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
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
| `claimFunds` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `confirmRoots` | (`rootHashes`: `PromiseOrValue`\<`BytesLike`\>[], `destinationChainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `totalAmounts`: `PromiseOrValue`\<`BigNumberish`\>[], `rootCommittedAts`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `isRootConfirmation` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l1BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l1MessengerAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l2BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l2ChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `renounceOwnership` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `sendCrossDomainMessage` | (`_calldata`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
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
| `claimFunds` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `confirmRoots` | (`rootHashes`: `PromiseOrValue`\<`BytesLike`\>[], `destinationChainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `totalAmounts`: `PromiseOrValue`\<`BigNumberish`\>[], `rootCommittedAts`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `isRootConfirmation` | (`overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `l1BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `l1MessengerAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `l2BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `l2ChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `renounceOwnership` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `sendCrossDomainMessage` | (`_calldata`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `verifySender` | (`l1BridgeCaller`: `PromiseOrValue`\<`string`\>, `arg1`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `ArbitrumMessengerWrapperInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`ArbitrumMessengerWrapper`](ArbitrumMessengerWrapper.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`ArbitrumMessengerWrapper`](ArbitrumMessengerWrapper.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`ArbitrumMessengerWrapper`](ArbitrumMessengerWrapper.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `canConfirmRoot` | (`l1Bridge`: `PromiseOrValue`\<`string`\>, `rootHash`: `PromiseOrValue`\<`BytesLike`\>, `totalAmount`: `PromiseOrValue`\<`BigNumberish`\>, `challengePeriod`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `claimFunds` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `confirmRoots` | (`rootHashes`: `PromiseOrValue`\<`BytesLike`\>[], `destinationChainIds`: `PromiseOrValue`\<`BigNumberish`\>[], `totalAmounts`: `PromiseOrValue`\<`BigNumberish`\>[], `rootCommittedAts`: `PromiseOrValue`\<`BigNumberish`\>[], `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `isRootConfirmation` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `l1BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `l1MessengerAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `l2BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `l2ChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `renounceOwnership` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `sendCrossDomainMessage` | (`_calldata`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `verifySender` | (`l1BridgeCaller`: `PromiseOrValue`\<`string`\>, `arg1`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`ArbitrumMessengerWrapper`](ArbitrumMessengerWrapper.md)\>

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

### <a id="claimfunds" name="claimfunds"></a> claimFunds

▸ **claimFunds**(`recipient`, `amount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `recipient` | `PromiseOrValue`\<`string`\> |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

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

▸ **deployed**(): `Promise`\<[`ArbitrumMessengerWrapper`](ArbitrumMessengerWrapper.md)\>

#### Returns

`Promise`\<[`ArbitrumMessengerWrapper`](ArbitrumMessengerWrapper.md)\>

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
