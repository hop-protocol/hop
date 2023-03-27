#/bin/env bash

diff <(npx npm info @hop-protocol/core --json | jq '."dist-tags".latest') <(cat package.json | jq '.dependencies."@hop-protocol/core"') || sleep 180
diff <(npx npm info @hop-protocol/sdk --json | jq '."dist-tags".latest') <(cat package.json | jq '.dependencies."@hop-protocol/sdk"') || sleep 180
