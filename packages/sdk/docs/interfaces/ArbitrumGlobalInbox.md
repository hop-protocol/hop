# Interface: ArbitrumGlobalInbox

## Hierarchy

- `BaseContract`

  ↳ **`ArbitrumGlobalInbox`**

## Table of contents

### Properties

- [callStatic](ArbitrumGlobalInbox.md#callstatic)
- [estimateGas](ArbitrumGlobalInbox.md#estimategas)
- [filters](ArbitrumGlobalInbox.md#filters)
- [functions](ArbitrumGlobalInbox.md#functions)
- [interface](ArbitrumGlobalInbox.md#interface)
- [off](ArbitrumGlobalInbox.md#off)
- [on](ArbitrumGlobalInbox.md#on)
- [once](ArbitrumGlobalInbox.md#once)
- [populateTransaction](ArbitrumGlobalInbox.md#populatetransaction)
- [removeListener](ArbitrumGlobalInbox.md#removelistener)

### Methods

- [FAILED\_TRANSFER](ArbitrumGlobalInbox.md#failed_transfer)
- [attach](ArbitrumGlobalInbox.md#attach)
- [connect](ArbitrumGlobalInbox.md#connect)
- [deployL2ContractPair](ArbitrumGlobalInbox.md#deployl2contractpair)
- [deployed](ArbitrumGlobalInbox.md#deployed)
- [depositERC20Message](ArbitrumGlobalInbox.md#depositerc20message)
- [depositERC721Message](ArbitrumGlobalInbox.md#depositerc721message)
- [depositEthMessage](ArbitrumGlobalInbox.md#depositethmessage)
- [getERC20Balance](ArbitrumGlobalInbox.md#geterc20balance)
- [getERC721Tokens](ArbitrumGlobalInbox.md#geterc721tokens)
- [getEthBalance](ArbitrumGlobalInbox.md#getethbalance)
- [getInbox](ArbitrumGlobalInbox.md#getinbox)
- [getPaymentOwner](ArbitrumGlobalInbox.md#getpaymentowner)
- [hasERC721](ArbitrumGlobalInbox.md#haserc721)
- [isPairedContract](ArbitrumGlobalInbox.md#ispairedcontract)
- [listeners](ArbitrumGlobalInbox.md#listeners)
- [ownedERC20s](ArbitrumGlobalInbox.md#ownederc20s)
- [ownedERC721s](ArbitrumGlobalInbox.md#ownederc721s)
- [queryFilter](ArbitrumGlobalInbox.md#queryfilter)
- [removeAllListeners](ArbitrumGlobalInbox.md#removealllisteners)
- [sendInitializationMessage](ArbitrumGlobalInbox.md#sendinitializationmessage)
- [sendL2Message](ArbitrumGlobalInbox.md#sendl2message)
- [sendL2MessageFromOrigin](ArbitrumGlobalInbox.md#sendl2messagefromorigin)
- [sendMessages](ArbitrumGlobalInbox.md#sendmessages)
- [transferPayment](ArbitrumGlobalInbox.md#transferpayment)
- [withdrawERC20](ArbitrumGlobalInbox.md#withdrawerc20)
- [withdrawERC721](ArbitrumGlobalInbox.md#withdrawerc721)
- [withdrawEth](ArbitrumGlobalInbox.md#withdraweth)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `FAILED_TRANSFER` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `deployL2ContractPair` | (`chain`: `PromiseOrValue`\<`string`\>, `maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `payment`: `PromiseOrValue`\<`BigNumberish`\>, `contractData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `depositERC20Message` | (`chain`: `PromiseOrValue`\<`string`\>, `erc20`: `PromiseOrValue`\<`string`\>, `to`: `PromiseOrValue`\<`string`\>, `value`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `depositERC721Message` | (`chain`: `PromiseOrValue`\<`string`\>, `erc721`: `PromiseOrValue`\<`string`\>, `to`: `PromiseOrValue`\<`string`\>, `id`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `depositEthMessage` | (`chain`: `PromiseOrValue`\<`string`\>, `to`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `getERC20Balance` | (`_tokenContract`: `PromiseOrValue`\<`string`\>, `_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getERC721Tokens` | (`_erc721`: `PromiseOrValue`\<`string`\>, `_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`[]\> |
| `getEthBalance` | (`_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getInbox` | (`account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`, `BigNumber`]\> |
| `getPaymentOwner` | (`originalOwner`: `PromiseOrValue`\<`string`\>, `messageIndex`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `hasERC721` | (`_erc721`: `PromiseOrValue`\<`string`\>, `_owner`: `PromiseOrValue`\<`string`\>, `_tokenId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `isPairedContract` | (`_tokenContract`: `PromiseOrValue`\<`string`\>, `_chain`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`number`\> |
| `ownedERC20s` | (`_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`[]\> |
| `ownedERC721s` | (`_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`[]\> |
| `sendInitializationMessage` | (`messageData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `sendL2Message` | (`chain`: `PromiseOrValue`\<`string`\>, `messageData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `sendL2MessageFromOrigin` | (`chain`: `PromiseOrValue`\<`string`\>, `messageData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `sendMessages` | (`messages`: `PromiseOrValue`\<`BytesLike`\>, `initialMaxSendCount`: `PromiseOrValue`\<`BigNumberish`\>, `finalMaxSendCount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `transferPayment` | (`originalOwner`: `PromiseOrValue`\<`string`\>, `newOwner`: `PromiseOrValue`\<`string`\>, `messageIndex`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `withdrawERC20` | (`_tokenContract`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `withdrawERC721` | (`_erc721`: `PromiseOrValue`\<`string`\>, `_tokenId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `withdrawEth` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `FAILED_TRANSFER` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `deployL2ContractPair` | (`chain`: `PromiseOrValue`\<`string`\>, `maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `payment`: `PromiseOrValue`\<`BigNumberish`\>, `contractData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `depositERC20Message` | (`chain`: `PromiseOrValue`\<`string`\>, `erc20`: `PromiseOrValue`\<`string`\>, `to`: `PromiseOrValue`\<`string`\>, `value`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `depositERC721Message` | (`chain`: `PromiseOrValue`\<`string`\>, `erc721`: `PromiseOrValue`\<`string`\>, `to`: `PromiseOrValue`\<`string`\>, `id`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `depositEthMessage` | (`chain`: `PromiseOrValue`\<`string`\>, `to`: `PromiseOrValue`\<`string`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `getERC20Balance` | (`_tokenContract`: `PromiseOrValue`\<`string`\>, `_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getERC721Tokens` | (`_erc721`: `PromiseOrValue`\<`string`\>, `_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getEthBalance` | (`_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getInbox` | (`account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getPaymentOwner` | (`originalOwner`: `PromiseOrValue`\<`string`\>, `messageIndex`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `hasERC721` | (`_erc721`: `PromiseOrValue`\<`string`\>, `_owner`: `PromiseOrValue`\<`string`\>, `_tokenId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `isPairedContract` | (`_tokenContract`: `PromiseOrValue`\<`string`\>, `_chain`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `ownedERC20s` | (`_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `ownedERC721s` | (`_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `sendInitializationMessage` | (`messageData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `sendL2Message` | (`chain`: `PromiseOrValue`\<`string`\>, `messageData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `sendL2MessageFromOrigin` | (`chain`: `PromiseOrValue`\<`string`\>, `messageData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `sendMessages` | (`messages`: `PromiseOrValue`\<`BytesLike`\>, `initialMaxSendCount`: `PromiseOrValue`\<`BigNumberish`\>, `finalMaxSendCount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `transferPayment` | (`originalOwner`: `PromiseOrValue`\<`string`\>, `newOwner`: `PromiseOrValue`\<`string`\>, `messageIndex`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `withdrawERC20` | (`_tokenContract`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `withdrawERC721` | (`_erc721`: `PromiseOrValue`\<`string`\>, `_tokenId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `withdrawEth` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `BuddyContractDeployed` | (`sender?`: ``null`` \| `PromiseOrValue`\<`string`\>, `data?`: ``null``) => `BuddyContractDeployedEventFilter` |
| `BuddyContractDeployed(address,bytes)` | (`sender?`: ``null`` \| `PromiseOrValue`\<`string`\>, `data?`: ``null``) => `BuddyContractDeployedEventFilter` |
| `BuddyContractPair` | (`sender?`: ``null`` \| `PromiseOrValue`\<`string`\>, `data?`: ``null``) => `BuddyContractPairEventFilter` |
| `BuddyContractPair(address,address)` | (`sender?`: ``null`` \| `PromiseOrValue`\<`string`\>, `data?`: ``null``) => `BuddyContractPairEventFilter` |
| `MessageDelivered` | (`chain?`: ``null`` \| `PromiseOrValue`\<`string`\>, `kind?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `sender?`: ``null`` \| `PromiseOrValue`\<`string`\>, `inboxSeqNum?`: ``null``, `data?`: ``null``) => `MessageDeliveredEventFilter` |
| `MessageDelivered(address,uint8,address,uint256,bytes)` | (`chain?`: ``null`` \| `PromiseOrValue`\<`string`\>, `kind?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `sender?`: ``null`` \| `PromiseOrValue`\<`string`\>, `inboxSeqNum?`: ``null``, `data?`: ``null``) => `MessageDeliveredEventFilter` |
| `MessageDeliveredFromOrigin` | (`chain?`: ``null`` \| `PromiseOrValue`\<`string`\>, `kind?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `sender?`: ``null`` \| `PromiseOrValue`\<`string`\>, `inboxSeqNum?`: ``null``) => `MessageDeliveredFromOriginEventFilter` |
| `MessageDeliveredFromOrigin(address,uint8,address,uint256)` | (`chain?`: ``null`` \| `PromiseOrValue`\<`string`\>, `kind?`: ``null`` \| `PromiseOrValue`\<`BigNumberish`\>, `sender?`: ``null`` \| `PromiseOrValue`\<`string`\>, `inboxSeqNum?`: ``null``) => `MessageDeliveredFromOriginEventFilter` |
| `PaymentTransfer` | (`messageIndex?`: ``null``, `originalOwner?`: ``null``, `prevOwner?`: ``null``, `newOwner?`: ``null``) => `PaymentTransferEventFilter` |
| `PaymentTransfer(uint256,address,address,address)` | (`messageIndex?`: ``null``, `originalOwner?`: ``null``, `prevOwner?`: ``null``, `newOwner?`: ``null``) => `PaymentTransferEventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `FAILED_TRANSFER` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `deployL2ContractPair` | (`chain`: `PromiseOrValue`\<`string`\>, `maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `payment`: `PromiseOrValue`\<`BigNumberish`\>, `contractData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `depositERC20Message` | (`chain`: `PromiseOrValue`\<`string`\>, `erc20`: `PromiseOrValue`\<`string`\>, `to`: `PromiseOrValue`\<`string`\>, `value`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `depositERC721Message` | (`chain`: `PromiseOrValue`\<`string`\>, `erc721`: `PromiseOrValue`\<`string`\>, `to`: `PromiseOrValue`\<`string`\>, `id`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `depositEthMessage` | (`chain`: `PromiseOrValue`\<`string`\>, `to`: `PromiseOrValue`\<`string`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `getERC20Balance` | (`_tokenContract`: `PromiseOrValue`\<`string`\>, `_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getERC721Tokens` | (`_erc721`: `PromiseOrValue`\<`string`\>, `_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`[]]\> |
| `getEthBalance` | (`_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getInbox` | (`account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`, `BigNumber`]\> |
| `getPaymentOwner` | (`originalOwner`: `PromiseOrValue`\<`string`\>, `messageIndex`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `hasERC721` | (`_erc721`: `PromiseOrValue`\<`string`\>, `_owner`: `PromiseOrValue`\<`string`\>, `_tokenId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `isPairedContract` | (`_tokenContract`: `PromiseOrValue`\<`string`\>, `_chain`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`number`]\> |
| `ownedERC20s` | (`_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`[]]\> |
| `ownedERC721s` | (`_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`[]]\> |
| `sendInitializationMessage` | (`messageData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `sendL2Message` | (`chain`: `PromiseOrValue`\<`string`\>, `messageData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `sendL2MessageFromOrigin` | (`chain`: `PromiseOrValue`\<`string`\>, `messageData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `sendMessages` | (`messages`: `PromiseOrValue`\<`BytesLike`\>, `initialMaxSendCount`: `PromiseOrValue`\<`BigNumberish`\>, `finalMaxSendCount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `transferPayment` | (`originalOwner`: `PromiseOrValue`\<`string`\>, `newOwner`: `PromiseOrValue`\<`string`\>, `messageIndex`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `withdrawERC20` | (`_tokenContract`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `withdrawERC721` | (`_erc721`: `PromiseOrValue`\<`string`\>, `_tokenId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `withdrawEth` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `ArbitrumGlobalInboxInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`ArbitrumGlobalInbox`](ArbitrumGlobalInbox.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`ArbitrumGlobalInbox`](ArbitrumGlobalInbox.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`ArbitrumGlobalInbox`](ArbitrumGlobalInbox.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `FAILED_TRANSFER` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `deployL2ContractPair` | (`chain`: `PromiseOrValue`\<`string`\>, `maxGas`: `PromiseOrValue`\<`BigNumberish`\>, `gasPriceBid`: `PromiseOrValue`\<`BigNumberish`\>, `payment`: `PromiseOrValue`\<`BigNumberish`\>, `contractData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `depositERC20Message` | (`chain`: `PromiseOrValue`\<`string`\>, `erc20`: `PromiseOrValue`\<`string`\>, `to`: `PromiseOrValue`\<`string`\>, `value`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `depositERC721Message` | (`chain`: `PromiseOrValue`\<`string`\>, `erc721`: `PromiseOrValue`\<`string`\>, `to`: `PromiseOrValue`\<`string`\>, `id`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `depositEthMessage` | (`chain`: `PromiseOrValue`\<`string`\>, `to`: `PromiseOrValue`\<`string`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `getERC20Balance` | (`_tokenContract`: `PromiseOrValue`\<`string`\>, `_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getERC721Tokens` | (`_erc721`: `PromiseOrValue`\<`string`\>, `_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getEthBalance` | (`_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getInbox` | (`account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getPaymentOwner` | (`originalOwner`: `PromiseOrValue`\<`string`\>, `messageIndex`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `hasERC721` | (`_erc721`: `PromiseOrValue`\<`string`\>, `_owner`: `PromiseOrValue`\<`string`\>, `_tokenId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `isPairedContract` | (`_tokenContract`: `PromiseOrValue`\<`string`\>, `_chain`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `ownedERC20s` | (`_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `ownedERC721s` | (`_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `sendInitializationMessage` | (`messageData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `sendL2Message` | (`chain`: `PromiseOrValue`\<`string`\>, `messageData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `sendL2MessageFromOrigin` | (`chain`: `PromiseOrValue`\<`string`\>, `messageData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `sendMessages` | (`messages`: `PromiseOrValue`\<`BytesLike`\>, `initialMaxSendCount`: `PromiseOrValue`\<`BigNumberish`\>, `finalMaxSendCount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `transferPayment` | (`originalOwner`: `PromiseOrValue`\<`string`\>, `newOwner`: `PromiseOrValue`\<`string`\>, `messageIndex`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `withdrawERC20` | (`_tokenContract`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `withdrawERC721` | (`_erc721`: `PromiseOrValue`\<`string`\>, `_tokenId`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `withdrawEth` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`ArbitrumGlobalInbox`](ArbitrumGlobalInbox.md)\>

#### Overrides

BaseContract.removeListener

## Methods

### <a id="failed_transfer" name="failed_transfer"></a> FAILED\_TRANSFER

▸ **FAILED_TRANSFER**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

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

### <a id="deployl2contractpair" name="deployl2contractpair"></a> deployL2ContractPair

▸ **deployL2ContractPair**(`chain`, `maxGas`, `gasPriceBid`, `payment`, `contractData`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | `PromiseOrValue`\<`string`\> |
| `maxGas` | `PromiseOrValue`\<`BigNumberish`\> |
| `gasPriceBid` | `PromiseOrValue`\<`BigNumberish`\> |
| `payment` | `PromiseOrValue`\<`BigNumberish`\> |
| `contractData` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="deployed" name="deployed"></a> deployed

▸ **deployed**(): `Promise`\<[`ArbitrumGlobalInbox`](ArbitrumGlobalInbox.md)\>

#### Returns

`Promise`\<[`ArbitrumGlobalInbox`](ArbitrumGlobalInbox.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="depositerc20message" name="depositerc20message"></a> depositERC20Message

▸ **depositERC20Message**(`chain`, `erc20`, `to`, `value`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | `PromiseOrValue`\<`string`\> |
| `erc20` | `PromiseOrValue`\<`string`\> |
| `to` | `PromiseOrValue`\<`string`\> |
| `value` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="depositerc721message" name="depositerc721message"></a> depositERC721Message

▸ **depositERC721Message**(`chain`, `erc721`, `to`, `id`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | `PromiseOrValue`\<`string`\> |
| `erc721` | `PromiseOrValue`\<`string`\> |
| `to` | `PromiseOrValue`\<`string`\> |
| `id` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="depositethmessage" name="depositethmessage"></a> depositEthMessage

▸ **depositEthMessage**(`chain`, `to`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | `PromiseOrValue`\<`string`\> |
| `to` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="geterc20balance" name="geterc20balance"></a> getERC20Balance

▸ **getERC20Balance**(`_tokenContract`, `_owner`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_tokenContract` | `PromiseOrValue`\<`string`\> |
| `_owner` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="geterc721tokens" name="geterc721tokens"></a> getERC721Tokens

▸ **getERC721Tokens**(`_erc721`, `_owner`, `overrides?`): `Promise`\<`BigNumber`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_erc721` | `PromiseOrValue`\<`string`\> |
| `_owner` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`[]\>

___

### <a id="getethbalance" name="getethbalance"></a> getEthBalance

▸ **getEthBalance**(`_owner`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_owner` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getinbox" name="getinbox"></a> getInbox

▸ **getInbox**(`account`, `overrides?`): `Promise`\<[`string`, `BigNumber`]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `account` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<[`string`, `BigNumber`]\>

___

### <a id="getpaymentowner" name="getpaymentowner"></a> getPaymentOwner

▸ **getPaymentOwner**(`originalOwner`, `messageIndex`, `overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `originalOwner` | `PromiseOrValue`\<`string`\> |
| `messageIndex` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="haserc721" name="haserc721"></a> hasERC721

▸ **hasERC721**(`_erc721`, `_owner`, `_tokenId`, `overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_erc721` | `PromiseOrValue`\<`string`\> |
| `_owner` | `PromiseOrValue`\<`string`\> |
| `_tokenId` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="ispairedcontract" name="ispairedcontract"></a> isPairedContract

▸ **isPairedContract**(`_tokenContract`, `_chain`, `overrides?`): `Promise`\<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_tokenContract` | `PromiseOrValue`\<`string`\> |
| `_chain` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`number`\>

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

### <a id="ownederc20s" name="ownederc20s"></a> ownedERC20s

▸ **ownedERC20s**(`_owner`, `overrides?`): `Promise`\<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_owner` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`[]\>

___

### <a id="ownederc721s" name="ownederc721s"></a> ownedERC721s

▸ **ownedERC721s**(`_owner`, `overrides?`): `Promise`\<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_owner` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`[]\>

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

### <a id="sendinitializationmessage" name="sendinitializationmessage"></a> sendInitializationMessage

▸ **sendInitializationMessage**(`messageData`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `messageData` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="sendl2message" name="sendl2message"></a> sendL2Message

▸ **sendL2Message**(`chain`, `messageData`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | `PromiseOrValue`\<`string`\> |
| `messageData` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="sendl2messagefromorigin" name="sendl2messagefromorigin"></a> sendL2MessageFromOrigin

▸ **sendL2MessageFromOrigin**(`chain`, `messageData`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | `PromiseOrValue`\<`string`\> |
| `messageData` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="sendmessages" name="sendmessages"></a> sendMessages

▸ **sendMessages**(`messages`, `initialMaxSendCount`, `finalMaxSendCount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `messages` | `PromiseOrValue`\<`BytesLike`\> |
| `initialMaxSendCount` | `PromiseOrValue`\<`BigNumberish`\> |
| `finalMaxSendCount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="transferpayment" name="transferpayment"></a> transferPayment

▸ **transferPayment**(`originalOwner`, `newOwner`, `messageIndex`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `originalOwner` | `PromiseOrValue`\<`string`\> |
| `newOwner` | `PromiseOrValue`\<`string`\> |
| `messageIndex` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="withdrawerc20" name="withdrawerc20"></a> withdrawERC20

▸ **withdrawERC20**(`_tokenContract`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_tokenContract` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="withdrawerc721" name="withdrawerc721"></a> withdrawERC721

▸ **withdrawERC721**(`_erc721`, `_tokenId`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_erc721` | `PromiseOrValue`\<`string`\> |
| `_tokenId` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="withdraweth" name="withdraweth"></a> withdrawEth

▸ **withdrawEth**(`overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>
