# Build Stage
FROM node:20.10.0 AS build

# Set ARG and ENV for GIT_REV
ARG GIT_REV
ENV GIT_REV=${GIT_REV}

# Create the working directory and set ownership to 'node' user
WORKDIR /usr/src
RUN chown -R node:node /usr/src

# Install required global commands to build @eth-optimism packages
RUN npm install -g pnpm@latest only-allow@latest

# Switch to 'node' user
USER node

# Copy necessary files for installation
COPY --chown=node:node package*.json ./
COPY --chown=node:node .eslintrc.js ./
COPY --chown=node:node tsconfig.json ./
COPY --chown=node:node .npmrc ./
COPY --chown=node:node packages packages

# Install root dependencies and build specific package
RUN npm install \
    && npm run build --workspace=@hop-protocol/hop-node

# Production Stage
FROM node:20.10.0-alpine

# Set ARG and ENV for GIT_REV
ARG GIT_REV
ENV GIT_REV=${GIT_REV}

# Create the working directory
WORKDIR /usr/src

# Copy necessary files from build stage
COPY --from=build /usr/src/packages/hop-node/bin /bin

# Set the entry point
ENTRYPOINT ["/bin/hop-node"]
CMD []
