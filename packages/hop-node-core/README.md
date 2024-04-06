# Hop Node Core

> Core functions of the Hop node.

This package is not expected to be used in isolation, but only as part of other Hop Node packages.

## Testing

Pull the `hop` monorepo and install dependencies using `pnpm`.

```sh
# Install the dependencies
pnpm install

# Build the required files
pnpm build
```

Test with the pnpm script.

```sh
pnpm --filter @hop-protocol/hop-node-core test
```

## License

[MIT](LICENSE)
