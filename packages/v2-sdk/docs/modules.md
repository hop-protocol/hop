# @hop-protocol/v2-sdk

## Table of contents

### Classes

- [Hop](classes/Hop.md)
- [Messenger](classes/Messenger.md)
- [PriceFeed](classes/PriceFeed.md)
- [RailsGateway](classes/RailsGateway.md)

### Interfaces

- [BundleCommitted](interfaces/BundleCommitted.md)
- [BundleForwarded](interfaces/BundleForwarded.md)
- [BundleReceived](interfaces/BundleReceived.md)
- [BundleSet](interfaces/BundleSet.md)
- [FeesSentToHub](interfaces/FeesSentToHub.md)
- [MessageBundled](interfaces/MessageBundled.md)
- [MessageExecuted](interfaces/MessageExecuted.md)
- [MessageSent](interfaces/MessageSent.md)
- [TransferBonded](interfaces/TransferBonded.md)
- [TransferSent](interfaces/TransferSent.md)

### Type Aliases

- [ApproveSendTokensInput](modules.md#approvesendtokensinput)
- [GetEventsInput](modules.md#geteventsinput)
- [GetGeneralEventsInput](modules.md#getgeneraleventsinput)
- [HopConstructorInput](modules.md#hopconstructorinput)
- [SendTokensInput](modules.md#sendtokensinput)
- [TransferBondedEventInput](modules.md#transferbondedeventinput)
- [TransferSentEventInput](modules.md#transfersenteventinput)

## Type Aliases

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
