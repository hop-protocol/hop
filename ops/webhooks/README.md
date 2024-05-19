# Webhooks

Set up a webhook to auto-restart Docker processes on a server. The default script looks for the successful completion of a GitHub workflow that publishes a new Docker image with the `latest` tag.

# Instructions

### On GitHub

Set up a webhook [on GitHub](https://github.com/hop-protocol/hop/settings/hooks) to send a request to a webhook server.

### On the server

- Set up the environment
  - Set the `DOCKER_IMAGE_NAME` and `WEBHOOK_SECRET` envs in `~/.bashrc` and source it.
  - Ensure port `4665` can accept incoming requests.
- Installation
  - Add the appropriate files from this directory to the server and make them executable with `chmod +x`
  - Run `./install_webhook_server.sh`
  - Run `/.install-_dependencies.sh`
- Run the webhook server in the background with `./run_webhook_server.sh &`

Ensure that you have a `docker.sh` executable file in the directly where these files are being executed.

To stop the webhook server, run `./stop_webhook_server.sh`.
