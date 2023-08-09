#!/bin/bash

# echo output of subshells
set +x

# produce failure return code if any command fails in pipe
set -o pipefail

# capture payload data from stdin
payload=$(</dev/stdin)

botname=ServerBot

function slack_notify() {
  if [ -z "$SLACK_WEBHOOK_URL" ]; then
    echo "ERROR: SLACK_WEBHOOK_URL not set"
    exit 1
  fi

  result="$1"
  retVal=$?
  if [ $retVal -ne 0 ]; then
    /usr/local/bin/slackpost -w "$SLACK_WEBHOOK_URL" -c "$SLACK_CHANNEL" -u "$botname" -m "Error updating $branch server docker image.\n$result" -a danger -i penguin
  else
    /usr/local/bin/slackpost -w "$SLACK_WEBHOOK_URL" -c "$SLACK_CHANNEL" -u "$botname" -m "Updated $branch server docker image.\n$result" -a good -i penguin
  fi

  exit $retVal
}

echo "received payload"
echo "$payload" | jq '.' | cat

branch=$(echo "$payload" | jq -r '.payload.branch')
build_status=$(echo "$payload" | jq -r '.payload.outcome')

if [ "$branch" = "production-backend" ] || [ "$branch" = "goerli-backend" ]; then
  if [ "$build_status" = "success" ]; then
    # call prod script
    result=$(./docker.sh 2>&1)
    # slack_notify "$result"
  fi
fi
