#/bin/env bash

curl -s "https://registry.npmjs.org/@hop-protocol/core/latest" | jq '.version'  > /tmp/core1.txt
cat package.json | jq '.dependencies."@hop-protocol/core"' > /tmp/core2.txt
diff /tmp/core1.txt /tmp/core2.txt || sleep 180

curl -s "https://registry.npmjs.org/@hop-protocol/sdk/latest" | jq '.version' > /tmp/sdk1.txt
cat package.json | jq '.dependencies."@hop-protocol/sdk"' > /tmp/sdk2.txt
diff /tmp/sdk1.txt /tmp/sdk2.txt || sleep 180
