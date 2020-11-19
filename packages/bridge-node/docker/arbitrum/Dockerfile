FROM ubuntu:20.04

RUN apt update
RUN apt install git curl python3.8 -y
RUN mkdir /.nvm
ENV NVM_DIR /.nvm
ENV NODE_VERSION 12
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.0/install.sh | bash && \
  . $NVM_DIR/nvm.sh && \
  nvm install $NODE_VERSION && \
  git clone https://github.com/offchainlabs/arbitrum && \
  cd arbitrum && \
  git checkout develop && \
  npm install -g yarn && \
  yarn install
