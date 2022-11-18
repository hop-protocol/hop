#!/bin/bash

HOST="https://api.hop.exchange"
PATH="/v1/quote?amount=1000000&token=USDC&fromChain=polygon&toChain=gnosis&slippage=0.5"
#PATH="/health"
URL="$HOST$PATH"

/bin/wrk2 -t5 -c200 -d30s -R2000 -s payload.lua "$URL"
