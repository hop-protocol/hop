import { goerliNetworks, mainnetNetworks } from '../config/networks/index.js'
import { providers } from 'ethers'

export function getProvider (network: string, chainId: number) {
  let rpcUrl : string
  if (network === 'goerli') {
    rpcUrl = (goerliNetworks as any)[chainId]?.publicRpcUrl
  } else if (network === 'mainnet') {
    rpcUrl = (mainnetNetworks as any)[chainId]?.publicRpcUrl
  } else {
    throw new Error(`Invalid network: ${network}`)
  }

  if (!rpcUrl) {
    throw new Error(`Invalid chainId: ${chainId}`)
  }

  return new providers.JsonRpcProvider(rpcUrl)
}
