FROM node:11.15.0

# Create the working directory and give node use permissions
RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app

WORKDIR /usr/src/app

USER node

COPY --chown=node:node package*.json ./
COPY --chown=node:node . .

RUN npm install
RUN npm run build

ENTRYPOINT [ "./bin/hop-node" ]
CMD [ "bonder" ]
