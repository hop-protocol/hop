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
{"amountIn":"1000000","amountOutMin":"994836","bonderFee":"250613","estimatedRecieved":"749223"}
```

## GET /v1/transfer-status

Example request

```sh
curl "http://localhost:8000/v1/transfer-status?transferId=0x5a15b2abd4d0f2e5d0ea3d5fc93758374b14940096487d70f7c95b5393fc9c89"
```

Example response

```json
{"transferId":"0x5a15b2abd4d0f2e5d0ea3d5fc93758374b14940096487d70f7c95b5393fc9c89","transactionHash":"0xbe6953dac8149e3f4d3a5719445170fb9835c461a980cbdaf9ad5cce10c9d27c", ... }
```

## License

[MIT](LICENSE)
