#!/bin/bash

mock_response='{"payload":{"reponame":"explorer","branch":"production-backend","build_parameters":{"CIRCLE_JOB":""},"outcome":"success","build_url":"https://app.circleci.com/jobs/github/hop-protocol/explorer/420"}}'

curl -X POST -d $mock_response http://localhost:4665/postreceive
