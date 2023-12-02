#!/bin/bash

if ! command -v wrk2 >/dev/null 2>&1; then
  if [ -f "/etc/arch-release" ]; then
    yay -S wrk2-git
  fi
fi

#URL="https://REDACTED.hop.exchange"
#URL="https://arb-mainnet.g.alchemy.com/v2/REDACTED"
URL="http://localhost:8000" # local proxy

wrk2 -t5 -c200 -d30s -R2000 -L -s payload.lua $URL
#wrk2 -t1 -c1 -d1s -R1 -L -s payload.lua $URL
