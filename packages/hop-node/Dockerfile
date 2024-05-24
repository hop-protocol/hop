FROM node:20.12.2-slim AS base
ARG GIT_REV
ENV GIT_REV=${GIT_REV} PNPM_HOME="/pnpm" PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm --filter-prod=hop-node... install

RUN pnpm --filter=hop-node... build
RUN pnpm --filter=hop-node deploy --prod /prod/app

FROM base
COPY --from=build /prod/app /prod/app
WORKDIR /prod/app
ENTRYPOINT ["node", "/prod/app/dist/cli/cli.js"]
