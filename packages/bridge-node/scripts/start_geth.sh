#!/bin/env bash

(
  cd ~/go/src/github.com/ethereum/go-ethereum;
 ./build/bin/geth \
    --http \
    --http.addr "0.0.0.0" \
    --http.corsdomain "*"
)
