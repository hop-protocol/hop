import { networks as goerli } from './goerli.js'
import { networks as mainnet } from './mainnet.js'
import { networks as sepolia } from './sepolia.js'

const networks = { goerli, sepolia, mainnet }
export { goerli, sepolia, mainnet, networks }

export {
  Network,
  Networks
} from './types.js'

export {
  NetworkSlug,
  ChainId,
  ChainName,
  ChainSlug,
  Slug,
  CanonicalToken,
  WrappedToken,
  NativeChainToken
} from './enums.js'
