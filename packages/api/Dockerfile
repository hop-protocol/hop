FROM node:20.10.0-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN pnpm --filter=@hop-protocol/core build
RUN pnpm --filter=@hop-protocol/sdk build
RUN pnpm --filter=@hop-protocol/api build
RUN pnpm --filter=@hop-protocol/api deploy --prod /prod/app

FROM base
COPY --from=build /prod/app /prod/app
WORKDIR /prod/app

CMD [ "node", "/prod/app/dist/index.js" ]
