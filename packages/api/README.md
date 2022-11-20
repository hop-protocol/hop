## Hop API

> A simple hop REST API for getting bonder fee estimates and transfer status.

## Usage

### Docker

```sh
docker pull hopprotocol/hop-api
docker run --rm --name hop-api --env-file docker.env -p 8000:8000 hopprotocol/hop-api
```

### From Source

```sh
git clone git@github.com:hop-protocol/hop.git
cd hop/packages/api/
docker build -t hop-api .
docker run --rm --name hop-api -p 8000:8000 hop-api
```

## Development

```sh
npm start
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
  "slippage": "0.5",
  "amountOutMin": "994836",
  "bonderFee": "250613",
  "estimatedRecieved": "749223"
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

## License

[MIT](LICENSE)
