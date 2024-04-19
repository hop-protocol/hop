FROM node:20.12.2-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN pnpm --filter=sdk-core build
RUN pnpm --filter=sdk build
RUN pnpm --filter=explorer-backend build
RUN pnpm --filter=explorer-backend deploy --prod /prod/app

FROM base
COPY --from=build /prod/app /prod/app
WORKDIR /prod/app

ENTRYPOINT ["node", "/prod/app/dist/index.js"]
