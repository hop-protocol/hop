# Contributing

# Frontend

Thank you for your interest in contributing to the Hop frontend!🐰

## Development

Before running anything, you'll need to install the dependencies:

```sh
yarn install
```

### Running the interface locally

```sh
yarn dev
```

Navigate to [http://localhost:3000].

### Creating a production build

```sh
yarn build
```

### Guidelines

The following points should help guide your development:

- Security: the interface is safe to use
  - Avoid adding unnecessary dependencies due to [supply chain risk](https://github.com/LavaMoat/lavamoat#further-reading-on-software-supplychain-security)
- Reproducibility: anyone can build the interface
  - Avoid adding steps to the development/build processes
  - The build must be deterministic, i.e. a particular commit hash always produces the same build
- Decentralization: anyone can run the interface
  - An Ethereum node should be the only critical dependency
  - All other external dependencies should only enhance the UX ([graceful degradation](https://developer.mozilla.org/en-US/docs/Glossary/Graceful_degradation))
- Accessibility: anyone can use the interface
  - The interface should be responsive, small and also run well on low performance devices (majority of swaps on mobile!)

At the moment we're only considering bug fixes and small improvements. If you have a feature request, please open an issue first to discuss it.

### Release process

Releases are cut automatically from the `production` branch according to the [release workflow](./.github/workflows/deploy.yaml).

Fix pull requests should be merged whenever ready and tested.

Features should not be merged into `develop` until they are ready for users.
When building larger features or collaborating with other developers, create a new branch from `develop` to track its development.
When the feature is ready for review, create a new pull request from the feature branch into `develop` and request reviews from
the appropriate UX reviewers (PMs or designers).

### Finding a first issue

Start with issues with the label
[`good first issue`](https://github.com/Uniswap/uniswap-interface/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22).

