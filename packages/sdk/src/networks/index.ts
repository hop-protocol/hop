export enum HToken {
  hETH = 'hETH',
  hMATIC = 'hMATIC',
  hUSDC = 'hUSDC',
  hUSDT = 'hUSDT',
  hDAI = 'hDAI',
  hHop = 'hHOP',
  hrETH = 'hrETH',
  hUNI = 'hUNI',
  hMAGIC = 'hMAGIC'
}

export {
  goerli, sepolia, mainnet, networks,
  Network,
  Networks,
  NetworkSlug,
  ChainId,
  ChainName,
  ChainSlug,
  Slug,
  CanonicalToken,
  WrappedToken,
  NativeChainToken
} from '@hop-protocol/sdk-core/networks'
