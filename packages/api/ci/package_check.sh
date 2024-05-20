#/bin/env bash

curl -s "https://registry.npmjs.org/@hop-protocol/sdk/latest" | jq '.version' > /tmp/sdk1.txt
cat package.json | jq '.dependencies."@hop-protocol/sdk"' > /tmp/sdk2.txt
diff /tmp/sdk1.txt /tmp/sdk2.txt || sleep 180
