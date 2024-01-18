# Build Stage
FROM node:20.10.0 AS build

# Set ARG and ENV for GIT_REV
ARG GIT_REV
ENV GIT_REV=${GIT_REV}

# Create the working directory and change ownership
WORKDIR /usr/src
RUN chown -R node:node /usr/src

# Install pnpm and only-allow as global dependencies
RUN npm install -g pnpm@latest only-allow@latest

# Switch to 'node' user for better security
USER node

# Copy necessary files for installation
COPY --chown=node:node package*.json .eslintrc.js tsconfig.json .npmrc ./

# Copy the monorepo files into the Docker image
COPY --chown=node:node packages packages

# Install root dependencies
RUN npm install

# Build specific package
RUN npm run build --workspace=@hop-protocol/stats-worker

# Production Stage
FROM node:20.10.0-alpine

# Set working directory
WORKDIR /usr/src

# Copy built files from the build stage
COPY --from=build /usr/src/packages/stats-worker /app/packages/stats-worker
COPY --from=build /usr/src/node_modules /app/node_modules

# Set the entry point
ENTRYPOINT ["/app/packages/stats-worker/bin/stats"]
CMD []
