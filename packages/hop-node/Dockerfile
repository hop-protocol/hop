FROM node:14 AS build

ARG GIT_REV
ENV GIT_REV=${GIT_REV}

# Create the working directory and give node use permissions
RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app

WORKDIR /usr/src/app
USER node
COPY --chown=node:node *.json ./
COPY --chown=node:node . .
RUN npm install
RUN npm run build

FROM node:14-alpine
WORKDIR /usr/src/app
USER node
COPY --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=build /usr/src/app/dist /usr/src/app/dist
COPY --from=build /usr/src/app/bin /usr/src/app/bin
COPY --from=build /usr/src/app/*.json /usr/src/app/
ENTRYPOINT [ "/usr/src/app/bin/hop-node" ]
CMD []
