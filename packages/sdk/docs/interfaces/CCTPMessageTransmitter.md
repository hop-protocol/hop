# Interface: CCTPMessageTransmitter

## Hierarchy

- `BaseContract`

  ↳ **`CCTPMessageTransmitter`**

## Table of contents

### Properties

- [callStatic](CCTPMessageTransmitter.md#callstatic)
- [estimateGas](CCTPMessageTransmitter.md#estimategas)
- [filters](CCTPMessageTransmitter.md#filters)
- [functions](CCTPMessageTransmitter.md#functions)
- [interface](CCTPMessageTransmitter.md#interface)
- [off](CCTPMessageTransmitter.md#off)
- [on](CCTPMessageTransmitter.md#on)
- [once](CCTPMessageTransmitter.md#once)
- [populateTransaction](CCTPMessageTransmitter.md#populatetransaction)
- [removeListener](CCTPMessageTransmitter.md#removelistener)

### Methods

- [acceptOwnership](CCTPMessageTransmitter.md#acceptownership)
- [attach](CCTPMessageTransmitter.md#attach)
- [attesterManager](CCTPMessageTransmitter.md#attestermanager)
- [connect](CCTPMessageTransmitter.md#connect)
- [deployed](CCTPMessageTransmitter.md#deployed)
- [disableAttester](CCTPMessageTransmitter.md#disableattester)
- [enableAttester](CCTPMessageTransmitter.md#enableattester)
- [getEnabledAttester](CCTPMessageTransmitter.md#getenabledattester)
- [getNumEnabledAttesters](CCTPMessageTransmitter.md#getnumenabledattesters)
- [isEnabledAttester](CCTPMessageTransmitter.md#isenabledattester)
- [listeners](CCTPMessageTransmitter.md#listeners)
- [localDomain](CCTPMessageTransmitter.md#localdomain)
- [maxMessageBodySize](CCTPMessageTransmitter.md#maxmessagebodysize)
- [nextAvailableNonce](CCTPMessageTransmitter.md#nextavailablenonce)
- [owner](CCTPMessageTransmitter.md#owner)
- [pause](CCTPMessageTransmitter.md#pause)
- [paused](CCTPMessageTransmitter.md#paused)
- [pauser](CCTPMessageTransmitter.md#pauser)
- [pendingOwner](CCTPMessageTransmitter.md#pendingowner)
- [queryFilter](CCTPMessageTransmitter.md#queryfilter)
- [receiveMessage](CCTPMessageTransmitter.md#receivemessage)
- [removeAllListeners](CCTPMessageTransmitter.md#removealllisteners)
- [replaceMessage](CCTPMessageTransmitter.md#replacemessage)
- [rescueERC20](CCTPMessageTransmitter.md#rescueerc20)
- [rescuer](CCTPMessageTransmitter.md#rescuer)
- [sendMessage](CCTPMessageTransmitter.md#sendmessage)
- [sendMessageWithCaller](CCTPMessageTransmitter.md#sendmessagewithcaller)
- [setMaxMessageBodySize](CCTPMessageTransmitter.md#setmaxmessagebodysize)
- [setSignatureThreshold](CCTPMessageTransmitter.md#setsignaturethreshold)
- [signatureThreshold](CCTPMessageTransmitter.md#signaturethreshold)
- [transferOwnership](CCTPMessageTransmitter.md#transferownership)
- [unpause](CCTPMessageTransmitter.md#unpause)
- [updateAttesterManager](CCTPMessageTransmitter.md#updateattestermanager)
- [updatePauser](CCTPMessageTransmitter.md#updatepauser)
- [updateRescuer](CCTPMessageTransmitter.md#updaterescuer)
- [usedNonces](CCTPMessageTransmitter.md#usednonces)
- [version](CCTPMessageTransmitter.md#version)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `acceptOwnership` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `attesterManager` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `disableAttester` | (`attester`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `enableAttester` | (`newAttester`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `getEnabledAttester` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `getNumEnabledAttesters` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `isEnabledAttester` | (`attester`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `localDomain` | (`overrides?`: `CallOverrides`) => `Promise`\<`number`\> |
| `maxMessageBodySize` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `nextAvailableNonce` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `pause` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `paused` | (`overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `pauser` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `pendingOwner` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `receiveMessage` | (`message`: `PromiseOrValue`\<`BytesLike`\>, `attestation`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `replaceMessage` | (`originalMessage`: `PromiseOrValue`\<`BytesLike`\>, `originalAttestation`: `PromiseOrValue`\<`BytesLike`\>, `newMessageBody`: `PromiseOrValue`\<`BytesLike`\>, `newDestinationCaller`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `rescueERC20` | (`tokenContract`: `PromiseOrValue`\<`string`\>, `to`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `rescuer` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `sendMessage` | (`destinationDomain`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`BytesLike`\>, `messageBody`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `sendMessageWithCaller` | (`destinationDomain`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`BytesLike`\>, `destinationCaller`: `PromiseOrValue`\<`BytesLike`\>, `messageBody`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `setMaxMessageBodySize` | (`newMaxMessageBodySize`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setSignatureThreshold` | (`newSignatureThreshold`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `signatureThreshold` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `unpause` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `updateAttesterManager` | (`newAttesterManager`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `updatePauser` | (`_newPauser`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `updateRescuer` | (`newRescuer`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `usedNonces` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `version` | (`overrides?`: `CallOverrides`) => `Promise`\<`number`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `acceptOwnership` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `attesterManager` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `disableAttester` | (`attester`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `enableAttester` | (`newAttester`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `getEnabledAttester` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getNumEnabledAttesters` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `isEnabledAttester` | (`attester`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `localDomain` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `maxMessageBodySize` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `nextAvailableNonce` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `pause` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `paused` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `pauser` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `pendingOwner` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `receiveMessage` | (`message`: `PromiseOrValue`\<`BytesLike`\>, `attestation`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `replaceMessage` | (`originalMessage`: `PromiseOrValue`\<`BytesLike`\>, `originalAttestation`: `PromiseOrValue`\<`BytesLike`\>, `newMessageBody`: `PromiseOrValue`\<`BytesLike`\>, `newDestinationCaller`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `rescueERC20` | (`tokenContract`: `PromiseOrValue`\<`string`\>, `to`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `rescuer` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `sendMessage` | (`destinationDomain`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`BytesLike`\>, `messageBody`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `sendMessageWithCaller` | (`destinationDomain`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`BytesLike`\>, `destinationCaller`: `PromiseOrValue`\<`BytesLike`\>, `messageBody`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setMaxMessageBodySize` | (`newMaxMessageBodySize`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setSignatureThreshold` | (`newSignatureThreshold`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `signatureThreshold` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `unpause` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `updateAttesterManager` | (`newAttesterManager`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `updatePauser` | (`_newPauser`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `updateRescuer` | (`newRescuer`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `usedNonces` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `version` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `AttesterDisabled` | (`attester?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `AttesterDisabledEventFilter` |
| `AttesterDisabled(address)` | (`attester?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `AttesterDisabledEventFilter` |
| `AttesterEnabled` | (`attester?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `AttesterEnabledEventFilter` |
| `AttesterEnabled(address)` | (`attester?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `AttesterEnabledEventFilter` |
| `AttesterManagerUpdated` | (`previousAttesterManager?`: ``null`` \| `PromiseOrValue`\<`string`\>, `newAttesterManager?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `AttesterManagerUpdatedEventFilter` |
| `AttesterManagerUpdated(address,address)` | (`previousAttesterManager?`: ``null`` \| `PromiseOrValue`\<`string`\>, `newAttesterManager?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `AttesterManagerUpdatedEventFilter` |
| `MaxMessageBodySizeUpdated` | (`newMaxMessageBodySize?`: ``null``) => `MaxMessageBodySizeUpdatedEventFilter` |
| `MaxMessageBodySizeUpdated(uint256)` | (`newMaxMessageBodySize?`: ``null``) => `MaxMessageBodySizeUpdatedEventFilter` |
| `MessageReceived` | (`caller?`: ``null`` \| `PromiseOrValue`\<`string`\>, `sourceDomain?`: ``null``, `nonce?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `sender?`: ``null``, `messageBody?`: ``null``) => `MessageReceivedEventFilter` |
| `MessageReceived(address,uint32,uint64,bytes32,bytes)` | (`caller?`: ``null`` \| `PromiseOrValue`\<`string`\>, `sourceDomain?`: ``null``, `nonce?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `sender?`: ``null``, `messageBody?`: ``null``) => `MessageReceivedEventFilter` |
| `MessageSent` | (`message?`: ``null``) => `MessageSentEventFilter` |
| `MessageSent(bytes)` | (`message?`: ``null``) => `MessageSentEventFilter` |
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
| `SignatureThresholdUpdated` | (`oldSignatureThreshold?`: ``null``, `newSignatureThreshold?`: ``null``) => `SignatureThresholdUpdatedEventFilter` |
| `SignatureThresholdUpdated(uint256,uint256)` | (`oldSignatureThreshold?`: ``null``, `newSignatureThreshold?`: ``null``) => `SignatureThresholdUpdatedEventFilter` |
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
| `attesterManager` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `disableAttester` | (`attester`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `enableAttester` | (`newAttester`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `getEnabledAttester` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `getNumEnabledAttesters` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `isEnabledAttester` | (`attester`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `localDomain` | (`overrides?`: `CallOverrides`) => `Promise`\<[`number`]\> |
| `maxMessageBodySize` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `nextAvailableNonce` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `pause` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `paused` | (`overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `pauser` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `pendingOwner` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `receiveMessage` | (`message`: `PromiseOrValue`\<`BytesLike`\>, `attestation`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `replaceMessage` | (`originalMessage`: `PromiseOrValue`\<`BytesLike`\>, `originalAttestation`: `PromiseOrValue`\<`BytesLike`\>, `newMessageBody`: `PromiseOrValue`\<`BytesLike`\>, `newDestinationCaller`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `rescueERC20` | (`tokenContract`: `PromiseOrValue`\<`string`\>, `to`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `rescuer` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `sendMessage` | (`destinationDomain`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`BytesLike`\>, `messageBody`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `sendMessageWithCaller` | (`destinationDomain`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`BytesLike`\>, `destinationCaller`: `PromiseOrValue`\<`BytesLike`\>, `messageBody`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setMaxMessageBodySize` | (`newMaxMessageBodySize`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setSignatureThreshold` | (`newSignatureThreshold`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `signatureThreshold` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `unpause` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `updateAttesterManager` | (`newAttesterManager`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `updatePauser` | (`_newPauser`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `updateRescuer` | (`newRescuer`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `usedNonces` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `version` | (`overrides?`: `CallOverrides`) => `Promise`\<[`number`]\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `CCTPMessageTransmitterInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`CCTPMessageTransmitter`](CCTPMessageTransmitter.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`CCTPMessageTransmitter`](CCTPMessageTransmitter.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`CCTPMessageTransmitter`](CCTPMessageTransmitter.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `acceptOwnership` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `attesterManager` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `disableAttester` | (`attester`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `enableAttester` | (`newAttester`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `getEnabledAttester` | (`index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getNumEnabledAttesters` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `isEnabledAttester` | (`attester`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `localDomain` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `maxMessageBodySize` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `nextAvailableNonce` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `pause` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `paused` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `pauser` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `pendingOwner` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `receiveMessage` | (`message`: `PromiseOrValue`\<`BytesLike`\>, `attestation`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `replaceMessage` | (`originalMessage`: `PromiseOrValue`\<`BytesLike`\>, `originalAttestation`: `PromiseOrValue`\<`BytesLike`\>, `newMessageBody`: `PromiseOrValue`\<`BytesLike`\>, `newDestinationCaller`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `rescueERC20` | (`tokenContract`: `PromiseOrValue`\<`string`\>, `to`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `rescuer` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `sendMessage` | (`destinationDomain`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`BytesLike`\>, `messageBody`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `sendMessageWithCaller` | (`destinationDomain`: `PromiseOrValue`\<`BigNumberish`\>, `recipient`: `PromiseOrValue`\<`BytesLike`\>, `destinationCaller`: `PromiseOrValue`\<`BytesLike`\>, `messageBody`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setMaxMessageBodySize` | (`newMaxMessageBodySize`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setSignatureThreshold` | (`newSignatureThreshold`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `signatureThreshold` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `unpause` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `updateAttesterManager` | (`newAttesterManager`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `updatePauser` | (`_newPauser`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `updateRescuer` | (`newRescuer`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `usedNonces` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `version` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`CCTPMessageTransmitter`](CCTPMessageTransmitter.md)\>

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

### <a id="attestermanager" name="attestermanager"></a> attesterManager

▸ **attesterManager**(`overrides?`): `Promise`\<`string`\>

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

### <a id="deployed" name="deployed"></a> deployed

▸ **deployed**(): `Promise`\<[`CCTPMessageTransmitter`](CCTPMessageTransmitter.md)\>

#### Returns

`Promise`\<[`CCTPMessageTransmitter`](CCTPMessageTransmitter.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="disableattester" name="disableattester"></a> disableAttester

▸ **disableAttester**(`attester`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `attester` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="enableattester" name="enableattester"></a> enableAttester

▸ **enableAttester**(`newAttester`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `newAttester` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="getenabledattester" name="getenabledattester"></a> getEnabledAttester

▸ **getEnabledAttester**(`index`, `overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="getnumenabledattesters" name="getnumenabledattesters"></a> getNumEnabledAttesters

▸ **getNumEnabledAttesters**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="isenabledattester" name="isenabledattester"></a> isEnabledAttester

▸ **isEnabledAttester**(`attester`, `overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `attester` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

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

### <a id="localdomain" name="localdomain"></a> localDomain

▸ **localDomain**(`overrides?`): `Promise`\<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`number`\>

___

### <a id="maxmessagebodysize" name="maxmessagebodysize"></a> maxMessageBodySize

▸ **maxMessageBodySize**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="nextavailablenonce" name="nextavailablenonce"></a> nextAvailableNonce

▸ **nextAvailableNonce**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

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

### <a id="receivemessage" name="receivemessage"></a> receiveMessage

▸ **receiveMessage**(`message`, `attestation`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `PromiseOrValue`\<`BytesLike`\> |
| `attestation` | `PromiseOrValue`\<`BytesLike`\> |
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

### <a id="replacemessage" name="replacemessage"></a> replaceMessage

▸ **replaceMessage**(`originalMessage`, `originalAttestation`, `newMessageBody`, `newDestinationCaller`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `originalMessage` | `PromiseOrValue`\<`BytesLike`\> |
| `originalAttestation` | `PromiseOrValue`\<`BytesLike`\> |
| `newMessageBody` | `PromiseOrValue`\<`BytesLike`\> |
| `newDestinationCaller` | `PromiseOrValue`\<`BytesLike`\> |
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

### <a id="sendmessage" name="sendmessage"></a> sendMessage

▸ **sendMessage**(`destinationDomain`, `recipient`, `messageBody`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `destinationDomain` | `PromiseOrValue`\<`BigNumberish`\> |
| `recipient` | `PromiseOrValue`\<`BytesLike`\> |
| `messageBody` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="sendmessagewithcaller" name="sendmessagewithcaller"></a> sendMessageWithCaller

▸ **sendMessageWithCaller**(`destinationDomain`, `recipient`, `destinationCaller`, `messageBody`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `destinationDomain` | `PromiseOrValue`\<`BigNumberish`\> |
| `recipient` | `PromiseOrValue`\<`BytesLike`\> |
| `destinationCaller` | `PromiseOrValue`\<`BytesLike`\> |
| `messageBody` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setmaxmessagebodysize" name="setmaxmessagebodysize"></a> setMaxMessageBodySize

▸ **setMaxMessageBodySize**(`newMaxMessageBodySize`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `newMaxMessageBodySize` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setsignaturethreshold" name="setsignaturethreshold"></a> setSignatureThreshold

▸ **setSignatureThreshold**(`newSignatureThreshold`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `newSignatureThreshold` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="signaturethreshold" name="signaturethreshold"></a> signatureThreshold

▸ **signatureThreshold**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

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

### <a id="unpause" name="unpause"></a> unpause

▸ **unpause**(`overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="updateattestermanager" name="updateattestermanager"></a> updateAttesterManager

▸ **updateAttesterManager**(`newAttesterManager`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `newAttesterManager` | `PromiseOrValue`\<`string`\> |
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

___

### <a id="usednonces" name="usednonces"></a> usedNonces

▸ **usedNonces**(`arg0`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="version" name="version"></a> version

▸ **version**(`overrides?`): `Promise`\<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`number`\>
