FROM node:14 AS build
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
RUN npm run build

FROM node:14
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=build /usr/src/app/dist /usr/src/app/dist
COPY --from=build /usr/src/app/static /usr/src/app/static
COPY --from=build /usr/src/app/public /usr/src/app/public
COPY --from=build /usr/src/app/package.json /usr/src/app/package.json
EXPOSE 3000
ENTRYPOINT ["/usr/local/bin/npm", "run"]
CMD ["start:dist"]
