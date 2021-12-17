import { Chain } from 'src/constants'

const isNativeToken = (network: Chain, token: string) => {
  token = token.toLowerCase()
  const isMainnet = token === 'eth' && network === Chain.Ethereum
  const isOptimism = token === 'eth' && network === Chain.Optimism
  const isArbitrum = token === 'eth' && network === Chain.Arbitrum
  const isMatic = token === 'matic' && network === Chain.Polygon
  const isxDai = token === 'xdai' && network === Chain.xDai
  return isMainnet || isOptimism || isArbitrum || isMatic || isxDai
}

export default isNativeToken
