## Hop v1 API

> A simple hop REST API for getting bonder fee estimates and transfer status. This is a wrapper around the hop JS sdk.

## Usage

### Docker

```sh
docker pull hopprotocol/hop-api
docker run --rm --name hop-api -p 8000:8000 hopprotocol/hop-api
```

### From Source

```sh
git clone git@github.com:hop-protocol/hop.git
cd hop/packages/api/
docker build -t hop-api .
docker run --rm --name hop-api -p 8000:8000 hop-api
```

## Endpoints

## GET /v1/quote

Example request

```sh
curl "http://localhost:8000/v1/quote?amount=1000000&token=USDC&fromChain=polygon&toChain=gnosis&slippage=0.5"
```

Example response

```json
{
  "amountIn": "1000000",
  "slippage": 0.5,
  "amountOutMin": "743633",
  "destinationAmountOutMin": "742915",
  "bonderFee": "250515",
  "estimatedRecieved": "747908",
  "deadline": 1679862208,
  "destinationDeadline": 1679862208
}
```

## GET /v1/transfer-status

Example request

```sh
curl "http://localhost:8000/v1/transfer-status?transferId=0x5a15b2abd4d0f2e5d0ea3d5fc93758374b14940096487d70f7c95b5393fc9c89"
```

Example response

```json
{
  "transferId": "0x5a15b2abd4d0f2e5d0ea3d5fc93758374b14940096487d70f7c95b5393fc9c89",
  "transactionHash": "0xbe6953dac8149e3f4d3a5719445170fb9835c461a980cbdaf9ad5cce10c9d27c",
  "sourceChainId": 10,
  "sourceChainSlug": "optimism",
  "destinationChainId": 42161,
  "destinationChainSlug": "arbitrum",
  "accountAddress": "0xd813a52b1158fc08f69ba52ca72ca4360e255ba3",
  "amount": "2996498",
  "amountFormatted": 2.996498,
  "amountUsd": 3.004011668430896,
  "amountOutMin": "2502392",
  "deadline": 1662159408,
  "recipientAddress": "0xd813a52b1158fc08f69ba52ca72ca4360e255ba3",
  "bonderFee": "479123",
  "bonderFeeFormatted": 0.479123,
  "bonderFeeUsd": 0.4803243928791597,
  "bonded": true,
  "bondTransactionHash": "0x659225113a0711d73bd576d2edb916b1031d4fb3e422a08ee8e0f863c4fb5af7",
  "bonderAddress": "0xa6a688f107851131f0e1dce493ebbebfaf99203e",
  "token": "USDC",
  "timestamp": 1661554612
}
```

## GET /v1/available-routes

Example request

```sh
curl "http://localhost:8000/v1/available-routes"
```

Example response

```sh
[
  {
    "token": "USDC",
    "sourceChain": "ethereum",
    "sourceChainId": 1,
    "destinationChain": "gnosis",
    "destinationChainId": 100
  },
  {
    "token": "ETH",
    "sourceChain": "base",
    "sourceChainId": 8453,
    "destinationChain": "arbitrum",
    "destinationChainId": 42161
  },
  ...
]
```

## Development

Install dependencies

```sh
npm install
```

Start server

```sh
npm start
```

Build

```sh
npm run build
```

Available environment variables:

```sh
PORT=8000
IP_RATE_LIMIT_REQ_PER_SEC=100
IP_RATE_LIMIT_WINDOW_MS=1000
RESPONSE_CACHE_DURATION_MS=10000
```

### Github Actions

Run github action build locally with [act](https://github.com/nektos/act):

```sh
(cd ../../ && act --job build-hop-api --workflows .github/workflows/hop_api.yml --secret-file=.secrets --verbose)
```

## License

[MIT](LICENSE)
