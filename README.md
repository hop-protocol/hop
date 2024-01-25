# Hop v1 Monorepo

> The [Hop Protocol](https://hop.exchange/) v1 monorepo

## Packages

| Library                                                       | Current Version                                                                                                                                   | Description                                 |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [@hop-protocol/core](packages/core)                             | [![npm version](https://badge.fury.io/js/%40hop-protocol%2Fcore.svg)](https://badge.fury.io/js/)                                                   | Metadata and config                         |
| [@hop-protocol/sdk](packages/sdk)                             | [![npm version](https://badge.fury.io/js/%40hop-protocol%2Fsdk.svg)](https://badge.fury.io/js/)                                                   | TypeScript Hop SDK                          |


| Application                                                   | Current Version                                                                                                                                   | Description                                 |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [@hop-protocol/frontend](packages/frontend)                   | [![npm version](https://badge.fury.io/js/%40hop-protocol%2Ffrontend.svg)](https://badge.fury.io/js/%40hop-protocol%2Ffrontend)                    | React Frontend UI                           |
| [@hop-protocol/hop-node](packages/hop-node)                   | [![npm version](https://badge.fury.io/js/%40hop-protocol%2Fhop-node.svg)](https://badge.fury.io/js/%40hop-protocol%2Fhop-node)                    | TypeScript Hop Node                         |

## Quickstart

Install dependencies & link packages

```bash
npm install
npm run build
```

#### Guidelines for using NPM workspaces

All commands should be run from the root of the monorepo.

```bash
# Install a single package
npm install -w <package_name>

# Build a single package
npm run build -w <package_name>

# Run an NPM script in all packages
npm run build --workspaces

```

**If you are developing on a single package only and need to ignore the rest of the packages**, you need to install with `--include-workspace-root`. This is because the installation of a single package does not install the root’s dependencies, which are usually needed for building and linting.

```bash
npm install -w @<package_name> --include-workspace-root
```

## Contributing

See [./CONTRIBUTING.md](./CONTRIBUTING.md)

## License

[MIT](LICENSE)
