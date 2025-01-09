# @hop-protocol/v2-explorer-backend

> Hop Protocol V2 Explorer Backend

## Development

Install dependencies

```bash
npm install
```

Run worker

```bash
npm start
```

## Test

```bash
npm test
```

## Documentation

### API

Base URL for the API:

```
https://v2-explorer-api-sepolia.hop.exchange
```

### Endpoints

## GET /v1/tokens

> Retrieve a list of supported tokens and their details.

**Response:**

| Parameters           | Description                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| `chainId`            | (string) The chain ID where the token resides.                                                  |
| `address`            | (string) The contract address of the token.                                                     |
| `name`               | (string) The name of the token.                                                                 |
| `symbol`             | (string) The symbol representing the token.                                                     |
| `decimals`           | (number) The number of decimals the token uses.                                                 |
| `tokenExplorerUrl`   | (string) The URL to the token's explorer page.                                                   |
| `addressTruncated`   | (string) A truncated version of the token's address.                                            |
| `chainName`          | (string) The name of the chain where the token resides.                                         |
| `chainLabel`         | (string) A user-friendly label for the chain where the token resides.                           |

---

### Example Request:

```bash
curl "https://v2-explorer-api-sepolia.hop.exchange/v1/tokens"
```

### Example Response:

```json
{
  "tokens": [
    {
      "chainId": "1",
      "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "name": "USD Coin",
      "symbol": "USDC",
      "decimals": 6,
      "tokenExplorerUrl": "https://etherscan.io/token/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "addressTruncated": "0xA0b...eB48",
      "chainName": "Ethereum",
      "chainLabel": "Ethereum - Sepolia"
    }
  ]
}
```

## GET /v1/prices

> Retrieve the latest prices for supported tokens.

---

### Response:

| Parameters           | Description                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| `prices`             | An array of price objects containing the following fields:                                      |
| `token`              | (string) The symbol of the token (e.g., `USDC`, `ETH`).                                         |
| `priceUsd`           | (number) The price of the token in USD.                                                         |
| `timestamp`          | (number) The UNIX timestamp when the price was recorded.                                        |
| `priceUsdDisplay`    | (string) The price of the token in USD, formatted for display.                                  |
| `timestampRelative`  | (string) A relative time representation of the timestamp (e.g., `5 minutes ago`).               |

---

### Example Request:

```bash
curl "https://v2-explorer-api-sepolia.hop.exchange/v1/prices"
```

### Example Response:

```json
{
  "prices": [
    {
      "token": "USDC",
      "priceUsd": 1.0,
      "timestamp": 1679862208,
      "priceUsdDisplay": "$1.00",
      "timestampRelative": "5 minutes ago"
    },
    {
      "token": "ETH",
      "priceUsd": 1800.25,
      "timestamp": 1679862100,
      "priceUsdDisplay": "$1,800.25",
      "timestampRelative": "10 minutes ago"
    }
  ]
}
```

## GET /v1/paths

> Retrieve available paths for token transfers across supported chains.

---

### Response:

| Parameters                      | Description                                                                                     |
| ------------------------------- | ----------------------------------------------------------------------------------------------- |
| `pathId`                        | (string) The unique identifier for the path.                                                   |
| `chainId`                       | (string) The chain ID where the token resides.                                                  |
| `token`                         | (string) The contract address of the token.                                                    |
| `tokenName`                     | (string) The name of the token.                                                                 |
| `tokenSymbol`                   | (string) The symbol representing the token.                                                    |
| `tokenDecimals`                 | (number) The number of decimals the token uses.                                                |
| `counterpartToken`              | (string) The contract address of the counterpart token.                                         |
| `counterpartTokenName`          | (string) The name of the counterpart token.                                                    |
| `counterpartTokenSymbol`        | (string) The symbol of the counterpart token.                                                  |
| `counterpartTokenDecimals`      | (number) The number of decimals the counterpart token uses.                                     |
| `counterpartChainId`            | (string) The chain ID of the counterpart chain.                                                |
| `pathIdTruncated`               | (string) A truncated version of the path ID.                                                   |
| `tokenExplorerUrl`              | (string) The URL to the token's explorer page.                                                 |
| `tokenTruncated`                | (string) A truncated version of the token's address.                                           |
| `counterpartTokenExplorerUrl`   | (string) The URL to the counterpart token's explorer page.                                      |
| `counterpartTokenTruncated`     | (string) A truncated version of the counterpart token's address.                               |
| `chainName`                     | (string) The name of the chain where the token resides.                                         |
| `chainLabel`                    | (string) A user-friendly label for the chain where the token resides.                          |
| `counterpartChainName`          | (string) The name of the counterpart chain.                                                    |
| `counterpartChainLabel`         | (string) A user-friendly label for the counterpart chain.                                      |

---

### Example Request:

```bash
curl "https://v2-explorer-api-sepolia.hop.exchange/v1/paths"
```

### Example Response:

```json
{
  "paths": [
    {
      "pathId": "0x...1",
      "chainId": "1",
      "token": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "tokenName": "USD Coin",
      "tokenSymbol": "USDC",
      "tokenDecimals": 6,
      "counterpartToken": "0x1234567890abcdef1234567890abcdef12345678",
      "counterpartTokenName": "Wrapped USD Coin",
      "counterpartTokenSymbol": "WUSDC",
      "counterpartTokenDecimals": 6,
      "counterpartChainId": "2",
      "pathIdTruncated": "0x...1",
      "tokenExplorerUrl": "https://etherscan.io/token/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "tokenTruncated": "0xA0b...eB48",
      "counterpartTokenExplorerUrl": "https://etherscan.io/token/0x1234567890abcdef1234567890abcdef12345678",
      "counterpartTokenTruncated": "0x123...5678",
      "chainName": "Ethereum",
      "chainLabel": "ETH",
      "counterpartChainName": "Polygon",
      "counterpartChainLabel": "MATIC"
    }
  ]
}
```

## GET /v1/events - TransferSent

> Retrieve `TransferSent` events, including details about transfers and their hops.

---

### Response:

| Parameters                      | Description                                                                                     |
| ------------------------------- | ----------------------------------------------------------------------------------------------- |
| `events`                        | An array of event objects containing the following fields:                                      |
| `pathId`                        | (string) The unique identifier for the path.                                                   |
| `transferId`                    | (string) The unique identifier for the transfer.                                               |
| `to`                            | (string) The recipient address.                                                                |
| `amountOut`                     | (string) The amount received by the recipient.                                                 |
| `totalSent`                     | (string) The total amount sent in the transfer.                                                |
| `totalClaims`                   | (string) The total amount claimed in the transfer.                                             |
| `hops`                          | An array of hop objects (details below).                                                       |
| `transferIdTruncated`           | (string) A truncated version of the transfer ID.                                               |
| `transferIdExplorerUrl`         | (string) The URL to the transfer's explorer page.                                              |
| `pathIdTruncated`               | (string) A truncated version of the path ID.                                                   |
| `toTruncated`                   | (string) A truncated version of the recipient address.                                         |
| `context`                       | (object) Context information associated with the event.                                        |

**Hop Object Fields:**

| Parameters                      | Description                                                                                     |
| ------------------------------- | ----------------------------------------------------------------------------------------------- |
| `index`                         | (number) The index of the hop in the transfer path.                                             |
| `pathId`                        | (string) The unique identifier for the path of the hop.                                         |
| `maxBonderFee`                  | (string) The maximum bonder fee for the hop.                                                    |
| `maxTotalSent`                  | (string) The maximum total sent for the hop.                                                   |
| `attestedClaimId`               | (string) The claim ID associated with the hop.                                                 |
| `pathIdTruncated`               | (string) A truncated version of the path ID.                                                   |
| `attestedClaimIdTruncated`      | (string) A truncated version of the attested claim ID.                                          |

---

### Example Request:

```bash
curl "https://v2-explorer-api-sepolia.hop.exchange/v1/events?type=TransferSent"
```

### Example Response:

```json
{
  "events": [
    {
      "pathId": "0x...1",
      "transferId": "0x...1",
      "to": "0x1234567890abcdef1234567890abcdef12345678",
      "amountOut": "1000000",
      "totalSent": "1100000",
      "totalClaims": "900000",
      "hops": [
        {
          "index": 0,
          "pathId": "0x...1",
          "maxBonderFee": "50000",
          "maxTotalSent": "1100000",
          "attestedClaimId": "0x...1",
          "pathIdTruncated": "0x...1",
          "attestedClaimIdTruncated": "0x...1"
        }
      ],
      "transferIdTruncated": "0x...1",
      "transferIdExplorerUrl": "https://etherscan.io/tx/0x...",
      "pathIdTruncated": "0x...1",
      "toTruncated": "0x123...5678",
      "context": {
        "key": "value"
      }
    }
  ]
}
```

## GET /v1/events - TransferBonded

> Retrieve `TransferBonded` events, including details about bonded transfers.

---

### Response:

| Parameters                      | Description                                                                                     |
| ------------------------------- | ----------------------------------------------------------------------------------------------- |
| `events`                        | An array of event objects containing the following fields:                                      |
| `pathId`                        | (string) The unique identifier for the path.                                                   |
| `claimId`                       | (string) The unique identifier for the claim.                                                  |
| `to`                            | (string) The recipient address.                                                                |
| `amount`                        | (string) The amount being transferred.                                                         |
| `bonderFee`                     | (string) The bonder fee for the transfer.                                                      |
| `claimIdTruncated`              | (string) A truncated version of the claim ID.                                                  |
| `claimIdExplorerUrl`            | (string) The URL to the claim's explorer page.                                                 |
| `pathIdTruncated`               | (string) A truncated version of the path ID.                                                   |
| `toTruncated`                   | (string) A truncated version of the recipient address.                                         |
| `context`                       | (object) Context information associated with the event.                                        |

---

### Example Request:

```bash
curl "https://v2-explorer-api-sepolia.hop.exchange/v1/events?type=TransferBonded"
```

### Example Response:

```json
{
  "events": [
    {
      "pathId": "0x...2",
      "claimId": "0x...2",
      "to": "0x1234567890abcdef1234567890abcdef12345678",
      "amount": "500000",
      "bonderFee": "10000",
      "claimIdTruncated": "0x...2",
      "claimIdExplorerUrl": "https://etherscan.io/tx/0x...",
      "pathIdTruncated": "0x...2",
      "toTruncated": "0x123...5678",
      "context": {
        "key": "value"
      }
    }
  ]
}
```

## GET /v1/events - ClaimPosted

> Retrieve `ClaimPosted` events, including details about claims and their paths.

---

### Response:

| Parameters                      | Description                                                                                     |
| ------------------------------- | ----------------------------------------------------------------------------------------------- |
| `events`                        | An array of event objects containing the following fields:                                      |
| `pathId`                        | (string) The unique identifier for the path.                                                   |
| `claimId`                       | (string) The unique identifier for the claim.                                                  |
| `claimIdTruncated`              | (string) A truncated version of the claim ID.                                                  |
| `claimIdExplorerUrl`            | (string) The URL to the claim's explorer page.                                                 |
| `pathIdTruncated`               | (string) A truncated version of the path ID.                                                   |
| `context`                       | (object) Context information associated with the event.                                        |

---

### Example Request:

```bash
curl "https://v2-explorer-api-sepolia.hop.exchange/v1/events?type=ClaimPosted"
```

### Example Response:

```json
{
  "events": [
    {
      "pathId": "0x...3",
      "claimId": "0x...3",
      "claimIdTruncated": "0x...3",
      "claimIdExplorerUrl": "https://etherscan.io/tx/0x...",
      "pathIdTruncated": "0x...3",
      "context": {
        "key": "value"
      }
    }
  ]
}
```

## GET /v1/events - ClaimChainUpdated

> Retrieve `ClaimChainUpdated` events, including details about updated claim chains.

---

### Response:

| Parameters                      | Description                                                                                     |
| ------------------------------- | ----------------------------------------------------------------------------------------------- |
| `events`                        | An array of event objects containing the following fields:                                      |
| `pathId`                        | (string) The unique identifier for the path.                                                   |
| `headClaimId`                   | (string) The unique identifier for the head claim in the chain.                                |
| `length`                        | (string) The length of the claim chain.                                                        |
| `headClaimIdTruncated`          | (string) A truncated version of the head claim ID.                                             |
| `headClaimIdExplorerUrl`        | (string) The URL to the head claim's explorer page.                                             |
| `pathIdTruncated`               | (string) A truncated version of the path ID.                                                   |
| `context`                       | (object) Context information associated with the event.                                        |

---

### Example Request:

```bash
curl "https://v2-explorer-api-sepolia.hop.exchange/v1/events?type=ClaimChainUpdated"
```

### Example Response:

```json
{
  "events": [
    {
      "pathId": "0x...4",
      "headClaimId": "0x...4",
      "length": "5",
      "headClaimIdTruncated": "0x...4",
      "headClaimIdExplorerUrl": "https://etherscan.io/tx/0x...",
      "pathIdTruncated": "0x...4",
      "context": {
        "key": "value"
      }
    }
  ]
}
```

## GET /v1/events - BonderPreference

> Retrieve `BonderPreference` events, including details about bonder preferences such as fee tiers and liquidity.

---

### Response:

| Parameters                      | Description                                                                                     |
| ------------------------------- | ----------------------------------------------------------------------------------------------- |
| `events`                        | An array of event objects containing the following fields:                                      |
| `pathId`                        | (string) The unique identifier for the path.                                                   |
| `bonder`                        | (string) The address of the bonder.                                                            |
| `feeTier`                       | (string) The fee tier associated with the bonder.                                              |
| `liquidity`                     | (string) The liquidity available for the bonder.                                               |
| `pathIdTruncated`               | (string) A truncated version of the path ID.                                                   |
| `bonderTruncated`               | (string) A truncated version of the bonder's address.                                          |
| `context`                       | (object) Context information associated with the event.                                        |

---

### Example Request:

```bash
curl "https://v2-explorer-api-sepolia.hop.exchange/v1/events?type=BonderPreference"
```

### Example Response:

```json
{
  "events": [
    {
      "pathId": "0x...5",
      "bonder": "0x1234567890abcdef1234567890abcdef12345678",
      "feeTier": "1",
      "liquidity": "1000000",
      "pathIdTruncated": "0x...5",
      "bonderTruncated": "0x123...5678",
      "context": {
        "key": "value"
      }
    }
  ]
}
```

## GET /v1/events - MessageSent

> Retrieve `MessageSent` events, including details about messages sent across chains.

---

### Response:

| Parameters                      | Description                                                                                     |
| ------------------------------- | ----------------------------------------------------------------------------------------------- |
| `events`                        | An array of event objects containing the following fields:                                      |
| `messageId`                     | (string) The unique identifier for the message.                                                |
| `from`                          | (string) The sender's address.                                                                 |
| `toChainId`                     | (string) The ID of the destination chain.                                                      |
| `to`                            | (string) The recipient's address.                                                              |
| `data`                          | (string) The data included in the message.                                                     |
| `messageIdTruncated`            | (string) A truncated version of the message ID.                                                |
| `fromTruncated`                 | (string) A truncated version of the sender's address.                                          |
| `toTruncated`                   | (string) A truncated version of the recipient's address.                                       |
| `toExplorerUrl`                 | (string) The URL to the recipient's explorer page.                                             |
| `toChainLabel`                  | (string) A user-friendly label for the destination chain.                                      |
| `toChainImageUrl`               | (string) The URL to an image representing the destination chain.                               |
| `toChainColor`                  | (string) The color associated with the destination chain for visual representation.            |
| `context`                       | (object) Context information associated with the event.                                        |

---

### Example Request:

```bash
curl "https://v2-explorer-api-sepolia.hop.exchange/v1/events?type=MessageSent"
```

### Example Response:

```json
{
  "events": [
    {
      "messageId": "0x...6",
      "from": "0x1234567890abcdef1234567890abcdef12345678",
      "toChainId": "2",
      "to": "0xabcdef1234567890abcdef1234567890abcdef12",
      "data": "Some message data",
      "messageIdTruncated": "0x...6",
      "fromTruncated": "0x123...5678",
      "toTruncated": "0xabc...ef12",
      "toExplorerUrl": "https://etherscan.io/address/0xabcdef1234567890abcdef1234567890abcdef12",
      "toChainLabel": "Polygon",
      "toChainImageUrl": "https://example.com/images/polygon.png",
      "toChainColor": "#8247E5",
      "context": {
        "key": "value"
      }
    }
  ]
}
```

## GET /v1/events - MessageExecuted

> Retrieve `MessageExecuted` events, including details about executed messages and their originating chains.

---

### Response:

| Parameters                      | Description                                                                                     |
| ------------------------------- | ----------------------------------------------------------------------------------------------- |
| `events`                        | An array of event objects containing the following fields:                                      |
| `messageId`                     | (string) The unique identifier for the executed message.                                       |
| `fromChainId`                   | (string) The ID of the originating chain.                                                      |
| `messageIdTruncated`            | (string) A truncated version of the message ID.                                                |
| `fromChainLabel`                | (string) A user-friendly label for the originating chain.                                      |
| `fromChainImageUrl`             | (string) The URL to an image representing the originating chain.                               |
| `context`                       | (object) Context information associated with the event.                                        |

---

### Example Request:

```bash
curl "https://v2-explorer-api-sepolia.hop.exchange/v1/events?type=MessageExecuted"
```

### Example Response:

```json
{
  "events": [
    {
      "messageId": "0x...7",
      "fromChainId": "1",
      "messageIdTruncated": "0x...7",
      "fromChainLabel": "Ethereum",
      "fromChainImageUrl": "https://example.com/images/ethereum.png",
      "context": {
        "key": "value"
      }
    }
  ]
}
```

## GET /v1/events - MessageBundled

> Retrieve `MessageBundled` events, including details about messages bundled into a tree structure.

---

### Response:

| Parameters                      | Description                                                                                     |
| ------------------------------- | ----------------------------------------------------------------------------------------------- |
| `events`                        | An array of event objects containing the following fields:                                      |
| `messageId`                     | (string) The unique identifier for the message.                                                |
| `bundleId`                      | (string) The unique identifier for the bundle containing the message.                         |
| `treeIndex`                     | (number) The index of the message within the tree structure.                                    |
| `messageIdTruncated`            | (string) A truncated version of the message ID.                                                |
| `bundleIdTruncated`             | (string) A truncated version of the bundle ID.                                                 |
| `context`                       | (object) Context information associated with the event.                                        |

---

### Example Request:

```bash
curl "https://v2-explorer-api-sepolia.hop.exchange/v1/events?type=MessageBundled"
```

### Example Response:

```json
{
  "events": [
    {
      "messageId": "0x...8",
      "bundleId": "0x...9",
      "treeIndex": 3,
      "messageIdTruncated": "0x...8",
      "bundleIdTruncated": "0x...9",
      "context": {
        "key": "value"
      }
    }
  ]
}
```

## GET /v1/events - BundleSet

> Retrieve `BundleSet` events, including details about bundles and their originating chains.

---

### Response:

| Parameters                      | Description                                                                                     |
| ------------------------------- | ----------------------------------------------------------------------------------------------- |
| `events`                        | An array of event objects containing the following fields:                                      |
| `bundleId`                      | (string) The unique identifier for the bundle.                                                 |
| `bundleRoot`                    | (string) The root hash of the bundle.                                                          |
| `fromChainId`                   | (string) The ID of the originating chain.                                                      |
| `bundleIdTruncated`             | (string) A truncated version of the bundle ID.                                                 |
| `bundleRootTruncated`           | (string) A truncated version of the bundle root.                                               |
| `fromChainLabel`                | (string) A user-friendly label for the originating chain.                                      |
| `fromChainImageUrl`             | (string) The URL to an image representing the originating chain.                               |
| `context`                       | (object) Context information associated with the event.                                        |

---

### Example Request:

```bash
curl "https://v2-explorer-api-sepolia.hop.exchange/v1/events?type=BundleSet"
```


### Example Response:

```json
{
  "events": [
    {
      "bundleId": "0x...10",
      "bundleRoot": "0x...20",
      "fromChainId": "1",
      "bundleIdTruncated": "0x...10",
      "bundleRootTruncated": "0x...20",
      "fromChainLabel": "Ethereum",
      "fromChainImageUrl": "https://example.com/images/ethereum.png",
      "context": {
        "key": "value"
      }
    }
  ]
}
```

## GET /v1/events - BundleReceived

> Retrieve `BundleReceived` events, including details about bundles, fees, and relay information across chains.

---

### Response:

| Parameters                      | Description                                                                                     |
| ------------------------------- | ----------------------------------------------------------------------------------------------- |
| `events`                        | An array of event objects containing the following fields:                                      |
| `bundleId`                      | (string) The unique identifier for the bundle.                                                 |
| `bundleRoot`                    | (string) The root hash of the bundle.                                                          |
| `bundleFees`                    | (string) The fees associated with the bundle.                                                  |
| `fromChainId`                   | (string) The ID of the originating chain.                                                      |
| `toChainId`                     | (string) The ID of the destination chain.                                                      |
| `relayWindowStart`              | (number) The start time of the relay window, represented as a UNIX timestamp.                  |
| `relayer`                       | (string) The address of the relayer.                                                           |
| `bundleIdTruncated`             | (string) A truncated version of the bundle ID.                                                 |
| `bundleRootTruncated`           | (string) A truncated version of the bundle root.                                               |
| `relayerTruncated`              | (string) A truncated version of the relayer's address.                                         |
| `fromChainLabel`                | (string) A user-friendly label for the originating chain.                                      |
| `fromChainImageUrl`             | (string) The URL to an image representing the originating chain.                               |
| `toChainLabel`                  | (string) A user-friendly label for the destination chain.                                      |
| `toChainImageUrl`               | (string) The URL to an image representing the destination chain.                               |
| `toChainColor`                  | (string) The color associated with the destination chain for visual representation.            |
| `bundleFeesDisplay`             | (string) A formatted display of the bundle fees.                                               |
| `context`                       | (object) Context information associated with the event.                                        |

---

### Example Request:

```bash
curl "https://v2-explorer-api-sepolia.hop.exchange/v1/events?type=BundleReceived"
```

### Example Response:

```json
{
  "events": [
    {
      "bundleId": "0x...11",
      "bundleRoot": "0x...21",
      "bundleFees": "500000",
      "fromChainId": "1",
      "toChainId": "2",
      "relayWindowStart": 1679862208,
      "relayer": "0x1234567890abcdef1234567890abcdef12345678",
      "bundleIdTruncated": "0x...11",
      "bundleRootTruncated": "0x...21",
      "relayerTruncated": "0x123...5678",
      "fromChainLabel": "Ethereum",
      "fromChainImageUrl": "https://example.com/images/ethereum.png",
      "toChainLabel": "Polygon",
      "toChainImageUrl": "https://example.com/images/polygon.png",
      "toChainColor": "#8247E5",
      "bundleFeesDisplay": "$500.00",
      "context": {
        "key": "value"
      }
    }
  ]
}
```

## GET /v1/events - BundleForwarded

> Retrieve `BundleForwarded` events, including details about forwarded bundles and the chains involved.

---

### Response:

| Parameters                      | Description                                                                                     |
| ------------------------------- | ----------------------------------------------------------------------------------------------- |
| `events`                        | An array of event objects containing the following fields:                                      |
| `bundleId`                      | (string) The unique identifier for the bundle.                                                 |
| `bundleRoot`                    | (string) The root hash of the bundle.                                                          |
| `fromChainId`                   | (string) The ID of the originating chain.                                                      |
| `toChainId`                     | (string) The ID of the destination chain.                                                      |
| `bundleIdTruncated`             | (string) A truncated version of the bundle ID.                                                 |
| `bundleRootTruncated`           | (string) A truncated version of the bundle root.                                               |
| `fromChainLabel`                | (string) A user-friendly label for the originating chain.                                      |
| `fromChainImageUrl`             | (string) The URL to an image representing the originating chain.                               |
| `toChainName`                   | (string) The name of the destination chain.                                                    |
| `toChainLabel`                  | (string) A user-friendly label for the destination chain.                                      |
| `toChainImageUrl`               | (string) The URL to an image representing the destination chain.                               |
| `toChainColor`                  | (string) The color associated with the destination chain for visual representation.            |
| `context`                       | (object) Context information associated with the event.                                        |

---

### Example Request:

```bash
curl "https://v2-explorer-api-sepolia.hop.exchange/v1/events?type=BundleForwarded"
```

### Example Response:

```json
{
  "events": [
    {
      "bundleId": "0x...12",
      "bundleRoot": "0x...22",
      "fromChainId": "1",
      "toChainId": "2",
      "bundleIdTruncated": "0x...12",
      "bundleRootTruncated": "0x...22",
      "fromChainLabel": "Ethereum",
      "fromChainImageUrl": "https://example.com/images/ethereum.png",
      "toChainName": "Polygon",
      "toChainLabel": "Polygon",
      "toChainImageUrl": "https://example.com/images/polygon.png",
      "toChainColor": "#8247E5",
      "context": {
        "key": "value"
      }
    }
  ]
}
```

## GET /v1/events - BundleCommitted

> Retrieve `BundleCommitted` events, including details about committed bundles, fees, and their destination chains.

---

### Response:

| Parameters                      | Description                                                                                     |
| ------------------------------- | ----------------------------------------------------------------------------------------------- |
| `events`                        | An array of event objects containing the following fields:                                      |
| `bundleId`                      | (string) The unique identifier for the committed bundle.                                       |
| `bundleRoot`                    | (string) The root hash of the committed bundle.                                                |
| `bundleFees`                    | (string) The fees associated with the committed bundle.                                        |
| `toChainId`                     | (string) The ID of the destination chain.                                                      |
| `commitTime`                    | (number) The UNIX timestamp of when the bundle was committed.                                  |
| `bundleIdTruncated`             | (string) A truncated version of the bundle ID.                                                 |
| `bundleRootTruncated`           | (string) A truncated version of the bundle root.                                               |
| `toChainLabel`                  | (string) A user-friendly label for the destination chain.                                      |
| `toChainImageUrl`               | (string) The URL to an image representing the destination chain.                               |
| `toChainColor`                  | (string) The color associated with the destination chain for visual representation.            |
| `bundleFeesDisplay`             | (string) A formatted display of the bundle fees.                                               |
| `context`                       | (object) Context information associated with the event.                                        |

---

### Example Request:

```bash
curl "https://v2-explorer-api-sepolia.hop.exchange/v1/events?type=BundleCommitted"
```

### Example Response:

```json
{
  "events": [
    {
      "bundleId": "0x...13",
      "bundleRoot": "0x...23",
      "bundleFees": "300000",
      "toChainId": "2",
      "commitTime": 1679862208,
      "bundleIdTruncated": "0x...13",
      "bundleRootTruncated": "0x...23",
      "toChainLabel": "Polygon",
      "toChainImageUrl": "https://example.com/images/polygon.png",
      "toChainColor": "#8247E5",
      "bundleFeesDisplay": "$300.00",
      "context": {
        "key": "value"
      }
    }
  ]
}
```

## GET /v1/explorer

> Retrieve events and their details for path-based token transfers, including hops, claims, and associated metadata.

---

### Response:

| Parameters                      | Description                                                                                     |
| ------------------------------- | ----------------------------------------------------------------------------------------------- |
| `events`                        | An array of event objects containing the following fields:                                      |
| `pathId`                        | (string) The unique identifier for the path.                                                   |
| `transferId`                    | (string) The unique identifier for the transfer.                                               |
| `to`                            | (string) The recipient's address.                                                              |
| `amountOut`                     | (string) The amount received by the recipient.                                                 |
| `totalSent`                     | (string) The total amount sent in the transfer.                                                |
| `totalClaims`                   | (string) The total amount claimed in the transfer.                                             |
| `hops`                          | An array of hop objects containing additional details (fields described below).                |
| `transferIdTruncated`           | (string) A truncated version of the transfer ID.                                               |
| `transferIdExplorerUrl`         | (string) The URL to the explorer page for the transfer.                                         |
| `pathIdTruncated`               | (string) A truncated version of the path ID.                                                   |
| `toTruncated`                   | (string) A truncated version of the recipient's address.                                       |
| `context`                       | (object) Context information associated with the event.                                        |

**Hop Object Fields:**

| Parameters                      | Description                                                                                     |
| ------------------------------- | ----------------------------------------------------------------------------------------------- |
| `index`                         | (number) The index of the hop in the transfer path.                                             |
| `pathId`                        | (string) The unique identifier for the path of the hop.                                         |
| `maxBonderFee`                  | (string) The maximum bonder fee for the hop.                                                    |
| `maxTotalSent`                  | (string) The maximum total sent for the hop.                                                   |
| `attestedClaimId`               | (string) The claim ID associated with the hop.                                                 |
| `pathIdTruncated`               | (string) A truncated version of the path ID.                                                   |
| `attestedClaimIdTruncated`      | (string) A truncated version of the attested claim ID.                                          |

---

### Example Request:

```bash
curl "https://v2-explorer-api-sepolia.hop.exchange/v1/explorer"
```

### Example Response:

```json
{
  "events": [
    {
      "pathId": "0x...14",
      "transferId": "0x...24",
      "to": "0x1234567890abcdef1234567890abcdef12345678",
      "amountOut": "1000000",
      "totalSent": "1100000",
      "totalClaims": "900000",
      "hops": [
        {
          "index": 0,
          "pathId": "0x...14",
          "maxBonderFee": "50000",
          "maxTotalSent": "1100000",
          "attestedClaimId": "0x...34",
          "pathIdTruncated": "0x...14",
          "attestedClaimIdTruncated": "0x...34"
        }
      ],
      "transferIdTruncated": "0x...24",
      "transferIdExplorerUrl": "https://etherscan.io/tx/0x...24",
      "pathIdTruncated": "0x...14",
      "toTruncated": "0x123...5678",
      "context": {
        "key": "value"
      }
    }
  ]
}
```

### Context Object Fields:

| Parameter                      | Type       | Description                                                                                     |
| ------------------------------ | ---------- | ----------------------------------------------------------------------------------------------- |
| `chainId`                      | `string`   | The ID of the chain where the transaction occurred.                                             |
| `transactionHash`              | `string`   | The unique hash of the transaction.                                                            |
| `transactionIndex`             | `number`   | The index of the transaction within the block.                                                 |
| `logIndex`                     | `number`   | The index of the log within the block.                                                         |
| `blockNumber`                  | `number`   | The block number where the transaction was included.                                           |
| `blockTimestamp`               | `number`   | The UNIX timestamp of when the block was mined.                                                |
| `from`                         | `string`   | The sender's address.                                                                          |
| `to`                           | `string`   | The recipient's address.                                                                       |
| `value`                        | `string`   | The value of the transaction in smallest denomination.                                         |
| `nonce`                        | `number`   | The nonce of the transaction.                                                                  |
| `gasLimit`                     | `number`   | The gas limit set for the transaction.                                                         |
| `gasUsed`                      | `number`   | The actual gas used for the transaction.                                                       |
| `gasPrice`                     | `string`   | The gas price for the transaction.                                                             |
| `status`                       | `number`   | The status of the transaction (e.g., 1 for success, 0 for failure).                            |
| `data`                         | `string`   | The data payload of the transaction.                                                           |
| `blockTimestampRelative`       | `string`   | A human-readable relative timestamp (e.g., "5 minutes ago").                                   |
| `transactionHashTruncated`     | `string`   | A truncated version of the transaction hash.                                                   |
| `transactionHashExplorerUrl`   | `string`   | A URL linking to the transaction hash on the chain explorer.                                   |
| `chainLabel`                   | `string`   | A user-friendly label for the chain.                                                           |
| `chainImageUrl`                | `string`   | The URL to an image representing the chain.                                                    |
| `chainColor`                   | `string`   | The color associated with the chain for visual representation.                                 |
| `fromExplorerUrl`              | `string`   | A URL linking to the sender's address on the chain explorer.                                   |
| `toExplorerUrl`                | `string`   | A URL linking to the recipient's address on the chain explorer.                                |
| `valueFormatted`               | `string`   | The value of the transaction formatted for easier readability.                                 |
| `valueDisplay`                 | `string`   | A formatted display version of the transaction value (e.g., "10.5 ETH").                      |

### Example Context Object:

```json
{
  "chainId": "1",
  "transactionHash": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
  "transactionIndex": 2,
  "logIndex": 5,
  "blockNumber": 17500000,
  "blockTimestamp": 1689862208,
  "from": "0x1234567890abcdef1234567890abcdef12345678",
  "to": "0xabcdef1234567890abcdef1234567890abcdef12",
  "value": "1000000000000000000",
  "nonce": 42,
  "gasLimit": 21000,
  "gasUsed": 21000,
  "gasPrice": "5000000000",
  "status": 1,
  "data": "0x",
  "blockTimestampRelative": "5 minutes ago",
  "transactionHashTruncated": "0xabcdef...7890",
  "transactionHashExplorerUrl": "https://etherscan.io/tx/0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
  "chainLabel": "Ethereum",
  "chainImageUrl": "https://example.com/images/ethereum.png",
  "chainColor": "#627EEA",
  "fromExplorerUrl": "https://etherscan.io/address/0x1234567890abcdef1234567890abcdef12345678",
  "toExplorerUrl": "https://etherscan.io/address/0xabcdef1234567890abcdef1234567890abcdef12",
  "valueFormatted": "1.0 ETH",
  "valueDisplay": "$1,900.00"
}
```

$## Pagination

### Request Query Parameters

| Parameter   | Type     | Default Value | Description                                                                                   |
| ----------- | -------- | ------------- | --------------------------------------------------------------------------------------------- |
| `page`      | `number` | 1             | The page number to fetch. The first page is `1`.                                              |
| `limit`     | `number` | 10            | The number of items to fetch per page. Must be between `1` and `10`.                          |
| `filter`    | `string` | -             | An optional filter to refine the results. |

## License

[MIT](LICENSE)
