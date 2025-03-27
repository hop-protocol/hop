# @hop-protocol/v2-sdk

## Table of contents

### Enumerations

- [EventName](enums/EventName.md)
- [MessengerEventName](enums/MessengerEventName.md)
- [RailsGatewayEventName](enums/RailsGatewayEventName.md)
- [RailsPathEventName](enums/RailsPathEventName.md)
- [TransferState](enums/TransferState.md)

### Classes

- [BonderPreferenceEventFetcher](classes/BonderPreferenceEventFetcher.md)
- [ClaimPushedEventFetcher](classes/ClaimPushedEventFetcher.md)
- [ClaimReaddedEventFetcher](classes/ClaimReaddedEventFetcher.md)
- [ClaimRemovedEventFetcher](classes/ClaimRemovedEventFetcher.md)
- [ConfigError](classes/ConfigError.md)
- [ContractFunctionRevertedError](classes/ContractFunctionRevertedError.md)
- [CustomError](classes/CustomError.md)
- [Hop](classes/Hop.md)
- [HubConnector](classes/HubConnector.md)
- [InputError](classes/InputError.md)
- [InsufficientApprovalError](classes/InsufficientApprovalError.md)
- [InsufficientBalanceError](classes/InsufficientBalanceError.md)
- [Messenger](classes/Messenger.md)
- [PathInitializedEventFetcher](classes/PathInitializedEventFetcher.md)
- [PriceFeed](classes/PriceFeed.md)
- [RailsGateway](classes/RailsGateway.md)
- [RailsPath](classes/RailsPath.md)

### Interfaces

- [BonderPreference](interfaces/BonderPreference.md)
- [BundleCommitted](interfaces/BundleCommitted.md)
- [BundleForwarded](interfaces/BundleForwarded.md)
- [BundleReceived](interfaces/BundleReceived.md)
- [BundleSet](interfaces/BundleSet.md)
- [ClaimPushed](interfaces/ClaimPushed.md)
- [ClaimReadded](interfaces/ClaimReadded.md)
- [ClaimRemoved](interfaces/ClaimRemoved.md)
- [FeesSentToHub](interfaces/FeesSentToHub.md)
- [HopStruct](interfaces/HopStruct.md)
- [MessageBundled](interfaces/MessageBundled.md)
- [MessageExecuted](interfaces/MessageExecuted.md)
- [MessageSent](interfaces/MessageSent.md)
- [PathInitialized](interfaces/PathInitialized.md)
- [TransferBonded](interfaces/TransferBonded.md)
- [TransferSent](interfaces/TransferSent.md)

### Type Aliases

- [AllEventTypes](modules.md#alleventtypes)
- [ApproveBondInput](modules.md#approvebondinput)
- [ApproveSendInput](modules.md#approvesendinput)
- [ApproveSendTokensInput](modules.md#approvesendtokensinput)
- [BondInput](modules.md#bondinput)
- [BonderPreferenceIndexes](modules.md#bonderpreferenceindexes)
- [BundleProof](modules.md#bundleproof)
- [CalcAmountOutMinInput](modules.md#calcamountoutmininput)
- [Claim](modules.md#claim)
- [ClaimChainInput](modules.md#claimchaininput)
- [ClaimFeesFromPathInput](modules.md#claimfeesfrompathinput)
- [ClaimPushedIndexes](modules.md#claimpushedindexes)
- [ClaimReaddedIndexes](modules.md#claimreaddedindexes)
- [ClaimRemovedIndexes](modules.md#claimremovedindexes)
- [ConfirmClaimInput](modules.md#confirmclaiminput)
- [ConnectTargetsInput](modules.md#connecttargetsinput)
- [CounterpartChainIdsInput](modules.md#counterpartchainidsinput)
- [DistributeClaimedFeesInput](modules.md#distributeclaimedfeesinput)
- [EthersEventWithDecodedTypes](modules.md#etherseventwithdecodedtypes)
- [EthersEventWithDecodedTypesAndBaseContext](modules.md#etherseventwithdecodedtypesandbasecontext)
- [EthersEventWithDecodedTypesAndContext](modules.md#etherseventwithdecodedtypesandcontext)
- [EventContext](modules.md#eventcontext)
- [ExecuteInput](modules.md#executeinput)
- [ExitBundleInput](modules.md#exitbundleinput)
- [GetAmountOutInput](modules.md#getamountoutinput)
- [GetBucketIndexInput](modules.md#getbucketindexinput)
- [GetBundleExitPopulatedTxInput](modules.md#getbundleexitpopulatedtxinput)
- [GetBundleProofFromMessageIdInput](modules.md#getbundleprooffrommessageidinput)
- [GetBundleProofFromTransactionHashInput](modules.md#getbundleprooffromtransactionhashinput)
- [GetClaimInput](modules.md#getclaiminput)
- [GetCounterpartChainIdInput](modules.md#getcounterpartchainidinput)
- [GetEstimatedReceivedInput](modules.md#getestimatedreceivedinput)
- [GetEventContextInput](modules.md#geteventcontextinput)
- [GetEventFilterInput](modules.md#geteventfilterinput)
- [GetEventFromTransactionHashInput](modules.md#geteventfromtransactionhashinput)
- [GetEventFromTransactionReceiptInput](modules.md#geteventfromtransactionreceiptinput)
- [GetEventFromTransferIdInput](modules.md#geteventfromtransferidinput)
- [GetEventsInBatchesInput](modules.md#geteventsinbatchesinput)
- [GetEventsInput](modules.md#geteventsinput)
- [GetGeneralEventsInput](modules.md#getgeneraleventsinput)
- [GetHasSufficientBalanceInput](modules.md#gethassufficientbalanceinput)
- [GetHeadClaimIdInput](modules.md#getheadclaimidinput)
- [GetHopBalanceInput](modules.md#gethopbalanceinput)
- [GetInitialReserveByTokenAddressInput](modules.md#getinitialreservebytokenaddressinput)
- [GetInitialReserveByTokenSymbolInput](modules.md#getinitialreservebytokensymbolinput)
- [GetInitialReserveInput](modules.md#getinitialreserveinput)
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
- [GetNextHopsHashFromHopsInput](modules.md#getnexthopshashfromhopsinput)
- [GetNextHopsHashInput](modules.md#getnexthopshashinput)
- [GetPathIdInput](modules.md#getpathidinput)
- [GetPathInfoInput](modules.md#getpathinfoinput)
- [GetPathInput](modules.md#getpathinput)
- [GetRelayFeeInput](modules.md#getrelayfeeinput)
- [GetRelayMessageDataFromTransactionHashInput](modules.md#getrelaymessagedatafromtransactionhashinput)
- [GetRelayMessagePopulatedTxInput](modules.md#getrelaymessagepopulatedtxinput)
- [GetRelayRewardInput](modules.md#getrelayrewardinput)
- [GetRemovedBalanceInput](modules.md#getremovedbalanceinput)
- [GetRouteDataInput](modules.md#getroutedatainput)
- [GetSendFeeInput](modules.md#getsendfeeinput)
- [GetSendMessagePopulatedTxInput](modules.md#getsendmessagepopulatedtxinput)
- [GetSourcePoolInput](modules.md#getsourcepoolinput)
- [GetSpokeExitTimeInput](modules.md#getspokeexittimeinput)
- [GetTokenContractInput](modules.md#gettokencontractinput)
- [GetTokenInfoInput](modules.md#gettokeninfoinput)
- [GetTotalClaimsAtClaimIdInput](modules.md#gettotalclaimsatclaimidinput)
- [GetTotalSentInput](modules.md#gettotalsentinput)
- [GetTotalWithdrawableAtClaimIdInput](modules.md#gettotalwithdrawableatclaimidinput)
- [GetTransferBondedEventFromTransactionHashInput](modules.md#gettransferbondedeventfromtransactionhashinput)
- [GetTransferBondedEventFromTransactionReceiptInput](modules.md#gettransferbondedeventfromtransactionreceiptinput)
- [GetTransferBondedEventFromTransferIdInput](modules.md#gettransferbondedeventfromtransferidinput)
- [GetTransferDataHashInput](modules.md#gettransferdatahashinput)
- [GetTransferIdFromTransactionHashInput](modules.md#gettransferidfromtransactionhashinput)
- [GetTransferInput](modules.md#gettransferinput)
- [GetTransferSentEventFromTransactionHashInput](modules.md#gettransfersenteventfromtransactionhashinput)
- [GetTransferSentEventFromTransactionReceiptInput](modules.md#gettransfersenteventfromtransactionreceiptinput)
- [GetTransferSentEventFromTransferIdInput](modules.md#gettransfersenteventfromtransferidinput)
- [GetTransferStatusInput](modules.md#gettransferstatusinput)
- [GetWithdrawableBalanceInput](modules.md#getwithdrawablebalanceinput)
- [HasAuctionStartedInput](modules.md#hasauctionstartedinput)
- [HopConstructorInput](modules.md#hopconstructorinput)
- [HopStructInput](modules.md#hopstructinput)
- [HubConnectorConfig](modules.md#hubconnectorconfig)
- [InitChainInput](modules.md#initchaininput)
- [InitPathInput](modules.md#initpathinput)
- [IsPathInitializedInput](modules.md#ispathinitializedinput)
- [LastBondedClaimIdForBonderInput](modules.md#lastbondedclaimidforbonderinput)
- [MessengerConstructorInput](modules.md#messengerconstructorinput)
- [Path](modules.md#path)
- [PathInitializedIndexes](modules.md#pathinitializedindexes)
- [PushClaimAndBondInput](modules.md#pushclaimandbondinput)
- [PushClaimAndWithdrawInput](modules.md#pushclaimandwithdrawinput)
- [PushClaimInput](modules.md#pushclaiminput)
- [RailsGatewayConstructorInput](modules.md#railsgatewayconstructorinput)
- [RailsGatewayGetMessageFeeInput](modules.md#railsgatewaygetmessagefeeinput)
- [RailsGatewayGetSendFeeInput](modules.md#railsgatewaygetsendfeeinput)
- [RailsPathApproveSendInput](modules.md#railspathapprovesendinput)
- [RailsPathBondInput](modules.md#railspathbondinput)
- [RailsPathBucket](modules.md#railspathbucket)
- [RailsPathClaim](modules.md#railspathclaim)
- [RailsPathConfirmClaimInput](modules.md#railspathconfirmclaiminput)
- [RailsPathConstructorInput](modules.md#railspathconstructorinput)
- [RailsPathEventFetcher](modules.md#railspatheventfetcher)
- [RailsPathGetAmountOutInput](modules.md#railspathgetamountoutinput)
- [RailsPathGetBucketIndexInput](modules.md#railspathgetbucketindexinput)
- [RailsPathGetBucketInput](modules.md#railspathgetbucketinput)
- [RailsPathGetClaimInput](modules.md#railspathgetclaiminput)
- [RailsPathGetEventFilterInput](modules.md#railspathgeteventfilterinput)
- [RailsPathGetNextHopsHashInput](modules.md#railspathgetnexthopshashinput)
- [RailsPathGetWithdrawableBalanceInput](modules.md#railspathgetwithdrawablebalanceinput)
- [RailsPathIsValidClaimInput](modules.md#railspathisvalidclaiminput)
- [RailsPathIsValidTransferInput](modules.md#railspathisvalidtransferinput)
- [RailsPathPath](modules.md#railspathpath)
- [RailsPathPushClaimInput](modules.md#railspathpushclaiminput)
- [RailsPathReaddClaimInput](modules.md#railspathreaddclaiminput)
- [RailsPathRemoveClaimInput](modules.md#railspathremoveclaiminput)
- [RailsPathSendInput](modules.md#railspathsendinput)
- [RailsPathWithdrawBondsInput](modules.md#railspathwithdrawbondsinput)
- [RailsPathWithdrawClaimInput](modules.md#railspathwithdrawclaiminput)
- [ReaddClaimInput](modules.md#readdclaiminput)
- [RelayMessageData](modules.md#relaymessagedata)
- [RemoveClaimInput](modules.md#removeclaiminput)
- [RouteData](modules.md#routedata)
- [SendInput](modules.md#sendinput)
- [SendTokensInput](modules.md#sendtokensinput)
- [SetDefaultTokenFeeInput](modules.md#setdefaulttokenfeeinput)
- [SetStakingRegistryInput](modules.md#setstakingregistryinput)
- [SetTokenFeeRecipientInput](modules.md#settokenfeerecipientinput)
- [ShouldAttemptForwardMessageInput](modules.md#shouldattemptforwardmessageinput)
- [SignalPreferenceInput](modules.md#signalpreferenceinput)
- [SignersOrProviders](modules.md#signersorproviders)
- [StakeHopInput](modules.md#stakehopinput)
- [StakingRegistryGetWithdrawableBalanceInput](modules.md#stakingregistrygetwithdrawablebalanceinput)
- [Token](modules.md#token)
- [TokensInput](modules.md#tokensinput)
- [TransactionReceiptWithEvents](modules.md#transactionreceiptwithevents)
- [Transfer](modules.md#transfer)
- [TransferBondedIndexes](modules.md#transferbondedindexes)
- [TransferChainInput](modules.md#transferchaininput)
- [TransferSentIndexes](modules.md#transfersentindexes)
- [TransferStatus](modules.md#transferstatus)
- [TxOverrides](modules.md#txoverrides)
- [UnstakeHopInput](modules.md#unstakehopinput)
- [UpdateDefaultTokenFeeInput](modules.md#updatedefaulttokenfeeinput)
- [UpdateTokenFeeInput](modules.md#updatetokenfeeinput)
- [WillSendTokensFailInput](modules.md#willsendtokensfailinput)
- [WithdrawBondsInput](modules.md#withdrawbondsinput)
- [WithdrawClaimInput](modules.md#withdrawclaiminput)
- [WithdrawnInput](modules.md#withdrawninput)

### Variables

- [utils](modules.md#utils)

### Functions

- [getBlockNumberFromDate](modules.md#getblocknumberfromdate)

## Type Aliases

### <a id="alleventtypes" name="alleventtypes"></a> AllEventTypes

Ƭ **AllEventTypes**: `TransferSent` \| `TransferBonded` \| `FeesSentToHub` \| `BundleCommitted` \| `BundleForwarded` \| `BundleReceived` \| `BundleSet` \| `MessageBundled` \| `MessageExecuted` \| `MessageSent` \| `PathInitialized`

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

### <a id="claim" name="claim"></a> Claim

Ƭ **Claim**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amountOut` | `BigNumber` |
| `bondedOrWithdrawnBy` | `string` |
| `createdAt` | `BigNumber` |
| `index` | `BigNumber` |
| `maxBonderFee` | `BigNumber` |
| `nextHopsHash` | `string` |
| `to` | `string` |
| `totalAddedToBucketMaxConfirmed` | `BigNumber` |
| `totalAttested` | `BigNumber` |
| `totalClaims` | `BigNumber` |

___

### <a id="claimchaininput" name="claimchaininput"></a> ClaimChainInput

Ƭ **ClaimChainInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `index` | `BigNumberish` |

___

### <a id="claimfeesfrompathinput" name="claimfeesfrompathinput"></a> ClaimFeesFromPathInput

Ƭ **ClaimFeesFromPathInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `pathId` | `string` |

___

### <a id="claimpushedindexes" name="claimpushedindexes"></a> ClaimPushedIndexes

Ƭ **ClaimPushedIndexes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `claimId?` | `string` |
| `pathId?` | `string` |

___

### <a id="claimreaddedindexes" name="claimreaddedindexes"></a> ClaimReaddedIndexes

Ƭ **ClaimReaddedIndexes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `claimId?` | `string` |
| `pathId?` | `string` |

___

### <a id="claimremovedindexes" name="claimremovedindexes"></a> ClaimRemovedIndexes

Ƭ **ClaimRemovedIndexes**: `Object`

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

### <a id="counterpartchainidsinput" name="counterpartchainidsinput"></a> CounterpartChainIdsInput

Ƭ **CounterpartChainIdsInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `pathId` | `string` |

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

### <a id="etherseventwithdecodedtypes" name="etherseventwithdecodedtypes"></a> EthersEventWithDecodedTypes

Ƭ **EthersEventWithDecodedTypes**\<`T`\>: `EthersEvent` & \{ `decoded`: `T`  }

#### Type parameters

| Name |
| :------ |
| `T` |

___

### <a id="etherseventwithdecodedtypesandbasecontext" name="etherseventwithdecodedtypesandbasecontext"></a> EthersEventWithDecodedTypesAndBaseContext

Ƭ **EthersEventWithDecodedTypesAndBaseContext**\<`T`\>: `EthersEvent` & \{ `context`: `BaseEventContext` ; `decoded`: `T`  }

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

___

### <a id="getamountoutinput" name="getamountoutinput"></a> GetAmountOutInput

Ƭ **GetAmountOutInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |
| `attestedClaimId` | `string` |
| `pathId` | `string` |
| `sourcePool` | `BigNumberish` |

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

___

### <a id="getbundleprooffrommessageidinput" name="getbundleprooffrommessageidinput"></a> GetBundleProofFromMessageIdInput

Ƭ **GetBundleProofFromMessageIdInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `messageId` | `string` |

___

### <a id="getbundleprooffromtransactionhashinput" name="getbundleprooffromtransactionhashinput"></a> GetBundleProofFromTransactionHashInput

Ƭ **GetBundleProofFromTransactionHashInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `transactionHash` | `string` |

___

### <a id="getclaiminput" name="getclaiminput"></a> GetClaimInput

Ƭ **GetClaimInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `claimId` | `string` |
| `pathId` | `string` |

___

### <a id="getcounterpartchainidinput" name="getcounterpartchainidinput"></a> GetCounterpartChainIdInput

Ƭ **GetCounterpartChainIdInput**: `Object`

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

### <a id="geteventcontextinput" name="geteventcontextinput"></a> GetEventContextInput

Ƭ **GetEventContextInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `event` | `EthersEvent` |

___

### <a id="geteventfilterinput" name="geteventfilterinput"></a> GetEventFilterInput

Ƭ **GetEventFilterInput**: `PathInitializedIndexes`

___

### <a id="geteventfromtransactionhashinput" name="geteventfromtransactionhashinput"></a> GetEventFromTransactionHashInput

Ƭ **GetEventFromTransactionHashInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `eventName` | [`RailsPathEventName`](enums/RailsPathEventName.md) |
| `transactionHash` | `string` |

___

### <a id="geteventfromtransactionreceiptinput" name="geteventfromtransactionreceiptinput"></a> GetEventFromTransactionReceiptInput

Ƭ **GetEventFromTransactionReceiptInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `eventName` | [`RailsPathEventName`](enums/RailsPathEventName.md) |
| `receipt` | `providers.TransactionReceipt` |

___

### <a id="geteventfromtransferidinput" name="geteventfromtransferidinput"></a> GetEventFromTransferIdInput

Ƭ **GetEventFromTransferIdInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `eventName` | [`RailsPathEventName`](enums/RailsPathEventName.md) |
| `fromBlock?` | `number` |
| `transferId` | `string` |

___

### <a id="geteventsinbatchesinput" name="geteventsinbatchesinput"></a> GetEventsInBatchesInput

Ƭ **GetEventsInBatchesInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `eventName` | [`RailsPathEventName`](enums/RailsPathEventName.md) |
| `fetchTxData?` | `boolean` |
| `fromBlock` | `number` |
| `toBlock` | `number` |

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

### <a id="gethopbalanceinput" name="gethopbalanceinput"></a> GetHopBalanceInput

Ƭ **GetHopBalanceInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `staker` | `string` |

___

### <a id="getinitialreservebytokenaddressinput" name="getinitialreservebytokenaddressinput"></a> GetInitialReserveByTokenAddressInput

Ƭ **GetInitialReserveByTokenAddressInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `tokenAddress` | `string` |

___

### <a id="getinitialreservebytokensymbolinput" name="getinitialreservebytokensymbolinput"></a> GetInitialReserveByTokenSymbolInput

Ƭ **GetInitialReserveByTokenSymbolInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `tokenSymbol` | `string` |

___

### <a id="getinitialreserveinput" name="getinitialreserveinput"></a> GetInitialReserveInput

Ƭ **GetInitialReserveInput**: `Object`

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
| `transactionHash` | `string` |

___

### <a id="getismessageidrelayedinput" name="getismessageidrelayedinput"></a> GetIsMessageIdRelayedInput

Ƭ **GetIsMessageIdRelayedInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `messageId` | `string` |

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
| `messageId` | `string` |

___

### <a id="getmessagebundleidfromtransactionhashinput" name="getmessagebundleidfromtransactionhashinput"></a> GetMessageBundleIdFromTransactionHashInput

Ƭ **GetMessageBundleIdFromTransactionHashInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `transactionHash` | `string` |

___

### <a id="getmessagebundledeventfrommessageidinput" name="getmessagebundledeventfrommessageidinput"></a> GetMessageBundledEventFromMessageIdInput

Ƭ **GetMessageBundledEventFromMessageIdInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `messageId` | `string` |

___

### <a id="getmessagebundledeventfromtransactionhashinput" name="getmessagebundledeventfromtransactionhashinput"></a> GetMessageBundledEventFromTransactionHashInput

Ƭ **GetMessageBundledEventFromTransactionHashInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `transactionHash` | `string` |

___

### <a id="getmessagebundledeventsforbundleidinput" name="getmessagebundledeventsforbundleidinput"></a> GetMessageBundledEventsForBundleIdInput

Ƭ **GetMessageBundledEventsForBundleIdInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bundleId` | `string` |

___

### <a id="getmessagecalldatainput" name="getmessagecalldatainput"></a> GetMessageCalldataInput

Ƭ **GetMessageCalldataInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `messageId` | `string` |

___

### <a id="getmessageexecutedeventfrommessageidinput" name="getmessageexecutedeventfrommessageidinput"></a> GetMessageExecutedEventFromMessageIdInput

Ƭ **GetMessageExecutedEventFromMessageIdInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `messageId` | `string` |

___

### <a id="getmessagefeeinput" name="getmessagefeeinput"></a> GetMessageFeeInput

Ƭ **GetMessageFeeInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `toChainId` | `BigNumberish` |

___

### <a id="getmessageidfromtransactionhashinput" name="getmessageidfromtransactionhashinput"></a> GetMessageIdFromTransactionHashInput

Ƭ **GetMessageIdFromTransactionHashInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `transactionHash` | `string` |

___

### <a id="getmessageidsforbundleidinput" name="getmessageidsforbundleidinput"></a> GetMessageIdsForBundleIdInput

Ƭ **GetMessageIdsForBundleIdInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bundleId` | `string` |

___

### <a id="getmessagesenteventfrommessageidinput" name="getmessagesenteventfrommessageidinput"></a> GetMessageSentEventFromMessageIdInput

Ƭ **GetMessageSentEventFromMessageIdInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `messageId` | `string` |

___

### <a id="getmessagesenteventfromtransactionhashinput" name="getmessagesenteventfromtransactionhashinput"></a> GetMessageSentEventFromTransactionHashInput

Ƭ **GetMessageSentEventFromTransactionHashInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `transactionHash` | `string` |

___

### <a id="getmessagesenteventfromtransactionreceiptinput" name="getmessagesenteventfromtransactionreceiptinput"></a> GetMessageSentEventFromTransactionReceiptInput

Ƭ **GetMessageSentEventFromTransactionReceiptInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `receipt` | `providers.TransactionReceipt` |

___

### <a id="getmessagetreeindexfrommessageidinput" name="getmessagetreeindexfrommessageidinput"></a> GetMessageTreeIndexFromMessageIdInput

Ƭ **GetMessageTreeIndexFromMessageIdInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `messageId` | `string` |

___

### <a id="getmessagetreeindexfromtransactionhashinput" name="getmessagetreeindexfromtransactionhashinput"></a> GetMessageTreeIndexFromTransactionHashInput

Ƭ **GetMessageTreeIndexFromTransactionHashInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
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

### <a id="getnexthopshashfromhopsinput" name="getnexthopshashfromhopsinput"></a> GetNextHopsHashFromHopsInput

Ƭ **GetNextHopsHashFromHopsInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `hops` | `HopStructInput`[] |

___

### <a id="getnexthopshashinput" name="getnexthopshashinput"></a> GetNextHopsHashInput

Ƭ **GetNextHopsHashInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `nextHops` | [`HopStructInput`](modules.md#hopstructinput)[] |

___

### <a id="getpathidinput" name="getpathidinput"></a> GetPathIdInput

Ƭ **GetPathIdInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId0` | `BigNumberish` |
| `chainId1` | `BigNumberish` |
| `initialReserve` | `BigNumberish` |
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

### <a id="getpathinput" name="getpathinput"></a> GetPathInput

Ƭ **GetPathInput**: `Object`

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
| `toAddress` | `string` |
| `toCalldata` | `string` |
| `toChainId` | `BigNumberish` |

___

### <a id="getrelaymessagedatafromtransactionhashinput" name="getrelaymessagedatafromtransactionhashinput"></a> GetRelayMessageDataFromTransactionHashInput

Ƭ **GetRelayMessageDataFromTransactionHashInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
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

___

### <a id="getrelayrewardinput" name="getrelayrewardinput"></a> GetRelayRewardInput

Ƭ **GetRelayRewardInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bundleCommittedEvent` | `BundleCommitted` |

___

### <a id="getremovedbalanceinput" name="getremovedbalanceinput"></a> GetRemovedBalanceInput

Ƭ **GetRemovedBalanceInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bonder` | `string` |

___

### <a id="getroutedatainput" name="getroutedatainput"></a> GetRouteDataInput

Ƭ **GetRouteDataInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
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
| `toAddress` | `string` |
| `toCalldata` | `string` |
| `toChainId` | `BigNumberish` |

___

### <a id="getsourcepoolinput" name="getsourcepoolinput"></a> GetSourcePoolInput

Ƭ **GetSourcePoolInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `attestedClaimId` | `string` |

___

### <a id="getspokeexittimeinput" name="getspokeexittimeinput"></a> GetSpokeExitTimeInput

Ƭ **GetSpokeExitTimeInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `spokeChainId` | `BigNumberish` |

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

___

### <a id="gettotalsentinput" name="gettotalsentinput"></a> GetTotalSentInput

Ƭ **GetTotalSentInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `pathId` | `string` |

___

### <a id="gettotalwithdrawableatclaimidinput" name="gettotalwithdrawableatclaimidinput"></a> GetTotalWithdrawableAtClaimIdInput

Ƭ **GetTotalWithdrawableAtClaimIdInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bonder` | `string` |
| `claimId` | `string` |

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
| `amount` | `BigNumberish` |
| `attestedClaimId?` | `string` |
| `hops` | [`HopStructInput`](modules.md#hopstructinput)[] |
| `maxBonderFee?` | `BigNumberish` |
| `sourcePool` | `BigNumberish` |
| `to` | `string` |

___

### <a id="gettransferidfromtransactionhashinput" name="gettransferidfromtransactionhashinput"></a> GetTransferIdFromTransactionHashInput

Ƭ **GetTransferIdFromTransactionHashInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `transactionHash` | `string` |

___

### <a id="gettransferinput" name="gettransferinput"></a> GetTransferInput

Ƭ **GetTransferInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `transferId` | `string` |

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
| `fromBlock?` | `number` |
| `transferId` | `string` |

___

### <a id="gettransferstatusinput" name="gettransferstatusinput"></a> GetTransferStatusInput

Ƭ **GetTransferStatusInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fromChainId?` | `BigNumberish` |
| `toChainId?` | `BigNumberish` |
| `transactionHash?` | `string` |
| `transferId?` | `string` |

___

### <a id="getwithdrawablebalanceinput" name="getwithdrawablebalanceinput"></a> GetWithdrawableBalanceInput

Ƭ **GetWithdrawableBalanceInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `claimId` | `string` |
| `pathId` | `string` |
| `recipient` | `string` |

___

### <a id="hasauctionstartedinput" name="hasauctionstartedinput"></a> HasAuctionStartedInput

Ƭ **HasAuctionStartedInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bundleCommittedEvent` | `BundleCommitted` |

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
| `maxTotalSent` | `BigNumberish` |
| `pathId` | `string` |

___

### <a id="hubconnectorconfig" name="hubconnectorconfig"></a> HubConnectorConfig

Ƭ **HubConnectorConfig**: `BaseConfig`

___

### <a id="initchaininput" name="initchaininput"></a> InitChainInput

Ƭ **InitChainInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `BigNumberish` |
| `gateway` | `string` |

___

### <a id="initpathinput" name="initpathinput"></a> InitPathInput

Ƭ **InitPathInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `counterpartChainId` | `BigNumberish` |
| `counterpartToken` | `string` |
| `initialReserve` | `BigNumberish` |
| `token` | `string` |

___

### <a id="ispathinitializedinput" name="ispathinitializedinput"></a> IsPathInitializedInput

Ƭ **IsPathInitializedInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `pathId` | `string` |

___

### <a id="lastbondedclaimidforbonderinput" name="lastbondedclaimidforbonderinput"></a> LastBondedClaimIdForBonderInput

Ƭ **LastBondedClaimIdForBonderInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bonder` | `string` |

___

### <a id="messengerconstructorinput" name="messengerconstructorinput"></a> MessengerConstructorInput

Ƭ **MessengerConstructorInput**: `Object`

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

### <a id="path" name="path"></a> Path

Ƭ **Path**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `string` |
| `counterpartChainId` | `string` |
| `counterpartToken` | `string` |
| `initialReserve` | `BigNumber` |
| `pathId` | `string` |
| `token` | `string` |

___

### <a id="pathinitializedindexes" name="pathinitializedindexes"></a> PathInitializedIndexes

Ƭ **PathInitializedIndexes**: `Object`

___

### <a id="pushclaimandbondinput" name="pushclaimandbondinput"></a> PushClaimAndBondInput

Ƭ **PushClaimAndBondInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amountOut` | `BigNumberish` |
| `attestedClaimId` | `string` |
| `bonderFee` | `BigNumberish` |
| `claimId` | `string` |
| `maxBonderFee` | `BigNumberish` |
| `nextHops` | [`HopStructInput`](modules.md#hopstructinput)[] |
| `pathId` | `string` |
| `sourcePool` | `BigNumberish` |
| `to` | `string` |

___

### <a id="pushclaimandwithdrawinput" name="pushclaimandwithdrawinput"></a> PushClaimAndWithdrawInput

Ƭ **PushClaimAndWithdrawInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amountOut` | `BigNumberish` |
| `attestedClaimId` | `string` |
| `claimId` | `string` |
| `maxBonderFee` | `BigNumberish` |
| `nextHops` | [`HopStructInput`](modules.md#hopstructinput)[] |
| `pathId` | `string` |
| `sourcePool` | `BigNumberish` |
| `to` | `string` |

___

### <a id="pushclaiminput" name="pushclaiminput"></a> PushClaimInput

Ƭ **PushClaimInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |
| `attestedClaimId` | `string` |
| `claimId` | `string` |
| `maxBonderFee` | `BigNumberish` |
| `nextHopsHash` | `string` |
| `pathId` | `string` |
| `sourcePool` | `BigNumberish` |
| `to` | `string` |

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
| `chainId` | `BigNumberish` |

___

### <a id="railsgatewaygetsendfeeinput" name="railsgatewaygetsendfeeinput"></a> RailsGatewayGetSendFeeInput

Ƭ **RailsGatewayGetSendFeeInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `pathId` | `string` |

___

### <a id="railspathapprovesendinput" name="railspathapprovesendinput"></a> RailsPathApproveSendInput

Ƭ **RailsPathApproveSendInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |

___

### <a id="railspathbondinput" name="railspathbondinput"></a> RailsPathBondInput

Ƭ **RailsPathBondInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bonderFee` | `BigNumberish` |
| `claimId` | `string` |
| `nextHops` | `HopStructInput`[] |

___

### <a id="railspathbucket" name="railspathbucket"></a> RailsPathBucket

Ƭ **RailsPathBucket**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `completedAt` | `BigNumber` |
| `finalClaimId` | `string` |
| `maxConfirmed` | `BigNumber` |
| `totalAttested` | `BigNumber` |

___

### <a id="railspathclaim" name="railspathclaim"></a> RailsPathClaim

Ƭ **RailsPathClaim**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amountOut` | `BigNumber` |
| `bondedOrWithdrawnBy` | `string` |
| `createdAt` | `BigNumber` |
| `index` | `BigNumber` |
| `maxBonderFee` | `BigNumber` |
| `nextHopsHash` | `string` |
| `to` | `string` |
| `totalAddedToBucketMaxConfirmed` | `BigNumber` |
| `totalAttested` | `BigNumber` |
| `totalClaims` | `BigNumber` |

___

### <a id="railspathconfirmclaiminput" name="railspathconfirmclaiminput"></a> RailsPathConfirmClaimInput

Ƭ **RailsPathConfirmClaimInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `claimId` | `string` |

___

### <a id="railspathconstructorinput" name="railspathconstructorinput"></a> RailsPathConstructorInput

Ƭ **RailsPathConstructorInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address?` | `string` |
| `chainId` | `BigNumberish` |
| `contractAddresses?` | `Addresses` |
| `gasPriceMultiplier?` | `number` |
| `network?` | `string` |
| `signerOrProvider?` | `Signer` \| `providers.Provider` |
| `signersOrProviders?` | `SignersOrProviders` |

___

### <a id="railspatheventfetcher" name="railspatheventfetcher"></a> RailsPathEventFetcher

Ƭ **RailsPathEventFetcher**: `TransferSentEventFetcher` \| `TransferBondedEventFetcher` \| `ClaimPushedEventFetcher` \| `ClaimReaddedEventFetcher` \| `ClaimRemovedEventFetcher` \| `ClaimWithdrawnEventFetcher`

___

### <a id="railspathgetamountoutinput" name="railspathgetamountoutinput"></a> RailsPathGetAmountOutInput

Ƭ **RailsPathGetAmountOutInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |
| `attestedClaimId` | `string` |
| `sourcePool` | `BigNumberish` |

___

### <a id="railspathgetbucketindexinput" name="railspathgetbucketindexinput"></a> RailsPathGetBucketIndexInput

Ƭ **RailsPathGetBucketIndexInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `claimId` | `string` |

___

### <a id="railspathgetbucketinput" name="railspathgetbucketinput"></a> RailsPathGetBucketInput

Ƭ **RailsPathGetBucketInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `index` | `BigNumberish` |

___

### <a id="railspathgetclaiminput" name="railspathgetclaiminput"></a> RailsPathGetClaimInput

Ƭ **RailsPathGetClaimInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `claimId` | `string` |

___

### <a id="railspathgeteventfilterinput" name="railspathgeteventfilterinput"></a> RailsPathGetEventFilterInput

Ƭ **RailsPathGetEventFilterInput**: `TransferSentIndexes` \| `TransferBondedIndexes` \| `ClaimPushedIndexes` \| `ClaimReaddedIndexes` \| `ClaimRemovedIndexes` \| `ClaimWithdrawnIndexes`

___

### <a id="railspathgetnexthopshashinput" name="railspathgetnexthopshashinput"></a> RailsPathGetNextHopsHashInput

Ƭ **RailsPathGetNextHopsHashInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `nextHops` | `HopStructInput`[] |

___

### <a id="railspathgetwithdrawablebalanceinput" name="railspathgetwithdrawablebalanceinput"></a> RailsPathGetWithdrawableBalanceInput

Ƭ **RailsPathGetWithdrawableBalanceInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bonder` | `string` |
| `claimId` | `string` |

___

### <a id="railspathisvalidclaiminput" name="railspathisvalidclaiminput"></a> RailsPathIsValidClaimInput

Ƭ **RailsPathIsValidClaimInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `claimId` | `string` |

___

### <a id="railspathisvalidtransferinput" name="railspathisvalidtransferinput"></a> RailsPathIsValidTransferInput

Ƭ **RailsPathIsValidTransferInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `claimId` | `string` |

___

### <a id="railspathpath" name="railspathpath"></a> RailsPathPath

Ƭ **RailsPathPath**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `string` |
| `counterpartChainId` | `string` |
| `counterpartToken` | `string` |
| `initialReserve` | `BigNumber` |
| `token` | `string` |

___

### <a id="railspathpushclaiminput" name="railspathpushclaiminput"></a> RailsPathPushClaimInput

Ƭ **RailsPathPushClaimInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |
| `attestedClaimId` | `string` |
| `claimId` | `string` |
| `maxBonderFee` | `BigNumberish` |
| `nextHopsHash` | `string` |
| `sourcePool` | `BigNumberish` |
| `to` | `string` |

___

### <a id="railspathreaddclaiminput" name="railspathreaddclaiminput"></a> RailsPathReaddClaimInput

Ƭ **RailsPathReaddClaimInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `claimId` | `string` |
| `transferDataHash` | `string` |

___

### <a id="railspathremoveclaiminput" name="railspathremoveclaiminput"></a> RailsPathRemoveClaimInput

Ƭ **RailsPathRemoveClaimInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `claimId` | `string` |

___

### <a id="railspathsendinput" name="railspathsendinput"></a> RailsPathSendInput

Ƭ **RailsPathSendInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `BigNumberish` |
| `fee` | `BigNumberish` |
| `hops` | `HopStructInput`[] |
| `to` | `string` |

___

### <a id="railspathwithdrawbondsinput" name="railspathwithdrawbondsinput"></a> RailsPathWithdrawBondsInput

Ƭ **RailsPathWithdrawBondsInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `claimId` | `string` |

___

### <a id="railspathwithdrawclaiminput" name="railspathwithdrawclaiminput"></a> RailsPathWithdrawClaimInput

Ƭ **RailsPathWithdrawClaimInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `claimId` | `string` |
| `nextHops` | `HopStructInput`[] |

___

### <a id="readdclaiminput" name="readdclaiminput"></a> ReaddClaimInput

Ƭ **ReaddClaimInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `claimId` | `string` |
| `pathId` | `string` |
| `transferDataHash` | `string` |

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

### <a id="setdefaulttokenfeeinput" name="setdefaulttokenfeeinput"></a> SetDefaultTokenFeeInput

Ƭ **SetDefaultTokenFeeInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fee` | `BigNumberish` |

___

### <a id="setstakingregistryinput" name="setstakingregistryinput"></a> SetStakingRegistryInput

Ƭ **SetStakingRegistryInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `newStakingRegistry` | `string` |

___

### <a id="settokenfeerecipientinput" name="settokenfeerecipientinput"></a> SetTokenFeeRecipientInput

Ƭ **SetTokenFeeRecipientInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `recipient` | `string` |

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

### <a id="stakingregistrygetwithdrawablebalanceinput" name="stakingregistrygetwithdrawablebalanceinput"></a> StakingRegistryGetWithdrawableBalanceInput

Ƭ **StakingRegistryGetWithdrawableBalanceInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
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

### <a id="tokensinput" name="tokensinput"></a> TokensInput

Ƭ **TokensInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `pathId` | `string` |

___

### <a id="transactionreceiptwithevents" name="transactionreceiptwithevents"></a> TransactionReceiptWithEvents

Ƭ **TransactionReceiptWithEvents**: `providers.TransactionReceipt` & \{ `events?`: `EthersEvent`[]  }

___

### <a id="transfer" name="transfer"></a> Transfer

Ƭ **Transfer**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `index` | `BigNumber` |
| `totalSent` | `BigNumber` |

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

### <a id="transferchaininput" name="transferchaininput"></a> TransferChainInput

Ƭ **TransferChainInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `index` | `BigNumberish` |

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
| `claimWithdrawnEvents` | `EthersEventWithDecodedTypes`\<`ClaimWithdrawn`\>[] |
| `state` | [`TransferState`](enums/TransferState.md) |
| `transferBondedEvents` | `EthersEventWithDecodedTypes`\<`TransferBonded`\>[] |
| `transferId` | `string` |
| `transferSentEvent` | `EthersEventWithDecodedTypes`\<`TransferSent`\> \| ``null`` |

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

### <a id="updatedefaulttokenfeeinput" name="updatedefaulttokenfeeinput"></a> UpdateDefaultTokenFeeInput

Ƭ **UpdateDefaultTokenFeeInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fee` | `BigNumberish` |

___

### <a id="updatetokenfeeinput" name="updatetokenfeeinput"></a> UpdateTokenFeeInput

Ƭ **UpdateTokenFeeInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fee` | `BigNumberish` |
| `pathId` | `string` |

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

### <a id="withdrawbondsinput" name="withdrawbondsinput"></a> WithdrawBondsInput

Ƭ **WithdrawBondsInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `claimId` | `string` |
| `pathId` | `string` |

___

### <a id="withdrawclaiminput" name="withdrawclaiminput"></a> WithdrawClaimInput

Ƭ **WithdrawClaimInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `claimId` | `string` |
| `nextHops` | [`HopStructInput`](modules.md#hopstructinput)[] |
| `pathId` | `string` |

___

### <a id="withdrawninput" name="withdrawninput"></a> WithdrawnInput

Ƭ **WithdrawnInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bonder` | `string` |

## Variables

### <a id="utils" name="utils"></a> utils

• `Const` **utils**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `formatUSD` | (`amount`: `string` \| `number`) => `string` |
| `getAddressExplorerUrl` | (`network`: `string`, `chainId`: `string`, `address`: `string`) => `string` |
| `getChainSlug` | (`chainId`: `BigNumberish`) => `string` |
| `getComputedNextHopsHash` | (`nextHops`: [`HopStructInput`](modules.md#hopstructinput)[]) => `string` |
| `getComputedPathId` | (`chainId0`: `BigNumberish`, `token0`: `string`, `chainId1`: `BigNumberish`, `token1`: `string`) => `string` |
| `getComputedTransferDataHash` | (`__namedParameters`: `GetComputedTransferDataHashInput`) => `string` |
| `getComputedTransferId` | (`previousTransferId`: `string`, `transferDataHash`: `string`) => `string` |
| `getExplorerUrl` | (`network`: `string`, `chainId`: `string`) => `string` |
| `getTokenExplorerUrl` | (`network`: `string`, `chainId`: `string`, `address`: `string`) => `string` |
| `getTxHashExplorerUrl` | (`network`: `string`, `chainId`: `string`, `txHash`: `string`) => `string` |
| `isContractError` | (`err`: `unknown`) => `boolean` |

## Functions

### <a id="getblocknumberfromdate" name="getblocknumberfromdate"></a> getBlockNumberFromDate

▸ **getBlockNumberFromDate**(`provider`, `timestamp`, `etherscanApiKey?`): `Promise`\<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `provider` | `Provider` |
| `timestamp` | `number` |
| `etherscanApiKey?` | `string` |

#### Returns

`Promise`\<`number`\>
