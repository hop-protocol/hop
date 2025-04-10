FROM node:20.12.2-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable --version=0.30.0
COPY . /app
WORKDIR /app

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm --filter-prod=stats-worker... install --force
RUN pnpm --filter=stats-worker... build
RUN pnpm --filter=stats-worker deploy --prod /prod/app --legacy

FROM base
COPY --from=build /prod/app /prod/app
WORKDIR /prod/app

ENTRYPOINT ["node", "/prod/app/dist/index.js"]
