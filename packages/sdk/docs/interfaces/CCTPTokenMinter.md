# Interface: CCTPTokenMinter

## Hierarchy

- `BaseContract`

  ↳ **`CCTPTokenMinter`**

## Table of contents

### Properties

- [callStatic](CCTPTokenMinter.md#callstatic)
- [estimateGas](CCTPTokenMinter.md#estimategas)
- [filters](CCTPTokenMinter.md#filters)
- [functions](CCTPTokenMinter.md#functions)
- [interface](CCTPTokenMinter.md#interface)
- [off](CCTPTokenMinter.md#off)
- [on](CCTPTokenMinter.md#on)
- [once](CCTPTokenMinter.md#once)
- [populateTransaction](CCTPTokenMinter.md#populatetransaction)
- [removeListener](CCTPTokenMinter.md#removelistener)

### Methods

- [acceptOwnership](CCTPTokenMinter.md#acceptownership)
- [addLocalTokenMessenger](CCTPTokenMinter.md#addlocaltokenmessenger)
- [attach](CCTPTokenMinter.md#attach)
- [burn](CCTPTokenMinter.md#burn)
- [burnLimitsPerMessage](CCTPTokenMinter.md#burnlimitspermessage)
- [connect](CCTPTokenMinter.md#connect)
- [deployed](CCTPTokenMinter.md#deployed)
- [getLocalToken](CCTPTokenMinter.md#getlocaltoken)
- [linkTokenPair](CCTPTokenMinter.md#linktokenpair)
- [listeners](CCTPTokenMinter.md#listeners)
- [localTokenMessenger](CCTPTokenMinter.md#localtokenmessenger)
- [mint](CCTPTokenMinter.md#mint)
- [owner](CCTPTokenMinter.md#owner)
- [pause](CCTPTokenMinter.md#pause)
- [paused](CCTPTokenMinter.md#paused)
- [pauser](CCTPTokenMinter.md#pauser)
- [pendingOwner](CCTPTokenMinter.md#pendingowner)
- [queryFilter](CCTPTokenMinter.md#queryfilter)
- [remoteTokensToLocalTokens](CCTPTokenMinter.md#remotetokenstolocaltokens)
- [removeAllListeners](CCTPTokenMinter.md#removealllisteners)
- [removeLocalTokenMessenger](CCTPTokenMinter.md#removelocaltokenmessenger)
- [rescueERC20](CCTPTokenMinter.md#rescueerc20)
- [rescuer](CCTPTokenMinter.md#rescuer)
- [setMaxBurnAmountPerMessage](CCTPTokenMinter.md#setmaxburnamountpermessage)
- [setTokenController](CCTPTokenMinter.md#settokencontroller)
- [tokenController](CCTPTokenMinter.md#tokencontroller)
- [transferOwnership](CCTPTokenMinter.md#transferownership)
- [unlinkTokenPair](CCTPTokenMinter.md#unlinktokenpair)
- [unpause](CCTPTokenMinter.md#unpause)
- [updatePauser](CCTPTokenMinter.md#updatepauser)
- [updateRescuer](CCTPTokenMinter.md#updaterescuer)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `acceptOwnership` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `addLocalTokenMessenger` | (`newLocalTokenMessenger`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `burn` | (`burnToken`: `PromiseOrValue`\<`string`\>, `burnAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `burnLimitsPerMessage` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getLocalToken` | (`remoteDomain`: `PromiseOrValue`\<`BigNumberish`\>, `remoteToken`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `linkTokenPair` | (`localToken`: `PromiseOrValue`\<`string`\>, `remoteDomain`: `PromiseOrValue`\<`BigNumberish`\>, `remoteToken`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `localTokenMessenger` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `mint` | (`sourceDomain`: `PromiseOrValue`\<`BigNumberish`\>, `burnToken`: `PromiseOrValue`\<`BytesLike`\>, `to`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `pause` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `paused` | (`overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `pauser` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `pendingOwner` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `remoteTokensToLocalTokens` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `removeLocalTokenMessenger` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `rescueERC20` | (`tokenContract`: `PromiseOrValue`\<`string`\>, `to`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `rescuer` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `setMaxBurnAmountPerMessage` | (`localToken`: `PromiseOrValue`\<`string`\>, `burnLimitPerMessage`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setTokenController` | (`newTokenController`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `tokenController` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `unlinkTokenPair` | (`localToken`: `PromiseOrValue`\<`string`\>, `remoteDomain`: `PromiseOrValue`\<`BigNumberish`\>, `remoteToken`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `unpause` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `updatePauser` | (`_newPauser`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `updateRescuer` | (`newRescuer`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `acceptOwnership` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `addLocalTokenMessenger` | (`newLocalTokenMessenger`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `burn` | (`burnToken`: `PromiseOrValue`\<`string`\>, `burnAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `burnLimitsPerMessage` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getLocalToken` | (`remoteDomain`: `PromiseOrValue`\<`BigNumberish`\>, `remoteToken`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `linkTokenPair` | (`localToken`: `PromiseOrValue`\<`string`\>, `remoteDomain`: `PromiseOrValue`\<`BigNumberish`\>, `remoteToken`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `localTokenMessenger` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `mint` | (`sourceDomain`: `PromiseOrValue`\<`BigNumberish`\>, `burnToken`: `PromiseOrValue`\<`BytesLike`\>, `to`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `pause` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `paused` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `pauser` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `pendingOwner` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `remoteTokensToLocalTokens` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `removeLocalTokenMessenger` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `rescueERC20` | (`tokenContract`: `PromiseOrValue`\<`string`\>, `to`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `rescuer` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `setMaxBurnAmountPerMessage` | (`localToken`: `PromiseOrValue`\<`string`\>, `burnLimitPerMessage`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setTokenController` | (`newTokenController`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `tokenController` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `unlinkTokenPair` | (`localToken`: `PromiseOrValue`\<`string`\>, `remoteDomain`: `PromiseOrValue`\<`BigNumberish`\>, `remoteToken`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `unpause` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `updatePauser` | (`_newPauser`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `updateRescuer` | (`newRescuer`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `LocalTokenMessengerAdded` | (`localTokenMessenger?`: ``null``) => `LocalTokenMessengerAddedEventFilter` |
| `LocalTokenMessengerAdded(address)` | (`localTokenMessenger?`: ``null``) => `LocalTokenMessengerAddedEventFilter` |
| `LocalTokenMessengerRemoved` | (`localTokenMessenger?`: ``null``) => `LocalTokenMessengerRemovedEventFilter` |
| `LocalTokenMessengerRemoved(address)` | (`localTokenMessenger?`: ``null``) => `LocalTokenMessengerRemovedEventFilter` |
| `OwnershipTransferStarted` | (`previousOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>, `newOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `OwnershipTransferStartedEventFilter` |
| `OwnershipTransferStarted(address,address)` | (`previousOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>, `newOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `OwnershipTransferStartedEventFilter` |
| `OwnershipTransferred` | (`previousOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>, `newOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `OwnershipTransferredEventFilter` |
| `OwnershipTransferred(address,address)` | (`previousOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>, `newOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `OwnershipTransferredEventFilter` |
| `Pause` | () => `PauseEventFilter` |
| `Pause()` | () => `PauseEventFilter` |
| `PauserChanged` | (`newAddress?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `PauserChangedEventFilter` |
| `PauserChanged(address)` | (`newAddress?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `PauserChangedEventFilter` |
| `RescuerChanged` | (`newRescuer?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `RescuerChangedEventFilter` |
| `RescuerChanged(address)` | (`newRescuer?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `RescuerChangedEventFilter` |
| `SetBurnLimitPerMessage` | (`token?`: ``null`` \| `PromiseOrValue`\<`string`\>, `burnLimitPerMessage?`: ``null``) => `SetBurnLimitPerMessageEventFilter` |
| `SetBurnLimitPerMessage(address,uint256)` | (`token?`: ``null`` \| `PromiseOrValue`\<`string`\>, `burnLimitPerMessage?`: ``null``) => `SetBurnLimitPerMessageEventFilter` |
| `SetTokenController` | (`tokenController?`: ``null``) => `SetTokenControllerEventFilter` |
| `SetTokenController(address)` | (`tokenController?`: ``null``) => `SetTokenControllerEventFilter` |
| `TokenPairLinked` | (`localToken?`: ``null``, `remoteDomain?`: ``null``, `remoteToken?`: ``null``) => `TokenPairLinkedEventFilter` |
| `TokenPairLinked(address,uint32,bytes32)` | (`localToken?`: ``null``, `remoteDomain?`: ``null``, `remoteToken?`: ``null``) => `TokenPairLinkedEventFilter` |
| `TokenPairUnlinked` | (`localToken?`: ``null``, `remoteDomain?`: ``null``, `remoteToken?`: ``null``) => `TokenPairUnlinkedEventFilter` |
| `TokenPairUnlinked(address,uint32,bytes32)` | (`localToken?`: ``null``, `remoteDomain?`: ``null``, `remoteToken?`: ``null``) => `TokenPairUnlinkedEventFilter` |
| `Unpause` | () => `UnpauseEventFilter` |
| `Unpause()` | () => `UnpauseEventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `acceptOwnership` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `addLocalTokenMessenger` | (`newLocalTokenMessenger`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `burn` | (`burnToken`: `PromiseOrValue`\<`string`\>, `burnAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `burnLimitsPerMessage` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getLocalToken` | (`remoteDomain`: `PromiseOrValue`\<`BigNumberish`\>, `remoteToken`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `linkTokenPair` | (`localToken`: `PromiseOrValue`\<`string`\>, `remoteDomain`: `PromiseOrValue`\<`BigNumberish`\>, `remoteToken`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `localTokenMessenger` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `mint` | (`sourceDomain`: `PromiseOrValue`\<`BigNumberish`\>, `burnToken`: `PromiseOrValue`\<`BytesLike`\>, `to`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `pause` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `paused` | (`overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `pauser` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `pendingOwner` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `remoteTokensToLocalTokens` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `removeLocalTokenMessenger` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `rescueERC20` | (`tokenContract`: `PromiseOrValue`\<`string`\>, `to`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `rescuer` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `setMaxBurnAmountPerMessage` | (`localToken`: `PromiseOrValue`\<`string`\>, `burnLimitPerMessage`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setTokenController` | (`newTokenController`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `tokenController` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `unlinkTokenPair` | (`localToken`: `PromiseOrValue`\<`string`\>, `remoteDomain`: `PromiseOrValue`\<`BigNumberish`\>, `remoteToken`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `unpause` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `updatePauser` | (`_newPauser`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `updateRescuer` | (`newRescuer`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `CCTPTokenMinterInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`CCTPTokenMinter`](CCTPTokenMinter.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`CCTPTokenMinter`](CCTPTokenMinter.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`CCTPTokenMinter`](CCTPTokenMinter.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `acceptOwnership` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `addLocalTokenMessenger` | (`newLocalTokenMessenger`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `burn` | (`burnToken`: `PromiseOrValue`\<`string`\>, `burnAmount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `burnLimitsPerMessage` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getLocalToken` | (`remoteDomain`: `PromiseOrValue`\<`BigNumberish`\>, `remoteToken`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `linkTokenPair` | (`localToken`: `PromiseOrValue`\<`string`\>, `remoteDomain`: `PromiseOrValue`\<`BigNumberish`\>, `remoteToken`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `localTokenMessenger` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `mint` | (`sourceDomain`: `PromiseOrValue`\<`BigNumberish`\>, `burnToken`: `PromiseOrValue`\<`BytesLike`\>, `to`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `pause` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `paused` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `pauser` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `pendingOwner` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `remoteTokensToLocalTokens` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `removeLocalTokenMessenger` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `rescueERC20` | (`tokenContract`: `PromiseOrValue`\<`string`\>, `to`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `rescuer` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `setMaxBurnAmountPerMessage` | (`localToken`: `PromiseOrValue`\<`string`\>, `burnLimitPerMessage`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setTokenController` | (`newTokenController`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `tokenController` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `unlinkTokenPair` | (`localToken`: `PromiseOrValue`\<`string`\>, `remoteDomain`: `PromiseOrValue`\<`BigNumberish`\>, `remoteToken`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `unpause` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `updatePauser` | (`_newPauser`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `updateRescuer` | (`newRescuer`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`CCTPTokenMinter`](CCTPTokenMinter.md)\>

#### Overrides

BaseContract.removeListener

## Methods

### <a id="acceptownership" name="acceptownership"></a> acceptOwnership

▸ **acceptOwnership**(`overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="addlocaltokenmessenger" name="addlocaltokenmessenger"></a> addLocalTokenMessenger

▸ **addLocalTokenMessenger**(`newLocalTokenMessenger`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `newLocalTokenMessenger` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

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

### <a id="burn" name="burn"></a> burn

▸ **burn**(`burnToken`, `burnAmount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `burnToken` | `PromiseOrValue`\<`string`\> |
| `burnAmount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="burnlimitspermessage" name="burnlimitspermessage"></a> burnLimitsPerMessage

▸ **burnLimitsPerMessage**(`arg0`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

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

▸ **deployed**(): `Promise`\<[`CCTPTokenMinter`](CCTPTokenMinter.md)\>

#### Returns

`Promise`\<[`CCTPTokenMinter`](CCTPTokenMinter.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="getlocaltoken" name="getlocaltoken"></a> getLocalToken

▸ **getLocalToken**(`remoteDomain`, `remoteToken`, `overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `remoteDomain` | `PromiseOrValue`\<`BigNumberish`\> |
| `remoteToken` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="linktokenpair" name="linktokenpair"></a> linkTokenPair

▸ **linkTokenPair**(`localToken`, `remoteDomain`, `remoteToken`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `localToken` | `PromiseOrValue`\<`string`\> |
| `remoteDomain` | `PromiseOrValue`\<`BigNumberish`\> |
| `remoteToken` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

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

### <a id="localtokenmessenger" name="localtokenmessenger"></a> localTokenMessenger

▸ **localTokenMessenger**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="mint" name="mint"></a> mint

▸ **mint**(`sourceDomain`, `burnToken`, `to`, `amount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sourceDomain` | `PromiseOrValue`\<`BigNumberish`\> |
| `burnToken` | `PromiseOrValue`\<`BytesLike`\> |
| `to` | `PromiseOrValue`\<`string`\> |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

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

### <a id="pause" name="pause"></a> pause

▸ **pause**(`overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="paused" name="paused"></a> paused

▸ **paused**(`overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="pauser" name="pauser"></a> pauser

▸ **pauser**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="pendingowner" name="pendingowner"></a> pendingOwner

▸ **pendingOwner**(`overrides?`): `Promise`\<`string`\>

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

### <a id="remotetokenstolocaltokens" name="remotetokenstolocaltokens"></a> remoteTokensToLocalTokens

▸ **remoteTokensToLocalTokens**(`arg0`, `overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

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

### <a id="removelocaltokenmessenger" name="removelocaltokenmessenger"></a> removeLocalTokenMessenger

▸ **removeLocalTokenMessenger**(`overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="rescueerc20" name="rescueerc20"></a> rescueERC20

▸ **rescueERC20**(`tokenContract`, `to`, `amount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenContract` | `PromiseOrValue`\<`string`\> |
| `to` | `PromiseOrValue`\<`string`\> |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="rescuer" name="rescuer"></a> rescuer

▸ **rescuer**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="setmaxburnamountpermessage" name="setmaxburnamountpermessage"></a> setMaxBurnAmountPerMessage

▸ **setMaxBurnAmountPerMessage**(`localToken`, `burnLimitPerMessage`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `localToken` | `PromiseOrValue`\<`string`\> |
| `burnLimitPerMessage` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="settokencontroller" name="settokencontroller"></a> setTokenController

▸ **setTokenController**(`newTokenController`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `newTokenController` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="tokencontroller" name="tokencontroller"></a> tokenController

▸ **tokenController**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

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

### <a id="unlinktokenpair" name="unlinktokenpair"></a> unlinkTokenPair

▸ **unlinkTokenPair**(`localToken`, `remoteDomain`, `remoteToken`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `localToken` | `PromiseOrValue`\<`string`\> |
| `remoteDomain` | `PromiseOrValue`\<`BigNumberish`\> |
| `remoteToken` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="unpause" name="unpause"></a> unpause

▸ **unpause**(`overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="updatepauser" name="updatepauser"></a> updatePauser

▸ **updatePauser**(`_newPauser`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_newPauser` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="updaterescuer" name="updaterescuer"></a> updateRescuer

▸ **updateRescuer**(`newRescuer`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `newRescuer` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>
