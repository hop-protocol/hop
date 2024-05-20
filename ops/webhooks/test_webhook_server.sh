#!/bin/bash

mock_response='{"payload":{"reponame":"explorer","branch":"production-backend","build_parameters":{"CIRCLE_JOB":""},"outcome":"success","build_url":"https://app.circleci.com/jobs/github/hop-protocol/explorer/1"}}'

curl -X POST -H "X-Secret: $WEBHOOK_SECRET" -d $mock_response http://localhost:4665/postreceive
