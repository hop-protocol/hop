# Interface: L1\_xDaiAMB

## Hierarchy

- `BaseContract`

  ↳ **`L1_xDaiAMB`**

## Table of contents

### Properties

- [callStatic](L1_xDaiAMB.md#callstatic)
- [estimateGas](L1_xDaiAMB.md#estimategas)
- [filters](L1_xDaiAMB.md#filters)
- [functions](L1_xDaiAMB.md#functions)
- [interface](L1_xDaiAMB.md#interface)
- [off](L1_xDaiAMB.md#off)
- [on](L1_xDaiAMB.md#on)
- [once](L1_xDaiAMB.md#once)
- [populateTransaction](L1_xDaiAMB.md#populatetransaction)
- [removeListener](L1_xDaiAMB.md#removelistener)

### Methods

- [\_sendMessage](L1_xDaiAMB.md#_sendmessage)
- [attach](L1_xDaiAMB.md#attach)
- [connect](L1_xDaiAMB.md#connect)
- [decimalShift](L1_xDaiAMB.md#decimalshift)
- [deployed](L1_xDaiAMB.md#deployed)
- [deployedAtBlock](L1_xDaiAMB.md#deployedatblock)
- [destinationChainId](L1_xDaiAMB.md#destinationchainid)
- [executeSignatures](L1_xDaiAMB.md#executesignatures)
- [failedMessageDataHash](L1_xDaiAMB.md#failedmessagedatahash)
- [failedMessageReceiver](L1_xDaiAMB.md#failedmessagereceiver)
- [failedMessageSender](L1_xDaiAMB.md#failedmessagesender)
- [gasPrice](L1_xDaiAMB.md#gasprice)
- [gasToken](L1_xDaiAMB.md#gastoken)
- [gasTokenReceiver](L1_xDaiAMB.md#gastokenreceiver)
- [gasTokenTargetMintValue](L1_xDaiAMB.md#gastokentargetmintvalue)
- [getBridgeInterfacesVersion](L1_xDaiAMB.md#getbridgeinterfacesversion)
- [getBridgeMode](L1_xDaiAMB.md#getbridgemode)
- [getMinimumGasUsage](L1_xDaiAMB.md#getminimumgasusage)
- [initialize](L1_xDaiAMB.md#initialize)
- [isInitialized](L1_xDaiAMB.md#isinitialized)
- [listeners](L1_xDaiAMB.md#listeners)
- [maxGasPerTx](L1_xDaiAMB.md#maxgaspertx)
- [messageCallStatus](L1_xDaiAMB.md#messagecallstatus)
- [messageId](L1_xDaiAMB.md#messageid)
- [messageSender](L1_xDaiAMB.md#messagesender)
- [messageSourceChainId](L1_xDaiAMB.md#messagesourcechainid)
- [owner](L1_xDaiAMB.md#owner)
- [queryFilter](L1_xDaiAMB.md#queryfilter)
- [relayedMessages](L1_xDaiAMB.md#relayedmessages)
- [removeAllListeners](L1_xDaiAMB.md#removealllisteners)
- [requireToPassMessage](L1_xDaiAMB.md#requiretopassmessage)
- [requiredBlockConfirmations](L1_xDaiAMB.md#requiredblockconfirmations)
- [requiredSignatures](L1_xDaiAMB.md#requiredsignatures)
- [setChainIds](L1_xDaiAMB.md#setchainids)
- [setGasPrice](L1_xDaiAMB.md#setgasprice)
- [setGasTokenParameters](L1_xDaiAMB.md#setgastokenparameters)
- [setGasTokenReceiver](L1_xDaiAMB.md#setgastokenreceiver)
- [setGasTokenTargetMintValue](L1_xDaiAMB.md#setgastokentargetmintvalue)
- [setMaxGasPerTx](L1_xDaiAMB.md#setmaxgaspertx)
- [setRequiredBlockConfirmations](L1_xDaiAMB.md#setrequiredblockconfirmations)
- [sourceChainId](L1_xDaiAMB.md#sourcechainid)
- [transactionHash](L1_xDaiAMB.md#transactionhash)
- [transferOwnership](L1_xDaiAMB.md#transferownership)
- [validatorContract](L1_xDaiAMB.md#validatorcontract)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_sendMessage` | (`_contract`: `PromiseOrValue`\<`string`\>, `_data`: `PromiseOrValue`\<`BytesLike`\>, `_gas`: `PromiseOrValue`\<`BigNumberish`\>, `_dataType`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `decimalShift` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `deployedAtBlock` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `destinationChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `executeSignatures` | (`_data`: `PromiseOrValue`\<`BytesLike`\>, `_signatures`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `failedMessageDataHash` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `failedMessageReceiver` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `failedMessageSender` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `gasPrice` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `gasToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `gasTokenReceiver` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `gasTokenTargetMintValue` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getBridgeInterfacesVersion` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `BigNumber`, `BigNumber`] & \{ `major`: `BigNumber` ; `minor`: `BigNumber` ; `patch`: `BigNumber`  }\> |
| `getBridgeMode` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `getMinimumGasUsage` | (`_data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `initialize` | (`_sourceChainId`: `PromiseOrValue`\<`BigNumberish`\>, `_destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `_validatorContract`: `PromiseOrValue`\<`string`\>, `_maxGasPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `_gasPrice`: `PromiseOrValue`\<`BigNumberish`\>, `_requiredBlockConfirmations`: `PromiseOrValue`\<`BigNumberish`\>, `_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `isInitialized` | (`overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `maxGasPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `messageCallStatus` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `messageId` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `messageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `messageSourceChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `relayedMessages` | (`_txHash`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `requireToPassMessage` | (`_contract`: `PromiseOrValue`\<`string`\>, `_data`: `PromiseOrValue`\<`BytesLike`\>, `_gas`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `requiredBlockConfirmations` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `requiredSignatures` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `setChainIds` | (`_sourceChainId`: `PromiseOrValue`\<`BigNumberish`\>, `_destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setGasPrice` | (`_gasPrice`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setGasTokenParameters` | (`_targetMintValue`: `PromiseOrValue`\<`BigNumberish`\>, `_receiver`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setGasTokenReceiver` | (`_receiver`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setGasTokenTargetMintValue` | (`_targetMintValue`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setMaxGasPerTx` | (`_maxGasPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setRequiredBlockConfirmations` | (`_blockConfirmations`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `sourceChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
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
| `decimalShift` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `deployedAtBlock` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `destinationChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `executeSignatures` | (`_data`: `PromiseOrValue`\<`BytesLike`\>, `_signatures`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `failedMessageDataHash` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `failedMessageReceiver` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `failedMessageSender` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `gasPrice` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `gasToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `gasTokenReceiver` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `gasTokenTargetMintValue` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getBridgeInterfacesVersion` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getBridgeMode` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getMinimumGasUsage` | (`_data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `initialize` | (`_sourceChainId`: `PromiseOrValue`\<`BigNumberish`\>, `_destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `_validatorContract`: `PromiseOrValue`\<`string`\>, `_maxGasPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `_gasPrice`: `PromiseOrValue`\<`BigNumberish`\>, `_requiredBlockConfirmations`: `PromiseOrValue`\<`BigNumberish`\>, `_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `isInitialized` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `maxGasPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `messageCallStatus` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `messageId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `messageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `messageSourceChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `relayedMessages` | (`_txHash`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `requireToPassMessage` | (`_contract`: `PromiseOrValue`\<`string`\>, `_data`: `PromiseOrValue`\<`BytesLike`\>, `_gas`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `requiredBlockConfirmations` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `requiredSignatures` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `setChainIds` | (`_sourceChainId`: `PromiseOrValue`\<`BigNumberish`\>, `_destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setGasPrice` | (`_gasPrice`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setGasTokenParameters` | (`_targetMintValue`: `PromiseOrValue`\<`BigNumberish`\>, `_receiver`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setGasTokenReceiver` | (`_receiver`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setGasTokenTargetMintValue` | (`_targetMintValue`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setMaxGasPerTx` | (`_maxGasPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setRequiredBlockConfirmations` | (`_blockConfirmations`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `sourceChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
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
| `GasPriceChanged` | (`gasPrice?`: ``null``) => `GasPriceChangedEventFilter` |
| `GasPriceChanged(uint256)` | (`gasPrice?`: ``null``) => `GasPriceChangedEventFilter` |
| `OwnershipTransferred` | (`previousOwner?`: ``null``, `newOwner?`: ``null``) => `OwnershipTransferredEventFilter` |
| `OwnershipTransferred(address,address)` | (`previousOwner?`: ``null``, `newOwner?`: ``null``) => `OwnershipTransferredEventFilter` |
| `RelayedMessage` | (`sender?`: ``null`` \| `PromiseOrValue`\<`string`\>, `executor?`: ``null`` \| `PromiseOrValue`\<`string`\>, `messageId?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `status?`: ``null``) => `RelayedMessageEventFilter` |
| `RelayedMessage(address,address,bytes32,bool)` | (`sender?`: ``null`` \| `PromiseOrValue`\<`string`\>, `executor?`: ``null`` \| `PromiseOrValue`\<`string`\>, `messageId?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `status?`: ``null``) => `RelayedMessageEventFilter` |
| `RequiredBlockConfirmationChanged` | (`requiredBlockConfirmations?`: ``null``) => `RequiredBlockConfirmationChangedEventFilter` |
| `RequiredBlockConfirmationChanged(uint256)` | (`requiredBlockConfirmations?`: ``null``) => `RequiredBlockConfirmationChangedEventFilter` |
| `UserRequestForAffirmation` | (`messageId?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `encodedData?`: ``null``) => `UserRequestForAffirmationEventFilter` |
| `UserRequestForAffirmation(bytes32,bytes)` | (`messageId?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `encodedData?`: ``null``) => `UserRequestForAffirmationEventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_sendMessage` | (`_contract`: `PromiseOrValue`\<`string`\>, `_data`: `PromiseOrValue`\<`BytesLike`\>, `_gas`: `PromiseOrValue`\<`BigNumberish`\>, `_dataType`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `decimalShift` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `deployedAtBlock` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `destinationChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `executeSignatures` | (`_data`: `PromiseOrValue`\<`BytesLike`\>, `_signatures`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `failedMessageDataHash` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `failedMessageReceiver` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `failedMessageSender` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `gasPrice` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `gasToken` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `gasTokenReceiver` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `gasTokenTargetMintValue` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getBridgeInterfacesVersion` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `BigNumber`, `BigNumber`] & \{ `major`: `BigNumber` ; `minor`: `BigNumber` ; `patch`: `BigNumber`  }\> |
| `getBridgeMode` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`] & \{ `_data`: `string`  }\> |
| `getMinimumGasUsage` | (`_data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`] & \{ `gas`: `BigNumber`  }\> |
| `initialize` | (`_sourceChainId`: `PromiseOrValue`\<`BigNumberish`\>, `_destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `_validatorContract`: `PromiseOrValue`\<`string`\>, `_maxGasPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `_gasPrice`: `PromiseOrValue`\<`BigNumberish`\>, `_requiredBlockConfirmations`: `PromiseOrValue`\<`BigNumberish`\>, `_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `isInitialized` | (`overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `maxGasPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `messageCallStatus` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `messageId` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`] & \{ `id`: `string`  }\> |
| `messageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`] & \{ `sender`: `string`  }\> |
| `messageSourceChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`] & \{ `id`: `BigNumber`  }\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `relayedMessages` | (`_txHash`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `requireToPassMessage` | (`_contract`: `PromiseOrValue`\<`string`\>, `_data`: `PromiseOrValue`\<`BytesLike`\>, `_gas`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `requiredBlockConfirmations` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `requiredSignatures` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `setChainIds` | (`_sourceChainId`: `PromiseOrValue`\<`BigNumberish`\>, `_destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setGasPrice` | (`_gasPrice`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setGasTokenParameters` | (`_targetMintValue`: `PromiseOrValue`\<`BigNumberish`\>, `_receiver`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setGasTokenReceiver` | (`_receiver`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setGasTokenTargetMintValue` | (`_targetMintValue`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setMaxGasPerTx` | (`_maxGasPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setRequiredBlockConfirmations` | (`_blockConfirmations`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `sourceChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `transactionHash` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `validatorContract` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `L1_xDaiAMBInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`L1_xDaiAMB`](L1_xDaiAMB.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`L1_xDaiAMB`](L1_xDaiAMB.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`L1_xDaiAMB`](L1_xDaiAMB.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_sendMessage` | (`_contract`: `PromiseOrValue`\<`string`\>, `_data`: `PromiseOrValue`\<`BytesLike`\>, `_gas`: `PromiseOrValue`\<`BigNumberish`\>, `_dataType`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `decimalShift` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `deployedAtBlock` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `destinationChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `executeSignatures` | (`_data`: `PromiseOrValue`\<`BytesLike`\>, `_signatures`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `failedMessageDataHash` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `failedMessageReceiver` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `failedMessageSender` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `gasPrice` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `gasToken` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `gasTokenReceiver` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `gasTokenTargetMintValue` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getBridgeInterfacesVersion` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getBridgeMode` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getMinimumGasUsage` | (`_data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `initialize` | (`_sourceChainId`: `PromiseOrValue`\<`BigNumberish`\>, `_destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `_validatorContract`: `PromiseOrValue`\<`string`\>, `_maxGasPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `_gasPrice`: `PromiseOrValue`\<`BigNumberish`\>, `_requiredBlockConfirmations`: `PromiseOrValue`\<`BigNumberish`\>, `_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `isInitialized` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `maxGasPerTx` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `messageCallStatus` | (`_messageId`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `messageId` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `messageSender` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `messageSourceChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `relayedMessages` | (`_txHash`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `requireToPassMessage` | (`_contract`: `PromiseOrValue`\<`string`\>, `_data`: `PromiseOrValue`\<`BytesLike`\>, `_gas`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `requiredBlockConfirmations` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `requiredSignatures` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `setChainIds` | (`_sourceChainId`: `PromiseOrValue`\<`BigNumberish`\>, `_destinationChainId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setGasPrice` | (`_gasPrice`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setGasTokenParameters` | (`_targetMintValue`: `PromiseOrValue`\<`BigNumberish`\>, `_receiver`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setGasTokenReceiver` | (`_receiver`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setGasTokenTargetMintValue` | (`_targetMintValue`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setMaxGasPerTx` | (`_maxGasPerTx`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setRequiredBlockConfirmations` | (`_blockConfirmations`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `sourceChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `transactionHash` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `transferOwnership` | (`newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `validatorContract` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`L1_xDaiAMB`](L1_xDaiAMB.md)\>

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

▸ **deployed**(): `Promise`\<[`L1_xDaiAMB`](L1_xDaiAMB.md)\>

#### Returns

`Promise`\<[`L1_xDaiAMB`](L1_xDaiAMB.md)\>

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

### <a id="executesignatures" name="executesignatures"></a> executeSignatures

▸ **executeSignatures**(`_data`, `_signatures`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_data` | `PromiseOrValue`\<`BytesLike`\> |
| `_signatures` | `PromiseOrValue`\<`BytesLike`\> |
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

### <a id="gastoken" name="gastoken"></a> gasToken

▸ **gasToken**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="gastokenreceiver" name="gastokenreceiver"></a> gasTokenReceiver

▸ **gasTokenReceiver**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="gastokentargetmintvalue" name="gastokentargetmintvalue"></a> gasTokenTargetMintValue

▸ **gasTokenTargetMintValue**(`overrides?`): `Promise`\<`BigNumber`\>

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

### <a id="relayedmessages" name="relayedmessages"></a> relayedMessages

▸ **relayedMessages**(`_txHash`, `overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_txHash` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

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

### <a id="setgastokenparameters" name="setgastokenparameters"></a> setGasTokenParameters

▸ **setGasTokenParameters**(`_targetMintValue`, `_receiver`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_targetMintValue` | `PromiseOrValue`\<`BigNumberish`\> |
| `_receiver` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setgastokenreceiver" name="setgastokenreceiver"></a> setGasTokenReceiver

▸ **setGasTokenReceiver**(`_receiver`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_receiver` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setgastokentargetmintvalue" name="setgastokentargetmintvalue"></a> setGasTokenTargetMintValue

▸ **setGasTokenTargetMintValue**(`_targetMintValue`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_targetMintValue` | `PromiseOrValue`\<`BigNumberish`\> |
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

### <a id="sourcechainid" name="sourcechainid"></a> sourceChainId

▸ **sourceChainId**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

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
