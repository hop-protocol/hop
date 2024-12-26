# Hop Monorepo

> The [Hop Protocol](https://hop.exchange/) monorepo

## Packages

### V1

| Lib/App | Current Version | Description |
| --- | --- |  --- |
[@hop-protocol/frontend](packages/frontend) | [![npm version](https://badge.fury.io/js/%40hop-protocol%2Ffrontend.svg)](https://badge.fury.io/js/) | React Frontend UI |
[@hop-protocol/sdk](packages/sdk) | [![npm version](https://badge.fury.io/js/%40hop-protocol%2Fsdk.svg)](https://badge.fury.io/js/) | V1 TypeScript Hop SDK |
[@hop-protocol/hop-node](packages/hop-node) | [![npm version](https://badge.fury.io/js/%40hop-protocol%2Fhop-node.svg)](https://badge.fury.io/js/) | TypeScript Hop Node |

### V2

| Lib/App | Current Version | Description |
| --- | --- |  --- |
[@hop-protocol/v2-sdk](packages/v2-sdk) | [![npm version](https://badge.fury.io/js/%40hop-protocol%2Fv2-sdk.svg)](https://badge.fury.io/js/) | V2 TypeScript Hop SDK |
[@hop-protocol/v2-hop-node](packages/v2-hop-node) | [![npm version](https://badge.fury.io/js/%40hop-protocol%2Fv2-hop-node.svg)](https://badge.fury.io/js/) | TypeScript Hop Node |

## Quickstart

The Hop monorepo uses [PNPM](https://pnpm.io/) for package and workspace management.

Install dependencies & link packages

```bash
pnpm install
pnpm build
```

#### Guidelines for using PNPM workspaces

All commands should be run from the root of the monorepo.

```bash
# Install a single package and its dependencies
pnpm --filter <package_name>... install

# Build a single package and its dependencies
pnpm --filter <package_name>... build

# Run a PNPM script in all packages
pnpm <script_name>

```

**If you are developing on a single package only and need to ignore the rest of the packages**, you need to install with `--include-workspace-root`. This is because the installation of a single package does not install the root’s dependencies, which are usually needed for building and linting.

```bash
pnpm --filter <package_name>... install --include-workspace-root
```

## Contributing

See [./CONTRIBUTING.md](./CONTRIBUTING.md)

## License

[MIT](LICENSE)
