#/bin/env bash

HOSTNAME=api-beta.gitbook.com
OWNER_ID=lH1Nr7OHuVPG9P52uqrLG2RTtqo1
SPACE_ID=-MOYaoULYuKq7wLWewmU
PAGE=js-sdk/api-reference
CONTENT="$(cat docs/README.md | perl -p -e 's/\((#.*?)\)/(https:\/\/docs.hop.exchange\/js-sdk\1)/g' | perl -p -e 's/<a name="\w+"><\/a>//g' | perl -p -e 's/\\+/\\\\/g' | sed ':a;N;$!ba;s/\n/\\n/g' | tr '`' '\`')"

# get user info
#curl https://$HOSTNAME/v1/user -H "Authorization: Bearer $GITBOOK_TOKEN"

# get spaces
#curl https://$HOSTNAME/v1/owners/$OWNER_ID/spaces -H "Authorization: Bearer $GITBOOK_TOKEN"

# read content
#curl https://$HOSTNAME/v1/spaces/$SPACE_ID/content/v/master/url/$PAGE -H "Authorization: Bearer $GITBOOK_TOKEN"

# update content
JSON=$(cat <<EOF
{
    "title": "API Reference",
    "document": {
        "transforms": [
            {
                "transform": "replace",
                "fragment": {
                    "markdown": "$CONTENT"
                }
            }
        ]
    }
}
EOF
)

if [ -z $GITBOOK_TOKEN ]; then
  echo 'environment variable "GITBOOK_TOKEN" is required'
  exit 1
fi

echo "sending request"
curl https://$HOSTNAME/v1/spaces/$SPACE_ID/content/v/master/url/$PAGE -H "Authorization: Bearer $GITBOOK_TOKEN" \
    -H "Content-Type: application/json" \
    --data-binary "$JSON"
