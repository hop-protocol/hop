# @hop-protocol/v2-sdk

## Table of contents

### Enumerations

- [EventName](enums/EventName.md)
- [MessengerEventName](enums/MessengerEventName.md)
- [RailsGatewayEventName](enums/RailsGatewayEventName.md)
- [TransferState](enums/TransferState.md)

### Classes

- [BonderPreferenceEventFetcher](classes/BonderPreferenceEventFetcher.md)
- [ClaimChainUpdatedEventFetcher](classes/ClaimChainUpdatedEventFetcher.md)
- [ClaimPostedEventFetcher](classes/ClaimPostedEventFetcher.md)
- [ConfigError](classes/ConfigError.md)
- [ContractFunctionRevertedError](classes/ContractFunctionRevertedError.md)
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

- [BonderPreference](interfaces/BonderPreference.md)
- [BundleCommitted](interfaces/BundleCommitted.md)
- [BundleForwarded](interfaces/BundleForwarded.md)
- [BundleReceived](interfaces/BundleReceived.md)
- [BundleSet](interfaces/BundleSet.md)
- [ClaimChainUpdated](interfaces/ClaimChainUpdated.md)
- [ClaimPosted](interfaces/ClaimPosted.md)
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
- [BatchUpdateClaimChainInput](modules.md#batchupdateclaimchaininput)
- [BondInput](modules.md#bondinput)
- [BonderPreferenceIndexes](modules.md#bonderpreferenceindexes)
- [BundleProof](modules.md#bundleproof)
- [CalcAmountOutMinInput](modules.md#calcamountoutmininput)
- [ClaimChainUpdatedIndexes](modules.md#claimchainupdatedindexes)
- [ClaimFeesFromPathInput](modules.md#claimfeesfrompathinput)
- [ClaimPostedIndexes](modules.md#claimpostedindexes)
- [ConfirmClaimInput](modules.md#confirmclaiminput)
- [ConnectTargetsInput](modules.md#connecttargetsinput)
- [DistributeClaimedFeesInput](modules.md#distributeclaimedfeesinput)
- [DistributeExcessFeesInput](modules.md#distributeexcessfeesinput)
- [EthersEventWithDecodedTypes](modules.md#etherseventwithdecodedtypes)
- [EthersEventWithDecodedTypesAndContext](modules.md#etherseventwithdecodedtypesandcontext)
- [EventContext](modules.md#eventcontext)
- [ExecuteInput](modules.md#executeinput)
- [ExitBundleInput](modules.md#exitbundleinput)
- [GetAmountOutInput](modules.md#getamountoutinput)
- [GetBatchUpdateFeeInput](modules.md#getbatchupdatefeeinput)
- [GetBucketIndexInput](modules.md#getbucketindexinput)
- [GetBundleExitPopulatedTxInput](modules.md#getbundleexitpopulatedtxinput)
- [GetBundleProofFromMessageIdInput](modules.md#getbundleprooffrommessageidinput)
- [GetBundleProofFromTransactionHashInput](modules.md#getbundleprooffromtransactionhashinput)
- [GetClaimFeesFeeInput](modules.md#getclaimfeesfeeinput)
- [GetEstimatedReceivedInput](modules.md#getestimatedreceivedinput)
- [GetEstimatedTxCostForForwardMessageInput](modules.md#getestimatedtxcostforforwardmessageinput)
- [GetEventContextInput](modules.md#geteventcontextinput)
- [GetEventFilterInput](modules.md#geteventfilterinput)
- [GetEventsInput](modules.md#geteventsinput)
- [GetFeePriceInput](modules.md#getfeepriceinput)
- [GetGeneralEventsInput](modules.md#getgeneraleventsinput)
- [GetHasSufficientBalanceInput](modules.md#gethassufficientbalanceinput)
- [GetHeadClaimIdInput](modules.md#getheadclaimidinput)
- [GetIsBundleSetInput](modules.md#getisbundlesetinput)
- [GetIsClaimIdValidInput](modules.md#getisclaimidvalidinput)
- [GetIsL2TxHashExitedInput](modules.md#getisl2txhashexitedinput)
- [GetIsMessageIdRelayedInput](modules.md#getismessageidrelayedinput)
- [GetIsPathIdLiveInput](modules.md#getispathidliveinput)
- [GetIsTransferBondedInput](modules.md#getistransferbondedinput)
- [GetIsTransferClaimedInput](modules.md#getistransferclaimedinput)
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
- [GetPathVaultInput](modules.md#getpathvaultinput)
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
- [GetTotalClaimsAtClaimIdInput](modules.md#gettotalclaimsatclaimidinput)
- [GetTotalClaimsInput](modules.md#gettotalclaimsinput)
- [GetTotalConfirmedInput](modules.md#gettotalconfirmedinput)
- [GetTotalSentInput](modules.md#gettotalsentinput)
- [GetTransferBondedEventFilterInput](modules.md#gettransferbondedeventfilterinput)
- [GetTransferBondedEventFromTransactionHashInput](modules.md#gettransferbondedeventfromtransactionhashinput)
- [GetTransferBondedEventFromTransactionReceiptInput](modules.md#gettransferbondedeventfromtransactionreceiptinput)
- [GetTransferBondedEventFromTransferIdInput](modules.md#gettransferbondedeventfromtransferidinput)
- [GetTransferDataHashInput](modules.md#gettransferdatahashinput)
- [GetTransferIdFromTransactionHashInput](modules.md#gettransferidfromtransactionhashinput)
- [GetTransferIdInput](modules.md#gettransferidinput)
- [GetTransferSentEventFilterInput](modules.md#gettransfersenteventfilterinput)
- [GetTransferSentEventFromTransactionHashInput](modules.md#gettransfersenteventfromtransactionhashinput)
- [GetTransferSentEventFromTransactionReceiptInput](modules.md#gettransfersenteventfromtransactionreceiptinput)
- [GetTransferSentEventFromTransferIdInput](modules.md#gettransfersenteventfromtransferidinput)
- [GetTransferSentEventsFromPathIdInput](modules.md#gettransfersenteventsfrompathidinput)
- [GetTransferStatusInput](modules.md#gettransferstatusinput)
- [HasAuctionStartedInput](modules.md#hasauctionstartedinput)
- [HopConstructorInput](modules.md#hopconstructorinput)
- [HopStructInput](modules.md#hopstructinput)
- [HubConnectorConfig](modules.md#hubconnectorconfig)
- [IsValidClaimInput](modules.md#isvalidclaiminput)
- [IsValidTransferInput](modules.md#isvalidtransferinput)
- [MessengerConfig](modules.md#messengerconfig)
- [Path](modules.md#path)
- [PostClaimInput](modules.md#postclaiminput)
- [RailsGatewayConstructorInput](modules.md#railsgatewayconstructorinput)
- [RailsGatewayGetMessageFeeInput](modules.md#railsgatewaygetmessagefeeinput)
- [RailsGatewayGetSendFeeInput](modules.md#railsgatewaygetsendfeeinput)
- [RelayMessageData](modules.md#relaymessagedata)
- [RemoveClaimInput](modules.md#removeclaiminput)
- [RouteData](modules.md#routedata)
- [SendInput](modules.md#sendinput)
- [SendTokensInput](modules.md#sendtokensinput)
- [SetFeePriceInput](modules.md#setfeepriceinput)
- [SetFeePricesInput](modules.md#setfeepricesinput)
- [ShouldAttemptForwardMessageInput](modules.md#shouldattemptforwardmessageinput)
- [SignalPreferenceInput](modules.md#signalpreferenceinput)
- [SignersOrProviders](modules.md#signersorproviders)
- [StakeHopInput](modules.md#stakehopinput)
- [Token](modules.md#token)
- [TransactionReceiptWithEvents](modules.md#transactionreceiptwithevents)
- [TransferBondedEventInput](modules.md#transferbondedeventinput)
- [TransferBondedIndexes](modules.md#transferbondedindexes)
- [TransferSentEventInput](modules.md#transfersenteventinput)
- [TransferSentIndexes](modules.md#transfersentindexes)
- [TransferStatus](modules.md#transferstatus)
- [TxOverrides](modules.md#txoverrides)
- [UnstakeHopInput](modules.md#unstakehopinput)
- [UpdateClaimChainInput](modules.md#updateclaimchaininput)
- [WillSendTokensFailInput](modules.md#willsendtokensfailinput)
- [WithdrawInput](modules.md#withdrawinput)
- [WithdrawableBalanceInput](modules.md#withdrawablebalanceinput)

### Variables

- [utils](modules.md#utils)

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
| `pathId` | `string` |

___

### <a id="approvesendinput" name="approvesendinput"></a> ApproveSendInput

Ƭ **ApproveSendInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |
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

### <a id="batchupdateclaimchaininput" name="batchupdateclaimchaininput"></a> BatchUpdateClaimChainInput

Ƭ **BatchUpdateClaimChainInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `finalTransferId` | `string` |
| `pathId` | `string` |
| `transferDataHashes` | `string`[] |

___

### <a id="bondinput" name="bondinput"></a> BondInput

Ƭ **BondInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bonderFee` | `BigNumberish` |
| `claimId` | `string` |
| `nextHops` | [`HopStructInput`](modules.md#hopstructinput)[] |
| `pathId` | `string` |

___

### <a id="bonderpreferenceindexes" name="bonderpreferenceindexes"></a> BonderPreferenceIndexes

Ƭ **BonderPreferenceIndexes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bonder?` | `string` |
| `feeTier?` | `BigNumber` |
| `pathId?` | `string` |

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

### <a id="claimchainupdatedindexes" name="claimchainupdatedindexes"></a> ClaimChainUpdatedIndexes

Ƭ **ClaimChainUpdatedIndexes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `claimId?` | `string` |
| `pathId?` | `string` |

___

### <a id="claimfeesfrompathinput" name="claimfeesfrompathinput"></a> ClaimFeesFromPathInput

Ƭ **ClaimFeesFromPathInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `pathId` | `string` |

___

### <a id="claimpostedindexes" name="claimpostedindexes"></a> ClaimPostedIndexes

Ƭ **ClaimPostedIndexes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `claimId?` | `string` |
| `pathId?` | `string` |

___

### <a id="confirmclaiminput" name="confirmclaiminput"></a> ConfirmClaimInput

Ƭ **ConfirmClaimInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `claimId` | `string` |
| `pathId` | `string` |

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

### <a id="distributeclaimedfeesinput" name="distributeclaimedfeesinput"></a> DistributeClaimedFeesInput

Ƭ **DistributeClaimedFeesInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `account` | `string` |
| `lastClaimId` | `string` |
| `pathId` | `string` |
| `totalFees` | `BigNumberish` |

___

### <a id="distributeexcessfeesinput" name="distributeexcessfeesinput"></a> DistributeExcessFeesInput

Ƭ **DistributeExcessFeesInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amounts` | `BigNumberish`[] |
| `pathId` | `string` |
| `recipients` | `string`[] |

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

### <a id="getamountoutinput" name="getamountoutinput"></a> GetAmountOutInput

Ƭ **GetAmountOutInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |
| `attestedClaimId` | `string` |
| `pathId` | `string` |

___

### <a id="getbatchupdatefeeinput" name="getbatchupdatefeeinput"></a> GetBatchUpdateFeeInput

Ƭ **GetBatchUpdateFeeInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `length` | `BigNumberish` |

___

### <a id="getbucketindexinput" name="getbucketindexinput"></a> GetBucketIndexInput

Ƭ **GetBucketIndexInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `claimId` | `string` |
| `pathId` | `string` |

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

### <a id="getclaimfeesfeeinput" name="getclaimfeesfeeinput"></a> GetClaimFeesFeeInput

Ƭ **GetClaimFeesFeeInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `pathId` | `string` |

___

### <a id="getestimatedreceivedinput" name="getestimatedreceivedinput"></a> GetEstimatedReceivedInput

Ƭ **GetEstimatedReceivedInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |
| `fromChainId` | `BigNumberish` |
| `fromToken` | `string` |
| `minAmountOut` | `BigNumberish` |
| `toChainId` | `BigNumberish` |
| `toToken` | `string` |

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

### <a id="geteventfilterinput" name="geteventfilterinput"></a> GetEventFilterInput

Ƭ **GetEventFilterInput**: `TransferSentIndexes` \| `TransferBondedIndexes`

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

### <a id="getfeepriceinput" name="getfeepriceinput"></a> GetFeePriceInput

Ƭ **GetFeePriceInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |

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
| `tokenAddress` | `string` |

___

### <a id="getheadclaimidinput" name="getheadclaimidinput"></a> GetHeadClaimIdInput

Ƭ **GetHeadClaimIdInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `pathId` | `string` |

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
| `pathId` | `string` |

___

### <a id="getistransferbondedinput" name="getistransferbondedinput"></a> GetIsTransferBondedInput

Ƭ **GetIsTransferBondedInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `transferId` | `string` |

___

### <a id="getistransferclaimedinput" name="getistransferclaimedinput"></a> GetIsTransferClaimedInput

Ƭ **GetIsTransferClaimedInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `transferId` | `string` |

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
| `pathId` | `string` |

___

### <a id="getneedsapprovalforsendinput" name="getneedsapprovalforsendinput"></a> GetNeedsApprovalForSendInput

Ƭ **GetNeedsApprovalForSendInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `account?` | `string` |
| `amount` | `BigNumberish` |
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
| `pathId` | `string` |

___

### <a id="getpathvaultinput" name="getpathvaultinput"></a> GetPathVaultInput

Ƭ **GetPathVaultInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
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

___

### <a id="gettokeninfoinput" name="gettokeninfoinput"></a> GetTokenInfoInput

Ƭ **GetTokenInfoInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | `string` |

___

### <a id="gettotalclaimsatclaimidinput" name="gettotalclaimsatclaimidinput"></a> GetTotalClaimsAtClaimIdInput

Ƭ **GetTotalClaimsAtClaimIdInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `claimId` | `string` |
| `pathId` | `string` |

___

### <a id="gettotalclaimsinput" name="gettotalclaimsinput"></a> GetTotalClaimsInput

Ƭ **GetTotalClaimsInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `pathId` | `string` |

___

### <a id="gettotalconfirmedinput" name="gettotalconfirmedinput"></a> GetTotalConfirmedInput

Ƭ **GetTotalConfirmedInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `pathId` | `string` |

___

### <a id="gettotalsentinput" name="gettotalsentinput"></a> GetTotalSentInput

Ƭ **GetTotalSentInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `pathId` | `string` |

___

### <a id="gettransferbondedeventfilterinput" name="gettransferbondedeventfilterinput"></a> GetTransferBondedEventFilterInput

Ƭ **GetTransferBondedEventFilterInput**: `TransferBondedIndexes`

___

### <a id="gettransferbondedeventfromtransactionhashinput" name="gettransferbondedeventfromtransactionhashinput"></a> GetTransferBondedEventFromTransactionHashInput

Ƭ **GetTransferBondedEventFromTransactionHashInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `transactionHash` | `string` |

___

### <a id="gettransferbondedeventfromtransactionreceiptinput" name="gettransferbondedeventfromtransactionreceiptinput"></a> GetTransferBondedEventFromTransactionReceiptInput

Ƭ **GetTransferBondedEventFromTransactionReceiptInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `receipt` | `providers.TransactionReceipt` |

___

### <a id="gettransferbondedeventfromtransferidinput" name="gettransferbondedeventfromtransferidinput"></a> GetTransferBondedEventFromTransferIdInput

Ƭ **GetTransferBondedEventFromTransferIdInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fromBlock?` | `number` |
| `transferId` | `string` |

___

### <a id="gettransferdatahashinput" name="gettransferdatahashinput"></a> GetTransferDataHashInput

Ƭ **GetTransferDataHashInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amountOut` | `BigNumberish` |
| `hops` | `HopStruct`[] |
| `to` | `string` |
| `totalClaims` | `BigNumberish` |
| `totalSent` | `BigNumberish` |

___

### <a id="gettransferidfromtransactionhashinput" name="gettransferidfromtransactionhashinput"></a> GetTransferIdFromTransactionHashInput

Ƭ **GetTransferIdFromTransactionHashInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `transactionHash` | `string` |

___

### <a id="gettransferidinput" name="gettransferidinput"></a> GetTransferIdInput

Ƭ **GetTransferIdInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `adjustedAmount` | `BigNumberish` |
| `attestedCheckpoint` | `string` |
| `minAmountOut` | `BigNumberish` |
| `nonce` | `BigNumberish` |
| `pathId` | `string` |
| `to` | `string` |
| `totalSent` | `BigNumberish` |

___

### <a id="gettransfersenteventfilterinput" name="gettransfersenteventfilterinput"></a> GetTransferSentEventFilterInput

Ƭ **GetTransferSentEventFilterInput**: `TransferSentIndexes`

___

### <a id="gettransfersenteventfromtransactionhashinput" name="gettransfersenteventfromtransactionhashinput"></a> GetTransferSentEventFromTransactionHashInput

Ƭ **GetTransferSentEventFromTransactionHashInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `transactionHash` | `string` |

___

### <a id="gettransfersenteventfromtransactionreceiptinput" name="gettransfersenteventfromtransactionreceiptinput"></a> GetTransferSentEventFromTransactionReceiptInput

Ƭ **GetTransferSentEventFromTransactionReceiptInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `receipt` | `providers.TransactionReceipt` |

___

### <a id="gettransfersenteventfromtransferidinput" name="gettransfersenteventfromtransferidinput"></a> GetTransferSentEventFromTransferIdInput

Ƭ **GetTransferSentEventFromTransferIdInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `transferId` | `string` |

___

### <a id="gettransfersenteventsfrompathidinput" name="gettransfersenteventsfrompathidinput"></a> GetTransferSentEventsFromPathIdInput

Ƭ **GetTransferSentEventsFromPathIdInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `pathId` | `string` |

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
| `network?` | `string` |
| `signersOrProviders` | `SignersOrProviders` |

___

### <a id="hopstructinput" name="hopstructinput"></a> HopStructInput

Ƭ **HopStructInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `attestedClaimId` | `string` |
| `maxBonderFee` | `BigNumberish` |
| `minAmountOut` | `BigNumberish` |
| `pathId` | `string` |

___

### <a id="hubconnectorconfig" name="hubconnectorconfig"></a> HubConnectorConfig

Ƭ **HubConnectorConfig**: `BaseConfig`

___

### <a id="isvalidclaiminput" name="isvalidclaiminput"></a> IsValidClaimInput

Ƭ **IsValidClaimInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `claimId` | `string` |
| `pathId` | `string` |

___

### <a id="isvalidtransferinput" name="isvalidtransferinput"></a> IsValidTransferInput

Ƭ **IsValidTransferInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `claimId` | `string` |
| `pathId` | `string` |

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
| `amountOut` | `BigNumberish` |
| `attestedClaimId` | `string` |
| `maxBonderFee` | `BigNumberish` |
| `nextHopsHash` | `string` |
| `pathId` | `string` |
| `to` | `string` |
| `totalClaims` | `BigNumberish` |
| `totalSent` | `BigNumberish` |
| `transferId` | `string` |

___

### <a id="railsgatewayconstructorinput" name="railsgatewayconstructorinput"></a> RailsGatewayConstructorInput

Ƭ **RailsGatewayConstructorInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `contractAddresses?` | `Addresses` |
| `gasPriceMultiplier?` | `number` |
| `network?` | `string` |
| `signerOrProvider?` | `Signer` \| `providers.Provider` |
| `signersOrProviders?` | `SignersOrProviders` |

___

### <a id="railsgatewaygetmessagefeeinput" name="railsgatewaygetmessagefeeinput"></a> RailsGatewayGetMessageFeeInput

Ƭ **RailsGatewayGetMessageFeeInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `pathId` | `string` |

___

### <a id="railsgatewaygetsendfeeinput" name="railsgatewaygetsendfeeinput"></a> RailsGatewayGetSendFeeInput

Ƭ **RailsGatewayGetSendFeeInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `pathId` | `string` |

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
| `claimId` | `string` |
| `pathId` | `string` |

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
| `fee` | `BigNumberish` |
| `hops` | [`HopStructInput`](modules.md#hopstructinput)[] |
| `to` | `string` |

___

### <a id="sendtokensinput" name="sendtokensinput"></a> SendTokensInput

Ƭ **SendTokensInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |
| `attestedClaimId?` | `string` |
| `fromChainId` | `BigNumberish` |
| `fromToken` | `string` |
| `minAmountOut` | `BigNumberish` |
| `to` | `string` |
| `toChainId` | `BigNumberish` |
| `toToken` | `string` |

___

### <a id="setfeepriceinput" name="setfeepriceinput"></a> SetFeePriceInput

Ƭ **SetFeePriceInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `feePrice` | `BigNumberish` |

___

### <a id="setfeepricesinput" name="setfeepricesinput"></a> SetFeePricesInput

Ƭ **SetFeePricesInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainIds` | `BigNumberish`[] |
| `feePrices` | `BigNumberish`[] |

___

### <a id="shouldattemptforwardmessageinput" name="shouldattemptforwardmessageinput"></a> ShouldAttemptForwardMessageInput

Ƭ **ShouldAttemptForwardMessageInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bundleCommittedEvent` | `BundleCommitted` |
| `fromChainId` | `BigNumberish` |

___

### <a id="signalpreferenceinput" name="signalpreferenceinput"></a> SignalPreferenceInput

Ƭ **SignalPreferenceInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `feeTier` | `BigNumberish` |
| `liquidity` | `BigNumberish` |
| `pathId` | `string` |

___

### <a id="signersorproviders" name="signersorproviders"></a> SignersOrProviders

Ƭ **SignersOrProviders**: `Object`

#### Index signature

▪ [key: `string`]: `SignerOrProvider`

___

### <a id="stakehopinput" name="stakehopinput"></a> StakeHopInput

Ƭ **StakeHopInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |
| `staker` | `string` |

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
| `fromBlock` | `number` |
| `toBlock` | `number` |

___

### <a id="transferbondedindexes" name="transferbondedindexes"></a> TransferBondedIndexes

Ƭ **TransferBondedIndexes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `claimId?` | `string` |
| `pathId?` | `string` |
| `to?` | `string` |

___

### <a id="transfersenteventinput" name="transfersenteventinput"></a> TransferSentEventInput

Ƭ **TransferSentEventInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fetchTxData?` | `boolean` |
| `fromBlock` | `number` |
| `toBlock` | `number` |

___

### <a id="transfersentindexes" name="transfersentindexes"></a> TransferSentIndexes

Ƭ **TransferSentIndexes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `pathId?` | `string` |
| `to?` | `string` |
| `transferId?` | `string` |

___

### <a id="transferstatus" name="transferstatus"></a> TransferStatus

Ƭ **TransferStatus**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `state` | [`TransferState`](enums/TransferState.md) |
| `transferBondedEvents` | `EthersEventWithDecodedTypes`\<`TransferBonded`\>[] |
| `transferId` | `string` |
| `transferSentEvent` | `EthersEventWithDecodedTypes`\<`TransferSent`\> |

___

### <a id="txoverrides" name="txoverrides"></a> TxOverrides

Ƭ **TxOverrides**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId?` | `BigNumberish` |
| `from?` | `string` |
| `gasLimit?` | `BigNumberish` |
| `gasPrice?` | `BigNumberish` |
| `maxFeePerGas?` | `BigNumberish` |
| `maxPriorityFeePerGas?` | `BigNumberish` |
| `nonce?` | `BigNumberish` |
| `type?` | `number` |
| `value?` | `BigNumberish` |

___

### <a id="unstakehopinput" name="unstakehopinput"></a> UnstakeHopInput

Ƭ **UnstakeHopInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `ethers.BigNumberish` |

___

### <a id="updateclaimchaininput" name="updateclaimchaininput"></a> UpdateClaimChainInput

Ƭ **UpdateClaimChainInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `claimId` | `string` |
| `pathId` | `string` |
| `transferDataHash` | `string` |

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

### <a id="withdrawinput" name="withdrawinput"></a> WithdrawInput

Ƭ **WithdrawInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `claimId` | `string` |
| `pathId` | `string` |

___

### <a id="withdrawablebalanceinput" name="withdrawablebalanceinput"></a> WithdrawableBalanceInput

Ƭ **WithdrawableBalanceInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `claimId` | `string` |
| `pathId` | `string` |
| `recipient` | `string` |

## Variables

### <a id="utils" name="utils"></a> utils

• `Const` **utils**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `formatUSD` | (`amount`: `string` \| `number`) => `string` |
| `getAddressExplorerUrl` | (`network`: `string`, `chainId`: `string`, `address`: `string`) => `string` |
| `getChainSlug` | (`chainId`: `BigNumberish`) => `string` |
| `getComputedNextHopsHash` | (`nextHops`: [`HopStruct`](interfaces/HopStruct.md)[]) => `string` |
| `getComputedPathId` | (`chainId0`: `BigNumberish`, `token0`: `string`, `chainId1`: `BigNumberish`, `token1`: `string`) => `string` |
| `getComputedTransferDataHash` | (`__namedParameters`: `Input`) => `string` |
| `getComputedTransferId` | (`previousTransferId`: `string`, `transferDataHash`: `string`) => `string` |
| `getExplorerUrl` | (`network`: `string`, `chainId`: `string`) => `string` |
| `getTokenExplorerUrl` | (`network`: `string`, `chainId`: `string`, `address`: `string`) => `string` |
| `getTxHashExplorerUrl` | (`network`: `string`, `chainId`: `string`, `txHash`: `string`) => `string` |
| `isContractError` | (`err`: `unknown`) => `boolean` |
