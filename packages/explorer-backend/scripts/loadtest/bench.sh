#!/bin/bash

if ! command -v wrk2 >/dev/null 2>&1; then
  if [ -f "/etc/arch-release" ]; then
    yay -S wrk2-git
  fi
fi

wrk2 -t5 -c200 -d30s -R2000 -s payload.lua "https://explorer-api.hop.exchange/v1/transfers?perPage=100&startDate=2022-06-01&endDate=2022-06-05"
