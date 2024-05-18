# Webhooks

Set up a webhook to auto-restart Docker processes on a server. The default script looks for the successful completion of a GitHub workflow that publishes a new Docker image with the `latest` tag.

# Instructions

### On GitHub

Set up a webhook [on GitHub](https://github.com/hop-protocol/hop/settings/hooks) to send a request to a webhook server.

### On the server

Ensure port `4665` can accept incoming requests.

- Set the `DOCKER_IMAGE_NAME` and `WEBHOOK_SECRET` envs in `~/.bashrc` and source it.
- Add the scripts in this repo to the server.
- Run the webhook server in the background with `./run_webhook_server.sh &`
