# Build Stage
FROM node:20.10.0-alpine AS build

# Set ARG and ENV for GIT_REV
ARG GIT_REV
ENV GIT_REV=${GIT_REV}

# Create the working directory and set ownership to 'node' user
WORKDIR /usr/src
RUN chown -R node:node /usr/src

# Switch to 'root' user
USER root

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

# Install and build
RUN npm install \
    && npm run build --workspace=@hop-protocol/api

# Production Stage
FROM node:20.10.0-alpine

# Set ARG and ENV for GIT_REV
ARG GIT_REV
ENV GIT_REV=${GIT_REV}

WORKDIR /usr/src

# Copy built files from the build stage
COPY --from=build /usr/src/packages/api/dist /dist

# Set the entry point
ENTRYPOINT ["node"]
CMD ["/dist/index.js"]
