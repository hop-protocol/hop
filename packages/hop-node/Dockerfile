# Build Stage
FROM node:20.10.0 AS build

# Set ARG and ENV for GIT_REV
ARG GIT_REV
ENV GIT_REV=${GIT_REV}

# Update package list and install jq
RUN apt-get update && apt-get install -y jq

# Update NPM
RUN npm install -g npm@latest

## Install pnpm (required to build @eth-optimism packages)
RUN npm install -g pnpm@latest
RUN npm install -g only-allow@latest

# Create the working directory
WORKDIR /usr/src

# Change ownership to 'node' user for security
RUN chown -R node:node /usr/src

# Switch to 'node' user
USER node

# Copy the monorepo files into the Docker image
COPY --chown=node:node package*.json ./
COPY --chown=node:node .eslintrc.js ./
COPY --chown=node:node tsconfig.json ./
COPY --chown=node:node .npmrc ./
COPY --chown=node:node packages packages

# Install root dependencies
RUN npm install

# Build specific package
RUN npm run build --workspace=@hop-protocol/hop-node

# Set the entry point
ENTRYPOINT ["/usr/src/packages/hop-node/bin/hop-node"]
CMD []
