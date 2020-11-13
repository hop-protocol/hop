#!/bin/env bash

HOSTNAME=${HOSTNAME:-0.0.0.0}
PORT=${PORT:-9545}
NETWORK_ID=${NETWORK_ID:-420}
VOLUME_PATH=${VOLUME_PATH:-/home/mota/go/src/github.com/ethereum-optimism/go-ethereum/da-test-chain-dir}

TARGET_GAS_LIMIT=${TARGET_GAS_LIMIT:-8000000}

ETH1_CTC_DEPLOYMENT_HEIGHT=${ETH1_CTC_DEPLOYMENT_HEIGHT-:0}
ETH1_ADDRESS_RESOLVER_ADDRESS=${ETH1_ADDRESS_RESOLVER_ADDRESS:-0x0000000000000000000000000000000000000000}
ETH1_CHAINID=${ETH1_CHAINID:-1}
ETH1_NETWORKID=${ETH1_NETWORKID:-1}
ETH_HTTP_ENDPOINT=${ETH_HTTP_ENDPOINT:-"https://mainnet.rpc.authereum.com"}

(
  cd ~/go/src/github.com/ethereum-optimism/go-ethereum;
  rm -rf da-test-chain-dir && ./build/bin/geth \
    --datadir $VOLUME_PATH \
    --rpc \
    --dev \
    --rpcaddr $HOSTNAME \
    --rpcvhosts='*' \
    --rpccorsdomain "*" \
    --rpcport $PORT \
    --rpcapi 'eth,net,rollup' \
    --wsport 9546 \
    --graphql.port 9547 \
    --networkid $NETWORK_ID \
    --rpcapi 'eth,net' \
    --gasprice '0' \
    --targetgaslimit $TARGET_GAS_LIMIT \
    --nousb \
    --gcmode=archive \
    --verbosity "6" \
    --rollup.verifier \
    --eth1.syncservice \
    --eth1.ctcdeploymentheight $ETH1_CTC_DEPLOYMENT_HEIGHT \
    --eth1.addressresolveraddress $ETH1_ADDRESS_RESOLVER_ADDRESS \
    --eth1.chainid $ETH1_CHAINID \
    --eth1.networkid $ETH1_NETWORKID \
    --eth1.http $ETH_HTTP_ENDPOINT
)
