FROM node:15.0.1

# Create the working directory and give node use permissions
RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app

WORKDIR /usr/src/app

USER node

COPY --chown=node:node package*.json ./

RUN npm install || true

COPY --chown=node:node . .

RUN npm run build

ENTRYPOINT [ "./bin/bridge-node" ]
CMD [ "bonder" ]
