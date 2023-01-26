import * as hopMetadata from '@hop-protocol/core/metadata'

export const metadata: any = {
  tokens: {
    kovan: hopMetadata.kovan.tokens,
    goerli: hopMetadata.goerli.tokens,
    mainnet: hopMetadata.mainnet.tokens,
    staging: hopMetadata.mainnet.tokens
  },
  networks: {
    ethereum: {
      name: hopMetadata.chains.ethereum.name,
      isLayer1: true,
      nativeTokenSymbol: hopMetadata.chains.ethereum.nativeTokenSymbol
    },
    arbitrum: {
      name: hopMetadata.chains.arbitrum.name,
      isLayer1: false,
      nativeTokenSymbol: hopMetadata.chains.arbitrum.nativeTokenSymbol
    },
    optimism: {
      name: hopMetadata.chains.optimism.name,
      isLayer1: false,
      nativeTokenSymbol: hopMetadata.chains.optimism.nativeTokenSymbol
    },
    gnosis: {
      name: hopMetadata.chains.gnosis.name,
      isLayer1: false,
      nativeTokenSymbol: hopMetadata.chains.gnosis.nativeTokenSymbol
    },
    polygon: {
      name: hopMetadata.chains.polygon.name,
      isLayer1: false,
      nativeTokenSymbol: hopMetadata.chains.polygon.nativeTokenSymbol
    },
    nova: {
      name: hopMetadata.chains.nova.name,
      isLayer1: false,
      nativeTokenSymbol: hopMetadata.chains.nova.nativeTokenSymbol
    },
    zksync: {
      name: hopMetadata.chains.zksync.name,
      isLayer1: false,
      nativeTokenSymbol: hopMetadata.chains.zksync.nativeTokenSymbol
    },
    consensyszk: {
      name: hopMetadata.chains.consensyszk.name,
      isLayer1: false,
      nativeTokenSymbol: hopMetadata.chains.consensyszk.nativeTokenSymbol
    }
  }
}
