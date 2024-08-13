import { ChainSlug, NetworkSlug } from '@hop-protocol/sdk'

export type OptimismSuperchainSlugs = ChainSlug.Optimism | ChainSlug.Base

type OptimismPrecompiles = {
  l1BlockSetterAddress: string
  l1BlockAddress: string
}

export type OptimismCanonicalAddresses = {
  batcherAddress: string
  batchInboxAddress: string
}

type OptimismSuperchainAddresses = {
  precompiles: OptimismPrecompiles
  canonicalAddresses: {
    [key in NetworkSlug]?: {
      [key in OptimismSuperchainSlugs]?: OptimismCanonicalAddresses
    }
  }
}

// TODO: Get these from the SDK
export const OptimismAddresses: OptimismSuperchainAddresses = {
  precompiles: {
    l1BlockSetterAddress: '0xdeaddeaddeaddeaddeaddeaddeaddeaddead0001',
    l1BlockAddress: '0x4200000000000000000000000000000000000015'
  },
  canonicalAddresses: {
    [NetworkSlug.Mainnet]: {
      [ChainSlug.Optimism]: {
        batcherAddress: '0x6887246668a3b87F54DeB3b94Ba47a6f63F32985',
        batchInboxAddress: '0xFF00000000000000000000000000000000000010'
      },
      [ChainSlug.Base]: {
        batcherAddress: '0x5050F69a9786F081509234F1a7F4684b5E5b76C9',
        batchInboxAddress: '0xFf00000000000000000000000000000000008453'
      }
    }
  }
}
