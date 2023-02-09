import { Chain } from 'src/constants'

const isNativeToken = (network: Chain, token: string) => {
  token = token.toUpperCase()
  const isMainnet = token === 'ETH' && network === Chain.Ethereum
  const isOptimism = token === 'ETH' && network === Chain.Optimism
  const isArbitrum = token === 'ETH' && network === Chain.Arbitrum
  const isZkSync = token === 'ETH' && network === Chain.ZkSync
  const isConsenSysZk = token === 'ETH' && network === Chain.ConsenSysZk
  const isNova = token === 'ETH' && network === Chain.Nova
  const isMatic = token === 'MATIC' && network === Chain.Polygon
  const isGnosis = token === 'XDAI' && network === Chain.Gnosis
  return isMainnet || isOptimism || isArbitrum || isMatic || isGnosis || isNova || isZkSync || isConsenSysZk
}

export default isNativeToken
