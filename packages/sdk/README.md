# Hop v1 SDK

> The Hop Protocol v1 TypeScript SDK

[![Documentation](https://img.shields.io/badge/documentation-available-green.svg?style=flat)](https://docs.hop.exchange/v/developer-docs/js-sdk/js-sdk)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/@hop-protocol/sdk/master/LICENSE)
[![NPM version](https://badge.fury.io/js/%40hop-protocol%2Fsdk.svg)](https://badge.fury.io/js/%40hop-protocol%2Fsdk)
[![npm bundle size (scoped version)](https://img.shields.io/bundlephobia/minzip/@hop-protocol/sdk/latest.svg)](https://bundlephobia.com/result?p=@hop-protocol/sdk@latest)

## Demo

[https://sdk-demo.hop.exchange/](https://sdk-demo.hop.exchange/)

## Install

```bash
pnpm install @hop-protocol/sdk
```

## CDN

[jsDelivr CDN](https://cdn.jsdelivr.net/npm/@hop-protocol/sdk@latest/hop.js)

```html
<script src="https://cdn.jsdelivr.net/npm/@hop-protocol/sdk@latest/hop.js"></script>
```

[unpkg CDN](https://unpkg.com/@hop-protocol/sdk@latest/hop.js)

```html
<script src="https://unpkg.com/@hop-protocol/sdk@latest/hop.js"></script>
```

## Documentation

For getting started and examples, see [docs.hop.exchange/v/developer-docs/js-sdk/js-sdk](https://docs.hop.exchange/v/developer-docs/js-sdk/js-sdk)

For sdk API reference, see [hop-sdk-docs.netlify.app](https://hop-sdk-docs.netlify.app/)

## Development

Install dependencies

```bash
pnpm install
```

Run build watcher

```bash
pnpm run dev
```

Build sdk

```bash
pnpm run build
```

Generate documentation

```bash
pnpm run docs
```

Run github action build locally with [act](https://github.com/nektos/act):

```sh
(cd ../../ && act --job publish-sdk --workflows .github/workflows/npm_publish_sdk.yml --secret-file=.secrets --verbose)
```

## Test

```bash
pnpm test
```

## License

[MIT](LICENSE)
