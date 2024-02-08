#!/bin/bash

# exit immediately if a command exits with a non-zero status
set -e

# produce failure return code if any command fails in pipe
set -o pipefail

release_url=$(curl -s https://api.github.com/repos/hop-protocol/go-webhook-server/releases/latest | grep "browser_download_url.*linux_amd64.tar.gz" | cut -d : -f 2,3 | tr -d \")

(
  cd /tmp
  wget $release_url -O gws.tar.gz

  tar -xvzf gws.tar.gz gws
  chmod +x gws
  sudo mv gws /usr/local/bin/gws
  rm -rf gws gws.tar.gz
  echo "Installed in $(which gws)"
)
