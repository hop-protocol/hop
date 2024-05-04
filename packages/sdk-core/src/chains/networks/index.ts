import { type Networks, NetworkSlug} from '../types.js'
import { chains as mainnetChains } from '../networks/mainnet.js'
import { chains as goerliChains } from '../networks/goerli.js'
import { chains as sepoliaChains } from '../networks/sepolia.js'

export const networks: Networks = {
  [NetworkSlug.Mainnet]: {
    slug: NetworkSlug.Mainnet,
    isMainnet: true,
    chains: mainnetChains
  },
  [NetworkSlug.Goerli]: {
    slug: NetworkSlug.Goerli,
    isMainnet: false,
    chains: goerliChains
  },
  [NetworkSlug.Sepolia]: {
    slug: NetworkSlug.Sepolia,
    isMainnet: false,
    chains: sepoliaChains
  }
}
