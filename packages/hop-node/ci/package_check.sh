#/bin/env bash

npx npm info @hop-protocol/core --json | jq '."dist-tags".latest' > /tmp/core1.txt
cat ../package.json | jq '.dependencies."@hop-protocol/core"' > /tmp/core2.txt
diff /tmp/core1.txt /tmp/core2.txt || sleep 180

npx npm info @hop-protocol/sdk --json | jq '."dist-tags".latest' > /tmp/sdk1.txt
cat ../package.json | jq '.dependencies."@hop-protocol/sdk"' > /tmp/sdk2.txt
diff /tmp/sdk1.txt /tmp/sdk2.txt || sleep 180
