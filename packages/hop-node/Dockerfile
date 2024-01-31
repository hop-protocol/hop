FROM node:20.10.0-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN pnpm --filter=@hop-protocol/core build && pnpm --filter=@hop-protocol/sdk build
RUN pnpm --filter=@hop-protocol/hop-node build
RUN pnpm --filter=@hop-protocol/hop-node deploy --prod /prod/app

FROM base
COPY --from=build /prod/app /prod/app
WORKDIR /prod/app

ARG GIT_REV
ENV GIT_REV=${GIT_REV}

CMD [ "node", "/prod/app/dist/cli/cli.js" ]
