# Interface: CCTPTokenMessenger

## Hierarchy

- `BaseContract`

  ↳ **`CCTPTokenMessenger`**

## Table of contents

### Properties

- [callStatic](CCTPTokenMessenger.md#callstatic)
- [estimateGas](CCTPTokenMessenger.md#estimategas)
- [filters](CCTPTokenMessenger.md#filters)
- [functions](CCTPTokenMessenger.md#functions)
- [interface](CCTPTokenMessenger.md#interface)
- [off](CCTPTokenMessenger.md#off)
- [on](CCTPTokenMessenger.md#on)
- [once](CCTPTokenMessenger.md#once)
- [populateTransaction](CCTPTokenMessenger.md#populatetransaction)
- [removeListener](CCTPTokenMessenger.md#removelistener)

### Methods

- [acceptOwnership](CCTPTokenMessenger.md#acceptownership)
- [addLocalMinter](CCTPTokenMessenger.md#addlocalminter)
- [addRemoteTokenMessenger](CCTPTokenMessenger.md#addremotetokenmessenger)
- [attach](CCTPTokenMessenger.md#attach)
- [connect](CCTPTokenMessenger.md#connect)
- [deployed](CCTPTokenMessenger.md#deployed)
- [depositForBurn](CCTPTokenMessenger.md#depositforburn)
- [depositForBurnWithCaller](CCTPTokenMessenger.md#depositforburnwithcaller)
- [handleReceiveMessage](CCTPTokenMessenger.md#handlereceivemessage)
- [listeners](CCTPTokenMessenger.md#listeners)
- [localMessageTransmitter](CCTPTokenMessenger.md#localmessagetransmitter)
- [localMinter](CCTPTokenMessenger.md#localminter)
- [messageBodyVersion](CCTPTokenMessenger.md#messagebodyversion)
- [owner](CCTPTokenMessenger.md#owner)
- [pendingOwner](CCTPTokenMessenger.md#pendingowner)
- [queryFilter](CCTPTokenMessenger.md#queryfilter)
- [remoteTokenMessengers](CCTPTokenMessenger.md#remotetokenmessengers)
- [removeAllListeners](CCTPTokenMessenger.md#removealllisteners)
- [removeLocalMinter](CCTPTokenMessenger.md#removelocalminter)
- [removeRemoteTokenMessenger](CCTPTokenMessenger.md#removeremotetokenmessenger)
- [replaceDepositForBurn](CCTPTokenMessenger.md#replacedepositforburn)
- [rescueERC20](CCTPTokenMessenger.md#rescueerc20)
- [rescuer](CCTPTokenMessenger.md#rescuer)
- [transferOwnership](CCTPTokenMessenger.md#transferownership)
- [updateRescuer](CCTPTokenMessenger.md#updaterescuer)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `acceptOwnership` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `addLocalMinter` | (`newLocalMinter`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `addRemoteTokenMessenger` | (`domain`: `PromiseOrValue`\<`BigNumberish`\>, `tokenMessenger`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `depositForBurn` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `destinationDomain`: `PromiseOrValue`\<`BigNumberish`\>, `mintRecipient`: `PromiseOrValue`\<`BytesLike`\>, `burnToken`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `depositForBurnWithCaller` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `destinationDomain`: `PromiseOrValue`\<`BigNumberish`\>, `mintRecipient`: `PromiseOrValue`\<`BytesLike`\>, `burnToken`: `PromiseOrValue`\<`string`\>, `destinationCaller`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `handleReceiveMessage` | (`remoteDomain`: `PromiseOrValue`\<`BigNumberish`\>, `sender`: `PromiseOrValue`\<`BytesLike`\>, `messageBody`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `localMessageTransmitter` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `localMinter` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `messageBodyVersion` | (`overrides?`: `CallOverrides`) => `Promise`\<`number`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `pendingOwner` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `remoteTokenMessengers` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `removeLocalMinter` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `removeRemoteTokenMessenger` | (`domain`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `replaceDepositForBurn` | (`originalMessage`: `PromiseOrValue`\<`BytesLike`\>, `originalAttestation`: `PromiseOrValue`\<`BytesLike`\>, `newDestinationCaller`: `PromiseOrValue`\<`BytesLike`\>, `newMintRecipient`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `rescueERC20` | (`tokenContract`: `PromiseOrValue`\<`string`\>, `to`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `rescuer` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
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
| `addLocalMinter` | (`newLocalMinter`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `addRemoteTokenMessenger` | (`domain`: `PromiseOrValue`\<`BigNumberish`\>, `tokenMessenger`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `depositForBurn` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `destinationDomain`: `PromiseOrValue`\<`BigNumberish`\>, `mintRecipient`: `PromiseOrValue`\<`BytesLike`\>, `burnToken`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `depositForBurnWithCaller` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `destinationDomain`: `PromiseOrValue`\<`BigNumberish`\>, `mintRecipient`: `PromiseOrValue`\<`BytesLike`\>, `burnToken`: `PromiseOrValue`\<`string`\>, `destinationCaller`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `handleReceiveMessage` | (`remoteDomain`: `PromiseOrValue`\<`BigNumberish`\>, `sender`: `PromiseOrValue`\<`BytesLike`\>, `messageBody`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `localMessageTransmitter` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `localMinter` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `messageBodyVersion` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `pendingOwner` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `remoteTokenMessengers` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `removeLocalMinter` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `removeRemoteTokenMessenger` | (`domain`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `replaceDepositForBurn` | (`originalMessage`: `PromiseOrValue`\<`BytesLike`\>, `originalAttestation`: `PromiseOrValue`\<`BytesLike`\>, `newDestinationCaller`: `PromiseOrValue`\<`BytesLike`\>, `newMintRecipient`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `rescueERC20` | (`tokenContract`: `PromiseOrValue`\<`string`\>, `to`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `rescuer` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `updateRescuer` | (`newRescuer`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `DepositForBurn` | (`nonce?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `burnToken?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``, `depositor?`: ``null`` \| `PromiseOrValue`\<`string`\>, `mintRecipient?`: ``null``, `destinationDomain?`: ``null``, `destinationTokenMessenger?`: ``null``, `destinationCaller?`: ``null``) => `DepositForBurnEventFilter` |
| `DepositForBurn(uint64,address,uint256,address,bytes32,uint32,bytes32,bytes32)` | (`nonce?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `burnToken?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``, `depositor?`: ``null`` \| `PromiseOrValue`\<`string`\>, `mintRecipient?`: ``null``, `destinationDomain?`: ``null``, `destinationTokenMessenger?`: ``null``, `destinationCaller?`: ``null``) => `DepositForBurnEventFilter` |
| `LocalMinterAdded` | (`localMinter?`: ``null``) => `LocalMinterAddedEventFilter` |
| `LocalMinterAdded(address)` | (`localMinter?`: ``null``) => `LocalMinterAddedEventFilter` |
| `LocalMinterRemoved` | (`localMinter?`: ``null``) => `LocalMinterRemovedEventFilter` |
| `LocalMinterRemoved(address)` | (`localMinter?`: ``null``) => `LocalMinterRemovedEventFilter` |
| `MintAndWithdraw` | (`mintRecipient?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``, `mintToken?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `MintAndWithdrawEventFilter` |
| `MintAndWithdraw(address,uint256,address)` | (`mintRecipient?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``, `mintToken?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `MintAndWithdrawEventFilter` |
| `OwnershipTransferStarted` | (`previousOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>, `newOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `OwnershipTransferStartedEventFilter` |
| `OwnershipTransferStarted(address,address)` | (`previousOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>, `newOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `OwnershipTransferStartedEventFilter` |
| `OwnershipTransferred` | (`previousOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>, `newOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `OwnershipTransferredEventFilter` |
| `OwnershipTransferred(address,address)` | (`previousOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>, `newOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `OwnershipTransferredEventFilter` |
| `RemoteTokenMessengerAdded` | (`domain?`: ``null``, `tokenMessenger?`: ``null``) => `RemoteTokenMessengerAddedEventFilter` |
| `RemoteTokenMessengerAdded(uint32,bytes32)` | (`domain?`: ``null``, `tokenMessenger?`: ``null``) => `RemoteTokenMessengerAddedEventFilter` |
| `RemoteTokenMessengerRemoved` | (`domain?`: ``null``, `tokenMessenger?`: ``null``) => `RemoteTokenMessengerRemovedEventFilter` |
| `RemoteTokenMessengerRemoved(uint32,bytes32)` | (`domain?`: ``null``, `tokenMessenger?`: ``null``) => `RemoteTokenMessengerRemovedEventFilter` |
| `RescuerChanged` | (`newRescuer?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `RescuerChangedEventFilter` |
| `RescuerChanged(address)` | (`newRescuer?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `RescuerChangedEventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `acceptOwnership` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `addLocalMinter` | (`newLocalMinter`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `addRemoteTokenMessenger` | (`domain`: `PromiseOrValue`\<`BigNumberish`\>, `tokenMessenger`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `depositForBurn` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `destinationDomain`: `PromiseOrValue`\<`BigNumberish`\>, `mintRecipient`: `PromiseOrValue`\<`BytesLike`\>, `burnToken`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `depositForBurnWithCaller` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `destinationDomain`: `PromiseOrValue`\<`BigNumberish`\>, `mintRecipient`: `PromiseOrValue`\<`BytesLike`\>, `burnToken`: `PromiseOrValue`\<`string`\>, `destinationCaller`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `handleReceiveMessage` | (`remoteDomain`: `PromiseOrValue`\<`BigNumberish`\>, `sender`: `PromiseOrValue`\<`BytesLike`\>, `messageBody`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `localMessageTransmitter` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `localMinter` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `messageBodyVersion` | (`overrides?`: `CallOverrides`) => `Promise`\<[`number`]\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `pendingOwner` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `remoteTokenMessengers` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `removeLocalMinter` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `removeRemoteTokenMessenger` | (`domain`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `replaceDepositForBurn` | (`originalMessage`: `PromiseOrValue`\<`BytesLike`\>, `originalAttestation`: `PromiseOrValue`\<`BytesLike`\>, `newDestinationCaller`: `PromiseOrValue`\<`BytesLike`\>, `newMintRecipient`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `rescueERC20` | (`tokenContract`: `PromiseOrValue`\<`string`\>, `to`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `rescuer` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `updateRescuer` | (`newRescuer`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `CCTPTokenMessengerInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`CCTPTokenMessenger`](CCTPTokenMessenger.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`CCTPTokenMessenger`](CCTPTokenMessenger.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`CCTPTokenMessenger`](CCTPTokenMessenger.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `acceptOwnership` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `addLocalMinter` | (`newLocalMinter`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `addRemoteTokenMessenger` | (`domain`: `PromiseOrValue`\<`BigNumberish`\>, `tokenMessenger`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `depositForBurn` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `destinationDomain`: `PromiseOrValue`\<`BigNumberish`\>, `mintRecipient`: `PromiseOrValue`\<`BytesLike`\>, `burnToken`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `depositForBurnWithCaller` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `destinationDomain`: `PromiseOrValue`\<`BigNumberish`\>, `mintRecipient`: `PromiseOrValue`\<`BytesLike`\>, `burnToken`: `PromiseOrValue`\<`string`\>, `destinationCaller`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `handleReceiveMessage` | (`remoteDomain`: `PromiseOrValue`\<`BigNumberish`\>, `sender`: `PromiseOrValue`\<`BytesLike`\>, `messageBody`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `localMessageTransmitter` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `localMinter` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `messageBodyVersion` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `pendingOwner` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `remoteTokenMessengers` | (`arg0`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `removeLocalMinter` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `removeRemoteTokenMessenger` | (`domain`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `replaceDepositForBurn` | (`originalMessage`: `PromiseOrValue`\<`BytesLike`\>, `originalAttestation`: `PromiseOrValue`\<`BytesLike`\>, `newDestinationCaller`: `PromiseOrValue`\<`BytesLike`\>, `newMintRecipient`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `rescueERC20` | (`tokenContract`: `PromiseOrValue`\<`string`\>, `to`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `rescuer` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `updateRescuer` | (`newRescuer`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`CCTPTokenMessenger`](CCTPTokenMessenger.md)\>

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

### <a id="addlocalminter" name="addlocalminter"></a> addLocalMinter

▸ **addLocalMinter**(`newLocalMinter`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `newLocalMinter` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="addremotetokenmessenger" name="addremotetokenmessenger"></a> addRemoteTokenMessenger

▸ **addRemoteTokenMessenger**(`domain`, `tokenMessenger`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `domain` | `PromiseOrValue`\<`BigNumberish`\> |
| `tokenMessenger` | `PromiseOrValue`\<`BytesLike`\> |
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

▸ **deployed**(): `Promise`\<[`CCTPTokenMessenger`](CCTPTokenMessenger.md)\>

#### Returns

`Promise`\<[`CCTPTokenMessenger`](CCTPTokenMessenger.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="depositforburn" name="depositforburn"></a> depositForBurn

▸ **depositForBurn**(`amount`, `destinationDomain`, `mintRecipient`, `burnToken`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `destinationDomain` | `PromiseOrValue`\<`BigNumberish`\> |
| `mintRecipient` | `PromiseOrValue`\<`BytesLike`\> |
| `burnToken` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="depositforburnwithcaller" name="depositforburnwithcaller"></a> depositForBurnWithCaller

▸ **depositForBurnWithCaller**(`amount`, `destinationDomain`, `mintRecipient`, `burnToken`, `destinationCaller`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `destinationDomain` | `PromiseOrValue`\<`BigNumberish`\> |
| `mintRecipient` | `PromiseOrValue`\<`BytesLike`\> |
| `burnToken` | `PromiseOrValue`\<`string`\> |
| `destinationCaller` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="handlereceivemessage" name="handlereceivemessage"></a> handleReceiveMessage

▸ **handleReceiveMessage**(`remoteDomain`, `sender`, `messageBody`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `remoteDomain` | `PromiseOrValue`\<`BigNumberish`\> |
| `sender` | `PromiseOrValue`\<`BytesLike`\> |
| `messageBody` | `PromiseOrValue`\<`BytesLike`\> |
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

### <a id="localmessagetransmitter" name="localmessagetransmitter"></a> localMessageTransmitter

▸ **localMessageTransmitter**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="localminter" name="localminter"></a> localMinter

▸ **localMinter**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="messagebodyversion" name="messagebodyversion"></a> messageBodyVersion

▸ **messageBodyVersion**(`overrides?`): `Promise`\<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`number`\>

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

### <a id="remotetokenmessengers" name="remotetokenmessengers"></a> remoteTokenMessengers

▸ **remoteTokenMessengers**(`arg0`, `overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`BigNumberish`\> |
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

### <a id="removelocalminter" name="removelocalminter"></a> removeLocalMinter

▸ **removeLocalMinter**(`overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="removeremotetokenmessenger" name="removeremotetokenmessenger"></a> removeRemoteTokenMessenger

▸ **removeRemoteTokenMessenger**(`domain`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `domain` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="replacedepositforburn" name="replacedepositforburn"></a> replaceDepositForBurn

▸ **replaceDepositForBurn**(`originalMessage`, `originalAttestation`, `newDestinationCaller`, `newMintRecipient`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `originalMessage` | `PromiseOrValue`\<`BytesLike`\> |
| `originalAttestation` | `PromiseOrValue`\<`BytesLike`\> |
| `newDestinationCaller` | `PromiseOrValue`\<`BytesLike`\> |
| `newMintRecipient` | `PromiseOrValue`\<`BytesLike`\> |
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

### <a id="updaterescuer" name="updaterescuer"></a> updateRescuer

▸ **updateRescuer**(`newRescuer`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `newRescuer` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>
