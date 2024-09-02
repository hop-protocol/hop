# @hop-protocol/v2-sdk

## Table of contents

### Enumerations

- [TransferState](enums/TransferState.md)

### Classes

- [ConfigError](classes/ConfigError.md)
- [CustomError](classes/CustomError.md)
- [Hop](classes/Hop.md)
- [HubConnector](classes/HubConnector.md)
- [InputError](classes/InputError.md)
- [InsufficientApprovalError](classes/InsufficientApprovalError.md)
- [InsufficientBalanceError](classes/InsufficientBalanceError.md)
- [Messenger](classes/Messenger.md)
- [PriceFeed](classes/PriceFeed.md)
- [RailsGateway](classes/RailsGateway.md)

### Interfaces

- [BundleCommitted](interfaces/BundleCommitted.md)
- [BundleForwarded](interfaces/BundleForwarded.md)
- [BundleReceived](interfaces/BundleReceived.md)
- [BundleSet](interfaces/BundleSet.md)
- [FeesSentToHub](interfaces/FeesSentToHub.md)
- [HopStruct](interfaces/HopStruct.md)
- [MessageBundled](interfaces/MessageBundled.md)
- [MessageExecuted](interfaces/MessageExecuted.md)
- [MessageSent](interfaces/MessageSent.md)
- [TransferBonded](interfaces/TransferBonded.md)
- [TransferSent](interfaces/TransferSent.md)

### Type Aliases

- [AllEventTypes](modules.md#alleventtypes)
- [ApproveBondInput](modules.md#approvebondinput)
- [ApproveSendInput](modules.md#approvesendinput)
- [ApproveSendTokensInput](modules.md#approvesendtokensinput)
- [BondInput](modules.md#bondinput)
- [BundleProof](modules.md#bundleproof)
- [CalcAmountOutMinInput](modules.md#calcamountoutmininput)
- [ConfirmClaimInput](modules.md#confirmclaiminput)
- [ConnectTargetsInput](modules.md#connecttargetsinput)
- [EthersEventWithDecodedTypes](modules.md#etherseventwithdecodedtypes)
- [EthersEventWithDecodedTypesAndContext](modules.md#etherseventwithdecodedtypesandcontext)
- [EventContext](modules.md#eventcontext)
- [ExecuteInput](modules.md#executeinput)
- [ExitBundleInput](modules.md#exitbundleinput)
- [GetBundleExitPopulatedTxInput](modules.md#getbundleexitpopulatedtxinput)
- [GetBundleProofFromMessageIdInput](modules.md#getbundleprooffrommessageidinput)
- [GetBundleProofFromTransactionHashInput](modules.md#getbundleprooffromtransactionhashinput)
- [GetCheckpointInput](modules.md#getcheckpointinput)
- [GetEstimatedTxCostForForwardMessageInput](modules.md#getestimatedtxcostforforwardmessageinput)
- [GetEventContextInput](modules.md#geteventcontextinput)
- [GetEventsInput](modules.md#geteventsinput)
- [GetFeeInput](modules.md#getfeeinput)
- [GetGeneralEventsInput](modules.md#getgeneraleventsinput)
- [GetHasSufficientBalanceInput](modules.md#gethassufficientbalanceinput)
- [GetIsBundleSetInput](modules.md#getisbundlesetinput)
- [GetIsClaimIdValidInput](modules.md#getisclaimidvalidinput)
- [GetIsL2TxHashExitedInput](modules.md#getisl2txhashexitedinput)
- [GetIsMessageIdRelayedInput](modules.md#getismessageidrelayedinput)
- [GetIsPathIdLiveInput](modules.md#getispathidliveinput)
- [GetIsTransferBondedInput](modules.md#getistransferbondedinput)
- [GetIsTransferClaimedInput](modules.md#getistransferclaimedinput)
- [GetLatestClaimInput](modules.md#getlatestclaiminput)
- [GetMaxBundleMessageCountInput](modules.md#getmaxbundlemessagecountinput)
- [GetMerkleProofForMessageIdInput](modules.md#getmerkleproofformessageidinput)
- [GetMessageBundleIdFromMessageIdInput](modules.md#getmessagebundleidfrommessageidinput)
- [GetMessageBundleIdFromTransactionHashInput](modules.md#getmessagebundleidfromtransactionhashinput)
- [GetMessageBundledEventFromMessageIdInput](modules.md#getmessagebundledeventfrommessageidinput)
- [GetMessageBundledEventFromTransactionHashInput](modules.md#getmessagebundledeventfromtransactionhashinput)
- [GetMessageBundledEventsForBundleIdInput](modules.md#getmessagebundledeventsforbundleidinput)
- [GetMessageCalldataInput](modules.md#getmessagecalldatainput)
- [GetMessageExecutedEventFromMessageIdInput](modules.md#getmessageexecutedeventfrommessageidinput)
- [GetMessageFeeInput](modules.md#getmessagefeeinput)
- [GetMessageIdFromTransactionHashInput](modules.md#getmessageidfromtransactionhashinput)
- [GetMessageIdsForBundleIdInput](modules.md#getmessageidsforbundleidinput)
- [GetMessageSentEventFromMessageIdInput](modules.md#getmessagesenteventfrommessageidinput)
- [GetMessageSentEventFromTransactionHashInput](modules.md#getmessagesenteventfromtransactionhashinput)
- [GetMessageSentEventFromTransactionReceiptInput](modules.md#getmessagesenteventfromtransactionreceiptinput)
- [GetMessageTreeIndexFromMessageIdInput](modules.md#getmessagetreeindexfrommessageidinput)
- [GetMessageTreeIndexFromTransactionHashInput](modules.md#getmessagetreeindexfromtransactionhashinput)
- [GetNeedsApprovalForBondInput](modules.md#getneedsapprovalforbondinput)
- [GetNeedsApprovalForSendInput](modules.md#getneedsapprovalforsendinput)
- [GetNeedsApprovalForSendTokensInput](modules.md#getneedsapprovalforsendtokensinput)
- [GetNextHopsHashInput](modules.md#getnexthopshashinput)
- [GetPathIdInput](modules.md#getpathidinput)
- [GetPathInfoInput](modules.md#getpathinfoinput)
- [GetRelayFeeInput](modules.md#getrelayfeeinput)
- [GetRelayMessageDataFromTransactionHashInput](modules.md#getrelaymessagedatafromtransactionhashinput)
- [GetRelayMessagePopulatedTxInput](modules.md#getrelaymessagepopulatedtxinput)
- [GetRelayRewardInput](modules.md#getrelayrewardinput)
- [GetRouteDataInput](modules.md#getroutedatainput)
- [GetSendFeeInput](modules.md#getsendfeeinput)
- [GetSendMessagePopulatedTxInput](modules.md#getsendmessagepopulatedtxinput)
- [GetSpokeExitTimeInput](modules.md#getspokeexittimeinput)
- [GetTokenContractInput](modules.md#gettokencontractinput)
- [GetTokenInfoInput](modules.md#gettokeninfoinput)
- [GetTransferBondedEventFromCheckpointInput](modules.md#gettransferbondedeventfromcheckpointinput)
- [GetTransferBondedEventFromTransactionHashInput](modules.md#gettransferbondedeventfromtransactionhashinput)
- [GetTransferBondedEventFromTransactionReceiptInput](modules.md#gettransferbondedeventfromtransactionreceiptinput)
- [GetTransferBondedEventFromTransferIdInput](modules.md#gettransferbondedeventfromtransferidinput)
- [GetTransferIdInput](modules.md#gettransferidinput)
- [GetTransferSentEventFilterInput](modules.md#gettransfersenteventfilterinput)
- [GetTransferSentEventFromCheckpointInput](modules.md#gettransfersenteventfromcheckpointinput)
- [GetTransferSentEventFromTransactionHashInput](modules.md#gettransfersenteventfromtransactionhashinput)
- [GetTransferSentEventFromTransactionReceiptInput](modules.md#gettransfersenteventfromtransactionreceiptinput)
- [GetTransferSentEventFromTransferIdInput](modules.md#gettransfersenteventfromtransferidinput)
- [GetTransferStatusInput](modules.md#gettransferstatusinput)
- [HasAuctionStartedInput](modules.md#hasauctionstartedinput)
- [HopConstructorInput](modules.md#hopconstructorinput)
- [HopStructInput](modules.md#hopstructinput)
- [HubConnectorConfig](modules.md#hubconnectorconfig)
- [MessengerConfig](modules.md#messengerconfig)
- [Path](modules.md#path)
- [PostClaimInput](modules.md#postclaiminput)
- [RailsGatewayConstructorInput](modules.md#railsgatewayconstructorinput)
- [RelayMessageData](modules.md#relaymessagedata)
- [RemoveClaimInput](modules.md#removeclaiminput)
- [RouteData](modules.md#routedata)
- [SendInput](modules.md#sendinput)
- [SendTokensInput](modules.md#sendtokensinput)
- [ShouldAttemptForwardMessageInput](modules.md#shouldattemptforwardmessageinput)
- [StakeHopInput](modules.md#stakehopinput)
- [Token](modules.md#token)
- [TransactionReceiptWithEvents](modules.md#transactionreceiptwithevents)
- [TransferBondedEventInput](modules.md#transferbondedeventinput)
- [TransferSentEventInput](modules.md#transfersenteventinput)
- [TransferStatus](modules.md#transferstatus)
- [UnstakeHopInput](modules.md#unstakehopinput)
- [WillSendTokensFailInput](modules.md#willsendtokensfailinput)
- [WithdrawAllInput](modules.md#withdrawallinput)
- [WithdrawBalanceInput](modules.md#withdrawbalanceinput)
- [WithdrawHopInput](modules.md#withdrawhopinput)
- [WithdrawInput](modules.md#withdrawinput)

## Type Aliases

### <a id="alleventtypes" name="alleventtypes"></a> AllEventTypes

Ƭ **AllEventTypes**: `TransferSent` \| `TransferBonded` \| `FeesSentToHub` \| `BundleCommitted` \| `BundleForwarded` \| `BundleReceived` \| `BundleSet` \| `MessageBundled` \| `MessageExecuted` \| `MessageSent`

___

### <a id="approvebondinput" name="approvebondinput"></a> ApproveBondInput

Ƭ **ApproveBondInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |
| `chainId` | `BigNumberish` |
| `pathId` | `string` |

___

### <a id="approvesendinput" name="approvesendinput"></a> ApproveSendInput

Ƭ **ApproveSendInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |
| `chainId` | `BigNumberish` |
| `pathId` | `string` |

___

### <a id="approvesendtokensinput" name="approvesendtokensinput"></a> ApproveSendTokensInput

Ƭ **ApproveSendTokensInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |
| `fromChainId` | `BigNumberish` |
| `fromToken` | `string` |
| `toChainId` | `BigNumberish` |
| `toToken` | `string` |

___

### <a id="bondinput" name="bondinput"></a> BondInput

Ƭ **BondInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `nextHops` | [`HopStructInput`](modules.md#hopstructinput)[] |
| `pathId` | `string` |
| `transferId` | `string` |

___

### <a id="bundleproof" name="bundleproof"></a> BundleProof

Ƭ **BundleProof**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bundleId` | `string` |
| `siblings` | `string`[] |
| `totalLeaves` | `number` |
| `treeIndex` | `number` |

___

### <a id="calcamountoutmininput" name="calcamountoutmininput"></a> CalcAmountOutMinInput

Ƭ **CalcAmountOutMinInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amountOut` | `BigNumberish` |
| `slippageTolerance` | `number` |

___

### <a id="confirmclaiminput" name="confirmclaiminput"></a> ConfirmClaimInput

Ƭ **ConfirmClaimInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `pathId` | `string` |
| `transferId` | `string` |

___

### <a id="connecttargetsinput" name="connecttargetsinput"></a> ConnectTargetsInput

Ƭ **ConnectTargetsInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `hubChainId` | `BigNumberish` |
| `spokeChainId` | `BigNumberish` |
| `target1` | `string` |
| `target2` | `string` |

___

### <a id="etherseventwithdecodedtypes" name="etherseventwithdecodedtypes"></a> EthersEventWithDecodedTypes

Ƭ **EthersEventWithDecodedTypes**\<`T`\>: `EthersEvent` & \{ `decoded`: `T`  }

#### Type parameters

| Name |
| :------ |
| `T` |

___

### <a id="etherseventwithdecodedtypesandcontext" name="etherseventwithdecodedtypesandcontext"></a> EthersEventWithDecodedTypesAndContext

Ƭ **EthersEventWithDecodedTypesAndContext**\<`T`\>: `EthersEvent` & \{ `context`: [`EventContext`](modules.md#eventcontext) ; `decoded`: `T`  }

#### Type parameters

| Name |
| :------ |
| `T` |

___

### <a id="eventcontext" name="eventcontext"></a> EventContext

Ƭ **EventContext**: `BaseEventContext` & `ReceiptEventContext`

___

### <a id="executeinput" name="executeinput"></a> ExecuteInput

Ƭ **ExecuteInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fromAddress` | `string` |
| `fromChainId` | `BigNumberish` |
| `messageId` | `string` |
| `toAddress` | `string` |
| `toCalldata` | `string` |
| `toChainId` | `BigNumberish` |

___

### <a id="exitbundleinput" name="exitbundleinput"></a> ExitBundleInput

Ƭ **ExitBundleInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bundleCommittedEvent?` | `EthersEventWithDecodedTypesAndContext`\<`BundleCommitted`\> |
| `bundleCommittedTransactionHash?` | `string` |
| `fromChainId` | `BigNumberish` |

___

### <a id="getbundleexitpopulatedtxinput" name="getbundleexitpopulatedtxinput"></a> GetBundleExitPopulatedTxInput

Ƭ **GetBundleExitPopulatedTxInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bundleCommittedEvent?` | `EthersEventWithDecodedTypesAndContext`\<`BundleCommitted`\> |
| `bundleCommittedTransactionHash?` | `string` |
| `fromChainId` | `BigNumberish` |

___

### <a id="getbundleprooffrommessageidinput" name="getbundleprooffrommessageidinput"></a> GetBundleProofFromMessageIdInput

Ƭ **GetBundleProofFromMessageIdInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `messageId` | `string` |

___

### <a id="getbundleprooffromtransactionhashinput" name="getbundleprooffromtransactionhashinput"></a> GetBundleProofFromTransactionHashInput

Ƭ **GetBundleProofFromTransactionHashInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `transactionHash` | `string` |

___

### <a id="getcheckpointinput" name="getcheckpointinput"></a> GetCheckpointInput

Ƭ **GetCheckpointInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `previousCheckpoint` | `string` |
| `totalSent` | `BigNumber` |
| `transferId` | `string` |

___

### <a id="getestimatedtxcostforforwardmessageinput" name="getestimatedtxcostforforwardmessageinput"></a> GetEstimatedTxCostForForwardMessageInput

Ƭ **GetEstimatedTxCostForForwardMessageInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

___

### <a id="geteventcontextinput" name="geteventcontextinput"></a> GetEventContextInput

Ƭ **GetEventContextInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `event` | `EthersEvent` |

___

### <a id="geteventsinput" name="geteventsinput"></a> GetEventsInput

Ƭ **GetEventsInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `fromBlock` | `number` |
| `toBlock?` | `number` |

___

### <a id="getfeeinput" name="getfeeinput"></a> GetFeeInput

Ƭ **GetFeeInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `pathId` | `string` |

___

### <a id="getgeneraleventsinput" name="getgeneraleventsinput"></a> GetGeneralEventsInput

Ƭ **GetGeneralEventsInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `eventName?` | `string` |
| `eventNames?` | `string`[] |
| `fetchTxData?` | `boolean` |
| `fromBlock` | `number` |
| `toBlock?` | `number` |

___

### <a id="gethassufficientbalanceinput" name="gethassufficientbalanceinput"></a> GetHasSufficientBalanceInput

Ƭ **GetHasSufficientBalanceInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `account?` | `string` |
| `amount` | `BigNumberish` |
| `chainId` | `BigNumberish` |
| `tokenAddress` | `string` |

___

### <a id="getisbundlesetinput" name="getisbundlesetinput"></a> GetIsBundleSetInput

Ƭ **GetIsBundleSetInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bundleId` | `string` |
| `fromChainId` | `BigNumberish` |
| `toChainId` | `BigNumberish` |

___

### <a id="getisclaimidvalidinput" name="getisclaimidvalidinput"></a> GetIsClaimIdValidInput

Ƭ **GetIsClaimIdValidInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `claimId` | `string` |
| `pathId` | `string` |

___

### <a id="getisl2txhashexitedinput" name="getisl2txhashexitedinput"></a> GetIsL2TxHashExitedInput

Ƭ **GetIsL2TxHashExitedInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fromChainId` | `BigNumberish` |
| `transactionHash` | `string` |

___

### <a id="getismessageidrelayedinput" name="getismessageidrelayedinput"></a> GetIsMessageIdRelayedInput

Ƭ **GetIsMessageIdRelayedInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fromChainId` | `BigNumberish` |
| `messageId` | `string` |
| `toChainId` | `BigNumberish` |

___

### <a id="getispathidliveinput" name="getispathidliveinput"></a> GetIsPathIdLiveInput

Ƭ **GetIsPathIdLiveInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `pathId` | `string` |

___

### <a id="getistransferbondedinput" name="getistransferbondedinput"></a> GetIsTransferBondedInput

Ƭ **GetIsTransferBondedInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `transferId` | `string` |

___

### <a id="getistransferclaimedinput" name="getistransferclaimedinput"></a> GetIsTransferClaimedInput

Ƭ **GetIsTransferClaimedInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `transferId` | `string` |

___

### <a id="getlatestclaiminput" name="getlatestclaiminput"></a> GetLatestClaimInput

Ƭ **GetLatestClaimInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `pathId` | `string` |

___

### <a id="getmaxbundlemessagecountinput" name="getmaxbundlemessagecountinput"></a> GetMaxBundleMessageCountInput

Ƭ **GetMaxBundleMessageCountInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fromChainId` | `BigNumberish` |
| `toChainId` | `BigNumberish` |

___

### <a id="getmerkleproofformessageidinput" name="getmerkleproofformessageidinput"></a> GetMerkleProofForMessageIdInput

Ƭ **GetMerkleProofForMessageIdInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `messageIds` | `string`[] |
| `targetMessageId` | `string` |

___

### <a id="getmessagebundleidfrommessageidinput" name="getmessagebundleidfrommessageidinput"></a> GetMessageBundleIdFromMessageIdInput

Ƭ **GetMessageBundleIdFromMessageIdInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `messageId` | `string` |

___

### <a id="getmessagebundleidfromtransactionhashinput" name="getmessagebundleidfromtransactionhashinput"></a> GetMessageBundleIdFromTransactionHashInput

Ƭ **GetMessageBundleIdFromTransactionHashInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `transactionHash` | `string` |

___

### <a id="getmessagebundledeventfrommessageidinput" name="getmessagebundledeventfrommessageidinput"></a> GetMessageBundledEventFromMessageIdInput

Ƭ **GetMessageBundledEventFromMessageIdInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `messageId` | `string` |

___

### <a id="getmessagebundledeventfromtransactionhashinput" name="getmessagebundledeventfromtransactionhashinput"></a> GetMessageBundledEventFromTransactionHashInput

Ƭ **GetMessageBundledEventFromTransactionHashInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `transactionHash` | `string` |

___

### <a id="getmessagebundledeventsforbundleidinput" name="getmessagebundledeventsforbundleidinput"></a> GetMessageBundledEventsForBundleIdInput

Ƭ **GetMessageBundledEventsForBundleIdInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bundleId` | `string` |
| `chainId` | `BigNumberish` |

___

### <a id="getmessagecalldatainput" name="getmessagecalldatainput"></a> GetMessageCalldataInput

Ƭ **GetMessageCalldataInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `messageId` | `string` |

___

### <a id="getmessageexecutedeventfrommessageidinput" name="getmessageexecutedeventfrommessageidinput"></a> GetMessageExecutedEventFromMessageIdInput

Ƭ **GetMessageExecutedEventFromMessageIdInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `messageId` | `string` |

___

### <a id="getmessagefeeinput" name="getmessagefeeinput"></a> GetMessageFeeInput

Ƭ **GetMessageFeeInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fromChainId` | `BigNumberish` |
| `toChainId` | `BigNumberish` |

___

### <a id="getmessageidfromtransactionhashinput" name="getmessageidfromtransactionhashinput"></a> GetMessageIdFromTransactionHashInput

Ƭ **GetMessageIdFromTransactionHashInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `transactionHash` | `string` |

___

### <a id="getmessageidsforbundleidinput" name="getmessageidsforbundleidinput"></a> GetMessageIdsForBundleIdInput

Ƭ **GetMessageIdsForBundleIdInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bundleId` | `string` |
| `chainId` | `BigNumberish` |

___

### <a id="getmessagesenteventfrommessageidinput" name="getmessagesenteventfrommessageidinput"></a> GetMessageSentEventFromMessageIdInput

Ƭ **GetMessageSentEventFromMessageIdInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `messageId` | `string` |

___

### <a id="getmessagesenteventfromtransactionhashinput" name="getmessagesenteventfromtransactionhashinput"></a> GetMessageSentEventFromTransactionHashInput

Ƭ **GetMessageSentEventFromTransactionHashInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `transactionHash` | `string` |

___

### <a id="getmessagesenteventfromtransactionreceiptinput" name="getmessagesenteventfromtransactionreceiptinput"></a> GetMessageSentEventFromTransactionReceiptInput

Ƭ **GetMessageSentEventFromTransactionReceiptInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `receipt` | `providers.TransactionReceipt` |

___

### <a id="getmessagetreeindexfrommessageidinput" name="getmessagetreeindexfrommessageidinput"></a> GetMessageTreeIndexFromMessageIdInput

Ƭ **GetMessageTreeIndexFromMessageIdInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `messageId` | `string` |

___

### <a id="getmessagetreeindexfromtransactionhashinput" name="getmessagetreeindexfromtransactionhashinput"></a> GetMessageTreeIndexFromTransactionHashInput

Ƭ **GetMessageTreeIndexFromTransactionHashInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `transactionHash` | `string` |

___

### <a id="getneedsapprovalforbondinput" name="getneedsapprovalforbondinput"></a> GetNeedsApprovalForBondInput

Ƭ **GetNeedsApprovalForBondInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `account?` | `string` |
| `amount` | `BigNumberish` |
| `chainId` | `BigNumberish` |
| `pathId` | `string` |

___

### <a id="getneedsapprovalforsendinput" name="getneedsapprovalforsendinput"></a> GetNeedsApprovalForSendInput

Ƭ **GetNeedsApprovalForSendInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `account?` | `string` |
| `amount` | `BigNumberish` |
| `chainId` | `BigNumberish` |
| `pathId` | `string` |

___

### <a id="getneedsapprovalforsendtokensinput" name="getneedsapprovalforsendtokensinput"></a> GetNeedsApprovalForSendTokensInput

Ƭ **GetNeedsApprovalForSendTokensInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `account?` | `string` |
| `amount` | `BigNumberish` |
| `fromChainId` | `BigNumberish` |
| `fromToken` | `string` |
| `toChainId` | `BigNumberish` |
| `toToken` | `string` |

___

### <a id="getnexthopshashinput" name="getnexthopshashinput"></a> GetNextHopsHashInput

Ƭ **GetNextHopsHashInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `nextHops` | `HopStruct`[] |

___

### <a id="getpathidinput" name="getpathidinput"></a> GetPathIdInput

Ƭ **GetPathIdInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId0` | `BigNumberish` |
| `chainId1` | `BigNumberish` |
| `token0` | `string` |
| `token1` | `string` |

___

### <a id="getpathinfoinput" name="getpathinfoinput"></a> GetPathInfoInput

Ƭ **GetPathInfoInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `pathId` | `string` |

___

### <a id="getrelayfeeinput" name="getrelayfeeinput"></a> GetRelayFeeInput

Ƭ **GetRelayFeeInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fromChainId` | `BigNumberish` |
| `toAddress` | `string` |
| `toCalldata` | `string` |
| `toChainId` | `BigNumberish` |

___

### <a id="getrelaymessagedatafromtransactionhashinput" name="getrelaymessagedatafromtransactionhashinput"></a> GetRelayMessageDataFromTransactionHashInput

Ƭ **GetRelayMessageDataFromTransactionHashInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `transactionHash` | `string` |

___

### <a id="getrelaymessagepopulatedtxinput" name="getrelaymessagepopulatedtxinput"></a> GetRelayMessagePopulatedTxInput

Ƭ **GetRelayMessagePopulatedTxInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bundleProof` | [`BundleProof`](modules.md#bundleproof) |
| `fromAddress` | `string` |
| `fromChainId` | `BigNumberish` |
| `toAddress` | `string` |
| `toCalldata` | `string` |
| `toChainId` | `BigNumberish` |

___

### <a id="getrelayrewardinput" name="getrelayrewardinput"></a> GetRelayRewardInput

Ƭ **GetRelayRewardInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bundleCommittedEvent` | `BundleCommitted` |
| `fromChainId` | `BigNumberish` |

___

### <a id="getroutedatainput" name="getroutedatainput"></a> GetRouteDataInput

Ƭ **GetRouteDataInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fromChainId` | `BigNumberish` |
| `toChainId` | `BigNumberish` |

___

### <a id="getsendfeeinput" name="getsendfeeinput"></a> GetSendFeeInput

Ƭ **GetSendFeeInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fromChainId` | `BigNumberish` |
| `fromToken` | `string` |
| `toChainId` | `BigNumberish` |
| `toToken` | `string` |

___

### <a id="getsendmessagepopulatedtxinput" name="getsendmessagepopulatedtxinput"></a> GetSendMessagePopulatedTxInput

Ƭ **GetSendMessagePopulatedTxInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fromChainId` | `BigNumberish` |
| `toAddress` | `string` |
| `toCalldata` | `string` |
| `toChainId` | `BigNumberish` |

___

### <a id="getspokeexittimeinput" name="getspokeexittimeinput"></a> GetSpokeExitTimeInput

Ƭ **GetSpokeExitTimeInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fromChainId` | `BigNumberish` |
| `toChainId` | `BigNumberish` |

___

### <a id="gettokencontractinput" name="gettokencontractinput"></a> GetTokenContractInput

Ƭ **GetTokenContractInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `chainId` | `BigNumberish` |

___

### <a id="gettokeninfoinput" name="gettokeninfoinput"></a> GetTokenInfoInput

Ƭ **GetTokenInfoInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `chainId` | `BigNumberish` |

___

### <a id="gettransferbondedeventfromcheckpointinput" name="gettransferbondedeventfromcheckpointinput"></a> GetTransferBondedEventFromCheckpointInput

Ƭ **GetTransferBondedEventFromCheckpointInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `checkpoint` | `string` |
| `fromChainId` | `BigNumberish` |

___

### <a id="gettransferbondedeventfromtransactionhashinput" name="gettransferbondedeventfromtransactionhashinput"></a> GetTransferBondedEventFromTransactionHashInput

Ƭ **GetTransferBondedEventFromTransactionHashInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fromChainId` | `BigNumberish` |
| `transactionHash` | `string` |

___

### <a id="gettransferbondedeventfromtransactionreceiptinput" name="gettransferbondedeventfromtransactionreceiptinput"></a> GetTransferBondedEventFromTransactionReceiptInput

Ƭ **GetTransferBondedEventFromTransactionReceiptInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fromChainId` | `BigNumberish` |
| `receipt` | `providers.TransactionReceipt` |

___

### <a id="gettransferbondedeventfromtransferidinput" name="gettransferbondedeventfromtransferidinput"></a> GetTransferBondedEventFromTransferIdInput

Ƭ **GetTransferBondedEventFromTransferIdInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fromChainId` | `BigNumberish` |
| `transferId` | `string` |

___

### <a id="gettransferidinput" name="gettransferidinput"></a> GetTransferIdInput

Ƭ **GetTransferIdInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `adjustedAmount` | `BigNumberish` |
| `attestedCheckpoint` | `string` |
| `chainId` | `BigNumberish` |
| `minAmountOut` | `BigNumberish` |
| `nonce` | `BigNumberish` |
| `pathId` | `string` |
| `to` | `string` |
| `totalSent` | `BigNumberish` |

___

### <a id="gettransfersenteventfilterinput" name="gettransfersenteventfilterinput"></a> GetTransferSentEventFilterInput

Ƭ **GetTransferSentEventFilterInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `indexes?` | \{ `pathId?`: `string` ; `transferId?`: `string`  } |
| `indexes.pathId?` | `string` |
| `indexes.transferId?` | `string` |

___

### <a id="gettransfersenteventfromcheckpointinput" name="gettransfersenteventfromcheckpointinput"></a> GetTransferSentEventFromCheckpointInput

Ƭ **GetTransferSentEventFromCheckpointInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `checkpoint` | `string` |
| `fromChainId` | `BigNumberish` |

___

### <a id="gettransfersenteventfromtransactionhashinput" name="gettransfersenteventfromtransactionhashinput"></a> GetTransferSentEventFromTransactionHashInput

Ƭ **GetTransferSentEventFromTransactionHashInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fromChainId` | `BigNumberish` |
| `transactionHash` | `string` |

___

### <a id="gettransfersenteventfromtransactionreceiptinput" name="gettransfersenteventfromtransactionreceiptinput"></a> GetTransferSentEventFromTransactionReceiptInput

Ƭ **GetTransferSentEventFromTransactionReceiptInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fromChainId` | `BigNumberish` |
| `receipt` | `providers.TransactionReceipt` |

___

### <a id="gettransfersenteventfromtransferidinput" name="gettransfersenteventfromtransferidinput"></a> GetTransferSentEventFromTransferIdInput

Ƭ **GetTransferSentEventFromTransferIdInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fromChainId` | `BigNumberish` |
| `transferId` | `string` |

___

### <a id="gettransferstatusinput" name="gettransferstatusinput"></a> GetTransferStatusInput

Ƭ **GetTransferStatusInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fromChainId` | `BigNumberish` |
| `toChainId` | `BigNumberish` |
| `transferId` | `string` |

___

### <a id="hasauctionstartedinput" name="hasauctionstartedinput"></a> HasAuctionStartedInput

Ƭ **HasAuctionStartedInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bundleCommittedEvent` | `BundleCommitted` |
| `fromChainId` | `BigNumberish` |

___

### <a id="hopconstructorinput" name="hopconstructorinput"></a> HopConstructorInput

Ƭ **HopConstructorInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `batchBlocks?` | `number` |
| `contractAddresses?` | `Addresses` |
| `network` | `string` |
| `signer?` | `Signer` |

___

### <a id="hopstructinput" name="hopstructinput"></a> HopStructInput

Ƭ **HopStructInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `attestedClaimId` | `string` |
| `maxTotalSent` | `BigNumberish` |
| `pathId` | `string` |

___

### <a id="hubconnectorconfig" name="hubconnectorconfig"></a> HubConnectorConfig

Ƭ **HubConnectorConfig**: `BaseConfig`

___

### <a id="messengerconfig" name="messengerconfig"></a> MessengerConfig

Ƭ **MessengerConfig**: `BaseConfig`

___

### <a id="path" name="path"></a> Path

Ƭ **Path**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `string` |
| `counterpartChainId` | `string` |
| `counterpartToken` | `string` |
| `pathId` | `string` |
| `token` | `string` |

___

### <a id="postclaiminput" name="postclaiminput"></a> PostClaimInput

Ƭ **PostClaimInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |
| `attestedClaimId` | `string` |
| `attestedTotalClaims` | `BigNumberish` |
| `chainId` | `BigNumberish` |
| `nextHopsHash` | `string` |
| `pathId` | `string` |
| `to` | `string` |
| `totalSent` | `BigNumberish` |
| `transferId` | `string` |

___

### <a id="railsgatewayconstructorinput" name="railsgatewayconstructorinput"></a> RailsGatewayConstructorInput

Ƭ **RailsGatewayConstructorInput**: `BaseConfig`

___

### <a id="relaymessagedata" name="relaymessagedata"></a> RelayMessageData

Ƭ **RelayMessageData**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bundleProof` | [`BundleProof`](modules.md#bundleproof) |
| `fromAddress` | `string` |
| `fromChainId` | `BigNumberish` |
| `toAddress` | `string` |
| `toCalldata` | `string` |
| `toChainId` | `BigNumberish` |

___

### <a id="removeclaiminput" name="removeclaiminput"></a> RemoveClaimInput

Ƭ **RemoveClaimInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `pathId` | `string` |
| `transferId` | `string` |

___

### <a id="routedata" name="routedata"></a> RouteData

Ƭ **RouteData**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `maxBundleMessages` | `number` |
| `messageFee` | `BigNumber` |

___

### <a id="sendinput" name="sendinput"></a> SendInput

Ƭ **SendInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |
| `attestedClaimId` | `string` |
| `chainId` | `BigNumberish` |
| `maxTotalSent` | `BigNumberish` |
| `nextHops` | [`HopStructInput`](modules.md#hopstructinput)[] |
| `pathId` | `string` |
| `to` | `string` |

___

### <a id="sendtokensinput" name="sendtokensinput"></a> SendTokensInput

Ƭ **SendTokensInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |
| `fromChainId` | `BigNumberish` |
| `fromToken` | `string` |
| `minAmountOut` | `BigNumberish` |
| `to?` | `string` |
| `toChainId` | `BigNumberish` |
| `toToken` | `string` |

___

### <a id="shouldattemptforwardmessageinput" name="shouldattemptforwardmessageinput"></a> ShouldAttemptForwardMessageInput

Ƭ **ShouldAttemptForwardMessageInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bundleCommittedEvent` | `BundleCommitted` |
| `fromChainId` | `BigNumberish` |

___

### <a id="stakehopinput" name="stakehopinput"></a> StakeHopInput

Ƭ **StakeHopInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |
| `chainId` | `BigNumberish` |
| `role` | `string` |
| `staker?` | `string` |

___

### <a id="token" name="token"></a> Token

Ƭ **Token**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `chainId` | `string` |
| `decimals` | `number` |
| `name` | `string` |
| `symbol` | `string` |

___

### <a id="transactionreceiptwithevents" name="transactionreceiptwithevents"></a> TransactionReceiptWithEvents

Ƭ **TransactionReceiptWithEvents**: `providers.TransactionReceipt` & \{ `events?`: `EthersEvent`[]  }

___

### <a id="transferbondedeventinput" name="transferbondedeventinput"></a> TransferBondedEventInput

Ƭ **TransferBondedEventInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `fromBlock` | `number` |
| `toBlock` | `number` |

___

### <a id="transfersenteventinput" name="transfersenteventinput"></a> TransferSentEventInput

Ƭ **TransferSentEventInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `fetchTxData?` | `boolean` |
| `fromBlock` | `number` |
| `toBlock` | `number` |

___

### <a id="transferstatus" name="transferstatus"></a> TransferStatus

Ƭ **TransferStatus**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `state` | [`TransferState`](enums/TransferState.md) |
| `transferBondedEvent` | `TransferBonded` |
| `transferId` | `string` |
| `transferSentEvent` | `TransferSent` |

___

### <a id="unstakehopinput" name="unstakehopinput"></a> UnstakeHopInput

Ƭ **UnstakeHopInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |
| `chainId` | `BigNumberish` |
| `role` | `string` |

___

### <a id="willsendtokensfailinput" name="willsendtokensfailinput"></a> WillSendTokensFailInput

Ƭ **WillSendTokensFailInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |
| `from` | `string` |
| `fromChainId` | `BigNumberish` |
| `fromToken` | `string` |
| `minAmountOut` | `BigNumberish` |
| `to` | `string` |
| `toChainId` | `BigNumberish` |
| `toToken` | `string` |

___

### <a id="withdrawallinput" name="withdrawallinput"></a> WithdrawAllInput

Ƭ **WithdrawAllInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `pathId` | `string` |
| `timeWindow` | `number` |

___

### <a id="withdrawbalanceinput" name="withdrawbalanceinput"></a> WithdrawBalanceInput

Ƭ **WithdrawBalanceInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `path?` | [`Path`](modules.md#path) |
| `pathId?` | `string` |
| `recipient` | `string` |
| `timeWindow` | `number` |

___

### <a id="withdrawhopinput" name="withdrawhopinput"></a> WithdrawHopInput

Ƭ **WithdrawHopInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `role` | `string` |

___

### <a id="withdrawinput" name="withdrawinput"></a> WithdrawInput

Ƭ **WithdrawInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |
| `chainId` | `BigNumberish` |
| `pathId` | `string` |
| `timeWindow` | `number` |
