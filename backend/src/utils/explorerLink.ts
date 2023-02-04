import { isGoerli } from '../config'

// TODO: move to config
export function explorerLink (chain: string) {
  let base = ''
  if (chain === 'gnosis') {
    base = 'https://blockscout.com/xdai/mainnet'
  } else if (chain === 'polygon') {
    base = 'https://polygonscan.com'
    if (isGoerli) {
      base = 'https://mumbai.polygonscan.com'
    }
  } else if (chain === 'optimism') {
    base = 'https://optimistic.etherscan.io'
    if (isGoerli) {
      base = 'https://goerli-optimism.etherscan.io'
    }
  } else if (chain === 'arbitrum') {
    base = 'https://arbiscan.io'
    if (isGoerli) {
      base = 'https://goerli.arbiscan.io'
    }
  } else if (chain === 'nova') {
    base = 'https://nova.arbiscan.io'
  } else {
    base = 'https://etherscan.io'
    if (isGoerli) {
      base = 'https://goerli.etherscan.io'
    }
  }

  return base
}
