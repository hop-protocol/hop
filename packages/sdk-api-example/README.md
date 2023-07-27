## Hop v1 SDK API Server Example

> An simple example of the Hop SDK wrapped as a REST API. Useful for devs that want to integrate the Hop SDK but don't use JavaScript.

## Usage

```sh
git clone git@github.com:hop-protocol/hop.git
cd hop/packages/sdk-api-example/
docker build -t server .
docker run --rm --name server -p 8000:8000 server
```

## Endpoints

## GET /v1/quote

Example request

```sh
curl "http://localhost:8000/v1/quote?amount=1&token=USDC&fromChain=polygon&toChain=gnosis&slippage=0.5"
```

Example response

```json
{"bonderFee":"250396","amountOutMin":"993444","estimatedRecieved":"748041"}
```

## GET /transfer-status

Example request

```sh
curl "http://localhost:8000/v1/transfer-status?token=USDC&transferId=0x5a15b2abd4d0f2e5d0ea3d5fc93758374b14940096487d70f7c95b5393fc9c89"
```

Example response

```json
{"transferId":"0x5a15b2abd4d0f2e5d0ea3d5fc93758374b14940096487d70f7c95b5393fc9c89","transactionHash":"0xbe6953dac8149e3f4d3a5719445170fb9835c461a980cbdaf9ad5cce10c9d27c", ... }
```

## GET /v1/build-tx

Example request

```sh
curl "http://localhost:8000/v1/build-tx?token=USDC&amount=1&fromChain=optimism&toChain=arbitrum&recipient=0x1234567899999999999999999999999999999999"
```

Example response

```json
{"tx":{"data":"0xeea0d7b2000000000000000000000000000000000000000000000000000000000000a4b1000000000000000000000000123456789999999999999999999999999999999900000000000000000000000000000000000000000000000000000000000f4240000000000000000000000000000000000000000000000000000000000008284e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006312951600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000063129516","to":"0x2ad09850b0CA4c7c1B33f5AcD6cBAbCaB5d6e796"}}
```

## GET /v1/approval/check-allowance

Example request

```sh
curl "http://localhost:8000/v1/approval/check-allowance?token=USDC&amount=1&fromChain=optimism&account=0x1234567899999999999999999999999999999999"
```

Example response

```json
{"needsApproval":true}
```

## GET /v1/approval/build-tx

Example request

```sh
curl "http://localhost:8000/v1/approval/build-tx?token=USDC&amount=1&fromChain=optimism"
```

Example response

```json
{"tx":{"data":"0x095ea7b30000000000000000000000002ad09850b0ca4c7c1b33f5acd6cbabcab5d6e79600000000000000000000000000000000000000000000000000000000000f4240","to":"0x7F5c764cBc14f9669B88837ca1490cCa17c31607"}}
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

## License

[MIT](LICENSE)
