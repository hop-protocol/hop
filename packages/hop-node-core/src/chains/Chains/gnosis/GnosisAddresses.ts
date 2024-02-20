import { Chain } from 'src/constants/index.js'
import { NetworkSlug } from '@hop-protocol/core/networks'

export type GnosisCanonicalAddresses = {
  l1AmbAddress: string
  l2AmbAddress: string
}

type GnosisAddressesType = {
  canonicalAddresses: {
    [key in NetworkSlug]?: {
      [Chain.Gnosis]: GnosisCanonicalAddresses
    }
  }
}

// TODO: Get these from the SDK
export const GnosisAddresses: GnosisAddressesType = {
  canonicalAddresses: {
    [NetworkSlug.Mainnet]: {
      [Chain.Gnosis]: {
        l1AmbAddress: '0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e',
        l2AmbAddress: '0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59'
      }
    }
  }
}
