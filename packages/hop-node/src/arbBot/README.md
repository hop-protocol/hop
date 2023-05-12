# ArbBot

> Run arb bots to balance AMM pools

### Config example


```json
{
  "linea": {
    "enabled": true,
    "dryMode": false,
    "network": "goerli",
    "l1ChainSlug": "ethereum",
    "l2ChainSlug": "linea",
    "tokenSymbol": "ETH",
    "amount": 3000,
    "slippageTolerance": 5,
    "pollIntervalSeconds": 600,
    "ammDepositThresholdAmount": 1000,
    "waitConfirmations": 4
  },
  "base": {
    "enabled": true,
    "dryMode": false,
    "network": "goerli",
    "l1ChainSlug": "ethereum",
    "l2ChainSlug": "base",
    "tokenSymbol": "ETH",
    "amount": 100,
    "slippageTolerance": 5,
    "pollIntervalSeconds": 600,
    "ammDepositThresholdAmount": 50,
    "waitConfirmations": 4
  }
}
```

Environment variables example

```sh
ARB_BOT_LINEA_PRIVATE_KEY=123...
ARB_BOT_BASE_PRIVATE_KEY=456...
```

The `_LINEA_` and `_BASE_` labels here should match the `"linea"` and `"base"` labels respectively used in config. The labels can be any arbitrary string value.

### Running

Running arb bot with hop node process:

```
./bin/node --config ~/.hop-node/config.json --arb-bot=true --arb-bot-config=arb-bot-config.json
```

Running arb bot without hop node process:

```
./bin/node arb-bot --config ~/.hop-node/config.json --arb-bot-config=arb-bot-config.json
```
