import { ChainSlug, NetworkSlug } from '@hop-protocol/sdk'

export type ArbitrumSuperchainSlugs = ChainSlug.Arbitrum | ChainSlug.Nova

type ArbitrumPrecompiles = {
  nodeInterfaceAddress: string
}

export type ArbitrumCanonicalAddresses = {
  sequencerInboxAddress: string
}

type ArbitrumSuperchainAddresses = {
  precompiles: ArbitrumPrecompiles
  canonicalAddresses: {
    [key in NetworkSlug]?: {
      [key in ArbitrumSuperchainSlugs]?: ArbitrumCanonicalAddresses
    }
  }
}

// TODO: Get these from the SDK
export const ArbitrumAddresses: ArbitrumSuperchainAddresses = {
  precompiles: {
    nodeInterfaceAddress: '0x00000000000000000000000000000000000000C8'
  },
  canonicalAddresses: {
    [NetworkSlug.Mainnet]: {
      [ChainSlug.Arbitrum]: {
        sequencerInboxAddress: '0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6'
      },
      [ChainSlug.Nova]: {
        sequencerInboxAddress: '0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b'
      }
    },
    [NetworkSlug.Goerli]: {
      [ChainSlug.Arbitrum]: {
        sequencerInboxAddress: '0x0484A87B144745A2E5b7c359552119B6EA2917A9'
      }
    },
    [NetworkSlug.Sepolia]: {
      [ChainSlug.Arbitrum]: {
        sequencerInboxAddress: '0x6c97864CE4bEf387dE0b3310A44230f7E3F1be0D'
      }
    }
  }
}
