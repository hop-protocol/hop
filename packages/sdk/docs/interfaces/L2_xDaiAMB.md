# Interface: L2\_xDaiAMB

## Hierarchy

- `BaseContract`

  ↳ **`L2_xDaiAMB`**

## Table of contents

### Properties

- [callStatic](L2_xDaiAMB.md#callstatic)
- [estimateGas](L2_xDaiAMB.md#estimategas)
- [filters](L2_xDaiAMB.md#filters)
- [functions](L2_xDaiAMB.md#functions)
- [interface](L2_xDaiAMB.md#interface)
- [off](L2_xDaiAMB.md#off)
- [on](L2_xDaiAMB.md#on)
- [once](L2_xDaiAMB.md#once)
- [populateTransaction](L2_xDaiAMB.md#populatetransaction)
- [removeListener](L2_xDaiAMB.md#removelistener)

### Methods

- [\_sendMessage](L2_xDaiAMB.md#_sendmessage)
- [affirmationsSigned](L2_xDaiAMB.md#affirmationssigned)
- [attach](L2_xDaiAMB.md#attach)
- [connect](L2_xDaiAMB.md#connect)
- [decimalShift](L2_xDaiAMB.md#decimalshift)
- [deployed](L2_xDaiAMB.md#deployed)
- [deployedAtBlock](L2_xDaiAMB.md#deployedatblock)
- [destinationChainId](L2_xDaiAMB.md#destinationchainid)
- [executeAffirmation](L2_xDaiAMB.md#executeaffirmation)
- [failedMessageDataHash](L2_xDaiAMB.md#failedmessagedatahash)
- [failedMessageReceiver](L2_xDaiAMB.md#failedmessagereceiver)
- [failedMessageSender](L2_xDaiAMB.md#failedmessagesender)
- [gasPrice](L2_xDaiAMB.md#gasprice)
- [getBridgeInterfacesVersion](L2_xDaiAMB.md#getbridgeinterfacesversion)
- [getBridgeMode](L2_xDaiAMB.md#getbridgemode)
- [getMinimumGasUsage](L2_xDaiAMB.md#getminimumgasusage)
- [initialize](L2_xDaiAMB.md#initialize)
- [isAlreadyProcessed](L2_xDaiAMB.md#isalreadyprocessed)
- [isInitialized](L2_xDaiAMB.md#isinitialized)
- [listeners](L2_xDaiAMB.md#listeners)
- [maxGasPerTx](L2_xDaiAMB.md#maxgaspertx)
- [message](L2_xDaiAMB.md#message)
- [messageCallStatus](L2_xDaiAMB.md#messagecallstatus)
- [messageId](L2_xDaiAMB.md#messageid)
- [messageSender](L2_xDaiAMB.md#messagesender)
- [messageSourceChainId](L2_xDaiAMB.md#messagesourcechainid)
- [messagesSigned](L2_xDaiAMB.md#messagessigned)
- [numAffirmationsSigned](L2_xDaiAMB.md#numaffirmationssigned)
- [numMessagesSigned](L2_xDaiAMB.md#nummessagessigned)
- [owner](L2_xDaiAMB.md#owner)
- [queryFilter](L2_xDaiAMB.md#queryfilter)
- [removeAllListeners](L2_xDaiAMB.md#removealllisteners)
- [requireToConfirmMessage](L2_xDaiAMB.md#requiretoconfirmmessage)
- [requireToPassMessage](L2_xDaiAMB.md#requiretopassmessage)
- [requiredBlockConfirmations](L2_xDaiAMB.md#requiredblockconfirmations)
- [requiredSignatures](L2_xDaiAMB.md#requiredsignatures)
- [setChainIds](L2_xDaiAMB.md#setchainids)
- [setGasPrice](L2_xDaiAMB.md#setgasprice)
- [setMaxGasPerTx](L2_xDaiAMB.md#setmaxgaspertx)
- [setRequiredBlockConfirmations](L2_xDaiAMB.md#setrequiredblockconfirmations)
- [signature](L2_xDaiAMB.md#signature)
- [sourceChainId](L2_xDaiAMB.md#sourcechainid)
- [submitSignature](L2_xDaiAMB.md#submitsignature)
- [transactionHash](L2_xDaiAMB.md#transactionhash)
- [transferOwnership](L2_xDaiAMB.md#transferownership)
- [validatorContract](L2_xDaiAMB.md#validatorcontract)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_sendMessage` | (`_contract`: `PromiseOrValue`\<`string`\>, `_data`: `PromiseOrValue`\<`BytesLike`\>, `_gas`: `PromiseOrValue`\<`BigNumberish`\>, `_dataType`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `affirmationsSigned` | (`_hash`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `decimalShift` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `deployedAtBlock` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `destinationChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `executeAffirmation` | (`message`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `failedMessageDataHash` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `failedMessageReceiver` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `failedMessageSender` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `gasPrice` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getBridgeInterfacesVersion` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `BigNumber`, `BigNumber`] & \{ `major`: `BigNumber` ; `minor`: `BigNumber` ; `patch`: `BigNumber`  }\> |
| `getBridgeMode` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `getMinimumGasUsage` | (`_data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `initialize` | (`_sourceChainId`: `PromiseOrValue`\<`BigNumberish`\>, `_destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `_validatorContract`: `PromiseOrValue`\<`string`\>, `_maxGasPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `_gasPrice`: `PromiseOrValue`\<`BigNumberish`\>, `_requiredBlockConfirmations`: `PromiseOrValue`\<`BigNumberish`\>, `_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `isAlreadyProcessed` | (`_number`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `isInitialized` | (`overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `maxGasPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `message` | (`_hash`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `messageCallStatus` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `messageId` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `messageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `messageSourceChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `messagesSigned` | (`_message`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `numAffirmationsSigned` | (`_hash`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `numMessagesSigned` | (`_message`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `requireToConfirmMessage` | (`_contract`: `PromiseOrValue`\<`string`\>, `_data`: `PromiseOrValue`\<`BytesLike`\>, `_gas`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `requireToPassMessage` | (`_contract`: `PromiseOrValue`\<`string`\>, `_data`: `PromiseOrValue`\<`BytesLike`\>, `_gas`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `requiredBlockConfirmations` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `requiredSignatures` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `setChainIds` | (`_sourceChainId`: `PromiseOrValue`\<`BigNumberish`\>, `_destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setGasPrice` | (`_gasPrice`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setMaxGasPerTx` | (`_maxGasPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setRequiredBlockConfirmations` | (`_blockConfirmations`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `signature` | (`_hash`: `PromiseOrValue`\<`BytesLike`\>, `_index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `sourceChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `submitSignature` | (`signature`: `PromiseOrValue`\<`BytesLike`\>, `message`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `transactionHash` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `validatorContract` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_sendMessage` | (`_contract`: `PromiseOrValue`\<`string`\>, `_data`: `PromiseOrValue`\<`BytesLike`\>, `_gas`: `PromiseOrValue`\<`BigNumberish`\>, `_dataType`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `affirmationsSigned` | (`_hash`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `decimalShift` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `deployedAtBlock` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `destinationChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `executeAffirmation` | (`message`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `failedMessageDataHash` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `failedMessageReceiver` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `failedMessageSender` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `gasPrice` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getBridgeInterfacesVersion` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getBridgeMode` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getMinimumGasUsage` | (`_data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `initialize` | (`_sourceChainId`: `PromiseOrValue`\<`BigNumberish`\>, `_destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `_validatorContract`: `PromiseOrValue`\<`string`\>, `_maxGasPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `_gasPrice`: `PromiseOrValue`\<`BigNumberish`\>, `_requiredBlockConfirmations`: `PromiseOrValue`\<`BigNumberish`\>, `_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `isAlreadyProcessed` | (`_number`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `isInitialized` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `maxGasPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `message` | (`_hash`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `messageCallStatus` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `messageId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `messageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `messageSourceChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `messagesSigned` | (`_message`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `numAffirmationsSigned` | (`_hash`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `numMessagesSigned` | (`_message`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `requireToConfirmMessage` | (`_contract`: `PromiseOrValue`\<`string`\>, `_data`: `PromiseOrValue`\<`BytesLike`\>, `_gas`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `requireToPassMessage` | (`_contract`: `PromiseOrValue`\<`string`\>, `_data`: `PromiseOrValue`\<`BytesLike`\>, `_gas`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `requiredBlockConfirmations` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `requiredSignatures` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `setChainIds` | (`_sourceChainId`: `PromiseOrValue`\<`BigNumberish`\>, `_destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setGasPrice` | (`_gasPrice`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setMaxGasPerTx` | (`_maxGasPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setRequiredBlockConfirmations` | (`_blockConfirmations`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `signature` | (`_hash`: `PromiseOrValue`\<`BytesLike`\>, `_index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `sourceChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `submitSignature` | (`signature`: `PromiseOrValue`\<`BytesLike`\>, `message`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `transactionHash` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `validatorContract` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `AffirmationCompleted` | (`sender?`: ``null`` \| `PromiseOrValue`\<`string`\>, `executor?`: ``null`` \| `PromiseOrValue`\<`string`\>, `messageId?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `status?`: ``null``) => `AffirmationCompletedEventFilter` |
| `AffirmationCompleted(address,address,bytes32,bool)` | (`sender?`: ``null`` \| `PromiseOrValue`\<`string`\>, `executor?`: ``null`` \| `PromiseOrValue`\<`string`\>, `messageId?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `status?`: ``null``) => `AffirmationCompletedEventFilter` |
| `CollectedSignatures` | (`authorityResponsibleForRelay?`: ``null``, `messageHash?`: ``null``, `NumberOfCollectedSignatures?`: ``null``) => `CollectedSignaturesEventFilter` |
| `CollectedSignatures(address,bytes32,uint256)` | (`authorityResponsibleForRelay?`: ``null``, `messageHash?`: ``null``, `NumberOfCollectedSignatures?`: ``null``) => `CollectedSignaturesEventFilter` |
| `GasPriceChanged` | (`gasPrice?`: ``null``) => `GasPriceChangedEventFilter` |
| `GasPriceChanged(uint256)` | (`gasPrice?`: ``null``) => `GasPriceChangedEventFilter` |
| `OwnershipTransferred` | (`previousOwner?`: ``null``, `newOwner?`: ``null``) => `OwnershipTransferredEventFilter` |
| `OwnershipTransferred(address,address)` | (`previousOwner?`: ``null``, `newOwner?`: ``null``) => `OwnershipTransferredEventFilter` |
| `RequiredBlockConfirmationChanged` | (`requiredBlockConfirmations?`: ``null``) => `RequiredBlockConfirmationChangedEventFilter` |
| `RequiredBlockConfirmationChanged(uint256)` | (`requiredBlockConfirmations?`: ``null``) => `RequiredBlockConfirmationChangedEventFilter` |
| `SignedForAffirmation` | (`signer?`: ``null`` \| `PromiseOrValue`\<`string`\>, `messageHash?`: ``null``) => `SignedForAffirmationEventFilter` |
| `SignedForAffirmation(address,bytes32)` | (`signer?`: ``null`` \| `PromiseOrValue`\<`string`\>, `messageHash?`: ``null``) => `SignedForAffirmationEventFilter` |
| `SignedForUserRequest` | (`signer?`: ``null`` \| `PromiseOrValue`\<`string`\>, `messageHash?`: ``null``) => `SignedForUserRequestEventFilter` |
| `SignedForUserRequest(address,bytes32)` | (`signer?`: ``null`` \| `PromiseOrValue`\<`string`\>, `messageHash?`: ``null``) => `SignedForUserRequestEventFilter` |
| `UserRequestForSignature` | (`messageId?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `encodedData?`: ``null``) => `UserRequestForSignatureEventFilter` |
| `UserRequestForSignature(bytes32,bytes)` | (`messageId?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `encodedData?`: ``null``) => `UserRequestForSignatureEventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_sendMessage` | (`_contract`: `PromiseOrValue`\<`string`\>, `_data`: `PromiseOrValue`\<`BytesLike`\>, `_gas`: `PromiseOrValue`\<`BigNumberish`\>, `_dataType`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `affirmationsSigned` | (`_hash`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `decimalShift` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `deployedAtBlock` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `destinationChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `executeAffirmation` | (`message`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `failedMessageDataHash` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `failedMessageReceiver` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `failedMessageSender` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `gasPrice` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getBridgeInterfacesVersion` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `BigNumber`, `BigNumber`] & \{ `major`: `BigNumber` ; `minor`: `BigNumber` ; `patch`: `BigNumber`  }\> |
| `getBridgeMode` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`] & \{ `_data`: `string`  }\> |
| `getMinimumGasUsage` | (`_data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`] & \{ `gas`: `BigNumber`  }\> |
| `initialize` | (`_sourceChainId`: `PromiseOrValue`\<`BigNumberish`\>, `_destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `_validatorContract`: `PromiseOrValue`\<`string`\>, `_maxGasPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `_gasPrice`: `PromiseOrValue`\<`BigNumberish`\>, `_requiredBlockConfirmations`: `PromiseOrValue`\<`BigNumberish`\>, `_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `isAlreadyProcessed` | (`_number`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `isInitialized` | (`overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `maxGasPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `message` | (`_hash`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `messageCallStatus` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `messageId` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`] & \{ `id`: `string`  }\> |
| `messageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`] & \{ `sender`: `string`  }\> |
| `messageSourceChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`] & \{ `id`: `BigNumber`  }\> |
| `messagesSigned` | (`_message`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `numAffirmationsSigned` | (`_hash`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `numMessagesSigned` | (`_message`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `requireToConfirmMessage` | (`_contract`: `PromiseOrValue`\<`string`\>, `_data`: `PromiseOrValue`\<`BytesLike`\>, `_gas`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `requireToPassMessage` | (`_contract`: `PromiseOrValue`\<`string`\>, `_data`: `PromiseOrValue`\<`BytesLike`\>, `_gas`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `requiredBlockConfirmations` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `requiredSignatures` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `setChainIds` | (`_sourceChainId`: `PromiseOrValue`\<`BigNumberish`\>, `_destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setGasPrice` | (`_gasPrice`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setMaxGasPerTx` | (`_maxGasPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setRequiredBlockConfirmations` | (`_blockConfirmations`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `signature` | (`_hash`: `PromiseOrValue`\<`BytesLike`\>, `_index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `sourceChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `submitSignature` | (`signature`: `PromiseOrValue`\<`BytesLike`\>, `message`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `transactionHash` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `validatorContract` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `L2_xDaiAMBInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`L2_xDaiAMB`](L2_xDaiAMB.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`L2_xDaiAMB`](L2_xDaiAMB.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`L2_xDaiAMB`](L2_xDaiAMB.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_sendMessage` | (`_contract`: `PromiseOrValue`\<`string`\>, `_data`: `PromiseOrValue`\<`BytesLike`\>, `_gas`: `PromiseOrValue`\<`BigNumberish`\>, `_dataType`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `affirmationsSigned` | (`_hash`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `decimalShift` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `deployedAtBlock` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `destinationChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `executeAffirmation` | (`message`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `failedMessageDataHash` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `failedMessageReceiver` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `failedMessageSender` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `gasPrice` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getBridgeInterfacesVersion` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getBridgeMode` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getMinimumGasUsage` | (`_data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `initialize` | (`_sourceChainId`: `PromiseOrValue`\<`BigNumberish`\>, `_destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `_validatorContract`: `PromiseOrValue`\<`string`\>, `_maxGasPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `_gasPrice`: `PromiseOrValue`\<`BigNumberish`\>, `_requiredBlockConfirmations`: `PromiseOrValue`\<`BigNumberish`\>, `_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `isAlreadyProcessed` | (`_number`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `isInitialized` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `maxGasPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `message` | (`_hash`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `messageCallStatus` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `messageId` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `messageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `messageSourceChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `messagesSigned` | (`_message`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `numAffirmationsSigned` | (`_hash`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `numMessagesSigned` | (`_message`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `requireToConfirmMessage` | (`_contract`: `PromiseOrValue`\<`string`\>, `_data`: `PromiseOrValue`\<`BytesLike`\>, `_gas`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `requireToPassMessage` | (`_contract`: `PromiseOrValue`\<`string`\>, `_data`: `PromiseOrValue`\<`BytesLike`\>, `_gas`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `requiredBlockConfirmations` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `requiredSignatures` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `setChainIds` | (`_sourceChainId`: `PromiseOrValue`\<`BigNumberish`\>, `_destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setGasPrice` | (`_gasPrice`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setMaxGasPerTx` | (`_maxGasPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setRequiredBlockConfirmations` | (`_blockConfirmations`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `signature` | (`_hash`: `PromiseOrValue`\<`BytesLike`\>, `_index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `sourceChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `submitSignature` | (`signature`: `PromiseOrValue`\<`BytesLike`\>, `message`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `transactionHash` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `validatorContract` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`L2_xDaiAMB`](L2_xDaiAMB.md)\>

#### Overrides

BaseContract.removeListener

## Methods

### <a id="_sendmessage" name="_sendmessage"></a> \_sendMessage

▸ **_sendMessage**(`_contract`, `_data`, `_gas`, `_dataType`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_contract` | `PromiseOrValue`\<`string`\> |
| `_data` | `PromiseOrValue`\<`BytesLike`\> |
| `_gas` | `PromiseOrValue`\<`BigNumberish`\> |
| `_dataType` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="affirmationssigned" name="affirmationssigned"></a> affirmationsSigned

▸ **affirmationsSigned**(`_hash`, `overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_hash` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

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

### <a id="decimalshift" name="decimalshift"></a> decimalShift

▸ **decimalShift**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="deployed" name="deployed"></a> deployed

▸ **deployed**(): `Promise`\<[`L2_xDaiAMB`](L2_xDaiAMB.md)\>

#### Returns

`Promise`\<[`L2_xDaiAMB`](L2_xDaiAMB.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="deployedatblock" name="deployedatblock"></a> deployedAtBlock

▸ **deployedAtBlock**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="destinationchainid" name="destinationchainid"></a> destinationChainId

▸ **destinationChainId**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="executeaffirmation" name="executeaffirmation"></a> executeAffirmation

▸ **executeAffirmation**(`message`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="failedmessagedatahash" name="failedmessagedatahash"></a> failedMessageDataHash

▸ **failedMessageDataHash**(`_messageId`, `overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_messageId` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="failedmessagereceiver" name="failedmessagereceiver"></a> failedMessageReceiver

▸ **failedMessageReceiver**(`_messageId`, `overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_messageId` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="failedmessagesender" name="failedmessagesender"></a> failedMessageSender

▸ **failedMessageSender**(`_messageId`, `overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_messageId` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="gasprice" name="gasprice"></a> gasPrice

▸ **gasPrice**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getbridgeinterfacesversion" name="getbridgeinterfacesversion"></a> getBridgeInterfacesVersion

▸ **getBridgeInterfacesVersion**(`overrides?`): `Promise`\<[`BigNumber`, `BigNumber`, `BigNumber`] & \{ `major`: `BigNumber` ; `minor`: `BigNumber` ; `patch`: `BigNumber`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<[`BigNumber`, `BigNumber`, `BigNumber`] & \{ `major`: `BigNumber` ; `minor`: `BigNumber` ; `patch`: `BigNumber`  }\>

___

### <a id="getbridgemode" name="getbridgemode"></a> getBridgeMode

▸ **getBridgeMode**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="getminimumgasusage" name="getminimumgasusage"></a> getMinimumGasUsage

▸ **getMinimumGasUsage**(`_data`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_data` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="initialize" name="initialize"></a> initialize

▸ **initialize**(`_sourceChainId`, `_destinationChainId`, `_validatorContract`, `_maxGasPerTx`, `_gasPrice`, `_requiredBlockConfirmations`, `_owner`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_sourceChainId` | `PromiseOrValue`\<`BigNumberish`\> |
| `_destinationChainId` | `PromiseOrValue`\<`BigNumberish`\> |
| `_validatorContract` | `PromiseOrValue`\<`string`\> |
| `_maxGasPerTx` | `PromiseOrValue`\<`BigNumberish`\> |
| `_gasPrice` | `PromiseOrValue`\<`BigNumberish`\> |
| `_requiredBlockConfirmations` | `PromiseOrValue`\<`BigNumberish`\> |
| `_owner` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="isalreadyprocessed" name="isalreadyprocessed"></a> isAlreadyProcessed

▸ **isAlreadyProcessed**(`_number`, `overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_number` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="isinitialized" name="isinitialized"></a> isInitialized

▸ **isInitialized**(`overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
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

### <a id="maxgaspertx" name="maxgaspertx"></a> maxGasPerTx

▸ **maxGasPerTx**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="message" name="message"></a> message

▸ **message**(`_hash`, `overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_hash` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="messagecallstatus" name="messagecallstatus"></a> messageCallStatus

▸ **messageCallStatus**(`_messageId`, `overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_messageId` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="messageid" name="messageid"></a> messageId

▸ **messageId**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="messagesender" name="messagesender"></a> messageSender

▸ **messageSender**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="messagesourcechainid" name="messagesourcechainid"></a> messageSourceChainId

▸ **messageSourceChainId**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="messagessigned" name="messagessigned"></a> messagesSigned

▸ **messagesSigned**(`_message`, `overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_message` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="numaffirmationssigned" name="numaffirmationssigned"></a> numAffirmationsSigned

▸ **numAffirmationsSigned**(`_hash`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_hash` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="nummessagessigned" name="nummessagessigned"></a> numMessagesSigned

▸ **numMessagesSigned**(`_message`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_message` | `PromiseOrValue`\<`BytesLike`\> |
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

### <a id="requiretoconfirmmessage" name="requiretoconfirmmessage"></a> requireToConfirmMessage

▸ **requireToConfirmMessage**(`_contract`, `_data`, `_gas`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_contract` | `PromiseOrValue`\<`string`\> |
| `_data` | `PromiseOrValue`\<`BytesLike`\> |
| `_gas` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="requiretopassmessage" name="requiretopassmessage"></a> requireToPassMessage

▸ **requireToPassMessage**(`_contract`, `_data`, `_gas`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_contract` | `PromiseOrValue`\<`string`\> |
| `_data` | `PromiseOrValue`\<`BytesLike`\> |
| `_gas` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="requiredblockconfirmations" name="requiredblockconfirmations"></a> requiredBlockConfirmations

▸ **requiredBlockConfirmations**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="requiredsignatures" name="requiredsignatures"></a> requiredSignatures

▸ **requiredSignatures**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="setchainids" name="setchainids"></a> setChainIds

▸ **setChainIds**(`_sourceChainId`, `_destinationChainId`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_sourceChainId` | `PromiseOrValue`\<`BigNumberish`\> |
| `_destinationChainId` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setgasprice" name="setgasprice"></a> setGasPrice

▸ **setGasPrice**(`_gasPrice`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_gasPrice` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setmaxgaspertx" name="setmaxgaspertx"></a> setMaxGasPerTx

▸ **setMaxGasPerTx**(`_maxGasPerTx`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_maxGasPerTx` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setrequiredblockconfirmations" name="setrequiredblockconfirmations"></a> setRequiredBlockConfirmations

▸ **setRequiredBlockConfirmations**(`_blockConfirmations`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_blockConfirmations` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="signature" name="signature"></a> signature

▸ **signature**(`_hash`, `_index`, `overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_hash` | `PromiseOrValue`\<`BytesLike`\> |
| `_index` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="sourcechainid" name="sourcechainid"></a> sourceChainId

▸ **sourceChainId**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="submitsignature" name="submitsignature"></a> submitSignature

▸ **submitSignature**(`signature`, `message`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `signature` | `PromiseOrValue`\<`BytesLike`\> |
| `message` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="transactionhash" name="transactionhash"></a> transactionHash

▸ **transactionHash**(`overrides?`): `Promise`\<`string`\>

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

### <a id="validatorcontract" name="validatorcontract"></a> validatorContract

▸ **validatorContract**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>
