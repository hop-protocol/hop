#!/bin/bash

# echo output of subshells
set +x

# produce failure return code if any command fails in pipe
set -o pipefail

# capture payload data from stdin
payload=$(</dev/stdin)

# Define Github Constants
GITHUB_WORKFLOW_JOB_NAME="publish-docker ($DOCKER_IMAGE_NAME)"
GITHUB_WORKFLOW_JOB_STEP_NAME="Publish Docker Image (latest)"

# Extract branch and build status from payload
: '
The expected payload is from a workflow_job event triggered by GitHub.
The payload information can be found at https://docs.github.com/en/webhooks/webhook-events-and-payloads#workflow_job

action - The status of the chosen payload action, which is workflow_job in this case. This will be "completed" upon workflow finish, even if it failed.
workflow_job_name - Name of the workflow job.
workflow_job_conclusion - The result of a completed workflow job.
workflow_job_step_conclusion - The result of a completed step within a workflow job.
'
action=$(jq -r '.action' <<< "$payload")
workflow_job_name=$(jq -r '.workflow_job.name' <<< "$payload")
workflow_job_conclusion=$(jq -r '.workflow_job.conclusion' <<< "$payload")
workflow_job_step_conclusion=$(jq -r --arg step_name "$GITHUB_WORKFLOW_JOB_STEP_NAME" '.workflow_job.steps[] | select(.name == $step_name) | .conclusion' <<< "$payload")

if [[ "$action" == "completed" && \
      "$workflow_job_name" == "$GITHUB_WORKFLOW_JOB_NAME" && \
      "$workflow_job_conclusion" == "success" && \
      "$workflow_job_step_conclusion" == "success" ]]; then
  ./docker.sh >/dev/null 2>&1 &
  echo "Docker image ${DOCKER_IMAGE_NAME} restarted successfully."
else
  echo "Conditions not met, Docker image ${DOCKER_IMAGE_NAME} not restarted."
fi