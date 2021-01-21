Create `docker-compose.env` with the following variables:

```
ETH1_HTTP=https://kovan.rpc.authereum.com
L1_NODE_WEB3_URL=https://kovan.rpc.authereum.com
L1_WALLET_KEY=0xYOUR_PRIVATE_KEY
```

Start verifier:

```bash
./docker.sh up
```

Stop verifier:

```bash
./docker.sh down
```

Optimism Kovan RPC URL:

```
https://kovan.optimism.rpc.hop.exchange
```
